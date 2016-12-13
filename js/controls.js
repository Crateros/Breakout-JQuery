var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var ctx;
var WIDTH;
var HEIGHT;

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function doMotion() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $("#canvas").width()
  HEIGHT = $("#canvas").height()
  return setInterval(drawShapes, 10);
}
