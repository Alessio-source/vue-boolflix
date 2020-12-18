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
        })
      });

      console.log(this.films);
    }
  }
});
