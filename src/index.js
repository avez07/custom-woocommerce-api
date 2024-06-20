const express = require('express')
const cors  = require('cors')
const woocommerce = require('./Controller/wooController')
const app = express()
const PORT = 8000
app.use(express.json())
app.use(cors())

app.route('/health').get(woocommerce.Health)
app.route('/OderRetive').get(woocommerce.GetOrders)
app.route('/OrderUpdate').get(woocommerce.OrderUpdate)
app.route('/ProductRetive').get(woocommerce.productRetrive)
app.route('/*').get(woocommerce.DefaultMesg)





app.use(woocommerce.errorHandller)
app.listen(PORT,()=>{
    console.log(`app is running on the port ${PORT}`)
})