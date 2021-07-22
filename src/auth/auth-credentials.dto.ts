import { IsString, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(1)
    @MinLength(32)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(256)
    password: string;
}
