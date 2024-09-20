const express = require("express");
const mongoose = require("mongoose");
const cors  = require("cors");

mongoose.connect(
  "mongodb+srv://bittukarthik77:U3rmh5fn1jT8S2Eh@cluster0.axn1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const Url = require("./model/urlModel");

const app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, () => console.log(`Server Running At http://localhost:3000`));



app.post("/shortenUrl", async (req, res) => {
  let { originalUrl } = req.body;
  const base = `http://localhost:3000`;

  console.log(req.body);
  if (
    !originalUrl.startsWith("http://") &&
    !originalUrl.startsWith("https://")
  ) {
    originalUrl = "http://" + originalUrl;
  }
  

  try {
    const existingUrl = await Url.findOne({ originalUrl: originalUrl });
    if (existingUrl) {
      return res.json({ shortUrl: existingUrl.shortUrl });
    }

    const alphas =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUUVWXYZ1234567890";
    let shortUrl = "";
    for (let i = 0; i < 6; i++) {
      shortUrl += alphas.charAt(Math.floor(Math.random() * alphas.length));
    }
    await Url.create({ originalUrl, shortUrl });
    res.status(201).json({
      originalUrl,
      shortUrl: `${base}/${shortUrl}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  console.log(shortUrl);
  try {
    const url = await Url.findOne({ shortUrl: shortUrl });
    console.log(url);
    if (url) {
      url.clicks++;
      await url.save();
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;
