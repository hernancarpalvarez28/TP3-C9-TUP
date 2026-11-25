import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import { verificarPassword } from '../users/password.util.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Reutiliza el create de users: ya hashea la contraseña y controla DNI y email repetidos.
  register(registerAuthDto: RegisterAuthDto) {
    return this.usersService.create(registerAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const usuario = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    });

    const passwordCorrecta =
      usuario &&
      (await verificarPassword(loginAuthDto.password, usuario.passwordHash));

    // Mismo mensaje en los dos casos, así no se puede adivinar qué emails existen.
    if (!usuario || !passwordCorrecta) {
      throw new UnauthorizedException('Email o contraseña incorrectos.');
    }

    // El token guarda el id (sub), el email y el rol del usuario.
    const access_token = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    // Sacamos el hash antes de devolver el usuario.
    const { passwordHash, ...user } = usuario;

    return { access_token, user };
  }
}