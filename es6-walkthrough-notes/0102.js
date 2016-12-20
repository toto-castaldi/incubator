"use strict";

for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log("hello var " + i);
  },100);
}

for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log("hello let " + i);
  },100);
}
