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
//---Login
//

//(Retorna los datos de un usuario a loguear)
router.post("/", (req, res) => {
  connection.getConnection(function (error, tempConn) {
    var json = req.body;
    // console.log(req.body);
    if (error) {
      console.log(`Error en conexión ${error}`);
      throw error;
    } else {
      // console.log("Conexion exitosa");
      tempConn.query(
        `SELECT * FROM admin WHERE admin.correoAdmin = ? AND admin.contrasenaAdmin = ?`,
        [json.user, json.password],
        function (error, result) {
          if (error) {
            console.log(`Error en el query ${error}`);
            res.send("failed");
            throw error;
          } else {
            if (result.length) {
              // console.log("admin", result);
              var jres = {
                nombre: result[0].nombreAdmin,
                apellido: result[0].apellidoAdmin,
                tipo: "admin",
              };
              res.send(jres);
            } else {
              tempConn.query(
                `SELECT * FROM paciente WHERE paciente.correoPaciente = ? AND paciente.contrasenaPaciente = ?`,
                [json.user, json.password],
                function (error, result) {
                  if (error) {
                    console.log(`Error en el query ${error}`);
                    res.send("failed");
                    throw error;
                  } else {
                    if (result.length) {
                      // console.log("user", result);
                      var jres = {
                        nombre1: result[0].nombre1Paciente,
                        nombre2: result[0].nombre2Paciente,
                        apellido1: result[0].apellido1Admin,
                        apellido2: result[0].apellido2Admin,
                        tipo: "user",
                      };
                      res.send(jres);
                    } else {
                      res.send('empty')
                    }
                  }
                }
              );
            }
          }
        }
      );
    }
    tempConn.release();
  });
});

module.exports = router;
