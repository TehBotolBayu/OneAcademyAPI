const express = require("express"),
  router = express.Router(),
  courseController = require("../controllers/course.controller"),
  imageController = require("../controllers/image.controller"),
  auth = require("../middlewares/auth.js"),
  multerLib = require("multer")();

router.post("/create", auth.checkToken, multerLib.single('image'), imageController.create, courseController.create);
router.put(
  "/update/:courseId",
  multerLib.single('image'),
  courseController.updateCourse,
  imageController.updateImage
);
router.get("/filterSearch", courseController.filterAndSearch);
router.get("/", courseController.getAllCourses);
router.get("/:courseId",auth.checkToken ,courseController.getCourseById);
router.delete("/:courseId",  courseController.deleteCourse, imageController.deleteImage);

// SEARCH
// localhost:3000/api/v1/course/search/modul

module.exports = router;
