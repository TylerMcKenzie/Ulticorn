var app = angular.module('starter');

app.factory('GifCaller', function($http) {

	return {
			getGifs: function() {
				return $http.get('http://api.giphy.com/v1/gifs/search?q=unicorns&limit=100&api_key=dc6zaTOxFJmzC').then(function(res){
					return res.data.data;
				});
			},

			getMoreGifs: function(arr) {
				return $http.get('http://api.giphy.com/v1/gifs/search?q=unicorns&limit=100&offset=' + arr.length + '&api_key=dc6zaTOxFJmzC').then(function(res){
					return res.data.data;
				});
			},

			search: function(query) {
				return $http.get('http://api.giphy.com/v1/gifs/search?q=' + query + '&limit=100&api_key=dc6zaTOxFJmzC').then(function(res){
					return res.data.data;
				});
			},

			getMoreSearchedGifs: function(query, arr) {
				return $http.get('http://api.giphy.com/v1/gifs/search?q=' + query + '&limit=100&offset=' + arr.length + '&api_key=dc6zaTOxFJmzC').then(function(res) {
					return res.data.data;
				});
			},

			trending: function() {
				return $http.get('http://api.giphy.com/v1/gifs/trending?limit=100&api_key=dc6zaTOxFJmzC').then(function(res) {
					return res.data.data
				});
			},

			getMoreTrending: function(arr) {
				return $http.get('http://api.giphy.com/v1/gifs/trending?limit=100&offset='+ arr.length +'&api_key=dc6zaTOxFJmzC').then(function(res) {
					return res.data.data
				});
			}
	}

});