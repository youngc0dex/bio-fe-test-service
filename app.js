const express = require('express');
const morgan = require('morgan');

const jwt = require('jsonwebtoken');
const cors = require('cors');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const loginRouter = require('./routes/loginRoutes');
const testimoniesRouter = require('./routes/testimoniesRoutes');

const app = express();

app.use(
  cors({
    origin: '*'
  })
);

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null)
    return res.status(403).json({
      status: 'fail',
      message: 'Token Tidak Valid'
    });

  jwt.verify(token, '09f26e402586e2faa8da4c98a35f1b20d6b033c6', (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Token Tidak Valid'
      });
    }

    req.user = user;

    next();
  });
}
app.use((req, res, next) => {
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', authenticateToken, tourRouter);
app.use('/api/v1/users', authenticateToken, userRouter);
app.use('/api/v1/testimonies', authenticateToken, testimoniesRouter);
app.use('/api/v1/auam', loginRouter);

module.exports = app;
