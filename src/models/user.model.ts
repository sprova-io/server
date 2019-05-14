import { ObjectId } from "bson";

interface IUser {
    _id?: ObjectId;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    status: string | 'SIGNUP' | 'ACTIVE' | 'INACTIVE' | 'DELETED';
    role: string | 'SIGNUP' | 'ADMIN' | 'EDITOR' | 'RUNNER';
}

export default IUser;
