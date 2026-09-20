// Interaction logic for mouse controls and camera movement
export function initInteraction(scene, camera, computer, THREE, renderer) {
    // State variables
    let state = 'orbiting'; // 'orbiting' or 'inspecting'
    let defaultSpherical = new THREE.Spherical(); // For orbiting state
    let inspectTarget = null; // Object containing { position, lookAt, duration, startTime }
    const clock = new THREE.Clock();

    // Raycaster for mouse clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Default orbit parameters
    const DEFAULT_RADIUS = 3.5;
    const DEFAULT_PHI = Math.PI * 0.5; // polar angle
    const DEFAULT_THETA = Math.PI * 0.5; // azimuthal angle

    // Inspection offsets for each component (relative to component position)
    const INSPECTION_OFFSETS = {
        CPU: new THREE.Vector3(0.8, 0.2, 0.4),
        MEMORY: new THREE.Vector3(0.8, -0.2, 0.4),
        STORAGE: new THREE.Vector3(0.8, -0.6, 0.4),
        POWER: new THREE.Vector3(0.8, 0.6, 0.4),
        NETWORK: new THREE.Vector3(0.8, 1.0, 0.4)
    };

    // Set up mouse event listeners
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    // Initialize default spherical coordinates
    defaultSpherical.set(DEFAULT_RADIUS, DEFAULT_PHI, DEFAULT_THETA);
    updateCameraFromSpherical(camera, defaultSpherical);

    // Make the canvas focusable for key events
    const canvas = document.getElementById('bg');
    canvas.tabIndex = 0;
    canvas.focus();

    // Expose update function for the main loop
    window.updateInteraction = function(delta) {
        updateInspection(camera, delta);
    };

    function onPointerDown(event) {
        if (state === 'inspecting') {
            // Exit inspection on any click
            exitInspection();
            return;
        }

        // Calculate mouse position in normalized device coordinates
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with computer components
        const intersects = raycaster.intersectObjects(computer.meshes, false);
        if (intersects.length > 0) {
            const intersected = intersects[0];
            const componentName = intersected.object.name;
            startInspection(componentName, intersected.point);
        }
    }

    function onPointerMove(event) {
        if (state !== 'orbiting') return;

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onWheel(event) {
        if (state !== 'orbiting') return;
        event.preventDefault();

        // Zoom in/out
        const delta = event.deltaY > 0 ? 0.1 : -0.1;
        const newRadius = Math.max(1.5, defaultSpherical.radius - delta * 0.5);
        defaultSpherical.radius = newRadius;
        updateCameraFromSpherical(camera, defaultSpherical);
    }

    function onKeyDown(event) {
        if (event.code === 'Escape' && state === 'inspecting') {
            exitInspection();
        }
    }

    // --- Inspection Logic ---

    function startInspection(componentName, worldPoint) {
        state = 'inspecting';
        inspectTarget = {
            componentName: componentName,
            startTime: performance.now(),
            duration: 1500, // ms for transition
            // Calculate inspection position: offset from component towards camera
            position: new THREE.Vector3().copy(worldPoint).add(INSPECTION_OFFSETS[componentName]),
            lookAt: new THREE.Vector3().copy(worldPoint) // Look at the component center
        };

        // Trigger narrative for this component
        if (typeof window.showNarrativeForComponent === 'function') {
            window.showNarrativeForComponent(componentName);
        }
    }

    function exitInspection() {
        state = 'orbiting';
        inspectTarget = null;
        if (typeof window.hideNarrative === 'function') {
            window.hideNarrative();
        }
    }

    function updateInspection(camera, delta) {
        if (!inspectTarget) return;

        const elapsed = performance.now() - inspectTarget.startTime;
        const t = Math.min(elapsed / inspectTarget.duration, 1);
        const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // smoothstep

        // Interpolate camera position
        camera.position.lerpVectors(
            camera.position.clone(), // Start from current position (will be updated each frame)
            inspectTarget.position,
            easedT * 0.1 // Dampening factor for smooth arrival
        );

        // Always look at the target point
        camera.lookAt(inspectTarget.lookAt);

        // If transition is complete, we stay in inspection mode until user exits
        if (t >= 1) {
            // Keep camera fixed at inspection position
            camera.position.copy(inspectTarget.position);
            camera.lookAt(inspectTarget.lookAt);
        }
    }

    function updateCameraFromSpherical(camera, spherical) {
        spherical.makeSafe();
        const pos = new THREE.Vector3();
        pos.setFromSpherical(spherical);
        camera.position.copy(pos);
        camera.lookAt(0, 0, 0); // Look at the scene origin (where computer is centered)
    }
}
