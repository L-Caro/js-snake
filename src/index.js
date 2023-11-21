import "./style.css";
import { openModal } from "./modal";
import { img } from "./apple";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Couleur des éléments
const snakeColor = "#009000";
const snakeHeadColor = "#114c11";
const appleColor = "#72262a";
const scoreColor = "#8dd9d5";
let direction;
let score;
let speed;
let gridElem;
let snake;
let apple;

// Écouteur clavier
document.addEventListener("keydown", (event) => {
  console.log(event);
  switch (event.key) {
    case "ArrowRight": {
      if (direction !== "ouest") {
        direction = "est";
        break;
      }
    }
    case "ArrowLeft": {
      if (direction !== "est") {
        direction = "ouest";
        break;
      }
    }
    case "ArrowUp": {
      if (direction !== "sud") {
        direction = "nord";
        break;
      }
    }
    case "ArrowDown": {
      if (direction !== "nord") {
        direction = "sud";
        break;
      }
    }
  }
});
// Écouteur mobile
document.addEventListener("touchstart", function (event) {
  // Récupérer les coordonnées du toucher
  let touchX = event.touches[0].clientX;
  let halfScreenWidth = window.innerWidth / 2;

  if (touchX < halfScreenWidth) {
    switch (direction) {
      case "est": {
        direction = "nord";
        break;
      }
      case "nord": {
        direction = "ouest";
        break;
      }
      case "ouest": {
        direction = "sud";
        break;
      }
      case "sud": {
        direction = "est";
        break;
      }
    }
  } else {
    switch (direction) {
      case "est": {
        direction = "sud";
        break;
      }
      case "nord": {
        direction = "est";
        break;
      }
      case "ouest": {
        direction = "nord";
        break;
      }
      case "sud": {
        direction = "ouest";
        break;
      }
    }
  }
});
// Redimensionnement
window.addEventListener("resize", () => {
  resizeGame();
});

// Dessins
const draw = {
  drawMap: () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  drawSnake: () => {
    for (let i = 0; i < snake.length; i++) {
      if (i === 0) {
        ctx.fillStyle = snakeHeadColor;
        ctx.fillRect(
          snake[i][0] * gridElem,
          snake[i][1] * gridElem,
          gridElem - 2,
          gridElem - 2
        );
      } else {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(
          snake[i][0] * gridElem,
          snake[i][1] * gridElem,
          gridElem - 2,
          gridElem - 2
        );
      }
    }
  },
  drawApple: () => {
    ctx.fillStyle = appleColor;
    ctx.drawImage(
      img,
      apple[0] * gridElem,
      apple[1] * gridElem,
      gridElem,
      gridElem
    );
    // ctx.fillRect();
  },
  drawScore: () => {
    ctx.fillStyle = scoreColor;
    ctx.font = "40px sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(score, gridElem, gridElem);
  },
};

// Logique
const gameLogic = {
  generateApple: () => {
    score++;
    score % 20 === 0 && speed !== 900 ? (speed += 30) : speed;
    score > 200 ? (speed = 940) : speed;
    const [x, y] = [
      Math.trunc((Math.random() * canvas.width) / gridElem),
      Math.trunc((Math.random() * canvas.height) / gridElem),
    ];
    for (let body of snake) {
      if (body[0] === x && body[1] === y) {
        return gameLogic.generateApple();
      }
    }
    apple = [x, y];
  },
  gameOver: () => {
    if (
      snake[0][0] > canvas.width / gridElem - 1 ||
      snake[0][0] < 0 ||
      snake[0][1] > canvas.height / gridElem - 1 ||
      snake[0][1] < 0
    ) {
      return true;
    } else {
      const [head, ...body] = snake;
      for (let bodyElem of body) {
        if (bodyElem[0] === head[0] && bodyElem[1] === head[1]) {
          runnig = false;
          return true;
        }
      }
    }
    return false;
  },
  updateSnakePosition: () => {
    let head;
    switch (direction) {
      case "est": {
        head = [snake[0][0] + 1, snake[0][1]];
        break;
      }
      case "ouest": {
        head = [snake[0][0] - 1, snake[0][1]];
        break;
      }
      case "nord": {
        head = [snake[0][0], snake[0][1] - 1];
        break;
      }
      case "sud": {
        head = [snake[0][0], snake[0][1] + 1];
        break;
      }
      default: {
      }
    }
    snake.unshift(head);
    // collision avec la pomme :
    if (head[0] === apple[0] && head[1] === apple[1]) {
      gameLogic.generateApple();
    } else {
      snake.pop();
    }

    return gameLogic.gameOver();
  },
  move: async () => {
    if (!gameLogic.updateSnakePosition()) {
      draw.drawMap();
      draw.drawSnake();
      draw.drawScore();
      draw.drawApple();
      setTimeout(() => {
        requestAnimationFrame(gameLogic.move);
      }, 1000 - speed);
    } else {
      const result = await openModal(score);
      if (result === true) {
        console.log("je suis du bon coté");

        gameLogic.start();
      }
    }
  },
  start: () => {
    score = 0;
    speed = 750;
    direction = "est";
    apple = [Math.trunc(Math.random() * 20), Math.trunc(Math.random() * 20)];
    snake = [
      [9, 9],
      [8, 9],
      [7, 9],
    ];
    gameLogic.resizeGame();
    draw.drawMap();
    draw.drawSnake();
    draw.drawApple();
    draw.drawScore();
    requestAnimationFrame(gameLogic.move);
  },
  resizeGame: () => {
    if (window.innerWidth < 576) {
      gridElem = 25;
    } else if (window.innerWidth < 768) {
      gridElem = 30;
    } else if (window.innerWidth < 992) {
      gridElem = 35;
    } else if (window.innerWidth < 992) {
      gridElem = 40;
    } else if (window.innerWidth < 1200) {
      gridElem = 45;
    } else if (window.innerWidth >= 1200) {
      gridElem = 70;
    }
    canvas.width = Math.floor((window.innerWidth - 2) / gridElem) * gridElem;
    canvas.height = Math.floor((window.innerHeight - 2) / gridElem) * gridElem;
  },
};

gameLogic.start();
