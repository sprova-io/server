import {
    DeleteWriteOpResultObject,
    InsertOneWriteOpResult, InsertWriteOpResult,
    ObjectId, UpdateWriteOpResult
} from "mongodb";
import { FormatDeleteResult, FormatInsertManyResult, FormatInsertResult, FormatUpdateResult } from "./responses";

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
