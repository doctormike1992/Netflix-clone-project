import { init2 } from "./topRated.js";
import { init3 } from "./comedies.js";
import { init4 } from "./shows.js";

const API_KEY = "api_key=f69939609ad17acf0a23c7dc04d7d0e3";
const BASE_URL = "https://api.themoviedb.org/3";
const Popular_URL = BASE_URL + "/movie/popular?" + API_KEY;
const search_URL = BASE_URL + "/search/movie?" + API_KEY;
const genre_URL = BASE_URL + "/genre/movie/list?" + API_KEY;

const root = document.getElementById("root");
const search = document.querySelector(".search");
const video = document.querySelector(".video");
const sound = document.querySelector(".sound-btn");
const hiddenInfo = document.querySelector(".movie-info");
const movieTitle = document.querySelector(".movie-title");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const hero = document.getElementById("hero");
const sliderTitle = document.querySelector(".slider-title");
const headerBtn = document.querySelector(".headerBtn");
const browse = document.querySelector(".browse");
const carusel = document.getElementById("carusel");
const carusel2 = document.getElementById("carusel2");
const carusel3 = document.getElementById("carusel3");
const carusel4 = document.getElementById("carusel4");
const progressSpan = document.querySelectorAll(".progress-span");

let sliderTransition = 95;
let goRight = 0;
let progress = 0;

let genreMap = {};
let infinite;
init();
init2();
init3();
init4();
progressBar();

//FETCH DATA
function getGenre() {
  fetch(genre_URL)
    .then((res) => res.json())
    .then((data) =>
      data.genres.forEach((genre) => (genreMap[genre.id] = genre.name))
    );
}

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const moviesWithGenre = data.results.map((movie) => ({
        ...movie,
        genre_names: movie.genre_ids.map((id) => genreMap[id]),
      }));
      showMovies(moviesWithGenre);

      infinite = moviesWithGenre;
    });
}
//FETCH RUNTIME AND BACKDROP IMAGE
async function run(url) {
  const response = await fetch(url);
  const data = await response.json();
  
  return [data.runtime, data.backdrop_path];
}
//ARROW BUTTONS
function navButtons() {
  if (sliderTransition === 95) {
    left.style = "display: none";
  }

  left.addEventListener("click", () => {
    if (sliderTransition === 95) {
      left.style = "display: none";
    }
    sliderTransition -= 95;
    root.style.transform = `translateX(-${sliderTransition}%)`;
    progressArrowLeft();
    progressBar();
  });

  right.addEventListener("click", () => {
    left.style = "display: block";
    render(infinite);

    if (goRight === 0) {
      sliderTransition = 0;
      goRight += 1;
      sliderTransition += 95;
    } else {
      sliderTransition += 95;
    }
    root.style.transform = `translateX(-${sliderTransition}%)`;
    progressArrowRight();
    progressBar();
  });
}
navButtons();
//FALLBACK POSTER
function altIPoster(poster) {
  if (!poster) {
    return "images/error.webp";
  } else {
    return `https://image.tmdb.org/t/p/w780${poster}`;
  }
}
//FALLBACK BACKDROP
function altBackdrop(backdrop, poster) {
  if (!backdrop && !poster) {
    return "images/error.webp";
  } else if (!backdrop) {
    return `https://image.tmdb.org/t/p/w780${poster}`;
  } else {
    return `https://image.tmdb.org/t/p/original${backdrop}`;
  }
}
//RENDER GENRES
function checkIfGenre(genre1, genre2, genre3, date) {
  if (!genre1 && !genre2 && !genre3) {
    return `<p>${date}</p>`;
  } else if (genre1 && genre2 && genre3) {
    return `<p>${genre1}</p> <span class='dot'>•</span> <p>${genre2}</p> <span class='dot'>•</span> 
    <p>${genre3}</p>`;
  } else if (genre1 && genre2 && !genre3) {
    return `<p>${genre1}</p> <span class='dot'>•</span> <p>${genre2}</p>`
  } else if (genre1 && !genre2 && !genre3) {
    return `<p>${genre1}</p>`;
  }
  }

