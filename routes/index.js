const express = require('express');
const router = express.Router();
const collectionRouter=require("./collection")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use("/collections",collection)

module.exports = router;
