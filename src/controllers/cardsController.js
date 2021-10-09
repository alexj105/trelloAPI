const logger = require("../../config/winston");
const fs = require("fs");

exports.createCard = (req, res) => {
  try {
    const boardsJSON = fs.readFileSync(process.env.CARD_DB_PATH, "utf8");
    const boards = JSON.parse(boardsJSON);

    let isBoardForCardExist;

    for (board of boards) {
      if (board.name === req.card.board) {
        isBoardForCardExist = true;
        const cardsJSON = fs.readFileSync(process.env.CARD_DB_PATH, "utf8");
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
};

exports.deleteCard = (req, res) => {
  try {
    const cardsJSON = fs.readFileSync(process.env.CARD_DB_PATH, "utf8");
    const cards = JSON.parse(cardsJSON);
    let result;
    for (card of cards) {
      if (card.name === req.params["name"]) {
        result = card;
        const currentCardIndex = cards.indexOf(result);
        cards.splice(currentCardIndex, 1);
        fs.writeFileSync(
          process.env.CARD_DB_PATH,
          JSON.stringify(cards),
          (err) => {
            if (err) throw err;
          }
        );
        logger.info(`${result.name} was deleted successfully`);
        res.status(201).send("Object was deleted successfully");
      }
    }
    if (!result) throw new Error("Card was not found");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};

exports.updataCard = (req, res) => {
  try {
    const cardsJSON = fs.readFileSync(process.env.CARD_DB_PATH, "utf8");
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
    fs.writeFileSync(process.env.CARD_DB_PATH, JSON.stringify(cards), (err) => {
      if (err) throw err;
    });
    logger.info(`${result.name} was updated successfully`);
    res.status(201).send("Object was updated successfully");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};
