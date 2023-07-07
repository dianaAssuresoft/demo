import { IsEmail, IsString } from "class-validator";

export class FindDeletedObjectsDto {

    @IsString()
    url: string;
}