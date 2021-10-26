const dotenv = require('dotenv');
const express = require('express');
require('module-alias/register');
const helmet = require('helmet');
const boardsRouter = require('./src/routes/boards');
const cardsRouter = require('./src/routes/cards');
const authRouter = require('./src/routes/auth');

const app = express();

dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(authRouter);
app.use(boardsRouter);
app.use(cardsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server start on port: ${process.env.PORT}`);
});
