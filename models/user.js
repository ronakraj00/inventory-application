const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true, maxLength: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 4 },
});

module.exports = mongoose.model("User", UserSchema);
