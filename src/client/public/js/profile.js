let originalData = { user_id: null, nickname: null, bio: null, email: null, url: null, path: null }
let deletedAvatar = false
let newAvatar = null
let currentOwner = null

window.addEventListener("load", async () => {

    currentOwner = await owner()

    let followings
    let followers

    let followe
    let followsList

    const followdiv = document.getElementById("follow")

    const user_id = followdiv.dataset.id

    async function followS() {

        followings = await Getfollowings(user_id)
        followers = await Getfollowers(user_id)

        const div = `<button id="followersL" data-id="${user_id}">Followers ${followers.count} </button> <button id="followingL" data-id="${user_id}">Following ${followings.count} </button>`
        followdiv.innerHTML = div

        followsList = document.getElementById("follows")

        followe = Array.isArray(followers.result) ? followers.result : [followers.result]

        ListenersFollowers()
        FollowBTN()
    }

    function ListenersFollowers() {
        const followersBTN = document.getElementById("followersL")
        const followingBTN = document.getElementById("followingL")

        if (followersBTN)
            followersBTN.addEventListener("click", async (ev) => {
                followsList.classList.toggle("hidden")

                if (followe) {
                    followe = Array.isArray(followe) ? followe : [followe]
                    let followersd = "<div id='center'>"

                    for (const { follower_id, following_id } of followe) {
                        console.log(follower_id)
                        const user = await GetUserViaID(follower_id)
                        console.log(user)
                        followersd += `<span><a href="/${user.username}">${user.username}</a></span>`
                    }

                    document.getElementById("follows").innerHTML = document.querySelector("#follows-top").innerHTML = "<p>Followers</p>" + followersd
                }
            })

        if (followingBTN)
            followingBTN.addEventListener("click", async (ev) => {
                followsList.classList.toggle("hidden")

                let followin = followings.result
                if (followin) {
                    followin = Array.isArray(followin) ? followin : [followin]
                    let followingsd = "<div id='center'>"

                    for (const { follower_id, following_id } of followin) {
                        console.log(following_id)
                        const user = await GetUserViaID(following_id)
                        console.log(user)
                        followingsd += `<span><a href="/${user.username}">${user.username}</a></span>`
                    }

                    document.getElementById("follows").innerHTML = document.getElementById("follows top").innerHTML = "<p>Following</p>" + followingsd
                }
            })
    }

    function FollowBTN() {
        if (user_id === currentOwner) return

        const btn = document.getElementById("bottom")
        if (!btn) return

        if (!followe || followe.some(f => f == null))
            btn.innerHTML = `<button class="follow_unfollow" id="follow_unfollow" data-id="${user_id}">Follow</button>`
        else {
            let isFollowed = false
            followe.forEach(element => {
                if (element.follower_id === currentOwner)
                    isFollowed = true
            })

            if (isFollowed)
                btn.innerHTML = `<button class="follow_unfollow" id="follow_unfollow" data-id="${user_id}">Unfollow</button>`
            else
                btn.innerHTML = `<button class="follow_unfollow" id="follow_unfollow" data-id="${user_id}">Follow</button>`
        }

        const followBTN = document.getElementById("follow_unfollow")

        if (followBTN)
            followBTN.addEventListener("click", async (ev) => {
                const owner = followBTN.dataset.id
                const res = await un_follow(owner)
                await followS()
            })
    }

    await followS()

    if (user_id === currentOwner) {
        document.getElementById("edit").classList.remove("hidden")
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
    }
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

async function Getfollowings(user_id) {
    try {
        const result = await fetch("/user/followings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user_id })
        })

        if (result.ok)
            return result.json()
    } catch (err) {
        console.error(err)
    }
}

async function Getfollowers(user_id) {
    try {
        const result = await fetch("/user/followers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user_id })
        })

        if (result.ok)
            return result.json()
    } catch (err) {
        console.error(err)
    }
}

async function GetUserViaID(user_id) {
    try {
        const result = await fetch("/user/getUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user_id })
        })

        if (result.ok)
            return result.json()
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

async function un_follow(user_id) {
    try {
        const result = await fetch("/user/follow_unfollow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_owner_id: user_id })
        })

        const data = await result.json()

        return data
    } catch (err) {
        console.error(err)
    }
}