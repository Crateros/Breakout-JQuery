console.log("JQ IS ALIVE");

  var x = 200;
  var y = 350;
  //Try math.random dx or dy for more unpredictable results
  var dx = 3;
  var dy = 1;
  var ballRadius = 7
  var gameBarHeight = 7;
  var gameBarWidth = 75;
  var gameBarXPosition;
  var gameBarColor = "#f4ad42";
  var WIDTH;
  var HEIGHT;
  var ctx;
  var beginInterval = 0;
  var intervalId = 0;
  var spacebar = false;
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

  var rightKeyDown;
  var leftKeyDown;
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

  //Spacebar to start game
  var pauseState =  true;
  function spacebarPress(evt) {
		if(evt.keyCode == 32) {
      $("#spacebarStart").text("");
      pauseState = false;
      doMotion();
      $.playSound("music/wind");
		}
    console.log("Pause: ", pauseState);
	}
  $(document).keyup(spacebarPress);

  //Number key 1 to initialize game
  function numOnePress(numPress) {
    if (numPress.keyCode == 49) {
      $(".gameBox").children("div").text("");
      firstRender();
      $("#spacebarStart").html("Press <span id=\"lookAtMe\">spacebar</span> to start the game");
      $("audio")["0"].pause()
      $.playSound("sounds/start");
    }
  }
  $(document).keyup(numOnePress);

  //Number 2 to show score screen
  function numTwoPress(numPress) {
    if (numPress.keyCode == 50) {
      $("#startGame").text("");
      $("#highScores").text("");
      $("#about").text("");
      $("#scoreBox").css("visibility", "visible");
      $("#backButton").css("visibility", "visible");
      $.playSound("sounds/menu");
    }
  }
  $(document).keyup(numTwoPress);

  function numThreePress(numPress) {
    if (numPress.keyCode == 51) {
      $("#startGame").text("");
      $("#highScores").text("");
      $("#about").text("");
      $("#breakoutInfo").css("visibility", "visible")
      $("#backButton").css("visibility", "visible");
      $.playSound("sounds/menu");
    }
  }
  $(document).keyup(numThreePress);

  //Back button to traverse menu
  $("#backButton").click(function() {
    console.log("clicked!");
      $("#jquery").text("JQuery");
      $("#bigTitle").text("BREAKOUT");
      $("#startGame").text("[1] New Game");
      $("#highScores").text("[2] High Scores");
      $("#about").text("[3] About Breakout");
      $("#scoreBox").css("visibility", "hidden");
      $("#backButton").css("visibility", "hidden");
      $("#breakoutInfo").css("visibility", "hidden");
      $.playSound("sounds/menu");
  });






  //Draw first frame
    function firstRender() {
      ctx = $('#canvas')[0].getContext("2d");
      WIDTH = $("#canvas").width();
      HEIGHT = $("#canvas").height();
      gameBarXPosition = WIDTH / 2;
      canvasMinX = $("#canvas").offset().left;
      canvasMaxX = canvasMinX + WIDTH;
      setTimeout(drawShapes, 10);
    }

  //Animate shapes on interval
  function doMotion() {
    if (!pauseState) {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    gameBarXPosition = WIDTH / 2;
    canvasMinX = $("#canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
    // beginInterval = setTimeout(drawShapes, 40);
    intervalId = setInterval(drawShapes, 10);
    drawShapes();
    }
  }

  //Create bricks array
  function gameBricks() {
    brickRows = 5
    brickColumns = 5
    brickWidth = (650 / brickColumns) - 5;
    brickHeight = 15;
    brickSpacing = 5;
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
      if (gameBarXPosition < 575) {
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
      if (dy <= -1 && dy >= -7) {
        dy -= 0.5;
      }
      else if (dy >= 1 && dy <= 7) {
        dy += 0.5;
      }
      bricks[row][col] = 0;
    }
    //x-axis LEFT & RIGHT collision
    if (x + dx + ballRadius > WIDTH || x + dx - ballRadius < 0){
      dx = -dx;
      // Acceleration on x-axis collision
      if (dx <= -1 && dx >= -7) {
        dx -= 0.5;
      }
      else if (dy >= 1 && dy <= 7) {
        dx += 0.5;
      }
    }
    //y-axis TOP collision
    if (y + dy - ballRadius < 0) {
      dy = -dy;
      // Acceleration on y-axis collision
      if (dy <= 7) {
        dy += 0.5;
      }
    }
    //gameBar collision
    else if (y + dy + ballRadius > HEIGHT - gameBarHeight) {
      if (x > gameBarXPosition && x <gameBarXPosition + gameBarWidth) {
        //Alter dx based on collision position with gameBar
        dx = 7 * ((x-(gameBarXPosition+gameBarWidth/2))/gameBarWidth);
        dy = -dy;
      }
      else if (y > HEIGHT) {
      //Ball hit bottom, did not collide with gameBar
        clearInterval(intervalId);
        var audioz = $("audio");
        for(var i =0; i < audioz.length; i++) {
          if (audioz[i].currentSrc == "file:///home/donne/Desktop/BreakOut%20JS/music/wind.mp3") {
            audioz[i].pause()
          }
        }
        $.playSound("sounds/death");
      }
    }
    x += dx;
    y += dy;
    // console.log("dx: ", dx);
    // console.log("dy: ", dy);
  }

  // var gameMusic = $('<embed autoplay="true" height="0" width="0" />');
  // sound.attr('src', "../music/wind.mp3");
  // $('body').append(sound);

  gameBricks();
