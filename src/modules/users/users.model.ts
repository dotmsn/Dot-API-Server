import * as bcrypt from "bcrypt";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HookNextFunction, Document } from "mongoose";

@ObjectType()
@Schema()
export class User {
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop({ required: true, trim: true })
    displayName: string;

    @Field({ nullable: true })
    @Prop()
    bio: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    comparePassword: (passwordCandidate: string) => Promise<boolean>;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.pre('save', async function (next: HookNextFunction) {
    let user = this as UserDocument;

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
    console.log(user.password)
    return bcrypt.compare(passwordCandidate, user.password)
}
