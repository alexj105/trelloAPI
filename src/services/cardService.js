const fs = require("fs");
const logger = require("../../config/winston");
const { getAllBoards } = require("./boardService");

const getAllCards = () => {
  try {
    const cardsJSON = fs.readFileSync(process.env.CARD_DB_PATH, "utf8");
    const cards = JSON.parse(cardsJSON);
    return cards || [];
  } catch (error) {
    logger.error(error.message);
    console.error(error.message);
  }
};

const findByName = () => {};

const create = (card) => {
  try {
    let boards = require("./boardService").getAllBoards();
    let findBoard = boards.find((board) => {
      return board.name == card.board;
    });
    if (findBoard) throw new Error("The board for this card was not finded");

    let cards = getAllCards();

    let findCard = cards.find((cardItem) => {
      return cardItem.name == card.name;
    });

    if (findCard) {
      throw new Error("Object already exist");
    } else {
      cards.push(card);
      fs.writeFileSync(
        process.env.CARD_DB_PATH,
        JSON.stringify(cards),
        (err) => {
          if (err) throw err;
        }
      );
      return card;
    }
  } catch (error) {
    throw error;
    logger.error(error.message);
  }
};

const deleteCard = (cardName) => {
  try {
    let cards = getAllCards(cardName);

    let findCard = cards.find((cardItem) => {
      return cardItem.name == cardName;
    });

    if (!findCard) {
      throw new Error("Card doesn't exist");
    } else {
      const currentCardIndex = cards.indexOf(findCard);
      cards.splice(currentCardIndex, 1);
      fs.writeFileSync(
        process.env.CARD_DB_PATH,
        JSON.stringify(cards),
        (err) => {
          if (err) throw err;
        }
      );
      return findCard;
    }
  } catch (error) {
    throw error;
    logger.error(error.message);
  }
};

const updateCard = (cardName, newCard) => {
  try {
    let cards = getAllCards(cardName);

    let findCard = cards.find((cardItem) => {
      return cardItem.name == cardName;
    });

    if (!findCard) {
      throw new Error("Card doesn't exist");
    } else {
      const currentCardIndex = cards.indexOf(findCard);
      cards[currentCardIndex] = { ...findCard, ...newCard };
      fs.writeFileSync(
        process.env.CARD_DB_PATH,
        JSON.stringify(cards),
        (err) => {
          if (err) throw err;
        }
      );
      return findCard;
    }
  } catch (error) {
    throw error;
    logger.error(error.message);
  }
};

module.exports = { getAllCards, create, deleteCard, updateCard };
