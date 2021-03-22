import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User, UserDocument } from './models/user';

import { CreateUserInput, UpdateUserInput } from './user.inputs';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        private readonly mailService: MailService,
    ) {}

    /**
     * Create a new user and saves it to the database.
     * @param { CreateUserInput } payload Parameters to save in the new user to create.
     * @returns { Promise<User> } Returns a promise that resolves to a user
     */
    public async create(payload: CreateUserInput): Promise<User> {
        payload.email = payload.email.toLowerCase();
        payload.username = payload.username.toLowerCase();

        const user = new this.userModel(payload);
        await user.save();

        this.mailService.sendRegisterConfirm(user);

        return user;
    }

    /**
     * Get a user by their Email
     * @param {string} email User Email to search.
     * @returns { Promise<User | undefined> } Returns a promise that resolves to a user or null.
     */
    public getByEmail(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email: email.toLowerCase() }).exec();
    }

    /**
     * Get a user by their Token
     * @param {string} token User Token to search.
     * @returns { Promise<User | undefined> } Returns a promise that resolves to a user or null.
     */
    public getByToken(token: string): Promise<User | undefined> {
        return this.userModel.findOne({ confirm_token: token }).exec();
    }

    /**
     * Get a user by their ID
     * @param {string} id User ID to search.
     * @returns { Promise<User | undefined> } Returns a promise that resolves to a user or null.
     */
    public getByID(id: string): Promise<User | undefined> {
        return this.userModel.findOne({ _id: id }).exec();
    }

    /**
     * Get a user by their Username
     * @param {string} username Username to search.
     * @returns { Promise<User | undefined> } Returns a promise that resolves to a user or null.
     */
    public getByUsername(username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username }).exec();
    }

    /**
     * Update a user by their ID
     * @param { string} id User ID to update
     * @param { UpdateUserInput } payload Parameters to modify
     * @returns { Promise<User | undefined> } Returns a promise that resolves to a user or null.
     */
    public update(
        id: string,
        payload: UpdateUserInput,
    ): Promise<User | undefined> {
        return this.userModel
            .findByIdAndUpdate(id, payload, {
                new: false,
            })
            .exec();
    }

    public async confirm(id: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({_id: id});
        user.confirmed = true;
        user.confirm_token = null;

        return user.save()
    }

    public sendConfirmEmail (user: User): Promise<boolean> {
      return this.mailService.sendRegisterConfirm(user);
    }

    /**
     * Delete a user by their ID
     * @param { Types.ObjectId } _id User ID to delete.
     * @returns { Promise<User>} Returns a promise that resolve the deleted user.
     */
    public delete(_id: Types.ObjectId): Promise<User> {
        return this.userModel.findByIdAndDelete(_id).exec();
    }
}
