var app = new Vue({
  el: "#app",
  data: {
    films: [],
    searchText: ""
  },
  methods: {
    searchMovie: function() {
      var text = this.searchText.split(" ").join("+");
      var questo = this;
      questo.films = [];
      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: "87999777404e3c905e01e7dfe9466bae",
          language: "it",
          query: questo.searchText,
          page: 1,
        }
      }).then(function (response) {
        response.data.results.forEach((element, index) => {
          questo.films.push(response.data.results[index]);

          if(response.data.results[index].backdrop_path == null) {
            questo.films[index].backdrop_path = "https://via.placeholder.com/220x330.png?text=Cover+Mancante";
          } else {
            var link = "https://image.tmdb.org/t/p/w220_and_h330_face/" + response.data.results[index].backdrop_path;
            questo.films[index].backdrop_path = link;
          }

          if (response.data.results[index].overview == "") {
            questo.films[index].overview = "Descrizione mancante";
          }

          questo.films[index].vote_average = Math.round(questo.films[index].vote_average / 2);

          setTimeout( () => {
            for (let i = 0; i < questo.films[index].vote_average; i++) {
              var card = questo.$el.getElementsByClassName("card");
              var star = card[index].getElementsByClassName("fa-star");
              star[i].classList.add("active");
            }
          }, 250)
        })
      });

      console.log(this.films);
    }
  }
});
