const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 30,
    },
    description: {
        type: String,
        maxLength: 500,
    },
    img: { type: Buffer },
    collection: {
        type: Schema.Types.ObjectId,
        ref: "Collection",
        required: true,
    },
    category: [String],
    price: { type: Number },
    stock: { type: Number },
});

ItemSchema.virtual("url").get(function () {
    return `/${this.collection}/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
