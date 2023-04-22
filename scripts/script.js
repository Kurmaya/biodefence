// import * as THREE from 'https://unpkg.com/three@0.139.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.139.1/examples/jsm/controls/OrbitControls'
import * as dat from "https://cdn.skypack.dev/dat.gui";
import {GLTFLoader} from './three/examples/jsm/loaders/GLTFLoader.js'
// import {RGBELoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/RGBELoader.js'
// import {RenderPass} from 'https://unpkg.com/three@0.139.1/examples/jsm/postprocessing/RenderPass.js'
// import {EffectComposer} from 'https://unpkg.com/three@0.139.1/examples/jsm/postprocessing/EffectComposer.js'
// import {UnrealBloomPass} from 'https://unpkg.com/three@0.139.1/examples/jsm/postprocessing/UnrealBloomPass.js'
// import {TTFLoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/TTFLoader.js'
// import {FontLoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/FontLoader.js'
// import {TextGeometry} from 'https://unpkg.com/three@0.139.1/examples/jsm/geometries/TextGeometry.js'
// import Stats from 'https://unpkg.com/three@0.139.1/examples/jsm/libs/stats.module.js'


let stats ;
stats = new Stats();

const positions = document.querySelectorAll('.positions button');

positions.forEach((position) => {
  position.addEventListener('click', function(){
    positions.forEach((pos) => {
      pos.classList.remove('active');

    });

    position.classList.add('active');
  })
});

// //loading manager
// THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
//
// 	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
//
// };
//
//
// THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
//
// 	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
//
// };
// THREE.DefaultLoadingManager.onLoad = function ( ) {
//
// 	console.log( 'Loading Complete!');
//
// };
//variable
let gui = new dat.GUI();
var container = document.querySelector('.container');
const sections = gsap.utils.toArray('.container section');
const text = gsap.utils.toArray('.anim');
const canvas = document.querySelector('canvas.webgl');
const contObjects = document.querySelector('.object');
const cam1= document.getElementById('cam1');
const cam2= document.getElementById('cam2');
const cam3= document.getElementById('cam3');
const cam4= document.getElementById('cam4');
const cam5 = document.getElementById('cam5');
const veedeeo= document.getElementById('video-texture');
document.body.appendChild(stats.dom);
veedeeo.currentTime =.1;
// veedeeo.play();
let videoTexture = new THREE.VideoTexture(veedeeo);

videoTexture.minFilter= THREE.LinearFilter;
videoTexture.magFilter= THREE.LinearFilter;

const mute = document.getElementById('mute');
const play = document.getElementById('play');
veedeeo.muted=false;
play.addEventListener('click',function(){
  play.classList.toggle('active');
  if(play.classList.contains('active')){
    veedeeo.play();
    play.textContent="Pause"

  }
  else if(!play.classList.contains('active')){
    veedeeo.pause();
    play.textContent="Play"
  }
})
mute.addEventListener('click', function(){
  mute.classList.toggle('muted');

   if (veedeeo.muted === true) {
     veedeeo.muted = false;
     mute.textContent="Mute";
   }
   else if (veedeeo.muted === false) {
     veedeeo.muted = true;
     mute.textContent="Unmute";
   }
})
//container width

container.style.width= sections.length*100+'vw';
//scenes
const scene= new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();

//sizes
const sizes = {
  width:window.innerWidth,
  height:window.innerHeight
}
//camera

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1,1000);
camera.position.set(0,0,3);
const camera2 = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,1000);
camera2.position.set(0,0,3);
const camera3 = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,1000);
camera3.position.set(0,0,3);
//clipping plane

const localPlane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ),.73 );
// const localPlane2 = new THREE.Plane( new THREE.Vector3( 5, 2, 0 ),.7 );
// const helper1 = new THREE.PlaneHelper( localPlane2, 1, 0xffab00 );
// scene.add(helper1);

const globalPlane = new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ), 0.1 );
//renderer

