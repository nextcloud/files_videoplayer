var videoViewer = {
	UI : {
		loadVideoJS: function() {
			if (this.videoLibLoaded) {
				return $.when();
			} else {
				this.videoLibLoaded = true;
				var stylePath = OC.filePath('files_videoplayer', 'mediaelement', 'mediaelementplayer.min.css');
				$('head').append($('<link rel="stylesheet" type="text/css" href="' + stylePath + '"/>'));
				var scriptPath = OC.filePath('files_videoplayer', 'mediaelement', 'mediaelement-and-player.min.js');
				return $.getScript(scriptPath, function (xhr) {eval(xhr);});
			}
		},
		videoLibLoaded: false,
		playerTemplate : '<video id="my_video_1" controls preload="auto" autoplay="true" width="100%" height="100%">' +
		'<source type="%type%" src="%src%" />' +
		'%tracks%' +
		'</video>',
		show : function () {
			// insert HTML
			var overlay = $('<div id="videoplayer_overlay" style="display:none;"><div id="videoplayer_outer_container"><div id="videoplayer_container"><div id="videoplayer"></div></div></div></div>');
			overlay.appendTo('body');
			var playerView = videoViewer.UI.playerTemplate
								.replace(/%src%/g, escapeHTML(videoViewer.location))
								.replace(/%tracks%/g, tracks);
			if (videoViewer.mime) {
				playerView = playerView.replace(/%type%/g, escapeHTML(videoViewer.mime));
			} else {
				playerView = playerView.replace(/type="%type%"/g, '');
			}
			$(playerView).prependTo('#videoplayer');
			// close when clicking on the overlay
			overlay.on("click", function(e) {
				if (e.target === this) {
					videoViewer.hidePlayer();
				}
			});
			// show elements
			overlay.fadeIn('fast');
			// initialize player
			$("#my_video_1").mediaelementplayer({
				features: ['playpause','loop','current','progress','duration','tracks','volume','fullscreen'],
				alwaysShowControls: false,
				autoRewind: false,
				startVolume: 1,
				success: function(mediaElement, domElement, player) {
					videoViewer.player = mediaElement;
					// append close button to video element
					var closeButton = $('<a class="icon-view-close" id="box-close" href="#"></a>').click(videoViewer.hidePlayer);
					$("#videoplayer").append(closeButton);
					// autoplay
					videoViewer.player.play();
					// focus the player to make keyboard shortcuts work
					$(".mejs__video").focus();
				},
				error: function() {
					alert('MediaElement initialization failed.');
				}
			});

		},
		hide : function() {
			$('#videoplayer_overlay').fadeOut('fast', function() {
				$('#videoplayer_overlay').remove();
			});
		},
		detectSubs : function() {
			var langcodeToName = {
				af: 'Afrikaans', am: 'Amharic', ar: 'Arabic', as: 'Assamese',
				ba: 'Bashkir', be: 'Belarusian', bg: 'Bulgarian', bn: 'Bengali',
				bo: 'Tibetan', br: 'Breton', ca: 'Catalan', co: 'Corsican',
				cs: 'Czech', cy: 'Welsh', da: 'Danish', de: 'German',
				dv: 'Divehi', el: 'Greek', en: 'English', es: 'Spanish',
				et: 'Estonian', eu: 'Basque', fa: 'Persian', fi: 'Finnish',
				fo: 'Faroese', fr: 'French', gd: 'Scottish Gaelic', gl: 'Galician',
				gu: 'Gujarati', he: 'Hebrew', hi: 'Hindi', hr: 'Croatian',
				hu: 'Hungarian', hy: 'Armenian', id: 'Indonesian', ig: 'Igbo',
				is: 'Icelandic', it: 'Italian', ja: 'Japanese', ka: 'Georgian',
				kk: 'Kazakh', km: 'Khmer', kn: 'Kannada', ko: 'Korean',
				lb: 'Luxembourgish', lo: 'Lao', lt: 'Lithuanian', lv: 'Latvian',
				mi: 'Maori', ml: 'Malayalam', mr: 'Marathi', ms: 'Malay',
				mt: 'Maltese', ne: 'Nepali', nl: 'Dutch', no: 'Norwegian',
				oc: 'Occitan', or: 'Oriya', pl: 'Polish', ps: 'Pashto',
				pt: 'Portuguese', qu: 'Quechua', ro: 'Romanian', ru: 'Russian',
				rw: 'Kinyarwanda', sa: 'Sanskrit', si: 'Sinhala', sk: 'Slovak',
				sl: 'Slovenian', sq: 'Albanian', sv: 'Swedish', ta: 'Tamil',
				te: 'Telugu', th: 'Thai', tk: 'Turkmen', tr: 'Turkish',
				tt: 'Tatar', uk: 'Ukrainian', ur: 'Urdu', vi: 'Vietnamese',
				wo: 'Wolof', yo: 'Yoruba', zh: 'Chinese'
			}
			var fileEnding = videoViewer.file.lastIndexOf('.');
			var candidateName = videoViewer.file.substr(0, fileEnding);
			var languageRegex = /^.*([a-zA-Z]{2})\.srt$/g;
			var subtitles = [];
			// detect candidates
			for (var i = 0; i < videoViewer.ls.length; i++) {
				var candidate = videoViewer.ls[i].name.indexOf(candidateName);
				// check if candidate is a subtitle file
				if (videoViewer.ls[i].name != videoViewer.file && candidate === 0) {
					var isSubtitle = videoViewer.ls[i].name.search(languageRegex);
					// subtitles found
					if (isSubtitle != -1) {
						// detect language
						while (language = languageRegex.exec(videoViewer.ls[i].name)) {
							var srclang = language[1];
							var label = langcodeToName[srclang];
						}
						// build HTML
						var sub = '<track kind="subtitles" src="/remote.php/webdav' + videoViewer.dir + '/' + videoViewer.ls[i].name + '" srclang="' + srclang + '" label="' + label + '" />';
						subtitles.push(sub);
					}
				}
			}
			tracks = subtitles.join('\r\n');
			return $.when();
		}
	},
	mime : null,
	file : null,
	location : null,
	player : null,
	mimeTypes : [
		'video/mp4',
		'video/webm',
		'video/x-flv',
		'video/ogg',
		'video/quicktime',
		'video/x-matroska'
	],
	mimeTypeAliasses: {
		'video/x-matroska': 'video/webm' // mkv support for Chrome. webm uses the same container format
	},
	onView : function(file, data) {
		videoViewer.file = file;
		videoViewer.dir = data.dir;
		videoViewer.ls = data.fileList.files;
		videoViewer.location = data.fileList.getDownloadUrl(file, videoViewer.dir);
		videoViewer.mime = data.$file.attr('data-mime');
		if (videoViewer.mimeTypeAliasses.hasOwnProperty(videoViewer.mime)) {
			videoViewer.mime = videoViewer.mimeTypeAliasses[videoViewer.mime];
		}
		videoViewer.UI.detectSubs().then(function () {
			videoViewer.showPlayer();
		});
	},
	showPlayer : function() {
		videoViewer.UI.loadVideoJS().then(function() {
			videoViewer.UI.show();
		});
	},
	hidePlayer : function() {
		if (videoViewer.player !== null && videoViewer.player !== false) {
			videoViewer.player.remove();
			videoViewer.player = false;
			videoViewer.UI.hide();
		}
	},
	log : function(message){
		console.log(message);
	}
};

$(document).ready(function(){

	// add event to ESC key
	$(document).keyup(function(e) {
		if (e.keyCode === 27) {
			videoViewer.hidePlayer();
		}
	});

	if (typeof FileActions !== 'undefined') {
		for (var i = 0; i < videoViewer.mimeTypes.length; ++i) {
			var mime = videoViewer.mimeTypes[i];
			OCA.Files.fileActions.register(mime, 'View', OC.PERMISSION_READ, '', videoViewer.onView);
			OCA.Files.fileActions.setDefault(mime, 'View');
		}
	}

});
