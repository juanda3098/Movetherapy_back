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
          console.log(result);
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
  console.log(req.body);
  var json = req.body;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "INSERT INTO fisioterapeuta (cedulaFisioterapeuta, nombre1Fisioterapeuta, nombre2Fisioterapeuta, apellido1Fisioterapeuta, apellido2Fisioterapeuta) VALUES (?, ?, ?, ?, ?)",
        [
          json.cedulaFisioterapeuta,
          json.nombre1Fisioterapeuta,
          json.nombre2Fisioterapeuta,
          json.apellido1Fisioterapeuta,
          json.apellido2Fisioterapeuta,
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

// (Actualiza la informacion de un fisioterapeuta)
router.post("/editar", (req, res) => {
  console.log(req.body);
  var json = req.body;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "UPDATE fisioterapeuta SET nombre1Fisioterapeuta = ?, nombre2Fisioterapeuta = ?, apellido1Fisioterapeuta = ?, apellido2Fisioterapeuta = ? WHERE idFisioterapeuta = ?",
        [
          json.nombre1Fisioterapeuta,
          json.nombre2Fisioterapeuta,
          json.apellido1Fisioterapeuta,
          json.apellido2Fisioterapeuta,
          json.idFisioterapeuta,
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

// (Elimina un fisioterapeuta)
router.delete("/cedula/:cedulaFisioterapeuta", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var cedula = req.params.cedulaFisioterapeuta;
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `DELETE FROM fisioterapeuta WHERE cedulaFisioterapeuta = ${cedula}`,
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

module.exports = router;
