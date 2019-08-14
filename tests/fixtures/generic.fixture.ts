/* tslint:disable:max-line-length */
import { ObjectId } from "mongodb";

export const generic1 = {
    _id: new ObjectId("5af582d1dfff6600137334a0"),
    cycleFields: [
        {
            title: "Component 1",
            type: "String",
            key: "component1"
        },
        {
            title: "Component 2",
            type: "String",
            key: "component2"
        }
    ],
    description: "Best app so far",
    projectId: new ObjectId("5c1ce4593fff150012a9fae1"),
    testCaseFields: [
        {
            title: "Jira ID",
            type: "String",
            key: "jiraId"
        }
    ],
    title: "Best App",
    updatedAt: new Date("2018-12-21T13:02:17.796Z")
};

export const generic2 = {
    _id: new ObjectId("5bc9a01fff2ed900134a7efe"),
    cycleFields: [
        {
            title: "s1",
            type: "String",
            key: "s1"
        },
        {
            title: "s2",
            type: "String",
            key: "s2"
        },
        {
            title: "s3",
            type: "String",
            key: "s3"
        }
    ],
    description: "Next Project",
    projectId: new ObjectId("5c1b6ccbfff30b0012a040a2"),
    testCaseFields: [
        {
            title: "Jira ID",
            type: "String",
            key: "jiraId"
        }
    ],
    title: "Next Project",
    updatedAt: new Date("2018-12-20T10:19:55.596Z")
};
