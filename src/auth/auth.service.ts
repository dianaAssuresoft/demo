import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { SigninUserDto } from './dto/loginUser.dto';
import * as bycrypt from 'bcrypt';
import ActiveDirectory from 'activedirectory2';
import { config } from 'process';
import { IsUserMemberOfDto } from './dto/isUserMemberOf.dto';
import { FindUserDto } from './dto/findUser.dto';
import { FindGroupDto } from './dto/findGroup.dto';
import { GetUsersForGroupDto } from './dto/GetUsersForGroupDto';
import { GroupExistsDto } from './dto/GroupExistsDto';
import { FindUserByGroupDto } from './dto/FindUserByGroupDto';
import { UserExistsDto } from './dto/UserExistsDto';
import { FindDeletedObjectsDto } from './dto/FindDeletedObjectsDto';
import { GetGroupMembershipForGroupDto } from './dto/GetGroupMembershipForGroupDto';
import { GetGroupMembershipForUserDto } from './dto/GetGroupMembershipForUserDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async signInActiveDirectory(signinUserDto: SigninUserDto){
    const { password, email } = signinUserDto;
    console.log(password);
    console.log(email);
    var ActiveDirectory = require('activedirectory2');
    var config = { 
                  url: 'ldap://192.168.131.128',
                  baseDN: 'DC=DEMO,DC=LOCAL',
                  username: 'Administrator@DEMO.LOCAL',
                  password: 'Didibu2000', 
                }
    var ad = new ActiveDirectory(config);

    ad.authenticate(email, password, function(err, auth) {
      if (err) {
        console.log('ERROR: '+JSON.stringify(err));
      }
    
      if (auth) {
        console.log('Authenticated!');
        return signinUserDto;
      }
      else {
        console.log('Authentication failed!');

      }
    });
  }

  async isUserMemberOfAD(isUserMemberOfDto: IsUserMemberOfDto){
    // var username = 'user@domain.com';
    // var groupName = 'Employees';
    var ActiveDirectory = require('activedirectory2');
    var config = { 
                  url: 'ldap://192.168.131.128',
                  baseDN: 'DC=DEMO,DC=LOCAL',
                  username: 'Administrator@DEMO.LOCAL',
                  password: 'Didibu2000', 
                }
    var username = isUserMemberOfDto.username;
    var groupName = isUserMemberOfDto.groupName;
    console.log(username);  
    console.log(groupName);
    var ad = new ActiveDirectory(config);
    ad.isUserMemberOf(username, groupName, function(err, isMember) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      console.log(username + ' isMemberOf ' + groupName + ': ' + isMember);
    });
  }

  async findUser(findUserDto: FindUserDto){
    var ActiveDirectory = require('activedirectory2');
    var config = { 
                  url: 'ldap://192.168.131.128',
                  baseDN: 'DC=DEMO,DC=LOCAL',
                  username: 'Administrator@DEMO.LOCAL',
                  password: 'Didibu2000', 
                }
    var ad = new ActiveDirectory(config);

    // Any of the following username types can be searched on
    var userPrincipalName = findUserDto.userPrincipalName;
    var sAMAccountName = findUserDto.sAMAccountName;
    var dn = findUserDto.dn;
    // var dn = 'CN=perez\\, juan,OU=RHHH,OU=usuarios,OU=scz,DC=DEMO,DC=LOCAL';

    // Find user by a userPrincipalName
    ad.findUser(userPrincipalName, function(err, user) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      if (! user) console.log('User: ' + userPrincipalName + ' not found.');
      else console.log(JSON.stringify(user));
    });
  }

  async findGroup(findGroupDto: FindGroupDto){
    var ActiveDirectory = require('activedirectory2');
    var config = { 
                  url: 'ldap://192.168.131.128',
                  baseDN: 'DC=DEMO,DC=LOCAL',
                  username: 'Administrator@DEMO.LOCAL',
                  password: 'Didibu2000', 
                }
    var ad = new ActiveDirectory(config);

    // Any of the following group names can be searched on
    // var groupName = 'Employees';
    // var dn = 'CN=Employees,OU=Groups,DC=domain,DC=com'
    var groupName = findGroupDto.groupName;
    var dn = findGroupDto.dn;

    // Find group by common name
    ad.findGroup(groupName, function(err, group) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      if (! group) console.log('Group: ' + groupName + ' not found.');
      else {
        console.log(group);
        console.log('Members: ' + (group.member || []).length);
      }
    });
  }
 
  async getUsersForGroup(getUsersForGroupDto: GetUsersForGroupDto) {
    const { grupo } = getUsersForGroupDto;
    //var groupName = 'Employees';
    var groupName = grupo;

    var ActiveDirectory = require('activedirectory2');
    var config = { 
        url: 'ldap://192.168.131.128',
        baseDN: 'DC=DEMO,DC=LOCAL',
        username: 'Administrator@DEMO.LOCAL',
        password: 'Didibu2000', 
    }
    var ad = new ActiveDirectory(config);
    ad.getUsersForGroup(groupName, function(err, users) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      if (! users) console.log('Group: ' + groupName + ' not found.');
      else {
        console.log(JSON.stringify(users));
      }
    });
  }

  async groupExists(groupExistsDto: GroupExistsDto) {
    var ActiveDirectory = require('activedirectory2');
    var config = { 
        url: 'ldap://192.168.131.128',
        baseDN: 'DC=DEMO,DC=LOCAL',
        username: 'Administrator@DEMO.LOCAL',
        password: 'Didibu2000', 
    }
    const { grupo } = groupExistsDto
    var groupName = grupo;
    //var groupName = 'Employees';
    var ad = new ActiveDirectory(config);
    ad.groupExists(groupName, function(err, exists) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      console.log(groupName + ' exists: ' + exists);
    });
  }

  async findGroups(findUserByGroupDto: FindUserByGroupDto) {
    const { query } = findUserByGroupDto;
    // var query = 'CN=Admin'; 
    console.log(query);
    var ActiveDirectory = require('activedirectory2');
    var config = { 
        url: 'ldap://192.168.131.128',
        baseDN: 'DC=DEMO,DC=LOCAL',
        username: 'Administrator@DEMO.LOCAL',
        password: 'Didibu2000', 
    }
    var ad = new ActiveDirectory(config);
    ad.findGroups(query, function(err, groups) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      if ((! groups) || (groups.length == 0)) console.log('No groups found.');
      else {
        console.log('findGroups: '+JSON.stringify(groups));
      }
    });
  }

  async userExists(userExistsDto: UserExistsDto) {
    var ActiveDirectory = require('activedirectory2');
    var config = { 
        url: 'ldap://192.168.131.128',
        baseDN: 'DC=DEMO,DC=LOCAL',
        username: 'Administrator@DEMO.LOCAL',
        password: 'Didibu2000', 
    }
    const { username } = userExistsDto;
    //var username = 'john.smith@domain.com'; //recibir

    var ad = new ActiveDirectory(config);
    ad.userExists(username, function(err, exists) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      console.log(username + ' exists: ' + exists);
    });
  }

  async findDeletedObjects(findDeletedObjectsDto: FindDeletedObjectsDto) {
    var ActiveDirectory = require('activedirectory2');
    var config = { 
        url: 'ldap://192.168.131.128',
        baseDN: 'DC=DEMO,DC=LOCAL',
        username: 'Administrator@DEMO.LOCAL',
        password: 'Didibu2000', 
    }
    const { url } = findDeletedObjectsDto;
    //var url = 'ldap://yourdomain.com'; //recibir
    var ad = new ActiveDirectory(config);
    var opts = {
      baseDN: 'ou=Deleted Objects, dc=yourdomain, dc=com',
      filter: 'cn=Bob'
    };
    ad.findDeletedObjects(opts, function(err, result) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }
    
      console.log('findDeletedObjects: '+JSON.stringify(result));
    });
  }

  async getGroupMembershipForGroup(getGroupMembershipForGroupDto: GetGroupMembershipForGroupDto) {
    var ActiveDirectory = require('activedirectory2');
    var config = { 
        url: 'ldap://192.168.131.128',
        baseDN: 'DC=DEMO,DC=LOCAL',
        username: 'Administrator@DEMO.LOCAL',
        password: 'Didibu2000', 
    }
    const { groupName } = getGroupMembershipForGroupDto;
    //var groupName = 'Employees'; //recibir
    var ad = new ActiveDirectory(config);
    ad.getGroupMembershipForGroup(groupName, function(err, groups) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      if (! groups) console.log('Group: ' + groupName + ' not found.');
      else console.log(JSON.stringify(groups));
    });
  }

  async getGroupMembershipForUser(getGroupMembershipForUserDto: GetGroupMembershipForUserDto) {
    var ActiveDirectory = require('activedirectory2');
    var config = { 
        url: 'ldap://192.168.131.128',
        baseDN: 'DC=DEMO,DC=LOCAL',
        username: 'Administrator@DEMO.LOCAL',
        password: 'Didibu2000', 
    }
    const { sAMAccountName } = getGroupMembershipForUserDto;
    //var sAMAccountName = 'john.smith@domain.com';
    var ad = new ActiveDirectory(config);
    ad.getGroupMembershipForUser(sAMAccountName, function(err, groups) {
      if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }

      if (! groups) console.log('User: ' + sAMAccountName + ' not found.');
      else console.log(JSON.stringify(groups));
    });
  }
}
