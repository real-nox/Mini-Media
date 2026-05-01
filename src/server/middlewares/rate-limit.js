import { rateLimit } from "express-rate-limit"

export const authRate = rateLimit({
    limit: 100,
    windowMs: 60000 * 5,
    legacyHeaders: false,
    standardHeaders: "draft-8"
})

export const postsRate = rateLimit({
    limit: 8,
    windowMs: 60000 * 10,
    legacyHeaders: false,
    standardHeaders: "draft-8",
})

export const commentsRate = rateLimit({
    limit: 10,
    windowMs: 60000 * 2,
    legacyHeaders: false,
    standardHeaders: "draft-8",
})

export const likesRate = rateLimit({
    limit: 5,
    windowMs: 60000 * 2,
    legacyHeaders: false,
    standardHeaders: "draft-8",
})

export const followingRate = rateLimit({
    limit: 5,
    windowMs: 60000 * 2,
    legacyHeaders: false,
    standardHeaders: "draft-8",
})