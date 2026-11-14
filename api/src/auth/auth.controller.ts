import { Controller, Post, Body, HttpCode, UseGuards } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service.js";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // only 5 login attempts per minute from the same address
  @Post("login")
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}