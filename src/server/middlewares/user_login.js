export const userLM = (req, res, next) => {
    res.locals.error = []

    if (req.error)
        res.locals.error = req.error

    next()
}

export const auth = (req, res, next) => {
    
}