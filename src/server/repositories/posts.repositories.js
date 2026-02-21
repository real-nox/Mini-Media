import query from "../db/database.js"

export const savePost = async (user_id, content) => {
    console.log(user_id, content)
    await query("insert into posts (post_owner_id, p_content) values ($1, $2)", [user_id, content])

    return true
}

export const listPosts = async (limit) => {
    const result = await query(`select p.post_id,p.p_content,p.created_at,u.username,count(l.post_id) as likes
        from posts p join users u on p.post_owner_id = u.user_id
        left join likes l on l.post_id = p.post_id
        group by p.post_id, u.username
        order by p.created_at desc limit $1
        `,
        [limit]
    )

    if (result?.rows)
        return result?.rows

    return false
}

export const get_like = async (post_id, liker) => {
    const result = await query("select * from likes where post_id = $1 and user_id = $2", [post_id, liker])

    if (result?.rowCount)
        return true
    return false
}

export const addLike = async (post_id, liker) => {
    const result = await query("insert into likes (user_id, post_id) values($1, $2)", [liker, post_id])

    if (result?.rowCount)
        return +1
    return false
}

export const removeLike = async (post_id, liker) => {
    await query("delete from likes where post_id = $1 and user_id = $2", [post_id, liker])

    return -1
}

export const getcmt = async (post_id, limit, cursor) => {
    const result = await query(`
        select 
        c.comment_id,
        u.username,
        c.p_content,
        c.created_at,
        c.p_comment_author_id
        from post_comments c
        left join users u on u.user_id = c.p_comment_author_id
        where post_id = $1
        and ($2::timestamptz is null or c.created_at > $2)
        order by c.created_at desc
        limit $3
        `, [post_id, cursor, limit])

    return result.rows
}

export const getPost = async (post_id) => {
    const result = await query("select * from posts where post_id = $1", [post_id])

    if (!result?.rows)
        return false

    return true
}

export const addcmt = async (post_id, user_id, content) => {
    const result = await query("insert into post_comments (post_id, p_comment_author_id, p_content) values($1, $2, $3)", [post_id, user_id, content])

    if (result?.rowCount)
        return true
    return false
}

export const delcmt = async (post_id, user_id) => {
    const result = await query("delete from post_comments where post_id = $1 and p_comment_author_id = $2", [post_id, user_id])

    if (result?.rowCount)
        return true
    return false
}