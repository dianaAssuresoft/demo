import { IsEmail, IsString } from "class-validator";

export class GetUsersForGroupDto {
    @IsString()
    grupo: string;   
}