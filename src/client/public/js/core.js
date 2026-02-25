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

    document.getElementById("modesBTN").addEventListener("click", async (ev) => {
        const btn = ev.target
        await toggleMode(btn)
    })

    document.getElementById("posts").addEventListener("submit", async (ev) => {
        if (ev.target.classList.contains("add-comment-form")) {
            ev.preventDefault()

            const form = ev.target;

            const post_id = form.dataset.postId
            const textarea = form.querySelector("textarea")
            const content = textarea.value

            try {
                ev.target.disabled = true
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

                    divcomment.innerHTML = `<div id="comment-${data.user.user_id}-${data.post_id}">
                                <div><a href='/${data.user.username}'>${data.user.username}</a></div>
                                <div><p>${data.content}</p>
                            </div>`


                    commentsdiv.append(divcomment)

                    textarea.value = ''
                }
                ev.target.disabled = false
            } catch (err) {
                console.error(err)
            }
        }
    })

    document.getElementById("posts").addEventListener("click", async (ev) => {

        //Like btn
        if (ev.target.classList.contains("like-btn")) {
            const post_id = ev.target.dataset.postId
            const btn = ev.target
            await like_dislike(post_id, btn)
        }

        //Comments btn
        if (ev.target.classList.contains("comments-btn")) {
            const post_id = ev.target.dataset.postId
            const btn = ev.target
            await show_hidecmt(post_id, btn)
        }

        //Load more btn
        if (ev.target.classList.contains("loadmore-btn")) {
            const post_id = ev.target.dataset.postId
            const btn = ev.target
            await loadmore(post_id, btn)
        }

        //Delete Cmt btn
        if (ev.target.classList.contains("delete-cmt-btn")) {
            const post_id = ev.target.dataset.postId
            const author_id = ev.target.dataset.authorId
            const comment_id = ev.target.dataset.commentId
            const btn = ev.target

            await deletecmt(comment_id, post_id, author_id, btn)
        }
    })

    document.querySelectorAll(".options-btn").forEach(opt_btn => opt_btn.addEventListener("click", (ev) => {
        const post_id = opt_btn.dataset.id
        const div = document.querySelector(`.post-menu[data-id='${post_id}']`)

        if (div)
            div.classList.toggle("hidden")
    }))

    document.querySelectorAll(".edit-btn").forEach(edit_btn => edit_btn.addEventListener("click", async (ev) => {
        const post_id = edit_btn.dataset.id
        const postDiv = edit_btn.parentElement.parentElement.parentElement.parentElement

        const center = postDiv.querySelector(".content")
        const content = center.querySelector("p").innerText

        const textarea = document.createElement("textarea")
        textarea.value = content
        textarea.classList.add('edit-textarea')

        const savebtn = document.createElement("button")
        savebtn.textContent = "Save"
        const cancelbtn = document.createElement("button")
        cancelbtn.textContent = "Cancel"

        center.innerHTML = ''
        center.appendChild(textarea)
        center.appendChild(savebtn)
        center.appendChild(cancelbtn)

        savebtn.addEventListener("click", async () => {
            const newcontent = textarea.value
            savebtn.disabled = true

            const response = await fetch(`/posts/${post_id}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newcontent })
            })

            const result = await response.json();

            if (result.success) {
                center.innerHTML = `<p class="post-body">${newcontent}</p>`;
            } else {
                alert(result.error.join(', '));
            }

            savebtn.disabled = false
        })

        cancelbtn.addEventListener('click', () => {
            center.innerHTML = `<p class="post-body">${content}</p>`;
        })
    }))

    document.querySelectorAll(".delete-btn").forEach(delete_btn => delete_btn.addEventListener("click", async (ev) => {
        const post_id = delete_btn.dataset.id
        await deletePost(post_id)
    }))

    document.getElementById("formPost").addEventListener("submit", async (ev) => {
        ev.preventDefault()

        const fileInput = document.getElementById("image")
        const file = fileInput.files[0]

        const content = document.getElementById("content")

        if (file) {
            if (!(file.size / 1024 / 1024 < 1))
                return alert("Large image!")

            const { signedUrl, path } = await generateSignedUrl(file)

            const result = await uploadFile(signedUrl, file, path)

            await Createpost(result.publicUrl, path, content)

            content.innerText = ""
            fileInput.innerHTML = ""
            document.getElementById("postC").classList.toggle("hidden")
        }
    })

})

async function toggleMode(btn) {
    try {
        btn.disabled = true
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

        btn.disabled = false
    } catch (err) {
        console.error(err)
    }
}

function createpost() {
    document.getElementById("postC").classList.toggle("hidden")
}

async function generateSignedUrl(file) {
    try {
        const result = await fetch("/api/files/upload", {
            method: "POST",
            body: JSON.stringify({
                fileName: file.name,
                type: file.type
            }),
            headers: { "Content-Type": "application/json" }
        })

        if (result.ok)
            return await result.json()
    } catch (err) {
        console.error(err)
    }
}

async function GetPublicURL(path) {
    const result = await fetch("/api/file/URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: path })
    })

    return result.json()
}

async function uploadFile(signedUrl, file, path) {
    await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
    })

    return GetPublicURL(path)
}

async function Createpost(url, path, content) {
    const result = await fetch("/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: content.value,
            url: url,
            path: path
        })
    })

    const post = await result.json()

    return AddPostDOM(post)
}

async function AddPostDOM(post) {
    const listDiv = document.getElementById("posts")

    let div = ``

    const innerhtml = listDiv.innerHTML

    if (!post.username || post.username === "null") return

    div += `
                <article id="post-${post.post_id}">
                    <div class="post">
                        <div class="user"> 
                            <a href="/${post.username}"> ${post.username}</a>`
    if (post.user_id === currentOwner)
        div += `<div class="post-actions">
                        <button class="options-btn" data-id="${post.post_id}">⋮</button>
                        <div class="post-menu hidden" data-id="${post.post_id}">
                            <button class="edit-btn" data-id="${post.post_id}">Edit</button>
                            <button class="delete-btn" data-id="${post.post_id}">Delete</button>
                        </div>
                    </div>`
    div += `</div>
                        <div class="content">`
    if (post.link)
        div += `<img src="${post.link}" alt="image">`
    div += `<p> ${post.ctn} </p>
                        </div>
                        <div class="bottomarticle">
                            <span><button class="like-btn" data-post-id="${post.post_id}">Like ${post.likes}</button></span>
                            <span><button class="comments-btn" data-post-id="${post.post_id}">Comments</button></span>
                        </div>
                        <div id="comments-${post.post_id}" class="comments">
                            <div class="topcmtbtn">
                                <form class="add-comment-form" data-post-id="${post.post_id}">
                                    <span>
                                        <textarea name="comment" placeholder="Add a comment here."></textarea>
                                        <button type="submit">Send</button>
                                    </span>
                                </form>
                            </div>
                            <div class="center" id="center-${post.post_id}"></div>
                            <div class="btnplace">
                                <button class="loadmore-btn" data-post-id="${post.post_id}">Load More</button>
                            </div>
                        </div>
                    </div>
                </article>`

    listDiv.innerHTML = div + innerhtml
}

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
                <article id="post-${element.post_id}">
                    <div class="post">
                        <div class="user"> 
                            <a href="/${element.username}"> ${element.username}</a>`
        if (element.user_id === currentOwner)
            div += `<div class="post-actions">
                        <button class="options-btn" data-id="${element.post_id}">⋮</button>
                        <div class="post-menu hidden" data-id="${element.post_id}">
                            <button class="edit-btn" data-id="${element.post_id}">Edit</button>
                            <button class="delete-btn" data-id="${element.post_id}">Delete</button>
                        </div>
                    </div>`
        div += `</div>
                        <div class="content">`
        if (element.post_img)
            div += `<img src="${element.post_img}" alt="image">`
        div += `<p> ${element.p_content} </p>
                        </div>
                        <div class="bottomarticle">
                            <span><button class="like-btn" data-post-id="${element.post_id}">Like ${element.likes}</button></span>
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

async function like_dislike(post_id, btn) {
    btn.disabled = true
    try {
        const likescontent = document.querySelector(
            `.like-btn[data-post-id="${post_id}"]`
        )

        const resultat = await fetch(`/api/post/${post_id}/like`,
            { method: "POST" }
        )
        const data = await resultat.json()

        if (resultat.ok)
            likescontent.innerText = "Like " + (parseInt(likescontent.innerText.replace("Like ", "")) + data)
        btn.disabled = false
    } catch (err) {
        console.error(err)
    }
}

async function loadmore(post_id, btn) {
    btn.disabled = true
    const commentsDiv = document.getElementById(`center-${post_id}`)

    try {
        let url = `/api/post/${post_id}/comments?limit=5`
        if (cursor[post_id])
            url += `&cursor=${cursor[post_id]}`

        const resultat = await fetch(url,
            { method: "GET" }
        )
        const data = await resultat.json()

        const comments = data.cmt
        if (comments.length < 5) return
        if (comments.length > 0)
            cursor[post_id] = comments[comments.length - 1].created_at

        let div = ''
        for (const comment of comments) {
            div += `
                <div id="comment-${comment.comment_id}">
                    <div><a href='/${comment.username}'>${comment.username}</a></div>
                    <div><p>${comment.p_content}</p></div>`
            if (currentOwner === comment.p_comment_author_id || data.owner == currentOwner)
                div += `<div><button class="delete-cmt-btn" data-post-id="${post_id}" data-author-id="${comment.p_comment_author_id}">Delete</button></div>`
            div += `</div>`
        }
        commentsDiv.innerHTML += div

        commentsDiv.classList.add("show")
        btn.disabled = false
    } catch (err) {
        console.error(err)
    }
}

async function show_hidecmt(post_id, btn) {
    btn.disabled = true
    const commentsDiv = document.getElementById(`center-${post_id}`)

    try {
        let url = `/api/post/${post_id}/comments?limit=5`

        const resultat = await fetch(url,
            { method: "GET" }
        )
        const data = await resultat.json()

        const comments = data.cmt

        if (comments.length > 0) {
            cursor[post_id] = comments[comments.length - 1].created_at
        }

        let div = ''
        for (const comment of comments) {
            div += `
                <div id="comment-${comment.comment_id}">
                    <div><a href='/${comment.username}'>${comment.username}</a></div>
                    <div><p>${comment.p_content}</p></div>`
            if (currentOwner === comment.p_comment_author_id || data.owner == currentOwner)
                div += `<div><button class="delete-cmt-btn" data-post-id="${post_id}" data-comment-id="${comment.comment_id}" data-author-id="${comment.p_comment_author_id}">Delete</button></div>`
            div += `</div>`
        }
        commentsDiv.innerHTML = div

        document.getElementById(`comments-${post_id}`).classList.toggle("show")
        btn.disabled = false
    } catch (err) {
        console.error(err)
    }
}

async function deletecmt(comment_id, post_id, comment_author_id, btn) {
    btn.disabled = true
    try {
        const result = await fetch(`/api/comments/${post_id}`, {
            method: "DELETE",
            body: JSON.stringify({ author_id: comment_author_id })
        })

        if (result.ok) {
            btn.disabled = false
            return document.getElementById(`comment-${comment_id}`).remove()
        }
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

async function deletePost(post_id) {
    try {
        const result = await fetch(`/posts/${post_id}`, { method: "DELETE" })

        if (result.ok) {
            return document.getElementById(`post-${post_id}`).remove()
        }
    } catch (err) {
        console.error(err)
    }
}