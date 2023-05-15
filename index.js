const express = require("express");

// crear servidor
const app = express();

// controlar ruta
app.get("/", (req, res) => {
    res.send("Backend inicial dds-backend!");
  });

// levantar servidor
const port = 3000;
app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
});

// llamar articulos
const articulosfamiliasmockRouter = require("./routes/articulosfamiliasmock");
app.use(articulosfamiliasmockRouter);

// para poder leer json en el body
app.use(express.json());