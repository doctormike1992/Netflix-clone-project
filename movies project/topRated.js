const API_KEY = "api_key=f69939609ad17acf0a23c7dc04d7d0e3";
const BASE_URL = "https://api.themoviedb.org/3";
const TopRated_URL = BASE_URL + "/movie/top_rated?" + API_KEY;
const genre_URL = BASE_URL + "/genre/movie/list?" + API_KEY;

 const root2 = document.getElementById('root2')
 const left2 = document.querySelector(".left2");
const right2 = document.querySelector(".right2");
const progressSpan = document.querySelectorAll(".progress-span2");
 
let sliderTransition = 95;
let goRight = 0;

let genreMap = {};
let infinite;
let progress2 = 0;
progressBar2();

//FETCH RUNTIME AND BACKDROP IMAGE
async function run2(url) {
  const response = await fetch(url);
  const data = await response.json();
 
  return [data.runtime, data.backdrop_path];
}

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
    left2.style = "display: none";
  }

  left2.addEventListener("click", () => {
    if (sliderTransition === 95) {
      left2.style = "display: none";
    }
    sliderTransition -= 95;
    root2.style.transform = `translateX(-${sliderTransition}%)`;
    progressArrowLeft();
    progressBar2();
  });

  right2.addEventListener("click", () => {
    left2.style = "display: block";

    render(infinite);

    if (goRight === 0) {
      sliderTransition = 0;
      goRight += 1;
      sliderTransition += 95;
    } else {
      sliderTransition += 95;
    }
    root2.style.transform = `translateX(-${sliderTransition}%)`;
    progressArrowRight();
    progressBar2();
  });
}
navButtons();

//FALLBACK POSTER
function altIPoster2(poster) {
  if (!poster) {
    return "images/error.webp";
  } else {
    return `https://image.tmdb.org/t/p/w780${poster}`;
  }
}

//FALLBACK BACKDROP
function altBackdrop2(backdrop, poster) {
  if (!backdrop && !poster) {
    return "images/error.webp";
  } else if (!backdrop) {
    return `https://image.tmdb.org/t/p/w780${poster}`;
  } else {
    return `https://image.tmdb.org/t/p/original${backdrop}`;
  }
}

//RENDER GENRES
function checkIfGenre2(genre1, genre2, genre3, date) {
  if (!genre1 && !genre2 && !genre3) {
    return `<p>${date}</p>`;
  } else if (genre1 && genre2 && genre3) {
    return `<p>${genre1}</p> <span class='dot2'>•</span> <p>${genre2}</p> <span class='dot2'>•</span> 
    <p>${genre3}</p>`;
  } else if (genre1 && genre2 && !genre3) {
    return `<p>${genre1}</p> <span class='dot2'>•</span> <p>${genre2}</p>`
  } else if (genre1 && !genre2 && !genre3) {
    return `<p>${genre1}</p>`;
  }
  }

// RENDER MOVIES
function showMovies(data) {
  root2.innerHTML = "";
  render(data);
}
function render(data) {
  data.forEach( async (element) => {
    const { poster_path, release_date, genre_names, id } = element;
    const spesific = BASE_URL + `/movie/${id}?` + API_KEY;
    const [runtime, backdrop] = await run2(spesific);
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movieDiv2");

    movieDiv.innerHTML = `
        <img class='poster2' src=${altIPoster2(poster_path)}>
      <div class="slider-info2">
      <div class='movieDiv-img2'>
       <img  src=${altBackdrop2(backdrop, poster_path)}>
      </div>
     
      <div class='movieDiv-info2'>
        <div class='info-buttons2'>
          <div class='buttonsRow2'>
           <button class='play-btn2'><i class="fa-solid fa-play"></i></button>
          <div class='cross-btn2'>
         <button ><i class="fa-solid fa-plus"></i></button>
         <span class='addList2'>Add to My List</span>
        </div>
        <div>





        <div class='likeDiv2'>
        <button class='like-btn2'><i class="fa-solid fa-thumbs-up"></i></button>
        <div class='hiddenLikeDiv2'>
        <div class='dislikeDiv2'>
        <button><i class="fa-solid fa-thumbs-down"></i></button>
        <span class='dislike-btn2'>Not for me</span>
        </div>
        <div class='hiddenLikeDiv22'>
        <button><i class="fa-solid fa-thumbs-up"></i></button>
        <span class='hiddenLike-btn2'>Like this</span>
        </div>
        <div class="loveDiv2">
        <button><i class="fa-solid fa-heart"></i></button>
        <span class='love-btn2'>Love this!</span>
        </div>    
         </div>
        </div>   
       </div>  
        </div>



      <div class='seeMoreDiv2'>
      <button><i class="fa-solid fa-chevron-down"></i></button>
      <span class='seeMoreSpan2'>See More</span>
      </div>
      </div>
        <div class=runtimeDiv>
           <p class='age-info2'>13+</p>
           <p class='min2'>${runtime}min</p>
           <p class='hd2'>HD</p>
       </div>
       <div class='genreDiv2'>
       ${checkIfGenre2(
         genre_names[0],
         genre_names[1],
         genre_names[2],
         release_date
       )}
       </div>
      </div>
    </div>
  `;
    root2.appendChild(movieDiv);
  });
}
// FUNCTION CALLS ON FIRST RENDER
export function init2() {
  getGenre();
  getMovies(TopRated_URL);
  
}

//PROGRESS ON SLIDER
function progressBar2() {
  progressSpan.forEach((span, index) => {
    if (progress2 === index) {
      const prev = document.querySelector('.active2')
      if(prev){prev.classList.remove('active2')}
      span.classList.add("active2");
    }
  });
}
function progressArrowLeft() {
  if (progress2 === 0) {
    progress2 = 3;
    return
  }
  progress2 -= 1;
}
function progressArrowRight() {
  if (progress2 === 3) {
    progress2 = 0;
    return
  }
  progress2 += 1;
}

//SWIPE FUNCTION
if (window.innerWidth < 800) {
  left2.style = "display: none";
  right2.style = "display: none";
  root2.style.transition = "transform 0.5s ease-in-out";

  let touchStartX = 0;
  let touchEndX = 0;

  root2.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  });

  root2.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
      sliderTransition -= 95;
      root2.style.transform = `translateX(-${sliderTransition}%)`;
      progressArrowLeft();
      progressBar2();
    } else if (swipeDistance < -50) {
      if (goRight === 0) {
        sliderTransition = 0;
        goRight += 1;
        sliderTransition += 95;
      } else {
        sliderTransition += 95;
      }
      render(infinite);
      root2.style.transform = `translateX(-${sliderTransition}%)`;
      progressArrowRight();
      progressBar2();
    }
  }
} else {
  root2.style.transition = "...";
}




