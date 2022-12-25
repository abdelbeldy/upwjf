const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()


app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`))

const URL = "https://hook.integromat.com/gby358jmmanrxksxsr5234v3aevlywzf"//'http://api.scraperapi.com?api_key=172a9ae9e83fc715c3ac36882d75e835&url=https://www.upwork.com/jobs/Improve-and-Publish-google-apps-script_~016d89367235548118?source=rss'

app.get('/',(req,res) => {
    axios.get(URL)
    .then((response)=>{
        var html = response.data
        text = get_Elements(html)
        return res.json(text)

    })
})

app.get('/:url',async (req,res)=>{
    var upwork_url = req.params.url
    var full_url = url+upwork_url
    axios.get(full_url)
    .then((response)=>{
        var html = response.data
        text = get_Elements(html)
        return res.json(text)

    })

})

function get_Elements(html){
    const $ = cheerio.load(html)
    var data = {}
    var result = $('[data-v-5487a4e2],[data-v-20f798d3]',html).each(function() {
        text = $(this).text().trim().replace(/(\r\n|\n|\r)/mg, "");

        var props = text.match(/This range includes relevant proposals, but does not include proposals that are withdrawn, declined, or archived. Please note that all proposals are accessible to clients on their applicants page\.[A-Za-z\s]*([0-9]{1,2})/m)

        var lastview =  text.match(/([0-9]{1,2}[a-z\s]*)Last viewed by client/m)
        var interviewing = text.match(/Interviewing(\s*[0-9]{1,2})/m)
        var invitessent = text.match(/Invites sent(\s*[0-9]{1,2})/m)
        var hires = text.match(/Hires(\s*[0-9]{1,2})/m)
        
        //if (lastview) console.log(lastview[1])
        if (props) data.props = props[1].trim()
        if (lastview) data.lastview = lastview[1].trim()
        if (interviewing) data.interviewing = interviewing[1].trim()
        if (invitessent) data.invitessent = invitessent[1].trim()
        if (hires) data.hires = hires[1].trim()

        
    });

    //console.log(te)
    return data
}