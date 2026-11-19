-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('alumno', 'profesor');

-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('primario', 'secundario', 'universitario', 'adultos');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('Virtual', 'Presencial', 'Ambas');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni" VARCHAR(8) NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumno" (
    "id" SERIAL NOT NULL,
    "nivel" "Nivel" NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "materias" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "descripcion" VARCHAR(500),
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id" SERIAL NOT NULL,
    "materia" TEXT NOT NULL,
    "nivel" "Nivel" NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "modalidades" "Modalidad"[],
    "formacion" TEXT,
    "experiencia" INTEGER,
    "horarios" TEXT,
    "zona" TEXT,
    "descripcion" VARCHAR(500),
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_userId_key" ON "Alumno"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_userId_key" ON "Profesor"("userId");

-- AddForeignKey
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor" ADD CONSTRAINT "Profesor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
