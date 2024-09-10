const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const likeButton = document.getElementById("like");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

function playSong() {
    isPlaying = true;
    play.querySelector("i.bi").classList.remove("bi-play-circle-fill");
    play.querySelector("i.bi").classList.add("bi-pause-circle-fill");
    song.play();
}

function pauseSong() {
    isPlaying = false;
    play.querySelector("i.bi").classList.add("bi-play-circle-fill");
    play.querySelector("i.bi").classList.remove("bi-pause-circle-fill");
    song.pause();
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseSong();
    } else {
        playSong();
    }
}

function initializeSong() {
    axios.get('http://localhost:1212/song')
        .then(function (resposta) {
            songName.innerText = resposta.data.songName
            bandName.innerText = resposta.data.artist
            song.src = resposta.data.file
            cover.src = resposta.data.cover
        })
}

function nextSong() {
    axios.get('http://localhost:1212/next-song')
        .then(function (resposta) {
            songName.innerText = resposta.data.songName
            bandName.innerText = resposta.data.artist
            song.src = resposta.data.file
            cover.src = resposta.data.cover
            // initializeSong();
            likeButtonRender();
            playSong();
        });
}

function previousSong() {
    axios.get('http://localhost:1212/previous-song')
        .then(function (resposta) {
            songName.innerText = resposta.data.songName
            bandName.innerText = resposta.data.artist
            song.src = resposta.data.file
            cover.src = resposta.data.cover
            // initializeSong();
            likeButtonRender();
            playSong();
        })
}

function updateProgressBar(){
    const barWidth = (song.currentTime/song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(){
    // const size = songs.length;
    // let currentIndex = size - 1;
    // while(currentIndex > 0){
    //     let randomIndex = Math.floor(Math.random() * size);
    //     let aux = preShuffleArray[currentIndex];
    //     preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
    //     preShuffleArray[randomIndex] = aux;
    //     currentIndex -= 1;
    // }
}

function shuffleBottomClicked(){
    if (isShuffled === false){
        isShuffled = true
        shuffleArray()
        shuffleButton.classList.add('button-active')
    } else {
        isShuffled = false
        shuffleButton.classList.remove('button-active')
    }
}

function repeatButtonClicked (){
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');
    } else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

function nextOrRepeat () {
    if (repeatOn === false) {
        nextSong()
    } else {
        playSong()
    }
}

function toHHMMSS (originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let minutes = Math.floor((originalNumber - hours * 3600) / 60);
    let seconds = Math.floor(originalNumber - hours * 3600 - minutes * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonRender(song) {
    if (song.liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.querySelector('.bi').classList.add('button-active-like');
    } else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.querySelector('.bi').classList.remove('button-active-like');
    }
}

function likeButtonClicked (song) {
    if (song.liked === false) {
        song.liked = true;
    } else {
        song.liked = false;
    }
    likeButtonRender();
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgressBar);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener("click", shuffleBottomClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);
