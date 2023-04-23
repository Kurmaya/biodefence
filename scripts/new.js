import * as THREE from '../modules/three.module.js';
// import {OrbitControls} from 'https://unpkg.com/three@0.139.1/examples/jsm/controls/OrbitControls'
import * as dat from "https://cdn.skypack.dev/dat.gui";
import {GLTFLoader} from '../modules/GLTFLoader.js'
// import {RGBELoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/RGBELoader.js'
const canvas = document.querySelector('canvas.webgl');
const updateDrop= document.querySelector('.update-drop');
const arrow = document.querySelector('.arrow');
gsap.registerPlugin(ScrollTrigger);
const positions = document.querySelectorAll('.positions button');
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// function down(){
//   if(arrow.classList.contains('active')){
//
//
//     updateDrop.classList.remove('active');
//     setTimeout(function () {
//       document.querySelectorAll('.update-drop.active .update-list').forEach((list)=>{
//         list.classList.remove('active');
//       })
//     }, 100);
//     arrow.classList.remove('active');
//     document.querySelector('.update-drop h2').classList.remove('active');
//   }
//
//   else if(!arrow.classList.contains('active')){
//     updateDrop.classList.add('active');
//     setTimeout(function () {
//       document.querySelectorAll('.update-drop.active .update-list').forEach((list)=>{
//         list.classList.add('active');
//       })
//     }, 1000);
//     arrow.classList.add('active');
//     document.querySelector('.update-drop h2').classList.add('active');
//   }
// }
//
// arrow.addEventListener('click',down)


positions.forEach((position) => {
  position.addEventListener('click', function(){
    positions.forEach((pos) => {
      pos.classList.remove('active');

    });

    position.classList.add('active');
  })
});
//texture
const textureLoader = new THREE.TextureLoader();


const planeTexture = textureLoader.load('./textures/world.5292.png');
const hex = textureLoader.load('./textures/hex2.png');
const zz = textureLoader.load('./textures/zz.png');
const cubeTexture = textureLoader.load('./textures/cube map.png');
const def = textureLoader.load('./textures/biodefence-nav-logo-red.png');
const veedeeo= document.getElementById('video-texture');
const impactVid = document.getElementById('impactVideo');
const impactVid1 = document.getElementById('impactVideo1');
const impactVid2 = document.getElementById('impactVideo2');
const impactVid3 = document.getElementById('impactVideo3');
const impactVid4 = document.getElementById('impactVideo4');
const impactVid5 = document.getElementById('impactVideo5');
const mainBG= document.getElementById('mainBG');
mainBG.play();
mainBG.playbackRate=.4;
impactVid.play();
impactVid1.play();
impactVid2.play();
impactVid3.play();
impactVid4.play();
impactVid5.play();

veedeeo.currentTime =.1;
impactVid.currentTime=.1;
impactVid2.currentTime=.1;
impactVid3.currentTime=.1;
impactVid4.currentTime=.1;
impactVid5.currentTime=.1;
let videoTexture = new THREE.VideoTexture(veedeeo);
let videoTexture1 = new THREE.VideoTexture(impactVid1);
let videoTexture2 = new THREE.VideoTexture(impactVid2);
let videoTexture3 = new THREE.VideoTexture(impactVid3);
let videoTexture4 = new THREE.VideoTexture(impactVid4);
let videoTexture5 = new THREE.VideoTexture(impactVid5);
let impactVideoTexture= new THREE.VideoTexture(impactVid);
let mainBack= new THREE.VideoTexture(mainBG);
mainBG.minFilter= THREE.LinearFilter;
mainBG.magFilter= THREE.LinearFilter;
videoTexture.minFilter= THREE.LinearFilter;
videoTexture.magFilter= THREE.LinearFilter;
videoTexture.minFilter= THREE.LinearFilter;
videoTexture.magFilter= THREE.LinearFilter;
impactVideoTexture.minFilter= THREE.LinearFilter;
impactVideoTexture.magFilter= THREE.LinearFilter;
const mute = document.getElementById('mute');
const play = document.getElementById('play');
veedeeo.muted=false;
play.addEventListener('click',function(){
  play.classList.toggle('active');
  if(play.classList.contains('active')){
    veedeeo.play();
    gsap.to(play,{
      background:'rgba(255,0,0,1)',
      duration:1,
      ease:'power1'


    })
    // play.textContent="Pause"
    play.children[0].src='images/pause1.png';

  }
  else if(!play.classList.contains('active')){
    veedeeo.pause();
    // play.textContent="Play"
    play.children[0].src='images/play1.png';
    gsap.to(play,{
      background:'rgba(150,150,150,.6)',
      duration:1,
      ease:'power1'
    })
  }
})
mute.addEventListener('click', function(){
  mute.classList.toggle('muted');

   if (veedeeo.muted === true) {
     veedeeo.muted = false;
     // mute.textContent="Mute";

     mute.children[0].src='images/unmute1.png'
     gsap.to(mute,{
       background:'rgba(150,150,150,.6)',
       duration:1,
       ease:'power1'
     })
   }
   else if (veedeeo.muted === false) {
     veedeeo.muted = true;
     gsap.to(mute,{
       background:'rgba(255,0,0,1)',
       duration:1,
       ease:'power1'
     })
     // mute.textContent="Unmute";
     mute.children[0].src='images/mute1.png'
   }
})
//groups
const group = new THREE.Group();
const groupTwo = new THREE.Group();
//sizes
const sizes = {
  width:window.innerWidth,
  height:window.innerHeight
}
const scene = new THREE.Scene();
//camera
const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,1000);
//renderer
const renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas});
renderer.localClippingEnabled=true;
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.setClearColor(0xececec);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFShadowMap;
// renderer.shadowMap.type=THREE.VSMShadowMap;


 // scene.add(new THREE.GridHelper(16, 16, "yellow", "black"));
//clipping planes
const localPlane = new THREE.Plane( new THREE.Vector3( 0,0, .2 ),-1.65);
const localPlane2 = new THREE.Plane(new THREE.Vector3(1,3.4,0),-.14);
const localPlane3 = new THREE.Plane(new THREE.Vector3(0.16,-.71,0),-.9);

//particles
const particlesMaterial =new THREE.PointsMaterial({
  size : 0.01,
  // map: zz,
  transparent:true,
  opacity:.48,
  alpha:true,
  // color: 0x85CDFD
  color:0x222222
});

const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 1000;

const posArray = new Float32Array(particlesCount*3);

