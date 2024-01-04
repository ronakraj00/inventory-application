const asyncHandler = require("express-async-handler");
const Collection = require("../models/collection");
const Items = require("../models/item");
const { body, validationResult } = require("express-validator");

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

exports.get_collection_create = asyncHandler(async (req, res, next) => {
    res.render("collection_form", { title: "Create Collection" });
});
exports.post_collection_create = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("name should be atleast one character long")
        .escape(),
    body("description").optional({ values: "falsy" }).trim().escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("collection_form", {
                title: "Create Collection",
                errors: errors.array(),
            });
        } else {
            const collection = new Collection({
                name: req.body.name,
                description: req.body.description,
                createdAt: Date.now(),
            });
            await collection.save();
            res.redirect("/collection");
        }
    }),
];

exports.post_collection_delete = [
    (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    },
    asyncHandler(async (req, res, next) => {
        const allItems = await Items.find({ collection: req.params.id });
        allItems.forEach(
            async (item) => await Items.findByIdAndDelete(item._id)
        );
        await Collection.findByIdAndDelete(req.params.id);
        res.redirect("/");
    }),
];
