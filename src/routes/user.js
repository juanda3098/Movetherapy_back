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

// (Retorna todas las citas de un paciente)
router.get("/citas/:idPaciente", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idPaciente;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM cita INNER JOIN paciente on cita.fkPaciente = paciente.idPaciente WHERE paciente.idPaciente = ${id}`,
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

// (Retorna las rutinas de un paciente)
router.get("/rutina/:idPaciente", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idPaciente;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM rutina, rutina_ejercicio, ejercicio 
        INNER JOIN rutina_ejercicio ON rutina_ejercicio.fkRutina = rutina.idRutina
        INNER JOIN ejercicio ON ejercicio.idEjercicio = rutina_ejercicio.fkEjercicio
        INNER JOIN sesion ON sesion.fkRutina = rutina.idRutina
        INNER JOIN cita ON cita.idCita = sesion.fkCita
        INNER JOIN paciente ON paciente.idPaciente = cita.fkPaciente
        WHERE paciente.idPaciente = ${id}`,
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

module.exports = router;