const renderer = new THREE.WebGLRenderer({
  antialias:true,
  canvas:canvas,
  alpha:true,

})
renderer.localClippingEnabled=true;
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(sizes.width,sizes.height);
scene.background= new THREE.Color(0xffffff);
// scene2.background= new THREE.Color(0x000000,.6);

const renderer2 = new THREE.WebGLRenderer({
  antialias:true,
  canvas:contObjects,
  alpha:true,
  // background:'#ececec',
  opacity:1
})
renderer2.setPixelRatio(devicePixelRatio);
renderer2.setSize(sizes.width,sizes.height);
renderer2.setClearColor(0x121212);
// renderer2.setClearColor(0x89CFF0,.5);
const renderer3 = new THREE.WebGLRenderer({
  antialias:true,
  canvas:document.querySelector('.object2'),
  alpha:true,
  // background:'#000000'
})
renderer3.setPixelRatio(devicePixelRatio);
renderer3.setSize(sizes.width,sizes.height);
renderer3.setClearColor(0x121212);
//assets and textures
const textureLoader = new THREE.TextureLoader();
const zz = textureLoader.load('./textures/zz.png');
const sph= textureLoader.load('./textures/sphere2.png');
const planeTexture = textureLoader.load('./textures/world.5292.png');
const bacon =  textureLoader.load('https://ik.imagekit.io/768eoiozf/biodefence/spek__kWsLLCSIH.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677310723217');
const gLoader =new GLTFLoader();
let bio,pig ;
gLoader.load('./3d/bd.glb', function(gltf){
  // scene.add(gltf.scene);
  bio = gltf.scene.children[0];
  gltf.scene.scale.set(.006,.006,.006);
  bio.rotation.x= 0;

  bio.position.set(0,0,0);

  bio.material= new THREE.MeshPhongMaterial({reflectivity:10,
  shininess:60,
});

if(screen.width<400){
  gltf.scene.scale.set(.004,.004,.004);
}
});

gLoader.load('./3d/BAcon.glb',function(gltf){
  scene2.add(gltf.scene);
  gltf.scene.position.set(0,-.1,-1);
  gltf.scene.scale.set(.05,.05,.05);
  gltf.scene.rotation.x=1.2;
  pig = gltf.scene.children[0];
  gltf.scene.children[0].material = new THREE.MeshPhysicalMaterial({map:bacon});
  if(screen.width<400){
    gltf.scene.scale.set(.03,.03,.03);

  }

})
let pills;
gLoader.load('./3d/pills.glb',function(gltf){
  scene3.add(gltf.scene);
  gltf.scene.position.set(0,0.1,2);
  gltf.scene.scale.set(18,18,18);
  gltf.scene.rotation.x=1.2;
  pills = gltf.scene.children[0];


  if(screen.width<400){
    gltf.scene.scale.set(15,15,15);
  }

})
let tex;
gLoader.load('./3d/more 2 (1).glb',function(gltf){
  scene.add(gltf.scene);
  // gltf.scene.scale.set(0.28,.28,28);
  tex= gltf.scene.children[0];
  tex.material= new THREE.MeshStandardMaterial({
    color:0xff0000,
    clippingPlanes:[localPlane],
    clipShadows:true
  })
  console.log(tex)

  tex.scale.set(.028,.028,.028);
  tex.position.z= -1;
  tex.position.y= .1;
  tex.rotation.z= -.001;
  tex.rotation.y=.1;

  gui.add(tex.rotation,'x',-5,5).name('text rotation x');
gui.add(tex.rotation,'y',-5,5).name('text rotation y');
gui.add(tex.position,'y',-5,5).name('text position y');
gui.add(tex.rotation,'z',-5,5).name('text rotation z');

})
console.log(localPlane)
//effects
const composer=new EffectComposer(renderer3);
composer.addPass(new RenderPass(scene3,camera3));
composer.addPass(new UnrealBloomPass({x:sizes.width, y:sizes.height},.5,2,.1));
const composer2=new EffectComposer(renderer2);
composer2.addPass(new RenderPass(scene2,camera2));
composer2.addPass(new UnrealBloomPass({x:sizes.width, y:sizes.height},.5,2,.5));
//objects
let tor=1.7;
if(screen.width<400){
  tor=1.2
}
else if(screen.width>679){
  tor=1.7
}

