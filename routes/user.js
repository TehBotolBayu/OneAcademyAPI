const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/auth.controller.js"),
  userController = require("../controllers/user.controller.js"),
  multerLib = require("multer")(),
  auth = require("../middlewares/auth.js");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/verify", controller.verifyOTP);
router.post("/resetOTP", controller.resetOTP);
router.post("/reset-password", controller.resetPassword);
router.post("/set-password", controller.setPassword);
// router.get('/', userController.getUsers);
// router.get('/:userId', userController.getUserById, imageKit.imagekitGet);
// router.delete('/delete/:userId', auth.checkToken, userController.deleteUser, imageKit.imagekitDelete);
// router.put('/updateProfile/:userId', auth.checkToken, multer.single('image'), imageKit.imagekitUpload, userController.updateProfile);
// router.put('/updateUser/:userId', auth.checkToken, multer.single('image'), userController.updateUser);

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
