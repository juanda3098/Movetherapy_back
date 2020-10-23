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

// (Retorna todas las sesiones)
router.get("/lista", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query("SELECT * FROM sesion", function (error, result) {
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

// (Retorna una sesion por id)
router.get("/id/:idSesion", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idSesion;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM sesion WHERE sesion.idSesion = ${id}`,
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

// (Retorna las sesion por id)
router.get("/fecha/:fecha", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var timestamp = req.params.fecha;
    var dateMin = new Date(timestamp * 1000);
    dateMin.setHours(0);
    dateMin.setMinutes(0);
    dateMin.setSeconds(0);
    dateMin.setMilliseconds(0);
    console.log(dateMin.getTime() / 1000);
    var dateMax = new Date(timestamp * 1000);
    dateMax.setHours(23);
    dateMax.setMinutes(59);
    dateMax.setSeconds(59);
    dateMax.setMilliseconds(99);
    console.log(dateMax.getTime() / 1000);
    var timestampMin = dateMin.getTime() / 1000;
    var timestampMax = dateMax.getTime() / 1000;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM sesion WHERE sesion.fechaSesion BETWEEN ${timestampMin} and ${timestampMax}`,
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

// (Crea una nueva sesion)
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
        "INSERT INTO sesion (fechaSesion, duracionSesion, fkCita, fkRutina, fkFisioterapeuta) VALUES (?, ?, ?, ?, ?)",
        [
          timestamp,
          json.duracionSesion,
          fkCita,
          json.fkRutina,
          json.fkFisioterapeuta,
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
//---Update
//

// (Actualiza la informacion de una sesion)
router.post("/editar", (req, res) => {
  console.log(req.body);
  var json = req.body;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "UPDATE sesion SET fechaSesion = ?, duracionSesion = ?, fkCita = ?, fkRutina = ?, fkFisioterapeuta = ? WHERE idSesion = ?",
        [
          json.fechaSesion,
          json.duracionSesion,
          json.fkCita,
          json.fkRutina,
          json.fkFisioterapeuta,
          json.idSesion,
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

// (Elimina una sesion)
router.delete("/id/:idSesion", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idSesion;
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(`DELETE FROM sesion WHERE idSesion = ${id}`, function (
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
