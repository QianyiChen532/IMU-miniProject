let data;

let array3 = [];

let q0;
let q1;
let q2;
let q3;
var tree = [];
var leaves = [];
let topLevel = 10;
let initialLen  = 200;
let leaveLife = 0;
let img;
let leaves2 = [];

var count = 0;

let params = {
  swing : 10,
  angle:1
};

let gui = new dat.gui.GUI();
gui.add(params, 'swing').min(-20).max(20).step(1);
gui.add(params, 'angle').min(-5).max(15).step(1);

function setup() {
  createCanvas(windowWidth,windowHeight);
  imuConnection.onSensorData((device) => {
      data = device.data;
  });
  var a = createVector(width / 2, height);
  var b = createVector(width / 2, height - initialLen);
  var root = new Branch(a, b,0,0);

  img = loadImage('js/texture.png')
  generateTree(root);
}
function generateTree(root){
  tree[0] = root;
  for (var j = 0; j <topLevel; j++) {
    for (var i = tree.length - 1; i >= 0; i--) {
      if (!tree[i].finished) {
        tree.push(tree[i].branchA(random(PI/8,PI/6),0.6,j));
        tree.push(tree[i].branchB(random(-PI/10,-PI/6),random(0.6,0.7),j));
      }
      tree[i].finished = true;
    }
    count++;

    if (count == 10) {
      for (var k = 0; k < tree.length; k++) {
        if (!tree[k].finished) {
          var leaf = tree[k].end.copy();
          // leaves.push(new Leaf(leaf.x,leaf.y));
          let xoff = noise(leaf.x);
          let yoff = noise(leaf.y);

          leaves.push(new Leaf(leaf.x+xoff,leaf.y+yoff));
        }
      }
    }
  }
}
function draw() {
background(55);
    image(img,0,0,width,height);
    if (!data) {
        return;
    }

    console.log(data);
     q0 = data.quaternion[0];
     q1 = data.quaternion[1];
     q2 = data.quaternion[2];
     q3 = data.quaternion[3];

     let a0 = data.acceleration[0];
     let a1 = data.acceleration[1];
     let a2 = data.acceleration[2];

     push();
     // textSize(20);
     // fill(255,0,0);
     // stroke(255,0,0);
     //
     // text(q0,2*width/3+100,100);
     // text(q1,2*width/3+100,200);
     // text(q2,2*width/3+100,300);
     //
     // text(q3,2*width/2+100,400);
     // text(a0,2*width/3+100,400+100);
     // text(a1,2*width/3+100,400+200);
     // text(a2,2*width/3+100,400+300);



     pop();
    // array3.push(q3);
    // // console.log(array3);
    // while(array3.length>50){
    //   array3.splice(0,1);
    // }
    //
    // let latePos = array3[array3.length-1];
    // let prevPos = array3[array3.length-2];
    // console.log(latePos-prevPos);



    push();
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = 'white';

    noStroke();
    fill('#ffe83b80');
    blendMode(MULTIPLY);
    ellipse(width/2,height/2,height/1.3);
    let gravity = createVector(0,0.1);
    pop();
    for (var i = 0; i < tree.length; i++) {
      tree[i].show();
      tree[i].applyForce(1);
      tree[i].update();

    }
    for (var i = 0; i < leaves.length; i++) {
      let l = leaves[i];
      l.display();
      l.update(q3);
      l.checkEdge();

    //trigger gravity
    let thresholdG = 20;

          if(abs(a1)>thresholdG ){
        l.applyForce(gravity);
    let wind = createVector(0.1*params.angle+q0,0)
        // l.applyForce(wind);
        console.log(0.1*params.angle+q0);
      }
    }

        if(keyIsPressed && key == 'a'){
      if (count == 10) {
        for (var k = 0; k < tree.length; k++) {
            if (!tree[k].finished) {
              var leaf = tree[k].end.copy();
              // leaves.push(new Leaf(leaf.x,leaf.y));
              let xoff = noise(leaf.x);
              let yoff = noise(leaf.y);
              leaves.push(new Berry(leaf.x+xoff,leaf.y+yoff));

           }

        }
      }
    }

    //condition with data,higher than threshold
    let threshold = 0.13;
    if(abs(q0)>threshold && frameCount%2==0 ){
    leaves2.push(new Particle(random(width),0,q0));
    console.log('big');
    }
    // if(keyIsPressed && key == 'r'){
    // leaves2.push(new Berry(random(width),0));
    // }

    for (var i = 0; i < leaves2.length; i++) {
      let l2 = leaves2[i];
      // console.log(l2);
      l2.display();
      l2.update();
      l2.checkEdge();
      l2.life();

      if(l2.isDone){
        leaves2.splice(0,1);
      }
      let gravity = createVector(0,1);//random(0.1*params.swing)
      l2.applyForce(gravity);

    }
}

function dart(x, y, angle) {
    push();
    translate(x, y);
    rotate(angle);
    triangle(-30, 50, 30, 50, 0, -75);
    pop();
}

