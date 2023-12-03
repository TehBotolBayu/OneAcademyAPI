const { Courses } = require("../models");

module.exports = {
  filter : async (req, res) => {
    try {
      const { sortBy, category, level, promo, courseType, page, record } = req.query;
      const pageNumber = parseInt(page) || 1;
      const recordPerPageNumber = parseInt(record) || 10;
      const skipNumber = (pageNumber - 1) * recordPerPageNumber;
  
      const filters = {
        newest: { createdAt: "desc" },
        oldest: { createdAt: "asc" },
        promo: { price: { lt: 50 } }, // Sesuaikan kondisi promo sesuai kebutuhan
      };
  
      const categoryFilters = {
        "UI/UX Design": { category: { name: "UI/UX Design" } },
        "Web Development": { category: { name: "Web Development" } },
        "Android Development": { category: { name: "Android Development" } },
        "Data Science": { category: { name: "Data Science" } },
        "Business Intelligence": {
          category: { name: "Business Intelligence" },
        },
      };
  
      const levelFilters = {
        all: {},
        beginner: { level: "Beginner" },
        intermediate: { level: "Intermediate" },
        advanced: { level: "Advanced" },
      };
  
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
        query.where = { ...query.where, ...categoryFilters[category] };
      }
  
      if (level) {
        query.where = { ...query.where, ...levelFilters[level] };
      }
  
      if (promo && filters.promo) {
        query.where = { ...query.where, ...filters.promo };
      }
  
      if (courseType) {
        query.where = { ...query.where, ...courseTypeFilters[courseType] };
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
      console.error("Terjadi kesalahan:", error);
      res.status(500).json({ error: "Terjadi kesalahan" });
    }
  }
};
