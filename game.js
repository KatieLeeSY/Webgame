var canvas = null;
var context = null;
class GameObject {
  constructor(src) {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.image = new Image();
    // () => {} Arrow function
    this.image.addEventListener('load', () => {
      this.width = this.image.width;
      this.height = this.image.height;
    });
    this.image.src = src;
  }
}
class Ball extends GameObject {
  constructor() {
    super('image/ball.png');

    this.moving = false;
    this.speed = {x:0, y:0};
  }
}

class Brick extends GameObject
{
  constructor()
  {
    super('image/brick.png');
    this.life = 1;
  }
}

var clicked = false;

var gameObjectList = [];
var ballList = [];
var brickList = [];
var BALL_SPEED = 6;
var startX, startY;

function init() {
  canvas = document.getElementById('gameCanvas');
  context = canvas.getContext('2d');
  create('brick', 500, 50);
  create('brick', 300, 50);

  let firstBall = create('ball', 0, 0);
    firstBall.x = startX = (canvas.width - 22) / 2;
    firstBall.y = startY = canvas.height - 20;
  requestAnimationFrame(update);
}

function update() {
  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.fillRect(0,0,canvas.width,canvas.height);

  for (let o of gameObjectList) {
    context.drawImage(o.image, o.x, o.y);
  }

  let finishedBallCount = 0;

  for (let ball of ballList) {
    for (let brick of brickList) {
      //AABB 충돌
      if(brick.x + brick.width > ball.x &&
        brick.x < ball.x + ball.width &&
        brick.y + brick.height > ball.y &&
        brick.y < ball.y + ball.height
      ) {
        ball.x -= ball.speed.x;
        ball.y -= ball.speed.y;

        if(brick.x + brick.width > ball.x &&
        brick.x < ball.x + ball.width)
        {
          ball.speed.y *= -1;
        }
        else if(brick.y + brick.height > ball.y &&
        brick.y < ball.y + ball.height)
        {
          ball.speed.x *= -1;
        }
        brick.life--;
        if(brick.life == 0)
        {
          destroy(brick);
        }
        }
    }

    if(ball.moving){
      ball.x += ball.speed.x;
      ball.y += ball.speed.y;

      if(ball.y > canvas.height)
      {
        ball.x = startX;
        ball.y = startY;
        ball.moving = false;
        finishedBallCount++;

        if(finishedBallCount == ballList.length)
        clicked = false;
      }
    }
    if(ball.x < 0 || ball.x + ball.width > canvas.width)
      ball.speed.x *= -1;
    else if(ball.y < 0)
      ball.speed.y *= -1;
  }
  requestAnimationFrame(update);
}
function create(id, x, y) {
  let ret;
  switch (id) {
    case 'brick':
      ret = new Brick();
      brickList.push(ret);
      break;
    case 'ball':
      ret = new Ball();
      ballList.push(ret);
      break;
    default:
      return null;
  }
  ret.x = x;
  ret.y = y;
  gameObjectList.push(ret);
  return ret;
}

function destroy(object)
{
  if(object instanceof Brick)
  {
    let index = brickList.indexOf(object);
    if(index != -1)brickList.splice(index, 1);
  }

  let index = gameObjectList.indexOf(object);
  if(index != -1)gameObjectList.splice(index, 1);
}

function onClick(e)
{
  if(clicked) return;

  clicked = true;

  for(let ball of ballList)
    ball.moving = true;

  let canvasRect = canvas.getBoundingClientRect();

  let mouseX = e.clientX - canvasRect.left;
  let mouseY = e.clientY - canvasRect.top;

  let firstBall = ballList[0];
  let angleWithMouse = Math.atan2(mouseY - (firstBall.y + firstBall.height/2), mouseX - (firstBall.x + firstBall.width/2));
  firstBall.speed.x = Math.cos(angleWithMouse) * BALL_SPEED;
  firstBall.speed.y = Math.sin(angleWithMouse) * BALL_SPEED;
}
window.addEventListener('click', onClick);
window.addEventListener('load', init);
