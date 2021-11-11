const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
})

pool.connect((err) =>{
  if(err) {
    console.log(err);
  }
})

module.exports = pool;
