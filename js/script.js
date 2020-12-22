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
    this.searchMovie();
  },
  methods: {
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
      console.log(this[page]);
      this.searchMovie();
    },
    search: function() {
      this.page1 = 1;
      this.page2 = 2;
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

        function pageElement1() {
          elementThis.maxPage1 = responseOne.data.total_pages;
          elementThis.min1 = 2;
          elementThis.max1 = 11;
          elementThis.arrMaxPage1 = [];

          while(elementThis.min1 <= elementThis.max1) {

            if (elementThis.max1 <= elementThis.page1) {
              elementThis.min1 = elementThis.page1 - 5;
              elementThis.max1 += elementThis.min1;
            } else {
              elementThis.arrMaxPage1.push(elementThis.min1);
            }

            elementThis.min1++;
          }

          if(elementThis.max1 >= elementThis.maxPage1) {

            elementThis.max1 = elementThis.maxPage1;
            elementThis.min1 = elementThis.max1 - 9;
            elementThis.arrMaxPage1 = [];

            while(elementThis.min1 <= elementThis.max1) {
              elementThis.arrMaxPage1.push(elementThis.min1);
              elementThis.min1++
            }
          }
        }

        function pageElement2() {
          elementThis.maxPage2 = responseTwo.data.total_pages;
          elementThis.min2 = 2;
          elementThis.max2 = 11;
          elementThis.arrMaxPage2 = [];

          while(elementThis.min2 <= elementThis.max2) {

            if (elementThis.max2 <= elementThis.page2) {
              elementThis.min2 = elementThis.page2 - 5;
              elementThis.max2 += elementThis.min2;
            } else {
              elementThis.arrMaxPage2.push(elementThis.min2);
            }

            elementThis.min2++;
          }

          if(elementThis.max2 >= elementThis.maxPage2) {

            elementThis.max2 = elementThis.maxPage2;
            elementThis.min2 = elementThis.max2 - 9;
            elementThis.arrMaxPage2 = [];

            while(elementThis.min2 <= elementThis.max2) {
              elementThis.arrMaxPage2.push(elementThis.min2);
              elementThis.min2++
            }
          }
        }

        pageElement1();
        pageElement2();

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
              arrSeries[index].poster_path = link;
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
