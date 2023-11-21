import "./style.css";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Couleur des éléments
const snakeColor = "green";
const appleColor = "red";

// Direction de départ
const directions = ["nord", "ouest", "sud", "est"];
let direction = "est";

// score
let score = 0;

// vitesse
const speed = 500; // vitesse de déplacement en ms

// Grille et position de la pomme et du serpent
const gridElem = 40; // 20 * 20
const snake = [
  [9, 9],
  [8, 9],
  [7, 9],
];
let apple = [5, 5];

const drawMap = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 800);
};
const drawSnake = () => {
  ctx.fillStyle = snakeColor;
  for (let body of snake) {
    ctx.fillRect(body[0] * gridElem, body[1] * gridElem, gridElem, gridElem);
  }
};
const drawApple = () => {
  ctx.fillStyle = appleColor;
  ctx.fillRect(apple[0] * gridElem, apple[1] * gridElem, gridElem, gridElem);
};

// Écouteur clavier
window.addEventListener("keydown", (event) => {
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

const generateApple = () => {
  const [x, y] = [
    Math.trunc(Math.random() * 20),
    Math.trunc(Math.random() * 20),
  ];
  for (let body of snake) {
    if (body[0] === x && body[1] === y) {
      return generateApple();
    }
  }
  apple = [x, y];
};

const gameover = () => {
  if (
    snake[0][0] > 19 ||
    snake[0][0] < 0 ||
    snake[0][1] > 19 ||
    snake[0][1] < 0
  ) {
    // return true;
  } else {
    const [head, ...body] = snake;
    for (let bodyElem of body) {
      if (bodyElem[0] === head[0] && bodyElem[1] === head[1]) {
        return true;
      }
    }
  }
  return false;
};

const updateSnakePosition = () => {
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
    generateApple();
  } else {
    snake.pop();
  }

  return gameover();
};

const drawScore = () => {
  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(score, gridElem, gridElem);
};

drawMap();
drawSnake();
drawApple();

const move = () => {
  if (!updateSnakePosition()) {
    drawMap();
    drawSnake();
    drawScore();
    drawApple();
    setTimeout(() => {
      requestAnimationFrame(move);
    }, speed);
  } else {
    alert("perdu");
  }
};

requestAnimationFrame(move);
