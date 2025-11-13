import express from 'express' //Type module no package.json
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT ||5003  //Se tiver no .env  usa ele, se nao usa 5000

//Get the file path from the URL of current module 
const __filename = fileURLToPath(import.meta.url) // C:/blabla/Documents/VSCode/backend-full-course/chapter_3/src/server.js
//Get the directory name from the file path
const __dirname = dirname(__filename) // C:/blabla/Documents/VSCode/backend-full-course/chapter_3/src

//Middleware:
app.use(express.json())
//É uma função pronta do Express que transforma uma pasta em um servidor de arquivos estáticos. “Arquivos estáticos” = arquivos que não mudam quando o servidor roda
app.use(express.static(path.join(__dirname, "../public")))


//Serving the HTML file from the /public directory 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

//Routes
app.use('/auth', authRoutes)
app.use('/todos',authMiddleware, todoRoutes)


//LISTENER (NO FINAL!)
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))