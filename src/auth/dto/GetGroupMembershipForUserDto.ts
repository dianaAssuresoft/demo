import { IsEmail, IsString } from "class-validator";

export class GetGroupMembershipForUserDto {
    @IsString()
    sAMAccountName: string;
}