# MiProfe - Backend

Backend de **MiProfe**, una aplicación que conecta alumnos con profesores particulares según la materia, la zona y la modalidad (virtual o presencial).

Trabajo práctico de Programación IV - Tecnicatura Universitaria en Programación, UTN FRT.

## Integrantes

- Guillermo Cortes ([@GuilleCortes01](https://github.com/GuilleCortes01))
- Sofía ([@sofiaaltamiranda22](https://github.com/sofiaaltamiranda22))
- Hernán ([@hernancarpalvarez28](https://github.com/hernancarpalvarez28))

## Tecnologías

- NestJS 12 con TypeScript
- Prisma 7 con PostgreSQL
- class-validator y class-transformer para validar los datos
- bcrypt para guardar las contraseñas
- JWT para el inicio de sesión
- Postman para probar las rutas

## Cómo levantarlo

1. Tener instalados Node.js y PostgreSQL.
2. Crear la base de datos `miprofe` en PostgreSQL.
3. Configurar la conexión a la base de datos (consultar con el equipo).
4. Instalar las dependencias:
   ```bash
   npm install
   ```
5. Generar el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
6. Crear las tablas:
   ```bash
   npx prisma migrate dev
   ```
7. Levantar el servidor:
   ```bash
   npm run start:dev
   ```

La API queda disponible en `http://localhost:4000`.

## Módulos y rutas

### auth
| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/auth/register` | Registra un usuario (alumno o profesor) |
| POST | `/auth/login` | Inicia sesión y devuelve un token JWT |

### users
| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/users` | Lista los usuarios |
| GET | `/users/:id` | Busca un usuario por id |
| PATCH | `/users/:id` | Edita un usuario |
| DELETE | `/users/:id` | Borra un usuario (y su perfil) |

### alumno
| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/alumno` | Crea el perfil de un alumno |
| GET | `/alumno` | Lista los alumnos |
| GET | `/alumno/:id` | Busca un alumno por id |
| PATCH | `/alumno/:id` | Edita un alumno |
| DELETE | `/alumno/:id` | Borra un alumno |

### profesor
| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/profesor` | Crea el perfil de un profesor |
| GET | `/profesor` | Lista los profesores |
| GET | `/profesor/:id` | Busca un profesor por id |
| PATCH | `/profesor/:id` | Edita un profesor |
| DELETE | `/profesor/:id` | Borra un profesor |

### principal
| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/principal?materia=...&zona=...` | Busca profesores por materia y zona (la zona es opcional) |

## Base de datos

Tiene tres tablas:

- **User**: los datos de cada usuario (nombre, DNI, email, teléfono, ciudad, contraseña y rol).
- **Alumno**: el perfil del alumno (nivel, modalidad, materias y descripción).
- **Profesor**: el perfil del profesor (materia, nivel, precio, modalidades, formación, experiencia, horarios, zona y descripción).

Cada usuario tiene un solo perfil, de alumno o de profesor según su rol. El perfil se conecta con su usuario por el campo `userId`, y si se borra el usuario también se borra su perfil.

## Validaciones y seguridad

- Cada ruta tiene un DTO que valida los datos antes de guardarlos. Si algo está mal, responde con un mensaje en español.
- El DNI y el email no se pueden repetir.
- Las contraseñas se guardan hasheadas con bcrypt y nunca se devuelven en las respuestas.
- El login devuelve un token JWT que vence en una hora.

## Comandos útiles

```bash
npm run start:dev   # Levantar el servidor
npm run build       # Compilar
npm test            # Correr los tests
```
