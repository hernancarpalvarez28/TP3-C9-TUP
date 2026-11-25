import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString({ message: 'La contraseña tiene que ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}