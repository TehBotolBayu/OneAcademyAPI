const { Transactions, Courses, Course_Progress } = require("../models");
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

      if (userTransactions.length <= 0) {
        return res.status(400).json({
          error: "You haven't purchased any courses yet",
          userClasses,
        });
      }

      // Buat response yang hanya berisi data kursus dari transaksi pengguna
      const userClasses = userTransactions.map(({ course }) => course);

      let tes = [];

      for (let i = 0; i < userClasses.length; i++) {
        const progress = await Course_Progress.findMany({
          where: {
            courseId: userClasses[i].id,
          },
        });
        let status = true;

        for await (const p of progress) {
          if (p.isCompleted == false) {
            status = false;
            break;
          }
        }
        userClasses[i].isCompleted = status;
      }

      if (userClasses.length === 0) {
        return res.json({
          error: "You haven't purchased any courses yet",
          userClasses,
        });
      } else {
        return res.json({
          message: "user class data successfully found",
          userClasses,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  //for debugging
  deleteProgress: async (req, res) => {
    await Course_Progress.deleteMany();
    return res.status(200).json({});
  },

  getAllProgress: async (req, res) => {
    const progresses = await Course_Progress.findMany();
    return res.status(200).json({ progresses });
  },

  //

  getProgress: async (req, res) => {
    try {
      const progress = await Course_Progress.findUnique({
        where: {
          userId_materialId: {
            userId: res.locals.userId,
            materialId: req.params.materialId,
          },
        },
      });

      return res.status(200).json({
        progress,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  getProgressbyUserId: async (req, res) => {
    try {
      const progress = await Course_Progress.findMany({
        where: {
          userId: res.locals.userId,
        },
      });

      return res.status(200).json({
        progress,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  getProgressByCourse: async (req, res) => {
    try {
      const progress = await Course_Progress.findMany({
        where: {
          userId: res.locals.userId,
          courseId: req.params.courseId,
        },
      });
      return res.status(200).json({
        progress,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  setCompleted: async (req, res) => {
    try {
      const progress = await Course_Progress.update({
        data: {
          isCompleted: true,
        },
        where: {
          userId_materialId: {
            userId: res.locals.userId,
            materialId: req.params.materialId,
          },
        },
      });

      return res.status(200).json({
        progress,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong"
      });
    }
  },
};
