class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal SErver Error"
    err.statusCode = err.statusCode || 500;

    if(err.name === "CaseError"){
        const message = `Resourse not found. Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    } 
    //Databse related error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token Error, Try Again`
        err = new ErrorHandler(message, 400)
    }
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token Ex[ired], Try Again`
        err = new ErrorHandler(message, 400)
    }
    return res.status(err.statusCode).json({
        success: false,
        err: err.message
    })
}

export default ErrorHandler;