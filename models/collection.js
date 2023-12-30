const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 500 },
    createdAt: { type: Date },
});

CollectionSchema.virtual("url").get(function () {
    return `/collection/${this._id}`;
});
CollectionSchema.virtual("createdAt_formatted").get(function () {
    return this.createdAt
        ? DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
        : "";
});

module.exports = mongoose.model("Collection", CollectionSchema);
