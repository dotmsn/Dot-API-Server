import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UpdatePasswordDto {
    @Field(() => String)
    oldPassword: string;

    @Field(() => String)
    newPassword: string;
}
