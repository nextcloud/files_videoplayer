/**
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

import escapeHTML from 'escape-html'

__webpack_nonce__ = btoa(OC.requestToken)
__webpack_public_path__ = OC.filePath('files_videoplayer', '', 'js/')

let videojs = null

const videoViewer = {
	UI: {
		show() {

			const source = document.createElement('source')
			source.src = escapeHTML(videoViewer.location).replace('&amp;', '&')

			if (videoViewer.mime) {
				source.type = escapeHTML(videoViewer.mime)
			}

			const playerView = document.createElement('video')
			playerView.id = 'my_video_1'
			playerView.classList.add('video-js')
			playerView.classList.add('vjs-fill')
			playerView.classList.add('vjs-big-play-centered')
			playerView.controls = true
			playerView.preload = 'auto'
			playerView.width = '100%'
			playerView.height = '100%'
			playerView.poster = OC.filePath('files_videoplayer', '', 'img') + '/poster.png'
			playerView.setAttribute('data-setup', '{"techOrder": ["html5"]}')
			playerView.appendChild(source)

			if (videoViewer.inline === null) {
				const overlay = document.createElement('div')
				overlay.id = 'videoplayer_overlay'

				const outerContainer = document.createElement('div')
				outerContainer.id = 'videoplayer_outerContainer'

				const container = document.createElement('div')
				container.id = 'videoplayer_container'

				const player = document.createElement('div')
				player.id = 'videoplayer'

				container.appendChild(player)
				outerContainer.appendChild(container)
				overlay.appendChild(outerContainer)

				player.appendChild(playerView)
				document.body.appendChild(overlay)

				// close when clicking on the overlay
				overlay.addEventListener('click', function(e) {
					if (e.target === this) {
						videoViewer.hidePlayer()
					}
				})

				setTimeout(() => { overlay.className = 'show' }, 0)
			} else {
				const wrapper = document.createElement('div')
				wrapper.id = 'videoplayer_view'
				wrapper.appendChild(playerView)
				videoViewer.inline.appendChild(wrapper)
			}
			// initialize player
			videojs('my_video_1', {
				fill: true,
			}).ready(function() {
				videoViewer.player = this
				if (videoViewer.inline === null) {
					// append close button to video element
					const closeButton = document.createElement('a')
					closeButton.className = 'icon-view-close'
					closeButton.id = 'box-close'
					closeButton.href = '#'
					closeButton.addEventListener('click', function() {
						videoViewer.hidePlayer()
					})
					document.getElementById('my_video_1').appendChild(closeButton)
				}
				// autoplay
				if (document.getElementById('body-public') === null) {
					videoViewer.player.play()
				}
			})

		},
		hide() {
			const overlay = document.getElementById('videoplayer_overlay')
			overlay.className = ''
			setTimeout(() => {
				overlay.parentElement.removeChild(overlay)
			}, 500)
		},
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
		'video/x-matroska',
	],
	mimeTypeAliasses: {
		'video/x-matroska': 'video/webm', // mkv support for Chrome. webm uses the same container format
	},
	onView(file, data) {
		videoViewer.file = file
		videoViewer.dir = data.dir
		videoViewer.location = data.fileList.getDownloadUrl(file, videoViewer.dir)
		videoViewer.mime = data.$file.attr('data-mime')
		if (Object.prototype.hasOwnProperty.call(videoViewer.mimeTypeAliasses, videoViewer.mime)) {
			videoViewer.mime = videoViewer.mimeTypeAliasses[videoViewer.mime]
		}
		videoViewer.showPlayer()
	},
	onViewInline(element, file, mime) {
		videoViewer.location = file
		videoViewer.mime = mime
		if (Object.prototype.hasOwnProperty.call(videoViewer.mimeTypeAliasses, videoViewer.mime)) {
			videoViewer.mime = videoViewer.mimeTypeAliasses[videoViewer.mime]
		}
		videoViewer.inline = element
		videoViewer.showPlayer()
	},
	showPlayer() {
		import('video.js').then((_videojs) => {
			videojs = _videojs.default
			Promise.all([
				import('../css/style.css'),
				// eslint-disable-next-line import/no-webpack-loader-syntax
				import('video.js/dist/video-js.css'),
			]).then(() => {
				videoViewer.UI.show()
			})
		})
	},
	hidePlayer() {
		if (videoViewer.player !== null && videoViewer.player !== false && videoViewer.inline === null) {
			videoViewer.player.dispose()
			videoViewer.player = false
			videoViewer.UI.hide()
		}
	},
	log(message) {
		// eslint-disable-next-line no-console
		console.log(message)
	},
}

document.addEventListener('DOMContentLoaded', function() {

	// add event to ESC key
	document.addEventListener('keyup', function(e) {
		if ((e.key !== undefined && e.key === 'Escape')
			|| (e.keyCode !== undefined && e.keyCode === 27)) {
			videoViewer.hidePlayer()
		}
	})

	// Public page magic
	if (document.getElementById('body-public') && document.getElementById('imgframe')) {
		const mimetype = document.getElementById('mimetype').value
		for (let j = 0; j < videoViewer.mimeTypes.length; ++j) {
			if (videoViewer.mimeTypes[j] === mimetype) {
				const videoUrl = window.location.href.split('?')[0] + '/download'
				videoViewer.onViewInline(document.getElementById('imgframe'), videoUrl, mimetype)
				break
			}
		}
	}

})
