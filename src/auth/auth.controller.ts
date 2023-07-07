import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/loginUser.dto';
import { IsUserMemberOfDto } from './dto/isUserMemberOf.dto';
import { FindUserDto } from './dto/findUser.dto';
import { FindGroupDto } from './dto/findGroup.dto';
import { FindUserByGroupDto } from './dto/FindUserByGroupDto';
import { FindDeletedObjectsDto } from './dto/FindDeletedObjectsDto';
import { GetGroupMembershipForGroupDto } from './dto/GetGroupMembershipForGroupDto';
import { GetGroupMembershipForUserDto } from './dto/GetGroupMembershipForUserDto';
import { GetUsersForGroupDto } from './dto/GetUsersForGroupDto';
import { GroupExistsDto } from './dto/GroupExistsDto';
import { UserExistsDto } from './dto/UserExistsDto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto ){
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(200)
  @Post('signin')
  signIn(@Body() signinUserDto: SigninUserDto){
    return this.authService.signIn(signinUserDto);
  }

  @HttpCode(200)
  @Post('active-directory')
  signInActiveDirectory(@Body() signinUserDto: SigninUserDto){
    return this.authService.signInActiveDirectory(signinUserDto);
  }

  @HttpCode(200)
  @Post('activeDirectory/isUserMemberOf')
  isUserMemberOf(@Body() isUserMemberOfDto: IsUserMemberOfDto){
    return this.authService.isUserMemberOfAD(isUserMemberOfDto);
  }

  @HttpCode(200)
  @Post('activeDirectory/findUser')
  findUser(@Body() findUserDto: FindUserDto){
    return this.authService.findUser(findUserDto);
  }
  
  @HttpCode(200)
  @Post('activeDirectory/findGroup')
  findGroup(@Body() findGroupDto: FindGroupDto){
    return this.authService.findGroup(findGroupDto);
  }

  @Post('find-deleted')
  findDeleteObjects(@Body() findDeletedObjectsDto: FindDeletedObjectsDto){
    return this.authService.findDeletedObjects(findDeletedObjectsDto);
  }

  @Post('find-group')
  findGroup2(@Body() findUserByGroupDto: FindUserByGroupDto){
    return this.authService.findGroups(findUserByGroupDto);
  }

  @Post('group-membership-group')
  getGroupMemberShipForGroup(@Body() getGroupMembershipForGroupDto: GetGroupMembershipForGroupDto){
    return this.authService.getGroupMembershipForGroup(getGroupMembershipForGroupDto);
  }

  @Post('group-membership-user')
  getGroupMemberShipForUser(@Body() getGroupMembershipForUserDto: GetGroupMembershipForUserDto){
    return this.authService.getGroupMembershipForUser(getGroupMembershipForUserDto);
  }
  //falta de aqui en adelante
  @Post('user-x-group')
  getUsersForGroup(@Body() getUsersForGroupDto: GetUsersForGroupDto){
    return this.authService.getUsersForGroup(getUsersForGroupDto);
  }

  @Post('group-exists')
  groupExists(@Body() groupExistsDto: GroupExistsDto){
    return this.authService.groupExists(groupExistsDto);
  }

  @Post('user-exists')
  userExists(@Body() userExistsDto: UserExistsDto){
    return this.authService.userExists(userExistsDto);
  }
}
