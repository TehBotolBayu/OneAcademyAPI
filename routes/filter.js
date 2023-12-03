const express = require("express"),
  router = express.Router(),
  filterController = require("../controllers/filter.controller");

router.get("/filterSearch", filterController.filter);
// localhost:3000/api/v1/filter/filterSearch?filterBy=newest

// localhost:3000/api/v1/filter/filterSearch?sortBy=newest&category=Web%20Development&level=beginner&promo=true

// router.get("filterCategory", filterController.categoryFilter);
// // localhost:3000/api/v1/filter/filterCategory?category=UI/UX Designer

// router.get("filterLevel", filterController.levelFilter);
// // localhost:3000/api/v1/filter/filterLevel?

module.exports = router;
