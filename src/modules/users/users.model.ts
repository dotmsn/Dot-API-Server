import * as bcrypt from "bcrypt";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HookNextFunction, Document, Types } from "mongoose";
import { decryptString, encryptString, generateKeyPair } from "../../utils/encryption.utils";

@ObjectType()
@Schema()
export class PublicProfile {
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop()
    displayName: string;

    @Field({ nullable: true })
    @Prop()
    bio?: string;

    @Field()
    @Prop()
    publicKey: string;
}

@ObjectType()
@Schema()
export class User extends PublicProfile {
    @Field()
    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Field()
    @Prop()
    privateKey: string;

    @Field(() => [PublicProfile])
    @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
    friends: User[];

    comparePassword: (passwordCandidate: string) => Promise<boolean>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<User | null>;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: HookNextFunction) {
    const user = this as UserDocument;

    // Check if public and private key is already set or create if not.
    if (user.publicKey == null || user.privateKey == null) {
        const pair = await generateKeyPair();
        user.publicKey = pair.publicKey;
        user.privateKey = encryptString(user.password, pair.privateKey);
    }

    // Check if the password field is modified.
    if (!user.isModified('password')) {
        // Else, return.
        return next();
    }

    // Generate salt and hash the user password with it.
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    // Replace the password with the hash.
    user.password = hash;

    return next();
});

UserSchema.methods.comparePassword = async function (passwordCandidate: string) {
    const user = this as UserDocument;
    return bcrypt.compare(passwordCandidate, user.password)
}

UserSchema.methods.changePassword = async function (oldPassword: string, newPassword: string): Promise<User | null> {
    const user = this as UserDocument;
    if (!user.comparePassword(oldPassword)) {
        return null;
    }

    const decryptedPrivateKey = decryptString(oldPassword, user.privateKey);
    const encryptedPrivateKey = encryptString(newPassword, decryptedPrivateKey);

    user.privateKey = encryptedPrivateKey;
    user.password = newPassword;
    return await user.save();
}
