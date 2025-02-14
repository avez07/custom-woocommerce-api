const express = require('express')
const cors  = require('cors')
const woocommerce = require('./Controller/wooController')
const app = express()
const PORT = 8000
app.use(express.json())
app.use(cors())

app.route('/health').get(woocommerce.Health)
app.route('/OderRetive').post(woocommerce.GetOrders)
app.route('/OrderUpdate').post(woocommerce.OrderUpdate)
app.route('/ProductRetive').post(woocommerce.productRetrive)
app.route('/doketNo').get(woocommerce.GatiDoketNo)
app.route('/GatiWarehouseCreation').post(woocommerce.gatiWarehouseCreation)
app.route('/ShipmentCreation').post(woocommerce.gatiShipmentCreation)
app.route('/ShipmentLabel').get(woocommerce.gatiShipmentLabel)




app.route('/*').get(woocommerce.DefaultMesg)





app.use(woocommerce.errorHandller)
app.listen(PORT,()=>{
    console.log(`app is running on the port ${PORT}`)
})