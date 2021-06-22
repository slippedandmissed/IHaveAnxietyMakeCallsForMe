const express = require("express");
const forum = require("./forum");

const router = express.Router();
router.use("/forum", forum);

module.exports = router;