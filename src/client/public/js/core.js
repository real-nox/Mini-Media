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
        console.log(err)
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
            div += '<div class="post ' + element.post_id + '">' +
                '<div class="user"> <a href="/' + element.username + '">' + element.username + '</a></div>' +
                '<div class="content"> <p>' + element.p_content + '</p></div>' +
                `<div class="likes"> <p id='likes-${element.post_id}'> ${element.likes} </p> <button onclick="like_dislike('${element.post_id}' )">Like</button></div>` +
                '</div>'

        }
        listDiv.innerHTML = div
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

})

async function like_dislike(post_id) {
    try {
        const likescontent = document.getElementById("likes-" + post_id)

        const resultat = await fetch(`/api/post/like/${post_id}`,
            { method: "POST" }
        )
        const data = await resultat.json()

        likescontent.innerText = parseInt(likescontent.innerText) + data

        return data
    } catch (err) {
        console.log(err)
    }
}