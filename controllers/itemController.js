const asyncHandler = require("express-async-handler");
const collection = require("../models/collection");
const { body, validationResult } = require("express-validator");
const Item = require("../models/item");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/");
    },
    filename: function (req, file, cb) {
        cb(null, "localimage" + Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

exports.item_list = asyncHandler(async (req, res, next) => {});
exports.get_item_create = asyncHandler(async (req, res, next) => {
    const allCollections = await collection.find().sort({ name: 1 });
    res.render("item_form", {
        title: "Create Item",
        allCollections: allCollections,
    });
});
exports.post_item_create = [
    upload.single("img"),
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
            img: req.file ? req.file.filename : req.body.imgUrl,
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

exports.post_item_delete = [
    (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    },
    asyncHandler(async (req, res, next) => {
        const item = await Item.findById(req.params.id);
        await Item.findByIdAndDelete(req.params.id);
        res.redirect(`/collection/${item.collection}`);
    }),
];

exports.get_item_update = [
    (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    },
    asyncHandler(async (req, res, next) => {
        const id = req.params.id;
        const allCollections = await collection.find().sort({ name: 1 });
        const item = await Item.findById(id);
        if (item) {
            res.render("item_form", {
                title: "Create Item",
                allCollections: allCollections,
                item: item,
            });
        } else {
            res.render("/");
        }
    }),
];

exports.post_item_update = [
    (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    },
    upload.single("img"),
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
            _id:req.params.id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            collection: req.body.collection,
            price: req.body.price,
            stock: req.body.stock,
            img: req.file ? req.file.filename : req.body.imgUrl,
        });
        if (!errors.isEmpty()) {
            const allCollections = await collection.find().sort({ name: 1 });
            res.render("item_form", {
                title: "Create new Item",
                allCollections: allCollections,
                errors: errors.array(),
            });
        } else {
            await Item.findByIdAndUpdate(req.params.id, item, {});
            res.redirect(`/collection/${req.body.collection}`);
        }
    }),
];
