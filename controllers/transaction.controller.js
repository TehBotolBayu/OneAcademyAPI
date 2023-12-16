const { Users, Transactions, Courses, Materials, Course_Progress } = require("../models");
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

        const materials = await Materials.findMany({
          where: {
            courseId: course.id
          }
        })

        
        materials.forEach(async (e) => {
          let progress = await Course_Progress.create({
            data: {
              isCompleted: false,
              user: {
                connect: {id: "658c5d0a-4642-4ccc-be94-c32117981c8c"},
              },
              course: {
                connect: {id: course.id},
              },
              material: {
                connect: {id: e.id}
              }
            }
          });
        });

        return res.json({ message: "Detail Transaction", transaction, course});
      } 
      else {
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
        include: {
          course: true,
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
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
        html: `<div
        style="
          text-align: center;
          padding: 1rem;
          border-radius: 5px;
          background-color: #6148ff;
          color: white;
          font-family: 'Montserrat', Tahoma, Geneva, Verdana, sans-serif;
        "
      >
        <img
          src="https://i.imgur.com/nhNpkBd.png"
          alt="One Academy"
          style="width: 15dvw"
        />
        <h1>Thank You For Your Purchase</h1>
        <div
          style="
            background-color: white;
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 20px;
            color: black;
            max-width: 50dvw;
            max-height: 60dvh;
            margin-top: 10px;
            margin: 0 auto;
          "
        >
          <p>
            Hi <span style="font-weight: 700">${transaction.user.profile.name},</span> <br />
            Thanks for your purchase from OneAcademy.
          </p>
  
          <table style="width: 100%; text-align: left">
            <h5>YOUR ORDER INFORMATION :</h5>
            <tr>
              <th>Order ID :</th>
              <th>Order Date :</th>
            </tr>
            <tr>
               <td>${id}</td>
               <td>${updatedTransaction.paymentDate}</td>
            </tr>
            <tr>
              <th>Course Name :</th>
              <th>Price :</th>
            </tr>
            <tr>
              <td>${transaction.course.title}</td>
              <td>${transaction.totalPrice}</td>
            </tr>
          </table>
  
          <p style="text-align: left">
            Payment Method : <br />
            ${updatedTransaction.paymentMethod}
          </p>
  
          <div
            style="
              background-color: rgb(13, 82, 255);
              color: white;
              border-radius: 10px;
              padding: 10px;
              font-size: 20px;
            "
          >
            ${updatedTransaction.status}
          </div>
        </div>
        <small style="color: white; font-style: italic"
          >Please keep a copy of this receipt for your records.</small
        >
        <p>
          Thank you for choosing OneAcademy!<br />
          © 2023, One Academy. All rights reserved.
        </p>
      </div>
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

  getAllTransaction: async (req, res) => {
    const { page, record } = req.query;
    try {
      const take = parseInt(record, 10) || 10;
      const currentPage = parseInt(page, 10) || 1;

      const options = {
        take,
        skip: (currentPage - 1) * take,
        include: {
          user: {
            select: {
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
          course: {
            select: {
              title: true,
              courseType: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      };

      const [transactions, totalRows] = await Promise.all([
        Transactions.findMany(options),
        Transactions.count(),
      ]);

      const totalPages = Math.ceil(totalRows / take);

      let previousPage = null;
      if (currentPage > 1) {
        previousPage = currentPage - 1;
      }

      let nextPage = null;
      if (!page || currentPage < totalPages) {
        nextPage = currentPage + 1;
      }

      return res.status(200).json({
        transactions,
        previousPage,
        nextPage,
        totalRows,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },

  deleteTransaction: async (req, res) => {
    await Transactions.deleteMany();
    return res.status(200).json({})
  }
};
