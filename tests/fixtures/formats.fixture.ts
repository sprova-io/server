import { ObjectId } from "bson";

export const insertOneResponse1 = {
    result: { n: 1, ok: 1 },
    connection: { id: 0, host: "localhost", port: 44423 },
    ops: [{
        _id: new ObjectId("5af582d1dccd6600137334a0")
    }],
    insertedCount: 1,
    insertedId: new ObjectId("5af582d1dccd6600137334a0"),
    n: 1,
    ok: 1
};

export const insertOneNegativeResponse1 = {
    result: { n: 0, ok: 0 },
    connection: { id: 0, host: "localhost", port: 44423 },
    ops: [{
        _id: new ObjectId("5af582d1dccd6600137334a0")
    }],
    insertedCount: 1,
    insertedId: new ObjectId("5af582d1dccd6600137334a0")
};