const planeGeometry = new THREE.PlaneBufferGeometry(500,200,100,100);
const videoPlaneGeometry = new THREE.PlaneBufferGeometry(10,5,100,100);
const videoSphere = new THREE.SphereGeometry(5,32,16);
const torusGeometry = new THREE.TorusGeometry(tor,.2,30,150);

//materials
const videoPlaneMaterial=  new THREE.MeshBasicMaterial({side:THREE.DoubleSide,
  transparent:true,
  opacity:1,
  // color:0xababab,
map:videoTexture,
toneMapped:false
});

const planeMaterial = new THREE.MeshBasicMaterial({
  // color:0x1e6dae,
  color:0x89CFF0,
  map:planeTexture,
  transparent:true,
  opacity:.6,

})

const torusMaterial = new THREE.PointsMaterial({
  size:0.01,
  // color:0xff005,
  color:0xff0000,
  transparent:true,
  opacity:1,

  // map:zz,


})
const particlesMaterial =new THREE.PointsMaterial({
  size : 0.02,
  // map: zz,
  transparent:true,
  opacity:.58,
  // color: 0x85CDFD
  color:0x222222
});

const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 4000;

const posArray = new Float32Array(particlesCount*3);

for (let i=0;i<particlesCount*3;i++){
  // posArray[i] =(Math.random()-.5)*5;
  // posArray[i] =(Math.random()-.5)*10;
  // posArray[i] =(Math.random()-.5)*40;
  posArray[i] =(Math.random(Math.sin(Math.random()))-.5)*40;
}
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(posArray,3));

const particlesMesh= new THREE.Points(particlesGeometry,particlesMaterial);


//object init
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
const videoPlane = new THREE.Mesh(videoPlaneGeometry,videoPlaneMaterial);
const torus = new THREE.Points(torusGeometry,torusMaterial);
// console.log(torus);
torus.recieveShadow=true;
torus.position.set(0,0,-1);
// torus.rotation.x=.1;


videoPlane.position.set(-10,0,-10);
videoPlane.rotation.set(1.2,2,0);
// plane.position.set(0,0,0);
plane.position.set(0,0,-100);
scene.add(plane);
// scene.add(scene2);
scene.add(torus);
// scene.add(videoPlane);
scene.add(camera);
scene2.add(camera2);
scene3.add(camera3);
scene.add(particlesMesh);

//fonts
const fontLoader= new FontLoader();
fontLoader.load(
  'https://unpkg.com/three@0.139.1/examples/fonts/helvetiker_regular.typeface.json',
  (font) =>{
    const textGeometry = new TextGeometry('BIODEFENCE',{
      height:.1,
      size:.45,
      font:font,


    });
    const textMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
    const textMesh = new THREE.Mesh(textGeometry,textMaterial);
    textMesh.position.set(-.79,-.1,0);
    textMesh.scale.set(.45,.45,.8)
    scene.add(textMesh);
  }
)
// const controls =new OrbitControls(camera,canvas);
// const controls2 =new OrbitControls(camera2,contObjects);

//lights

