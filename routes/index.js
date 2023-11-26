const express = require('express'),
    router = express.Router(),
    categoryRouter = require('./category')




router.use('/category',categoryRouter);


module.exports = router


