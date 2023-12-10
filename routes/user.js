const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/auth.controller.js'),
    imageController = require("../controllers/image.controller"),
    multerLib = require("multer")();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify', controller.verifyOTP);
router.post('/resetOTP', controller.resetOTP);
router.post('/reset-password', controller.resetPassword);
router.post('/set-password', controller.setPassword);
router.put('/update/:userId', multerLib.single('image'), imageController.create, controller.update)
router.delete("/delete/:courseId",  controller.delete, imageController.deleteImage);

// router.get('/', userController.getUsers);
// router.get('/:userId', userController.getUserById, imageKit.imagekitGet);
// router.delete('/delete/:userId', auth.checkToken, userController.deleteUser, imageKit.imagekitDelete);
// router.put('/updateProfile/:userId', auth.checkToken, multer.single('image'), imageKit.imagekitUpload, userController.updateProfile);
// router.put('/updateUser/:userId', auth.checkToken, multer.single('image'), userController.updateUser);

module.exports = router;