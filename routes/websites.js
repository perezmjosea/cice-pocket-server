const express = require("express");
const router = express.Router();

let dbClient = null;

router.get("/list", (req, res) => {
  dbClient.find({}).toArray((err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({ list: data });
  });
});

router.post("/create", async (req, res) => {
  // Recojo los params de la petición (cuerpo)
  const urlWeb = req.body.url;

  const insertion = await dbClient
    .insertOne({
      url: urlWeb
    })
    .catch(err => res.status(500).json({ error: err.message }));

  return res.status(201).json({
    url: urlWeb
  });
});

module.exports = {
  router,
  setMongoClient: client => (dbClient = client.collection("sites"))
};
