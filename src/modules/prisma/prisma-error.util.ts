// Prisma devuelve el código P2002 cuando se intenta guardar un valor
// repetido en un campo @unique (por ejemplo, un DNI o un email que ya existen).
export function esErrorDeDatoRepetido(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}
