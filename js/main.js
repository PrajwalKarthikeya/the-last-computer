// Main initialization using global THREE from CDN
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

// Initialize modules (these will attach to window if we change them)
initScene(scene, camera);
const computer = initComputer(scene);
console.log('Computer object:', computer);
initInteraction(scene, camera, computer);
initNarrative();
initAudio();

// TEST CUBE
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.z = -5; // Move back
scene.add(cube);
console.log('Test cube added at z=-5.');

// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Update dust particles
    if (typeof updateDust === 'function') {
        updateDust(scene, delta);
    }

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