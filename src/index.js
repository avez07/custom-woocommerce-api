const express = require('express')
const cors  = require('cors')
const woocommerce = require('./Controller/wooController')
const app = express()
const PORT = 8000
app.use(express.json())
app.use(cors())

app.route('/').get(woocommerce.GetOrders)
app.listen(PORT,()=>{
    console.log(`app is running on the port ${PORT}`)
})