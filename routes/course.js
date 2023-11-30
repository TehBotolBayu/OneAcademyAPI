const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/course.controller");

router.get("/search/:query", controller.search);

module.exports = router;

// localhost:3000/api/v1/course/search/modul
