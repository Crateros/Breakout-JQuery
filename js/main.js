console.log("JQ IS ALIVE");

  var x = 25;
  var y = 250;
  //Try math.random dx or dy for more unpredictable results
  var dx = 1.5;
  var dy = -1;
  var ballRadius = 7
  var gameBarHeight = 7;
  var gameBarWidth = 75;
  var gameBarXPosition;
  var gameBarColor = "#f4ad42";
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
  var rowColors = ["#468DF6", "#33A752", "#FF9900", "#ED3737", "#FB3EFF"];
  var brickColumns;
  var brickWidth;
  var brickHeight;
  var brickSpacing;

  //Draw a circle
  function circle(x,y,r) {
    ctx.fillStyle =  "#FFFFFF";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  //Draw a rectangle
  function rect(x,y,w,h) {
    // ctx.fillStyle =  "#f4ad42";
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
  }

  //Delete a rectangle
  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  //KeyDown event
  function downKeyPress(downPress) {
    //Arrow Left press
    if (downPress.keyCode == 37) {
      leftKeyDown = true;
    }
    //Arrow Right press
    else if (downPress.keyCode == 39) {
      rightKeyDown = true;
    }
  }
  $(document).keydown(downKeyPress);

  //KeyUp event
  function liftKeyPress(liftUp) {
    //Arrow Left up
    if (liftUp.keyCode == 37) {
      leftKeyDown = false;
    }
    //Arrow Right up
    if (liftUp.keyCode == 39) {
      rightKeyDown = false;
    }
  }
  $(document).keyup(liftKeyPress);

  //Mouse support when mouseover canvas element
  function onMouseMove(evt) {
    if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX - gameBarWidth) {
      gameBarXPosition = evt.pageX - canvasMinX;
    }
  }
  $(document).mousemove(onMouseMove);

  //Animate shapes on interval
  function doMotion() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    gameBarXPosition = WIDTH / 2;
    canvasMinX = $("#canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
    intervalId = setInterval(drawShapes, 10);
  }

  //Create bricks array
  function gameBricks() {
    brickRows = 5
    brickColumns = 5
    brickWidth = (WIDTH / brickColumns) - 1;
    brickHeight = 15;
    brickSpacing = 1;
    bricks = new Array(brickRows);
    for (var i = 0; i < brickRows; i++){
      bricks[i] = new Array(brickColumns);
      for (var u = 0; u < brickColumns; u++){
        bricks[i][u] = 1;
      }
    }
  }

  //Draw shapes and feed to doMotion
  function drawShapes() {
    clear();
    circle(x, y, ballRadius);
    //Move gameBar left on left arrow press
    if (leftKeyDown) {
      if (gameBarXPosition > 0) {
        // console.log(gameBarXPosition);
        gameBarXPosition -= 5;
      }
    }
    else if (rightKeyDown) {
      if (gameBarXPosition < 225) {
        // console.log(gameBarXPosition);
        gameBarXPosition += 5;
      }
    }
    ctx.fillStyle = gameBarColor;
    rect(gameBarXPosition, HEIGHT-gameBarHeight - 5, gameBarWidth, gameBarHeight);

    //Draw from bricks array
    for (var i = 0; i < brickRows; i++){
      ctx.fillStyle = rowColors[i];
      for (var u = 0; u < brickColumns; u++){
        if (bricks[i][u] == 1) {
          rect((u * (brickWidth + brickSpacing)) + brickSpacing, (i * (brickHeight + brickSpacing)) + brickSpacing, brickWidth, brickHeight);
        }
      }
    }
    var rowHeight = brickHeight + brickSpacing;
    var columnWidth = brickWidth + brickSpacing;
    var row = Math.floor(y/rowHeight);
    var col = Math.floor(x/columnWidth);
    //Brick collision detection
    if (y < brickRows * rowHeight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
      dy = -dy;
      bricks[row][col] = 0;
    }
    //x-axis LEFT & RIGHT collision
    if (x + dx + ballRadius > WIDTH || x + dx - ballRadius < 0){
      dx = -dx;
      //Acceleration on x-axis collision
      // if (dx <= 35) {
        // dx+= 3;
        // }
      }
    //y-axis TOP collision
    if (y + dy - ballRadius < 0) {
      dy = -dy;
      //Acceleration on y-axis collision
      // if (dy <= 15) {
      //   dy+= 2;
      // }
    }
    //gameBar collision
    else if (y + dy + ballRadius > HEIGHT - gameBarHeight) {
      if (x > gameBarXPosition && x <gameBarXPosition + gameBarWidth) {
        //Alter dx based on collision position with gameBar
        dx = 5 * ((x-(gameBarXPosition+gameBarWidth/2))/gameBarWidth);
        dy = -dy;
      }
      else if (y > HEIGHT) {
      //Ball hit bottom, did not collide with gameBar
        clearInterval(intervalId);
      }
    }
    x += dx;
    y += dy;
  }

  doMotion();
  gameBricks();



  // function gameBar() {
  //   gameBarX = WIDTH / 2;
  // }


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
