export const userLM = (req, res, next) => {
    res.locals.error = []

    if (req.error)
        res.locals.error = req.error

    next()
}

export const modes = (req, res, next) => {
    req.mode = ["ligth"]
    
    if(req.cookies?.ssmodes)
        req.mode = [req.cookies?.ssmodes]

    next()
}