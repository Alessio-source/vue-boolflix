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
          query: questo.searchText,
          page: 1,
          language: "it_IT",
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
        })
      });

      console.log(this.films);
    }
  }
});
