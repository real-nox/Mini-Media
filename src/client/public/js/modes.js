async function toggleMode() {
    try {
        setTimeout(async() => {
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