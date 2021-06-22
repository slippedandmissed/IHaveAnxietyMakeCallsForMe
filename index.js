`use strict`

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const api = require("./api");
require("dotenv").config();

const port = process.env.PORT || 3000;
const { db } = require("./common");

app.enable('trust proxy');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.use("/api", api);

app.use(router);

app.use((req, res, next) => {
    req.method = "GET";
    next();
});

const _app_folder = './frontend/dist/frontend';

app.get('*.*', express.static(_app_folder, { maxAge: '1y' }));
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, { root: _app_folder });
});

db.client.connect(function (err) {
    if (err) {
        console.error(err);
        return;
    }

    db.db = db.client.db("ihaveanxiety");

    http.listen(port, () => {
        console.log(`Listening on port ${port}`)
    });
});
