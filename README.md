# ownCloud Video.js
![](screenshot.jpg)

A responsive video player for ownCloud using a skinned version of Video.js.

## Installation
Simply copy the contents of this repository to **$owncloud/apps/files_videojs-sublime** and enable the app.

#### Safari
You need the *xsendfile* module installed on your web server for ownCloud video playback to work in Safari. Installation instructions for Apache on Ubuntu:
````
sudo apt-get install libapache2-mod-xsendfile
````
Add these two lines in */etc/apache2/conf-available/owncloud.conf*:
````
<Directory /var/www/owncloud>
    ...
    SetEnv MOD_X_SENDFILE_ENABLED 1
    XSendFile On
</Directory>
````

## Credits
The player is a modified version of [this app](https://apps.owncloud.com/content/show.php/Video+Js?content=159670) to make it responsive and improve the UI.

Video.js: http://videojs.com/

Video.js skin: https://github.com/cabin/videojs-sublime-skin

## License
AGPL
