const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");
const itemController = require("../controllers/itemController");
router.get("/", collectionController.collection_list);
router.get("/create", collectionController.get_collection_create);
router.post("/create", collectionController.post_collection_create);
router.get("/item/create", itemController.get_item_create);
router.post("/item/create", itemController.post_item_create);
router.get("/item/delete/:id",itemController.post_item_delete);
router.get("/item/update/:id",itemController.get_item_update);
// router.post("/item/update/:id",itemController.post_item_update);
router.get("/delete/:id",collectionController.post_collection_delete);
router.get("/:id", collectionController.collection_items_list);

module.exports = router;
