const express = require("express");
const router = express.Router();
const collectionRouter = require("./collection");
/* GET home page. */
router.get("/", function (req, res, next) {
    res.redirect("/collection");
});

router.use("/collection", collectionRouter);

module.exports = router;
