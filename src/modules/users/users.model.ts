import * as bcrypt from "bcrypt";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HookNextFunction } from "mongoose";

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
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: HookNextFunction) {
    try {
        if (this.isModified('password')) {
            const hashed = await bcrypt.hash(this['password'], 10);
            this['password'] = hashed;
        }

        next();
    } catch (e) {
        return next(e);
    }
});
