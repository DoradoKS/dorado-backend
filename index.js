const express = require("express");

// crear servidor
const app = express();

// crear base si no existe
require("./base-orm/sqlite-init");

// para poder leer json en el body
app.use(express.json());

// controlar ruta principal
app.get("/", (req, res) => {
    res.send("Backend inicial dds-backend!");
});

// ruta de mock
const articulosfamiliasRouter = require("./routes/articulosfamilias");
app.use(articulosfamiliasRouter);

const articulosfamiliasmockRouter = require("./routes/articulosfamiliasmock");
app.use(articulosfamiliasmockRouter);

// ruta de artículos (Base de datos SQLite)
const articulosRouter = require("./routes/articulos");
app.use(articulosRouter);                              

// ruta de seguridad (Login JWT)
const seguridadRouter = require("./routes/seguridad"); 
app.use(seguridadRouter);                              


// levantar servidor
if (!module.parent) { 
  const port = process.env.PORT || 4000; 
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
}
module.exports = app;