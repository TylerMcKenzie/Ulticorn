var app = angular.module('starter');

app.controller('GameCtrl', [function () {
	var firstGame = {};

	firstGame.Boot = function(game) {};

	firstGame.Boot.prototype = {
		preload: function() {
			this.load.image('preloadBar', 'js/game/images/loader_bar.png');
			this.load.image('titleimage', 'js/game/images/TitleImage.png');
		},

		create: function() {
			this.input.maxPointers = 1;
			this.stage.disableVisibilityChange = false;
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.minWidth = 270;
			this.scale.minHeight = 480;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			this.stage.forcePortrait = true;
			this.scale.setScreenSize(true);

			this.input.addPointer();
			this.stage.backgroundColor = '#171642';

			this.state.start('Preloader');
		}
	};

	firstGame.StartMenu = function(game) {
		this.startBG = this.startPrompt = this.ding = null;
	};

	firstGame.StartMenu.prototype = {

		create: function () {
			this.ding = this.add.audio('select_audio');
			startBG = this.add.image(0, 0, 'titlescreen');
			startBG.inputEnabled = true;
			startBG.events.onInputDown.addOnce(this.startGame, this);
			startPrompt = this.add.bitmapText(this.world.centerX-155, this.world.centerY+180, 'eightbitwonder', "Touch to Start!", 24);
		},

		startGame: function (pointer) {
			this.ding.play();
			this.state.start('Game');
		}
	};

	firstGame.Preloader = function(game) {
		this.preloadBar = null;
		this.titleText = null;
		this.ready = false;
	};

	firstGame.Preloader.prototype = {
		preload: function() {
			this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
			this.preloadBar.anchor.setTo(0.5, 0.5);
			this.load.setPreloadSprite(this.preloadBar);
			this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
			this.titleText.anchor.setTo(0.5, 0.5);
			this.load.image('titlescreen', 'js/game/images/TitleBG.png');
			this.load.bitmapFont('eightbitwonder', 'js/game/fonts/eightbitwonder.png', 'js/game/fonts/eightbitwonder.fnt');
			this.load.image('sky', 'js/game/images/sky.png');
			this.load.image('hill', 'js/game/images/hill.png');
			this.load.atlasXML('bunny', 'js/game/images/spritesheets/bunny.png', 'js/game/images/spritesheets/bunny.xml');
			this.load.atlasXML('spacerock', 'js/game/images/spritesheets/SpaceRock.png', 'js/game/images/spritesheets/SpaceRock.xml');
			this.load.image('explosion', 'js/game/images/explosion.png');
			this.load.image('ghost', 'js/game/images/ghost.png');
			this.load.audio('explosion_audio', 'js/game/audio/explosion.mp3');
			this.load.audio('hurt_audio', 'js/game/audio/hurt.mp3');
			this.load.audio('select_audio', 'js/game/audio/select.mp3');
			this.load.audio('game_audio', 'js/game/audio/bgm.mp3');
		},

		create: function() {
			this.preloadBar.cropEnabled = false;
		},

		update: function() {
			this.ready = true; 
			this.state.start('StartMenu');
		}
	};

	var game = new Phaser.Game(540, 960, Phaser.AUTO, 'gameContainer');
	game.state.add('Boot', firstGame.Boot);
	game.state.add('Preloader', firstGame.Preloader);
	game.state.add('StartMenu', firstGame.StartMenu);
	game.state.start('Boot');
}]);