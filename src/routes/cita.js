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
      tempConn.query(
        "SELECT * FROM cita INNER JOIN paciente ON cita.fkCedula = paciente.cedulaPaciente",
        function (error, result) {
          if (error) {
            console.log(error);
            res.send("Error Query");
            throw error;
          } else {
            tempConn.release();
            var jsonResult = [];
            result.map((cita) => {
              cita = {
                ...cita,
                start: `${cita.fechaCita}T${cita.horaCita}`,
              };
              cita = {
                ...cita,
                title: `${cita.nombre1Paciente} ${cita.nombre2Paciente} ${cita.apellido1Paciente} ${cita.apellido2Paciente}`,
              };
              jsonResult.push(cita);
            });
            res.send(jsonResult);
          }
        }
      );
    }
  });
});

// (Retorna todas las citas de un paciente)
router.post("/lista", (req, res) => {
  var cedula = req.body.cedula;
  console.log(cedula);
  connection.getConnection(function (error, tempConn) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "SELECT * FROM cita INNER JOIN paciente ON cita.fkCedula = paciente.cedulaPaciente WHERE paciente.cedulaPaciente = ?",
        [cedula],
        function (error, result) {
          if (error) {
            console.log(error);
            res.send("Error Query");
            throw error;
          } else {
            tempConn.release();
            var jsonResult = [];
            result.map((cita) => {
              cita = {
                ...cita,
                start: `${cita.fechaCita}T${cita.horaCita}`,
              };
              cita = {
                ...cita,
                title: `${cita.nombre1Paciente} ${cita.nombre2Paciente} ${cita.apellido1Paciente} ${cita.apellido2Paciente}`,
              };
              jsonResult.push(cita);
            });
            console.log(jsonResult);
            res.send(jsonResult);
          }
        }
      );
    }
  });
});

// (Retorna las rutinas de una cita)
router.post("/rutina", (req, res) => {
  var cita = req.body.cita;
  connection.getConnection(function (error, tempConn) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        "SELECT idRutina, nombreRutina FROM rutina INNER JOIN sesion ON rutina.idRutina = sesion.fkRutina INNER JOIN cita ON sesion.fkCita = cita.idCita WHERE cita.idCita = ?",
        [cita],
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

// (Retorna una cita por id)
router.get("/id/:idCita", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idCita;
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `SELECT * FROM cita WHERE cita.idCita = ${id}`,
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
            console.log("success insert appointment");
            if (json.listaRutinas) {
              tempConn.query(
                "SELECT MAX(idCita) AS idCita FROM cita",
                function (error, result2) {
                  if (error) {
                    res.send("failed");
                    throw error;
                  } else {
                    var jsonRutinas = [];
                    json.listaRutinas.map((rutina) => {
                      jsonRutinas.push([result2[0].idCita, rutina.idRutina]);
                    });
                    tempConn.query(
                      "INSERT INTO sesion (fkCita, fkRutina) VALUES ?",
                      [jsonRutinas],
                      function (error, result3) {
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
                }
              );
            } else {
              res.send("success");
            }
            
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

// (Elimina una cita)
router.delete("/id/:idCita", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var id = req.params.idCita;
    console.log(id);
    if (error) {
      throw error;
    } else {
      console.log("Conexión Exitoso");
      tempConn.query(
        `DELETE FROM sesion WHERE fkCita = ${id}`,
        function (error, result) {
          if (error) {
            res.send("failed");
            throw error;
          } else {
            tempConn.query(
              `DELETE FROM cita WHERE idCita = ${id}`,
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
        }
      );
    }
  });
});

module.exports = router;
