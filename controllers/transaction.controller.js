const { Users, Transactions, Courses } = require("../models");
const nodemailer = require("nodemailer");

module.exports = {
  getTransaction: async (req, res) => {
    const { id } = req.params;
    const userId = res.locals.userId;

    try {
      const course = await Courses.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          image: {
            select: {
              url: true,
            },
          },
        },
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Cari transaksi yang terkait antara user dan course
      const existingTransaction = await Transactions.findFirst({
        where: {
          userId: { equals: userId },
          courseId: { equals: course.id },
        },
      });

      if (!existingTransaction) {
        return res.status(404).json({ message: "Transaction not found!" });
      }

      return res.status(200).json({
        course,
        transaction: existingTransaction,
      });
    } catch (error) {
      console.error("Error getting course details:", error);
      res.sendStatus(500);
    }
  },

  buyCourse: async (req, res) => {
    let date = new Date();
    const { id } = req.params;
    const userId = res.locals.userId;

    try {
      // Cari course berdasarkan id
      const course = await Courses.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          image: {
            select: {
              url: true,
            },
          },
        },
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Cari transaksi yang terkait antara user dan course
      const existingTransaction = await Transactions.findFirst({
        where: {
          userId: { equals: userId },
          courseId: { equals: course.id },
        },
      });

      if (existingTransaction) {
        return res.status(400).json({
          message: "You already have a transaction for this course!",
        });
      }

      if (course.courseType === "Gratis" || course.courseType === "Premium") {
        const totalTax = course.price * 0.11;
        const totalPrice = course.price + totalTax;

        const transaction = await Transactions.create({
          data: {
            status: "Belum Bayar",
            totalTax,
            totalPrice,
            paymentMethod: "",
            paymentDate: date.toISOString(),
            user: {
              connect: { id: userId },
            },
            course: {
              connect: { id: course.id },
            },
          },
        });

        return res.json({ message: "Detail Transaction", transaction, course });
      } else {
        return res.status(400).json({ error: "Course invalid" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },

  payTransaction: async (req, res) => {
    let date = new Date();
    const { id } = req.params;
    const { paymentMethod } = req.body;

    try {
      // Cari transaksi berdasarkan id
      const transaction = await Transactions.findUnique({
        where: { id },
        include: { course: true, user: true },
      });

      if (!transaction) {
        return res.sendStatus(404);
      }

      // Periksa apakah pengguna yang membeli course sesuai dengan pengguna yang terautentikasi
      const userId = res.locals.userId;
      if (transaction.user.id !== userId) {
        return res.sendStatus(403);
      }

      // Periksa apakah courseType adalah "Premium"
      if (transaction.course.courseType === "Gratis") {
        if (paymentMethod) {
          return res.status(400).json({
            message: "Payment method is not required for free courses",
          });
        }
      } else if (transaction.course.courseType === "Premium") {
        // Periksa metode pembayaran yang valid
        const validPaymentMethods = ["Credit Card", "Transfer Bank"];
        if (!validPaymentMethods.includes(paymentMethod)) {
          return res.status(400).json({ message: "Invalid payment method" });
        }
      } else {
        return res.status(400).json({ message: "Invalid course type" });
      }

      if (transaction.status === "Sudah Bayar") {
        return res
          .status(403)
          .json({ message: "You already pay this course!" });
      }

      // update status transaksi dan metode pembayaran
      const updatedTransaction = await Transactions.update({
        where: { id },
        include: { course: true, user: true },
        data: {
          status: "Sudah Bayar",
          paymentDate: date.toISOString(),
          paymentMethod: paymentMethod,
        },
      });

      // Kirim E-Receipt ke email user
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "system@gmail.com",
        to: transaction.user.email,
        subject: "E-Receipt Course",
        html: `<p>Berikut adalah E-Receipt Anda :</p>
        <p>Id Transaksi : ${id} </p>
        <p>Course : ${transaction.course.title} </p>
        <p>Harga : ${transaction.totalPrice} </p>
        <p>Tanggal Pembayaran : ${updatedTransaction.paymentDate} </p>
        <p>Metode Pembayaran : ${updatedTransaction.paymentMethod} </p>
        <p>Status : ${updatedTransaction.status} </p>
        `,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
          return res.status(400);
        }
        return res.status(200).json({
          message:
            "Transaction Success, We have sent a E-Receipt in your email.",
          transaction: updatedTransaction,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
};
