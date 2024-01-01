const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.get_log_in = asyncHandler((req, res, next) => {
    res.render("login_form", { title: "Log In Form" });
});

exports.post_log_in = [
    body("email")
        .trim()
        .escape()
        .custom(async (value) => {
            const user = User.findOne({ email: value });
            if (user) {
                return true;
            } else {
                throw new Error("Email does not exists So try To sign up");
            }
        }),
    body("password").trim().escape(),
    asyncHandler(async (req, res, next) => {}),
];

exports.get_sign_up = asyncHandler(async (req, res, next) => {
    res.render("sign_up_form", { title: "Sign Up" });
});

exports.post_sign_up = [
    body("name")
        .trim()
        .escape()
        .isLength({ max: 30 })
        .withMessage("Name must be less than 30 characters."),
    body("email")
        .trim()
        .escape()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("Email Already Exists");
            } else true;
        })
        .withMessage("email already exist so try to Login."),
    body("password")
        .trim()
        .escape()
        .isLength({ min: 4 })
        .withMessage("password must be atleast 4 character"),
    body("confirmpassword")
        .trim()
        .escape()
        .custom((value, { req }) => {
            return value == req.body.password;
        })
        .withMessage("Both passwords do not Match"),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            });
            if (errors.isEmpty()) {
                await user.save();
                res.redirect("/");
            } else {
                res.render("sign_up_form", {
                    title: "Sign Up form",
                    errors: errors.array(),
                });
            }
        });
    }),
];
