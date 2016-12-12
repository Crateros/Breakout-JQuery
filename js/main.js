console.log("JQ IS ALIVE");

$( document ).ready(function() {

  var x = 25;
  var y = 250;
  //Try math.random dx or dy for more unpredictable results
  var dx = 1.5;
  var dy = -4;
  var gameBarHeight = 7;
  var gameBarWidth = 75;
  var gameBarXPosition;
  var WIDTH;
  var HEIGHT;
  var ctx;
  var intervalId = 0;
  var rightKeyDown = false;
  var leftKeyDown = false;
  var canvasMinX = 0;
  var canvasMaxX = 0;
  var bricks;
  var brickRows;
  var brickColumns;
  var brickWidth;
  var brickHeight;
  var brickSpacing;


  function doMotion() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    gameBarXPosition = WIDTH / 2;
    canvasMinX = $("#canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
    intervalId = setInterval(drawShapes, 50);
  }

  function bricks() {
    brickRows = 5
    brickColumns = 5
    brickWidth = (WIDTH / brickColumns) - 1;
    brickHeight = 15;
    brickSpacing = 1;
    bricks = new Array(brickRows);
    for (i = 0; i < brickRows.length; i++){
      bricks[i] = new Array(brickColumns);
      for (u= 0; u < brickColumns.length; u++){
        bricks[i][u] = 1;
      }
    }
  }

  function circle(x,y,r) {
    ctx.fillStyle =  "#00A308";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  function rect(x,y,w,h) {
    ctx.fillStyle =  "#f4ad42";
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
  }

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function gameBar() {
    gameBarX = WIDTH / 2;
  }

  function drawShapes() {
    clear();
    circle(x, y, 6);

    //Make gameBar responsive to mouse input
    function gameMouse() {
      canvasMinX = $("#canvas").offset().left;
      canvasMaxX = canvasMinX + WIDTH;
    }

    function onMouseMove(evt) {
      if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX - gameBarWidth) {
        gameBarXPosition = evt.pageX - canvasMinX;
      }
    }

    $(document).mousemove(onMouseMove);

    //Move gameBar left on left arrow press
    if (leftKeyDown) {
      if (gameBarXPosition > 0) {
        // console.log(gameBarXPosition);
        gameBarXPosition -= 10;
      }
    }
    else if (rightKeyDown) {
      if (gameBarXPosition < 225) {
        // console.log(gameBarXPosition);
        gameBarXPosition += 10;
      }
    }
    rect(gameBarXPosition, HEIGHT-gameBarHeight - 5, gameBarWidth, gameBarHeight);
    //Draw blocks for breaking
    for (i = 0; i < brickRows.length; i++){
      for (u = 0; u < brickColumns.length; u++){
        if (bricks[i][u] == 1) {
          rect((u * (brickWidth + brickSpacing)) + brickSpacing, (i * (brickHeight + brickSpacing)) + brickSpacing, brickWidth, brickHeight);
        }
      }
    }
    //Brick collision detection
    var rowHeight = brickHeight + brickSpacing;
    var columnWidth = brickWidth + brickSpacing;
    var row = Math.floor(y/rowHeight);
    var col = Math.floor(x/columnWidth);
    if (y < brickRows * rowHeight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
      dy = -dy;
      bricks[row][col] = 0;
    }
    // If x-axis collision
    if (x + dx + Math.PI*2 >= WIDTH || x + dx <= 0 + Math.PI*2){
      dx = -dx;
      //Acceleration on x-axis collision
      // if (dx <= 35) {
        // dx+= 3;
        // }
      }
      if (y + dy <= 0 + Math.PI*2) {
        dy = -dy;
        //Acceleration on y-axis collision
        if (dy <= 15) {
          dy+= 2;
        }
      }
    else if (y > 278 && y < 290 && x > gameBarXPosition && x < (gameBarXPosition + gameBarWidth)) {
      dy = -dy;
    }

    else if (y + dy > HEIGHT) {
      //Ball hit bottom, did not collide with gameBar
      clearInterval(intervalId);
    }
    x += Math.round(dx);
    y += Math.round(dy);
    // console.log(y);
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
  bricks();

});

gameMouse();
