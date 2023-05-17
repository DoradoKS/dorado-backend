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
const port = 3000;
app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
});

// llamar articulos
const articulosfamiliasmockRouter = require("./routes/articulosfamiliasmock");
app.use(articulosfamiliasmockRouter);