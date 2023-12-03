const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    Roles: prisma.Roles,
    Users: prisma.Users,
    Profiles: prisma.Profiles,
    Transactions: prisma.Transactions,
    Reviews: prisma.Reviews,
    Categories: prisma.Categories,
    Courses: prisma.Courses,
    Materials: prisma.Materials,
    Chapters: prisma.Chapters,
    Images: prisma.Images
}