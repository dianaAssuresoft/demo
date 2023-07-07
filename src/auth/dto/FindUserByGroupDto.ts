import { IsEmail, IsString } from "class-validator";

export class FindUserByGroupDto {
    @IsString()
    query: string;
}