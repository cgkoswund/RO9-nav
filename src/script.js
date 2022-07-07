/////////////////////////////////////SETUPIMPORTS/////////////////////////////////////////
import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js'

const clock = new THREE.Clock();

////////////////////////////////////SETUPCANVASANDSCENE///////////////////////////////////
// Canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();
const groupScene = new THREE.Group();
scene.add(groupScene);

////////////////////////////////////SETUPWINDOW//////////////////////////////////////////

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Automatic resize viewport to window size change
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

////////////////////////////////SETUPLIGHTS////////////////////////////////////////////

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.x = 2;
directionalLight.position.y = 3;
directionalLight.position.z = 4;
scene.add(directionalLight);

////////////////////////////////SETUPRENDERER//////////////////////////////////////////
let sceneReady = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
// Viewport to take up whole window
renderer.setSize(sizes.width, sizes.height);
// Set pixel ratio to 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

////////////////////////////////SETUPCAMERA//////////////////////////////////

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

scene.add(camera);

///////////////////////////ADDGROUP1/////////////////////////////////

const group1 = new THREE.Group();
groupScene.add(group1);

/////////////////////SCENESTART////////////////////////

let sceneStartCamera = true;
if (sceneStartCamera) {
  camera.position.set(0, 20, 20);
  camera.lookAt(0, 1.5, 0);
}

////////////////////////////////CONFIGFOG/////////////////////////////////////////

// To set renderer to match color of fog
renderer.setClearColor("#84E4F7");
const fog = new THREE.Fog("#84E4F7", 18, 70);

scene.fog = fog;

/////////////////////////////CONFIGHOVER///////////////////////////////

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function resetMouse() {
  mouse.x = sizes.width;
  mouse.y = sizes.height;

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
  });
}
resetMouse();

let currentIntersect = null;

// /////////////////////////////////CONFIGORBITCONTROLS///////////////////////////

let controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;

//////////////////////////ADDPLAYER//////////////////////////////

const planeGeometry = new THREE.PlaneBufferGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -(Math.PI * 0.5);
groupScene.add(plane);

const grid = new THREE.GridHelper(200, 80);
groupScene.add(grid);

//Add meshes here
const player = new THREE.Group();
groupScene.add(player);

const bodyGeo = new THREE.CylinderBufferGeometry(0.5, 0.3, 1.6, 20);
// const bodyGeo = new THREE.CylinderBufferGeometry(0.25, 0.15, 0.8, 20);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 0.8;
// body.scale.z = 0.5;
player.add(body);

const headGeo = new THREE.SphereBufferGeometry(0.3, 20, 15);
const headMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
const head = new THREE.Mesh(headGeo, headMat);
head.position.y = 2.0;
player.add(head);

////////////////////////ADDARROW//////////////////////////////////

const arrowForwardGeo = new THREE.CircleBufferGeometry(0.05, 32);
const arrowMat = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});
const arrowForward = new THREE.Mesh(arrowForwardGeo, arrowMat);
camera.add(arrowForward);
arrowForward.position.x = -0.3;
arrowForward.position.z = -0.5;
arrowForward.position.y = -0.2;

const arrowBackGeo = new THREE.CircleBufferGeometry(0.05, 32);
const arrowBack = new THREE.Mesh(arrowBackGeo, arrowMat);
camera.add(arrowBack);
arrowBack.position.x = -0.3;
arrowBack.position.z = -0.5;
arrowBack.position.y = -0.32;

const arrowLeftGeo = new THREE.CircleBufferGeometry(0.05, 32);
const arrowLeft = new THREE.Mesh(arrowLeftGeo, arrowMat);
camera.add(arrowLeft);
arrowLeft.position.x = -0.45;
arrowLeft.position.z = -0.5;
arrowLeft.position.y = -0.32;

const arrowRightGeo = new THREE.CircleBufferGeometry(0.05, 32);
const arrowRight = new THREE.Mesh(arrowRightGeo, arrowMat);
camera.add(arrowRight);
arrowRight.position.x = -0.15;
arrowRight.position.z = -0.5;
arrowRight.position.y = -0.32;

let arrowForwardHasBeenClicked = false;
let arrowBackHasBeenClicked = false;
let arrowLeftHasBeenClicked = false;
let arrowRightHasBeenClicked = false;

