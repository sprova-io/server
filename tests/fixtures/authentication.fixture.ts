/* tslint:disable:max-line-length */
import { ObjectId } from "mongodb";

export let adminUser = {
    _id: new ObjectId("5ae05f37dda5971dc20c9e21"),
    username: "admin",
    password: "2d42e05ff293686030a2d87df4c4f770af20f997cedf6c082f61dc6ccefffac7d8dd646884f6fb33abb836b955f8b7a30020c1dd20cbd3c7e0944f3497eb84a7",
    firstname: "Administrator",
    lastname: "Administrator",
    status: "ACTIVE",
    email: "admin",
    role: "ADMIN",
    createdAt: new Date("2018-01-01T11:11:11.111Z")
};

export let signUpUser = {
    _id: new ObjectId("5ae05f37dda5971dc20c9e22"),
    username: "bob",
    password: "2d42e05ff293686030a2d87df4c4f770af20f997cedf6c082f61dc6ccefffac7d8dd646884f6fb33abb836b955f8b7a30020c1dd20cbd3c7e0944f3497eb84a7",
    firstname: "bob",
    lastname: "aliceson",
    status: "SIGNUP",
    email: "bob@aliceson",
    role: "SIGNUP",
    createdAt: new Date("2018-01-01T11:11:11.111Z")
};
