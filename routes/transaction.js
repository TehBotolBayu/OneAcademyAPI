const express = require('express'),
    router = express.Router(),
    controller = require ('../controllers/transaction.controller'),
    middleware = require ('../middlewares/auth');


router.post('/:id/buy', middleware.checkToken, controller.buyCourse);
router.get('/:id/detailTransaction', middleware.checkToken, controller.getTransaction);
router.post('/:id/pay', middleware.checkToken, controller.payTransaction);



module.exports = router;