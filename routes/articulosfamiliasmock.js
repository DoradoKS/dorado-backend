const express = require('express');
const router = express.Router();

// lista de articulos
let arr_ArticulosFamiliasMock = [
    {
      "IdArticuloFamilia": 1,
      "Nombre": "Accesorios"
    },
    {
      "IdArticuloFamilia": 2,
      "Nombre": "Audio"
    },
    {
      "IdArticuloFamilia": 3,
      "Nombre": "Celulares"
    },
    {
      "IdArticuloFamilia": 4,
      "Nombre": "Cuidado Personal"
    },
    {
      "IdArticuloFamilia": 5,
      "Nombre": "Dvd"
    },
    {
      "IdArticuloFamilia": 6,
      "Nombre": "Fotografia"
    },
    {
      "IdArticuloFamilia": 7,
      "Nombre": "Frio-Calor"
    },
    {
      "IdArticuloFamilia": 8,
      "Nombre": "Gps"
    },
    {
      "IdArticuloFamilia": 9,
      "Nombre": "Informatica"
    },
    {
      "IdArticuloFamilia": 10,
      "Nombre": "Led - Lcd"
    }
  ];
  
  // articulo segun nombre y listado completo si no se especifica nombre
  router.get('/api/articulosfamiliasmock/', async function (req, res) {
    const { Nombre } = req.query;
    if (Nombre) {
      let articuloFamilia = arr_ArticulosFamiliasMock.find(
        (x) => x.Nombre == Nombre
      );
      if (articuloFamilia) res.json(articuloFamilia);
      else res.status(404).json({ message: 'articulofamilia no encontrado' });
    } else {
      res.json(arr_ArticulosFamiliasMock);
    }
  });

  // articulos segun id
  router.get('/api/articulosfamiliasmock/:id', async function (req, res) {
    let articuloFamilia = arr_ArticulosFamiliasMock.find(
      (x) => x.IdArticuloFamilia == req.params.id
    );
    if (articuloFamilia) res.json(articuloFamilia);
    else res.status(404).json({ message: 'articulofamilia no encontrado' });
  });

  // crear articulo
  router.post('/api/articulosfamiliasmock/', (req, res) => {
    const { Nombre } = req.body;
    let articuloFamilia = {
      Nombre,
      IdArticuloFamilia: Math.floor(Math.random()*100000),
    };
  
    // aqui agrega a la coleccion
    arr_ArticulosFamiliasMock.push(articuloFamilia);
  
    res.status(201).json(articuloFamilia);
  });

  // permite modificar recurso
  router.put('/api/articulosfamiliasmock/:id', (req, res) => {
    let articuloFamilia = arr_ArticulosFamiliasMock.find(
      (x) => x.IdArticuloFamilia == req.params.id
    );
  
    if (articuloFamilia) {
      const { Nombre } = req.body;
      articuloFamilia.Nombre = Nombre;
      res.json({ message: 'articulofamilia actualizado' });
    } else {
      res.status(404).json({ message: 'articulofamilia no encontrado' })
    }
  });

  // permite borrar un articulo
  router.delete('/api/articulosfamiliasmock/:id', (req, res) => {
    let articuloFamilia = arr_ArticulosFamiliasMock.find(
      (x) => x.IdArticuloFamilia == req.params.id
    );
  
    if (articuloFamilia) {
      arr_ArticulosFamiliasMock = arr_ArticulosFamiliasMock.filter(
        (x) => x.IdArticuloFamilia != req.params.id
      );
      res.json({ message: 'articulofamilia eliminado' });
    } else {
      res.status(404).json({ message: 'articulofamilia no encontrado' })
    }
  });

  // exportar modulo
  module.exports = router;