const logger = require("../../config/winston");
const fs = require("fs");

const CardService = require("../services/cardService");

exports.createCard = (req, res) => {
  try {
    CardService.create(req.body);
    logger.info(`${req.body.name} was created successfully`);
    res.status(201).send("Object was created successfully");

    if (!isBoardForCardExist) throw new Error("Board was not founded");
  } catch (error) {
    logger.error(error.message);
    res.status(409).send(error.message);
  }
};

exports.deleteCard = (req, res) => {
  try {
    const deletedCard = CardService.deleteCard(req.params.name);
    if (!deletedCard) throw new Error("Card was not deleted");
    logger.info(`${req.params.name} was deleted successfully`);
    res.status(201).send("Object was deleted successfully");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};

exports.updataCard = (req, res) => {
  try {
    CardService.updateCard(req.params["name"], req.card);
    logger.info(`Card was updated successfully`);
    res.status(201).send("Card was updated successfully");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};
