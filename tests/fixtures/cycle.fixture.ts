/* tslint:disable:max-line-length */
import { ObjectId } from "mongodb";

export const cycle1 = {
    _id: new ObjectId("5af585eedccd6600137334a8"),
    title: "Release 1.0",
    description: "Release 1.0",
    projectId: new ObjectId("5af582d1dccd6600137334a0"),
    testCases: [
        new ObjectId("5b0bcde84c2ed900134a4c67")
    ],
    status: "Abandoned",
    extraFields: [
        {
            title: "Processor",
            type: "String",
            key: "processor"
        },
        {
            title: "Coordinator",
            type: "String",
            key: "coordinator"
        }
    ],
    streamProcessor: "release/6.3_dev",
    coordinator: "release/4.2.2",
    updatedAt: new Date("2019-02-13T14:57:55.347Z"),
    createdAt: new Date("2018-10-21T15:23:13.809Z"),
    remarks: null,
    user: {
        _id: "5b5078dece99551ac9008dbb",
        username: "admin",
        iat: 1532000485,
        exp: 1791200485
    }
};

export const cycle2 = {
    _id: new ObjectId("5be1ba80631ce91bc1399aa6"),
    title: "FefeCy",
    description: "efse",
    projectId: new ObjectId("5be1b3ace2d59d118e628a78"),
    testCases: [
        new ObjectId("5be1b6d0631ce91bc1399aa4"),
        new ObjectId("5be1b86bc58a2a98e266519f")
    ],
    status: "Active",
    extraFields: [
        {
            title: "fenve",
            type: "String",
            key: "fenve"
        },
        {
            title: "gasega",
            type: "String",
            key: "gasega"
        }
    ],
    fenve: "",
    gasega: "",
    remarks: "remarks1",
    createdAt: new Date("2018-10-21T15:23:13.809Z"),
    updatedAt: new Date("2018-12-20T15:22:44.795Z")
};
