export const asyncHandler = (fct) => {
    return (req, res, next) => {
        Promise.resolve(fct(req, res, next)).catch(next)
    }
}

export default class ErrorHandler extends Error {
    constructor (message, status) {
        super(message)
        this.status = status
    }
}