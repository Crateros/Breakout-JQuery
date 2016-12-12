console.log("JQ IS ALIVE");

$( document ).ready(function() {

  //BEGIN LIBRARY CODE
  var x = 75;
  var y = 150;
  //Try math.random dx or dy for more unpredictable results
  var dx = 3.1;
  var dy = 5.7;
  var gameBarHeight = 10;
  var gameBarWidth = 50;
  var gameBarXPosition;
  var WIDTH;
  var HEIGHT;
  var ctx;
  var intervalId = 0;
  var rightKeyDown = false;
  var leftKeyDown = false;

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

    //Move gameBar left on left arrow press
    if (leftKeyDown) {
      if (gameBarXPosition > 0) {
        // console.log(gameBarXPosition);
        gameBarXPosition -= 5;
      }
    }
    else if (rightKeyDown) {
      if (gameBarXPosition < 290) {
        // console.log(gameBarXPosition);
        gameBarXPosition += 5;
      }
    }
    rect(gameBarXPosition, HEIGHT-gameBarHeight - 5, gameBarWidth, gameBarHeight);
    // If x-axis collision
    if (x + dx + Math.PI*2 >= WIDTH || x + dx <= 0 + Math.PI*2){
      dx = -dx;
      //Acceleration on x-axis collision
      dx+= 1;
    }
    if (y + dy <= 0 + Math.PI*2) {
      dy = -dy;
      //Acceleration on y-axis collision
      dy+= 1;
    }
    else if (y > 278 && y < 295 && x > gameBarXPosition && x < (gameBarXPosition + gameBarWidth)) {
      dy = -dy;
    }

    else if (y + dy > HEIGHT) {
      //Ball hit bottom, did not collide with gameBar
      clearInterval(intervalId);
    }
    x += Math.round(dx);
    y += Math.round(dy);
    console.log(y);
  }

  // var rightKeyDown = false;
  // var leftKeyDown = false;

  //Setup left and right arrow keys down press
  function downKeyPress(downPress) {
    //Left press
    if (downPress.keyCode == 37) {
      leftKeyDown = true;
      // console.log(leftKeyDown)
    }
    //Right press
    else if (downPress.keyCode == 39) {
      rightKeyDown = true;
      // console.log(rightKeyDown)
    }
  }
  $(document).keydown(downKeyPress);
  //Setup left and right arrow key press lift off
  function liftKeyPress(liftUp) {
    //Left up
    if (liftUp.keyCode == 37) {
      leftKeyDown = false;
      // console.log(leftKeyDown);
    }
    //Right up
    if (liftUp.keyCode == 39) {
      rightKeyDown = false;
      // console.log(rightKeyDown)
    }
  }
  $(document).keyup(liftKeyPress);


  //Draw new gameBar on downKeyPress


  // Get arrow key IDs
        //  function checkKey(e) {
        //     e = e || window.event;
        //       console.log(e.keyCode);
        //  }
        //
        // document.onkeydown = checkKey;
  // Arrow up is 38
  // Arrow down is 40
  // Arrow left is 37
  // Arrow right is 39
  // Enter is 13
  // Space is 32


  doMotion();
  gameBar();


});
