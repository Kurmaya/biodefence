import * as THREE from '../modules/three.module.js';
// import {OrbitControls} from 'https://unpkg.com/three@0.139.1/examples/jsm/controls/OrbitControls'
import * as dat from "https://cdn.skypack.dev/dat.gui";
import {GLTFLoader} from '../modules/GLTFLoader.js'
// import {RGBELoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/RGBELoader.js'
const canvas = document.querySelector('canvas.webgl');
gsap.registerPlugin(ScrollTrigger);
const positions = document.querySelectorAll('.positions button');



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
const hex = textureLoader.load('./textures/hex.png');
const zz = textureLoader.load('./textures/zz.png');
const def = textureLoader.load('./textures/biodefence-nav-logo-red.png');
const veedeeo= document.getElementById('video-texture');
const impactVid = document.getElementById('impactVideo');
impactVid.play();
veedeeo.currentTime =.1;
let videoTexture = new THREE.VideoTexture(veedeeo);
let impactVideoTexture= new THREE.VideoTexture(impactVid);
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
    play.textContent="Pause"

  }
  else if(!play.classList.contains('active')){
    veedeeo.pause();
    play.textContent="Play"
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
     mute.textContent="Mute";
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
     mute.textContent="Unmute";
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
const localPlane = new THREE.Plane( new THREE.Vector3( 0,0, .7 ),-.125);
const localPlane2 = new THREE.Plane(new THREE.Vector3(1,3.4,0),-.14);
const localPlane3 = new THREE.Plane(new THREE.Vector3(0.16,-.71,0),-.9);

//particles
const particlesMaterial =new THREE.PointsMaterial({
  size : 0.01,
  // map: zz,
  transparent:true,
  opacity:.48,
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

//cylinders
const cylinderGeo =new THREE.CylinderGeometry(.25,.25,1.6,30,30);
const cylinderMat= new THREE.PointsMaterial({color:0xff0000,size:0.02});

const cylinder= new THREE.Points(cylinderGeo,cylinderMat);
const cylinder2= new THREE.Points(cylinderGeo,cylinderMat);
cylinder.position.set(-1.65,1.02,0);
cylinder2.position.set(-1.65,-1.1,0);
//impact video plane
const impactVideoGeometry= new THREE.BoxGeometry(5,5,5,10,10,10);
const impactVideoMaterial= new THREE.MeshBasicMaterial({
  map:impactVideoTexture,
  color:0xffffff,
  opacity:0,
  transparent:true


})
const impactVideoCube= new THREE.Mesh(impactVideoGeometry,impactVideoMaterial);
impactVideoCube.castShadow=true;
impactVideoCube.receiveShadow=true;
scene.add(impactVideoCube);
console.log(impactVideoCube);
impactVideoCube.position.set(0,-30,-10);
//curved panel
let params ={
	bendDepth:.5
}

let geom = new THREE.PlaneGeometry(11, 6, 200, 200);
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
const planeGeometry = new THREE.PlaneBufferGeometry(500,200,100,100);
const planeMaterial = new THREE.MeshBasicMaterial({
  // color:0x1e6dae,
  color:0x89CFF0,
  map:planeTexture,
  transparent:true,
  opacity:.6,

})
const shadowPlaneGeo = new THREE.PlaneBufferGeometry(3,1.5,200,200);
const shadowPlaneMat =new THREE.MeshPhongMaterial({side:THREE.FrontSide,transparent:true,opacity:0,emissive:0xececec});


const shadowPlane = new THREE.Mesh(shadowPlaneGeo,shadowPlaneMat);
shadowPlane.receiveShadow=true;
shadowPlane.castShadow=true;
console.log(shadowPlane);
shadowPlane.position.set(-1.5,-15.5,-1);
shadowPlane.rotation.x=-1.4;
const plane = new THREE.Mesh(planeGeometry,planeMaterial);

scene.add(plane,shadowPlane);
plane.position.set(0,0,-100);
//torus
const torusGeo = new THREE.TorusGeometry(2,.2,30,120);
const torusGeo2 = new THREE.TorusGeometry(1.5,.2,30,120);

const torusMaterial= new THREE.PointsMaterial({size:0.015,map:hex,transparent:true,opacity:.4,color:0xff0000});
const torus2Material= new THREE.PointsMaterial({color:0xff0000,size:0.015,transparent:true,opacity:0});
const helper = new THREE.PlaneHelper(localPlane2,2,0x00ff00);
const helper2 = new THREE.PlaneHelper(localPlane3,2,0x0000ff);
// scene.add(helper,helper2);
const torus= new THREE.Points(torusGeo,torusMaterial);
const torus2= new THREE.Points(torusGeo2,torus2Material);

scene.add(torus2);
torus2.position.set(-1.4,-21,-4);
 // x:-1.4,
 //  y:-15.5,
 //  z:-1
torus.rotation.z=0;


groupTwo.add(torus);
scene.add(particlesMesh);
scene.add(camera);
camera.position.set(0,0,5);


// const controls = new OrbitControls(camera,canvas);
const gLoader = new GLTFLoader();
let bio;
let dish;
gLoader.load('./3d/dish.glb',function(gltf){
  scene.add(gltf.scene);


  gltf.scene.children[0].castShadow=true;
  dish= gltf.scene.children[0].children[0].children[0].children[0].children[0];
  dish.scale.set(.05,.05,.05);
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
console.log(gltf.scene,dish);
  let sectionFour = gsap.timeline({
    scrollTrigger:{
      trigger:'.impact',
      start:'top top',
      end:'bottom',
      snap:1,
      scrub:.7,
      ease:'none',

    }
  });

  sectionFour
  .to(dirLight.position,{
    x:-9,
    y:-5.4
  })

  .to(impactVideoCube.rotation,{
    y:3,
    duration:1.8,
    ease:'none'
  })
  .to(impactVideoCube.position,{
    z:5,
    duration:2,
    ease:'power1'
  },'simultaneously')

  .to(impactVideoMaterial,{
    opacity:0,
    duration:1,
    ease:'none'
  },'simultaneously')
  .to(shadowPlane.material,{
    opacity:1,
    duration:1,
    ease:'none'
  })
  .to(dish.position,{
    x:-1,
    y:-15.5,
    z:-1,
    duration:2,
    ease:'none'
  })

  .to(dish.position,{
    x:-1.8,
    duration:1.8,
    ease:'power2'
  })
  .to(dish.rotation,{
    y:1.5,
    duration:3.8,
    ease:'none'
  })
  .to(dish.material,{
    opacity:.3,
    delay:1
  },'simultaneously')
  .to(dish.material,{
    opacity:1,
    duration:1,
    ease:'none'
  })
  .to(torus2.position,{
    x:-1.4,
    y:-15.5,
    z:-1,
    ease:'none',
    duration:2,
  })
  .to(torus2Material,{
    opacity:1,
    ease:'none',
    duration:2,
  })
  gui.add(dish.position,'x',-30,20).name('dish p x');
  gui.add(dish.position,'y',-30,20).name('dish p y');
  gui.add(dish.position,'z',-30,20).name('dish p z');
  // gui.add(dish.rotation,'x',-2,2).name('dish r x');
  // gui.add(dish.rotation,'y',-2,2).name('dish r y');
  // gui.add(dish.rotation,'z',-2,2).name('dish r z');

})
gLoader.load('./3d/biodef logo.glb',function(gltf){
  scene.add(gltf.scene);
  bio = gltf.scene.children[0];
  gltf.scene.scale.set(.035,.035,.035);
  bio.rotation.z= 1.6;
  gltf.scene.position.x=-1.9;
  gltf.scene.position.y=.2;



  bio.material= new THREE.MeshPhongMaterial({color:0xff0000,shininess:40,reflectivity:30})



})
let tex;
gLoader.load('./3d/more 2 (1).glb',function(gltf){
  scene.add(gltf.scene);
  // gltf.scene.scale.set(0.28,.28,28);
  tex= gltf.scene.children[0];
  tex.material= new THREE.MeshBasicMaterial({
    // color:0xff0000,
    color:0x202020,
    clippingPlanes:[localPlane],
    clipShadows:true
  })


console.log(groupTwo);
  tex.scale.set(.035,.035,.035);
  tex.position.z= -.25;
  tex.position.y= .08;
  tex.position.x=0.05;
  // tex.rotation.z= -.001;
  tex.rotation.y=.078;

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

const gui = new dat.GUI();
gui.add(dirLight.position,'x',-15,15).name('dirLight x');
gui.add(dirLight.position,'y',-15,15).name('dirLight y');
gui.add(dirLight.position,'z',-15,15).name('dirLight z');
gui.add(pLight.position,'x',-15,15).name('pLight x');
gui.add(pLight.position,'y',-15,15).name('pLight y');
gui.add(pLight.position,'z',-15,15).name('pLight z');
//           gui.add(cylinder.position,'x',-10,10).name('cylinder x pos');
// gui.add(cylinder.position,'y',-10,10).name('cylinder y pos');
// gui.add(cylinder2.position,'x',-10,10).name('cylinder2 x pos');
// gui.add(cylinder2.position,'y',-10,10).name('cylinder2 y pos');
// gui.add(torus.rotation,'z',-5,5).name('torus rot z');
// gui.add(torus2.rotation,'z',-5,5).name('torus2 rot z');
// gui.add(localPlane2.normal,'x',-10,10).name('plane2 x');
// gui.add(localPlane2.normal,'y',-10,10).name('plane2 y');
// gui.add(localPlane2,'constant',-5,5).name('plane2');
// gui.add(localPlane3.normal,'x',-10,10).name('plane3 x');
// gui.add(localPlane3.normal,'y',-10,10).name('plane3 y');
// gui.add(localPlane3,'constant',-5,5).name('plane3');
gui.add(shadowPlane.rotation,'x',-3,3).name('shadowPlane r x');
gui.add(shadowPlane.rotation,'z',-3,3).name('shadowPlane r z');
gui.add(shadowPlane.position,'x',-20,3).name('shadowPlane p x');
gui.add(shadowPlane.position,'y',-20,3).name('shadowPlane p y');
gui.add(shadowPlane.position,'z',-20,3).name('shadowPlane p z');
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


const clock = new THREE.Clock();
function animate(){

  renderer.render(scene,camera);
  requestAnimationFrame(animate);
  camera.updateProjectionMatrix();
  torus.rotation.z+=0.0001;
  torus2.rotation.z+=0.0001;
  impactVideoCube.rotation.y+=0.001;
  // dish.rotation.z+=.001;


// tex.rotation.y-=0.01;
cylinder.rotation.y+=0.001;
cylinder2.rotation.y+=0.001;
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
    scrub:.1,
    snap:1,
    // pin:true,
    // snap:space.bottom,
    // markers:true,
    // pinSpacing:false,
    ease:'none'

  }

});
sectionOne
.to(camera.position,{
  y:-1.1,
  z:-.28,
  x:1.1,
  duration:4,},"simultaneously")

  .to(camera.rotation,{
    x:0,
    y:-1,
    z:0,
    duration:4,
  },"simultaneously")
  .to(torusMaterial.color,{
      r:1,
      g:.05,
      b:.01,
      duration:2,
      ease:'power1',
    })

  //swiper animation
  gsap.from('.swiper',{
    opacity:0,
    scale:.1,
    duration:.5,
    ease:'power1',
    scrollTrigger:{
      trigger:'.cards',
      toggleActions:"play reset play none",
      start:"-10% top",
      end:"bottom"
    }
  })
  gsap.from('.products-holder',{
    opacity:0,
    xPercent:-100,
    scrub:.1,
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
      scrub:.1,
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
  .to(camera.position,{
    x:0,
    y:0,
    z:-10,

  },"simultaneously")
  .to(camera.rotation,{
    x:1.2,
    y:2,
    z:0,

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
let sectionTwoHalf =gsap.timeline({
  scrollTrigger:{
    trigger:'.veed',
    start:'top top',
    end:'bottom',
    snap:1,
    scrub:.1,
    ease:'none'
  }
});
sectionTwoHalf
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
    start:'top top',
    // endTrigger:'.impact',
    end:'bottom',
    makers:true,
    scrub:.1,
    snap:1,
    ease:'none'

  }
});
sectionThree
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
.to(impactVideoCube.position,{
  x:-5,
  y:-15,
  z:-8
},'simultaneously')
// .to(impactVideoCube.rotation,{
//   x:0,
//   y:0,
//   z:0
// },'simultaneously')
.to(impactVideoMaterial,{
  opacity:1
},'simultaneously')

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
