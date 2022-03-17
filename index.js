const port = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const res = require('express/lib/response')

const app = express()

const webites =[
    {
        name:'The Times',
        address:'https://www.thetimes.co.uk/environment/climate-change',
        base:''
    },
    {
        name:'The Guardian',
        address:'https://www.theguardian.com/environment/climate-crisis',
        base:''
    },
    {
        name:'Telegraph',
        address:'https://www.telegraph.co.uk/climate-change/',
        base:'https://www.telegraph.co.uk'
    }
]
const articles= []

webites.forEach(website => {
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
    //   axios.get('https://www.theguardian.com/environment/climate-crisis')
 //   .then((response) => {
 //       const html = response.data
 //      const $ = cheerio.load(html)
 //      $('a:contains("climate")',html).each(function(){
 //         const title =  $(this).text()
 //         const url = $(this).attr('href')
 //         articles.push({
 //             title,
 //             url
 //         })  
 //      })
 //      res.json(articles)
 //   }).catch((err) =>console.log(err))
})

app.listen(port,() =>console.log('server run on port ${PORT}'))
