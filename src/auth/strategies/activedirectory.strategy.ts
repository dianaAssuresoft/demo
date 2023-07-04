import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-activedirectory';

@Injectable()
export class ADStrategy extends PassportStrategy(
  Strategy,
  'passport-activedirectory',
) {
  constructor() {
    super({
      integrated: false,
      ldap: {
        url: 'ldap://DEMO.LOCAL',
        baseDN: 'DC=demo,DC=local',
        username: 'dmontano@DEMO.LOCAL',
        password: 'Didibu2000',
      },
    });
  }

  async validate(profile: any, done: Function) {
    return done(null, profile);
  }
}
