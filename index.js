import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'

const app = express()
const PORT = process.env.PORT || 3000
const JWT_ACCESS = process.env.JWT_ACCESS

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

