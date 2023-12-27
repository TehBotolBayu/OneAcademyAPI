const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/auth.controller.js"),
  userController = require("../controllers/user.controller.js"),
  multerLib = require("multer")(),
  auth = require("../middlewares/auth.js");
  // {oauth2Client,scopes} = require('../controllers/auth.controller.js');



//Authentication
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post('/auth/google',controller.loginGoogle); 
router.post("/logout",auth.checkToken, controller.logout); 
router.post("/verify", controller.verifyOTP);
router.post("/resetOTP", controller.resetOTP);
router.post("/reset-password", controller.resetPassword);
router.post("/set-password", controller.setPassword);

//Profile
router.get("/me", auth.checkToken, userController.getUserById);
router.put("/me/change-password", auth.checkToken, userController.changePwd);
router.put(
  "/me",
  auth.checkToken,
  multerLib.single("avatar"),
  userController.updateUserById,
);
router.get("/me/history-transaction", auth.checkToken, userController.getUserTransaction)

module.exports = router;