const light1 = new THREE.DirectionalLight(0xff0000,2);
light1.position.set(0,5,3);
const helper = new THREE.DirectionalLightHelper( light1, 5 );
const light2 = new THREE.HemisphereLight(0xf00000,0xff0000,10);
const spotLight= new THREE.SpotLight(0xffffff,1.5,30,15,.6,0)
const videoSpot = new THREE.SpotLight(0xffffff,1,30,15,.6,0);
videoSpot.position.set(-4,5,-4);
const light3 = new THREE.DirectionalLight(0xaa0011,5);
const light4 = new THREE.PointLight(0xababab,2);
light4.position.set(-5,10,1);
const light5 = new THREE.DirectionalLight(0xababab,2);
light5.position.set(5,5,2);
scene3.add(light5);
light2.position.set(0,2,2);
light3.position.set(-6,12,4);
spotLight.position.set(2,5,3);
// scene.add(helper);
// scene.add(light2);
scene2.add(spotLight);
scene.add(light1,videoSpot);
scene.add(light4);
// scene3.add(light4);
renderer.render(scene,camera);
renderer2.render(scene2,camera2);
renderer3.render(scene3,camera3);
let scrollTween=gsap.to(sections,{
  xPercent : -100 *(sections.length -1),
  ease:"none",

  scrollTrigger:{
    trigger:".back",

    pin:true,
    scrub:true,
    // start:"center right",
    // end:"+=3000",
    // snap :1/(sections.length-1),
    end:() => "+="+container.offsetWidth,
    // markers: true,
  }
});
gsap.from('.progressbar',{
  scrollTrigger:{
    trigger:'.pn1',
    scrub:true,
    start:'top top',
    end: () => container.offsetWidth
  },
  scaleX:0,
  // tranformFromOrigin: 'left center',
  ease: 'none'
})
sections.forEach((section) => {
  // grab the scoped text
  let text = section.querySelectorAll(".anim");

  // bump out if there's no items to animate
  if(text.length === 0)  return

  // do a little stagger
  gsap.from(text, {
    y: 200,
    opacity: 0,
    duration: 1,
    ease: "power2",
    stagger: 0.2,
    scrollTrigger: {
      trigger: section,
      containerAnimation: scrollTween,
      start: "left 20%",
      toggleActions: "play reverse play reverse",
      end: "right 80%",
      // markers: true
    }
  });
});
//curved panel
let params ={
	bendDepth:.5
}

let geom = new THREE.PlaneGeometry(13, 7, 200, 200);
planeCurve(geom, params.bendDepth);
let mat = new THREE.MeshPhysicalMaterial({
	// wireframe: true,
  map: videoTexture,
  side:THREE.FrontSide,
  color:0xffffff,
  transparent:true,
  opacity:0,
  reflectivity:1.4,
});
let curvedPanel = new THREE.Mesh(geom, mat);
scene.add(curvedPanel);
curvedPanel.position.set(-30,0,-9.5);
curvedPanel.rotation.set(1.2,2,0);


// gui settings

const c1=gui.addFolder('curvedPanel');
c1.add(mat, "wireframe");
c1.add(curvedPanel.position,'x',-25,25);
c1.add(curvedPanel.position,'y',-25,25);
c1.add(curvedPanel.position,'z',-25,25);
c1.add(curvedPanel.rotation,'x',-5,5).name('curvedPanel x rot');
c1.add(curvedPanel.rotation,'y',-5,5).name('curvedPanel y rot');
c1.add(curvedPanel.rotation,'z',-5,5).name('curvedPanel z rot');
c1.add(params, "bendDepth", .1, 25).name("bend depth").onChange(v => {
	planeCurve(geom, v);
})



const l1 = gui.addFolder('Light 1');
l1.add(light1.position,'x',-7,10).name('light1 x');
l1.add(light1.position,'y',-7,10).name('light1 y');
l1.add(light1.position,'z',-7,10).name('light1 z');


const spot2 = gui.addFolder('video spotlight');
videoSpot.castShadow= true;
spot2.add(videoSpot.position,'x',-10,10).name('video SpotLight x');
spot2.add(videoSpot.position,'y',-10,10).name('video SpotLight y');
spot2.add(videoSpot.position,'z',-10,10).name('video SpotLight z');
spot2.add(videoSpot,'intensity',1,5).name('video SpotLight Intensity');

let spotColor = {
  color:0xececec
}
spot2.addColor(spotColor,'color').onChange(() =>{
  videoSpot.color.set(spotColor.color);
})



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
// console.log(particlesMesh);
//timelines
const tl2 = gsap.timeline();
const tl3=gsap.timeline();
const tl = gsap.timeline();

