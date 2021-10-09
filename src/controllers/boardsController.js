const fs = require("fs");
const logger = require("../../config/winston");

exports.createBoard = (req, res) => {
  try {
    const boardsJSON = fs.readFileSync(process.env.BOARD_DB_PATH, "utf8");
    const boards = JSON.parse(boardsJSON);
    for (const board of boards) {
      if (board.name === req.board.name) {
        throw new Error("Object already exist");
      }
    }
    const newBoard = req.board;
    boards.push(newBoard);
    fs.writeFileSync(
      process.env.BOARD_DB_PATH,
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
};

exports.getBoardCards = (req, res) => {
  try {
    const { board_name } = req.query;

    const cardsJSON = fs.readFileSync(process.env.CARD_DB_PATH, "utf8");
    const cards = JSON.parse(cardsJSON);
    const result = cards.filter((card) => card.board === board_name);
    res.status(200).send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};

exports.getAllBoards = (req, res) => {
  try {
    const boardsJSON = fs.readFileSync(process.env.BOARD_DB_PATH, "utf8");
    const boards = JSON.parse(boardsJSON);
    res.status(200).send(boards);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};

exports.getBoardByName = (req, res) => {
  try {
    const boardsJSON = fs.readFileSync(process.env.BOARD_DB_PATH, "utf8");
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
};

exports.deleteBoard = (req, res) => {
  try {
    const boardsJSON = fs.readFileSync(process.env.BOARD_DB_PATH, "utf8");
    const boards = JSON.parse(boardsJSON);
    let result;

    for (const board of boards) {
      if (board.name === req.params.name) {
        result = board;
        const currentBoatIndex = boards.indexOf(result);
        boards.splice(currentBoatIndex, 1);
        fs.writeFileSync(
          process.env.BOARD_DB_PATH,
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
};

exports.updateBoard = (req, res) => {
  try {
    const boardsJSON = fs.readFileSync(process.env.BOARD_DB_PATH, "utf8");
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
    fs.writeFileSync(
      process.env.BOARD_DB_PATH,
      JSON.stringify(boards),
      (err) => {
        if (err) throw err;
      }
    );
    logger.info(`${result.name} was updated successfully`);
    res.status(204).send("Object was updated successfully");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};
