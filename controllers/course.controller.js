const { Courses, Images } = require("../models");

module.exports = {
  search: async (req, res) => {
    try {
      const { query } = req.params;
      const queryParam = query;

      const courses = await Courses.findMany({
        where: {
          OR: [
            { title: { contains: queryParam || "" } },
            { instructor: { contains: queryParam || "" } },
            { description: { contains: queryParam || "" } },
            { level: { contains: queryParam || "" } },
            // Add more fields to search as needed
          ],
        },
        include: {
          category: true, // Include category details if needed
          image: true, // Include image details if needed
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
      console.log(res.locals.data.id)
      const course = await Courses.create({
          data: {
            title: req.body.title,
            instructor: req.body.instructor,
            courseType: req.body.courseType,
            level: req.body.level,
            price: parseFloat(req.body.price),
            description: req.body.description,
            image: {
              connect: {id: res.locals.data.id}
            },
            category: {
              connect: {id: req.body.categoryId}
            }
          }
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
    try {
      const courses = await Courses.findMany({
        take: 10,
      });

      return res.status(201).json({
        courses,
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
      });

      if(!course){
        return res.status(404).json({
          message: "data not found"
        });
        
      }

      return res.status(201).json({
        course
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
          description: req.body.description
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

      res.locals.data = {data, image};
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },
};
