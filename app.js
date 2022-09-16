const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/micro-addy')
app.use(express.json())

const urlSchema = new mongoose.Schema({
    url: String,
    randomString: String,
    microAddy: String
})

const Url = mongoose.model('Url', urlSchema)

//Create micro URL: 
//-Should take a url and convert it to a smaller url and store it to database. 
//-Should not allow same tiny url to be created twice. 
//-
app.post('/urls', async (req, res) => {
    try {
        const url = new Url({ url:req.body.url })        
        const randomString = Math.random().toString(16).substr(2, 8)
        url.randomString = randomString
        url.microAddy = `localhost:3000/urls/${url.randomString}`

        const duplicateUrl = Url.find({ microAddy:url.microAddy })

        if(!duplicateUrl) {
            await url.save()
        }

        res.send(url.microAddy)
    } catch (e) {
        res.status(500).send()
    }
})

//Read micro URL.
app.get('/urls/:randomString', async (req, res) => {
    try {
        // const url = await Url.find({})
        // res.send(url)
        const url = await Url.findOne({randomString: req.params.randomString})
        res.redirect(url.url)
    } catch (e) {
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log('Server is up and running!')
})