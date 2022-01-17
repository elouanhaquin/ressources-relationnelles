const express = require('express')
const app = express()

const messages = require('./messages.json')

// Middleware
app.use(express.json())

app.get('/messages', (req,res) => {
    res.status(200).json(messages)
})

app.get('/messages/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const message = messages.find(message => message.id === id)
    res.status(200).json(message)
})

app.post('/messages', (req,res) => {
    messages.push(req.body)
    res.status(200).json(messages)
})

app.listen(3000, () => {
    console.log("Serveur à l'écoute")
})
