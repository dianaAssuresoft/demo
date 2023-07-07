import { IsString } from "class-validator";

export class IsUserMemberOfDto {
    @IsString()
    username : string;

    @IsString()
    groupName: string;   
}