import bcrypt from 'bcrypt';

// Cuántas veces se repite el cálculo del hash. Más vueltas = más seguro pero más lento.
const VUELTAS = 10;

// Convierte la contraseña en un hash. El hash no se puede volver a convertir en la contraseña.
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, VUELTAS);
}

// Compara una contraseña con un hash guardado (la va a usar auth en el TP 12).
export function verificarPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
