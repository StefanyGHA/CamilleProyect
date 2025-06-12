import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()
//Inicializar
const app = express()
app.use(cors())
app.use(express.json())

app.use("/uploads", express.static("uploads"))

 //URI base de datos 
const cliente = new MongoClient(process.env.MONGO_URI)
await cliente.connect()

//especificar la base de datos y las tablas a tomar
const db = cliente.db("Miapp")
const usuarios = db.collection("usuarios")//la coleccion

//Ruta para registrarse o enviar un usuario
app.post("/registrar", async (req, res) =>{
    const {nombre, email, password} = req.body

    const existente = await usuarios.findOne({email}) //verifica por email si existe el usuario

    if(existente){
        return res.status(400).json({mensaje: "El usario ya existe"})
    }

    await usuarios.insertOne({nombre,email,password})
    res.json({mensaje: "Usuario registrado correctamente"})
})

app.post("/login", async (req, res) =>{

    const {email, password} = req.body
    const usuario = await usuarios.findOne({email, password})

    if(!usuario){
        return res.status(400).json({mensaje: "Credenciales incorrectas"})
    }

    res.json({mensaje: "Bienvenido", nombre: usuario.nombre})
})

//productos
app.get("/productos", async (req, res) => {
    const productos = await db.collection("productos").find().toArray()
    res.json(productos)
})

//Ruta para iniciar
app.listen(3000, () =>{
    console.log("Servidor corriendo en el puerto 3000")
})



