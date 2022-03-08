import {STRINGIFY, ADDTOCLAUSE} from './constants';

export function fromTemplateLiteral(pieces = [''], values = [], delimiter = '') {
		return new Literal(
			pieces
				.flatMap((element, index) => {
					const value = values[index];
					if (value instanceof Literal) {
						return [element, value]
					} else if (index < values.length) {
						return [element, new SqlParameter(value)]
					} else {
						return element
					}
				})
		);
}

class SqlParameter {
	constructor(value) {
		this.value = value
	}
}

export default class Literal {
	constructor(tokens) {
		this.tokens = tokens
	}

	append(literal, delimiter = '') {
		return new Literal([...this.tokens, literal])
	}

	prefix(string = '') {
		return new Literal([string, ...this.tokens])
	}

	suffix(string = '') {
		return append(string)
	}

	[STRINGIFY](type = 'pg') {
		return this.tokens.reduce((acc, token, i) => {
			if (typeof token === "string") {
				return acc + token
			} else if (token instanceof SqlParameter) {
				return acc + (type == 'pg' ? '$' + Math.ceil(i / 2) : '?')
			} else if (token instanceof Literal) {
				return acc + token[STRINGIFY](type)
			} else {
				throw Error(`Unable to handle token: ${token}`)
			}
		});
	}

	get text() {
		return this[STRINGIFY]('pg');
	}

	get sql() {
		return this[STRINGIFY]('mysql');
	}

	get values() {
		return this.tokens
			.flatMap((token) => {
				if (typeof token === "string") {
					return []
				} else if (token instanceof SqlParameter) {
					return token.value;
				} else if (token instanceof Literal) {
					return token.values;
				} else {
					throw Error(`Unable to handle token: ${token}`)
				}
			})
	}
}
