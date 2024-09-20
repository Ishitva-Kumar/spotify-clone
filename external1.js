console.log('Lets write JavaScript');
let currentIndex = 0;
let currentSong = new Audio();
let songs = [
    {
        name: "Aane Do Babhan Ko Shashan mein",
        url: "http://127.0.0.1:5500/songs/%23Video%20%23%E0%A4%85%E0%A4%AD%E0%A4%B7%E0%A4%95%20%E0%A4%B8%E0%A4%B9%20%20%E0%A4%AC%E0%A4%AD%E0%A4%A8%20%E0%A4%95%20%E0%A4%86%E0%A4%A8%20%E0%A4%A6%20%E0%A4%B6%E0%A4%B8%E0%A4%A8%20%E0%A4%AE%20%20%23Abhishek%20Singh%2C%20%23Appi%20Parthi%20%20Bhojpuri%20Song.mp3"
    },
    {
        name: "Paracetamol",
        url: "http://127.0.0.1:5500/songs/audio.mp3" // External URL for Song 2
    },
    {
        name: "Rakt Charitra",
        url: "http://127.0.0.1:5500/songs/videoplaybackrakt.m4a" // External URL for Song 2
    },
    {
        name: "Baagh Ka Kareja",
        url: "http://127.0.0.1:5500/songs/Baagh%20Ka%20Kareja%20(Song)%20%20Manoj%20Bajpayee%20%20Manoj%20Tiwari%2C%20Dr%20Sagar%2C%20Aditya%20Dev%20%20Bhaiyya%20Ji%20%2024th%20May.mp3" // External URL for Song 2
    },
    {
        name: "Aarabh Hai Prachand",
        url: "http://127.0.0.1:5500/songs/ARAMBH%20HAI%20PRACHAND%20LYRICS%20%20%20%23motivation101%20%23motivation.mp3" // External URL for Song 2
    }
   
];

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (trackUrl, trackName, pause = false) => {
    currentSong.src = trackUrl;
    if (!pause) {
        currentSong.play();
        document.querySelector("#play").src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(trackName);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

const playNextSong = () => {
    currentIndex = (currentIndex + 1) % songs.length; // Move to the next song, loop back if it's the last one
    playMusic(songs[currentIndex].url, songs[currentIndex].name);
};

const playPreviousSong = () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length; // Move to the previous song, loop back to last song if it's the first one
    playMusic(songs[currentIndex].url, songs[currentIndex].name);
};

function setupCardClicks() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const songUrl = card.getAttribute('data-song-url');
            const songName = card.querySelector('h2').innerText;
            playMusic(songUrl, songName);
        });
    });
}

async function main() {
    // Create the song list dynamically
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    songs.forEach(song => {
        songUL.innerHTML += `
            <li>
                <img class="invert" width="34" src="music.svg" alt="">
                <div class="info">
                    <div>${song.name}</div>
                    <div>T-Series</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg" alt="">
                </div>
            </li>`;
    });

    // Attach an event listener to each song item
    Array.from(songUL.getElementsByTagName("li")).forEach((element, index) => {
        element.addEventListener("click", () => {
            currentIndex = index;
            playMusic(songs[currentIndex].url, songs[currentIndex].name);
        });
    });

    // Listen for the play/pause button
    document.querySelector("#play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.querySelector("#play").src = "pause.svg";
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "play.svg";
        }
    });

    document.querySelector("#next").addEventListener("click", playNextSong);
    document.querySelector("#previous").addEventListener("click", playPreviousSong);

    // Listen for time updates and update the progress bar
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seek through the song
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });
     // Add an event listener for hamburger
     document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
      // Add an event to volume
      document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


    // Setup card clicks
    setupCardClicks();
}

// Initialize the app
main();
