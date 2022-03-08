import Query from './query';
import { fromTemplateLiteral } from './literal';
import {startingClauses} from './constants';

export const query = new Query(startingClauses);
export const sql = (pieces, ...values) => fromTemplateLiteral(pieces, values);
