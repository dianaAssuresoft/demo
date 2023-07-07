import { IsEmail, IsString } from "class-validator";

export class UserExistsDto {
    @IsString()
    username: string;
}