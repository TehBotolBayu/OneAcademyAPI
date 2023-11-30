const { Courses } = require("../models");

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

      res.json(courses);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  },
};
