import express from 'express'
import env from 'dotenv'
import mongoose from 'mongoose'

env.config()
const app = express()

app.get('/', (req, res) => {
  res.send('Working on the Vet app')
})

mongoose.connect(process.env.MONGOURL).then(()=>{
  console.log("Base de datos conectada a " + process.env.MONGOURL)
}).catch((error)=>{
  console.log(error)
})

app.listen(PORT, () => {
  console.log(`Running in http://localhost:${PORT}`)
})
