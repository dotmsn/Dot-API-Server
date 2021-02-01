import * as bcrypt from 'bcrypt';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HookNextFunction } from 'mongoose';

@ObjectType()
@Schema()
export class User {
    @Field(() => ID)
    _id: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Field()
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: HookNextFunction) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        const hashed = await bcrypt.hash(this['password'], 10);
        this['password'] = hashed;
        return next();
    } catch (e) {
        return next(e);
    }
});
