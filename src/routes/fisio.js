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

// (Retorna todos los fisioterapeutas)
router.get("/lista", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query("SELECT * FROM fisioterapeuta", function (error, result) {
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

// (Retorna a un fisioterapeuta por cedula)
router.get("/cedula/:cedulaFisioterapeuta", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var cedula = req.params.cedulaFisioterapeuta;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM fisioterapeuta WHERE fisioterapeuta.cedulaFisioterapeuta = ${cedula}`,
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

// (Crea una nuevo fisioterapeuta)
router.post("/registro", (req, res) => {
  var json = req.body.fisioterapeuta;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "INSERT INTO fisioterapeuta (cedulaFisio, nombre1Fisio, nombre2Fisio, apellido1Fisio, apellido2Fisio, celularFisio, correoFisio, tituloFisio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          json.cedulaFisio,
          json.nombre1Fisio,
          json.nombre2Fisio,
          json.apellido1Fisio,
          json.apellido2Fisio,
          json.celularFisio,
          json.correoFisio,
          json.tituloFisio,
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

// (Actualiza la informacion de un fisioterapeuta)
router.post("/editar", (req, res) => {
  var json = req.body.fisioterapeuta;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "UPDATE fisioterapeuta SET nombre1Fisio = ?, nombre2Fisio = ?, apellido1Fisio = ?, apellido2Fisio = ?, celularFisio = ?, correoFisio = ?, tituloFisio = ? WHERE cedulaFisio = ?",
        [
          json.nombre1Fisio,
          json.nombre2Fisio,
          json.apellido1Fisio,
          json.apellido2Fisio,
          json.celularFisio,
          json.correoFisio,
          json.tituloFisio,
          json.cedulaFisio,
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

// (Elimina un fisioterapeuta)
router.delete("/cedula/:cedulaFisioterapeuta", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var cedula = req.params.cedulaFisioterapeuta;
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `DELETE FROM fisioterapeuta WHERE cedulaFisio = ${cedula}`,
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
