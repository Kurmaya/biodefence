import * as THREE from 'https://unpkg.com/three@0.139.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.139.1/examples/jsm/controls/OrbitControls'
import * as dat from "https://cdn.skypack.dev/dat.gui";
import {GLTFLoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/RGBELoader.js'


//variable
var container = document.querySelector('.container');
const sections = gsap.utils.toArray('.container section');
const text = gsap.utils.toArray('.anim');
const canvas = document.querySelector('canvas.webgl');
const contObjects = document.querySelector('.object');
const cam1= document.getElementById('cam1');
const cam2= document.getElementById('cam2');
const cam3= document.getElementById('cam3');
const cam4= document.getElementById('cam4');
//container width

container.style.width= sections.length*100+'vw';
//scenes
const scene= new THREE.Scene();
const scene2 = new THREE.Scene();


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

//renderer

const renderer = new THREE.WebGLRenderer({
  antialias:true,
  canvas:canvas,
  alpha:true
})
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(sizes.width,sizes.height);
renderer.setClearColor(0xffffff);

const renderer2 = new THREE.WebGLRenderer({
  antialias:true,
  canvas:contObjects,
  alpha:true
})
renderer2.setPixelRatio(devicePixelRatio);
renderer2.setSize(sizes.width,sizes.height);
// renderer2.setClearColor(0xffffff);
//assets and textures
const textureLoader = new THREE.TextureLoader();
const zz = textureLoader.load('./textures/zz.png');
const planeTexture = textureLoader.load('./textures/world.5292.png');
const bacon =  textureLoader.load('https://ik.imagekit.io/768eoiozf/biodefence/spek__kWsLLCSIH.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677310723217');
const gLoader =new GLTFLoader();
let bio,pig ;
gLoader.load('./3d/bd.glb', function(gltf){
  scene.add(gltf.scene);
  bio = gltf.scene.children[0];
  gltf.scene.scale.set(.005,.005,.005);
  bio.rotation.x= 0;
  bio.position.set(0,0,0);
  console.log(bio.material);
  bio.material= new THREE.MeshLambertMaterial({});

});

gLoader.load('./3d/BAcon.glb',function(gltf){
  scene2.add(gltf.scene);
  gltf.scene.position.set(0,0,-1);
  gltf.scene.scale.set(.05,.05,.05);
  gltf.scene.rotation.x=1.2;
  pig = gltf.scene.children[0];
  gltf.scene.children[0].material = new THREE.MeshPhysicalMaterial({map:bacon});
  console.log(gltf.scene.children[0].material);
})

//objects

const planeGeometry = new THREE.PlaneGeometry(500,200);
const plane2Geometry = new THREE.PlaneGeometry(3,3);
const torusGeometry = new THREE.TorusGeometry(1.7,.2,30,150);


//materials

const planeMaterial = new THREE.MeshBasicMaterial({
  color:0x1e6dae,
  map:planeTexture,
  transparent:true,
  opacity:.6,

})
const plane2Material = new THREE.MeshBasicMaterial({
  color:0xff0000,

})
const torusMaterial = new THREE.PointsMaterial({
  size:0.02,
  // color:0xff005,
  color:0xff0000,
  transparent:true,
  opacity:1,
  map:zz

})


//object init
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
const plane2 = new THREE.Mesh(plane2Geometry,plane2Material);
const torus = new THREE.Points(torusGeometry,torusMaterial);
torus.position.set(0,0,-1);
// plane.position.set(0,0,0);
plane.position.set(0,0,-100);
scene.add(plane);
scene.add(torus);

scene.add(camera);
scene2.add(camera2);
// scene2.add(plane2);


// const controls =new OrbitControls(camera,canvas);
// const controls2 =new OrbitControls(camera2,contObjects);
//lights

const light1 = new THREE.DirectionalLight(0xff0000,1);
light1.position.set(0,0,1);
const light2 = new THREE.HemisphereLight(0xff0000,.001);
const light3 = new THREE.PointLight(0xffffff,1);

light2.position.set(0,2,-2);
light3.position.set(2,2,4);
scene.add(light2);
scene2.add(light3);
scene.add(light1);
renderer.render(scene,camera);
renderer2.render(scene2,camera);
let scrollTween=gsap.to(sections,{
  xPercent : -100 *(sections.length -1),
  ease:"none",
  // ease:"power1.Out",
  scrollTrigger:{
    trigger:".back",
    // trigger:canvas,
    pin:true,
    scrub:.05,
    // start:"center right",
    // end:"+=3000",
    snap :1/(sections.length-1),
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
    stagger: 0.1,
    scrollTrigger: {
      trigger: section,
      containerAnimation: scrollTween,
      start: "left center",
      // markers: true
    }
  });
});
const tl = gsap.timeline();
cam1.addEventListener('click', function(){
tl.to(camera.position,{
  x:0,
  y:0,
  z:3,
  duration:2
})
gsap.to(camera.rotation,{
  x:0,
  y:0,
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
  display:'none'
})
gsap.to('.back2',{
  visibility:'hidden'
})
});
cam2.addEventListener('click', function(){

tl.to(camera.position,{
  y:-2,
  z:-14,
  x:4,
  duration:2
})
gsap.to(camera.rotation,{
  x:0,
  y:-.5,
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
tl.to(document.body,{
  overflowX:'hidden',
  overflowY:'scroll'
})
gsap.to('.progressbar',{
  display:'inline-block'
})
});
cam3.addEventListener('click', function(){
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
  visibility:'visible'
})
gsap.to(container,{
  visibility:'hidden',
  opacity:0
})
gsap.to(document.body,{
  overflow:'hidden',

})
gsap.to('.progressbar',{
  display:'none'
})
});
cam4.addEventListener('click', function(){
  gsap.to('.back2',{
    visibility:'hidden'
  })
tl.to(camera.position,{
  x:0,
  y:0,
  z:-10,
  duration:3
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
  display:'none'
})
});
//update aspect on resize
window.addEventListener('resize', () =>{
  //update sizes
  sizes.width=window.innerWidth;
  sizes.height=window.innerHeight;


  //Update camera
  camera.aspect= sizes.width/sizes.height;
  camera.updateProjectionMatrix();

  //Update renderer

  renderer.setSize(sizes.width,sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
})

//animations
function torusRotate() {
  torus.rotation.z+=0.0003;
}
function pigIn(){
  pig.position.z=0;
}
function animate(){
  window.requestAnimationFrame(animate);
  camera.updateProjectionMatrix();
  camera2.updateProjectionMatrix();
  renderer.render(scene,camera);
  renderer2.render(scene2,camera2);
  torusRotate();

}
animate();
