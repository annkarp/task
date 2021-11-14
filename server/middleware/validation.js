const jwt = require('jsonwebtoken');
const pool = require('../db_pool');

module.exports.tokenValidation = async (req, res, next) => {
  try {
    const token = req.header('authorization').split("Bearer ")[1]
    const errors = { token: "" };

    if (token) {
      jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if (err) {
          errors.token = "token isn't valid";
          res.status(400).json({ errors });
        } else {
          const data = await pool.query(
            'SELECT username FROM users WHERE public_id = $1',
            [decodedToken.public_id]);

          if (data.rows.length === 0) {
            errors.token = "user doesn't exist";
            res.status(400).json({ errors });
          } else {
            next();
          }
        }
      })
    } else {
      errors.token = "user doesn't exist";
      res.status(400).json({ errors });
    }

  } catch (err) {
    console.log(err.message);
  }
};
