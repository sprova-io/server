import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { IResponseMessage } from '@/utils/responses';
import { IUser } from "../models";
import dbm from '../utils/db';
import log from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'you-hacker!';

class AuthorizationService {
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
            return { ok: false, message: 'Username cannot be empty' };
        }
        if (!password) {
            return { ok: false, message: 'Password cannot be empty' };
        }

        const user = await this.Users.findOne({ username });
        if (!user) {
            return { ok: false, message: 'Username not found' };
        } else if (user.password !== sha512(password, JWT_SECRET)) {
            return { ok: false, message: 'Incorrect password' };
        } else {
            delete user.password;
        }

        return { ok: true, content: user, message: 'Successfully authenticated' };
    }

    /**
     * Sign up for access to sprova
     *
     * @param username
     * @param password
     */
    public async signUp(user: IUser): Promise<IValidationResponse> {

        if (!user.username) {
            return { ok: false, message: 'Username cannot be empty' };
        }
        if (!user.password) {
            return { ok: false, message: 'Password cannot be empty' };
        }
        if (!user.email) {
            return { ok: false, message: 'E-mail cannot be empty' };
        }

        try {
            const userExists = await this.Users.findOne({ username: user.username });
            const emailExists = await this.Users.findOne({ email: user.email });

            if (userExists) {
                return { ok: false, message: 'Username already taken' };
            } else if (emailExists) {
                return { ok: false, message: 'E-mail already taken' };
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
                const successfullyAddedUser = newUserInsertResponse.result.ok === 1;
                return {
                    ok: successfullyAddedUser,
                    message: successfullyAddedUser ?
                        'Successfully signed up. Waiting for Response.' : 'Error signing up'
                };
            }
        } catch (e) {
            return {
                ok: false, message: e
            };
        }

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

export interface IValidationResponse extends IResponseMessage {
    content?: IUser;
}

export default new AuthorizationService();
