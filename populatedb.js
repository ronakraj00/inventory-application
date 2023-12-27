#! /usr/bin/env node

console.log(
    'This script populates some test items and collections to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Collection = require("./models/collection");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCollections();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function collectionsCreate(name, description) {
    const collection = new Collection({ name: name, description: description });
    await collection.save();
    console.log(`Added collection: ${name}`);
}

async function itemsCreate(name,description,collection,price,stock) {
    const itemdetail = { name:name,description:description,collection:collection,price:price,stock:stock };
    const item = new Item(itemdetail);

    await item.save();
    console.log(`Added item: ${name}`);
}


async function createItems() {
    console.log("Adding genre");
    let collect=await Collection.findOne({name:"collection1"});
    await Promise.all([
        itemsCreate("item1", "this item is for test", collect, 20, 100),
    ]);
}

async function createCollections() {
    console.log("Adding collection");
    await Promise.all([
        collectionsCreate(
            "collection1",
            "this collection is for testing purpose"
        ),
    ]);
}
