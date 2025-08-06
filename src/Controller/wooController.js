const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const asyncFunctionHandler = require('../utils/asyncErrorHandller')
const CustomError = require('../utils/customerror')
const UtctoLocalString = require('../utils/common')
const Gati = require('../Models/Gati.js')
const fs = require('fs')
const path = require('path')

const errorLog = (req, res, err) => {
    return `
    Remote ADD: ${UtctoLocalString(new Date(Date.now()), 'dddd, MMMM Do YYYY, h:mm:ss a')}
    URL : ${req.protocol}://${req.get('host')}${req.originalUrl}
    RequestBody : ${JSON.stringify(req.body)}
    Authorization : ${req.headers['authorization'] || 'undefine'}
    Response : ${err.stack}
    `
}
const proderror = (req, res, err) => {
    if (err.isOperational) {
        res.status(err.statuscode).json({
            status: err.statuscode,
            message: err.message,
        })
    } else {
        const logDirectory = path.join(__dirname, '..', 'errors');
        const logFileName = `error-${UtctoLocalString(new Date(Date.now()), 'YY-MM-DD')}.log`;
        const logFilePath = path.join(logDirectory, logFileName);
        fs.appendFileSync(logFilePath, errorLog(req, res, err));
        res.status(500).json({
            status: 500,
            message: 'Something Went Wrong Try Again !',
        })
    }
}


const errorHandller = (error, req, res, next) => {
    error.statuscode = error.statuscode || 500;
    error.status = error.status || 'error';
    proderror(req, res, error)

}
const credentials = async (req) => {
    const { url, consumerKey, consumer_secret } = req.body
    if (!url) throw new CustomError('URL is not valid', 422)
    if (!consumerKey) throw new CustomError('consumerKey is not valid', 422)
    if (!consumer_secret) throw new CustomError('consumerSecret is not valid', 422)

    const api = new WooCommerceRestApi({
        url: url,
        consumerKey: consumerKey,
        consumerSecret: consumer_secret,
        version: "wc/v3"
    });
    return api
}

const GetOrders = asyncFunctionHandler(async (req, res, next) => {
    const { data } = req.body
    if (!data) throw new CustomError('data is not valid', 422)
    const api = await credentials(req)
    const orders = await api.get('orders', data)

    res.status(200).json({ status: 200, message: 'success', data: orders.data })
})
const OrderUpdate = asyncFunctionHandler(async (req, res, next) => {
    const { data, order_id } = req.body
    if (!order_id) throw new CustomError('order_id  is not valid', 422)
    if (!data) throw new CustomError('status   is not valid', 422)
    const api = await credentials(req)
    const orders = await api.put('orders/' + order_id, data)

    res.status(200).json({ status: 200, message: 'success', data: orders.data })
})
const productRetrive = asyncFunctionHandler(async (req, res, next) => {
    const id = req.body.data
    if (!id) throw new CustomError('data is not valid', 422)
    const api = await credentials(req)
    const orders = await api.get('products/' + id)

    res.status(200).json({ status: 200, message: 'success', data: orders.data })

})

const DefaultMesg = asyncFunctionHandler(async (req, res, next) => {
    throw new CustomError('page not found', 404)
})
const GatiDoketNo = asyncFunctionHandler(async (req, res, next) => {
    const response = await fetch('https://justi.gati.com/webservices/GKEdktdownloadjson.jsp?p1=2E9284B016FE5AF9E24789458F632CDA', { method: 'GET' })
    const data = await response.json()
    res.status(200).json({ response: data })
})

const gatiWarehouseCreation = asyncFunctionHandler(async (req, res, next) => {
    const row = req.body;
    const response = await Gati.GatiWareHouse(row)
    res.status(200).json({ status: 200, message: 'success', data: response })
})
const gatiShipmentCreation = asyncFunctionHandler(async (req, res, next) => {
    const row = req.body;
    const response = await Gati.shipmentCreation(row)
    res.status(200).json({ status: 200, message: 'success', data: response.Data, body: response.Body })
})
const gatiShipmentLabel = asyncFunctionHandler(async (req, res, next) => {
    const awb = req.query.awb;
    const response = await Gati.ShipmentLabel(awb)
    // const pdfBuffer = Buffer.from(response, 'binary'); 
    const contentType = response.headers.get('content-type');
    const arrayBuffer = await response.arrayBuffer(); 
    const pdfBuffer = Buffer.from(arrayBuffer);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attactment; filename="shipment-label.pdf"');
    res.status(200).send(pdfBuffer);  // Send the buffer as a PDF
})
const gatitrackingStatus = asyncFunctionHandler(async (req, res, next) => {
    const awb = req.params.awb;
    const response = await Gati.Gatitracking(awb)
    res.status(200).json({ status: 200, message: 'success', data: response })
})


const Health = asyncFunctionHandler(async (req, res, next) => {
    res.json({ status: 200, message: 'app is Rnning properly 1' })
})

module.exports = { GetOrders, productRetrive, OrderUpdate, DefaultMesg, errorHandller, Health, GatiDoketNo, gatiWarehouseCreation, gatiShipmentCreation, gatiShipmentLabel ,gatitrackingStatus}

