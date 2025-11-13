import express from 'express'
import  prisma  from "../prismaClient.js";

const router = express.Router()

// Get all todos for a logged-in user
router.get('/', async (req,res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

// Create a new todo
router.post('/', async (req,res) => {
    const {task} = req.body
    const todo = await prisma.todo.create({
        data:{
            task,
            userId: req.userId
        }
    })
    res.json(todo)
})

// Update a todo
router.put("/:id", async (req,res) => {
    const {completed} = req.body
    const {id} = req.params
    
    const updatedTodo = await prisma.todo.update({
        where:{
            id: parseInt(id),
            userId: req.userId
        },
        data:{
            completed: !!completed // !! Converte um valor numerico em boolean
        }
    })

    res.json(updatedTodo)
})

// Delete a todo
router.delete("/:id", async (req,res) => {
    const {id} = req.params
    await prisma.todo.delete({
        where:{
            id: parseInt(id),
            userId: req.userId
        }
    })

    res.json({message: "Todo Deleted"})
})

export default router