import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/models/user';

@ObjectType()
@Schema()
export class Channel {
    @Field(() => ID)
    _id: string;

    @Field(() => [User])
    @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
    participants!: User[];

    @Field()
    @Prop({ required: true })
    type: string;
}

export type ChannelDocument = Channel & Document;
export const ChannelSchema = SchemaFactory.createForClass(Channel);
