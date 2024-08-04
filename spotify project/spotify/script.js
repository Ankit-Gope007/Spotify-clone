console.log("YEaaaah its now js timeeeeeeeeeeeeee");
let previous = document.querySelector(".next");
let next = document.querySelector(".previous");
let play = document.querySelector(".music_play");
let songs;
let rockstar = []
let raw = []
let play_song;
//time converting function
function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero to minutes and seconds if they are less than 10
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Return the formatted time string
    return `${formattedMinutes}:${formattedSeconds}`;
}














//Getting songs from thw folder into an array
async function getsongs(folder) {
    let x = await fetch(`http://127.0.0.1:5502/spotify%20project/${folder}`);
    let v = await x.text()
    let div = document.createElement("div");
    div.innerHTML = v;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.title.endsWith(".mp3")) {
            songs.push(element.title);
        }
    }

    let songul = document.querySelector(".song_list").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        let k = song.replaceAll("128", " ")
        let r = k.replaceAll("Kbps.mp3", " ")
        raw.push(r)
        // console.log(r);

        // console.log(`${r.split("-")[2]}`)
        songul.innerHTML = songul.innerHTML + `<li>
                                <i class="fa-solid fa-music"></i>
                        <div class="info">
                            <div class="song_name">${r.split("-")[1]}</div>
                            <div class="song_info">${r.split("-")[2]}</div>
                        </div>
                        <div class="icon_play"><i class="fa-regular fa-circle-play"></i></div>
        </li>`


        // rockstar.push(play_song);



    }
    console.log(songs);
    console.log(raw);



    //making separate links array of the songs
    for (const song of raw) {
        let fir = song.split("-")[1]
        let f = fir.replaceAll(" ", "%20")
        let l =  song.split("-")[2]

        
     
        let url=f + "-%20" + l
        console.log(url);
        let t = `http://127.0.0.1:5502/spotify%20project/${folder}/128-` + url + "%20128%20Kbps.mp3"
        let play_song = t.split(" ").join("")
        rockstar.push(play_song)
        // console.log(rockstar);
    }
    console.log(rockstar);

    //get url of the song;
    function geturl(e) {
        let fir = e.querySelector(".info").firstElementChild.innerHTML
        let f = fir.replaceAll(" ", "%20")
        let l = e.querySelector(".info").lastElementChild.innerHTML
        let url = f + "-%20" + l
        console.log(url);

        return url;

    }
    //from url get song
    function revurl(e) {

        let k = songs.replaceAll("128", " ")
        let r = k.replaceAll("Kbps.mp3", " ")
    }
    //after clicking a song will play
    Array.from(document.querySelector(".song_list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            // console.log(e.getElementsByClassName("info"));
            let url = geturl(e)
            // let t = "http://127.0.0.1:5501/rockstar/128-" + url + "%20128%20Kbps.mp3"
            // let play_song = t.split(" ").join("")
            // rockstar.push(play_song)
            // console.log(rockstar);
            // Array.forEach(e => {
            //     let url = geturl(e)
            //     let t = "http://127.0.0.1:5501/rockstar/128-" + url + "%20128%20Kbps.mp3"
            //     let play_song = t.split(" ").join("")
            //     rockstar.push(play_song)
            //     console.log(rockstar);
            // });

            // let fir = e.querySelector(".info").firstElementChild.innerHTML
            // let f = fir.replaceAll(" ", "%20")
            // let l = e.querySelector(".info").lastElementChild.innerHTML
            document.querySelector(".song_name_playbar").innerHTML = e.querySelector(".info").firstElementChild.innerHTML + `<i class="fa-solid fa-chart-simple fa-bounce fa-beat-fade beats"></i>`
            playmusic(url,`${folder}`,true);



        })
    })
}





