interface IUser {
    _id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string | 'ADMIN' | 'EDITOR' | 'RUNNER';
}

export default IUser;
