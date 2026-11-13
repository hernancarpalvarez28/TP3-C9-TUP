import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre tiene que ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @Matches(/^\d{7,8}$/, {
    message: 'El DNI tiene que tener 7 u 8 números, sin puntos',
  })
  dni: string;

  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString({ message: 'El teléfono tiene que ser un texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono: string;

  @IsString({ message: 'La ciudad tiene que ser un texto' })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  ciudad: string;

  @IsString({ message: 'La contraseña tiene que ser un texto' })
  @MinLength(8, {
    message: 'La contraseña tiene que tener al menos 8 caracteres',
  })
  password: string;

  @IsIn(['alumno', 'profesor'], {
    message: 'El rol tiene que ser alumno o profesor',
  })
  rol: string;
}
