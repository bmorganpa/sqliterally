export const copy = o =>
	Object.keys(o).reduce((newObject, key) => ((newObject[key] = o[key].slice()), newObject), {});
