var app = angular.module('starter');

app.controller('GameCtrl', ['$http', function ($http) {
	var firstGame = {};
	
	// BOOT

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

	// STARTMENU

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
	
	// PRELOADER

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
			this.load.atlasXML('bunny', 'js/game/images/spritesheets/unicorn.png', 'js/game/images/spritesheets/bunny.xml');
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

	firstGame.Game = function(game) {
		this.totalBunnies = null;
		this.bunnyGroup = null;
		this.totalSpacerocks = null;
		this.spacerockgroup = null;
		this.burst = null;
		this.gameover = null;
		this.countdown = null;
		this.overmessage = null;
		this.secondsElapsed = null;
		this.timer = null;
		this.music = null;
		this.ouch = null;
		this.boom = null;
		this.ding = null;
	};

	firstGame.Game.prototype = {
		create: function() {
			this.gameover = false;
			this.secondsElapsed = 0;
			this.timer = this.time.create(false);
			this.timer.loop(1000, this.updateSeconds, this);
			this.totalBunnies = 20;
			this.totalSpacerocks = 7;
			this.music = this.add.audio('game_audio');
			this.music.play('', 0, 0.3, true);
			this.ouch = this.add.audio('hurt_audio');
			this.boom = this.add.audio('explosion_audio');
			this.ding = this.add.audio('select_audio');
			this.buildWorld();
		},
		updateSeconds: function() {
			return this.secondsElapsed++;
		},
		buildWorld: function() {
			this.add.image(0, 0, 'sky');
			this.add.image(0, 800, 'hill');
			this.buildBunnies();
			this.buildSpaceRocks();
			this.buildEmitter();
			this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', "Unicorns Left " + this.totalBunnies, 20);
			this.timer.start();
		},
		buildEmitter: function() {
			this.burst = this.add.emitter(0, 0, 80);
			this.burst.minParticleScale = 0.3;
			this.burst.maxParticleScale = 1.2;
			this.burst.minParticleSpeed.setTo(-30, 30);
			this.burst.maxParticleSpeed.setTo(30, -30);
			this.burst.makeParticles('explosion');
			this.input.onDown.add(this.fireBurst, this);
		},
		fireBurst: function(p) {
			if (!this.gameover) {
				this.boom.play();
				this.boom.volume = 0.2;
				this.burst.emitX = p.x;
				this.burst.emitY = p.y;
				this.burst.start(true, 2000, null, 20);
			}
		},
		buildBunnies: function() {
			var b, o, _i, _ref;
			this.bunnyGroup = this.add.group();
			this.bunnyGroup.enableBody = true;
			for (o = _i = 0, _ref = this.totalBunnies; 0 <= _ref ? _i < _ref : _i > _ref; o = 0 <= _ref ? ++_i : --_i) {
				b = this.bunnyGroup.create(this.rnd.integerInRange(-10, this.world.width - 50), this.rnd.integerInRange(this.world.height - 180, this.world.height - 60), 'bunny', 'Bunny0000');
				b.anchor.setTo(0.5, 0.5);
				b.body.moves = false;
				b.animations.add('Rest', this.game.math.numberArray(1, 58));
				b.animations.add('Walk', this.game.math.numberArray(68, 107));
				b.animations.play('Rest', 24, true);
				this.assignBunnyMovement(b);
			}
		},
		assignBunnyMovement: function(b) {
			var bdelay, bposition, t;
			bposition = Math.floor(this.rnd.realInRange(50, this.world.width - 50));
			bdelay = this.rnd.integerInRange(2000, 6000);
			if (bposition < b.x) {
				b.scale.x = 1;
			} else {
				b.scale.x = -1;
			}
			t = this.add.tween(b).to({
				x: bposition
			}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
			t.onStart.add(this.startBunny, this);
			t.onComplete.add(this.stopBunny, this);
		},
		startBunny: function(b) {
			b.animations.stop('Rest');
			b.animations.play('Walk', 24, true);
		},
		stopBunny: function(b) {
			b.animations.stop('Walk');
			b.animations.play('Rest', 24, true);
			this.assignBunnyMovement(b);
		},
		buildSpaceRocks: function() {
			var o, r, scale, _i, _ref;
			this.spacerockgroup = this.add.group();
			for (o = _i = 0, _ref = this.totalSpacerocks; 0 <= _ref ? _i < _ref : _i > _ref; o = 0 <= _ref ? ++_i : --_i) {
				r = this.spacerockgroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0), 'spacerock', 'SpaceRock0000');
				scale = this.rnd.realInRange(0.3, 1.0);
				r.scale.x = scale;
				r.scale.y = scale;
				this.physics.enable(r, Phaser.Physics.ARCADE);
				r.enableBody = true;
				r.body.velocity.y = this.rnd.realInRange(200, 400);
				r.animations.add('Fall');
				r.animations.play('Fall', 24, true);
				r.checkWorldBounds = true;
				r.events.onOutOfBounds.add(this.resetRock, this);
			}
		},
		resetRock: function(r) {
			if (r.y > this.world.height) {
				return this.respawnRock(r);
			}
		},
		respawnRock: function(r) {
			if (!this.gameover) {
				r.reset(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0));
				return r.body.velocity.y = this.rnd.realInRange(200, 400);
			}
		},
		burstCollision: function(r, b) {
			return this.respawnRock(r);
		},
		bunnyCollision: function(r, b) {
			if (b.exists) {
				this.ouch.play();
				this.resetRock(r);
				this.makeGhost(b);
				b.kill();
				this.totalBunnies--;
				this.checkBunniesLeft();
			}
		},
		checkBunniesLeft: function() {
			if (this.totalBunnies <= 0) {
				this.music.stop();
				console.log("");
				this.gameover = true;
				this.countdown.setText("Unicorns Left 0");
				this.overmessage = this.add.bitmapText(this.world.centerX - 180, this.world.centerY - 40, 'eightbitwonder', "Game Over\n\n " + this.secondsElapsed, 42);
				this.overmessage.align = 'center';
				this.overmessage.inputEnabled = true;
				this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
			} else {
				this.countdown.setText("Unicorns Left " + this.totalBunnies);
			}
		},
		quitGame: function() {
			this.ding.play();
			this.state.start('StartMenu');
		},
		friendlyFire: function(b, e) {
			if (b.exists) {
				this.ouch.play();
				b.kill();
				this.makeGhost(b);
				this.totalBunnies--;
				this.checkBunniesLeft();
			}
		},
		makeGhost: function(b) {
			var bunnyGhost;
			bunnyGhost = this.add.sprite(b.x - 20, b.y - 180, 'ghost');
			bunnyGhost.anchor.setTo(0.5, 0.5);
			bunnyGhost.scale.x = b.scale.x;
			this.physics.enable(bunnyGhost, Phaser.Physics.ARCADE);
			bunnyGhost.enableBody = true;
			bunnyGhost.checkWorldBounds = true;
			bunnyGhost.body.velocity.y = -800;
		},
		update: function() {
			this.physics.arcade.overlap(this.spacerockgroup, this.burst, this.burstCollision, null, this);
			this.physics.arcade.overlap(this.spacerockgroup, this.bunnyGroup, this.bunnyCollision, null, this);
			return this.physics.arcade.overlap(this.bunnyGroup, this.burst, this.friendlyFire, null, this);
		}
	};

	var game = new Phaser.Game(540, 960, Phaser.AUTO, 'gameContainer');
	game.state.add('Boot', firstGame.Boot);
	game.state.add('Preloader', firstGame.Preloader);
	game.state.add('StartMenu', firstGame.StartMenu);
	game.state.add('Game', firstGame.Game);
	game.state.start('Boot');
}]);