import GUI from 'lil-gui';
import * as THREE from 'three';
import { GLTFLoader, GroundedSkybox, RGBELoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';




const gui = new GUI();


const canvas = document.querySelector('.webgl');

const scene = new THREE.Scene();

const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
// const environmentMap = cubeTextureLoader.load([
//   './static/environmentMaps/1/px.jpg',
//   './static/environmentMaps/1/nx.jpg',
//   './static/environmentMaps/1/py.jpg',
//   './static/environmentMaps/1/ny.jpg',
//   './static/environmentMaps/1/pz.jpg',
//   './static/environmentMaps/1/nz.jpg',
// ])
rgbeLoader.load(
  './static/environmentMaps/christmas_photo_studio_01_2k.hdr',
  (environmentMap)=>{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    environmentMap.colorSpace = THREE.SRGBColorSpace

    scene.background = environmentMap;
    // scene.environment = environmentMap;

    // const skybox = new GroundedSkybox(environmentMap,15,70);
    // skybox.position.y = 15
    // scene.add(skybox);
  }
)
// scene.background = environmentMap;
scene.backgroundIntensity = 1
scene.environmentIntensity = 1
scene.backgroundBlurriness = 0

gui.add(scene,'backgroundIntensity',0,10,0.001)
gui.add(scene,'environmentIntensity',0,10,0.001)
gui.add(scene,'backgroundBlurriness',0,1,0.001)
gui.add(scene.backgroundRotation,'y',0,Math.PI * 2,0.001).name('backgroundRotationY');
gui.add(scene.environmentRotation,'y',0,Math.PI * 2,0.001).name('environmentRotationY');




const gltfLoader = new GLTFLoader();
gltfLoader.load(
  './static/models/FlightHelmet/glTF/FlightHelmet.gltf',
  (gltf) => {
  gltf.scene.scale.set(7,7,7);
    scene.add(gltf.scene);
  },

)

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1,0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    color:'0xaaaaaa',
    roughness:0,
    metalness:1
  })
)
torusKnot.position.x = -4
torusKnot.position.y = 2;
scene.add(torusKnot);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(8,0.5),
  new THREE.MeshBasicMaterial({
    color: new THREE.Color(10,4,2)
  })
)
torus.layers.enable(1);
torus.position.y = 3.5;
scene.add(torus);
const sizes ={
  width: window.innerWidth,
  height: window.innerHeight
}
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(64,{
  type: THREE.HalfFloatType
})
scene.environment = cubeRenderTarget.texture;

const cubeCamera = new THREE.CubeCamera(0.1,100,cubeRenderTarget);
cubeCamera.layers.set(1);

window.addEventListener('resize',()=>{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 10;
// camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

function tick(){
  const elapsedTime = clock.getElapsedTime();
  if(torus){
    torus.rotation.x = Math.sin(elapsedTime) * 2
  }
  cubeCamera.update(renderer,scene);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();