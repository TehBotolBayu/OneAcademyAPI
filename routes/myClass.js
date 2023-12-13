const express = require("express");
const router = express.Router();
const myClassController = require("../controllers/myClass.controller");
const { checkToken } = require("../middlewares/auth");

router.get("/my-classes", checkToken, myClassController.getUserClasses);

// localhost:3000/api/v1/myClass/my-classes

module.exports = router;
