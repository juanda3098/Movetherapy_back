ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

CREATE DATABASE movetherapy;

USE movetherapy;

/* creacion de las tablas */ 
CREATE TABLE `movetherapy`.`admin` (
  `idAdmin` INT NOT NULL AUTO_INCREMENT,
  `userAdmin` VARCHAR(50) NOT NULL,
  `passwordAdmin` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idAdmin`));
  
CREATE TABLE `movetherapy`.`paciente` (
  `idPaciente` INT NOT NULL AUTO_INCREMENT,
  `cedulaPaciente` VARCHAR(45) NOT NULL,
  `nombre1Paciente` VARCHAR(45) NOT NULL,
  `nombre2Paciente` VARCHAR(45) NULL,
  `apellido1Paciente` VARCHAR(45) NOT NULL,
  `apellido2Paciente` VARCHAR(45) NULL,
  `celularPaciente` VARCHAR(45) NOT NULL,
  `telefonoPaciente` VARCHAR(45) NULL,
  `correoPaciente` VARCHAR(45) NOT NULL,
  `contrasenaPaciente` VARCHAR(45) NOT NULL,
  `fechaNacimientoPaciente` INT NOT NULL,
  `practicaDeporte` TINYINT NOT NULL,
  PRIMARY KEY (`idPaciente`));

CREATE TABLE `movetherapy`.`cita` (
  `idCita` int NOT NULL AUTO_INCREMENT,
  `fechaCita` int NOT NULL,
  `observacionCita` VARCHAR(500) NULL,
  `fkPaciente` int(11) DEFAULT NULL,
  PRIMARY KEY (`idCita`),
  KEY `fkPaciente` (`fkPaciente`),
  CONSTRAINT `Cita_ibfk_1` FOREIGN KEY (`fkPaciente`) REFERENCES `paciente` (`idPaciente`));
  
CREATE TABLE `movetherapy`.`ejercicio` (
  `idEjercicio` INT NOT NULL AUTO_INCREMENT,
  `nombreEjercicio` VARCHAR(45) NOT NULL,
  `linkVideo` VARCHAR(500) NOT NULL,
  `descripcionEjercicio` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`idEjercicio`));
  
CREATE TABLE `movetherapy`.`rutina` (
  `idRutina` INT NOT NULL AUTO_INCREMENT,
  `nombreRutina` VARCHAR(45) NOT NULL,
  `descripcionRutina` VARCHAR(500) NULL,
  `fechaCreacionRutina` INT NOT NULL,
  PRIMARY KEY (`idRutina`));
  
CREATE TABLE `movetherapy`.`rutina_ejercicio` (
  `idRutina_Ejercicio` INT NOT NULL AUTO_INCREMENT,
  `fkRutina` INT NULL,
  `fkEjercicio` INT NULL,
  PRIMARY KEY (`idRutina_Ejercicio`),
  KEY `fkRutina` (`fkRutina`),
  CONSTRAINT `rutina_ejercicio_ibfk_1` FOREIGN KEY (`fkRutina`) REFERENCES `rutina` (`idRutina`),
  KEY `fkEjercicio` (`fkEjercicio`),
  CONSTRAINT `rutina_ejercicio_ibfk_2` FOREIGN KEY (`fkEjercicio`) REFERENCES `ejercicio` (`idEjercicio`));
  
CREATE TABLE `movetherapy`.`fisioterapeuta` (
  `idFisioterapeuta` INT NOT NULL AUTO_INCREMENT,
  `cedulaFisioterapeuta` VARCHAR(45) NOT NULL,
  `nombre1Fisioterapeuta` VARCHAR(45) NOT NULL,
  `nombre2Fisioterapeuta` VARCHAR(45) NULL,
  `apellido1Fisioterapeuta` VARCHAR(45) NOT NULL,
  `apellido2Fisioterapeuta` VARCHAR(45) NULL,
  PRIMARY KEY (`idFisioterapeuta`));
  
CREATE TABLE `movetherapy`.`sesion` (
  `idSesion` INT NOT NULL AUTO_INCREMENT,
  `fechaSesion` INT NOT NULL,
  `duracionSesion` INT NOT NULL,
  `fkCita` INT NULL,
  `fkRutina` INT NULL,
  `fkFisioterapeuta` INT NULL,
  PRIMARY KEY (`idSesion`),
  KEY `fkCita` (`fkCita`),
  CONSTRAINT `sesion_ibfk_1` FOREIGN KEY (`fkCita`) REFERENCES `cita` (`idCita`),
  KEY `fkRutina` (`fkRutina`),
  CONSTRAINT `sesion_ibfk_2` FOREIGN KEY (`fkRutina`) REFERENCES `rutina` (`idRutina`),
  KEY `fkFisioterapeuta` (`fkFisioterapeuta`),
  CONSTRAINT `sesion_ibfk_3` FOREIGN KEY (`fkFisioterapeuta`) REFERENCES `fisioterapeuta` (`idFisioterapeuta`));

/* Crear datos en las tablas */
INSERT INTO `movetherapy`.`admin` (`usuarioAdmin`, `contrasenaAdmin`) VALUES ('admin', 'admin123');

INSERT INTO `movetherapy`.`paciente` (`cedulaPaciente`, `nombre1Paciente`, `nombre2Paciente`, `apellido1Paciente`, `apellido2Paciente`, `celularPaciente`, `correoPaciente`, `contrasenaPaciente`, `fechaNacimientoPaciente`, `practicaDeporte`) VALUES ('1144101836', 'Juan', 'David', 'Posso', 'Rengifo', '3145291839', 'juandapore3098@gmail.com', 'hola', '962346331', '1');

INSERT INTO `movetherapy`.`fisioterapeuta` (`nombre1Fisioterapeuta`, `apellido1Fisioterapeuta`) VALUES ('Diana', 'Mesa');

INSERT INTO `movetherapy`.`ejercicio` (`nombreEjercicio`, `linkVideo`, `descripcionEjercicio`) VALUES ('Flexo', 'https://www.youtube.com/watch?v=M30hRfn5pDc&ab_channel=BUFFAcademy', 'Forma correcta de realizar el ejercicio');

INSERT INTO `movetherapy`.`rutina` (`nombreRutina`, `descripcionRutina`, `fechaCreacionRutina`) VALUES ('Calentamiento', 'Rutina diseñada con el fin de preparar al cuerpo para una sesion mas intensa', '962346331');

INSERT INTO `movetherapy`.`rutina_ejercicio` (`fkRutina`, `fkEjercicio`) VALUES ('1', '1');

INSERT INTO `movetherapy`.`cita` (`fechaCita`, `observacionCita`, `fkPaciente`) VALUES ('962346331', 'Valoracion del paciente', '1');

INSERT INTO `movetherapy`.`sesion` (`fechaSesion`, `duracionSesion`, `fkCita`, `fkRutina`, `fkFisioterapeuta`) VALUES ('962346331', '150', '1', '1', '1');

/* Leer datos de las tablas (Basico) */
SELECT * FROM movetherapy.paciente;

SELECT * FROM movetherapy.cita;

SELECT * FROM movetherapy.fisioterapeuta;

SELECT * FROM movetherapy.ejercicio;

SELECT * FROM movetherapy.rutina;

/* Actualizar los datos de las tablas */
UPDATE `movetherapy`.`admin` SET `usuarioAdmin` = 'admin1', `contrasenaAdmin` = 'admin1234' WHERE (`idAdmin` = '1');

UPDATE `movetherapy`.`cita` SET `fechaCita` = '96234633', `observacionCita` = 'Valoracion del pacientes', `fkPaciente` = '12' WHERE (`idCita` = '1');

UPDATE `movetherapy`.`ejercicio` SET `nombreEjercicio` = 'Flexoextencion', `linkVideo` = 'https://www.youtube.com/watch?v=KtZsQrYAJ0Y&ab_channel=gymvirtua', `descripcionEjercicio` = 'Este es un ejercicio para fortalecer los cuadricep' WHERE (`idEjercicio` = '1');

UPDATE `movetherapy`.`fisioterapeuta` SET `nombre1Fisioterapeuta` = 'Dianas', `nombre2Fisioterapeuta` = 'Ma', `apellido1Fisioterapeuta` = 'Mesas', `apellido2Fisioterapeuta` = 'Re' WHERE (`idFisioterapeuta` = '1');

UPDATE `movetherapy`.`paciente` SET `cedulaPaciente` = '114410183', `nombre1Paciente` = 'Jua', `nombre2Paciente` = 'Davi', `apellido1Paciente` = 'Poss', `apellido2Paciente` = 'Rengif', `celularPaciente` = '314529183', `telefonoPaciente` = '4473524', `correoPaciente` = 'juandapore3098@gmail.com.co', `contrasenaPaciente` = 'hola1', `fechaNacimientoPaciente` = '96234633', `practicaDeporte` = '0' WHERE (`idPaciente` = '1');

UPDATE `movetherapy`.`rutina` SET `nombreRutina` = 'Calentamientos', `descripcionRutina` = 'Rutina diseñada con el fin de preparar al cuerpo para una esion mas intensa', `fechaCreacionRutina` = '96234633' WHERE (`idRutina` = '1');

UPDATE `movetherapy`.`rutina_ejercicio` SET `fkRutina` = '2', `fkEjercicio` = '2' WHERE (`idRutina_Ejercicio` = '1');

UPDATE `movetherapy`.`sesion` SET `fechaSesion` = '96234633', `duracionSesion` = '15', `fkCita` = '2', `fkRutina` = '2', `fkFisioterapeuta` = '2' WHERE (`idSesion` = '2');

/* Borrar datos de las tablas */
DELETE FROM `movetherapy`.`admin` WHERE (`idAdmin` = '1');

DELETE FROM `movetherapy`.`cita` WHERE (`idCita` = '1');

DELETE FROM `movetherapy`.`ejercicio` WHERE (`idEjercicio` = '1');

DELETE FROM `movetherapy`.`fisioterapeuta` WHERE (`idFisioterapeuta` = '1');

DELETE FROM `movetherapy`.`paciente` WHERE (`idPaciente` = '1');

DELETE FROM `movetherapy`.`rutina` WHERE (`idRutina` = '1');

DELETE FROM `movetherapy`.`rutina_ejercicio` WHERE (`idRutina_Ejercicio` = '1');

DELETE FROM `movetherapy`.`sesion` WHERE (`idSesion` = '2');