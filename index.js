const express = require("express");

// crear servidor
const app = express();

// crear base si no existe
require("./base-orm/sqlite-init");

// para poder leer json en el body
app.use(express.json());

// controlar ruta
app.get("/", (req, res) => {
    res.send("Backend inicial dds-backend!");
  });

// llamar articulosfamilias.js
const articulosfamiliasRouter = require("./routes/articulosfamilias");
app.use(articulosfamiliasRouter);

// levantar servidor
if (!module.parent) {   // si no es llamado por otro modulo, es decir, si es el modulo principal -> levantamos el servidor
  const port = process.env.PORT || 4000;   // en produccion se usa el puerto de la variable de entorno PORT
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
}
module.exports = app; // para testing

// llamar articulos
const articulosfamiliasmockRouter = require("./routes/articulosfamiliasmock");
app.use(articulosfamiliasmockRouter);