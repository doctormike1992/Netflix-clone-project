const API_KEY = "api_key=f69939609ad17acf0a23c7dc04d7d0e3";
const BASE_URL = "https://api.themoviedb.org/3";
const TvShows_URL = BASE_URL + "/tv/popular?" + API_KEY;
const genre_URL = BASE_URL + "/genre/tv/list?" + API_KEY;

const root4 = document.getElementById("root4");
const left4 = document.querySelector(".left4");
const right4 = document.querySelector(".right4");
const progressSpan = document.querySelectorAll(".progress-span4");

let sliderTransition = 95;
let goRight = 0;
let progress4 = 0;

let genreMap = {};
let infinite;
progressBar4();

//FETCH DATA
async function getGenre() {
 await fetch(genre_URL)
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
//ARROW BUTTONS
function navButtons() {
  if (sliderTransition === 95) {
    left4.style = "display: none";
  }

  left4.addEventListener("click", () => {
    if (sliderTransition === 95) {
      left4.style = "display: none";
    }
    sliderTransition -= 95;
    root4.style.transform = `translateX(-${sliderTransition}%)`;
    progressArrowLeft();
    progressBar4();
  });

  right4.addEventListener("click", () => {
    left4.style = "display: block";

    render(infinite);

    if (goRight === 0) {
      sliderTransition = 0;
      goRight += 1;
      sliderTransition += 95;
    } else {
      sliderTransition += 95;
    }
    root4.style.transform = `translateX(-${sliderTransition}%)`;
    progressArrowRight();
    progressBar4();
  });
}
navButtons();

//FETCH RUNTIME AND BACKDROP IMAGE
async function run4(url) {
  const response = await fetch(url);
  const data = await response.json();
  
  return [data.number_of_seasons, data.backdrop_path];
}

//FALLBACK POSTER
function altIPoster4(poster) {
  if (!poster) {
    return "images/error.webp";
  } else {
    return `https://image.tmdb.org/t/p/w780${poster}`;
  }
}
//FALLBACK BACKDROP
function altBackdrop4(backdrop, poster) {
  if (!backdrop && !poster) {
    return "images/error.webp";
  } else if (!backdrop) {
    return `https://image.tmdb.org/t/p/w780${poster}`;
  } else {
    return `https://image.tmdb.org/t/p/original${backdrop}`;
  }
}
//RENDER GENRES
function checkIfGenre4(genre1, genre2, genre3, date) {
  if (genre1 === undefined && genre2 === undefined && genre3 === undefined) {
    return `<p>${date}</p>`;
  } else if (genre1 && genre2 && genre3) {
    return `<p>${genre1}</p> <span class='dot4'>•</span> <p>${genre2}</p> <span class='dot4'>•</span> 
    <p>${genre3}</p>`;
  } else if (genre1 && genre2 && !genre3) {
    return `<p>${genre1}</p> <span class='dot4'>•</span> <p>${genre2}</p>`;
  } else if (genre1 && !genre2 && !genre3) {
    return `<p>${genre1}</p>`;
  }
  }

// RENDER MOVIES
function showMovies(data) {
  root4.innerHTML = "";
  render(data);
}
//CHECK IF MORE THAN 1 SEASON
function moreThanOneSeasons(seasons) {
  if (seasons > 1) {
    return 'seasons'
  } else {
    return 'season'
  }
}
function render(data) {
  data.forEach( async (element) => {
    const { poster_path, id, release_date, genre_names } = element;
    const spesific = BASE_URL + `/tv/${id}?` + API_KEY;
    const [seasons, backdrop] = await run4(spesific);
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movieDiv4");

    movieDiv.innerHTML = `
     <img class='poster4' src=${altIPoster4(poster_path)}>
      <div class="slider-info4">
      <div class='movieDiv-img4'>
       <img  src=${altBackdrop4(backdrop, poster_path)}>
      </div>
     
      <div class='movieDiv-info4'>
        <div class='info-buttons4'>
          <div class='buttonsRow4'>
           <button class='play-btn4'><i class="fa-solid fa-play"></i></button>
          <div class='cross-btn4'>
         <button ><i class="fa-solid fa-plus"></i></button>
         <span class='addList4'>Add to My List</span>
        </div>
        <div>





        <div class='likeDiv4'>
        <button class='like-btn4'><i class="fa-solid fa-thumbs-up"></i></button>
        <div class='hiddenLikeDiv4'>
        <div class='dislikeDiv4'>
        <button><i class="fa-solid fa-thumbs-down"></i></button>
        <span class='dislike-btn4'>Not for me</span>
        </div>
        <div class='hiddenLikeDiv24'>
        <button><i class="fa-solid fa-thumbs-up"></i></button>
        <span class='hiddenLike-btn4'>Like this</span>
        </div>
        <div class="loveDiv4">
        <button><i class="fa-solid fa-heart"></i></button>
        <span class='love-btn4'>Love this!</span>
        </div>    
         </div>
        </div>   
       </div>  
        </div>



      <div class='seeMoreDiv4'>
      <button><i class="fa-solid fa-chevron-down"></i></button>
      <span class='seeMoreSpan4'>See More</span>
      </div>
      </div>
        <div class=runtimeDiv>
           <p class='age-info4'>13+</p>
           <p class='min4'>${seasons} ${moreThanOneSeasons(seasons)}</p>
           <p class='hd4'>HD</p>
       </div>
       <div class='genreDiv4'>
       ${checkIfGenre4(
         genre_names[0],
         genre_names[1],
         genre_names[2],
         release_date
       )}
       </div>
      </div>
    </div>
  `;
    root4.appendChild(movieDiv);
  });
}
// FUNCTION CALLS ON FIRST RENDER
export function init4() {
  getGenre();
  getMovies(TvShows_URL);
}

//PROGRESS ON SLIDER
function progressBar4() {
  progressSpan.forEach((span, index) => {
    if (progress4 === index) {
      const prev = document.querySelector('.active4')
      if(prev){prev.classList.remove('active4')}
      span.classList.add("active4");
    }
  });
}
function progressArrowLeft() {
  if (progress4 === 0) {
    progress4 = 3;
    return
  }
  progress4 -= 1;
}
function progressArrowRight() {
  if (progress4 === 3) {
    progress4 = 0;
    return
  }
  progress4 += 1;
}

//SWIPE FUNCTIONALITY
if (window.innerWidth < 800) {
  left4.style = "display: none";
  right4.style = "display: none";

  let touchStartX = 0;
  let touchEndX = 0;

  root4.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  });

  root4.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
      sliderTransition -= 95;
      root4.style.transform = `translateX(-${sliderTransition}%)`;
      progressArrowLeft();
      progressBar4();
    } else if (swipeDistance < -50) {
      if (goRight === 0) {
        sliderTransition = 0;
        goRight += 1;
        sliderTransition += 95;
      } else {
        sliderTransition += 95;
      }
      render(infinite);
      root4.style.transform = `translateX(-${sliderTransition}%)`;
      progressArrowRight();
      progressBar4();
    }
  }
}