let originalData = { user_id: null, nickname: null, bio: null, email: null, url: null, path: null }

window.addEventListener("load", async () => {
    originalData = {
        nickname: document.getElementById("nickname").value,
        bio: document.getElementById("bio").value,
        email: document.getElementById("gmail").value
    }

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
        originalData.user_id = ev.target.dataset.id
        const avatar = document.getElementById("avatar").files[0] || null
        const nickname = document.getElementById("nickname").value || null
        const bio = document.getElementById("bio").value || null
        const email = document.getElementById("gmail").value

        const userInfo = { avatar, nickname, email }

        if (avatar) {
            if (!(avatar.size / 1024 / 1024 < 1)) {
                document.getElementById("imageholder").src = "img/user.png"
                document.getElementById("removeavatar").classList.toggle("hide")
                return
            }
            const { signedUrl, path } = await GeneratePublicURL(avatar)

            originalData.path = path
            const { publicUrl } = await UploadImg(signedUrl, avatar, path)
            originalData.url = publicUrl
        }

        if (originalData.nickname !== nickname)
            originalData.nickname = nickname

        if (originalData.email !== email)
            originalData.email = email

        if (originalData.bio !== bio)
            originalData.bio = bio

        const resultat = await UpdateUser(originalData)
        console.log(resultat)
    })
})

async function GeneratePublicURL(file) {
    try {
        const result = await fetch("/api/files/upload", {
            method: "POST",
            body: JSON.stringify({
                fileName: file.name,
                type: file.type,
                path: "UserAvatar"
            }),
            headers: { "Content-Type": "application/json" }
        })

        if (result.ok)
            return await result.json()
    } catch (err) {
        console.error(err)
    }
}

async function UploadImg(url, file, path) {
    await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
    })

    return GetPublicURL(path)
}

async function GetPublicURL(path) {
    const result = await fetch("/api/file/URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: path, folder: "UserAvatar" })
    })

    return result.json()
}
async function UpdateUser(userInfo) {
    return (
        await fetch("/user/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userInfo: userInfo
            })
        })
    ).json()
}