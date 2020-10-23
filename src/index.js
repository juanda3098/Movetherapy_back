// http(s)://MoveTherapy-infomovetherapy2235.codeanyapp.com

const express = require('express');
const morgan = require('morgan');
var cors = require("cors");

const app = express();

app.set('port', 3000);

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.listen(app.get("port"), () => {
  console.log("Hola");
});

//Routes
app.use('/login', require('./routes/login.js'));
app.use('/paciente', require('./routes/patient.js'));
app.use('/fisio', require('./routes/fisio.js'));
app.use('/ejercicio', require('./routes/ejercicio.js'));
app.use("/rutina", require("./routes/rutina.js"));
app.use("/cita", require("./routes/cita.js"));
app.use("/sesion", require("./routes/sesion.js"));
app.use("/rutina_ejercicio", require("./routes/sesion.js"));
app.use("/user", require("./routes/user.js"));

