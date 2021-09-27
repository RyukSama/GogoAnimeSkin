// ==UserScript==
// @name         Video Player Wrapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @match        https://gogoanime.pe/*episode*
// @icon         https://www.google.com/s2/favicons?domain=gogoanime.pe
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  var nxt = document.getElementsByClassName("anime_video_body_episodes_r")[0];
  var url = "";
  try {
    url = nxt.firstElementChild.href;
  } catch {}

  var ifram = document.getElementsByTagName("iframe")[0];
  ifram.onload = () => {
    ifram.contentWindow.postMessage(url, "*");
  };

  ifram.style.position = "fixed";
  ifram.style.maxHeight = "80%";
  ifram.style.maxWidth = "80%";
  ifram.style.top = "50%";
  ifram.style.left = "50%";
  ifram.style.transform = "translate(-50%, -50%)";
  ifram.style.zIndex = 100001;
  document.body.style.overflow = "hidden";

  var x = document.createElement("div");
  x.style.position = "fixed";
  x.style.background = "#000";
  x.style.height = "100%";
  x.style.width = "100%";
  x.style.top = "0";
  x.style.left = "0";
  x.style.zIndex = 100000;
  document.body.appendChild(x);

  var logo = document.createElement("img");
  logo.style.position = "fixed";
  logo.style.height = "50px";
  logo.style.top = "15px";
  logo.style.left = "50%";
  logo.style.zIndex = 100002;
  logo.style.transform = "translate(-50%, 0%)";
  logo.src =
    "https://fontmeme.com/permalink/210922/eb7793d11e15ae1d6b588e5b19df2988.png";
  logo.onclick = () => {
    location.href = "https://gogoanime.pe/popular.html";
  };
  document.body.appendChild(logo);

  ifram.focus();

  var name =
    document.getElementsByClassName("anime-info")[0].children[1].innerText;
  var ep =
    document.getElementsByClassName("active")[2].firstElementChild.innerText;

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  setCookie(
    name
      .toLowerCase()
      .replace(/[^ 0-9a-z]/gi, "")
      .replace(/ /gi, "-"),
    ep,
    365
  );
  var animes = getCookie("animes") || "[]";

  animes = JSON.parse(animes);

  if (animes.findIndex((x) => x.name == name) == -1) {
    fetch(
      "https://gogoanime.pe/category/" +
        name
          .toLowerCase()
          .replace(/[^ 0-9a-z]/gi, "")
          .replace(/ /gi, "-")
    ).then(async (x) => {
      var y = await x.text();
      var z = document.createElement("html");
      z.innerHTML = y;
      var poster =
        z.getElementsByClassName("anime_info_body_bg")[0].firstElementChild.src;
      animes.push({ name: name, img: poster });
      setCookie("animes", JSON.stringify(animes.slice(-5)), 365);
    });
  }
})();
