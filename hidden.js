// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 2.0, July 8th, 2011
// by Stefan Gabos

// remember to change every instance of "pluginName" to the name of your plugin!
// the semicolon at the beginning is there on purpose in order to protect the integrity of your scripts when
// mixed with incomplete objects, arrays, etc.
;(function($) {

	// we need attach the plugin to jQuery's namespace or otherwise it would not be
	// available outside this function's scope
	// "el" should be a jQuery object or a collection of jQuery objects as returned by
	// jQuery's selector engine
	$.hidden = function(el, options) {

		// plugin's default options
		// this is private property and is accessible only from inside the plugin
		var defaults = {

			phrase : 'Bonne annee 2012',
			color : 'red'

		}

		// to avoid confusions, use "plugin" to reference the current instance of the object
		var plugin = this;

		// this will hold the merged default, and user-provided options
		// plugin's properties will be accessible like:
		// plugin.settings.propertyName from inside the plugin or
		// myplugin.settings.propertyName from outside the plugin
		// where "myplugin" is an instance of the plugin
		plugin.settings = {}

		// the "constructor" method that gets called when the object is created
		// this is a private method, it can be called only from inside the plugin
		var init = function() {

			// the plugin's final properties are the merged default and user-provided options (if any)
			plugin.settings = $.extend({}, defaults, options);

			// make the collection of target elements available throughout the plugin
			// by making it a public property
			plugin.el = el;
			plugin.items = [];
			plugin.lettres = []; 
			plugin.exclus = [];
			plugin.reponse = [];
			
			Array.prototype.inArray = function(p_val) {
				var l = this.length;
				for(var i = 0; i < l; i++) {
					if(this[i] == p_val) {
						return true;
					}
				}
				return false;
			}

			$('body').css({
				margin : 0,
				padding : 0,
				width : '100%',
				height : '100%'
			});
			plugin.stage = el;
			plugin.stage.css({position:'relative'});
			plugin.stageWidth = $(window).width();
			plugin.stageHeight = $(window).height() - plugin.stage.position().top;
			plugin.nbLigne = Math.floor(plugin.stageHeight / 35) - 1;
			plugin.nbCol = Math.floor(plugin.stageWidth / 35);
			plugin.exclus = plugin.settings.phrase.toUpperCase().split('');
			
			// genere le tableau de lettres a ajouter sur la scene
			makeLetters();
			
			// Ajout des elements sur la scene
			addLetters();
			
			// Remplacement des lettres par les lettres à trouver de facon aléatoire
			for( i = 0; i < plugin.exclus.length; i++) {
				if(plugin.exclus[i] != ' ') {
					var ref = tirage();
					$('#l' + ref).css({color:'red'}).text(plugin.exclus[i]).click(function() {
						$(this).addClass('l' + $(this).text());
						$(this).addClass('ok');
						valid($(this).attr('id'))
					});
					plugin.items.push('l' + ref);
				}
			}
			chrono = new Date();
			plugin.start = chrono.getTime()

		}
		// public methods
		// these methods can be called like:
		// plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
		// myplugin.publicMethod(arg1, arg2, ... argn) from outside the plugin
		// where "myplugin" is an instance of the plugin

		// a public method. for demonstration purposes only - remove it!
		//plugin.foo_public_method = function() {

			// code goes here

		//}

		// Initialisation du tableau d'elements à ajouter aleatoirement
		var makeLetters = function() {
			for( i = 1; i <= 26; i++) {
				sAlpha = String.fromCharCode(64 + i);
				plugin.exclus.inArray(sAlpha) ? '' : plugin.lettres.push(sAlpha);
				i < 10 && !(plugin.exclus.inArray(i)) ? plugin.lettres.push(i) : '';
			}
		}
		
		// Ecriture des lettres dans le DOM		
		var addLetters = function(){
			// Combien de tableaux faut il pour remplir l'écran
			plugin.nbLettres = Math.floor(plugin.nbLigne * plugin.nbCol);
			plugin.nbTableau = Math.ceil(plugin.nbLettres / plugin.lettres.length);
			var result = plugin.lettres;
			for( i = 0; i < plugin.nbTableau - 1; i++) {
				result = result.concat(plugin.lettres);
			}
			// Mélange des lettres
			plugin.lettres = shuffle(result);
			// Ajout des lettres à l'ecran
			plugin.k = 0;
			for( i = 0; i < plugin.nbLigne - 1; i++) {
				for( j = 0; j < plugin.nbCol - 1; j++) {
					l = $('<span class="lettre" id="l' + plugin.k + '">' + plugin.lettres[plugin.k] + '</span>').css({
						textAlign : 'center',
						'float' : 'left',
						display : 'block',
						width : '35px',
						height : '35px',
						border : '1px solid black',
						fontSize : '30px',
						cursor : 'pointer'
					});
					plugin.stage.append(l);
					plugin.k++;
				}
			}

		}

		var shuffle = function(v) {
			for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
			return v;
		};
		var tirage = function() {
			var sortie = parseInt(Math.random() * plugin.k);
			return plugin.items.inArray('l' + sortie) ? tirage() : sortie;
		}
		var valid = function(item) {
			if(plugin.items.inArray(item)) {
				plugin.reponse.inArray(item) ? dejaVu() : plugin.reponse.push(item);
				plugin.reponse.length == plugin.items.length ? gagne() : encourage();
			}
		}
		var gagne = function() {
			if(plugin.reponse.length == plugin.items.length) {
				chrono = new Date();
				plugin.end = chrono.getTime();
				$('.lettre:not(.ok)').remove();
				$.each(plugin.exclus, function(i, v) {
					$('.l' + plugin.exclus[i] + ':first').unbind().removeClass('l' + plugin.exclus[i]).css({
						position : 'absolute',
						border : '0px'
					}).animate({
						left : i * 35 + 'px'
					});
				});
				victoire = $('<span>Votre score : ' + Math.floor(plugin.exclus.length * plugin.nbLettres * 100 - (plugin.end - plugin.start))+'</span>').css({position:'absolute', top:'40px', left:'0px'});
				plugin.stage.append(victoire);
			} else {
				alert('tricheur');
			}
		}
		var encourage = function() {
			//alert('sur la bonne voie');
		}
		var dejaVu = function() {
			alert('Tu as déja validé cet élément');
		}
		// call the "constructor" method
		init();

	}
})(jQuery);
