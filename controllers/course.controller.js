const { Courses, Images, Materials, Chapters } = require("../models");

module.exports = {
  search: async (req, res) => {
    try {
      const queryParam = req.query.name;
      console.log(queryParam);
      const courses = await Courses.findMany({
        where: {
          OR: [
            { title: { contains: queryParam || "", mode: "insensitive" } },
            { instructor: { contains: queryParam || "", mode: "insensitive" } },
            {
              description: { contains: queryParam || "", mode: "insensitive" },
            },
            { level: { contains: queryParam || "", mode: "insensitive" } },
          ],
        },
        include: {
          category: true,
          image: true, 
          review : true
        },
      });

      return res.json(courses);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  create: async (req, res) => {
    try {
      console.log(res.locals.data.id);
      const course = await Courses.create({
        data: {
          title: req.body.title,
          instructor: req.body.instructor,
          courseType: req.body.courseType,
          level: req.body.level,
          price: parseFloat(req.body.price),
          description: req.body.description,
          image: {
            connect: { id: res.locals.data.id },
          },
          category: {
            connect: { id: req.body.categoryId },
          },
        },
      });
      return res.status(201).json({
        course,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },

  getAllCourses: async (req, res) => {
    const { page, record } = req.query;

    try {
      const take = parseInt(record, 10) || 10; // Jumlah entitas yang akan diambil per halaman (default: 10)
      const currentPage = parseInt(page, 10) || 1; // Halaman yang diminta (default: 1)

      const options = {
        take,
        skip: (currentPage - 1) * take,
        include : {
          category : {
            select : {
              name : true,
            }
          },
          image : {
            select : {
              url : true,
            }
          },
          review : {
            select : {
              score : true,
            }
          }
        }
      };

      const [courses, totalRows] = await Promise.all([
        Courses.findMany(options),
        Courses.count(), // Menghitung total baris
      ]);

      const totalPages = Math.ceil(totalRows / take); // Menghitung total halaman

      // Mendapatkan informasi halaman sebelumnya jika currentPage bukan 1
      let previousPage = null;
      if (currentPage > 1) {
        previousPage = currentPage - 1;
      }

      // Mendapatkan informasi halaman berikutnya jika tidak ada query page yang diberikan atau currentPage kurang dari totalPages
      let nextPage = null;
      if (!page || currentPage < totalPages) {
        nextPage = currentPage + 1;
      }

      return res.status(200).json({
        courses,
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

  getCourseById: async (req, res) => {
    try {
      const course = await Courses.findUnique({
        where: {
          id: req.params.courseId,
        },
        include : {
          category : {
            select : {
              name : true
            }
          },
          image : {
            select : {
              url : true,
            }
          },
          review : {
            select : {
              score : true,
            }
          }
        }
      });

      if (!course) {
        return res.status(404).json({
          message: "data not found",
        });
      }

      const chapters = await Chapters.findMany({
        where: {
          courseId: course.id,
        },
        include : {
          material: {
          }
        }
      });

      return res.status(201).json({
        course,
        chapters,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },
  updateCourse: async (req, res, next) => {
    try {
      const course = await Courses.update({
        data: {
          title: req.body.title,
          instructor: req.body.instructor,
          courseType: req.body.courseType,
          level: req.body.level,
          price: parseFloat(req.body.price),
          description: req.body.description,
        },
        where: {
          id: req.params.courseId,
        },
      });

      res.locals.data = course;
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },
  deleteCourse: async (req, res, next) => {
    try {
      const course = await Courses.delete({
        where: {
          id: req.params.courseId,
        },
      });

      const image = await Images.findUnique({
        where: {
          id: course.imageId,
        },
      });

      const data = course;

      res.locals.data = { data, image };
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },
  
};
