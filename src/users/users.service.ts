import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
    {
      userId: 3,
      username: 'diana',
      password: 'didibu2000',
    },
  ];

  async findOne(email: string): Promise< any | undefined>{
    return this.users.find(user => user.username === email);
  }

  

    
}
