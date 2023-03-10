const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()


app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`))
//const scraper_key = process.env['scraper_key']

// const URL = 'http://api.scraperapi.com?api_key='+scraper_key+'&url='//'https://hook.integromat.com/gby358jmmanrxksxsr5234v3aevlywzf'//https://www.upwork.com/jobs/Improve-and-Publish-google-apps-script_~016d89367235548118?source=rss
//const test = 'https://hook.integromat.com/gby358jmmanrxksxsr5234v3aevlywzf'
app.get('/',(req,res) => {
    // axios.get(test)
    // .then((response)=>{
    //     var html = response.data
    //     text = get_Elements(html)
    //     return res.json(text)

    // })
  if(req.query.purl){
        var upwork_url = req.query.purl
   // console.log(upwork_url)
//       return res.json(req)
// console.log(req)
    //var full_url = 
    try{
     axios.get(upwork_url)
    .then((response)=>{
        var html = response.data
        text = get_Elements(html)
        return res.json(text)

    })
    }catch(e){
      return console.log(e)
    }

  }else{
        return res.json("hello")
  }
})

app.get('/?url',async (req,res)=>{

})

function get_Elements(html){
  const $ = cheerio.load(html)
  //console.log(html)
  var ele = $("h4:contains(Activity on this job)",html)
  var dataAttr = Object.keys(ele[0].attribs).filter(x=>x.substring(0,4)==="data")[0]
  var data = {}
  var result = $('['+dataAttr+']',html).each(function() {
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