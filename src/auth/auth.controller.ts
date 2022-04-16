import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthGuard } from './auth.guard';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor) // exclude password
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post(['admin/register', 'ambassador/register'])
  async register(@Body() body: RegisterUserDto, @Req() request: Request) {
    const { password_confirm, ...data } = body;

    const users = await this.userService.find({ email: body.email });

    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    if (body.password !== password_confirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.save({
      ...data,
      password: hashed,
      is_ambassador: request.path === '/api/ambassador/register',
    });
  }

  @Post(['admin/login', 'ambassador/login'])
  @HttpCode(200)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response, // send cookie from backend to frontend
    @Req() request: Request,
  ) {
    const user: User = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const adminLogin = request.path === '/api/admin/login';

    // disallow ambassador to login on admin routes
    if (user.is_ambassador && adminLogin) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      scope: adminLogin ? 'admin' : 'ambassador',
    });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'success',
    };
  }

  @UseGuards(AuthGuard)
  @Get(['admin/user', 'ambassador/user'])
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie); // id sent as payload in post login

    if (request.path === '/api/admin/user') {
      const user: User = await this.userService.findOne(id);
      return user;
    }

    const user: User = await this.userService.findOne({
      id,
      relations: ['orders', 'orders.order_items'],
    });

    const { orders, password, ...data } = user;

    return {
      ...data,
      revenue: user.revenue,
    };
  }

  @UseGuards(AuthGuard)
  @Get(['admin/logout', 'ambassador/logout'])
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }

  @UseGuards(AuthGuard)
  @Patch(['admin/users/info', 'ambassador/users/info'])
  async updateInfo(@Req() request: Request, @Body() body: UpdateUserDto) {
    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    return this.userService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Patch(['admin/users/password', 'ambassador/users/password'])
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    return this.userService.update(id, {
      password: await bcrypt.hash(password, 12),
    });
  }
}
