const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
const PUPPY_HEIGHT = 120;
const PUPPY_WIDTH = 120;
const PLAYER_SPEED = 0.2;
const PLAYER_INITIAL_LOCATION = { x: 100, y: 100 };
const PLAYER_SIZE = { width: 100, height: 70 };
const PUPPY_SPEED = { max: 0.4, min: 0.01 };

function generateRandomSpeed() {
  return Math.random() * PLAYER_SPEED / 10;
}

function generateRandomPuppyLocation() {
  return Math.random() * canvas.width;
}

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return (
    distanceBetween(sprite1, sprite2) < sprite1.width / 2 + sprite2.width / 2
  );
}

class Sprite {
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

let playerImage = new Image();
playerImage.src =
  "http://weclipart.com/gimg/F144DD32ADD9FA52/clipartist-net-clip-art-cartoon-bone-skull-bones-clipartist-net.png";

class Player extends Sprite {
  constructor(x, y, width, height, speed) {
    super();
    this.image = playerImage;
    Object.assign(this, { x, y, width, height, speed });
  }
}

let player = new Player(
  PLAYER_INITIAL_LOCATION.x,
  PLAYER_INITIAL_LOCATION.y,
  PLAYER_SIZE.width,
  PLAYER_SIZE.height,
  PLAYER_SPEED
);

let puppyImage = new Image();
puppyImage.src =
  "https://stickershop.line-scdn.net/stickershop/v1/product/1028369/LINEStorePC/main@2x.png;compress=true?__=20161019";

class Puppy extends Sprite {
  constructor(x, y, width, height, speed) {
    super();
    this.image = puppyImage;
    Object.assign(this, { x, y, width, height, speed });
  }
}

let puppies = [
  new Puppy(
    generateRandomPuppyLocation(),
    generateRandomPuppyLocation(),
    PUPPY_WIDTH,
    PUPPY_HEIGHT,
    generateRandomSpeed()
  ),
  new Puppy(
    generateRandomPuppyLocation(),
    generateRandomPuppyLocation(),
    PUPPY_WIDTH,
    PUPPY_HEIGHT,
    generateRandomSpeed()
  ),
  new Puppy(
    generateRandomPuppyLocation(),
    generateRandomPuppyLocation(),
    PUPPY_WIDTH,
    PUPPY_HEIGHT,
    generateRandomSpeed()
  )
];

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);

function updateMouse(event) {
  const canvasRectangle = canvas.getBoundingClientRect();
  mouse.x = event.clientX - canvasRectangle.left;
  mouse.y = event.clientY - canvasRectangle.top;
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x - follower.width / 2) * speed;
  follower.y += (leader.y - follower.y - follower.height / 2) * speed;
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  puppies.forEach(puppy => moveToward(player, puppy, puppy.speed));
  puppies.forEach(puppy => {
    if (haveCollided(puppy, player)) {
      progressBar.value -= 1;
    }
  });
}

let backgroundImage = new Image();
backgroundImage.src =
  "https://2.bp.blogspot.com/-3-bkBLwA_Bk/VaTNgW4XoEI/AAAAAAAAE_8/hHO-ZQz83OI/s1600/tile_grass_v01bs.png";

function clearBackground() {
  ctx.fillStyle = ctx.createPattern(backgroundImage, "repeat");
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function endGame() {
  clearBackground();
  ctx.font = "80px Macondo Swash Caps";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

function drawScene() {
  clearBackground();
  player.draw();
  puppies.forEach(puppy => puppy.draw());
  updateScene();
  if (progressBar.value <= 0) {
    endGame();
  } else {
    requestAnimationFrame(drawScene);
  }
}

requestAnimationFrame(drawScene);
