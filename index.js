const port = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const res = require('express/lib/response')
const { response } = require('express')

const app = express()

const websites =[
    {
        name:'thetimes',
        address:'https://www.thetimes.co.uk/environment/climate-change',
        base:''
    },
    {
        name:'theguardian',
        address:'https://www.theguardian.com/environment/climate-crisis',
        base:''
    },
    {
        name:'telegraph',
        address:'https://www.telegraph.co.uk/climate-change/',
        base:'https://www.telegraph.co.uk'
    }
]
const articles= []

websites.forEach(website => {
    axios.get(website.address)
    .then(response =>{
        const  html = response.data
        const $ = cheerio.load(html)
        $ ('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url: website.base + url,
                source: website.name
            })
        })
    })
})

app.get('/',(req,res)=> {
    res.json('welcome to climate change api')
})

app.get('/news',(req,res) => {
res.json(articles)
})
app.get('/news/:websiteid',async (req,res) => {
    const websiteid = req.params.websiteid

  const websiteAddress = websites.filter(website => website.name == websiteid)[0].address
  const websiteBase =websites.filter(website => website.name == websiteid)[0].base

    axios.get(websiteAddress)
    .then(response=>{
        const html =response.data
        const $ = cheerio.load(html)
        const specificArticles =[]
        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url =$(this).attr('href')
            specificArticles.push({
                title,
                url:websiteBase + url,
                source:websiteid

            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

app.listen(port,() =>console.log('server run on port ${PORT}'))
