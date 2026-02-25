window.addEventListener("load", async (ev) => {
    try {
        await fetch("/refresh")
        
    } catch (err) {
        console.error(err)
    }
})