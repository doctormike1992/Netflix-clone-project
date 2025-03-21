const API_KEY = "api_key=f69939609ad17acf0a23c7dc04d7d0e3";
const BASE_URL = "https://api.themoviedb.org/3";
const genre_URL = BASE_URL + "/genre/movie/list?" + API_KEY;
const Comedy_URL =  BASE_URL + '/discover/movie?' + API_KEY + '&with_genres=35';

export const root3 = document.getElementById("root3");
export const left3 = document.querySelector(".left3");
export const right3 = document.querySelector(".right3");
const progressSpan = document.querySelectorAll(".progress-span3");

let sliderTransition = 95;
let goRight = 0;
let progress3 = 0;

let genreMap = {};
let infinite;
progressBar3();

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
//ARROW BUTTONS
function navButtons() {
  if (sliderTransition === 95) {
    left3.style = "display: none";
  }

  left3.addEventListener("click", () => {
    if (sliderTransition === 95) {
      left3.style = "display: none";
    }
    sliderTransition -= 95;
    root3.style.transform = `translateX(-${sliderTransition}%)`;
    progressArrowLeft();
    progressBar3()
  });

  right3.addEventListener("click", () => {
    left3.style = "display: block";

    render(infinite);

    if (goRight === 0) {
      sliderTransition = 0;
      goRight += 1;
      sliderTransition += 95;
    } else {
      sliderTransition += 95;
    }
    root3.style.transform = `translateX(-${sliderTransition}%)`;
    progressArrowRight();
    progressBar3();
  });
}
navButtons();

//FETCH RUNTIME AND BACKDROP IMAGE
async function run3(url) {
  const response = await fetch(url);
  const data = await response.json();
  
  return [data.runtime, data.backdrop_path, data.genres];
}
//FALLBACK POSTER
function altIPoster3(poster) {
  if (!poster) {
    return "images/error.webp";
  } else {
    return `https://image.tmdb.org/t/p/w780${poster}`;
  }
}
//FALLBACK BACKDROP
function altBackdrop3(backdrop, poster) {
  if (!backdrop && !poster) {
    return "images/error.webp";
  } else if (!backdrop) {
    return `https://image.tmdb.org/t/p/w780${poster}`;
  } else {
    return `https://image.tmdb.org/t/p/original${backdrop}`;
  }
}
//RENDER GENRES
function checkIfGenre3(genre1, genre2, genre3, date) {
  if (!genre1 && !genre2 && !genre3) {
    return `<p>${date}</p>`;
  } else if (genre1 && genre2 && genre3) {
    return `<p>${genre1}</p> <span class='dot3'>•</span> <p>${genre2}</p> <span class='dot3'>•</span> 
    <p>${genre3}</p>`;
  } else if (genre1 && genre2 && !genre3) {
    return `<p>${genre1}</p> <span class='dot3'>•</span> <p>${genre2}</p>`
  } else if (genre1 && !genre2 && !genre3) {
    return `<p>${genre1}</p>`;
  }
  }

// RENDER MOVIES
function showMovies(data) {
  root3.innerHTML = "";
  render(data);
}
function render(data) {
  data.forEach( async (element) => {
    const { poster_path, id, release_date } = element;
    const spesific = BASE_URL + `/movie/${id}?` + API_KEY;
    const [runtime, backdrop, genres] = await run3(spesific);

       const genre1 = genres?.[0]?.name || "";
       const genre2 = genres?.[1]?.name || "";
       const genre3 = genres?.[2]?.name || "";
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movieDiv3");

    movieDiv.innerHTML = `
    <img class='poster3' src=${altIPoster3(poster_path)}>
      <div class="slider-info3">
      <div class='movieDiv-img3'>
       <img  src=${altBackdrop3(backdrop, poster_path)}>
      </div>
     
      <div class='movieDiv-info3'>
        <div class='info-buttons3'>
          <div class='buttonsRow3'>
           <button class='play-btn3'><i class="fa-solid fa-play"></i></button>
          <div class='cross-btn3'>
         <button ><i class="fa-solid fa-plus"></i></button>
         <span class='addList3'>Add to My List</span>
        </div>
        <div>





        <div class='likeDiv3'>
        <button class='like-btn3'><i class="fa-solid fa-thumbs-up"></i></button>
        <div class='hiddenLikeDiv3'>
        <div class='dislikeDiv3'>
        <button><i class="fa-solid fa-thumbs-down"></i></button>
        <span class='dislike-btn3'>Not for me</span>
        </div>
        <div class='hiddenLikeDiv23'>
        <button><i class="fa-solid fa-thumbs-up"></i></button>
        <span class='hiddenLike-btn3'>Like this</span>
        </div>
        <div class="loveDiv3">
        <button><i class="fa-solid fa-heart"></i></button>
        <span class='love-btn3'>Love this!</span>
        </div>    
         </div>
        </div>   
       </div>  
        </div>



      <div class='seeMoreDiv3'>
      <button><i class="fa-solid fa-chevron-down"></i></button>
      <span class='seeMoreSpan3'>See More</span>
      </div>
      </div>
        <div class=runtimeDiv>
           <p class='age-info3'>13+</p>
           <p class='min3'>${runtime}min</p>
           <p class='hd3'>HD</p>
       </div>
       <div class='genreDiv'>
       ${checkIfGenre3(
         genre1,
         genre2,
         genre3,
         release_date
       )}
       </div>
      </div>
    </div>
  `;
    root3.appendChild(movieDiv);
  });
}
// FUNCTION CALLS ON FIRST RENDER
export function init3() {
  getGenre();
  getMovies(Comedy_URL);
}

//PROGRESS ON SLIDER
function progressBar3() {
  progressSpan.forEach((span, index) => {
    if (progress3 === index) {
      const prev = document.querySelector('.active3')
      if(prev){prev.classList.remove('active3')}
      span.classList.add("active3");
    }
  });
}
function progressArrowLeft() {
  if (progress3 === 0) {
    progress3 = 3;
    return
  }
  progress3 -= 1;
}
function progressArrowRight() {
  if (progress3 === 3) {
    progress3 = 0;
    return
  }
  progress3 += 1;
}