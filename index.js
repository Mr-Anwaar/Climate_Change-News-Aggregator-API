const port = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

app.get('/',(req,res)=> {
    res.json('welcome to climate change api')
})

app.listen(port,() =>console.log('server run on port ${PORT}'))
