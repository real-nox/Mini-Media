window.addEventListener("load", () => {
    //Show pop up
    document.getElementById("edit-profile").addEventListener("click", () => {
        console.log('hrtr')
        document.getElementById("editProfile").classList.toggle("hide")
    })

    const avatarInput = document.getElementById("avatar")
    avatarInput.addEventListener("change", () => {
        document.getElementById("imageholder").src = URL.createObjectURL((avatarInput.files[0]))
        document.getElementById("removeavatar").classList.toggle("hide")
    })

    document.getElementById("removeavatar").addEventListener("click", (ev) => {
        document.getElementById("imageholder").src = "img/user.png"
        document.getElementById("removeavatar").classList.toggle("hide")
    })

    document.getElementById("form").addEventListener("submit", async (ev) => {
        ev.preventDefault()
        const userId = ev.target.dataset.id
        const avatar = document.getElementById("avatar").files[0] || null
        const nickname = document.getAnimations("bio").value || null
        const email = document.getElementById("gmail").value

        console.log(avatar)
        const userInfo = { avatar, nickname, email }

        if (avatar) {
            const result = await GeneratePublicURL(avatar.type)
            console.log(result)
        }


        const resultat = await UpdateUser(userId, userInfo)
        console.log(resultat)
    })
})

async function GeneratePublicURL(type) {
    const result = await fetch("/user/avatar", {
        method: "POST",
        body: JSON.stringify({ filetype: type }),
        headers: { "Content-Type": "application/json" }
    })

    console.log(result)

    return result.json()
}

async function UpdateUser(userId, userInfo) {
    return (
        await fetch("")
    ).json()
}