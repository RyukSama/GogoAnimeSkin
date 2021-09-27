// ==UserScript==
// @name         Series Home
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @match        https://gogoanime.pe/category/*
// @icon         https://www.google.com/s2/favicons?domain=gogoanime.pe
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  var style = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap');

body {
  background: #000;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
  font-size: x-large;
  font-family: 'Bangers', cursive;
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

.poster {
  max-width: 40vw;
  height: calc(95vh - 100px);
  max-height: 60vw;
  position:absolute;
  left: 25%;
  top: 100px;
  transform: translate(-50%, 0);
}

.summary {
  top: 125px;
  left: 50%;
  position: absolute;
  margin: 0;
  height:calc(100% - 150px);
  overflow-y:scroll;
}

.summary::-webkit-scrollbar {
  display: none;
}

h1 {
  max-width: 40vw;
  color: white;
  margin: 0;
  font-weight: normal;
}

p {
  max-width: 40vw;
  max-height: 25vh;
  color: white;
  margin: 0;
  font-family: 'Verdana';
  font-size: small;
  text-align: justify;
  overflow-y: scroll;
}

p::-webkit-scrollbar {
  display: none;
}

.episodes {
  color: white;
  margin-top: 20px;
  max-width: 40vw;
  text-align:center;
}

.episode {
  background: #111;
  padding: 10px;
  display: inline-block;
  margin: 10px;
  width: 65px;
  text-align: center;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: large;
}

.toview {
  background: #E50914;
}
</style>`;

  var poster =
    document.getElementsByClassName("anime_info_body_bg")[0].firstElementChild
      .src;
  var name =
    document.getElementsByClassName("anime_info_body_bg")[0].children[1]
      .innerText;
  var summ = document
    .getElementsByClassName("anime_info_body_bg")[0]
    .children[4].innerText.substr(14);
  var status =
    document.getElementsByClassName("anime_info_body_bg")[0].children[7]
      .innerText;

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

  var last_seen = getCookie(
    name
      .toLowerCase()
      .replace(/[^ 0-9a-z]/gi, "")
      .replace(/ /gi, "-")
  );

  console.log(last_seen);

  var eps = [];
  var lists = [].slice
    .call(
      document
        .getElementsByClassName("anime_video_body")[0]
        .getElementsByTagName("li")
    )
    .filter((x) => x.firstElementChild.href.substr(-1) == "#");
  for (let x of lists) {
    console.log(x);
    x.firstElementChild.click();
    var li = [].slice
      .call(
        document
          .getElementsByClassName("anime_video_body")[0]
          .getElementsByTagName("li")
      )
      .filter((x) => x.firstElementChild.href.substr(-1) != "#")
      .map((x) => {
        return {
          url: x.firstElementChild.href.slice(),
          name: x.firstElementChild.firstElementChild.innerText.slice(),
        };
      })
      .reverse();
    eps.push(...li);
  }

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

  var img = document.createElement("img");
  img.className = "poster";
  img.src = poster;
  document.body.appendChild(img);

  var div = document.createElement("div");
  div.className = "summary";
  document.body.appendChild(div);

  var nm = document.createElement("h1");
  nm.innerText = name;
  div.appendChild(nm);

  var sum = document.createElement("p");
  sum.innerText = summ;
  div.appendChild(sum);

  var episodes = document.createElement("div");
  episodes.className = "episodes";
  div.appendChild(episodes);

  eps.forEach((x) => {
    var episode = document.createElement("div");
    if (x.name == last_seen) episode.className = "episode toview";
    else episode.className = "episode";
    episode.innerText = x.name;
    episode.onclick = () => {
      location.href = x.url;
    };
    episodes.appendChild(episode);
  });

  if (last_seen == "") episodes.firstElementChild.className += " toview";
})();
