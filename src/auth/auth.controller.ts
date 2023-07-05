import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/loginUser.dto';
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
  @Post('active')
  signInActiveDirectory(@Body() signinUserDto: SigninUserDto){
    return this.authService.signInActiveDirectory(signinUserDto);
  }

}
