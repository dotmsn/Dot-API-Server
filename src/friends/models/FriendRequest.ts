import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/models/user";

@ObjectType()
@Schema()
export class FriendRequest {
  @Field(() => ID )
  _id: string;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  from: User;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  to: User;
}

export type FriendRequestDocument = FriendRequest & Document;
export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
