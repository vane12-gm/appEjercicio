const { request, response } = require('express');
const express = require('express');
const app = express();
const { Routes } = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'bddquinto'
});

//middleware.- 
app.use(express.json());//leer e interpretar archivos en formato json
app.use(express.urlencoded());//encriptar la url hacia el servidor y evitar inyeccion de codigos maliciosos
connection.connect((error) => {
    if (error) throw error;
    console.log('Conexion exitosa');
});

//rutas
app.get('/',(req, res) => {
    res.send("Ruta principal del proyecto");
});

app.get('/productos', (req, res) => {
    connection.query('SELECT * FROM productos', (error, resultados) =>{
        if (error) throw error;
        if (resultados.length > 0) {
            res.json(resultados);
        } else {
            res.send('no hay registros a mostrar');
        }
    });
    //res.send('metodos para ingresar un producto');
});
app.get('/productos/:id', (req, res) => {
    const {id } = req.params;
    let sql = `SELECT * FROM productos where id = ${id}`;
    connection.query(sql, (error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0){
            res.json(resultado);
    }else{
        res.send('no hay registros a mostrar');
    }
    });
});

app.post('/agregarproducto',(req, res) =>{
    let sql = 'INSERT INTO productos SET ?';
    const dataObject = {
        nombre: req.body.nombre,
        precio: req.body.precio
    };
    connection.query(sql, dataObject, (error) =>{
        if(error) throw error;
        res.send('Registro insertado correctamente');
    })
});

app.put('/modificarproducto/:id', (req, res) => {
    const {id } = req.params;
    const {nombre, precio} = req.body;
    const sql = `UPDATE productos SET nombre = '${nombre}', precio = ${precio} WHERE id = ${id}`;
    connection.query(sql, (error) => {
        if (error) throw error;
        res.send('Registro modificado correctamente');
    });

});

app.delete('/borrarproducto/:id', (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM productos WHERE id = ${id}`;
    connection.query(sql, (error) => {
        if (error) throw error;
        res.send('Registro borrado');
    });
});



//levantar servidor
app.listen(4500, (req, res) => {
    console.log("Servidor corriendo");
});