// song will play
let current_song = new Audio();
const playmusic = (track,folder,pause=false) => {

    let t = `http://127.0.0.1:5502/spotify%20project/${folder}/128-` + track + "%20128%20Kbps.mp3"
    play_song = t.split(" ").join("")
    console.log(play_song);

    current_song.src = play_song
    current_song.play()
    document.querySelector(".music_play").innerHTML = `<i class="fa-regular fa-circle-pause"></i>`



}
// Getting the correct song name from the array 
async function main() {
    songs = await getsongs("Rockstar");


    // working of the pause and play button
    play.addEventListener("click", () => {
        if (current_song.paused) {
            current_song.play();
            document.querySelector(".music_play").innerHTML = `<i class="fa-regular fa-circle-pause"></i>`
        }
        else {
            current_song.pause();
            document.querySelector(".music_play").innerHTML = `<i class="fa-regular fa-circle-play"></i>`
        }
    })
    next.addEventListener("click", () => {

    })

    //updating the time of the song and also the movement of the circle
    current_song.addEventListener("timeupdate", () => {
        document.querySelector(".song_time").innerHTML = `${convertSecondsToMinutes(current_song.currentTime)}/${convertSecondsToMinutes(current_song.duration)}`
        document.querySelector(".circle").style.left = (current_song.currentTime / current_song.duration) * 100 + "%";

    })

    //moving the seekbar from one place to another
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        current_song.currentTime = ((current_song.duration) * percent) / 100
    })

    //making the hamburger icon usable
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"

    })
    //close function of the menu bar
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })





    //adding function to the previous  button
    document.querySelector(".previous").addEventListener("click", () => {
        let index = rockstar.indexOf(current_song.src)
        let length = rockstar.length;
        if ((index - 1) >= 0) {
            current_song.src = rockstar[index - 1]
            current_song.play()
            let name = rockstar[index - 1].split("-")[1].replaceAll("%20", " ")
            document.querySelector(".song_name_playbar").innerHTML = `${name} ` + `<i class="fa-solid fa-chart-simple fa-bounce fa-beat-fade beats"></i>`
            document.querySelector(".music_play").innerHTML = `<i class="fa-regular fa-circle-pause"></i>`

        }

        if ((index) == 0) {
            let index = length-1

            current_song.src = rockstar[index]
            console.log(current_song.src);
            
            current_song.play()
            let name = rockstar[index].split("-")[1].replaceAll("%20", " ")
            document.querySelector(".song_name_playbar").innerHTML = `${name} ` + `<i class="fa-solid fa-chart-simple fa-bounce fa-beat-fade beats"></i>`
            document.querySelector(".music_play").innerHTML = `<i class="fa-regular fa-circle-pause"></i>`

        }


    })

    //adding function to the next button
    document.querySelector(".next").addEventListener("click", () => {
        let index = rockstar.indexOf(current_song.src)
        let length = rockstar.length;
        if ((index + 1) < length) {

            current_song.src = rockstar[index + 1]
            current_song.play()
            let name = rockstar[index + 1].split("-")[1].replaceAll("%20", " ")
            document.querySelector(".song_name_playbar").innerHTML = `${name} ` + `<i class="fa-solid fa-chart-simple fa-bounce fa-beat-fade beats"></i>`
            document.querySelector(".music_play").innerHTML = `<i class="fa-regular fa-circle-pause"></i>`
        }
        if ((index+1) == length) {
            let index = 0

            current_song.src = rockstar[index]
            console.log(current_song.src);
            
            current_song.play()
            let name = rockstar[index].split("-")[1].replaceAll("%20", " ")
            document.querySelector(".song_name_playbar").innerHTML = `${name} ` + `<i class="fa-solid fa-chart-simple fa-bounce fa-beat-fade beats"></i>`
            document.querySelector(".music_play").innerHTML = `<i class="fa-regular fa-circle-pause"></i>`

        }



    })

    //load songs of a given playlist
    
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async items=>{
            console.log(`${items.currentTarget.dataset.folder}`);
            songs = await getsongs(`${items.currentTarget.dataset.folder}`)
            document.querySelector(".left").style.left = "0"
  
            
        })
    }) 

}

main();