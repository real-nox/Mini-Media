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

window.addEventListener("load", async (ev) => {

    setInterval(async () => {

        const list = await getList()

        if (list) {
            showList()
        }
    }, 1000 * 60 * 5)

    const list = await getList()

    if (list) {
        showList()
    }

    async function showList() {
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
                            <span> <button id='likes-${element.post_id}' onclick="like_dislike('${element.post_id}')">Like ${element.likes}</button> </span>
                            <span><button onclick="show_hidecmt('${element.post_id}')">Comments</button> </span>
                        </div>
                        <div id="comments ${element.post_id}" class="comments">
                            <div class="topcmtbtn">
                                <form class="add-comment-form" data-post-id="${element.post_id}">
                                    <span>
                                        <textarea name="comment" id="comment" placeholder="Add a comment here."></textarea>
                                        <button type="submit">Send</button>
                                    </span>
                                </form>
                            </div>
                        </div>
                    </div>
                </article>`

        }
        listDiv.innerHTML = div
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

                    /*let div = ''
                    for (const comment of data) {
                        div += `
                            <div id="comment-${comment.comment_id}">
                                <div><span>${comment.username}</span></div>
                                <div><p>${comment.p_content}</p>
                            </div>`
                    }
                    commentsDiv.innerHTML += div

                    commentsDiv.classList.toggle("show")*/
                } catch (err) {
                    console.error(err)
                }
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

async function like_dislike(post_id) {
    try {
        const likescontent = document.getElementById("likes-" + post_id)

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

async function show_hidecmt(post_id) {
    const commentsDiv = document.getElementById(`comments ${post_id}`)

    try {
        const resultat = await fetch(`/api/post/${post_id}/comments`,
            { method: "GET" }
        )
        const data = await resultat.json()

        let div = ''
        for (const comment of data) {
            div += `
                <div id="comment-${comment.comment_id}">
                    <div><span>${comment.username}</span></div>
                    <div><p>${comment.p_content}</p>
                </div>`
        }
        commentsDiv.innerHTML += div

        commentsDiv.classList.toggle("show")
    } catch (err) {
        console.error(err)
    }
}