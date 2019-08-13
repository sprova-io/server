import { isArray, isObject } from 'lodash';
import {
    DeleteWriteOpResultObject,
    InsertOneWriteOpResult, InsertWriteOpResult,
    ObjectId, UpdateWriteOpResult
} from "mongodb";
import {
    FormatDeleteResult,
    FormatInsertManyResult, FormatInsertResult,
    FormatResponse,
    FormatUpdateResult
} from "./responses";

/**
 * Formats output of mongodb insertOne document result
 *
 * @param {*} response Respone form mongodb
 */
export const formatInsertOne = (response: InsertOneWriteOpResult): FormatInsertResult => {
    const result: FormatInsertResult = { ok: false };
    if (response && response.result) {
        result.ok = response.result.ok === 1;
        result._id = response.insertedId;
    }

    return result;
};

/**
 * Formats output of mongodb formatInsertMany document result
 *
 * @param {*} response Respone form mongodb
 */
export const formatInsertMany = (response: InsertWriteOpResult): FormatInsertManyResult => {
    const result: FormatInsertManyResult = { ok: false };
    if (response && response.result) {
        result.ok = response.result.ok === 1;
        result._ids = Object.values(response.insertedIds);
    }

    return result;
};

/**
 * Formats output of mongodb updateOne document result
 *
 * @param {*} response Respone form mongodb
 * @param {String|ObjectId} _id ID of document
 */
export const formatUpdate = (response: UpdateWriteOpResult, _id: ObjectId): FormatUpdateResult => {
    const result: FormatUpdateResult = { _id, ok: false };
    if (response && response.result) {
        result.ok = response.result.ok === 1;
    }

    return result;
};

/**
 * Formats output of mongodb remove document result
 *
 * @param {*} response Respone form mongodb
 * @param {String|ObjectId} _id ID of document
 */
export const formatDelete = (response: DeleteWriteOpResultObject, _id: ObjectId): FormatDeleteResult => {
    const result: FormatDeleteResult = { _id, ok: false };
    if (response && response.result) {
        result.ok = response.result.ok === 1;
    }

    return result;
};

/**
 * Changes property values of the format valueId to mongo ObjectId value.
 * This is useful for search and query functions. Functions returns a
 * copy of the original value.
 *
 * Example
 *
 * { "projectId": "5af582d1dccd6600137334a0"}
 *
 * Will be converted to
 * { "projectId": ObjectId("5af582d1dccd6600137334a0")}
 *
 * @param {*} value object with ID values
 */
export const formatIDs = (value: any) => {
    const result = Object.assign({}, value);
    const keys = Object.keys(value);
    for (const key of keys) {
        if ((key.endsWith('Id') || key.endsWith('Ids') || key === '_id') && isValidObjectId(result[key])) {
            result[key] = new ObjectId(result[key]);
        } else if (key.endsWith('Id') && result[key] === 'null') {
            result[key] = null;
        } else if (isObject(result[key]) && !isArray(result[key])
            && key !== 'inheritedFrom' && !(result[key] instanceof Date)) {
            result[key] = formatIDs(result[key]);
        } else if (isArray(result[key])) {
            result[key] = result[key].map((e: any) => formatIDs(e));
        }
    }

    return result;
};

/**
 * Return formatted error response with message
 *
 * @param message ErrorResponse
 */
export const errorWithMessage = (message: string): FormatResponse => {
    return { ok: false, message };
};

/**
 * Test if string is valid Object Id in 24 byte format.
 *
 * @param {string} value ObjectId string representation
 */
function isValidObjectId(value: any) {
    let result = true;
    result = result && value !== undefined;
    result = result && value !== null;
    result = result && value.length === 24;
    result = result && value === value.toLowerCase();
    result = result && ObjectId.isValid(value);

    return result;
}
