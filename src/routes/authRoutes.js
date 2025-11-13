import express from 'express'
import bcrypt from 'bcryptjs' //One way irreversible encryption, when a user tries to log in we need to encrypt what the user typed in to try and match what we have in the db
import jwt from 'jsonwebtoken'
import  prisma  from "../prismaClient.js";

const router = express.Router()

// Register a new user endpoint /auth/register
router.post('/register', async (req,res) => { // ORM UPDATED
    const {username , password} = req.body
    
    // encrypt the password
    const hashPassword = bcrypt.hashSync(password, 8)

    try{
        //Inserting a new user into the DB (Registering) / ORM UPDATED
        const user = await prisma.user.create({
            data:{
                username,
                password : hashPassword
            }
        })
    
        //Adding a default Todo for a newly registered user / ORM UPDATED
        const defaultTodo = `Hello :) Add your first Todo!`
        await prisma.todo.create({
            data:{
                task: defaultTodo,
                userId: user.id
            }
        })
        

        // create a token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"})
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

// Login a user endpoint /auth/login
router.post('/login', async (req,res) => { // ORM UPDATED
    const {username, password} = req.body

    try{
        const user = await prisma.user.findUnique({ // ORM UPDATED
            where:{
                username: username
            }
        })

        //If the user is not found in the DB
        if(!user){return res.status(404).send({message: "User not found!"})}

        //Check if password matches
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {return res.status(401).send({message: "Incorrect Password!"})}

        //If we get here then the user should be able to login, so we create a 24h token and let him in
        console.log(user)
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"})
        res.json({ token })
    } catch (err){
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router