class Branch{
  constructor(begin, end,angle,level) {
    this.begin = begin;
    this.end = end;
    this.finished = false;

    this.vel = 0;
    this.acc = 0;
    this.restAngle = angle;

    this.level = level;
  }
  update(){
    this.vel *= 0.9;
    this.vel+=this.acc;
    this.angle += this.vel;
    this.acc = 0;
  }
  applyForce(f){

    this.acc += f;
  }

  show() {
    push();
    stroke(139,108,97,10+(10-this.level)*10);
    let s = map(this.level,0,topLevel,5,0.1);
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(params.angle);

    strokeWeight(s);
    line(this.begin.x,this.begin.y,this.end.x,this.end.y)
    // line(this.begin.x+params.angle*this.level*0.1, this.begin.y+params.angle*this.level*0., this.end.x+params.angle*(this.level-1)*0.1, this.end.y+params.angle*this.level*0.1);
    pop();
  }

  branchA(angle,length,level) {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(angle);
    dir.mult(length);
    var newEnd = p5.Vector.add(this.end, dir);
    var b = new Branch(this.end, newEnd,angle,level);
    return b;
  }
  branchB(angle,length,level) {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(angle);
    dir.mult(length);
    var newEnd = p5.Vector.add(this.end, dir);
    var b = new Branch(this.end, newEnd,angle,level);
    return b;
  }
}

class Leaf{
  constructor(x,y){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector();

    this.angle = 0;
    this.angleAcc = random(0.1,0.3);

    this.damping = 0.9;

    this.restangle = -80;
    this.scaleF = random(0.8,1.1);

    this.mass = random(1);

  }
  applyForce(f){
    let force = f.copy();
    force.div(this.mass)
    this.acc.add(force);

  }
  update(q3){
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    let freq = frameCount*0.01+this.pos.x+params.swing*10;
    let amp  =params.swing;
//replace swing by data
    let s = map(q3,0,1,0,params.swing);
    console.log(q3,s);
    let sinVal = sin(freq)*s;
    amp*=0.9
    this.angle = sinVal;

  }
  springMove(){
    let angleThresh = 10;
    let rest = this.pos.rotate(PI/3);
    let spring = new p5.Vector(this.pos,rest);
    let distance = dist(this.angle, 0, this.restAngle, 0);
    let force = map(min(distance, angleThresh), 0, angleThresh, 0, branchForce);
    spring.sub(new p5.Vector(this.angle, 0));

    spring.setMag(force);
    this.applyForce(force);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);

      rotate(this.angle);
      // fill(230,81,70,30);

      // fill(76,175,70+100*q3,30);
      let color1 = color(230,81,70,20);
      let color2 = color(76,175,80,30);
          // fill(230,81,70,20);
          let q = map(q3,-1,1,0,1);
          console.log(q);
        let colorL = lerpColor(color2,color1,q)
        fill(colorL);
      noStroke();
      scale(this.scaleF*(this.mass+1));
      triangle(0,-10,0,10,15,5);
    // }else{
    //   rotate(this.angle);
    //   fill(230,81,70,30);
    //
    //   noStroke();
    //   scale(this.scaleF*2);
    //   ellipse(0,0,5)
    // }
    pop();
  }
  checkEdge(){
    if(this.pos.x<0){
      this.pos.x = 0;
      this.vel.x = 0;
    }
    if(this.pos.x>width){
      this.pos.y = 0;
      this.vel.x = 0;
    }
    if(this.pos.y<0){
      this.pos.y = 0;
      this.vel.y = 0;
    }
    if(this.pos.y>height){
      this.pos.y = height;
      this.vel.y = 0;
    }

  }
}

class Berry extends Leaf{
  constructor(x,y){
    super(x,y);

    this.lifespan = 1;
    this.lifeReduction = 0.01;
    this.isDone = false;
  }
  life(){
    this.lifespan -= this.lifeReduction;
    if(this.lifespan<0){
      this.isDone = true;
    }
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    rotate(this.angle);
    noStroke();
    fill(230,81,70,20);

    noStroke();
    scale(this.scaleF*2);
    ellipse(0,0,this.mass*20)
    pop();
  }
}

class Particle{
  constructor(x,y,q0){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector();

    this.angle = 0;
    this.angleAcc = random(0.1,0.3);

    this.scaleF = random(0.8,1.1);
    this.mass = random(1,3);

    this.lifespan = 1;
    this.lifeReduction = 0.01;
    this.isDone = false;

    this.r = q0;
  }
  life(){
    this.lifespan -= this.lifeReduction;
    if(this.lifespan<0){
      this.isDone = true;
    }
  }
  applyForce(f){
    let force = f.copy();
    force.div(this.mass)
    this.acc.add(force);

  }
  update(){
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);

      rotate(this.angle);
      // fill(230,81,70,30);

      fill(76,175,250,60);
      noStroke();
      scale(this.scaleF*(this.mass+1));
      ellipse(0,0,1+this.r*12);
    pop();
  }
  checkEdge(){
    if(this.pos.x<0){
      this.pos.x = 0;
      this.vel.x = 0;
    }
    if(this.pos.x>width){
      this.pos.y = 0;
      this.vel.x = 0;
    }
    if(this.pos.y<0){
      this.pos.y = 0;
      this.vel.y = 0;
    }
    if(this.pos.y>height){
      this.pos.y = height;
      this.vel.y = 0;
    }

  }
}
