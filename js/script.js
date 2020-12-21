var app = new Vue({
  el: "#app",
  data: {
    films: [],
    series: [],
    searchText: "",
    empty: "",
    title1: "",
    title2: "",
  },
  mounted() {
    this.searchMovie();
  },
  methods: {
    searchMovie: function() {

      const textSearch = this.searchText.split(" ").join("+");
      const elementThis = this;

      elementThis.films = [];
      elementThis.series = [];

      const arrFilms = elementThis.films;
      const arrSeries = elementThis.series;
      var call1 = "";
      var call2 = "";
      var isSearch = false;

      if (textSearch == "") {
        call1 = axios.get('https://api.themoviedb.org/3/movie/popular', {
          params: {
            api_key: "87999777404e3c905e01e7dfe9466bae",
            language: "it",
            page: 1,
          }
        });
        call2 = axios.get('https://api.themoviedb.org/3/movie/top_rated', {
          params: {
            api_key: "87999777404e3c905e01e7dfe9466bae",
            language: "it",
            page: 1,
          }
        });
        isSearch = false;
      } else {
        call1 = axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: "87999777404e3c905e01e7dfe9466bae",
            language: "it",
            query: textSearch,
            page: 1,
          }
        });
        call2 = axios.get('https://api.themoviedb.org/3/search/tv', {
          params: {
            api_key: "87999777404e3c905e01e7dfe9466bae",
            language: "it",
            query: textSearch,
            page: 1,
          }
        });
        isSearch = true;
      }

      axios.all([call1, call2]).then(axios.spread((...responseOnes) => {
        const responseOne = responseOnes[0];
        const responseTwo = responseOnes[1];

        one(responseOne);
        second(responseTwo);

        function one(responseOne) {

          const resultOne = responseOne.data.results;

          resultOne.forEach((element, index) => {
            arrFilms.push(resultOne[index]);

            if(resultOne[index].poster_path == null) {
              arrFilms[index].poster_path = "https://via.placeholder.com/342x517.png?text=Cover+Mancante";
            } else {
              var link = "https://image.tmdb.org/t/p/h632/" + resultOne[index].poster_path;
              arrFilms[index].poster_path = link;
            }

            if (resultOne[index].overview == "") {
              arrFilms[index].overview = "Descrizione mancante";
            }

            arrFilms[index].vote_average = Math.round(arrFilms[index].vote_average / 2);

            setTimeout( () => {
              for (let i = 0; i < arrFilms[index].vote_average; i++) {
                const card = elementThis.$el.getElementsByClassName("card");
                const star = card[index].getElementsByClassName("fa-star");
                star[i].classList.add("active");
              }
            }, 250);

            if (arrFilms[index].original_language == "it") {
              arrFilms[index].original_language = "🇮🇹";
            } else if (arrFilms[index].original_language == "en") {
              arrFilms[index].original_language = "🇬🇧";
            } else if (arrFilms[index].original_language == "") {
              arrFilms[index].original_language = "Lingua mancante";
            }


          })
        };

        function second(responseTwo) {

          const resultTwo = responseTwo.data.results;

          resultTwo.forEach((element, index) => {
            arrSeries.push(resultTwo[index]);

            if(resultTwo[index].poster_path == null) {
              arrSeries[index].poster_path = "https://via.placeholder.com/342x517.png?text=Cover+Mancante";
            } else {
              var link = "https://image.tmdb.org/t/p/h632" + resultTwo[index].poster_path;
              arrSeries[index].poster_path= link;
            }

            if (resultTwo[index].overview == "") {
              arrSeries[index].overview = "Descrizione mancante";
            }

            arrSeries[index].vote_average = Math.round(arrSeries[index].vote_average / 2);

            setTimeout( () => {
              for (let i = 0; i < arrSeries[index].vote_average; i++) {
                const index2 = index + arrFilms.length;
                const card = elementThis.$el.getElementsByClassName("card");
                const star = card[index2].getElementsByClassName("fa-star");
                star[i].classList.add("active");
              }
            }, 250);

            if (arrSeries[index].original_language == "it") {
              arrSeries[index].original_language = "🇮🇹";
            } else if (arrSeries[index].original_language == "en") {
              arrSeries[index].original_language = "🇬🇧";
            } else if (arrSeries[index].original_language == "") {
              arrSeries[index].original_language = "Lingua mancante";
            }


          })
        };

        if(isSearch) {
          if(arrFilms == 0) {
            elementThis.title1 = "";
          } else {
            elementThis.title1 = "Film";
          }

          if(arrSeries == 0) {
            elementThis.title2 = "";
          } else {
            elementThis.title2 = "Serie tv";
          }
        } else {
          elementThis.title1 = "Film popolari";
          elementThis.title2 = "Film più votati";
        }

        if(arrFilms.length == 0 && arrSeries.length == 0) {
          elementThis.empty = "Non è stato trovato nessun film o serie tv con la chiave \"" + textSearch + "\"";
        } else {
          elementThis.empty = "";
        }

        this.searchText = "";
    }))
    },
  }
});
