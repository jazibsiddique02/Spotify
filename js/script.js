let currentSong = new Audio();
let songs;
let currentFolder;


function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure minutes and seconds are always two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}








async function getSongs(folder) {
    currentFolder = folder;

    let a = await fetch(`http://127.0.0.1:3000/songs/${currentFolder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/songs/${currentFolder}/`)[1])
        }

    }


    songsUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songsUL.innerHTML = ""
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li>
                            <img src="img/music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", "")}</div>
                                <div class="artist">Jazib</div>
                            </div>

                            <div class="playNow">
                                <span>Play Now</span>
                                <img src="img/play.svg" class="invert" alt="">
                            </div> </li>`;


    }


    // Event listener for playing selected song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    return songs


}


function playMusic(track, pause = false) {
    currentSong.src = `/songs/${currentFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}





async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response

    let anchors = div.getElementsByTagName("a")

    let cardContainer = document.querySelector(".cardcontainer")





    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `       <div data-folder=${folder} class="card">
                        <div class="play">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#141B34"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="none" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>


                        <img src="songs/${folder}/image.jpg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>

                    </div>`
        }

    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })




}


async function main() {

    displayAlbums()
    await getSongs("Angry_Mood")

    playMusic(songs[0], true)







    // Event Listener for play,next,prev

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }

        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })



    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)} `
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })



    // Event Listener to Seek Bar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    // Event Listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })




    // Event Listener to hamburger
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })




    // Event Listener To Previous and Next

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index > 0) {
            playMusic(songs[index - 1])
        }

    })


    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index < songs.length - 1) {

            playMusic(songs[index + 1])

        }

    })







    document.querySelector(".volumelogo").addEventListener("click", () => {
        if (document.querySelector(".range").style.display == "block") {

            document.querySelector(".range").style.display = "none";

        }
        else {
            document.querySelector(".range").style.display = "block";

        }
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })









}

main()

