var PLAY = 1;
var END = 0;
var gameState = PLAY;

var dino, dino_running, dino_over;
var ground, invisivel, groundImage;
var cloudsGroup, cloud, cloudImage;
var obstaclesGroup, ob1, ob2, ob3, ob4, ob5, ob6;

var score;
var gameOver, restart, gameOverImg, restartImg;

var jumpSound, checkSound, dieSound;

function preload(){
  dino_running = loadAnimation("/img/trex1.png", "img/trex3.png", "img/trex4.png");
  dino_over = loadImage("/img/trex_collided.png");
 
  groundImage = loadImage("/img/ground2.png");
  cloudImage = loadImage("/img/cloud.png");
  
  ob1 = loadImage("/img/obstacle1.gif");
  ob2 = loadImage("/img/obstacle2.gif");
  ob3 = loadImage("/img/obstacle3.gif");
  ob4 = loadImage("/img/obstacle4.gif");
  ob5 = loadImage("/img/obstacle5.gif");
  ob6 = loadImage("/img/obstacle6.gif");

  gameOverImg = loadImage("/img/gameOver.png");
  restartImg = loadImage("/img/restart.png");

  jumpSound = loadSound("/song/jump.mp3");
  dieSound = loadSound("/song/die.mp3");
  checkSound = loadSound("/song/checkPoint.mp3");
}

function setup()
{
  createCanvas(windowWidth,200);

  invisible = createSprite(width/2, height-10, width, 50);
  invisible.shapeColor = "#CCE5FF";

  ground = createSprite(width/2, height-35, width, 100);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;

  dino = createSprite(50,height-70,20,50);
  dino.addAnimation("running", dino_running);
  dino.addAnimation("collided", dino_over);
  dino.scale = 0.6;

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  score = 0;

  dino.setCollider("circle", 0, 0, 30);
  dino.debug = true;
  
  gameOver = createSprite(width/2,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(width/2,160);
  restart.addImage(restartImg);
  restart.scale = 0.5;
}

function draw(){
  background("#FFEFFE");

  text("Pontuação: "+ score, 50, 50);
  text("Louise Lalanne", 50, 30);

  if (gameState === PLAY)
  {
    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 2* score/300);

    score = score + Math.round(getFrameRate()/60);

    if (score >0 && score%300 == 0) {
      checkSound.play();
    }

    if(ground.x < 0) {
      ground.x = ground.width/2;
    }

    if (keyDown("space") && dino.y >= 100)
    {
     dino.velocityY = -12;
     jumpSound.play();
    }
     dino.velocityY = dino.velocityY + 0.8;

     gerarClouds();
     spawnObstacles();

     if (obstaclesGroup.isTouching(dino)) {
        gameState = END;
        dieSound.play();
     }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    dino.changeAnimation("collided", dino_over);

    dino.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  }
  
  dino.collide(invisible);

  if(mousePressedOver(restart)){
    reset();
  }

  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  score =0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  dino.changeAnimation("running", dino_running);
}

function gerarClouds(){
  if (frameCount %60 == 0) {
   cloud = createSprite(width,100,40,10);
   cloud.addImage(cloudImage);
   cloud.y = Math.round(random(10,60))
   cloud.scale = 0.5;
   cloud.velocityX = -3;
   cloud.depth = dino.depth;
   dino.depth = dino.depth +1;
   cloud.lifetime = 200;
   cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if (frameCount % 60 == 0)
  {
    var obstacles = createSprite(width,165,10,40);
    obstacles.velocityX = -(6 + score/300);
   
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacles.addImage(ob1);
              break;
      case 2: obstacles.addImage(ob2);
              break;
      case 3: obstacles.addImage(ob3);
              break;
      case 4: obstacles.addImage(ob4);
             break;
     case 5: obstacles.addImage(ob5);
              break;
      case 6: obstacles.addImage(ob6);
              break;
      default: break;
    }

    obstacles.scale = 0.6;
    obstacles.lifetime = 300;
    obstaclesGroup.add(obstacles);
  }
}