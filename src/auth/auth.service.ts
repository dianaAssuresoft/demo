import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { SigninUserDto } from './dto/loginUser.dto';
import * as bycrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto){
    try {

      const {password, ...userData} = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(signinUserDto: SigninUserDto){
    const { password, email } = signinUserDto;
    const user = await this.userRepository.findOneBy({ email });
    console.log(user)
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!bycrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;

    // const pyload = { username: user.username, sub: user.userid };
    // return {
    //   access_token: await this.jwtService.signAsync(pyload),
    // };
  }

}
