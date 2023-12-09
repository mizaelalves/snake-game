// Define html elements
$(function () {
  const board = $("#game-board")
  const instructionText = $('#instruction-text')
  const logo = $('#logo')
  const score = $('#score')
  const highScoreText = $('#highScore')
  const instruction = $('.instructions')
  // Define game Variables
  const gridSize = 20
  let snake = [{ x: 10, y: 10 }]
  let food = generateFoodPosition()
  let direction = 'right'
  let highScore = 0
  let gameInterval;
  let gameSpeedDelay = 200
  let gameStarted = false

  // draw game map, snake, food
  function draw() {
    board.html('');

    if (gameStarted) {
      drawSnake();
      drawFood();
    }

    updateScore()
  }

  //Draw snake
  function drawSnake() {
    snake.forEach((segment) => {
      const snakeElement = createGameElement('<div>', 'snake')
      setPosition(snakeElement, segment)
      board.append(snakeElement)
    });
  }

  // Create a snake or food cube/div
  function createGameElement(tag, classElement) {
    const element = $(tag)
    element.addClass(classElement)
    return element
  }

  // Set the position of snake of food

  function setPosition(element, position) {
    element.css('grid-column', position.x)
    element.css('grid-row', position.y)
  }

  // Testing draw function
  //draw()
  // Draw food function
  function drawFood() {
    const foodElement = $('<div>').addClass('food')

    setPosition(foodElement, food)
    board.append(foodElement)
  }

  function generateFoodPosition() {
    const x = Math.floor(Math.random() * gridSize) + 1
    const y = Math.floor(Math.random() * gridSize) + 1
    console.log(x, y)
    return { x, y }
  }

  // Moving the snake
  function move() {
    const head = { ...snake[0] }
    switch (direction) {
      case 'up':
        head.y--
        break;

      case 'down':
        head.y++
        break;

      case 'right':
        head.x++
        break;

      case 'left':
        head.x--
        break;

    }
    snake.unshift(head)


    if (head.x === food.x & head.y === food.y) {
      food = generateFoodPosition()
      incresseSpeed()
      clearInterval(gameInterval) // Clear past interval
      gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
      }, gameSpeedDelay)
    } else {
      snake.pop()
    }
  }


  //Test moving

  // setInterval(()=>{
  //   move()
  //   draw()
  // }, 200)

  // Start game function
  function startGame() {
    gameStarted = true // Keedp track of a running game

    instruction.css('display', 'none')
    board.css('display', 'grid')
    gameInterval = setInterval(() => {
      move()
      checkCollision()
      draw()
    }, gameSpeedDelay)
  }

  // keypress event listener
  $('body').on('keydown key touchstart', function (event) {
    // Verifique se a tecla de espaço foi pressionada (para cliques)
    if (!gameStarted && event.keyCode === 32) {
      // Ação a ser realizada quando o clique ocorre (botão esquerdo do mouse)
      console.log('Cliquei no board!');
      // Chame sua função aqui

      startGame()
    }

    // Para toques em dispositivos móveis
    if (!gameStarted && event.type === 'touchstart') {
      // Ação a ser realizada quando o board é tocado
      console.log('Tocou no board!');
      // Chame sua função aqui
      startGame()
    } else {
      switch (event.key) {
        case 'ArrowUp':
          direction = 'up'
          break
        case 'ArrowDown':
          direction = 'down'
          break
        case 'ArrowRight':
          direction = 'right'
          break
        case 'ArrowLeft':
          direction = 'left'
          break
      }

    }
  });
  $('.up').on("click", function () {
    direction = 'up'
  });
  $('.down').on("click", function () {
    direction = 'down'
  });
  $('.right').on("click", function () {
    direction = 'right'
  });
  $('.left').on("click", function () {
    direction = 'left'
  });

  function incresseSpeed() {
    if (gameSpeedDelay > 150) {
      gameSpeedDelay -= 5
    } else if (gameSpeedDelay > 100) {
      gameSpeedDelay -= 3
    }
  }
  function checkCollision() {
    const head = snake[0]

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
      resetGame()
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        resetGame()
      }
    }
  }
  function resetGame() {
    updateHighScore()
    stopGame()
    snake = [{ x: 10, y: 10 }]
    food = generateFoodPosition();
    direction = 'right'
    gameSpeedDelay = 200
    clearInterval(gameInterval) // Clear past interval
    updateScore()
  }

  function updateScore() {
    const currentScore = snake.length - 1;
    score.text(currentScore.toString().padStart(3, '0'))
  }
  function stopGame() {
    clearInterval(gameInterval) // Clear past interval
    gameStarted = false
    instruction.css('display', 'flex')
    board.css('display', 'none')
  }

  function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
      highScore = currentScore
      console.log(currentScore)
      highScoreText.text(highScore.toString().padStart(3, '0'))
    }
    highScoreText.css('display', 'block')
  }
});