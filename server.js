const express = require("express");
const app = express();
const cors = require("cors");
const contestantsRoutes = require("./routes/contestants");
require("dotenv").config();

const port = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(cors( { origin: process.env.CORS_ORIGIN }));

app.use((req, res, next) => {
    // This API is super protected
    // user must have an API_KEY -> grogu
    // GET /contestants?api_key=grogu
    
    // do some lookup for active API Keys
    // if it is an active API KEY
        // req.userId = userId;

    if (req.query.api_key === process.env.API_KEY) {
        next();
    } else if (!req.query.api_key) {
        res.status(401).json({
            error: "API requires api_key query string"
        })
    } else {
        res.status(403).json({
            error: "Invalid API key"
        })
    }
});

app.use(express.json());

app.use("/contestants", contestantsRoutes);

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
