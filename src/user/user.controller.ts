import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('admin/ambassadors')
  @UseInterceptors(ClassSerializerInterceptor)
  async ambassador() {
    return this.userService.find({
      is_ambassador: true,
    });
  }
}