for (let i=0;i<particlesCount*3;i++){
  // posArray[i] =(Math.random()-.5)*5;
  // posArray[i] =(Math.random()-.5)*10;
  // posArray[i] =(Math.random()-.5)*40;
  posArray[i] =(Math.random(Math.sin(Math.random()))-.5)*40;
  // posArray[i+2]=(Math.random())
}
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(posArray,3));

const particlesMesh= new THREE.Points(particlesGeometry,particlesMaterial);


//impact video plane
let impCubeSides=4.5;
if(window.innerWidth<800){
  impCubeSides=2.5;
}
let impactVideoGeometry= new THREE.BoxGeometry(impCubeSides,impCubeSides,impCubeSides,10,10,10);

const impactVideoMat = [
  new THREE.MeshBasicMaterial({map:impactVideoTexture,transparent:true,opacity:0}),
  new THREE.MeshBasicMaterial({map:videoTexture1,transparent:true,opacity:0}),
  new THREE.MeshBasicMaterial({map:videoTexture2,transparent:true,opacity:0}),
  new THREE.MeshBasicMaterial({map:videoTexture3,transparent:true,opacity:0}),
  new THREE.MeshBasicMaterial({map:videoTexture4,transparent:true,opacity:0}),
  new THREE.MeshBasicMaterial({map:videoTexture5,transparent:true,opacity:0}),
  // new THREE.MeshBasicMaterial({map:textureLoader.load('./textures/maybe.png')}),

];
// console.log(impactVideoMat);
const impactVideoMaterial= new THREE.MeshBasicMaterial({
  map:impactVideoTexture,
  // map:cubeTexture,
  color:0xffffff,
  opacity:0,
  transparent:true


})

const impactVideoCube= new THREE.Mesh(impactVideoGeometry,impactVideoMat);


impactVideoCube.castShadow=true;
impactVideoCube.receiveShadow=true;
scene.add(impactVideoCube);
impactVideoCube.rotation.set=(0,0,0);
// console.log(impactVideoCube);

impactVideoCube.position.set(0,-30,-10);
//curved panel
let params ={
	bendDepth:.5
}
let geomPar= {
  width:11,
  height:6
};
if(window.innerWidth<800){
  geomPar.width=7;
  geomPar.height=4;
}
let geom = new THREE.PlaneGeometry(geomPar.width, geomPar.height, 200, 200);
planeCurve(geom, params.bendDepth);
let mat = new THREE.MeshBasicMaterial({
  castShadow:true,
	// wireframe: true,
  map: videoTexture,
  side:THREE.FrontSide,
  color:0xffffff,
  transparent:true,
  opacity:0,
  reflectivity:1.4,
});
if(window.innerWidth < 600){
  geom = new THREE.PlaneGeometry(6, 4, 200, 200);
}
let curvedPanel = new THREE.Mesh(geom, mat);
curvedPanel.receiveShadow=true;
curvedPanel.castShadow=true;
scene.add(curvedPanel);

curvedPanel.position.set(-30,0,-9.5);
curvedPanel.rotation.set(1.2,2,0);

// bending the plane
function planeCurve(g, z){

  let p = g.parameters;

  let hw = p.width * .5;


  let a = new THREE.Vector2(-hw, 0);
  let b = new THREE.Vector2(0, z);
  let c = new THREE.Vector2(hw, 0);

  let ab = new THREE.Vector2().subVectors(a, b);
  let bc = new THREE.Vector2().subVectors(b, c);
  let ac = new THREE.Vector2().subVectors(a, c);

  let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));

  let center = new THREE.Vector2(0, z - r);
  let baseV = new THREE.Vector2().subVectors(a, center);
  let baseAngle = baseV.angle() - (Math.PI * 0.5);
  let arc = baseAngle * 2;

  let uv = g.attributes.uv;
  let pos = g.attributes.position;
  let mainV = new THREE.Vector2();
  for (let i = 0; i < uv.count; i++){
  	let uvRatio = 1 - uv.getX(i);
    let y = pos.getY(i);
    mainV.copy(c).rotateAround(center, (arc * uvRatio));
    pos.setXYZ(i, mainV.x, y, -mainV.y);
  }

  pos.needsUpdate = true;

}

//world plane
const planeGeometry = new THREE.PlaneBufferGeometry(300,150,100,100);
const planeMaterial = new THREE.MeshBasicMaterial({
  // color:0x1e6dae,
  // color:0x89CFF0,
  color:0xececec,
  map:planeTexture,
  // map:mainBack,
  transparent:true,
  opacity:.4,

})
// const shadowPlaneGeo = new THREE.PlaneBufferGeometry(3,1.5,200,200);
const shadowPlaneGeo = new THREE.RingGeometry(0,.5,164);
const shadowPlaneMat =new THREE.MeshPhongMaterial({side:THREE.FrontSide,transparent:true,opacity:0,emissive:0xececec});


const shadowPlane = new THREE.Mesh(shadowPlaneGeo,shadowPlaneMat);
shadowPlane.receiveShadow=true;
shadowPlane.castShadow=true;
// console.log(shadowPlane);
shadowPlane.position.set(-0.5,-15.6,-2.4);
shadowPlane.rotation.x=-1.5;
const plane = new THREE.Mesh(planeGeometry,planeMaterial);

scene.add(plane,shadowPlane);
plane.position.set(0,0,-100);
let torR= 2;
if(window.innerWidth<800){
  impactVideoGeometry= new THREE.BoxGeometry(1.5,1.5,1.5,10,10,10);
  torR=1.7;
}
if(window.innerWidth<600){
  torR=.8;
}
//torus
let torusGeo = new THREE.TorusGeometry(torR,.2,30,120);
// let torusGeo2 = new THREE.TorusGeometry(1.5,.2,20,120);
let torusGeo2 = new THREE.TorusGeometry(1.4,.2,20,70);


const torusMaterial= new THREE.PointsMaterial({size:0.01,transparent:true,opacity:.6,color:0xff0000});
const torus2Material= new THREE.PointsMaterial({color:0xff0000,size:0.015,transparent:true,opacity:0});
const helper = new THREE.PlaneHelper(localPlane2,2,0x00ff00);
const helper2 = new THREE.PlaneHelper(localPlane3,2,0x0000ff);
// scene.add(helper,helper2);
const torus= new THREE.Points(torusGeo,torusMaterial);
const torus2= new THREE.Points(torusGeo2,torus2Material);
torus2.castShadow=true;
// console.log(torus2);
scene.add(torus2);
torus2.position.set(-8.8,-15,-.9);
 // x:-1.4,
 //  y:-15.5,
 //  z:-1
