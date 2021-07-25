import { CreateUserDto } from './dto/CreateUser.dto';
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./users.model";
import { Model, ObjectId } from "mongoose";
import UpdateUserDto from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {}

    /**
     * Get a user by their Email
     * @param {string} email User Email to search.
     * @returns { Promise<User | undefined> } Returns a promise that resolves to a user or null.
     */
    public getByEmail(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
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
     * Create a new user and saves it to the database.
     * @param { CreateUserDto } payload Parameters to save in the new user to create.
     * @returns { Promise<User> } Returns a promise that resolves to a user
     */
     public async create (payload: CreateUserDto): Promise<User> {
        if (await this.getByEmail(payload.email)) {
            throw new BadRequestException("EMAIL_ALREADY_IN_USE", "This email is already in use.");
        }

        const user = new this.userModel(payload);
        await user.save();
        return user;
    }

    public async update (userID: string, payload: UpdateUserDto): Promise<User> {
        if (payload.email && await this.getByEmail(payload.email)) {
            throw new BadRequestException("EMAIL_ALREADY_IN_USE", "This email is already in use.");
        }

        await this.userModel.findByIdAndUpdate(userID, payload);
        return this.userModel.findById(userID);
    }
}
