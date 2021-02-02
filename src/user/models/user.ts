import * as bcrypt from 'bcrypt';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HookNextFunction } from 'mongoose';
import { randomString } from 'src/utils/random.utils';

@ObjectType()
@Schema()
export class User {
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Field()
    @Prop({ default: null })
    confirm_token: string;

    @Field()
    @Prop({ default: false })
    confirmed: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: HookNextFunction) {
    try {
        const confirmToken = this['confirm_token'];
        const confirmed = this['confirmed'];
        if (!confirmed && confirmToken == null) {
            this['confirm_token'] = randomString(32);
        }

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
