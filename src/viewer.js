/*
 * @copyright 2018 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @author 2018 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import $ from 'jquery';

__webpack_nonce__ = btoa(OC.requestToken)
__webpack_public_path__ = OC.filePath('files_videoplayer', '', 'js/')

const loadVideoJSOnce = function() {
	let alreadyCalled = false;
	let result;

	return new Promise(function(resolve, reject) {
		if (!alreadyCalled) {
			result = import(/* webpackChunkName: "videojs" */ 'video.js');
			alreadyCalled = true;
		}

		resolve(result);
	});
};

var videoViewer = {
	UI: {
		playerTemplate: '<video id="my_video_1" class="video-js vjs-sublime-skin" controls preload="auto" width="100%" height="100%" poster="' + OC.filePath('files_videoplayer', '', 'img') + '/poster.png" data-setup=\'{"techOrder": ["html5"]}\'>' +
			'<source type="%type%" src="%src%" />' +
			'</video>',
		show: function () {
			// insert HTML
			var playerView = videoViewer.UI.playerTemplate
				.replace(/%src%/g, escapeHTML(videoViewer.location));
			if (videoViewer.mime) {
				playerView = playerView.replace(/%type%/g, escapeHTML(videoViewer.mime));
			} else {
				playerView = playerView.replace(/type="%type%"/g, '');
			}
			if (videoViewer.inline === null) {
				var overlay = $('<div id="videoplayer_overlay" style="display:none;"><div id="videoplayer_outer_container"><div id="videoplayer_container"><div id="videoplayer"></div></div></div></div>');
				overlay.appendTo('body');
				$(playerView).prependTo('#videoplayer');
				// close when clicking on the overlay
				overlay.on("click", function (e) {
					if (e.target === this) {
						videoViewer.hidePlayer();
					}
				});
				// show elements
				overlay.fadeIn('fast');
			} else {
				var wrapper = $('<div id="videoplayer_view"></div>');
				wrapper.append(playerView);
				$(videoViewer.inline).html(wrapper);
			}
			// initialize player
			videojs("my_video_1").ready(function () {
				videoViewer.player = this;
				if (videoViewer.inline === null) {
					// append close button to video element
					var closeButton = $('<a class="icon-view-close" id="box-close" href="#"></a>').click(videoViewer.hidePlayer);
					$("#my_video_1").append(closeButton);
				}
				// autoplay
				videoViewer.player.play();
			});

		},
		hide: function () {
			$('#videoplayer_overlay').fadeOut('fast', function () {
				$('#videoplayer_overlay').remove();
			});
		}
	},
	mime: null,
	file: null,
	location: null,
	player: null,
	inline: null,
	mimeTypes: [
		'video/mp4',
		'video/x-m4v',
		'video/webm',
		'video/x-flv',
		'video/ogg',
		'video/quicktime',
		'video/x-matroska'
	],
	mimeTypeAliasses: {
		'video/x-matroska': 'video/webm' // mkv support for Chrome. webm uses the same container format
	},
	onView: function (file, data) {
		videoViewer.file = file;
		videoViewer.dir = data.dir;
		videoViewer.location = data.fileList.getDownloadUrl(file, videoViewer.dir);
		videoViewer.mime = data.$file.attr('data-mime');
		if (videoViewer.mimeTypeAliasses.hasOwnProperty(videoViewer.mime)) {
			videoViewer.mime = videoViewer.mimeTypeAliasses[videoViewer.mime];
		}
		videoViewer.showPlayer();
	},
	onViewInline: function (element, file, mime) {
		videoViewer.location = file;
		videoViewer.mime = mime;
		if (videoViewer.mimeTypeAliasses.hasOwnProperty(videoViewer.mime)) {
			videoViewer.mime = videoViewer.mimeTypeAliasses[videoViewer.mime];
		}
		videoViewer.inline = element;
		videoViewer.showPlayer();
	},
	showPlayer: function () {
		loadVideoJSOnce().then(() => {
			videoViewer.UI.show();
		});
	},
	hidePlayer: function () {
		if (videoViewer.player !== null && videoViewer.player !== false && videoViewer.inline === null) {
			videoViewer.player.dispose();
			videoViewer.player = false;
			videoViewer.UI.hide();
		}
	},
	log: function (message) {
		console.log(message);
	}
};

$(document).ready(function () {

	// add event to ESC key
	$(document).keyup(function (e) {
		if (e.keyCode === 27) {
			videoViewer.hidePlayer();
		}
	});

	var isSupportedMimetype = false;
	var mimetype = $('#mimetype').val();

	if (typeof FileActions !== 'undefined') {
		for (var i = 0; i < videoViewer.mimeTypes.length; ++i) {
			var mime = videoViewer.mimeTypes[i];
			OCA.Files.fileActions.register(mime, 'View', OC.PERMISSION_READ, '', videoViewer.onView);
			OCA.Files.fileActions.setDefault(mime, 'View');
			if (mime === mimetype) {
				isSupportedMimetype = true;
			}
		}
	}

	if ($('#body-public').length && $('#imgframe').length && isSupportedMimetype) {
		var videoUrl = window.location + '/download';
		videoViewer.onViewInline($('#imgframe'), videoUrl, mimetype);
	}

});
