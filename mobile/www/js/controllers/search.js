var app = angular.module('starter');

app.controller('SearchCtrl', ['$scope', '$http', '$ionicModal', 'GifCaller', function ($scope, $http, $ionicModal, GifCaller) {
	var list, 
	initial12,
	i = 12,
	startInfScr = false;


	$scope.search = function() {
		GifCaller.search($scope.query).then(function(res){
			list = res;
			initial12 = list.slice(0,12);
			$scope.gifList = initial12;
			startInfScr = true;
		});
	};

	$scope.loadMore = function() {
		if(startInfScr===true){
			if(i === list.length){
				GifCaller.getMoreSearchedGifs($scope.query, $scope.gifList).then(function(res) {
					list = list.concat(res);
				});
				$scope.gifList.push(list[i]);
			} else {
				$scope.gifList.push(list[i]);
			}

			i++;
		}
		$scope.$broadcast('scroll.infiniteScrollComplete');
	};

	$ionicModal.fromTemplateUrl('my-modal.html', {
		scope: $scope,
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	$scope.openModal = function(gif) {
		$scope.modalUrl = gif.images.original.url;
		$scope.modal.show();
	};

	$scope.$on('modal.hide', function() {
		$scope.modal.remove();
	});

}]);