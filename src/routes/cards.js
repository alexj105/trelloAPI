const express = require("express");
const router = new express.Router();
const fs = require("fs");
const CardSchema = require("../models/card");
const validation = require("../middleware/validation");
const logger = require("../../config/winston");
let a = 0;
router.post("/card/create", validation(CardSchema, "card"), (req, res) => {
  try {
    const boardsJSON = fs.readFileSync("src/db/boards.json", "utf8");
    const boards = JSON.parse(boardsJSON);

    let isBoardForCardExist;

    for (board of boards) {
      if (board.name === req.card.board) {
        isBoardForCardExist = true;
        const cardsJSON = fs.readFileSync("src/db/cards.json", "utf8");
        const cards = JSON.parse(cardsJSON);

        if (cards.length) {
          for (card of cards) {
            if (card.name === req.card.name) {
              throw new Error("Object already exist");
            }
          }
        }

        const newCard = req.card;
        cards.push(newCard);
        fs.writeFileSync(
          "./src/db/cards.json",
          JSON.stringify(cards),
          (err) => {
            if (err) throw err;
          }
        );
        logger.info(`${newCard.name} was created successfully`);
        res.status(201).send("Object was created successfully");
      }
    }

    if (!isBoardForCardExist) throw new Error("Board was not founded");
  } catch (error) {
    logger.error(error.message);
    res.status(409).send(error.message);
  }
});

router.delete("/card/:name", (req, res) => {
  try {
    const cardsJSON = fs.readFileSync("src/db/cards.json", "utf8");
    const cards = JSON.parse(cardsJSON);
    let result;
    for (card of cards) {
      if (card.name === req.params["name"]) {
        result = card;
        const currentCardIndex = cards.indexOf(result);
        cards.splice(currentCardIndex, 1);
        fs.writeFileSync("src/db/cards.json", JSON.stringify(cards), (err) => {
          if (err) throw err;
        });
        logger.info(`${result.name} was deleted successfully`);
        res.status(201).send("Object was deleted successfully");
      }
    }
    if (!result) throw new Error("Card was not found");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
});

router.patch(
  "/card/update/:name",
  validation(CardSchema, "card"),
  (req, res) => {
    try {
      const cardsJSON = fs.readFileSync("./src/db/cards.json", "utf8");
      const cards = JSON.parse(cardsJSON);
      let result;
      for (card of cards) {
        if (card.name === req.params["name"]) {
          result = card;
        }
      }
      if (!result) throw new Error(`${req.params["name"]} doesn't exist`);

      const currentCardIndex = cards.indexOf(result);
      cards[currentCardIndex] = { ...result, ...req.card };
      fs.writeFileSync("./src/db/cards.json", JSON.stringify(cards), (err) => {
        if (err) throw err;
      });
      logger.info(`${result.name} was updated successfully`);
      res.status(201).send("Object was updated successfully");
    } catch (error) {
      logger.error(error.message);
      res.status(404).send(error.message);
    }
  }
);

module.exports = router;
