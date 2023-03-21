import * as THREE from 'https://unpkg.com/three@0.139.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.139.1/examples/jsm/controls/OrbitControls'
import * as dat from "https://cdn.skypack.dev/dat.gui";
import {GLTFLoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'https://unpkg.com/three@0.139.1/examples/jsm/loaders/RGBELoader.js'
const canvas = document.querySelector('canvas.webgl');
const veedeeo= document.getElementById('video-texture');
veedeeo.play();
let videoTexture = new THREE.VideoTexture(veedeeo);
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 0, 20).setLength(15);
let renderer = new THREE.WebGLRenderer({antialias: true,canvas:canvas});
renderer.localClippingEnabled=true;
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x404040);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, canvas);

let light = new THREE.PointLight(0xffffff,1);
light.position.set(0,10,3);
// scene.add(light);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

// /* scene.add(new THREE.GridHelper(16, 16, "yellow", "black")); */


// test
const torusGeo = new THREE.TorusGeometry(1.9,.7,10,100,1.5);
const planeGeometry= new THREE.PlaneBufferGeometry(10,10,200,200);
const plane = new THREE.Mesh(planeGeometry,new THREE.MeshPhongMaterial({color:0xff0000,side:THREE.DoubleSide}));
plane.recieveShadow=true;
plane.castShadow=true;
// scene.add(plane);
// plane.rotation.x=.6;
//get total plane vertices
const count = planeGeometry.attributes.position.count;
console.log(count);


// function vert(){
//
// }
const cylinderGeometry = new THREE.CylinderGeometry(.6,.6,3,30,30);
const cylinderMaterial = new THREE.PointsMaterial({size:0.06,color:0xff0000,});
const cylinder = new THREE.Points(cylinderGeometry,cylinderMaterial);
const cylinder2 = new THREE.Points(cylinderGeometry,cylinderMaterial);
const torus = new THREE.Points(torusGeo,cylinderMaterial);
const torus2 = new THREE.Points(torusGeo,cylinderMaterial);
const torus3 = new THREE.Points(torusGeo,cylinderMaterial);
const torus4 = new THREE.Points(torusGeo,cylinderMaterial);
scene.add(torus,torus2,torus3,torus4);

// scene.add(cylinder,cylinder2);
cylinder.position.set(-1.9,1.4,-2);
cylinder2.position.set(-1.9,-1.4,-2);
torus.position.set(0,-.2,-2);
torus2.position.set(0,-.2,-2);
torus3.position.set(0,.3,-2);
torus4.position.set(0,.3,-2);
// torus.rotation.set(0,0,-3.15);
// torus2.rotation.set(0,0,-0.015);

// torus2.rotation.set(0,0,.3);
cylinder.scale.set(.8,.8,.8);
cylinder2.scale.set(.8,.8,.8);
torus.scale.set(.8,.8,.8);
torus2.scale.set(.8,.8,.8);
torus3.scale.set(.8,.8,.8);
torus4.scale.set(.8,.8,.8);
let params ={
	bendDepth:4
}

let geom = new THREE.PlaneGeometry(16, 9, 20, 20);
planeCurve(geom, params.bendDepth);
let mat = new THREE.MeshPhysicalMaterial({
	// wireframe: true,
  map: videoTexture,
  side:THREE.DoubleSide,
  // color:0xff0000,
  transparent:true,
  // opacity:.9,
  reflectivity:1.4,
  ior:2.3,
  metalness:.1,
  roughness:2

});
let o = new THREE.Mesh(geom, mat);
// scene.add(o)

let gui = new dat.GUI();
gui.add(mat, "wireframe");
gui.add(params, "bendDepth", 1, 25).name("bend depth").onChange(v => {
	planeCurve(geom, v);
})
const t1=gui.addFolder('torus1');
const t2 =gui.addFolder('torus2');
t1.add(torus.geometry.parameters,'radius',1,5);
t1.add(torus.geometry.parameters,'arc',0,Math.Pi);
torus.geometry.needsUpdate =true;
gui.add(torus.rotation,'z',-3,5).name('torus1 z rotation');
gui.add(torus2.rotation,'z',-3,5).name('torus2 z rotation');
gui.add(torus3.rotation,'z',-3,5).name('torus3 z rotation');
gui.add(torus4.rotation,'z',-3,5).name('torus4 z rotation');

console.log(torus.geometry.parameters);

renderer.setAnimationLoop( _ => {
	renderer.render(scene, camera);
  // o.rotation.y+=.01;
})

function planeCurve(g, z){

  let p = g.parameters;

  let hw = p.width * .5;
console.log( p, hw,z);

  let a = new THREE.Vector2(-hw, 0);
  let b = new THREE.Vector2(0, z);
  let c = new THREE.Vector2(hw, 0);
console.log(a,b,c);
  let ab = new THREE.Vector2().subVectors(a, b);
  let bc = new THREE.Vector2().subVectors(b, c);
  let ac = new THREE.Vector2().subVectors(a, c);
console.log(ab);
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
function animate(){
	const now= Date.now()/200;
	for(let i=0;i<count;i++){
		const x = planeGeometry.attributes.position.getX(i);
		const y = planeGeometry.attributes.position.getY(i);
		const xsin =Math.sin(x+now);
		const ysin = Math.cos(y+now);
		planeGeometry.attributes.position.setZ(i,xsin+ysin);
	}
	planeGeometry.computeVertexNormals();
	planeGeometry.attributes.position.needsUpdate=true;
	renderer.render(scene,camera);
	requestAnimationFrame(animate);
	camera.updateProjectionMatrix();
}
animate();
