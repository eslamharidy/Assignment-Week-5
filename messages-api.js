const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000
app.listen(port, () => console.log(`app listening on port ${port}!`))

const validator = (req, res, next) => {
  for ( let i=0; i<5; i++){
  if(!req.body.text || req.body.text === ''){
    res.status(400).end();
  } if (i >= 5){
    res.status(429).end();
  } else {
    i++;
    console.log(i)
    next()
    
  }}
}


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.post('/messages', validator,(req, res) => {
  
      res.json({
        message: "Message received loud and clear",
    });
})
