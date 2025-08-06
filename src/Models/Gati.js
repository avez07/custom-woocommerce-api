const CustomError = require('../utils/customerror')

const ModalErrorHandller = require('../utils/ModalErrorHandller')

const DocketNo = ModalErrorHandller(async (encryptedCode) => {
    const testUrl = "https://pg-uat.gati.com/pickupservices/GKEdktdownloadjson.jsp?"
    const ProductionUrl = "https://justi.gati.com/webservices/GKEdktdownloadjson.jsp?"
    const response = await fetch(`${ProductionUrl}p1=${encryptedCode}`, { method: 'GET' })
    const data = await response.json()
    if (data?.docketNo) return data
    throw new CustomError(JSON.stringify(data) || 'Docketno Not Found', 403)
})
const Pakageseries = ModalErrorHandller(async (docketNo, NoOfPack, encryptedCode, pincode) => {
    const testUrl = "https://pg-uat.gati.com/pickupservices/Custpkgseries.jsp?"
    const ProductionUrl = "https://justi.gati.com/webservices/Custpkgseries.jsp?"
    const response = await fetch(`${ProductionUrl}p1=${docketNo}&p2=${NoOfPack}&p3=${encryptedCode}&p4=${pincode}`, { method: 'GET' })
    const data = await response.json()
//    throw new Error('this is error')
    if (!data?.frmNo) throw new CustomError(JSON.stringify(data) || 'Docketno Not Found', 403)
    return data
})
const GatiWareHouse = ModalErrorHandller(async (row) => {
    const { CustCode, Warehousename, pname, paddline1, paddline2, paddline3, pcity, pmobile, ppincode, pemail } = row
    // console.log(row)
    const testUrl = "https://pg-uat.gati.com/pickupservices/GKEJCustVendDtls.jsp"
    const ProductionUrl = 'https://justi.gati.com/webservices/GKEJCustVendDtls.jsp'
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const Body = {
        "custCode": parseInt(CustCode),
        "details": [{
            "custVendorCode": Warehousename,
            "custVendorName": pname,
            "vendorAdd1": paddline1,
            "vendorAdd2": paddline2,
            "vendorAdd3": paddline3,
            "vendorCity": pcity,
            "vendorPhoneNo": pmobile,
            "vendorPincode": ppincode,
            "vendorEmail": pemail,
            "vendorReceiverFlag": "V",
            "vendorTinno": "",
            "VendorGSTNO": ""
        }]
    }
    const response = await fetch(`${ProductionUrl}`, {
        method: 'POST',
        body: JSON.stringify(Body),
        headers:myHeaders

    })
    const data = await response.json()
    if (data?.reqcnt) return data
    throw new CustomError(JSON.stringify(data) || 'Docketno Not Found', 403)
})
const Gatitracking = ModalErrorHandller(async (awb) => {
    
    
    // console.log(row)
    const testUrl = `https://pg-uat.gati.com/pickupservices/GatiKWEDktJTrack.jsp?p1=${awb}&p2=53A0A0644DC94C25`
    const ProductionUrl = `https://justi.com/pickupservices/GatiKWEDktJTrack.jsp?p1=${awb}&p2=53A0A0644DC94C25`
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const response = await fetch(`${testUrl}`, {
        method: 'GET',
        headers:myHeaders

    })
    const data = await response.json()
    return data
})
const shipmentCreation = ModalErrorHandller(async (data) => {
      const testUrl = "https://pg-uat.gati.com/pickupservices/GATIKWEJPICKUPLBH.jsp"
    const ProductionUrl = 'https://justi.gati.com/webservices/GATIKWEJPICKUPLBH.jsp'
const {odId ,aipexNo ,loginId ,partner_id ,pId ,dId ,shipclassId ,qty ,
productId ,subProductCategory ,payMode ,orderRef ,invoiceVal ,totalWeight ,consRate ,codRate ,
extraRate ,totalRate,created_by,awbStatus,pickupStatus,orderDate ,orderTime,
gstin_no ,hsn_code ,e_waybill ,email ,pname ,pmobileNo,pcompanyName ,paddL1 ,paddL2 ,paddL3 ,ppincode ,pcity ,
pstate ,dname ,demail ,dmobileNo,daddL1 ,daddL2 ,daddL3 ,GatiCode,
dpincode,dcity,dstate ,categoryName,shipclass ,dimension,warehouse,pickupDate} = data 
const encryptedCode = '2E9284B016FE5AF9E24789458F632CDA'
const DoketNoseries = await DocketNo(encryptedCode);
if(!DoketNoseries?.docketNo) throw new CustomError('Docket No not Found',403)
    const docNo = DoketNoseries.docketNo
const pakageSeriesNo = await Pakageseries(docNo,qty,encryptedCode,ppincode)
let fromPkgNo = pakageSeriesNo.frmNo
let toPkgNo = pakageSeriesNo.toNo

// return data;
const pakageSeries = dimension.map((items,index)=>{
    const packages = [];
    for (let i = 0; i < items.pkg; i++) {
        packages.push({
            "pkgNo": fromPkgNo.toString(),
            "pkgLn": items.length,
            "pkgBr": items.width,
            "pkgHt": items.height,
            "pkgWt": items.weight,
        }) 
        fromPkgNo++       
    }
    return packages
   
})

   
    const Body = {
        "custCode": "30337001",
        "pickupRequest": pickupDate,
        "details": [
            {
                "docketNo": docNo,
                "deliveryStn": "",
                "goodsCode": GatiCode,
                "declCargoVal": invoiceVal,
                "actualWt": totalWeight,
                "chargedWt": totalWeight,
                "shipperCode": "30337001",
                "orderNo": aipexNo,
                "codAmt": 0,
                "codInFavourOf": "",
                "receiverCode": "99999",
                "receiverName": dname,
                "receiverAdd1": daddL1,
                "receiverAdd2": daddL2,
                "receiverAdd3": daddL3,
                "receiverAdd4": "",
                "receiverCity": dcity,
                "receiverPhoneNo": dmobileNo,
                "receiverMobileNo": dmobileNo,
                "receiverEmail": demail,
                "receiverPinCode": dpincode,
                "noOfPkgs": qty,
                "fromPkgNo": pakageSeriesNo.frmNo,
                "toPkgNo": toPkgNo,
                "pkgDetails": {
                    "pkginfo": pakageSeries.flat()
                },
                "CustDeliveyDate": "",
                "SPL_Instruction": "",
                "prodServCode": "1",
                "custVendCode": warehouse,
                "goodsDesc": categoryName,
                "bookingBasis": "2",
                "locationCode": "",
                "UOM": "CC",
                "consignorGSTINNo": "",
                "ReceiverGSTINNo": "",
                "EWAYBILL": "",
                "EWB_EXP_DT": ""
            }
        ]
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`${ProductionUrl}`,{
        method:'POST',
        body:JSON.stringify(Body),
        headers:myHeaders
    })
    // return Body;
    const Data = await response.json()
    if(!Data.reqcnt) throw new CustomError(JSON.stringify({Request:Body,error:(Data.details[0].errmsg)}),501)
        return {Data:Data,Body:Body}
})
const ShipmentLabel = ModalErrorHandller(async (data)=>{
    const myHeaders = new Headers();
   const testUrl = `https://pg-uat.gati.com/GATICOM_CUSTPKG.jsp?p1=4&p=${data}&p3=3`
    const ProductionUrl = `https://www.gati.com/Greport/GATICOM_CUSTPKG.jsp?p1=3&p=${data}&p3=3`
    myHeaders.append("Cookie", "JSESSIONID=C9F0AC7D5CD88B2E6BDFA13DEEC9EC93");
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
   const response = await fetch(ProductionUrl, requestOptions)
   return  response
})
module.exports = { DocketNo, Pakageseries, GatiWareHouse,shipmentCreation,ShipmentLabel,Gatitracking}