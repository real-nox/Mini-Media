window.addEventListener("load", async (ev) => {
    try {
        const result = await fetch("/refresh")
        
    } catch (err) {
        console.log(err)
    }
})