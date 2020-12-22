var app = new Vue({
  el: "#app",
  data: {
    films: [],
    series: [],
    searchText: "",
    empty: "",
    title1: "",
    title2: "",
    page1: 1,
    maxPage1: 1,
    max1: 11,
    min1: 2,
    arrMaxPage1: [],
    page2: 1,
    maxPage2: 1,
    max2: 11,
    min2: 2,
    arrMaxPage2: []
  },
  mounted() {

    setTimeout(() => {
      this.$forceUpdate();
    }, 500);
    this.searchMovie();


  },
  methods: {
    prova: function(prova) {
      console.log(prova);
    },
    next: function(page, maxPage) {
      if( this[page] < maxPage) {
        this[page]++;
      }
      this.searchMovie();
    },
    back: function(page) {
      if(this[page] > 1) {
        this[page]--;
      }
      this.searchMovie();
    },
    page: function(page, index) {
      this[page] = index;
      this.searchMovie();
    },
    search: function() {
      this.page1 = 1;
      this.page2 = 1;
      this.searchMovie();
    },
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
            page: elementThis.page1,
          }
        });
        call2 = axios.get('https://api.themoviedb.org/3/movie/top_rated', {
          params: {
            api_key: "87999777404e3c905e01e7dfe9466bae",
            language: "it",
            page: elementThis.page2,
          }
        });
        isSearch = false;
      } else {
        call1 = axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: "87999777404e3c905e01e7dfe9466bae",
            language: "it",
            query: textSearch,
            page: elementThis.page1,
          }
        });
        call2 = axios.get('https://api.themoviedb.org/3/search/tv', {
          params: {
            api_key: "87999777404e3c905e01e7dfe9466bae",
            language: "it",
            query: textSearch,
            page: elementThis.page2,
          }
        });
        isSearch = true;
      }

      axios.all([call1, call2]).then(axios.spread((...responseOnes) => {
        const responseOne = responseOnes[0];
        const responseTwo = responseOnes[1];

        function pageElement(maxPage, response, min, max, arrMax, page) {
          elementThis[maxPage] = response.data.total_pages;
          elementThis[min] = 2;
          elementThis[max] = 11;
          elementThis[arrMax] = [];

          while(elementThis[min] <= elementThis[max]) {

            if (elementThis[max] <= elementThis[page]) {
              if(elementThis[maxPage] > 6) {
                elementThis[min] = elementThis[page] - 5;
              }
              elementThis[max] += elementThis[min];
            } else {
              elementThis[arrMax].push(elementThis[min]);
            }

            elementThis[min]++;
          }

          if(elementThis[max] >= elementThis[maxPage]) {

            elementThis[max] = elementThis[maxPage];
            if(elementThis[maxPage] > 10) {
              elementThis[min] = elementThis[max] - 9;
            }
            elementThis[arrMax] = [];

            while(elementThis[min] <= elementThis[max]) {
              elementThis[arrMax].push(elementThis[min]);
              elementThis[min]++
            }
          }
        }

        pageElement('maxPage1', responseOne, 'min1', 'max1', 'arrMaxPage1', 'page1');
        pageElement('maxPage2', responseTwo, 'min2', 'max2', 'arrMaxPage2', 'page2');

        one(responseOne);
        second(responseTwo);

        function one(responseOne) {

          const resultOne = responseOne.data.results;

          resultOne.forEach((element, index) => {
            arrFilms.push(resultOne[index]);

            if(resultOne[index].poster_path == null) {
              arrFilms[index].poster_path = "https://via.placeholder.com/342x517.png?text=Cover+Mancante";
            } else {
              var link = "https://image.tmdb.org/t/p/w342" + resultOne[index].poster_path;
              arrFilms[index].poster_path = link;
            }

            if (resultOne[index].overview == "") {
              arrFilms[index].overview = "Descrizione mancante";
            }

            arrFilms[index].vote_average = Math.round(arrFilms[index].vote_average / 2);

            arrFilms[index].cast = [];
            var linkCast = 'https://api.themoviedb.org/3/movie/' + arrFilms[index].id + '/credits?api_key=87999777404e3c905e01e7dfe9466bae&language=it';
            axios.get(linkCast).then((response) => {
              var nome = response.data.cast.forEach((element) => {
                if (arrFilms[index].cast.length < 5) {
                  arrFilms[index].cast.push({ name: element.name});
                }
              });
            });

            axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=87999777404e3c905e01e7dfe9466bae&language=it')
            .then((response) => {
              arrFilms[index].genre_ids.forEach((item, i) => {
                var id = item;
                var index2 = i;
                var list = response.data.genres;
                list.forEach((element, i) => {
                  if(element.id == id) {
                    id = element.name;
                  }
                });
                arrFilms[index].genre_ids[i] = id;
              });
            });

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
              var link = "https://image.tmdb.org/t/p/w342" + resultTwo[index].poster_path;
              arrSeries[index].poster_path = link;
            }

            if (resultTwo[index].overview == "") {
              arrSeries[index].overview = "Descrizione mancante";
            }

            arrSeries[index].vote_average = Math.round(arrSeries[index].vote_average / 2);

            arrSeries[index].cast = [];
            var linkCast = 'https://api.themoviedb.org/3/movie/' + arrSeries[index].id + '/credits?api_key=87999777404e3c905e01e7dfe9466bae&language=it';
            axios.get(linkCast).then((response) => {
              var nome = response.data.cast.forEach((element) => {
                if (arrSeries[index].cast.length < 5) {
                  arrSeries[index].cast.push({ name: element.name});
                }
              });
            });

            axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=87999777404e3c905e01e7dfe9466bae&language=it')
            .then((response) => {
              arrSeries[index].genre_ids.forEach((item, i) => {
                var id = item;
                var index2 = i;
                var list = response.data.genres;
                list.forEach((element, i) => {
                  if(element.id == id) {
                    id = element.name;
                  }
                });
                arrSeries[index].genre_ids[i] = id;
              });
            });

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
            elementThis.page2 = 1;
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

    }))
    },
  }
});
