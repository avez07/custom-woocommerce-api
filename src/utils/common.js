const moment = require('moment-timezone')

const UtctoLocalString = (data,format) =>{
   return  moment.utc(data).local().format(format)
}
module.exports = UtctoLocalString