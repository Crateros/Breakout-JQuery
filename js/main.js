console.log("JQ IS ALIVE");

  var x = 400;
  var y = 225;
  //Try math.random dx or dy for more unpredictable results
  var dx = 3;
  var dy = 3;
  var ballRadius = 7
  var gameBarHeight = 7;
  var gameBarWidth = 75;
  var gameBarXPosition;
  var gameBarColor = "#f4ad42";
  var WIDTH;
  var HEIGHT;
  var ctx;
  var intervalId = 0;
  var canvasMinX = 0;
  var canvasMaxX = 0;
  var brokenBricks = 0;
  var bricks;
  var brickRows;
  var brickColumns;
  var brickWidth;
  var brickHeight;
  var brickSpacing;
  var rowColors = ["#468DF6", "#33A752", "#FF9900", "#ED3737", "#FB3EFF"];
  $("audio")[0].volume = 0.75;

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
  // $(document).keyup(spacebarPress); <-------------

  //Number key 1 to initialize game
  function numOnePress(numPress) {
    if (numPress.keyCode == 49) {
      $("audio")["0"].pause()
      $(document).keyup(spacebarPress);
      $.playSound("sounds/start");
      setTimeout(function() {
        $(".gameBox").children("div").text("");
        firstRender();
        $("#score").css("visibility", "visible");
        $("#spacebarStart").html("Press <span id=\"lookAtMe\">spacebar</span> to start the game");
      }, 1000);
    }
  }
  $(document).keyup(numOnePress);

  //Number key 2 to show score screen
  function numTwoPress(numPress) {
    if (numPress.keyCode == 50) {
      $("#startGame").text("");
      $("#highScores").text("");
      $("#about").text("");
      $("#scoreBox").css("visibility", "visible");
      $("#backButton").css("visibility", "visible");
      getScore();
      $.playSound("sounds/menu");
    }
  }
  $(document).keyup(numTwoPress);

  //If localStorage is empty create new localStorage object <--------------------------
  function ensureStoredScores() {
    if(!localStorage.scores) {
      localStorage.setItem("scores", JSON.stringify([]));
    }
  }

  //Updates high scores from localStorage
  function getScore() {
    console.log("This is get score")
    //Store localStorage scores (strings) as array
    var scoreStrings = JSON.parse(localStorage.scores);
    //Convert scoreStrings to integers
    var scoreNumbers = [];
    for (i = 0; i < scoreStrings.length; i++) {
      scoreNumbers.push(parseInt(scoreStrings[i]))
    }
    //Sort scoreNumbers descending
    scoreNumbers.sort(function(a,b){
      return b-a;
    });
    console.log(scoreNumbers);
    //Iterate through high scores, overwrite non-empty entries with sorted scoreNumbers
    for (i = 0; i < scoreNumbers.length; i++){
      console.log("i", i, "scorevalue", scoreNumbers[i]);
      if(i >= $("#scoreSheet").children().length){
        break;
      }
      $("#score" + (i + 1)).text(scoreNumbers[i]);
    }
  }

  //Number key 3 to show game info
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

  //Mute backButton
  $("#muteButton").click(function(){
    var audioz = $("audio");
    for(var i =0; i < audioz.length; i++) {
      if (audioz[i].currentSrc == "file:///home/donne/Desktop/BreakOut%20JS/music/wind.mp3" || audioz[i].currentSrc == "file:///home/donne/Desktop/BreakOut%20JS/music/mainmenu.mp3") {
        $("#muteButton img").attr("src", "img/mute2.png");
        audioz[i].pause();
      }
    }
  });

  //Draw first frame
    function firstRender() {
      ctx = $('#canvas')[0].getContext("2d");
      WIDTH = $("#canvas").width();
      HEIGHT = $("#canvas").height();
      gameBarXPosition = WIDTH / 2;
      canvasMinX = $("#canvas").offset().left;
      canvasMaxX = canvasMinX + WIDTH;
      setTimeout(drawShapes, 20);
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
    intervalId = setInterval(drawShapes, 20);
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

  //Score game
  function scoreGame(row) {
    var score = parseInt($("#currentScore").text());
      if (rowColors[row] === "#468DF6") {
        score += 250;
      }
      else if (rowColors[row] === "#33A752") {
        score += 200;
      }
      else if (rowColors[row] === "#FF9900") {
        score += 150;
      }
      else if (rowColors[row] === "#ED3737") {
        score += 100;
      }
      else if (rowColors[row] === "#FB3EFF") {
        score += 50;
      }
    $("#currentScore").text(score);
  }

  //Draw shapes and feed to doMotion
  function drawShapes() {
    clear();
    circle(x, y, ballRadius);
    //Move gameBar left on left arrow press
    if (leftKeyDown) {
      if (gameBarXPosition > 0) {
        // console.log(gameBarXPosition);
        gameBarXPosition -= 10;
      }
    }
    else if (rightKeyDown) {
      if (gameBarXPosition < 575) {
        // console.log(gameBarXPosition);
        gameBarXPosition += 10;
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
      if (dy <= -1 && dy >= -9) {
        dy -= 1;
      }
      else if (dy >= 1 && dy <= 9) {
        dy += 1;
      }
      bricks[row][col] = 0;
      brokenBricks ++;
      console.log(brokenBricks);
      scoreGame(row);
      $.playSound("sounds/BoopBrick");
      if (brokenBricks >= 25) {
        clearInterval(intervalId);
        if ($("#currentScore").text() != "0") {
          var tempArray = JSON.parse(localStorage.scores);
          tempArray.push($("#currentScore").text());
          localStorage.setItem("scores", JSON.stringify(tempArray));
        }
      getScore();
      console.log("you won!");
      var audioz = $("audio");
        for(var i =0; i < audioz.length; i++) {
          if (audioz[i].currentSrc == "file:///home/donne/Desktop/BreakOut%20JS/music/wind.mp3") {
            audioz[i].pause();
          }
        }
      setTimeout(function() {
          $.playSound("music/gameover");
          $("#youWin").addClass("animated");
          $("#youWin").addClass("fadeIn");
          $("#youWin").css("visibility", "visible");
        }, 2000);
      }
    }
    //x-axis LEFT & RIGHT collision
    if (x + dx + ballRadius > WIDTH || x + dx - ballRadius < 0){
      dx = -dx;
      $.playSound("sounds/BoopWall");
      // Acceleration on x-axis collision
      if (dx <= -1 && dx >= -9) {
        dx -= 1;
      }
      else if (dy >= 1 && dy <= 9) {
        dx += 1;
      }
    }
    //y-axis TOP collision
    if (y + dy - ballRadius < 0) {
      dy = -dy;
      $.playSound("sounds/BoopWall");
      // Acceleration on y-axis collision
      if (dy <= 9) {
        dy += 1;
      }
    }
    //gameBar collision
    else if (y + dy + ballRadius > HEIGHT - gameBarHeight) {
      if (x > gameBarXPosition && x <gameBarXPosition + gameBarWidth) {
        //Alter dx based on collision position with gameBar
        dx = 8 * ((x-(gameBarXPosition+gameBarWidth/2))/gameBarWidth);
        dy = -dy;
        $.playSound("sounds/BoopBar");
      }
      else if (y > HEIGHT) {
      //Ball hit bottom, did not collide with gameBar
        clearInterval(intervalId);
        if ($("#currentScore").text() != "0") {
          var tempArray = JSON.parse(localStorage.scores);
          tempArray.push($("#currentScore").text());
          localStorage.setItem("scores", JSON.stringify(tempArray));
        }
        getScore();
        var audioz = $("audio");
        for(var i =0; i < audioz.length; i++) {
          if (audioz[i].currentSrc == "file:///home/donne/Desktop/BreakOut%20JS/music/wind.mp3") {
            audioz[i].pause()
          }
        }
        $.playSound("sounds/death");
        setTimeout(function() {
          $.playSound("music/gameover");
          $("#gameOver").addClass("animated");
          $("#gameOver").addClass("fadeIn");
          $("#gameOver").css("visibility", "visible");
        }, 2000);
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
  ensureStoredScores();
  getScore();


//push to local storage, use local storage to populate array via push
