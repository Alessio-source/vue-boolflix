var app = new Vue({
  el: "#app",
  data: {
    films: [],
    series: [],
    searchText: "",
    empty: ""
  },
  methods: {
    searchMovie: function() {
      var text = this.searchText.split(" ").join("+");
      var questo = this;
      questo.films = [];
      questo.series = [];
      var call1 = axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: "87999777404e3c905e01e7dfe9466bae",
          language: "it",
          query: questo.searchText,
          page: 1,
        }
      })
      var call2 = axios.get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key: "87999777404e3c905e01e7dfe9466bae",
          language: "it",
          query: questo.searchText,
          page: 1,
        }
      })

      axios.all([call1, call2]).then(axios.spread((...responseOnes) => {
        const responseOne = responseOnes[0];
        const responseTwo = responseOnes[1];

        one(responseOne);
        second(responseTwo);

        function one(responseOne) {
          responseOne.data.results.forEach((element, index) => {
            questo.films.push(responseOne.data.results[index]);

            if(responseOne.data.results[index].backdrop_path == null) {
              questo.films[index].backdrop_path = "https://via.placeholder.com/220x330.png?text=Cover+Mancante";
            } else {
              var link = "https://image.tmdb.org/t/p/w220_and_h330_face/" + responseOne.data.results[index].backdrop_path;
              questo.films[index].backdrop_path = link;
            }

            if (responseOne.data.results[index].overview == "") {
              questo.films[index].overview = "Descrizione mancante";
            }

            questo.films[index].vote_average = Math.round(questo.films[index].vote_average / 2);

            setTimeout( () => {
              for (let i = 0; i < questo.films[index].vote_average; i++) {
                var card = questo.$el.getElementsByClassName("card");
                var star = card[index].getElementsByClassName("fa-star");
                star[i].classList.add("active");
              }
            }, 250);

            if (questo.films[index].original_language == "it") {
              questo.films[index].original_language = "🇮🇹";
            } else if (questo.films[index].original_language == "en") {
              questo.films[index].original_language = "🇬🇧";
            } else if (questo.films[index].original_language == "") {
              questo.films[index].original_language = "Lingua mancante";
            }


          })
        };

        function second(responseTwo) {
          responseTwo.data.results.forEach((element, index) => {
            questo.series.push(responseTwo.data.results[index]);

            if(responseTwo.data.results[index].backdrop_path == null) {
              questo.series[index].backdrop_path = "https://via.placeholder.com/220x330.png?text=Cover+Mancante";
            } else {
              var link = "https://image.tmdb.org/t/p/w220_and_h330_face/" + responseTwo.data.results[index].backdrop_path;
              questo.series[index].backdrop_path = link;
            }

            if (responseTwo.data.results[index].overview == "") {
              questo.series[index].overview = "Descrizione mancante";
            }

            questo.series[index].vote_average = Math.round(questo.series[index].vote_average / 2);

            setTimeout( () => {
              for (let i = 0; i < questo.series[index].vote_average; i++) {
                var index2 = index + questo.films.length;
                var card = questo.$el.getElementsByClassName("card");
                var star = card[index2].getElementsByClassName("fa-star");
                star[i].classList.add("active");
              }
            }, 250);

            if (questo.series[index].original_language == "it") {
              questo.series[index].original_language = "🇮🇹";
            } else if (questo.series[index].original_language == "en") {
              questo.series[index].original_language = "🇬🇧";
            } else if (questo.series[index].original_language == "") {
              questo.series[index].original_language = "Lingua mancante";
            }


          })
        };

        if(questo.films.length == 0 && questo.series.length == 0) {
          questo.empty = "Non è stato trovato nessun film o serie tv con la chiave \"" + questo.searchText + "\"";
        } else {
          questo.empty = "";
        }
    }))
    },
  }
});
