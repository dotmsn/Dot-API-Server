import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/models/user';
import { Channel } from '../../channel/models/channel';

@ObjectType()
@Schema()
export class Message {
    @Field(() => ID)
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    author: User;

    @Field()
    @Prop({ required: true })
    content: string;

    @Field(() => Channel)
    @Prop({ type: Types.ObjectId, ref: Channel.name, required: true })
    channel: Channel;

    @Field({ nullable: true })
    @Prop({ default: false })
    edited: boolean;

    @Prop({ type: String, required: true })
    channelId: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
    readedBy!: User[];
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