torus2.rotation.set=(2,2,0);


groupTwo.add(torus);
scene.add(particlesMesh);
scene.add(camera);
camera.position.set(0,0,5);


// const controls = new OrbitControls(camera,canvas);
let bio, dish, location,phone,mail,mail2;

const gLoader = new GLTFLoader();
// gLoader.load('./3d/envelope.glb',function(gltf){
//   scene.add(gltf.scene);
//   mail=gltf.scene.children[0].children[0].children[0].children[0].children[0];
// mail.scale.set(100,300,100);
// mail.material=new THREE.MeshBasicMaterial({color:0xff0000});
//
//
// console.log(mail.rotation);
//
// gui.add(mail.rotation,'x',-3,3).name('mail r x');
//
//
//
//
// })
gLoader.load('./3d/mail_icon.glb',function(gltf){
  scene.add(gltf.scene);
  console.log(gltf.scene);
  mail=gltf.scene.children[0].children[0].children;
  mail[0].material=new THREE.MeshBasicMaterial({transparent:true,opacity:0})

  // mail[0].material.color.r=1;
  // mail[0].material.color.b=1;
  // mail[0].material.color.g=1;
  // mail[0].material.emissive=0xececec;
mail[1].castShadow=true;

  for(let i=0;i<gltf.scene.children[0].children[0].children.length;i++){
    mail[i].scale.set(.1,.1,.1);

    mail[i].material.opacity=0;
    mail[i].material.transparent=true;
    mail[i].position.set(0,-20,10);


  }
  mail[1].scale.set(.15,.15,.15);
  mail[0].scale.set(0,0,0);
  console.log(mail[0].material.opacity,mail[0].material.opacity);

// mail[1].scale.set(.8,.8,.8);
  // mail.scale.set(.5,.5,.5);
  // mail2.scale.set(.5,.5,.5);
  // gui.add(mail[1].position,'x',-3,2).name('loca p x');
  // gui.add(mail[1].position,'y',-3,4).name('loca p y');
  // gui.add(mail[1].position,'z',-17,4).name('loca p z');
  // gui.add(mail[1].rotation,'z',-17.5,-14).name('loca r z');

})
gLoader.load('./3d/map_pointer.glb',function(gltf){
  scene.add(gltf.scene);
  location= gltf.scene.children[0].children[0].children[0];
  location.material= new THREE.MeshPhysicalMaterial({emissive:0x121212,transparent:true,opacity:0});
    location.position.set(-19.49,.89,10);
  // location.position.set(-1.49,.89,-15);
  location.rotation.set(0,0,-6.2);
  location.scale.set(.1,.1,.1);
  location.castShadow=true;
  // gui.add(location.position,'x',-3,2).name('loca p x');
  // gui.add(location.position,'y',-3,4).name('loca p y');
  // gui.add(location.position,'z',-17.5,-14).name('loca p z');
  // gui.add(location.rotation,'x',-3,2).name('loca r x');
  // gui.add(location.rotation,'y',-3,2).name('loca r y');
  // gui.add(location.rotation,'z',-20,2).name('loca r z');
  // console.log(location);
})
gLoader.load('./3d/telephone_receiver.glb',function(gltf){
  scene.add(gltf.scene);
  phone= gltf.scene.children[0].children[0].children[0];
  phone.material= new THREE.MeshPhysicalMaterial({emissive:0x121212,transparent:true,opacity:0});
  phone.position.set(-13,-7.7,3);
  phone.rotation.set(.1,-.08,-1.69);
  phone.scale.set(.4,.4,.4);
  // phone.rotation.set(0,0,0);
  phone.castShadow=true;
  // gui.add(phone.position,'x',-14,-12).name('phone p x');
  // gui.add(phone.position,'y',-15,2).name('phone p y');
  // gui.add(phone.position,'z',-15.5,3).name('phone p z');
  // gui.add(phone.rotation,'x',-3,2).name('phone r x');
  // gui.add(phone.rotation,'y',-3,2).name('phone r y');
  // gui.add(phone.rotation,'z',-20,2).name('phone r z');
  // console.log(phone);
})
gLoader.load('./3d/dish 2.glb',function(gltf){
  scene.add(gltf.scene);


  gltf.scene.children[0].castShadow=true;
  dish= gltf.scene.children[0].children[0].children[0].children[0].children[0];
  dish.scale.set(.04,.04,.04);
  dish.position.set(8,-15,5);
  dish.castShadow=true;
  dish.material.metalness=.2;
  // dish.receiveShadow=true;

  // dish.material= new THREE.MeshBasicMaterial({opacity:0,transparent:true});
dish.material.transparent=true;
  dish.material.opacity=0;
dish.rotation.y=6;
dish.wireframe=true;

group.add(dish,shadowPlane,torus);
scene.add(group);
// console.log(gltf.scene,dish);
  let sectionFour = gsap.timeline({
    scrollTrigger:{
      trigger:'.impact',
      start:'1% top',
      end:'bottom',
      snap:1,
      scrub:true,
      ease:'none',

    }

  });

  sectionFour
  .to(document.body,{
    overflow:'hidden',

  },'simultaneously')

  .to(dirLight.position,{
    x:2.5,
    y:2,
    z:3.5
  })

  .to(impactVideoCube.rotation,{
    y:2,
    duration:1.8,
    ease:'none'
  })
  .to(impactVideoCube.position,{
    z:5,
    duration:2.5,
    ease:'power1'
  })

  .to(impactVideoMat,{
    opacity:0,
    duration:1,
    ease:'none'
  },'simultaneously')
  .to(shadowPlane.material,{
    opacity:.8,
    delay:1.2,
    duration:6,
    ease:'none'
  })

  .to(dish.position,{
    x:-.4,
    y:-15.6,
    z:-2.2,
    duration:2,
    ease:'none'
  })

  .to(dish.position,{
    x:-.45,
    duration:1.8,
    ease:'power2'
  })

  .to(dish.rotation,{
    y:-.1,
    duration:5.8,
    ease:'none'
  })
  .to(camera,{
    fov:75,
  },'simultaneously')
  .to(dish.material,{
    opacity:.3,
    delay:1
  },'simultaneously')
  .to(torus2Material,{
    opacity:1,
    ease:'none',
    duration:2,
  },'simultaneously')
  .to(torus2.rotation,{
    x:1,
    y:-.6,
    z:-1,
    duration:10,

  },'simultaneously')
  .to(torus2.position,{
    x:0.4,
    y:-15.4,
    z:-1.86,
    duration:4,
    ease:'none',
  })
  .to(dish.material,{
    opacity:1,
    duration:1,
    ease:'none'
  })
  .to(phone.position,{
    z:3,
    duration:1.5,
    ease:'power1.out'
  },'simultaneously')
  .to(location.position,{
    z:3,
    duration:1.5,
    ease:'power1.out'
  },'simultaneously')
  .to('.holder-1',{
    width:'50vw',

  },'simultaneously')

  .to('.holder-2',{
    width:'50vw',
  },'simultaneously')
  .to('.holder-1 h2',{
    rotateZ:0,
    opacity:1,
    fontSize:'1.4rem',
    top:'75%',
    // y:50,
  },'simultaneously')
  .to('.holder-2 h2',{
    rotateZ:0,
    opacity:1,
    fontSize:'1.9rem',
    // y:50,
    top:'25%',
  },'simultaneously')
  .to('.holder-3 h2',{
    rotateZ:0,
    opacity:1,
    fontSize:'1.9rem',
    // y:50,
    top:'75%',
  },'simultaneously')
  .to(document.body,{
    overflowX:'hidden',
    overflowY:'auto'
  })
  // .to(canvas,{
  //   position:'absolute',
  //   bottom:'100%',
  //   left:0,
  // })



  // gui.add(dish.position,'x',-3,2).name('dish p x');
  // gui.add(dish.position,'y',-16,-14).name('dish p y');
  // gui.add(dish.position,'z',-3,2).name('dish p z');
  // gui.add(dish.rotation,'x',-2,2).name('dish r x');
  // gui.add(dish.rotation,'y',-2,2).name('dish r y');
  // gui.add(dish.rotation,'z',-2,2).name('dish r z');

})

