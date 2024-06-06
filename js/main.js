import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.z = -10;
camera.position.x = 5;

const angelGroup = new THREE.Group();
scene.add(angelGroup);

let angel;
const loader = new GLTFLoader();
loader.load(
  `models/angel/scene.gltf`,
  function (gltf) {
    angel = gltf.scene;
    angel.scale.set(7, 7, 7);
    angel.position.set(-4, -13, -5); // x,y,z
    angelGroup.add(angel);
    console.log("angel model loaded successfully", angel);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("An error happened", error);
  }
);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([angel]);
  if (intersects.length > 0) {
    controls.enabled = true;
  } else {
    controls.enabled = false;
  }
}

function createConstellations() {
  const constellationMaterial = new THREE.LineBasicMaterial({

  });

  const zodiacConstellations = [
  ];

  zodiacConstellations.forEach((constellation) => {
    const starPositions = new THREE.Float32BufferAttribute(
      constellation.stars.flat(),
      3
    );
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", starPositions);

    const line = new THREE.Line(starGeometry, constellationMaterial);
    scene.add(line);
  });
}
createConstellations();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (angel) {
    angel.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();
