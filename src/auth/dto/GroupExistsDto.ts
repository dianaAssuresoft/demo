import { IsEmail, IsString } from "class-validator";

export class GroupExistsDto {
    @IsString()
    grupo: string;
}