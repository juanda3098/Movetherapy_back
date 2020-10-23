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
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Conexion suave como el amor de mamá");
      tempConn.query(
        `SELECT * FROM admin WHERE admin.usuarioAdmin = ? AND admin.contrasenaAdmin = ?`,
        [json.user, json.password],
        function (error, result) {
          if (error) {
            console.log(error);
            res.send("un error chingon");
            throw error;
          } else {
            tempConn.release();
            if (result) {
              console.log(result);
              res.send("admin");
            } else {
              tempConn.query(
                `SELECT * FROM paciente WHERE paciente.correoPaciente = ? AND paciente.contrasenaPaciente = ?`,
                [json.user, json.password],
                function (error, result) {
                  if (error) {
                    console.log(error);
                    res.send("un error chingon");
                    throw error;
                  } else {
                    tempConn.release();
                    if (result) {
                      console.log(result);
                      res.send("patient");
                    } else {
                      res.send("nothing");
                    }
                  }
                }
              );
            }
          }
        }
      );
    }
  });
});

module.exports = router;
