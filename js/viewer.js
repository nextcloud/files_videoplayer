var videoViewer = {
	UI : {
		playerTemplate : '<header><link href="'+OC.filePath('files_videosPlayer', 'videojs', 'src')+'/video-js.css" rel="stylesheet"><script src="'+OC.filePath('files_videosPlayer', 'videojs', 'src')+'/video.js"></script>' + '<script>' +
		'_V_.options.flash.swf = "'+OC.filePath('files_videosPlayer', 'videojs', 'src')+'/video-js.swf"' +
		'</script>' + '</head><video id="my_video_1" class="video-js vjs-sublime-skin" controls preload="auto" width="854" height="480" poster="my_video_poster.png" data-setup="{}">' +
		'<source type="%type%" src="%src%" />' +
		'</video>',
		show : function () {
			$('<div id="videoviewer_overlay" style="display:none;"></div><div id="videoviewer_popup"><div id="videoviewer_container"><a class="box-close" id="box-close" href="#"></a></div></div>').appendTo('body');

			$('#videoviewer_overlay').fadeIn('fast',function(){
				$('#videoviewer_popup').fadeIn('fast');
			});
			$('#box-close').click(videoViewer.hidePlayer);
			var size = videoViewer.UI.getSize();
			var playerView = videoViewer.UI.playerTemplate.replace(/%width%/g, size.width)
								.replace(/%height%/g, size.height)
								.replace(/%type%/g, videoViewer.mime)
								.replace(/%src%/g, videoViewer.location)
			;
			$(playerView).prependTo('#videoviewer_container');
		},
		hide : function() {
			$('#videoviewer_popup').fadeOut('fast', function() {
				$('#videoviewer_overlay').fadeOut('fast', function() {
					$('#videoviewer_popup').remove();
					$('#videoviewer_overlay').remove();
				});
			});
		},
		getSize : function () {
			var size;
			if ($(document).width()>'680' && $(document).height()>'520' ){
				size = {width: 640, height: 480};
			} else {
				size = {width: 320, height: 240};
			}
			return size;
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
	],
	onView : function(file) {
		videoViewer.file = file;
		videoViewer.location = videoViewer.getMediaUrl(file);
		videoViewer.mime = FileActions.getCurrentMimeType();
		videoViewer.showPlayer();
	},
	showPlayer : function() {
		videoViewer.UI.show();
	},
	hidePlayer : function() {
		videoViewer.player = false;
		delete videoViewer.player;

		videoViewer.UI.hide();
	},
	getMediaUrl : function(file) {
		var dir = $('#dir').val();
		return fileDownloadPath(dir, file);
	},
	log : function(message){
		console.log(message);
	}
};

$(document).ready(function(){

	if (typeof FileActions !== 'undefined') {
		for (var i = 0; i < videoViewer.mimeTypes.length; ++i) {
			var mime = videoViewer.mimeTypes[i];
                        console.log(mime);
			FileActions.register(mime, 'View', OC.PERMISSION_READ, '', videoViewer.onView);
			FileActions.setDefault(mime, 'View');

		}
	}

});
