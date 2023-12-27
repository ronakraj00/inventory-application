const express = require("express");
const router = express.Router();

router.get("/",showCollections);
router.get("/:item",showItem);

module.exports = router;
