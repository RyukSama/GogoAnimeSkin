// ==UserScript==
// @name         Video Player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @match        https://goload.one/*
// @icon         https://www.google.com/s2/favicons?domain=gogoanime.pe
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  var nxt_url = "";
  window.addEventListener(
    "message",
    (event) => {
      nxt_url = event.data;
      console.log(nxt_url);
    },
    false
  );
  setTimeout(() => {
    var vid = document.getElementsByTagName("video")[0];
    vid.onplay = () => {
      document
        .getElementsByClassName(
          "jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-fullscreen jw-fullscreen-ima"
        )[0]
        .click();
      vid.onplay = () => {};
    };

    var first_click = true;

    document.onkeydown = () => {
      if (event.keyCode == 83) {
        vid.currentTime += 85;
      } else if (event.keyCode == 90) {
        vid.currentTime -= 84;
      } else if (event.keyCode == 78) {
        window.parent.location.href = nxt_url;
      } else if (event.keyCode == 32) {
        if (first_click) {
          document.getElementsByTagName("video")[0].click();
          first_click = false;
        }
      }
    };

    var nxt = document.createElement("div");
    nxt.style.position = "fixed";
    nxt.style.padding = "20px";
    nxt.style.width = "150px";
    nxt.style.background = "rgba(0,0,0,0.5)";
    nxt.style.zIndex = 2147483647;
    nxt.style.top = "70%";
    nxt.style.right = "-160px";
    nxt.style.transition = "1s";
    nxt.style.cursor = "pointer";
    nxt.style.color = "#FFF";
    nxt.style.textAlign = "center";
    nxt.innerText = "NEXT EPISODE";
    nxt.onclick = () => {
      window.parent.location.href = nxt_url;
    };
    document.getElementsByClassName("jw-wrapper jw-reset")[0].appendChild(nxt);

    setInterval(() => {
      if (vid.duration - vid.currentTime <= 30 && nxt_url != "") {
        nxt.style.right = "0px";
      }
    }, 1000);
  }, 1000);
})();
