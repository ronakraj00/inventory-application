const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 500 },
    createdAt: Date,
});

CollectionSchema.virtual("url").get(function () {
    return `/collection/${this._id}`;
});

module.exports = mongoose.model("Collection", CollectionSchema);
