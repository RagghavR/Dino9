//Global
var trex,walk,ground,floor,ground2,obs1,obs2,obs3,obs4,obs5,obs6,gameover,restart,over,again,stand,die,jump,checkpoint;
var score = 0
var highscore = 0
var gamestate = "start"
function preload(){
  walk = loadAnimation("trex1.png","trex3.png","trex4.png")
  floor = loadImage("ground2.png")
  cloud1 = loadImage("cloud.png")
  obs1 = loadImage("obstacle1.png")
  obs2 = loadImage("obstacle2.png")
  obs3 = loadImage("obstacle3.png")
  obs4 = loadImage("obstacle4.png")
  obs5 = loadImage("obstacle5.png")
  obs6 = loadImage("obstacle6.png")
  gameover = loadImage("gameOver.png")
  restart = loadImage("restart.png")
  stand = loadAnimation("trex_collided.png")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
  checkpoint = loadSound("checkPoint.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  trex = createSprite(50,height-50,50,50);
  trex.addAnimation("VOLK",walk)
  trex.addAnimation("dead",stand)
  trex.scale = 0.5;
  trex.debug= false
  //shape - rectangle/circle,Xoffset,Yoffset,width/radius,height
  trex.setCollider("circle",0,0,45)
  ground =createSprite(width/2,height-25,width,20)
  ground.addImage(floor)
  ground2 = createSprite(width/2,height-15,width,20)
  ground2.visible=false
  obsg = createGroup();
  cloudsg = createGroup();
  over = createSprite(width/2,(height/2)-90,100,100)
  again = createSprite(width/2,height/2,100,100)
  over.addImage(gameover)
  again.addImage(restart)
  again.scale = 0.5
}
function draw(){
  background ("white")
  //Concatenation
  text("Score: "+score,width-150,height-200)
  textSize(10)
  text("Highscore: "+highscore,width-150,height-180)
  //frames per second
  console.log(getFrameRate())
  trex.collide(ground2)
  drawSprites();
  if (gamestate === "start"){
    ground.velocityX = -4
    score = score + Math.round(getFrameRate()/60);
    trex.velocityY = trex.velocityY + 0.8
    //touches = [x,y] length is 2
    if ((keyDown("space")||touches.length>0) && trex.y>=height-50){
      trex.velocityY = -12
      jump.play()
      touches = []
    }
    
    if (score%100 === 0 && score >0){
      ground.velocityX = ground.velocityX - 1
    }
    if (ground.x < -1530.5){
    ground.x = 2280
    }
    if (frameCount%60===0){
      clouds();
    }
    if (frameCount%70===0){
      obstacles();
    }
    if (trex.isTouching(obsg)){
      //trex.velocityY = -10
      gamestate = "end"
      die.play()
    }
    if(score%100===0  && score > 0){
      checkpoint.play()
    }
    over.visible= false
    again.visible = false
  }
  if (gamestate === "end"){
    if (score>highscore){
      highscore = score
    }
    ground.velocityX = 0
    obsg.setVelocityXEach(0);
    cloudsg.setVelocityXEach(0);
    over.visible = true
    again.visible = true
    obsg.setLifetimeEach(-1)
    cloudsg.setLifetimeEach(-1)
    trex.velocityY = 0
    trex.changeAnimation("dead",stand)
    if(mousePressedOver(again)){
      gamestate = "start"
      obsg.destroyEach()
      cloudsg.destroyEach()
      trex.changeAnimation("VOLK",walk)
      score = 0
    }
  }
  trex.debug = false
}

function clouds(){
  //local
  var cloud = createSprite(width,random(30,200),10,10);
  cloud.velocityX = (ground.velocityX/1.5);
  cloud.addImage(cloud1)
  cloud.scale = 0.75;
  trex.depth = cloud.depth + 1;
  cloud.lifetime = 500;
  cloudsg.add(cloud)
}
function obstacles(){
  //local
 var obs = createSprite(width,height-45,10,10)
 obs.velocityX = ground.velocityX
 obs.debug = false
 switch (Math.round(random(1,6))){
   case 1 : obs.addImage(obs1)
   break;
   case 2 : obs.addImage(obs2)
   break;
   case 3 : obs.addImage(obs3)
   break;
   case 4 : obs.addImage(obs4)
  
   break;
   case 5 : obs.addImage(obs5)
  
   break;
   case 6 : obs.addImage(obs6)
  ;
   break; 
 }
 obs.scale = 0.5;
 obs.lifetime = 500
 obsg.add(obs)
}
