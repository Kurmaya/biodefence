import * as THREE from '../modules/three.module.js';
import {GLTFLoader} from '../modules/GLTFLoader.js';
import * as dat from "https://cdn.skypack.dev/dat.gui";

const canvas = document.querySelector('canvas');
// const gui= new dat.GUI();
const scene = new THREE.Scene();
const sizes = {
  width:window.innerWidth,
  height:window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,1000);
const renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas});
 renderer.setSize( window.innerWidth, window.innerHeight );
 renderer.setClearColor(0xececec);
  // document.body.appendChild( renderer.domElement );
const light1= new THREE.DirectionalLight(0xff0000,1);
const light2= new THREE.DirectionalLight(0xaa0000,1);
const helper = new THREE.DirectionalLightHelper( light2, 5 );

light1.position.set(0,-.1,2);
light2.position.set(-1,-2,1);
// gui.add(light2.position,'x',-2,2).name('light2 p x');
// gui.add(light2.position,'y',-2,2).name('light2 p y');
// gui.add(light2.position,'z',-2,2).name('light2 p z');
scene.add(light1,light2);
     let bio;
     const gLoader= new GLTFLoader();
     gLoader.load('./3d/bd.glb',function(gltf){
       scene.add(gltf.scene);
       bio=gltf.scene.children[0];
       console.log(bio);
       bio.position.set(0,0,0);

       if(window.innerWidth>1000){
         bio.scale.set(.01,.01,.01);
       }
       else if(window.innerWidth<1000 && window.innerWidth>300){
         bio.scale.set(.008,.008,.008);
       }
       bio.rotation.set(0,0,0);
       function bRot(){
         requestAnimationFrame(bRot);
         bio.rotation.y += 0.01;

       }
       bRot();
     })
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

       camera.position.z = 5;
        function animate() {
           requestAnimationFrame( animate );
             renderer.render( scene, camera );
            }
            animate();
// const canvas = document.querySelector('.webgl');
// const sizes = {
//   width:window.innerWidth,
//   height:window.innerHeight
// }
// const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,1000);
// const scene= new THREE.Scene();
// // const light= new THREE.AmbientLight(0xff0000);
// scene.add(camera);
// camera.position.set(0,0,5);
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// cube.position.set(0,0,-4);
// scene.add(cube);
//
// const renderer= new THREE.WebGLRenderer({antialias:true,canvas:canvas});
// renderer.setSize(innerWidth,innerHeight);
// renderer.setPixelRatio(devicePixelRatio);
// renderer.setClearColor(0xff0000);
//
// console.log(cube);
//
// function animate(){
//   requestAnimationFrame(animate);
// renderer.render(scene,camera);
// camera.updateProjectionMatrix();
//
// }
// animate();