gLoader.load('./3d/biologo.glb',function(gltf){
  scene.add(gltf.scene);
  bio = gltf.scene.children[0];
  gltf.scene.scale.set(.038,.038,.038);
  bio.rotation.z= 1.6;
  gltf.scene.position.x=-2.1;
  gltf.scene.position.y=.25;



  bio.material= new THREE.MeshPhongMaterial({color:0xff0000,shininess:40,reflectivity:30})



})
let tex;
gLoader.load('./3d/more 2.glb',function(gltf){
  scene.add(gltf.scene);
  // gltf.scene.scale.set(0.28,.28,28);
  tex= gltf.scene.children[0];
  tex.material= new THREE.MeshBasicMaterial({
    // color:0xff0000,
    color:0x202020,
    clippingPlanes:[localPlane],
    clipShadows:true
  })


// console.log(groupTwo);
  tex.scale.set(.035,.035,.035);
  tex.position.z= -.01;
  tex.position.y= -.01;
  tex.position.x=-0.03;
  // tex.rotation.z= -.001;
  // tex.rotation.y=.01;
  function texAnim(){
    requestAnimationFrame(texAnim)
    tex.rotation.y+=0.002;
  }
// texAnim();
//   gui.add(tex.rotation,'x',-5,5).name('text rotation x');
// gui.add(tex.rotation,'y',-5,5).name('text rotation y');
// gui.add(tex.position,'y',-5,5).name('text position y');
// gui.add(tex.position,'x',-5,5).name('text position x');
// gui.add(tex.rotation,'z',-5,5).name('text rotation z');

})
groupTwo.add(tex,torus,bio);
//lights
const light= new THREE.AmbientLight(0xffffff,.1);
const dirLight = new THREE.DirectionalLight(0xff0000,1)
// dirLight.castShadow=true;


dirLight.position.set(-1.39,-1.4,3.5);
// dirLight.decay=10;
// const pLight= new THREE.PointLight(0x0000aa,1);
const pLight= new THREE.PointLight(0xababab,1);
pLight.position.set(-3.3,-12,-1.1);
pLight.castShadow=true;
scene.add(dirLight,pLight);

// const gui = new dat.GUI();
// gui.add(dirLight.position,'x',-15,15).name('dirLight x');
// gui.add(dirLight.position,'y',-15,15).name('dirLight y');
// gui.add(dirLight.position,'z',-15,15).name('dirLight z');
// gui.add(impactVideoCube.position,'x',-15,10).name('impCube p x');
// gui.add(impactVideoCube.position,'y',-25,10).name('impCube p y');
// gui.add(impactVideoCube.position,'z',-28,10).name('impCube p z');
// gui.add(impactVideoCube.rotation,'x',-6,6).name('impCube r x');
// gui.add(impactVideoCube.rotation,'y',-6,6).name('impCube r y');
// // gui.add(impactVideoCube.rotation,'z',-2,5).name('impCube r z');
// gui.add(impactVideoCube.rotation,'z',-6,6).name('impCube r z');
// gui.add(pLight.position,'x',-15,15).name('pLight x');
// gui.add(pLight.position,'y',-15,15).name('pLight y');
// gui.add(pLight.position,'z',-15,15).name('pLight z');

// gui.add(torus.rotation,'z',-5,5).name('torus rot z');
// gui.add(torus2.rotation,'z',-5,5).name('torus2 rot z');
// gui.add(localPlane2.normal,'x',-10,10).name('plane2 x');
// gui.add(localPlane2.normal,'y',-10,10).name('plane2 y');
// gui.add(localPlane2,'constant',-5,5).name('plane2');
// gui.add(localPlane.normal,'x',-10,10).name('plane3 x');
// gui.add(localPlane.normal,'y',-10,10).name('plane3 y');
// gui.add(localPlane,'constant',-5,5).name('plane3');
// gui.add(shadowPlane.rotation,'x',-3,3).name('shadowPlane r x');
// gui.add(shadowPlane.rotation,'y',-3,3).name('shadowPlane r y');
// gui.add(shadowPlane.rotation,'z',-3,3).name('shadowPlane r z');
// gui.add(shadowPlane.position,'x',-20,3).name('shadowPlane p x');
// gui.add(shadowPlane.position,'y',-20,3).name('shadowPlane p y');
// gui.add(shadowPlane.position,'z',-20,3).name('shadowPlane p z');
// gui.add(torus2.position,'x',-20,3).name('torus2 p x');
// gui.add(torus2.position,'y',-20,3).name('torus2 p y');
// gui.add(torus2.position,'z',-20,3).name('torus2 p z');
// gui.add(torus2.rotation,'x',-3,3).name('torus2 r x');
// gui.add(torus2.rotation,'y',-3,3).name('torus2 r y');
// gui.add(torus2.rotation,'z',-3,3).name('torus2 r z');