//camera movement
cam1.addEventListener('click', function(){
  positions.forEach((position) => {
    position.style.color="black";
  });
  gsap.to(particlesMesh.material,{
    opacity:.38
  })
  gsap.to('.positions',{
    left:'15px',
    duration:1.5
  })
  gsap.to(light1.position,{
    x:0,
    y:5,
    z:3,
    duration:3
  })
  gsap.to(curvedPanel.position,{
    x:-30,
    y:0,
    z:-10
  })
  gsap.to(curvedPanel.material,{
    opacity:'0',
    duration:1
  })
  gsap.to(scene.background,{
    duration:2,
    r:1,
    g:1,
    b:1
  })
  gsap.to('.back3',{
    visibility:'hidden'
  })
tl.to(camera.position,{
  x:0,
  y:0,
  z:3,
  duration:3,
  ease:'power1'
})
gsap.to(camera.rotation,{
  x:0,
  y:0,
  z:0,
  duration:3
})
gsap.to(container,{
  visibility:'hidden',
  opacity:0
})
gsap.to(document.body,{
  overflow:'hidden',

})
gsap.to('.progressbar',{
  visibility:'hidden'
})
gsap.to('.back2',{
  visibility:'hidden'
})
});
cam2.addEventListener('click', function(){
positions.forEach((position) => {
  position.style.color="black";
});
gsap.to(particlesMesh.material,{
  opacity:.38
})

gsap.to(curvedPanel.position,{
  x:-30,
  y:0,
  z:-10
})
gsap.to(curvedPanel.material,{
  opacity:'0',
  duration:1
})
  tl2.to(pig.rotation,{
    y:.2,
    z:.2,
    duration:8,
    ease:'none'
  })
  gsap.to(light3.position,{
    x:4,
    y:-5,
    z:7,
    duration:15,
    yoyo:true,
    repeat:-1
  })

  tl2.to(pig.rotation,{
    y:-.2,
    z:-.2,
    duration:8,
    ease:'none'
  })

  tl2.to(pig.rotation,{
    y:0,
    z:0,
    duration:8,
    ease:'none'
  })

tl.to(camera.position,{
  y:-1,
  z:-1.4,
  x:1.2,
  duration:2
})
gsap.to(camera.rotation,{
  x:0,
  y:-1.3,
  z:0,
  duration:2
})

tl.to(container,{
  visibility: 'visible',
  opacity:1
})
gsap.to('.back2',{
  visibility:'hidden'
})
gsap.to(contObjects,{
  display:'block'
})
gsap.to('.object2',{
  display:'block'
})
gsap.to('.back3',{
  visibility:'hidden'
})
tl.to(document.body,{
  overflowX:'hidden',
  overflowY:'scroll'
})
gsap.to('.progressbar',{
    visibility:'visible'
})
});
cam3.addEventListener('click', function(){
  positions.forEach((position) => {
    position.style.color="black";
  });
  gsap.to('.positions',{
    left:'15px',
    duration:1.5
  })
  gsap.to(curvedPanel.material,{
    opacity:'0',
    delay:1,
    duration:2
  })

tl.to(camera.position,{
  x:-10,
  y:3,
  z:-14,
  duration:2
})
gsap.to(camera.rotation,{
  x:0,
  y:.8,
  z:0,
  duration:2
})
tl.to('.back2',{
  visibility:'visible',
  opacity:1,
  duration:1,
  ease:'power1'
})
gsap.to(container,{
  visibility:'hidden',
  opacity:0
})
gsap.to(document.body,{
  overflow:'hidden',

})
gsap.to('.progressbar',{
  visibility:'hidden'
})
gsap.to('.back3',{
  visibility:'hidden'
})
});
cam4.addEventListener('click', function(){
  positions.forEach((position) => {
    position.style.color="black";
  });
  gsap.to(particlesMesh.material,{
    opacity:0
  })
  gsap.to('.positions',{
    left:'15px',
    duration:1.5
  })
  gsap.to(light1.position,{
    x:-5,duration:4
  })
  gsap.to(curvedPanel.position,{
    x:-5,
    y:-2.1,
    z:-9.2,
    duration:2
  })
  gsap.to(curvedPanel.material,{
    opacity:'1',
    delay:1,
    duration:2
  })
  // camera.lookAt(videoPlane.position);
  // gsap.to(scene.background,{
  //   duration:2,
  //   r:0,
  //   g:1,
  //   b:1
  // })
  gsap.to('.back2',{
    visibility:'hidden',
    opacity:0
  })

tl.to(camera.position,{
  x:0,
  y:0,
  z:-10,
  duration:3
})
tl.to('.back3',{
  visibility:'visible'
})
gsap.to(camera.rotation,{
  x:1.2,
  y:2,
  z:0,
  duration:2
})
gsap.to(container,{
  visibility:'hidden',
  opacity:0
})

gsap.to(document.body,{
  overflow:'hidden',

})
gsap.to('.progressbar',{
    visibility:'hidden'
})
});

