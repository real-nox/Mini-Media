async function toggleMode() {
    try {
        setTimeout(async () => {
            const result = await fetch("/api/modes/toggle")
            const data = await result.json()

            if (data && data === "dark") {
                document.getElementById("maincontainer").classList.remove("white")
                document.getElementById("maincontainer").classList.add("dark")
                document.getElementById("modesBTN").innerText = "Light Mode"
            } else {
                document.getElementById("maincontainer").classList.remove("dark")
                document.getElementById("maincontainer").classList.add("white")
                document.getElementById("modesBTN").innerText = "Dark Mode"
            }
        }, 500)
    } catch (err) {
        console.log(err)
    }
}

function createpost() {
    document.getElementById("postC").classList.toggle("hidden")
}

window.addEventListener("load", async (ev) => {

    const list = await getList()

    if (list)
        return await showList()

    async function showList() {
        const listDiv = document.getElementById("posts")

        let div = ``

        listDiv.innerHTML = ""

        for (element of list) {

            console.log("here")
            let owner = await getOwner(element.post_ower_id)

            if (owner == null || owner == "null") return

            let likes = await getLikes(element.post_id)
            div += '<div class="post ' + element.post_id + '">' +
                '<div class="user"> <a href="/' + owner + '">' + owner + '</a></div>' +
                '<div class="content"> <p>' + element.p_content + '</p></div>' +
                '<div class="likes"> <p>' + likes + '</p> <button onclick="like_dislike(' + element.post_id + ')">Like</button></div>' +
                '</div>'

            listDiv.innerHTML += div
        }
    }

    async function getList() {
        try {
            const resultat = await fetch("/api/posts?limit=10")

            if (!resultat) return
            const data = await resultat.json()

            return data
        } catch (err) {
            console.log(err)
        }
    }

    async function getLikes(list) {
        try {
            const resultat = await fetch(`/api/likes/${list}`)
            const data = await resultat.json()

            return data
        } catch (err) {
            console.log(err)
        }
    }

    async function getOwner(owner) {
        try {
            const resultat = await fetch(`/api/post/${owner}`)
            const data = await resultat.json()

            return data
        } catch (err) {
            console.log(err)
        }
    }

})

async function like_dislike(post_id) {
    try {
        const resultat = await fetch(`/api/post/like/${post_id}`)
        const data = await resultat.json()

        return data
    } catch (err) {
        console.log(err)
    }
}