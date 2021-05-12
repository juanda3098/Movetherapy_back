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

// (Retorna todas las citas)
router.get("/lista", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query("SELECT * FROM cita", function (error, result) {
        if (error) {
          console.log(error);
          res.send("Error Query");
          throw error;
        } else {
          tempConn.release();
          var jsonResult = ""
          result.forEach(function (date, index) {
            date = { ...date, start: `${date.fechaCita}T${date.horaCita}` }
            jsonResult = {...jsonResult, date}
          });
          res.send(jsonResult);
        }
      });
    }
  });
});

// (Retorna una cita por id)
router.get("/id/:idCita", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idCita;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(`SELECT * FROM cita WHERE cita.idCita = ${id}`, function (
        error,
        result
      ) {
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

//
//---Create
//

// (Crea una nueva cita)
router.post("/registro", (req, res) => {
  console.log(req.body);
  var json = req.body.cita;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "INSERT INTO cita (fechaCita, horaCita, observacionCita, fkCedula) VALUES (?, ?, ?, ?)",
        [json.fechaCita, json.horaCita, json.observacionCita, json.fkCedula[0]],
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

// (Actualiza la informacion de una cita)
router.post("/editar", (req, res) => {
  console.log(req.body);
  var json = req.body;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "UPDATE cita SET fechaCita = ?, observacionCita = ?, fechaCreacionRutina = ?, fkPaciente = ? WHERE idCita = ?",
        [json.fechaCita, json.observacionCita, json.fkPaciente, json.idCita],
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

// (Elimina una cita)
router.delete("/id/:idCita", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idRutina;
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(`DELETE FROM cita WHERE idCita = ${id}`, function (
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
