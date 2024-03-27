import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import floor from './backgrounds/floor.jpg'

//import the model
const asset = new URL('./models/mercedes_modified.glb', import.meta.url);
const assetLoader = new GLTFLoader();


//get canvas and set sceen
const canvas = document.getElementById('view')
const scene = new THREE.Scene();


//import background loader
const bg = new URL('./backgrounds/shanghai_4k.hdr', import.meta.url);
const bgLoader = new RGBELoader()
bgLoader.load(bg.href, 
  function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture
    scene.environment = texture
  }, undefined, function(error){
    console.error(error)
  })

//sizes
const sizes = {
  width: innerWidth,
  height: innerHeight
}

// add camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(7, 3, 7)
scene.add(camera)

//add a stage
const stageGeo = new THREE.CylinderGeometry(5,5,0.2,64,64, false)
const stageMat = new THREE.MeshStandardMaterial({
  roughness: 1/100
})

const textureLoader = new THREE.TextureLoader()

const circelGeo = new THREE.CircleGeometry(10000, 64)
const circleMat = new THREE.MeshStandardMaterial({
  roughness: 1/10000,
  color: 0x87ceeb
})
const circle = new THREE.Mesh(circelGeo, circleMat)
circelGeo.rotateX(-Math.PI/2)
scene.add(circle)

const mesh =  new THREE.Mesh(stageGeo, stageMat)
mesh.receiveShadow = true
scene.add(mesh)

// add controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.maxPolarAngle = Math.PI / 2.01
controls.autoRotate = true

const grid = new THREE.GridHelper(30, 30)
// scene.add(grid)

// add some light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2)
scene.add(ambientLight);

//load the model
assetLoader.load(asset.href, function(file){
  const model = file.scene;
  model.position.set(0,0.1,0)
  model.castShadow =true;
  scene.add(model)
}, undefined, function(error){
  console.log(error)
});

//add a point light
const pointLight = new THREE.PointLight(0xFFFFFF, 100, 400)
pointLight.position.set(10,10,0)
// scene.add(pointLight)

// add renderer
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.setClearColor(0xA3A3A3)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.6
renderer.outputEncoding = THREE.sRGBEnconding;


//enable shadows
renderer.shadowMap.enabled = true;
renderer.render(scene, camera)

window.addEventListener('resize', () => {
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

function refresh(){
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(refresh)
}

refresh()
