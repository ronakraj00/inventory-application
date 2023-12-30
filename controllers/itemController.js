const asyncHandler = require("express-async-handler");
const collection = require("../models/collection");
const { body, validationResult } = require("express-validator");
const Item = require("../models/item");

exports.item_list = asyncHandler(async (req, res, next) => {});
exports.get_item_create = asyncHandler(async (req, res, next) => {
    const allCollections = await collection.find().sort({ name: 1 });
    res.render("item_form", {
        title: "Create Item",
        allCollections: allCollections,
    });
});
exports.post_item_create = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name should be atleast one word"),
    body("description").optional({ values: "falsy" }),
    body("category").optional({ values: "falsy" }),
    body("collection").optional({ values: "falsy" }),
    body("price").optional({ values: "falsy" }),
    body("stock").optional({ values: "falsy" }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            collection: req.body.collection,
            price: req.body.price,
            stock: req.body.stock,
        });
        if (!errors.isEmpty()) {
            const allCollections = await collection.find().sort({ name: 1 });
            res.render("item_form", {
                title: "Create new Item",
                allCollections: allCollections,
                errors: errors.array(),
            });
        } else {
            await item.save();
            res.redirect(`/collection/${req.body.collection}`);
        }
    }),
];

exports.post_item_delete = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id);
    await Item.findByIdAndDelete(req.params.id);
    res.redirect(`/collection/${item.collection}`);
});
