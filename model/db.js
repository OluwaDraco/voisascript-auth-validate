// const test = require('dotenv').config()
const mysql = require("mysql2");
// const { Unique } = require('../utils/generate-random')

let db_URL = process.env.DATABASE_URL;
const connection = mysql.createConnection(db_URL);

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("successfully connected 👍👍");
});

async function getAll() {
  const query_string = `SELECT * FROM Users`;
  connection.query(query_string, (err, rows) => {
    if (err) {
      return 500;
    }
    return rows;
  });
}

async function createNewUser({ Full_Name, Email, Username, Password }) {
  const query_string_1 = `SELECT * FROM Users WHERE Full_Name='${Full_Name}' AND Username='${Username}'`;
  const query_string_2 = `INSERT INTO Users (Full_Name, Email, Username, Password)
    VALUES ('${Full_Name}', '${Email}', '${Username}', '${Password}')`;
  connection.query(query_string_1, (err, rows) => {
    if (err) return 500;
    if (rows && rows.length > 0) {
      return 419;
    }
    connection.query(query_string_2, (err, rows) => {
      if (err) return 500;
      if (rows && rows.insertId) {
        return 200;
      }
      return 500;
    });
  });
}

async function UpdateUser({ id, Full_Name, Email, Username, Password }) {
  const query_string_1 = `SELECT * FROM Users WHERE id='${id}'`;
  const query_string_2 = `UPDATE Users 
    SET Full_Name='${Full_Name}', Email='${Email}', Username='${Username}', Password='${Password}' 
    WHERE id=${id}`;
  connection.query(query_string_1, (err, rows) => {
    if (err) return 500;
    if (rows.length == 0) {
      return 404;
    }
    connection.query(query_string_2, (err, rows) => {
      if (err) return 500;
      if (rows && rows.insertId == 0) {
        return 200;
      }
      return 500;
    });
  });
}

async function DeleteUser({ id }) {
  const query_string_1 = `SELECT * FROM Users WHERE id='${id}'`;
  const query_string_2 = `delete from Users where id='${id}'`;
  connection.query(query_string_1, (err, rows) => {
    if (err) return 500;
    if (rows.length == 0) {
      return 404;
    }
    connection.query(query_string_2, (err, rows) => {
      if (err) return 500;
      if (rows && rows.insertId == 0) {
        return 200;
      }
      return 500;
    });
  });
}

/* DeleteUser({id: 2}, (err, result) => {
    if (err) {
        return console.error(err)
    }
    console.log(result)
}) */

module.exports = { getAll, createNewUser, UpdateUser, DeleteUser };
