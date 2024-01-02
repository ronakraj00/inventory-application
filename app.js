require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: process.env.secret,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
const authUser = async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Incorrect Password" });
                }
            });
        } else {
            return done(null, false, { message: "Email was not found" });
        }
    } catch (err) {
        return done(err);
    }
};

passport.use(new LocalStrategy({ usernameField: "email" }, authUser));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

mongoose.set("strictQuery", false);
const dev_db_url =
    "mongodb+srv://admin:ronakraj1@cluster0.bjksk03.mongodb.net/inventory?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4,
    });
    console.log("connected");
}

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
