const {
  Courses,
  Images,
  Materials,
  Chapters,
  Transactions,
  Categories,
} = require("../models");

module.exports = {
  filterAndSearch: async (req, res) => {
    try {
      const { sortBy, category, level, promo, courseType, page, record, name } =
        req.query;
      const pageNumber = parseInt(page) || 1;
      const recordPerPageNumber = parseInt(record) || 10;
      const skipNumber = (pageNumber - 1) * recordPerPageNumber;

      const filters = {
        newest: { createdAt: "desc" },
        oldest: { createdAt: "asc" },
        promo: { price: { lt: 100000} },
      };

      const categoryFilters = {};

      const allCourses = await Courses.findMany({
        include: {
          category: {
            select: {
              id: true,
            },
          },
        },
      });

      const allCategories = [
        ...new Set(allCourses.map((course) => course.category.toString())),
      ];

      allCategories.forEach((categoryId) => {
        categoryFilters[categoryId] = {
          category: { id: categoryId },
        };
      });

      const allLevels = await Courses.findMany({
        select: {
          level: true,
        },
      });
  
      const uniqueLevels = [...new Set(allLevels.map((course) => course.level))];    
      const levelFilters = {};
      
      uniqueLevels.forEach((level) => {
        levelFilters[level.toLowerCase()] = { level };
      });

      const courseTypeFilters = {
        gratis: { courseType: "Gratis" },
        premium: { courseType: "Premium" },
      };

      let query = {
        include: {
          category: true,
          image: true,
          review: true,
        },
        orderBy: filters.newest,
        where: {},
        skip: skipNumber,
        take: recordPerPageNumber,
      };

      if (sortBy) {
        query.orderBy = filters[sortBy];
      }

      if (category) {
        const selectedCategories = category.split(",");

        if (selectedCategories.length > 0) {
          query.where = {
            ...query.where,
            category: {
              id: {
                in: selectedCategories,
              },
            },
          };
        }
      }

      if (level) {
        const selectedLevels = level.split(",");
        const levelsQuery = selectedLevels.map((selectedLevel) => {
          return levelFilters[selectedLevel.toLowerCase()];
        });
      
        if (levelsQuery.length > 0) {
          query.where = {
            ...query.where,
            OR: levelsQuery,
          };
        }
      }

      if (promo && filters.promo) {
        query.where = { ...query.where, ...filters.promo };
      }

      if (courseType) {
        query.where = { ...query.where, ...courseTypeFilters[courseType] };
      }

      if (name) {
        let nameQuery = {
          OR: [
            { title: { contains: name || "", mode: "insensitive" } },
            { instructor: { contains: name || "", mode: "insensitive" } },
            { description: { contains: name || "", mode: "insensitive" } },
            { level: { contains: name || "", mode: "insensitive" } },
          ],
        };

        if (query.where.OR) {
          nameQuery = {
            AND: [{ OR: query.where.OR }, nameQuery],
          };
        }

        query.where = { ...query.where, ...nameQuery };
      }

      const totalCount = await Courses.count({
        where: query.where,
      });

      const totalPages = Math.ceil(totalCount / recordPerPageNumber);

      const courses = await Courses.findMany(query);

      const previousPage = pageNumber > 1 ? pageNumber - 1 : null;
      const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

      res.json({
        courses,
        previousPage,
        nextPage,
        totalRows: totalCount,
        totalPages,
      });
    } catch (error) {
      console.error("Something went wrong:", error);
      res.status(500).json({ error: "Something went wrong" });
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
        message: "Course created successfully",
        course,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "something went wrong" });
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
          review: {
            select: {
              score: true,
            },
          },
        },
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
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const userId = res.locals.userId;
      const course = await Courses.findUnique({
        where: {
          id: req.params.courseId,
        },
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
          review: {
            select: {
              score: true,
            },
          },
        },
      });

      if (!course) {
        return res.status(404).json({
          message: "data not found",
        });
      }

      // Ambil data transaksi berdasarkan courseId dan userId (misalnya dari session atau token)
      const transaction = await Transactions.findUnique({
        where: {
          courseId: course.id,
          userId: userId,
        },
      });

      const chapters = await Chapters.findMany({
        where: {
          courseId: course.id,
        },
        include: {
          material: {},
        },
      });

      return res.status(201).json({
        course,
        chapters,
        transaction,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
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
          category: {
            connect: { id: req.body.categoryId },
          },
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
      return res.status(500).json({ error: error.message });
    }
  },
};
