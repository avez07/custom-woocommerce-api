const CustomError = require("./customerror");

const ModalErrorHandller = (func) => {
    return async (...data) => {

        return await func(...data).catch(err => { throw new CustomError(err.message,err.statuscode || 500) });

    }
};
module.exports = ModalErrorHandller