scene.add(groupTwo);
document.addEventListener('mousemove',onDocumentMouseMove)
let mouseX= 0;
let mouseY=0;

let targetX=0;
let targetY=0;
const windowX= window.innerWidth/ 2;
const windowY= window.innerHeight/2;

function onDocumentMouseMove(event){
  mouseX= (event.clientX - windowX);
  mouseY = (event.clientY-windowY);
}
//update aspect on resize
window.addEventListener('resize', () =>{
  //update sizes
  sizes.width=window.innerWidth;
  sizes.height=window.innerHeight;


  //Update camera
  camera.aspect= sizes.width/sizes.height;

  // camera.updateProjectionMatrix();
  camera.updateProjectionMatrix();

  //Update renderer

  renderer.setSize(window.innerWidth,window.innerHeight);

  renderer.setPixelRatio(devicePixelRatio);
})


var follow = document.querySelector('.follow');
var cursor = document.querySelector('.cursor');
gsap.set('.follow',{xPercent:-50,yPercent:-50});
gsap.set('.cursor',{xPercent:-50,yPercent:-50});
window.addEventListener('mousemove',e=>{
  gsap.to(cursor,0,{x:e.clientX,y:e.clientY});
  gsap.to(follow,.3,{x:e.clientX,y:e.clientY});
});
play.addEventListener('mouseover',()=>{
  gsap.to(play,.5,{
    ease:'power2.inOut',
    scale:'1.1',
  })
});
play.addEventListener('mouseleave',()=>{
  gsap.to(play,.5,{
    scale:'1',
    ease:'power2.inOut',

  })
});
mute.addEventListener('mouseover',()=>{
  gsap.to(mute,.5,{
    scale:'1.1',
    ease:'power2.inOut'
  })
});
mute.addEventListener('mouseleave',()=>{
  gsap.to(mute,.5,{
    scale:'1',
    ease:'power2.inOut'
  })
});
const found = ray.intersectObjects(scene.children);
window.addEventListener('click', event=>{
  mouse.x = (event.clientX/window.innerWidth) *2-1;
  mouse.y = (event.clientY/window.innerHeight) *2+1;

  ray.setFromCamera(mouse,camera);
// for ( let i = 0; i < found.length; i ++ ) {
//   if(found[i].object.material==='MeshBasicMaterial'){
//     found[i].object.material.color.set(0xff00ab);
//     console.log(found[i]);
//   }
//
//
// 		// found[i].object.material.color.set(0xff0000);
//     // gsap.to(found[i].object.material.color,{
//     //   r:1,
//     //   g:0,
//     //   b:1,
//     //   duration:1,
//     //   ease:'none'
//     // })
//
//     // console.log(found);
//     //
//     // if(found[i].object.type='planeGeometry'){
//     //   found[i].object.material.opacity=0;
//     // }
//     // found[i].object.material=new THREE.MeshBasicMaterial({color:0xff00ab});
//
// 	}

})
// console.log(found);
const clock = new THREE.Clock();
function animate(){





  renderer.render(scene,camera);
  requestAnimationFrame(animate);
  camera.updateProjectionMatrix();
  torus.rotation.z-=0.0002;


  torus2.rotation.z+=0.0005;
  // impactVideoCube.rotation.y+=0.001;
  // impactVideoCube.rotation.x+=0.001;
  // impactVideoCube.rotation.z+=0.001;
  // dish.rotation.z+=.001;


// tex.rotation.y-=0.01;

targetX= mouseX * 0.001;
targetY= mouseY * 0.001;
const elapsedTime= clock.getElapsedTime();
particlesMesh.rotation.x= -.009 *elapsedTime;
particlesMesh.rotation.z= -.009 *elapsedTime;
if(mouseX < window.innerWidth || mouseY <window.innerHeight ){
particlesMesh.rotation.x = -(mouseY *0.00005);
particlesMesh.rotation.y = -(mouseX *0.00003);
curvedPanel.rotation.y= -(mouseX *0.00001)+2;
// curvedPanel.rotation.z= -(mouseY *0.00001);

}


}
animate()
const cards=document.querySelector('.cards');
const card= document.querySelectorAll('.card');
const veed=document.querySelector('.veed');
const space=document.querySelector('.space');

