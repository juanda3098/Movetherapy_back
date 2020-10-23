const { Router } = require("express");
const router = Router();
const mysql = require("mysql");
const creds = require("./variables");

const connection = mysql.createPool({
  connectionLimit: 500,
  host: creds.host,
  user: creds.user,
  password: creds.pass,
  database: creds.db,
  port: creds.port,
});

//
//---Read
//

// (Retorna todas las rutinas)
router.get("/lista", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query("SELECT * FROM rutina", function (error, result) {
        if (error) {
          console.log(error);
          res.send("Error Query");
          throw error;
        } else {
          tempConn.release();
          console.log(result);
          res.send(result);
        }
      });
    }
  });
});

// (Retorna a una rutina por nombre)
router.get("/nombre/:nombreRutina", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var nombre = req.params.nombreRutina;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM rutina WHERE rutina.nombreRutina = ${nombre}`,
        function (error, result) {
          if (error) {
            console.log(error);
            res.send("Error Query");
            throw error;
          } else {
            tempConn.release();
            console.log(result);
            res.send(result);
          }
        }
      );
    }
  });
});

//
//---Create
//

// (Crea una nueva rutina)
router.post("/registro", (req, res) => {
  console.log(req.body);
  var json = req.body;
  var timestamp = Math.floor(Date.now() / 1000);
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "INSERT INTO rutina (nombreRutina, descripcionRutina, fechaCreacionRutina) VALUES (?, ?, ?)",
        [json.nombreRutina, json.descripcionRutina, timestamp],
        function (error, result) {
          if (error) {
            res.send("Error Query");
            throw error;
          } else {
            tempConn.release();
            res.send("Query Exitoso " + result);
          }
        }
      );
    }
  });
});

//
//---Update
//

// (Actualiza la informacion de una rutina)
router.post("/editar", (req, res) => {
  console.log(req.body);
  var json = req.body;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "UPDATE rutina SET nombreRutina = ?, descripcionRutina = ?, fechaCreacionRutina = ? WHERE idRutina = ?",
        [
          json.nombreRutina,
          json.descripcionRutina,
          json.fechaCreacionRutina,
          json.idRutina,
        ],
        function (error, result) {
          if (error) {
            res.send("Error Query");
            throw error;
          } else {
            tempConn.release();
            res.send("Query Exitoso " + result);
          }
        }
      );
    }
  });
});

//
//---Delete
//

// (Elimina un rutina)
router.delete("/id/:idRutina", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idRutina;
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(`DELETE FROM rutina WHERE idRutina = ${id}`, function (
        error,
        result
      ) {
        if (error) {
          res.send("Error Query");
          throw error;
        } else {
          tempConn.release();
          res.send("Query Exitoso " + result);
        }
      });
    }
  });
});

module.exports = router;
