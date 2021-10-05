const express = require("express");

const router = new express.Router();
const fs = require("fs");
const BoardSchema = require("../models/board");
const validation = require("../middleware/validation");
const logger = require("../../config/winston");
const Role = require("../helpers/role");
const authorize = require("../middleware/authorize");

router.post(
  "/board/create",
  [authorize(Role.Admin), validation(BoardSchema, "board")],
  (req, res) => {
    try {
      const boardsJSON = fs.readFileSync("src/db/boards.json", "utf8");
      const boards = JSON.parse(boardsJSON);
      for (const board of boards) {
        if (board.name === req.board.name) {
          throw new Error("Object already exist");
        }
      }
      const newBoard = req.board;
      boards.push(newBoard);
      fs.writeFileSync(
        "./src/db/boards.json",
        JSON.stringify(boards),
        (err) => {
          if (err) throw err;
        }
      );
      logger.info(`${newBoard.name} was created successfully`);
      res.status(201).send("Object was created successfully");
    } catch (error) {
      logger.error(error.message);
      res.status(409).send(error.message);
    }
  }
);

router.get("/board/cards", (req, res) => {
  try {
    const { board_name } = req.query;

    const cardsJSON = fs.readFileSync("src/db/cards.json", "utf8");
    const cards = JSON.parse(cardsJSON);
    const result = cards.filter((card) => card.board === board_name);
    res.status(200).send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
});

router.get("/board/all", (req, res) => {
  try {
    const boardsJSON = fs.readFileSync("./src/db/boards.json", "utf8");
    const boards = JSON.parse(boardsJSON);
    res.status(200).send(boards);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
});

router.get("/board/:name", (req, res) => {
  try {
    const boardsJSON = fs.readFileSync("./src/db/boards.json", "utf8");
    const boards = JSON.parse(boardsJSON);
    let result;
    for (const board of boards) {
      if (board.name === req.params.name) {
        result = board;
        res.status(200).send(result);
      }
    }
    if (!result) throw new Error(`${req.params.name} doesn't exist`);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
});

router.delete("/board/:name", authorize(Role.Admin), (req, res) => {
  try {
    const boardsJSON = fs.readFileSync("./src/db/boards.json", "utf8");
    const boards = JSON.parse(boardsJSON);
    let result;

    for (const board of boards) {
      if (board.name === req.params.name) {
        result = board;
        const currentBoatIndex = boards.indexOf(result);
        boards.splice(currentBoatIndex, 1);
        fs.writeFileSync(
          "./src/db/boards.json",
          JSON.stringify(boards),
          (err) => {
            if (err) throw err;
          }
        );
        logger.info(`${result.name} was deleted successfully`);
        res.status(201).send("Object was deleted successfully");
      }
    }
    if (!result) throw new Error("Board was not found");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
});

router.patch("/board/:name", validation(BoardSchema, "board"), (req, res) => {
  try {
    const boardsJSON = fs.readFileSync("./src/db/boards.json", "utf8");
    const boards = JSON.parse(boardsJSON);
    let result;
    for (const board of boards) {
      if (board.name === req.params.name) {
        result = board;
      }
    }
    if (!result) throw new Error(`${req.params.name} doesn't exist`);

    const currentBoardIndex = boards.indexOf(result);
    boards[currentBoardIndex] = { ...result, ...req.board };
    fs.writeFileSync("./src/db/boards.json", JSON.stringify(boards), (err) => {
      if (err) throw err;
    });
    logger.info(`${result.name} was updated successfully`);
    res.status(204).send("Object was updated successfully");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
});

module.exports = router;