/////////////////////////////CONFIGPOINTERDOWN///////////////
const onpointerdown = (event) => {
  event.preventDefault();

  const cursor = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(cursor, camera);

  if (sceneReady) {
    const [arrowForwardClicked] = raycaster.intersectObject(arrowForward);
    if (arrowForwardClicked) {
      arrowForwardHasBeenClicked = true;
    }

    const [arrowBackClicked] = raycaster.intersectObject(arrowBack);
    if (arrowBackClicked) {
      arrowBackHasBeenClicked = true;
    }

    const [arrowLeftClicked] = raycaster.intersectObject(arrowLeft);
    if (arrowLeftClicked) {
      arrowLeftHasBeenClicked = true;
    }

    const [arrowRightClicked] = raycaster.intersectObject(arrowRight);
    if (arrowRightClicked) {
      arrowRightHasBeenClicked = true;
    }
  }
};
renderer.domElement.addEventListener("pointerdown", onpointerdown);

/***************************CONFIG POINTERUP****************************/
const onpointerup = (event) => {
  arrowForwardHasBeenClicked = false;
  arrowBackHasBeenClicked = false;
  arrowLeftHasBeenClicked = false;
  arrowRightHasBeenClicked = false;
};
renderer.domElement.addEventListener("pointerup", onpointerup);

//////////////////////////////CONFIGWASD/////////////////////////////////

let cameras = [];
let cameraIndex = 0;

const followCam = new THREE.Object3D();
followCam.position.copy(camera.position);
player.add(followCam);
cameras.push(followCam);

const frontCam = new THREE.Object3D();
frontCam.position.set(0, 3, -8);
player.add(frontCam);
cameras.push(frontCam);

const overheadCam = new THREE.Object3D();
overheadCam.position.set(0, 20, 0);
cameras.push(overheadCam);

addKeyboardControl();

function addKeyboardControl() {
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
}

function keyDown(evt) {
  let forward =
    player.userData !== undefined && player.userData.move !== undefined
      ? player.userData.move.forward
      : 0;
  let turn =
    player.userData != undefined && player.userData.move !== undefined
      ? player.userData.move.turn
      : 0;

  switch (evt.keyCode) {
    case 87: //W
      forward = -20;
      break;
    case 83: //S
      forward = 20;
      break;
    case 65: //A
      turn = 20;
      break;
    case 68: //D
      turn = -20;
      break;

    case 38: //I
      forward = -20;
      break;
    case 40:
      forward = 20;
      break;
    case 37:
      turn = 20;
      break;
    case 39:
      turn = -20;
      break;
  }

  playerControl(forward, turn);
}

function keyUp(evt) {
  let forward =
    player.userData !== undefined && player.userData.move !== undefined
      ? player.userData.move.forward
      : 0;
  let turn =
    player.move != undefined && player.userData.move !== undefined
      ? player.userData.move.turn
      : 0;

  switch (evt.keyCode) {
    case 87: //W
      forward = 0;
      break;
    case 83: //S
      forward = 0;
      break;
    case 65: //A
      turn = 0;
      break;
    case 68: //D
      turn = 0;
      break;

    case 38: //I
      forward = 0;
      break;
    case 40:
      forward = 0;
      break;
    case 37:
      turn = 0;
      break;
    case 39:
      turn = 0;
      break;
  }

  playerControl(forward, turn);
}

function playerControl(forward, turn) {
  if (forward == 0 && turn == 0) {
    delete player.userData.move;
  } else {
    if (player.userData === undefined) player.userData = {};
    player.userData.move = { forward, turn };
  }
}

///////////////////////////////////TICK FUNCTION USING CLOCK/////////////////////

function tick() {
  const elapsedTime = clock.getElapsedTime();

  if (sceneReady) {
    raycaster.setFromCamera(mouse, camera);
  }

  requestAnimationFrame(tick);
  renderer.render(scene, camera);
  const dt = clock.getDelta();

  if (arrowForwardHasBeenClicked) {
    player.translateZ(-0.1);
    console.log("forward");
  }

  if (arrowBackHasBeenClicked) {
    player.translateZ(0.1);
    console.log("back");
  }

  if (arrowLeftHasBeenClicked) {
    arrowBackHasBeenClicked = false;
    player.rotateY(0.01);
    arrowBackHasBeenClicked = false;
    console.log("left");
  }

  if (arrowRightHasBeenClicked) {
    arrowBackHasBeenClicked = false;
    player.rotateY(-0.01);
    arrowBackHasBeenClicked = false;
    console.log("right");
  }

  if (player.userData !== undefined && player.userData.move !== undefined) {
    player.translateZ(player.userData.move.forward * dt * 5);
    player.rotateY(player.userData.move.turn * dt);
  }

  camera.position.lerp(
    cameras[cameraIndex].getWorldPosition(new THREE.Vector3()),
    0.05
  );
  const pos = player.position.clone();
  pos.y += 3;
  camera.lookAt(pos);
}

tick();
