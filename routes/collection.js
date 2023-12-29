const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");
const itemController = require("../controllers/itemController");
router.get("/", collectionController.collection_list);
router.get("/item/create",itemController.get_item_create);
router.post("/item/create",itemController.post_item_create);
router.get("/:id",collectionController.collection_items_list);

module.exports = router;