//sectionOne timeline
let sectionOne = gsap.timeline({
  scrollTrigger:{
    trigger:canvas,
    start:'top top',
    end:"bottom",
    scrub:true,
    snap:1,
    // pin:true,
    // snap:space.bottom,
    // markers:true,
    // pinSpacing:false,
    ease:'none'

  }

});
sectionOne
.to(document.body,{
  overflow:'hidden',
})
.to(camera.position,{
  y:-1.1,
  z:-.28,
  x:1.35,
  duration:4,},"simultaneously")
  .to(camera,{
    fov:75,
  },'simultaneously')
  .to(camera.rotation,{
    x:0,
    y:-1,
    z:0,
    duration:4,
  },"simultaneously")
  .to(torusMaterial.color,{
      r:1,
      g:.05,
      b:.1,
      duration:2,
      ease:'power1',
    })
    .to('.holder-1',{
      width:'50vw',

    },'simultaneously')
    .to('.holder-2',{
      width:'50vw',

    },'simultaneously')
    .to('.holder-3',{
      width:'50vw',
    },'simultaneously')
    .to('.holder-1 h2',{
      rotateZ:0,
      opacity:1,
      fontSize:'1.9rem',
      top:'75%',
      // y:50,
    },'simultaneously')
    .to('.holder-2 h2',{
      rotateZ:0,
      opacity:1,
      fontSize:'1.9rem',
      // y:50,
      top:'25%',
    },'simultaneously')
    .to('.holder-3 h2',{
      rotateZ:0,
      opacity:1,
      fontSize:'1.9rem',
      // y:50,
      top:'75%',
    },'simultaneously')

    .to(document.body,{
      overflowX:'hidden',
      overflowY:'scroll'
    },'simultaneously')
  //swiper animation
  gsap.from('.cards .swiper',{
    opacity:0,
    scale:.1,
    duration:.5,
    ease:'power1',
    scrollTrigger:{
      trigger:'.cards',
      toggleActions:"play reset play reverse",
      start:"-10% top",
      end:"bottom"
    }
  })
  gsap.from('.cards hr',{
    opacity:0,
    scaleX:0,
    duration:2,
    ease:'power1',
    scrollTrigger:{
      trigger:'.cards',
      toggleActions:"play reset play reverse",
      start:"-10% top",
      end:"bottom"
    }
  })
  let points = document.querySelectorAll('.impact-cont li');
  points.forEach((point)=>{
    gsap.from(point,{
      opacity:0,
      xPercent:200,
      duration:1,
      stagger:.2,
      scrub:true,
      ease:'none',
      scrollTrigger:{
        trigger:'.impact-cont',
        toggleActions:"play reverse play reverse",
        start:'-20% top',
        end:'bottom'
      }
    })
  })
  gsap.from('.prods-holder',{
    opacity:0,
    xPercent:-100,
    scrub:true,
    duration:.8,
    // delay:.8,
    ease:'none',
    scrollTrigger:{
      trigger:'.prods',
      toggleActions:"play reverse play reverse",
      start:"-50% top",
      end:"bottom"
    }
  })

  //cards animation
  // gsap.from(card,{
  //   y:-100,
  //   x:-100,
  //   opacity:0,
  //   duration:2,
  //   stagger:0.4,
  //   ease:'power1',
  //   // markers:true,
  //   scrollTrigger:{
  //     trigger:'.cards-cont',
  //     toggleActions:"play reset play none",
  //
  //     start:"top top",
  //     end:"bottom",
  //   }
  //
  // })
  // card.forEach(car =>{
  //   let hover= gsap.to(car,{scale:1.1,duration:.5,ease:'power1'});
  //   car.addEventListener('mouseover',() => hover.play());
  //   car.addEventListener('mouseleave',() => hover.reverse());
  // });
  //sectionTwo timeline
  let sectionTwo = gsap.timeline({
    scrollTrigger:{
      trigger:cards,
      start:'top top',
      // pin:true,
      end:'bottom',
      scrub:true,
      snap:1,
      // markers:true,
      // pinSpacing:false,
      ease:'none',
      // onUpdate: self => {
      //     console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity());
      //   }
    }


  });
  sectionTwo
  .to(document.body,{
    overflow:'hidden',
  },'simultaneously')
  .to(camera,{
    fov:75,
  },'simultaneously')
  .to(camera.position,{
    x:0,
    y:0,
    z:-10,
    duration:2,

  },"simultaneously")
  .to(camera.rotation,{
    x:1.2,
    y:2,
    z:0,
    duration:2,

  },"simultaneously")
  .to(mat,{

    opacity:1
  },"simultaneously")
  .to(curvedPanel.position,{
    x:-5,
    y:-2.1,
    z:-9.2,
  },"simultaneously")
  .to(scene.background,{
    r:0,
    g:0,
    b:0,
  },'simultaneously')
  .from('#play',{
    xPercent:-800,

    opacity:0,


  },'simultaneously')
  .from("#mute",{
    xPercent:800,

    opacity:0,

  },'simultaneously')
  .to('.holder-1',{
    width:'50vw',

  },'simultaneously')
  .to('.holder-2',{
    width:'50vw',

  },'simultaneously')
  .to('.holder-3',{
    width:'50vw',
  },'simultaneously')
  .to('.holder-1 h2',{
    rotateZ:0,
    opacity:1,
    fontSize:'1.9rem',
    top:'75%',
    // y:50,
  },'simultaneously')
  .to('.holder-2 h2',{
    rotateZ:0,
    opacity:1,
    fontSize:'1.9rem',
    // y:50,
    top:'25%',
  },'simultaneously')
  .to('.holder-3 h2',{
    rotateZ:0,
    opacity:1,
    fontSize:'1.9rem',
    // y:50,
    top:'75%',
  },'simultaneously')
  .to(document.body,{
    overflowX:'hidden',
    overflowY:'scroll'
  })