//animations
tl3.to(light5.position,{
  y:-10,
  x:10,
  z:5,
  duration:5,
})
tl3.to(light5.position,{
  y:0,
  x:0,
  z:6,
  duration:5
})
tl3.to(light5.position,{
  y:5,
  x:5,
  z:2,
  duration:5,
})
function torusRotate() {
  torus.rotation.z+=0.0003;

}

function pill(){
tl3.repeat(-1);
}
function pigIn(){
tl2.repeat(-1);
}
gsap.registerPlugin(ScrollTrigger);
gsap.to(camera.position,{
  scrollTrigger:{
    trigger:canvas,
    start:"top top",
    // snap:true,
    end:canvas.innerHeight,
    scrub:true
  },
  y:-1,
  z:-1.4,
  x:1.2,
  duration:4
})
gsap.to(camera.rotation,{
  scrollTrigger:{
    trigger:canvas,
    start:"top top",
    end:canvas.innerHeight,
    scrub:true
  },
  x:0,
  y:-1.3,
  z:0,
  duration:4
})

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
  camera2.aspect= sizes.width/sizes.height;
  camera3.aspect= sizes.width/sizes.height;
  // camera.updateProjectionMatrix();
  camera.updateProjectionMatrix();
  camera2.updateProjectionMatrix();
  camera3.updateProjectionMatrix();

  //Update renderer

  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer2.setSize(sizes.width,sizes.height);
  renderer3.setSize(sizes.width,sizes.height);
  // composer.setSize(sizes.width,sizes.height);
  composer2.setSize(sizes.width,sizes.height);
  renderer.setPixelRatio(devicePixelRatio);
})
const clock = new THREE.Clock();
function animate(){

  targetX= mouseX * 0.001;
targetY= mouseY * 0.001;
const elapsedTime= clock.getElapsedTime();
particlesMesh.rotation.x= -.009 *elapsedTime;
particlesMesh.rotation.z= -.009 *elapsedTime;
if(mouseX < window.innerWidth || mouseY <window.innerHeight ){
  particlesMesh.rotation.x = -(mouseY *0.00005);
  particlesMesh.rotation.y = -(mouseX *0.00003);
  curvedPanel.rotation.y= -(mouseX *0.00001)+2;
  curvedPanel.rotation.z= -(mouseY *0.00001);

}
  window.requestAnimationFrame(animate);

  videoTexture.needsUpdate = true;
  camera.updateProjectionMatrix();
  camera2.updateProjectionMatrix();
  camera3.updateProjectionMatrix();
  renderer.render(scene,camera);
  renderer2.render(scene2,camera2);
  renderer3.render(scene3,camera3);
  composer.render();
  composer2.render();
pills.rotation.z+=0.002;

// pigIn()
  torusRotate();
// pill();
stats.update();
}

// renderer.setAnimationLoop(animate);
animate();
