const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  Roles: prisma.Roles,
  Users: prisma.users,
  Profiles: prisma.profiles,
  Transactions: prisma.Transactions,
  Reviews: prisma.Reviews,
  Categories: prisma.Categories,
  Courses: prisma.Courses,
  Materials: prisma.Materials,
  Chapters: prisma.Chapters,
  Images: prisma.Images,
};
