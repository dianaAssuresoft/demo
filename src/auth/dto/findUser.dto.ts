import { IsOptional, IsString } from "class-validator";

export class FindUserDto {
    @IsString()
    @IsOptional()
    userPrincipalName? : string;

    @IsString()
    @IsOptional()
    dn?: string;

    @IsString()
    @IsOptional()
    sAMAccountName?: string;
}