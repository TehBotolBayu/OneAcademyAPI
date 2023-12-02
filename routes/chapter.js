const express = require("express"),
  router = express.Router(),
  chapterController = require("../controllers/chapter.controller");

router.post("/create", chapterController.create);
router.get("/", chapterController.getAllChapter);
router.put("/:id",chapterController.update);
router.delete("/:id",  chapterController.destroy);
// router.get("/:id", chapterController.getCourseById);


module.exports = router;