// RENDER MOVIES
function showMovies(data) {
  root.innerHTML = "";
  render(data);
}
function render(data) {
  data.forEach(async (element) => {
    const { poster_path, release_date, genre_names, id } = element;
    const spesific = BASE_URL + `/movie/${id}?` + API_KEY;
    const [runtime, backdrop] = await run(spesific);
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movieDiv");

    movieDiv.innerHTML = `
      <img class='poster' src=${altIPoster(poster_path)}>
      <div class="slider-info">
      <div class='movieDiv-img'>
       <img  src=${altBackdrop(backdrop, poster_path)}>
      </div>
     
      <div class='movieDiv-info'>
        <div class='info-buttons'>
          <div class='buttonsRow'>
           <button class='play-btn'><i class="fa-solid fa-play"></i></button>
          <div class='cross-btn'>
         <button ><i class="fa-solid fa-plus"></i></button>
         <span class='addList'>Add to My List</span>
        </div>
        <div>





        <div class='likeDiv'>
        <button class='like-btn'><i class="fa-solid fa-thumbs-up"></i></button>
        <div class='hiddenLikeDiv'>
        <div class='dislikeDiv'>
        <button><i class="fa-solid fa-thumbs-down"></i></button>
        <span class='dislike-btn'>Not for me</span>
        </div>
        <div class='hiddenLikeDivOne'>
        <button><i class="fa-solid fa-thumbs-up"></i></button>
        <span class='hiddenLike-btn'>Like this</span>
        </div>
        <div class="loveDiv">
        <button><i class="fa-solid fa-heart"></i></button>
        <span class='love-btn'>Love this!</span>
        </div>    
         </div>
        </div>   
       </div>  
        </div>



      <div class='seeMoreDiv'>
      <button><i class="fa-solid fa-chevron-down"></i></button>
      <span class='seeMoreSpan'>See More</span>
      </div>
      </div>
        <div class=runtimeDiv>
           <p class='age-info'>13+</p>
           <p class='min'>${runtime}min</p>
           <p class='hd'>HD</p>
       </div>
       <div class='genreDiv'>
       ${checkIfGenre(
         genre_names[0],
         genre_names[1],
         genre_names[2],
         release_date
       )}
       </div>
      </div>
    </div>
  `;
    root.appendChild(movieDiv);
  });
}

// FUNCTION CALLS ON FIRST RENDER
function init() {
  getGenre();
  getMovies(Popular_URL);
  titleAnimation();
}

//SEARCH BAR
const clearInput = document.querySelector(".clearInput");
const glass = document.querySelector(".glass");
const inputContainer = document.getElementById("hidden-input");

clearInput.addEventListener("click", () => {
  search.value = "";
  clearInput.style = "display: none";
  hero.style = "...";
  right.style = "...";
  root.style = "...";
  sliderTitle.style = "...";
  carusel2.style = "...";
  carusel3.style = "...";
  carusel4.style = "...";
  carusel.style = "...";

  init();
  init2();
  init3();
  init4();
});

search.addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  if (!searchTerm) {
    clearInput.style = "display: none";
    hero.style = "...";
    right.style = "...";
    root.style = "...";
    sliderTitle.style = "...";
    carusel2.style = "...";
    carusel3.style = "...";
    carusel4.style = "...";
    carusel.style = "...";
  }
  if (searchTerm) {
    clearInput.style = "display: block";
    getMovies(search_URL + "&query=" + searchTerm);
    hero.style = "display: none;";
    root.style = "flex-wrap: wrap; width: 100%; margin-top: 10%";
    left.style = "display: none";
    right.style = "display: none";
    sliderTitle.style = "display: none";
    carusel.style = "margin-top: 0";
    carusel2.style = "display: none";
    carusel3.style = "display: none";
    carusel4.style = "display: none";
  }
});

glass.addEventListener("click", () => {
  search.classList.toggle("expanded");
});

document.body.addEventListener("click", (e) => {
  if (!inputContainer.contains(e.target)) {
    search.classList.remove("expanded");
    clearInput.style = "display: none";
    search.value = "";
  }
});
//HERO-INFO ANIMATION
function titleAnimation() {
  setTimeout(() => {
    hiddenInfo.classList.add("movie-info-hidden");
    if (window.innerWidth < 890) { 
      movieTitle.style = "transform: translateY(10%) translateX(-3%)";
    } else {
      movieTitle.style =
      "transform: translateY(20rem) scale(0.8) translateX(-5rem)";
    }
    
  }, 4000);
}

//SOUND MUTER AND VIDEO REPLAY
video.addEventListener("ended", () => {
  sound.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
  sound.style = "padding: clamp(0.5rem, 3vw, 1.2rem)";
  video.src = "images/plankton-poster.webp";
  hiddenInfo.classList.remove("movie-info-hidden");
  movieTitle.style = "...";
});
sound.addEventListener("click", () => {
  if (sound.innerHTML === '<i class="fa-solid fa-rotate-right"></i>') {
    sound.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    sound.style = "...";
    video.src = "images/Plankton The Movie   Official Trailer   Netflix.mp4";
    video.play();
    titleAnimation();
  }
  if (!video.muted) {
    video.muted = true;
    sound.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else {
    video.muted = false;
    sound.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
});

//HEADER ON SCROLL
function headerScroll() {
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}
headerScroll();
// RESPONSIVE NAVBAR
browse.addEventListener("click", () => {
  headerBtn.classList.toggle("hidden-headerBtn");
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 890) {
    headerBtn.classList.remove("hidden-headerBtn");
  }
});
//PROGRESS ON SLIDER
function progressBar() {
  progressSpan.forEach((span, index) => {
    if (progress === index) {
      const prev = document.querySelector(".active");
      if (prev) {
        prev.classList.remove("active");
      }
      span.classList.add("active");
    }
  });
}
function progressArrowLeft() {
  if (progress === 0) {
    progress = 3;
    return;
  }
  progress -= 1;
}
function progressArrowRight() {
  if (progress === 3) {
    progress = 0;
    return;
  }
  progress += 1;
}
