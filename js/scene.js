// Set up the scene, lighting, camera, and atmospheric effects
export function initScene(scene, camera, THREE) {
    // Set up a dark, cinematic environment
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.05); // Very light fog for depth

    // Lighting: subtle ambient and a dim directional light to simulate distant light
    const ambientLight = new THREE.AmbientLight(0x111111, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x404040, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Optional: a hemisphere light for subtle sky/ground color
    const hemiLight = new THREE.HemisphereLight(0x000000, 0x000000, 0.5);
    scene.add(hemiLight);

    // Camera initial position
    camera.position.set(0, 1.6, 3); // Eye level, slightly back from the computer

    // --- Dust Particle System ---
    const dustCount = 15000;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    const dustVelocities = new Float32Array(dustCount * 3); // slow drift

    const spread = 20; // Dust spread in meters
    for (let i = 0; i < dustCount; i++) {
        dustPositions[i * 3] = (Math.random() - 0.5) * spread;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * spread;
        dustPositions[i * 3 + 2] = (Math.random() - 0.5) * spread;

        dustSizes[i] = Math.random() * 0.1 + 0.02; // Size between 0.02 and 0.12

        // Very slow drift velocities
        dustVelocities[i * 3] = (Math.random() - 0.5) * 0.0002;
        dustVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0002;
        dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0002;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    const dustMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.2,
        depthTest: true,
        vertexColors: false
    });

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);

    // Store dust points in scene for animation update
    scene.userData.dustPoints = dustPoints;
    scene.userData.dustVelocities = dustVelocities;
    scene.userData.dustClock = new THREE.Clock();
}

// Function to update dust particles (call in animation loop)
export function updateDust(scene, delta) {
    if (!scene.userData.dustPoints) return;
    const positions = scene.userData.dustPoints.geometry.attributes.position.array;
    const velocities = scene.userData.dustVelocities;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i]     += velocities[i]     * delta * 60; // scale by 60 for reasonable speed
        positions[i + 1] += velocities[i + 1] * delta * 60;
        positions[i + 2] += velocities[i + 2] * delta * 60;
        // Optional: wrap around if out of bounds (not necessary for small drift over time)
    }
    scene.userData.dustPoints.geometry.attributes.position.needsUpdate = true;
}
