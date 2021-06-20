const express = require("express");
const app = express();
const port = process.env.PORT || 3000;


app.enable('trust proxy');
app.use(express.static("./frontend/dist/frontend"));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});