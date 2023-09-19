// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
  const allowedOrigins = ["http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.enable("trust proxy");

app.post("/api/fetchStockData", async (req, res) => {
  // YOUR CODE GOES HERE, PLEASE DO NOT EDIT ANYTHING OUTSIDE THIS FUNCTION
  try {
    console.log("Inside fetchStockData api");
    const { stock, date } = req.body;
    const stockApiKey = process.env.POLYGON_API_KEY;
    const polygonUrl = `https://api.polygon.io/v1/open-close/${stock}/${date}?adjusted=true&apiKey=${stockApiKey}`;
    const { data } = await axios.get(polygonUrl);
    const dataObj = {
      open: data.open,
      high: data.open,
      low: data.low,
      close: data.close,
      volume: data.volume,
    };
    res.status(200).send({
      status: "success",
      data: dataObj,
    });
  } catch (error) {
    res.status(error.response.status).send({
      status: error.response.data.status,
      message: error.response.data.error,
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
