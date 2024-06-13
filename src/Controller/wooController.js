const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const asyncFunctionHandler= (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err))
    }
}
const api = new WooCommerceRestApi({
  url: "https://nipposh.com",
  consumerKey: "ck_1cf81d5c69f545493738585043e4b793baeb9ed2",
  consumerSecret: "cs_1ee21422275c4c6a44a915c03ad098621b8fc515",
  version: "wc/v3"
});
const GetOrders = asyncFunctionHandler(async(req,res,next)=>{
    const orders = await api.get('orders')
    
    res.status(200).json(orders.data)
})

module.exports = {GetOrders}

