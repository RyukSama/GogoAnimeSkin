// ==UserScript==
// @name         Home and Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @match        https://gogoanime.pe/popular.html*
// @match        https://gogoanime.pe/search.html*
// @icon         https://www.google.com/s2/favicons?domain=gogoanime.pe
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  var style = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');

body {
  background: #000;
  padding: 0px;
  margin: 0px;
  overflow-x: hidden;
  font-size: x-large;
  font-family: 'Bangers', cursive;
}

body::-webkit-scrollbar {
  display: none;
}

@keyframes pan {
  0%   {top: 0px;}
  50%  {top: -225px;}
  100% {top: 0px;}
}

.card {
  display: inline-block;
  position: relative;
  height: 200px;
  width: 300px;
  margin-bottom: -4px;
  overflow: hidden;
}

.port-img {
  width: 300px;
  position: absolute;
  left: 0px;
  animation: pan 60s infinite;
  animation-timing-function: linear;
}

.name {
  position: absolute;
  color: white;
  bottom: 10px;
  left: 10px;
  float: left;
  width: 200px;
  transition: 0.12s;
  transform-origin: bottom left;
}

.card:hover .name{
  transform: scale(1.25);
}

.container {
  transform-origin: top left;
}

.ovrlay {
  background: linear-gradient(45deg, black, transparent);
  height:100%;
  width: 100%;
  position: absolute;
}

.navbar {
  height: 100px;
  width: 100%;
}

.logo {
  height: 50px;
  margin-left: 25px;
  margin-top: 25px;
}

#srch {
  background: #111;
  padding: 15px;
  width: 50vw;
  border: none;
  color: white;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
}

button {
  background: #000;
  border: none;
  padding: 10px;
  color: #999;
  transition: 0.25s;
  cursor: pointer;
}

button:hover {
  color: white;
}

#nxt {
  position: absolute;
  top: 50px;
  right: 25px;
  transform: translate(0, -50%);
}

#prv {
  position: absolute;
  top: 50px;
  right: 100px;
  transform: translate(0, -50%);
}
</style>
`;

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

  var animes = getCookie("animes") || "[]";

  animes = JSON.parse(animes).reverse();

  var c = [];
  if (location.href == "https://gogoanime.pe/popular.html")
    animes.forEach((x) => {
      c.push({
        name: x.name,
        url:
          "https://gogoanime.pe/category/" +
          x.name
            .toLowerCase()
            .replace(/[^ 0-9a-z]/gi, "")
            .replace(/ /gi, "-"),
        img: x.img,
      });
    });

  var cards = [].slice
    .call(document.getElementsByTagName("li"))
    .filter((x) => x.className == "" && x.childElementCount == 3)
    .map((x) => {
      return {
        img: x.children[0].children[0].children[0].src,
        url: x.children[0].children[0].href,
        name: x.children[1].children[0].innerText.trim(),
      };
    });

  c.push(...cards);
  cards = c;

  document.body.innerHTML = "";
  document.head.innerHTML =
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    style;

  var nav = document.createElement("div");
  nav.className = "navbar";
  document.body.appendChild(nav);

  var logo = document.createElement("img");
  logo.className = "logo";
  logo.src =
    "https://fontmeme.com/permalink/210922/eb7793d11e15ae1d6b588e5b19df2988.png";
  logo.onclick = () => {
    location.href = "https://gogoanime.pe/popular.html";
  };
  nav.appendChild(logo);

  var search = document.createElement("input");
  search.id = "srch";
  search.type = "text";
  search.placeholder = "Search...";
  search.onkeydown = () => {
    if (event.keyCode == 13) {
      location.href =
        "https://gogoanime.pe/search.html?keyword=" + search.value;
    }
  };
  nav.appendChild(search);

  if (
    Number(location.href.split("?page=")[1]) &&
    Number(location.href.split("?page=")[1]) != 1
  ) {
    var prv = document.createElement("button");
    prv.id = "prv";
    prv.innerText = "PREV";
    prv.onclick = () => {
      var num = Number(location.href.split("?page=")[1]) || 1;
      location.href = "https://gogoanime.pe/popular.html?page=" + (num - 1);
    };
    nav.appendChild(prv);
  }

  if (cards.length >= 20) {
    var nxt = document.createElement("button");
    nxt.id = "nxt";
    nxt.innerText = "NEXT";
    nxt.onclick = () => {
      var num = Number(location.href.split("?page=")[1]) || 1;
      location.href = "https://gogoanime.pe/popular.html?page=" + (num + 1);
    };
    nav.appendChild(nxt);
  }

  var contain = document.createElement("div");
  contain.className = "container";
  document.body.appendChild(contain);

  var scale =
    window.innerWidth / (window.innerWidth - (window.innerWidth % 300));
  contain.style.transform = "scale(" + scale + ")";

  cards.forEach((x) => {
    var a = document.createElement("a");
    a.className = "card";
    a.href = x.url;
    var img = document.createElement("img");
    img.className = "port-img";
    img.src = x.img;
    a.appendChild(img);
    var ovr = document.createElement("div");
    ovr.className = "ovrlay";
    a.appendChild(ovr);
    var name = document.createElement("div");
    name.className = "name";
    name.innerText = x.name;
    a.appendChild(name);
    contain.appendChild(a);
  });
  search.focus();
})();
