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

// (Retorna todos los pacientes)
router.get("/lista", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query("SELECT * FROM paciente", function (error, result) {
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

// (Retorna a un paciente por nombre)
router.get("/nombre/:nombrePaciente", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var nombre = req.params.nombrePaciente;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM paciente WHERE Paciente.nombrePaciente = ${nombre}`,
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

// (Retorna a un paciente por cedula)
router.get("/cedula/:cedulaPaciente", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var cedula = req.params.cedulaPaciente;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM paciente WHERE paciente.cedulaPaciente = ${cedula}`,
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

// (Crea una nuevo paciente)
router.post("/registro", (req, res) => {
  console.log(req.body);
  var json = req.body.actionPatient;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "INSERT INTO paciente (cedulaPaciente, nombre1Paciente, nombre2Paciente, apellido1Paciente, apellido2Paciente, celularPaciente, correoPaciente, contrasenaPaciente, fechaNacimientoPaciente, practicaDeporte) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          json.cedulaPaciente,
          json.nombre1Paciente,
          json.nombre2Paciente,
          json.apellido1Paciente,
          json.apellido2Paciente,
          json.celularPaciente,
          json.correoPaciente,
          json.contrasenaPaciente,
          json.fechaNacimientoPaciente,
          json.practicaDeporte,
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

// (Actualiza la informacion de un paciente)
router.post("/editar", (req, res) => {
  console.log(req.body);
  var json = req.body.actionPatient;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "UPDATE paciente SET cedulaPaciente = ?, nombre1Paciente = ?, nombre2Paciente = ?, apellido1Paciente = ?, apellido2Paciente = ?, celularPaciente = ?, telefonoPaciente = ?, correoPaciente = ?, contrasenaPaciente = ?, fechaNacimientoPaciente = ?, practicaDeporte = ? WHERE idPaciente = ?",
        [
          json.cedulaPaciente,
          json.nombre1Paciente,
          json.nombre2Paciente,
          json.apellido1Paciente,
          json.apellido2Paciente,
          json.celularPaciente,
          json.telefonoPaciente,
          json.correoPaciente,
          json.contrasenaPaciente,
          json.fechaNacimientoPaciente,
          json.practicaDeporte,
          json.idPaciente,
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

// (Elimina un paciente)
router.delete("/cedula/:cedulaPaciente", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var cedula = req.params.cedulaPaciente;
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `DELETE FROM paciente WHERE cedulaPaciente = ${cedula}`,
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
