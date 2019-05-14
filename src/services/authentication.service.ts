import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { IUser } from "../models";
import dbm from '../utils/db';
import log from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'you-hacker!';

class AuthenticationService {
    public Users: any;

    public async load() {
        this.Users = await dbm.getCollection('users');
        log.info("Successfully loaded Authenticator");
    }

    /**
     * Validate username and password authentication
     *
     * @param username
     * @param password
     */
    public async validate(username: string, password: string): Promise<IValidationResponse> {

        if (!username) {
            return { ok: 0, message: 'Username cannot be empty' };
        }
        if (!password) {
            return { ok: 0, message: 'Password cannot be empty' };
        }

        const user = await this.Users.findOne({ username });
        if (!user) {
            return { ok: 0, message: 'Username not found' };
        } else if (user.password !== sha512(password, JWT_SECRET)) {
            return { ok: 0, message: 'Incorrect password' };
        } else {
            delete user.password;
        }

        return { ok: 1, content: user, message: 'Successfully authenticated' };
    }

    /**
     * Sign up for access to sprova
     *
     * @param username
     * @param password
     */
    public async signUp(user: IUser): Promise<IValidationResponse> {

        if (!user.username) {
            return { ok: 0, message: 'Username cannot be empty' };
        }
        if (!user.password) {
            return { ok: 0, message: 'Password cannot be empty' };
        }
        if (!user.email) {
            return { ok: 0, message: 'E-mail cannot be empty' };
        }

        const userExists = await this.Users.findOne({ username: user.username });
        const emailExists = await this.Users.findOne({ usemailername: user.email });

        if (userExists) {
            return { ok: 0, message: 'Username already taken' };
        } else if (emailExists) {
            return { ok: 0, message: 'E-mail already taken' };
        } else {
            const newUser: IUser = {
                username: user.username,
                password: user.password,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                status: 'SIGNUP',
                role: 'SIGNUP'
            };
            const newUserInsertResponse = await this.Users.insertOne(newUser);
        }

        return { ok: 1, content: user, message: 'Successfully signed up. Waiting for Response.' };
    }

    /**
     * Build JWT token to use for API authentication
     *
     * @param user user model containing user details
     * @param secret JWT secret to sign the token
     * @param expiresIn default 365 days
     */
    public buildJwtToken(user: IUser, secret: string, expiresIn: string = '365d') {
        const body = {
            token: jwt.sign(
                {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                    firstname: user.firstname,
                    lastname: user.lastname
                },
                secret, // JWT secret
                {
                    expiresIn
                }),
            message: "Successfully logged in"
        };
        return body;
    }

}

/**
 * Applies hash algorithm with optional key to password and returns hash value.
 *
 * @param {*} password
 * @param {*} key
 * @returns {string}
 */
export const sha512 = (password: string, key = JWT_SECRET) => {
    const hash = crypto.createHmac('sha512', key);
    hash.update(password);
    return hash.digest('hex');
};

export interface IValidationResponse {
    ok: number;
    content?: IUser;
    message: string;
}

export default new AuthenticationService();
