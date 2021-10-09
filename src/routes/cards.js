const express = require("express");
const router = new express.Router();
const CardSchema = require("../models/card");
const validation = require("../middleware/validation");
const cardController = require("../controllers/cardsController");

router.post(
  "/card/create",
  validation(CardSchema, "card"),
  cardController.createCard
);

router.delete("/card/:name", cardController.deleteCard);

router.patch(
  "/card/update/:name",
  validation(CardSchema, "card"),
  cardController.updataCard
);

module.exports = router;
