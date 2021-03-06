import { ObjectId } from "mongodb";

export interface ResponseMessage {
    ok: boolean;
    message: string;
}

export interface FormatResponse {
    ok: boolean;
    message?: any;
}

export interface FormatInsertResult extends FormatResponse {
    _id?: ObjectId;
}

export interface FormatInsertManyResult extends FormatResponse {
    _ids?: ObjectId[];
}

export interface FormatDeleteResult extends FormatResponse {
    _id: ObjectId;
}

export interface FormatUpdateResult extends FormatResponse {
    _id: ObjectId;
}