let sectionTwoHalf =gsap.timeline({
  scrollTrigger:{
    trigger:'.veed',
    start:'1% top',
    end:'bottom',
    snap:1,
    scrub:true,
    ease:'none'
  }
});
sectionTwoHalf
.to(document.body,{
  overflow:'hidden',
})
.to(camera.position,{
  x:-1,
  y:0,
  z:-5
},'simultaneously')
.to(camera.rotation,{
  x:0,
  y:0,
  z:0,
},'simultaneously')
.to(curvedPanel.material,{
  opacity:0,
},'simultaneously')
.to('#play',{
  opacity:0,
  xPercent:-1000
},'simultaneously')
.to('#mute',{
  opacity:0,
  xPercent:1000
},'simultaneously')
.to('.holder-1',{
  width:'30vw',


},'simultaneously')
.to('.holder-2',{
  width:'30vw',
  // height:'60vh'

},'simultaneously')
// .to('.holder-1 .over',{
//   background:'none'
// },'simultaneously')
.to('.holder-3',{
  width:'30vw',
  // height:'60vh'
},'simultaneously')
.to('.holder-1 h2',{
  rotateZ:0,
  opacity:1,
  fontSize:'1.9rem',
  top:'75%',
  // y:50,
},'simultaneously')
.to('.holder-2 h2',{
  rotateZ:'90deg',
  opacity:1,
  fontSize:'1.4rem',
  // y:50,
  top:'45%',
},'simultaneously')
.to('.holder-3 h2',{
  rotateZ:'90deg',
  opacity:1,
  fontSize:'1.4rem',
  // y:50,
  top:'45%',
},'simultaneously')
.to(document.body,{
  overflowX:'hidden',
  overflowY:'scroll'
})
// sectionTwoHalf
// .from('.products-holder',{
//   xPercent:-100,
//   delay:.8,
//   duration:1,
//
//
// })
let sectionThree = gsap.timeline({
  scrollTrigger:{
    trigger:'.prods',
    start:'1% top',
    // endTrigger:'.impact',
    end:'bottom',
    makers:true,
    scrub:true,
    snap:1,
    ease:'none',

  }
});
sectionThree
.to(document.body,{
  overflow:'hidden',
})
.to(camera.position,{
  x:0,
  y:-15,
  z:0
},'simultaneously')
.to(camera.rotation,{
  x:0,
  y:7,
  z:0
},'simultaneously')
.to(camera,{
  fov:50,
})
.from('.impact-cont',{
  xPercent:150,
  delay:2,
  duration:2,
  ease:'none',
})
.to(impactVideoCube.position,{
  x:-10,
  y:-15,
  z:-5,
  duration:4,
},'simultaneously')
.to(impactVideoCube.rotation,{
  x:1,
  y:2.3,
  z:0
},'simultaneously')
.to(impactVideoMat,{
  opacity:1,

},'simultaneously')
// .to('.holder-1',{
//   width:'90vw',
//
// },'simultaneously')
// .to('.holder-2',{
//   width:'8vw',
//
// },'simultaneously')
// .to('.holder-3',{
//   width:'8vw',
//
// },'simultaneously')
// .to('.holder-1 h2',{
//   rotateZ:0,
//   opacity:1,
//   fontSize:'1.9rem',
//   top:'75%',
//   // y:50,
// },'simultaneously')
// .to('.holder-2 h2',{
//   rotateZ:0,
//   opacity:1,
//   fontSize:'1.9rem',
//   // y:50,
//   top:'25%',
// },'simultaneously')
// .to('.holder-3 h2',{
//   rotateZ:0,
//   opacity:1,
//   fontSize:'1.9rem',
//   // y:50,
//   top:'75%',
// },'simultaneously')
// .to(mail[0].material,{
//   opacity:0,
// },'simultaneously')
// .to(mail[1].material,{
//   opacity:0,
// },'simultaneously')
.to(document.body,{
  overflowX:'hidden',
  overflowY:'scroll'
})
const holder1= document.querySelector('.holder-1');
const holder2= document.querySelector('.holder-2');
const holder3= document.querySelector('.holder-3');
holder3.addEventListener('mouseleave',function(){
  gsap.to('.holder-3 .over',{
    background:'rgba(0,0,0,.9)'
  })
  gsap.to('.holder-3 .writeup',{
    opacity:0
  })
  holder3.querySelector('video').pause();
})
holder3.addEventListener('mouseover',function(){
  holder3.querySelector('video').play();
  gsap.to('.holder-3 .over',{
    background:'rgba(0,0,0,0)'
  })
  gsap.to('.holder-3 .writeup',{
    opacity:1
  })
gsap.to(holder3,{
  width:'90vw',
  height:'90vh'

})
gsap.to(holder2,{
  width:'8vw',
  // height:'60vh'
})
gsap.to(holder1,{
  width:'8vw',
  // height:'60vh'
})
gsap.to(holder2.querySelector('h2'),{
  opacity:1,
  fontSize:'1.4rem',
  rotateZ:'90deg',
  width:300,
  // y:'500%',
  top:'50%',

})
gsap.to(holder1.querySelector('h2'),{
  fontSize:'1.4rem',
  opacity:1,
  fontSize:'1.4rem',
  rotateZ:'90deg',
  width:300,
  // y:'-500%',
  top:'50%'

})
gsap.to(holder3.querySelector('h2'),{
  rotateZ:0,
  opacity:0,
  fontSize:'1.9rem',
})
gsap.to(holder1.querySelector('img'),{
  opacity:1,
})
gsap.to(holder2.querySelector('img'),{
  opacity:0,
})
})
holder1.addEventListener('mouseleave',function(){
  holder1.querySelector('video').pause();
  gsap.to('.holder-1 .over',{
    background:'rgba(255,255,255,.9)'
  })
  gsap.to('.holder-1 .writeup',{
    opacity:0
  })
})
holder1.addEventListener('mouseover',function(){
  holder1.querySelector('video').play();
  gsap.to('.holder-1 .over',{
    background:'rgba(0,0,0,0)'
  })
  gsap.to('.holder-1 .writeup',{
    opacity:1,


  })
gsap.to(holder1,{
  width:'90vw',
  height:'90vh'
})
gsap.to(holder2,{
  width:'8vw',
  // height:'60vh'
})
gsap.to(holder3,{
  width:'8vw',
  // height:'60vh'
})
gsap.to(holder2.querySelector('h2'),{
  opacity:1,
  fontSize:'1.4rem',
  rotateZ:'90deg',
  width:300,
  // y:'500%',
  top:'50%',

})
gsap.to(holder3.querySelector('h2'),{
  opacity:1,
  fontSize:'1.4rem',
  rotateZ:'90deg',
  width:300,
  // y:'500%',
  top:'50%',

})

gsap.to(holder1.querySelector('h2'),{
  rotateZ:0,
  opacity:0,
  fontSize:'1.9rem',
})

gsap.to(holder1.querySelector('img'),{
  opacity:1,
})
gsap.to(holder2.querySelector('img'),{
  opacity:0,
})
})
holder2.addEventListener('mouseleave',function(){
  holder2.querySelector('video').pause();
  gsap.to('.holder-2 .over',{
    background:'rgba(0,0,0,.7)'
  })
  gsap.to('.holder-2 .writeup',{
    opacity:0
  })
})

holder2.addEventListener('mouseover',function(){
  holder2.querySelector('video').play();
  gsap.to('.holder-2 .over',{
    background:'rgba(0,0,0,0)'
  })
  gsap.to('.holder-2 .writeup',{
    opacity:1
  })
gsap.to(holder2,{
  width:'90vw',
  height:'90vh'
})
gsap.to(holder1,{
  width:'8vw',
  // height:'60vh'
})
gsap.to(holder3,{
  width:'8vw',
  // height:'60vh'
})
gsap.to(holder1.querySelector('h2'),{
  fontSize:'1.4rem',
  opacity:1,
  fontSize:'1.4rem',
  rotateZ:'90deg',
  width:300,
  // y:'-500%',
  top:'50%',

})
gsap.to(holder3.querySelector('h2'),{
  fontSize:'1.4rem',
  opacity:1,
  fontSize:'1.4rem',
  rotateZ:'90deg',
  width:300,
  // y:'-500%',
  top:'50%',

})
// gsap.to(holder1.querySelector('img'),{
//   opacity:0,
// })
// gsap.to(holder2.querySelector('img'),{
//   opacity:1,
// })
gsap.to(holder2.querySelector('h2'),{
  rotateZ:0,
  opacity:0,
  fontSize:'1.9rem',
})

})
//impact cube animations

const good = document.getElementById('good');
const free = document.getElementById('free');
const zero = document.getElementById('zero');
const save = document.getElementById('save');
const control = document.getElementById('control');
const contain = document.getElementById('contain');

good.addEventListener('mouseover',function(){
  gsap.to(impactVideoCube.rotation,{
    x:-0.1,
    y:3.,
    z:-0.24,
    duration:2,
    ease:'power1.inOut',
  })
})

