const asyncHandler = require("express-async-handler");
const Collection = require("../models/collection");
const Items = require("../models/item");
exports.collection_list = asyncHandler(async (req, res, next) => {
    const allCollections = await Collection.find().sort({ name: 1 }).exec();
    res.render("index", {
        title: "Collections",
        allCollections: allCollections,
    });
});

exports.collection_items_list = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const [aboutCollection, itemsOfCollection] = await Promise.all([
        Collection.findOne({ _id: id }).exec(),
        Items.find({ collection: id })
            .populate("collection")
            .sort({
                name: 1,
            })
            .exec(),
    ]);
    res.render("items_list", {
        title: aboutCollection.name,
        itemsOfCollection: itemsOfCollection,
    });
});
