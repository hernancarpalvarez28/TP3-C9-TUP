import { CreateUserDto } from '../../users/dto/create-user.dto.js';

// El registro pide los mismos datos que crear un usuario.
export class RegisterAuthDto extends CreateUserDto {}