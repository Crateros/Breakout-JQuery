console.log("JQ IS ALIVE");

$( document ).ready(function() {

  //BEGIN LIBRARY CODE
  var x = 150;
  var y = 280;
  var dx = 2;
  var dy = 4;
  var gameBarHeight = 5;
  var gameBarWidth = 90;
  var gameBarXPosition;
  var WIDTH;
  var HEIGHT;
  var ctx;
  var intervalId = 0;

  function doMotion() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    gameBarXPosition = WIDTH / 2;
    intervalId = setInterval(drawShapes, 50);
  }

  function circle(x,y,r) {
    ctx.fillStyle =  "#00A308";
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

  //END LIBRARY CODE

  function gameBar() {
    gameBarX = WIDTH / 2;
  }

  function drawShapes() {
    clear();
    circle(x, y, 10);
    rect(gameBarXPosition, HEIGHT-gameBarHeight - 5, gameBarWidth, gameBarHeight);
    // If x-axis collision
    if (x + dx > WIDTH || x + dx < 0){
      dx = -dx;
      dx++;
    }
    if (y + dy < 0) {
      dy = -dy;
      dy++;
    }
    else if (y + dy > HEIGHT) {
      if (x > gameBarXPosition && x < gameBarXPosition + gameBarWidth) {
        dy = -dy;
      }
      else {
        //Ball hit bottom, did not collide with gameBar
        clearInterval(intervalId);
      }
    }
    x += dx;
    y += dy;
  }

  var rightKeyDown = false;
  var leftKeyDown = false;

  //Setup left and right arrow keys down press
  function downKeyPress(downPress) {
    //Left press
    if (downPress.keyCode === 37) {
      leftKeyDown = true;
      console.log(leftKeyDown)
    }
    //Right press
    else if (downPress.keyCode === 39) {
      rightKeyDown = true;
      console.log(rightKeyDown)
    }
  }
  $(document).keydown(downKeyPress);
  //Setup left and right arrow key press lift off
  function liftKeyPress(liftUp) {
    //Left up
    if (liftUp.keyCode == 37) {
      leftKeyDown = false;
      console.log(leftKeyDown);
    }
    //Right up
    if (liftUp.keyCode == 39) {
      rightKeyDown = false;
      console.log(rightKeyDown)
    }
  }
  $(document).keyup(liftKeyPress);
  //Get arrow key IDs
  //        function checkKey(e) {
  //           e = e || window.event;
  //             console.log(e.keyCode);
  //        }
  //
  //       document.onkeydown = checkKey;
  //Arrow up is 38
  //Arrow down is 40
  //Arrow left is 37
  //Arrow right is 39





  doMotion();
  gameBar();


});
