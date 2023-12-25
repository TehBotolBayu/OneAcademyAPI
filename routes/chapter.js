const express = require("express"),
  router = express.Router(),
  chapterController = require("../controllers/chapter.controller"),
  {checkToken} = require('../middlewares/auth');

router.post("/create", checkToken, chapterController.create);
router.get("/", chapterController.getAllChapter);
router.put("/:id", checkToken, chapterController.update);
router.delete("/:id", checkToken, chapterController.destroy);
// router.get("/:id", chapterController.getCourseById);


module.exports = router;
