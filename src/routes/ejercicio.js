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

// (Retorna todos los ejercicios)
router.get("/lista", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query("SELECT * FROM ejercicio", function (error, result) {
        if (error) {
          console.log(error);
          res.send("Error Query");
          throw error;
        } else {
          tempConn.release();
          res.send(result);
        }
      });
    }
  });
});

// (Retorna a un ejercicio por descripcion)
router.get("/descripcion/:descripcion", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var descripcion = req.params.descripcion;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM ejercicio WHERE ejercicio.descripcionEjercicio = ${descripcion}`,
        function (error, result) {
          if (error) {
            console.log(error);
            res.send("Error Query");
            throw error;
          } else {
            tempConn.release();
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

// (Crea una nuevo ejercicio)
router.post("/registro", (req, res) => {
  var json = req.body.ejercicio;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "INSERT INTO ejercicio (nombreEjercicio, descripcionEjercicio, linkVideo, seriesEjercicio, repeticionesEjercicio) VALUES (?, ?, ?, ?, ?)",
        [
          json.nombreEjercicio,
          json.descripcionEjercicio,
          json.linkVideo,
          json.seriesEjercicio,
          json.repeticionesEjercicio,
        ],
        function (error, result) {
          if (error) {
            res.send("failed");
            throw error;
          } else {
            tempConn.release();
            res.send("success");
          }
        }
      );
    }
  });
});

//
//---Update
//

// (Actualiza la informacion de un ejercicio)
router.post("/editar", (req, res) => {
  var json = req.body.ejercicio;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "UPDATE ejercicio SET nombreEjercicio = ?, descripcionEjercicio = ?, linkVideo = ?, seriesEjercicio = ?, repeticionesEjercicio = ? WHERE idEjercicio = ?",
        [
          json.nombreEjercicio,
          json.descripcionEjercicio,
          json.linkVideo,
          json.seriesEjercicio,
          json.repeticionesEjercicio,
          json.idEjercicio,
        ],
        function (error, result) {
          if (error) {
            res.send("failed");
            throw error;
          } else {
            tempConn.release();
            res.send("success");
          }
        }
      );
    }
  });
});

//
//---Delete
//

// (Elimina un ejercicio)
router.delete("/id/:idEjercicio", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idEjercicio;
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `DELETE FROM ejercicio WHERE idEjercicio = ${id}`,
        function (error, result) {
          if (error) {
            res.send("failed");
            throw error;
          } else {
            tempConn.release();
            res.send("success");
          }
        }
      );
    }
  });
});

module.exports = router;
