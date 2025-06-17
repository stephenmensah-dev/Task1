import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import JwtRefreshAuthGuard from './guards/jwt-refresh-auth.guard';
import JwtAuthGuard from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true}) response: Response
  ) { 
    await this.authService.login(user, response)
    return { message: 'Access Token Set - User Logged In' }
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true}) response: Response
  ){
    await this.authService.login(user, response)
    return { message: 'Refresh Token Set' }
  }

  @UseGuards(JwtAuthGuard) 
  @Post('logout')
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user, response);
    return { message: 'User Logged Out' };
  }


}
