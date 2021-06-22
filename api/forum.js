const express = require("express");
const { requireLogin, db } = require("../common");
const mongodb = require("mongodb");

const router = express.Router();

const RESULTS_PER_PAGE = 10;

router.get("/allposts", requireLogin, (req, res) => {

    const page = req.query.page > 0 ? req.query.page : 0;

    const collection = db.db.collection("posts");

    collection.find({ awarded: { $exists: false } }).project({ onAccept: 0 }).sort({ posted: -1 }).skip(page * RESULTS_PER_PAGE).limit(RESULTS_PER_PAGE).toArray((err, documents) => {
        if (err) {
            res.json({ err });
            return;
        }
        res.json(documents);
    });

});

router.get("/myposts", requireLogin, (req, res) => {

    const collection = db.db.collection("posts");

    collection.find({
        posted_by: req.userid
    }).sort({ posted: -1 }).toArray((err, documents) => {
        if (err) {
            res.json({ err });
            return;
        }
        res.json(documents);
    });

});

router.get("/myoffered", requireLogin, (req, res) => {

    const collection = db.db.collection("posts");

    collection.find({
        "awarded.userid": req.userid
    }).sort({ posted: -1 }).toArray((err, documents) => {
        if (err) {
            res.json({ err });
            return;
        }
        res.json(documents);
    });

});

router.post("/post", requireLogin, async (req, res) => {

    const { title, description, onAccept } = req.body;

    if (!title || !description || !onAccept) {
        res.json({ err: "Please fill in all fields" });
        return;
    }

    const collection = db.db.collection("posts");

    try {
        const result = await collection.insertOne({
            posted_by: req.userid,
            posted_by_name: req.name,
            posted_by_pic: req.picture,
            posted: new Date().getTime(),
            title,
            accepted: [],
            description,
            onAccept
        });
        console.log(result);
        res.json({ post: result.ops[0] });
        return;
    } catch {
        res.json({ err: "Failed to post :(" });
        return;
    }
});

router.get("/deletepost", requireLogin, async (req, res) => {
    const { id } = req.query;
    if (!id) {
        res.json({ err: "No post specified" });
        return;
    }

    const collection = db.db.collection("posts");

    try {
        await collection.deleteOne({
            _id: mongodb.ObjectId(id),
            posted_by: req.userid
        });
        res.json({});
    } catch (err) {
        res.json({ err });
    }

});

router.get("/acceptpost", requireLogin, async (req, res) => {
    const { id } = req.query;
    if (!id) {
        res.json({ err: "No post specified" });
        return;
    }

    const collection = db.db.collection("posts");

    try {
        await collection.updateOne(
            {
                _id: mongodb.ObjectId(id),
            },
            {
                $push: {
                    accepted: { userid: req.userid, name: req.name, pic: req.picture }
                }
            }
        );
        res.json({});
    } catch (err) {
        res.json({ err });
    }

});

router.get("/award", requireLogin, async (req, res) => {
    const { id, offer_id, offer_name, offer_pic } = req.query;
    if (!id) {
        res.json({ err: "No post specified" });
        return;
    }
    if (!offer_id || !offer_name || !offer_pic) {
        res.json({ err: "No helper specified" });
        return;
    }

    const collection = db.db.collection("posts");

    try {
        await collection.updateOne(
            {
                _id: mongodb.ObjectId(id),
                posted_by: req.userid,
                accepted: { userid: offer_id, name: offer_name, pic: offer_pic }
            },
            {
                $set: {
                    awarded: { userid: offer_id, name: offer_name, pic: offer_pic }
                }
            }
        );
        res.json({});
    } catch (err) {
        res.json({ err });
    }

});


module.exports = router;