save.addEventListener('mouseover',function(){
  gsap.to(impactVideoCube.rotation,{
    x:5.1,
    y:1.3,
    z:1.1,
    duration:2,
    ease:'power1.inOut',
  })
})
zero.addEventListener('mouseover', function(){
  gsap.to(impactVideoCube.rotation,{
    x:1.5,
    y:3.4,
    z:4.5,
    duration:2,
    ease:'power2.inOut',
  })
})
free.addEventListener('mouseover',function(){
  gsap.to(impactVideoCube.rotation,{
    x:1.5,
    y:.3,
    z:-1.4,
    duration:2,
    ease:'power2.inOut',
  })
})
control.addEventListener('mouseover',function(){
  gsap.to(impactVideoCube.rotation,{
    x:-0.8,
    y:-1.85,
    z:-0.7,
    duration:2,
    ease:'power2.inOut',
  })
})
contain.addEventListener('mouseover',function(){
  gsap.to(impactVideoCube.rotation,{
    x:0,
    y:-0.2,
    z:0.3,
    duration:2,
    ease:'power1.inOut',
  })
})
//contact details animations
const telephone = document.querySelector('.phone');
const marker = document.querySelector('.address');
const email = document.querySelector('.email');
const inp= document.querySelector('.mailer input');

inp.addEventListener('focus',inpAnim);

inp.onkeydown = function(){
  if(event.keyCode== 8 || event.keyCode== 46){
    gsap.to(dish.rotation,{
      y:'-=0.2',
      duration:.5,
      ease:'power1'
    })

  }
  else{
    gsap.to(dish.rotation,{
      y:'+=0.5',
      duration:.5,
      ease:'power1'
    })
  }
}
// function inpAnim2(e){
// //   if(inp.value.length>0){
// //     gsap.to(dish.rotation,{
// //       y:'+=0.5',
// //       duration:.5,
// //       ease:'power1'
// //     })
// //
// //
// // }
// // else if(inp.value.length===0){
// //   gsap.to(dish.rotation,{
// //     y:0,
// //     duration:.5,
// //     ease:'power1'
// //   })
// // }
//
//
// }
function inpAnim(){
  let animation = gsap.timeline();

  gsap.to(phone.position,{
    z:3,
  })

  gsap.to(location.position,{
    z:3,
  })
  gsap.to(mail[1].position,{
    z:3,
  })
  animation.to(dish.position,{
    x:-.45,
    y:-15.6,
    z:-2.2,
    duration:2,
    ease:'none'
  })
}
function emailAnim(){
  let animation = gsap.timeline();

  gsap.to(phone.position,{
    z:3,
  })
  gsap.to(dish.position,{
    z:3,
  })
  gsap.to(location.position,{
    z:3,
  })
  animation
  .to(mail[0].position,{
    x:-.5,
    y:2.2,
    z:-15.65,
    duration:1,
    ease:'power1'
  },'simultaneously')
  .to(mail[0].material,{
    opacity:0,
    ease:'power1'
  },'simultaneously')
  .to(mail[1].position,{
    x:-.45,
    y:2.35,
    z:-15.45,
    duration:1,
    ease:'power1'
  },'simultaneously')
  .to(mail[1].material,{
    opacity:1,
    ease:'power1'
  },'simultaneously')
  .to(mail[0].rotation,{
    z:6.2,
    delay:1,
    duration:1
  },'simultaneously')
  .to(mail[1].rotation,{
    z:6.2,
    delay:1,
    duration:1
  },'simultaneously')





}
function addressAnim(){
  let animation = gsap.timeline();
  // gsap.to(location.position,{
  //   z:10,
  // })
  gsap.to(dish.position,{
    z:10,
  })
  gsap.to(phone.position,{
    z:3,
  })
  gsap.to(mail[0].position,{
    z:10,
  })
  gsap.to(mail[1].position,{
    z:10,
  })
  animation
  .to(location.position,{
    x:-.45,
    y:2.36,
    z:-15.4,
    duration:1.5,
    ease:'power1.out'
  },'simultaneously')
  .to(location.material,{
    opacity:1,
    duration:.4,
    ease:'power1'
  })
  .from(location.rotation,{
    x:0,
    y:0,
    z:-.5,
    duration:1,
    ease:'none'
  })

}
function phoneAnim(){
  let animation = gsap.timeline();
  // gsap.to(location.position,{
  //   z:10,
  // })
  gsap.to(dish.position,{
    z:3,
  })
  gsap.to(mail[0].position,{
    z:10,
  })
  gsap.to(mail[1].position,{
    z:10,
  })
  gsap.to(location.position,{
    z:3,
  })
  animation
  .to(phone.position,{
    z:-2.3,
    y:-8.7,
    x:-12.65,
    // x:-.4,
    duration:1.2,
    ease:'power1.out'
  })
  .to(phone.material,{
    opacity:1,
    duration:.4,
    ease:'power1'
  })
  .from(phone.rotation,{
    x:-1,
    y:-2,
    z:-1,
    // duration:1,
    ease:'none'
  })
}
var timeoutId = null;
telephone.addEventListener('mouseover',function(){
  timeoutId = window.setTimeout(function(){
    phoneAnim();
  },700)
});
telephone.addEventListener('mouseleave',clear);
marker.addEventListener('mouseover',function(){
  timeoutId=window.setTimeout(function(){
    addressAnim();
  },700)
});
marker.addEventListener('mouseleave',clear);

// marker.forEach(mark => {
//   mark.addEventListener('mouseover',addressAnim);
// })
email.addEventListener('mouseover',function(){
  timeoutId=window.setTimeout(function(){
    emailAnim();
  },700)
});
email.addEventListener('mouseleave',clear)
function clear(){
  window.clearTimeout(timeoutId);
}
// console.log(camera);
// gsap.to(card, {
//
//   opacity: 0,
//   duration: 3,
//   ease: "power2",
//   stagger: 0.2,
//   markers:true,
//   scrollTrigger: {
//     trigger: cards,
//     containerAnimation: sectionOne,
//     start: "bottom 100% ",
//     toggleActions: "play none none none",
//     end: "bottom 100%",
//     // markers: true
//   }
// });

// gsap.to(camera.position,{
//   scrollTrigger:{
//     trigger:".veed",
//     start:"top center",
//     // snap:true,
//     end:".veed",
//     scrub:3,
//     markers:true
//   },
//
//   z:-10,
//   duration:4
// })

// gsap.to(camera.rotation,{
//   scrollTrigger:{
//     trigger:".veed",
//     start:"top center",
//     // snap:true,
//     end:".veed",
//     scrub:3,
//
//   },
//   x:1.2,
//   y:2,
//
//   duration:4
// })
