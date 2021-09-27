// ==UserScript==
// @name         Homepage Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gogoanime.pe/
// @icon         https://www.google.com/s2/favicons?domain=gogoanime.pe
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";
  location.href = "https://gogoanime.pe/popular.html";
})();
