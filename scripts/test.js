import * as THREE from 'https://unpkg.com/three@0.139.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.139.1/examples/jsm/controls/OrbitControls'
import * as dat from "https://cdn.skypack.dev/dat.gui";
import {GLTFLoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/RGBELoader.js'


let canvas,camera,renderer,scene,sizes,loader,logo;


  canvas =document.querySelector('canvas.webgl');

  //create scenes
  scene= new THREE.Scene();


  //camera

//sizes
sizes= {
  width:window.innerWidth,
  height:window.innerHeight
}

  camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1,1000);
  camera.position.set(0,0,3);
//renderer

renderer= new THREE.WebGLRenderer({
  antialias:true,
  canvas:canvas,
  alpha:true,
  pixelRatio:devicePixelRatio
})
renderer.setSize(sizes.width,sizes.height);
//load model
loader = new GLTFLoader();
loader.load('./3d/bd.glb',function(gltf){
  scene.add(gltf.scene);
  logo = gltf.scene.children[0];
  renderer.render(scene,camera);

})
