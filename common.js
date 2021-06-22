const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();

const CLIENT_ID = "157306449770-4hdgcgpnubvgl3vm58lm45q228o5vcjj.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = { client: mongoClient };

const validateToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });

        const payload = ticket.getPayload();
        return payload;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const requireLogin = async (req, res, next) => {
    if (!req.query?.token && !req.body?.token) {
        res.sendStatus(401);
        return;
    }
    const token = req.query.token || req.body.token;

    const payload = await validateToken(token);

    if (payload) {
        req.userid = payload["sub"];
        req.name = payload["name"];
        req.picture = payload["picture"];
        next();
    } else {
        res.sendStatus(401);
    }
};

module.exports = { db, requireLogin, validateToken };
