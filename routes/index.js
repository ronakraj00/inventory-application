const express = require("express");
const router = express.Router();
const collectionRouter = require("./collection");
const { get_log_in, post_log_in, get_sign_up, post_sign_up } = require("../controllers/auth");
/* GET home page. */

router.get("/login", get_log_in);
router.post("/login", post_log_in);

router.get("/sign-up", get_sign_up);
router.post("/sign-up", post_sign_up);

router.get("/", function (req, res, next) {
    res.redirect("/collection");
});

router.use("/collection", collectionRouter);

module.exports = router;
