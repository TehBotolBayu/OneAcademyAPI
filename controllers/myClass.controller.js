const { Transactions, Courses } = require("../models");
const nodemailer = require("nodemailer");
const checkToken = require("../middlewares/auth");

module.exports = {
  getUserClasses: async (req, res) => {
    try {
      const userId = res.locals.userId;

      // Temukan semua transaksi yang dilakukan oleh pengguna
      const userTransactions = await Transactions.findMany({
        where: {
          userId,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              instructor: true,
              courseType: true,
              price: true,
              description: true,
              // Tambahkan fields lain dari model Courses yang ingin ditampilkan di myClass
            },
          },
        },
      });

      // Buat response yang hanya berisi data kursus dari transaksi pengguna
      const userClasses = userTransactions.map(
        (transaction) => transaction.course
      );

      if (userClasses.length === 0) {
        return res.json({
          success: true,
          message: "You haven't purchased any courses yet",
          userClasses,
        });
      } else {
        return res.json({
          success: true,
          message: "user class data successfully found",
          userClasses,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
};
