let originalData = { user_id: null, nickname: null, bio: null, email: null, url: null, path: null }
let deletedAvatar = false
let newAvatar = null

window.addEventListener("load", async () => {
    originalData = {
        nickname: document.getElementById("nickname").value,
        bio: document.getElementById("bio").value,
        email: document.getElementById("gmail").value
    }

    //Show pop up
    document.getElementById("edit-profile").addEventListener("click", () => {
        document.getElementById("editProfile").classList.toggle("hide")
    })

    const imageholder = document.getElementById("imageholder")
    const avatarInput = document.getElementById("avatar")
    const removeavatar = document.getElementById("removeavatar")

    if (!imageholder.src.includes("user.png"))
        removeavatar.classList.remove("hide")
    else
        removeavatar.classList.add("hide")

    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0]
        if (!file) return

        newAvatar = file
        imageholder.src = URL.createObjectURL((file))
        removeavatar.classList.remove("hide")
        deletedAvatar = false
    })

    removeavatar.addEventListener("click", async (ev) => {
        imageholder.src = "img/user.png"
        avatarInput.value = ""
        removeavatar.classList.add("hide")
        deletedAvatar = true
        newAvatar = null
    })

    document.getElementById("form").addEventListener("submit", async (ev) => {
        ev.preventDefault()
        const user_id = ev.target.dataset.id
        const nickname = document.getElementById("nickname").value || null
        const bio = document.getElementById("bio").value || null
        const email = document.getElementById("gmail").value

        let updatedFields = { user_id }

        if (originalData.nickname !== nickname)
            updatedFields.nickname = nickname

        if (originalData.email !== email)
            updatedFields.email = email

        if (originalData.bio !== bio)
            updatedFields.bio = bio

        if (deletedAvatar) {
            try {
                await DeleteAvatar(user_id)
                deletedAvatar = false
            } catch (err) {
                console.error("Delete failed", err)
                alert("Failed to remove avatar")
                return
            }

            updatedFields.avatar = null
            updatedFields.avatar_path = null
        }

        if (newAvatar) {
            if (!(newAvatar.size / 1024 / 1024 < 1)) {
                document.getElementById("imageholder").src = "img/user.png"
                document.getElementById("removeavatar").classList.remove("hide")
                return
            }
            const { signedUrl, path } = await GeneratePublicURL(newAvatar)
            const { publicUrl } = await UploadImg(signedUrl, newAvatar, path)

            updatedFields.avatar_path = path
            updatedFields.avatar = publicUrl
        }

        if (Object.keys(updatedFields).length === 1) {
            alert("No change")
            return
        }

        console.log(updatedFields)

        await UpdateUser(updatedFields)
        originalData = { nickname, bio, email }

        deletedAvatar = false
        newAvatar = null
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
    return await fetch("/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userInfo: userInfo
        })
    })
}

async function DeleteAvatar(user_id) {
    return await fetch("/api/file/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id })
    })
}