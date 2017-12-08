const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
const PUPPY_SIZE = { width: 80, height: 80 };
const PLAYER_SPEED = 9;
const PLAYER_INITIAL_LOCATION = { x: 100, y: 100 };
const PLAYER_SIZE = { width: 100, height: 50 };
const PUPPY_SPEED = { max: PLAYER_SPEED * 0.6, min: PLAYER_SPEED * 0.05 };
const TIME_UNTIL_SPAWN = 350;
const MAX_PUPPIES = 5;
let gameEnded = false;
let timer = 0;
let highScore = 0;
document.getElementById("scoreCounter").innerHTML = highScore;

function generateRandomSpeed() {
  return Math.random() * (PUPPY_SPEED.max - PUPPY_SPEED.min) + PUPPY_SPEED.min;
}

function generateRandomPuppyLocation() {
  return Math.random() * canvas.width;
}

class Sprite {
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

let playerImage = new Image();
playerImage.src = "https://image.ibb.co/gbmjaG/bone.png";

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
puppyImage.src = "https://image.ibb.co/kOAAFG/puppy.png";

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
    PUPPY_SIZE.width,
    PUPPY_SIZE.height,
    generateRandomSpeed()
  )
];

function restartGame() {
  progressBar.value = 100;
  highScore = 0;
  document.getElementById("scoreCounter").innerHTML = highScore;
  requestAnimationFrame(drawScene);
  puppies = [
    new Puppy(
      generateRandomPuppyLocation(),
      generateRandomPuppyLocation(),
      PUPPY_SIZE.width,
      PUPPY_SIZE.height,
      generateRandomSpeed()
    )
  ];
}

function pushOff(sprite1, sprite2) {
  let sprite1CenterX = sprite1.x + sprite1.width / 2;
  let sprite1CenterY = sprite1.y + sprite1.height / 2;
  let sprite2CenterX = sprite2.x + sprite2.width / 2;
  let sprite2CenterY = sprite2.y + sprite2.height / 2;
  if (sprite1CenterX > sprite2CenterX) {
    sprite1.x += 5;
  } else {
    sprite1.x -= 5;
  }
  if (sprite1CenterY > sprite2CenterY) {
    sprite1.y += 5;
  } else {
    sprite1.y -= 5;
  }
}

function haveCollided(sprite1, sprite2) {
  return (
    sprite1.x + sprite1.width > sprite2.x &&
    sprite1.y + sprite1.height > sprite2.y &&
    sprite2.x + sprite2.width > sprite1.x &&
    sprite2.y + sprite2.height > sprite1.y
  );
}

let mouse = { x: 0, y: 0, width: 0, height: 0 };
document.body.addEventListener("mousemove", updateMouse);
document.body.addEventListener("click", mouseClick);

function updateMouse(event) {
  const canvasRectangle = canvas.getBoundingClientRect();
  mouse.x = event.clientX - canvasRectangle.left;
  mouse.y = event.clientY - canvasRectangle.top;
}

function mouseClick(event) {
  if (gameEnded) {
    gameEnded = false;
    restartGame();
  }
}

function moveToward(leader, follower, speed) {
  let leaderCenterX = leader.x + leader.width / 2;
  let leaderCenterY = leader.y + leader.height / 2;
  let followerCenterX = follower.x + follower.width / 2;
  let followerCenterY = follower.y + follower.height / 2;
  let dx = leaderCenterX - followerCenterX;
  let dy = leaderCenterY - followerCenterY;
  let hypot = Math.hypot(dx, dy);
  let speedX = speed * dx / hypot;
  let speedY = speed * dy / hypot;
  if (hypot > speed) {
    follower.x += speedX;
    follower.y += speedY;
  }
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  puppies.forEach(puppy => moveToward(player, puppy, puppy.speed));
  puppies.forEach(puppy => {
    if (haveCollided(puppy, player)) {
      progressBar.value -= 0.5;
      pushOff(puppy, player);
    }
  });
  if (timer % TIME_UNTIL_SPAWN === 0 && timer > 0) {
    if (puppies.length === MAX_PUPPIES) {
      highScore += 2;
      document.getElementById("scoreCounter").innerHTML = highScore;
      puppies.forEach(puppy => puppy.speed++);
    } else {
      highScore++;
      document.getElementById("scoreCounter").innerHTML = highScore;
      puppies.push(
        new Puppy(
          generateRandomPuppyLocation(),
          generateRandomPuppyLocation(),
          PUPPY_SIZE.width,
          PUPPY_SIZE.height,
          generateRandomSpeed()
        )
      );
    }
  }
  for (let x = 0; x < puppies.length; x++) {
    for (let y = puppies.length - 1; y > x; y--) {
      if (haveCollided(puppies[x], puppies[y])) {
        pushOff(puppies[x], puppies[y]);
      }
    }
  }
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
  ctx.font = "60px Macondo Swash Caps";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  ctx.fillText("Click to Restart", canvas.width / 2, canvas.height * 2 / 3);
  gameEnded = true;
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
    timer++;
  }
}

requestAnimationFrame(drawScene);
