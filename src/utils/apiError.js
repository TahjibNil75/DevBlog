// Define a custom error class that extends the built-in Error class
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message) // Call the parent class constructor with the message
        this.statusCode = statusCode
        this.data = null, 
        this.message = message
        this.success = false, // As e throw api error so in response we use false for api success response
        this.errors = errors

        if (stack){ // Todo: Study on stack
            this.stack = stack
        }else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}