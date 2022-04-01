import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/ambassadors')
  @UseInterceptors(ClassSerializerInterceptor)
  async ambassador() {
    return this.userService.find({
      is_ambassador: true,
    });
  }
}
