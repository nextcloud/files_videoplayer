!function(e){function i(i){for(var n,o,l=i[0],r=i[1],a=0,s=[];a<l.length;a++)o=l[a],t[o]&&s.push(t[o][0]),t[o]=0;for(n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);for(d&&d(i);s.length;)s.shift()()}var n={},t={0:0};function o(i){if(n[i])return n[i].exports;var t=n[i]={i:i,l:!1,exports:{}};return e[i].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.e=function(e){var i=[],n=t[e];if(0!==n)if(n)i.push(n[2]);else{var l=new Promise(function(i,o){n=t[e]=[i,o]});i.push(n[2]=l);var r,a=document.createElement("script");a.charset="utf-8",a.timeout=120,o.nc&&a.setAttribute("nonce",o.nc),a.src=function(e){return o.p+""+({1:"vendors~videojs",2:"videojs"}[e]||e)+".js"}(e),r=function(i){a.onerror=a.onload=null,clearTimeout(d);var n=t[e];if(0!==n){if(n){var o=i&&("load"===i.type?"missing":i.type),l=i&&i.target&&i.target.src,r=new Error("Loading chunk "+e+" failed.\n("+o+": "+l+")");r.type=o,r.request=l,n[1](r)}t[e]=void 0}};var d=setTimeout(function(){r({type:"timeout",target:a})},12e4);a.onerror=a.onload=r,document.head.appendChild(a)}return Promise.all(i)},o.m=e,o.c=n,o.d=function(e,i,n){o.o(e,i)||Object.defineProperty(e,i,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,i){if(1&i&&(e=o(e)),8&i)return e;if(4&i&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&i&&"string"!=typeof e)for(var t in e)o.d(n,t,function(i){return e[i]}.bind(null,t));return n},o.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(i,"a",i),i},o.o=function(e,i){return Object.prototype.hasOwnProperty.call(e,i)},o.p="/js/",o.oe=function(e){throw console.error(e),e};var l=window.webpackJsonp=window.webpackJsonp||[],r=l.push.bind(l);l.push=i,l=l.slice();for(var a=0;a<l.length;a++)i(l[a]);var d=r;o(o.s=0)}([function(e,i,n){
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
n.nc=btoa(OC.requestToken),n.p=OC.filePath("files_videoplayer","","js/");var t=null,o={UI:{show:function(){var e=document.createElement("source");e.src=escapeHTML(o.location).replace("&amp;","&"),o.mime&&(e.type=escapeHTML(o.mime));var i=document.createElement("video");if(i.id="my_video_1",i.classList.add("video-js"),i.classList.add("vjs-fill"),i.classList.add("vjs-big-play-centered"),i.controls=!0,i.preload="auto",i.width="100%",i.height="100%",i.poster=OC.filePath("files_videoplayer","","img")+"/poster.png",i.setAttribute("data-setup",'{"techOrder": ["html5"]}'),i.appendChild(e),null===o.inline){var n=document.createElement("div");n.id="videoplayer_overlay";var l=document.createElement("div");l.id="videoplayer_outer_container";var r=document.createElement("div");r.id="videoplayer_container";var a=document.createElement("div");a.id="videoplayer",r.appendChild(a),l.appendChild(r),n.appendChild(l),a.appendChild(i),document.body.appendChild(n),n.addEventListener("click",function(e){e.target===this&&o.hidePlayer()}),setTimeout(function(){n.className="show"},0)}else{var d=document.createElement("div");d.id="videoplayer_view",d.appendChild(i),o.inline.appendChild(d)}t("my_video_1",{fill:!0}).ready(function(){if(o.player=this,null===o.inline){var e=document.createElement("a");e.className="icon-view-close",e.id="box-close",e.href="#",e.addEventListener("click",function(){o.hidePlayer()}),document.getElementById("my_video_1").appendChild(e)}null===document.getElementById("body-public")&&o.player.play()})},hide:function(){var e=document.getElementById("videoplayer_overlay");e.className="",setTimeout(function(){e.parentElement.removeChild(e)},500)}},mime:null,file:null,location:null,player:null,inline:null,mimeTypes:["video/mp4","video/x-m4v","video/webm","video/x-flv","video/ogg","video/quicktime","video/x-matroska"],mimeTypeAliasses:{"video/x-matroska":"video/webm"},onView:function(e,i){o.file=e,o.dir=i.dir,o.location=i.fileList.getDownloadUrl(e,o.dir),o.mime=i.$file.attr("data-mime"),o.mimeTypeAliasses.hasOwnProperty(o.mime)&&(o.mime=o.mimeTypeAliasses[o.mime]),o.showPlayer()},onViewInline:function(e,i,n){o.location=i,o.mime=n,o.mimeTypeAliasses.hasOwnProperty(o.mime)&&(o.mime=o.mimeTypeAliasses[o.mime]),o.inline=e,o.showPlayer()},showPlayer:function(){Promise.all([n.e(1),n.e(2)]).then(n.bind(null,3)).then(function(e){t=e.default,Promise.all([Promise.all([n.e(1),n.e(2)]).then(n.t.bind(null,1,7)),Promise.all([n.e(1),n.e(2)]).then(n.t.bind(null,2,7))]).then(function(){o.UI.show()})})},hidePlayer:function(){null!==o.player&&!1!==o.player&&null===o.inline&&(o.player.dispose(),o.player=!1,o.UI.hide())},log:function(e){console.log(e)}};document.addEventListener("DOMContentLoaded",function(){if(document.addEventListener("keyup",function(e){(void 0!==e.key&&"Escape"===e.key||void 0!==e.keyCode&&27===e.keyCode)&&o.hidePlayer()}),OCA&&OCA.Files&&OCA.Files.fileActions&&!OCA.Viewer)for(var e=0;e<o.mimeTypes.length;++e){var i=o.mimeTypes[e];OCA.Files.fileActions.register(i,"View",OC.PERMISSION_READ,"",o.onView),OCA.Files.fileActions.setDefault(i,"View"),i===n&&(isSupportedMimetype=!0)}if(document.getElementById("body-public")&&document.getElementById("imgframe")){var n=document.getElementById("mimetype").value;for(e=0;e<o.mimeTypes.length;++e)if(o.mimeTypes[e]===n){var t=window.location.href.split("?")[0]+"/download";o.onViewInline(document.getElementById("imgframe"),t,n);break}}})}]);
//# sourceMappingURL=main.js.map
