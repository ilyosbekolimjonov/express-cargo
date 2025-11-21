/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "USER_ROLES" AS ENUM ('ADMIN', 'DELIVERY_STAFF', 'CUSTOMER');

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_role_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "USER_ROLES" NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "UserRole";
