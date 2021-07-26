import { SchemaFactory } from '@nestjs/mongoose';
import { User } from '../users/users.model';
import { Document, Types } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class FriendRequest {
    @Field(() => ID)
    _id: string;

    @Field(() => String)
    @Prop({type: Types.ObjectId, ref: User.name})
    from: string;

    @Field(() => String)
    @Prop({type: Types.ObjectId, ref: User.name})
    to: string;
}

export type FriendRequestDocument = FriendRequest & Document;
export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
