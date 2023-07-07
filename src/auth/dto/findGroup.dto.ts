import { IsOptional, IsString } from "class-validator";

export class FindGroupDto{
  @IsString()
  @IsOptional()
  groupName: string;

  @IsString()
  @IsOptional()
  dn: string;
}