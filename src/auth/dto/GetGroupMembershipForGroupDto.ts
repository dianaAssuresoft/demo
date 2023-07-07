import { IsEmail, IsString } from "class-validator";

export class GetGroupMembershipForGroupDto {
    @IsString()
    groupName: string;
}