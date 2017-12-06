const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
const PUPPY_SIZE = { width: 80, height: 80 };
const PLAYER_SPEED = 0.2;
const PLAYER_INITIAL_LOCATION = { x: 100, y: 100 };
const PLAYER_SIZE = { width: 100, height: 50 };
const PUPPY_SPEED = { max: 0.4, min: 0.01 };

function generateRandomSpeed() {
  return Math.random() * PLAYER_SPEED / 5;
}

function generateRandomPuppyLocation() {
  return Math.random() * canvas.width;
}

function pushOff(sprite1, sprite2) {
  let sprite1CenterX = sprite1.x + sprite1.width / 2;
  let sprite1CenterY = sprite1.y + sprite1.height / 2;
  let sprite2CenterX = sprite2.x + sprite2.width / 2;
  let sprite2CenterY = sprite2.y + sprite2.height / 2;
  if (sprite1CenterX > sprite2CenterX) {
    sprite1.x += 10;
  } else {
    sprite1.x -= 10;
  }
  if (sprite1CenterY > sprite2CenterY) {
    sprite1.y += 10;
  } else {
    sprite1.y -= 10;
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
  ),
  new Puppy(
    generateRandomPuppyLocation(),
    generateRandomPuppyLocation(),
    PUPPY_SIZE.width,
    PUPPY_SIZE.height,
    generateRandomSpeed()
  ),
  new Puppy(
    generateRandomPuppyLocation(),
    generateRandomPuppyLocation(),
    PUPPY_SIZE.width,
    PUPPY_SIZE.height,
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
  //   for (let x = 1; x < puppies.length; x++) {
  //     for (let y = 0; y < x; y++) {
  //       if (haveCollided(puppies[x], puppies[y])) {
  //         pushOff(puppies[x], puppies[y])
  //       }
  //     }
  //   }
  puppies.forEach((puppy, i) => {
    if (haveCollided(puppy, puppies[(i + 1) % puppies.length])) {
      pushOff(puppy, puppies[(i + 1) % puppies.length]);
    }
  });
  puppies.forEach(puppy => {
    if (haveCollided(puppy, player)) {
      progressBar.value -= 0.5;
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
