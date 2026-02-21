async function toggleMode() {
    try {
        let result = await fetch("/api/modes/toggle", { method: "POST" })
        let data = await result.json()


        const container = document.getElementById("maincontainer")

        if (data && data === "dark") {
            if (container.classList.contains("light"))
                container.classList.remove("light")

            container.classList.add("dark")
            document.getElementById("modesBTN").innerText = "Light Mode"
        } else {
            if (container.classList.contains("dark"))
                container.classList.remove("dark")

            container.classList.add("light")
            document.getElementById("modesBTN").innerText = "Dark Mode"
        }
    } catch (err) {
        console.error(err)
    }
}

function createpost() {
    document.getElementById("postC").classList.toggle("hidden")
}

let currentOwner = null
let cursor = {}

window.addEventListener("load", async (ev) => {

    currentOwner = await owner()
    setInterval(async () => {

        const list = await getList()

        if (list) {
            await showList(list)
        }
    }, 1000 * 60 * 5)

    const list = await getList()

    if (list) {
        await showList(list)
    }

    document.getElementById("posts")
        .addEventListener("submit", async (ev) => {
            if (ev.target.classList.contains("add-comment-form")) {
                ev.preventDefault()

                const form = ev.target;

                const post_id = form.dataset.postId
                const textarea = form.querySelector("textarea")
                const content = textarea.value

                try {
                    const resultat = await fetch(`/api/post/${post_id}/comments`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ content })
                        }
                    )

                    const data = await resultat.json()

                    if (resultat.ok) {
                        const commentsdiv = form.closest(".comments")
                        const divcomment = document.createElement("div")

                        divcomment.innerHTML = `<div id="comment-${data.user}-${data.post_id}">
                                <div><a href='/${data.user}'>${data.user}</a></div>
                                <div><p>${data.content}</p>
                            </div>`

                        commentsdiv.append(divcomment)

                        textarea.value = ''
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        })

    document.getElementById("posts").addEventListener("click", async (ev) => {

        //Like btn
        if (ev.target.classList.contains("like-btn")) {
            const post_id = ev.target.dataset.postId
            await like_dislike(post_id)
        }

        //Comments btn
        if (ev.target.classList.contains("comments-btn")) {
            const post_id = ev.target.dataset.postId
            await show_hidecmt(post_id)
        }

        //Load more btn
        if (ev.target.classList.contains("loadmore-btn")) {
            const post_id = ev.target.dataset.postId
            await loadmore(post_id)
        }

        //Delete btn
        if (ev.target.classList.contains("delete-btn")) {
            const comment_id = ev.target.dataset.commentId
            await deletecmt(comment_id)
        }
    })

})

async function getList() {
    try {
        const resultat = await fetch("/api/posts?limit=10")

        if (!resultat) return
        const data = await resultat.json()

        return data
    } catch (err) {
        console.error(err)
    }
}

async function showList(list) {
    const listDiv = document.getElementById("posts")

    let div = ``

    listDiv.innerHTML = ""

    for (const element of list) {

        if (!element.username || element.username === "null") continue
        div += `
                <article>
                    <div class="post">
                        <div class="user"> 
                            <a href="/${element.username}"> ${element.username}</a>
                        </div>
                        <div class="content">
                            <p> ${element.p_content} </p>
                        </div>
                        <div class="bottomarticle">
                            <span><button class="like-btn" data-post-id="${element.post_id}">Like ${element.likes}</button> </span>
                            <span><button class="comments-btn" data-post-id="${element.post_id}">Comments</button></span>
                        </div>
                        <div id="comments-${element.post_id}" class="comments">
                            <div class="topcmtbtn">
                                <form class="add-comment-form" data-post-id="${element.post_id}">
                                    <span>
                                        <textarea name="comment" placeholder="Add a comment here."></textarea>
                                        <button type="submit">Send</button>
                                    </span>
                                </form>
                            </div>
                            <div class="center" id="center-${element.post_id}"></div>
                            <div class="btnplace">
                                <button class="loadmore-btn" data-post-id="${element.post_id}">Load More</button>
                            </div>
                        </div>
                    </div>
                </article>`

    }
    listDiv.innerHTML = div
}

async function like_dislike(post_id) {
    try {
        const likescontent = document.querySelector(
            `.like-btn[data-post-id="${post_id}"]`
        )

        const resultat = await fetch(`/api/post/${post_id}/like`,
            { method: "POST" }
        )
        const data = await resultat.json()

        likescontent.innerText = "Like " + (parseInt(likescontent.innerText.replace("Like ", "")) + data)

        return data
    } catch (err) {
        console.error(err)
    }
}

async function loadmore(post_id) {
    const commentsDiv = document.getElementById(`center-${post_id}`)

    try {
        let url = `/api/post/${post_id}/comments?limit=5`
        if (cursor[post_id])
            url += `&cursor=${cursor[post_id]}`

        const resultat = await fetch(url,
            { method: "GET" }
        )
        const data = await resultat.json()

        if (data.length < 5) return
        if (data.length > 0)
            cursor[post_id] = data[data.length - 1].created_at

        let div = ''
        for (const comment of data) {
            div += `
                <div id="comment-${comment.comment_id}">
                    <div><a href='/${comment.username}'>${comment.username}</a></div>
                    <div><p>${comment.p_content}</p></div>`
            if (currentOwner === comment.p_comment_author_id)
                div += `<div><button class="delete-btn" data-comment-id="${comment.comment_id}">Delete</button></div>`
            div += `</div>`
        }
        commentsDiv.innerHTML += div

        commentsDiv.classList.add("show")
    } catch (err) {
        console.error(err)
    }
}

async function show_hidecmt(post_id) {
    const commentsDiv = document.getElementById(`center-${post_id}`)

    try {
        let url = `/api/post/${post_id}/comments?limit=5`

        const resultat = await fetch(url,
            { method: "GET" }
        )
        const data = await resultat.json()

        if (data.length > 0) {
            cursor[post_id] = data[data.length - 1].created_at
        }

        let div = ''
        for (const comment of data) {
            div += `
                <div id="comment-${comment.comment_id}">
                    <div><a href='/${comment.username}'>${comment.username}</a></div>
                    <div><p>${comment.p_content}</p></div>`
            if (currentOwner === comment.p_comment_author_id)
                div += `<div><button class="delete-btn" data-comment-id="${comment.comment_id}">Delete</button></div>`
            div += `</div>`
        }
        commentsDiv.innerHTML = div

        document.getElementById(`comments-${post_id}`).classList.toggle("show")
    } catch (err) {
        console.error(err)
    }
}

async function deletecmt(comment_id) {
    try {
        const result = await fetch(`/api/comments/${comment_id}`, { method: "DELETE" })

        if (result.ok)
            return document.getElementById(`comment-${comment_id}`).remove()
    } catch (err) {
        console.error(err)
    }
}

async function owner() {
    try {
        const result = await fetch("/api/user", { method: "GET" })
        const data = await result.json()

        return data
    } catch (err) {
        console.error(err)
    }
}