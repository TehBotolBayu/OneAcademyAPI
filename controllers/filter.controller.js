const { Courses } = require("../models");

module.exports = {
  filter: async (req, res) => {
    try {
      const { sortBy, category, level, promo } = req.query;

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

      let query = {
        include: {
          category: true,
          image: true,
          material: true,
          transaction: true,
          review: true,
          // chapter: true,
        },
      };

      if (sortBy) {
        query.orderBy = filters[sortBy];
      } else {
        query.orderBy = filters.newest;
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

      const courses = await Courses.findMany(query);
      res.json(courses);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      // console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan" });
    }
  },
};

// module.exports = {
//   filter: async (req, res) => {
//     try {
//       const { sortBy, filterBy, queryParam } = req.query;

//       let courses;

//       // Define default sorting
//       const defaultSort = { updatedAt: "desc" };

//       // Define filters based on filterBy parameter
//       const filters = {
//         newest: { orderBy: { updatedAt: "desc" } },
//         oldest: { orderBy: { updatedAt: "asc" } },
//         promo: { where: { price: { lt: 50 } } }, // Adjust the condition for your promotional pricing
//       };

//       // Apply filters based on filterBy value
//       const filter = filters[filterBy] || {};

//       courses = await Courses.findMany({
//         where: {
//           OR: [
//             { title: { contains: queryParam || "" } },
//             { instructor: { contains: queryParam || "" } },
//             { description: { contains: queryParam || "" } },
//             { level: { contains: queryParam || "" } },
//             // Add more fields to search as needed
//           ],
//           ...filter,
//         },
//         orderBy: sortBy ? { [sortBy]: "desc" } : defaultSort,
//         include: {
//           category: true,
//           image: true,
//           material: true,
//           transaction: true,
//           review: true,
//         },
//       });

//       res.json(courses);
//     } catch (error) {
//       res.status(500).json({ error: "Tidak ditemukan" });
//     }
//   },

//   categoryFilter: async (req, res) => {
//     try {
//       const { queryParam, category } = req.query;

//       let courses;

//       const filters = {
//         "UI/UX Designer": { categoryId: "Isi Id nya UI/UX Design" },
//         "Web Development": {
//           categoryId: "Isi Id nya Web Development",
//         },
//         "Android Development": {
//           categoryId: "Isi Id nya Android Development",
//         },
//         "Data Science": { categoryId: "Isi Id nya Data Science" },
//         "Business Intelligence": {
//           categoryId: " Isi Id nya Business Intelligence",
//         },
//         // Add more categories as needed
//       };

//       const filter = filters[category];

//       courses = await Courses.findMany({
//         where: {
//           AND: [
//             {
//               OR: [
//                 { title: { contains: queryParam || "" } },
//                 { instructor: { contains: queryParam || "" } },
//                 { description: { contains: queryParam || "" } },
//                 { level: { contains: queryParam || "" } },
//                 // Add more fields to search as needed
//               ],
//             },
//             filter, // Apply category filter
//           ],
//         },
//         include: {
//           category: true,
//           image: true,
//           material: true,
//           transaction: true,
//           review: true,
//         },
//       });

//       res.json(courses);
//     } catch (error) {
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   },

//   levelFilter: async (req, res) => {
//     try {
//       const { level } = req.query;
//       let courses;

//       if (level) {
//         courses = await Courses.findMany({
//           where: {
//             level: {
//               equals: level.toLowerCase(), // Memastikan level dalam format lowercase di database
//             },
//           },
//           include: {
//             // Include apapun yang ingin kamu kembalikan dalam respons
//             // Misalnya, jika ingin memasukkan informasi kategori kursus:
//             category: true,
//           },
//         });
//       } else {
//         // Jika tidak ada filter level yang diberikan, kembalikan semua kursus
//         courses = await Courses.findMany({
//           include: {
//             category: true,
//           },
//         });
//       }

//       res.json(courses);
//     } catch (error) {
//       res.status(500).json({ error: "Terjadi kesalahan dalam server." });
//     }
//   },
// };
