import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { initScene, updateDust } from './scene.js';
import { initComputer } from './computer.js';
import { initInteraction } from './interaction.js';
import { initNarrative, getNarrativeText, inspectComponent, hideNarrative } from './narrative.js';
import { initAudio } from './audio.js';

// Expose these to the window so interaction.js can call them
window.THREE = THREE;
window.getNarrativeText = getNarrativeText;
window.inspectComponent = inspectComponent;
window.hideNarrative = hideNarrative;
window.showNarrativeForComponent = (compName) => {
    document.getElementById('text-display').textContent = getNarrativeText(compName);
    document.getElementById('text-display').style.opacity = '1';
};

// Main initialization
console.log('Initializing Three.js scene...');
const scene = new THREE.Scene();
console.log('Scene initialized.');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
console.log('Camera initialized.');
const canvas = document.getElementById('bg');
if (!canvas) {
    console.error('Canvas element #bg not found!');
}
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
console.log('Renderer initialized.');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Initialize modules
initScene(scene, camera, THREE);
const computer = initComputer(scene, THREE);
initInteraction(scene, camera, computer, THREE, renderer);
initNarrative();
initAudio();

// TEST CUBE
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
console.log('Test cube added.');

// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Update dust particles
    updateDust(scene, delta);

    // Update interaction
    if (typeof window.updateInteraction === 'function') {
        window.updateInteraction(delta);
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();
