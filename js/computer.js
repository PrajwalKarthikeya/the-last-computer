// Procedural generation of the computer object and its components
export function initComputer(scene, THREE) {
    const computer = new THREE.Group();
    computer.name = 'computer';

    // Computer dimensions
    const width = 0.6;
    const height = 1.8;
    const depth = 0.5;

    // Main tower (dark metal)
    const towerGeometry = new THREE.BoxGeometry(width, height, depth);
    const towerMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.2,
    });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.y = 0; // Centered at origin
    computer.add(tower);

    // Component slots (we'll create separate meshes for each component that can be clicked)
    const componentWidth = width * 0.8;
    const componentHeight = height * 0.12;
    const componentDepth = depth * 0.6;
    const componentYStart = height * 0.3; // Start above the middle

    // Define components: name, color, y-offset
    const components = [
        { name: 'CPU', color: 0x00ffff, yOffset: componentYStart },
        { name: 'MEMORY', color: 0x00ff00, yOffset: componentYStart - componentHeight * 1.5 },
        { name: 'STORAGE', color: 0xff00ff, yOffset: componentYStart - componentHeight * 3 },
        { name: 'POWER', color: 0xffff00, yOffset: componentYStart + componentHeight * 1.5 },
        { name: 'NETWORK', color: 0xff8800, yOffset: componentYStart + componentHeight * 3 }
    ];

    components.forEach(comp => {
        const compGeometry = new THREE.BoxGeometry(componentWidth, componentHeight, componentDepth);
        const compMaterial = new THREE.MeshStandardMaterial({
            color: comp.color,
            metalness: 0.7,
            roughness: 0.3,
            emissive: comp.color,
            emissiveIntensity: 0.2
        });
        const mesh = new THREE.Mesh(compGeometry, compMaterial);
        mesh.position.set(0, comp.yOffset, depth * 0.25); // Slightly forward from tower center
        mesh.name = comp.name;
        computer.add(mesh);

        // Add a small LED indicator on each component
        const ledGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const ledMaterial = new THREE.MeshStandardMaterial({
            color: comp.color,
            emissive: comp.color,
            emissiveIntensity: 1.5
        });
        const led = new THREE.Mesh(ledGeometry, ledMaterial);
        led.position.set(
            componentWidth * 0.3, // Right side of component
            0,
            componentDepth * 0.5 + 0.01 // Slightly forward
        );
        mesh.add(led);
    });

    // Add some subtle details: power button, disk drive slots, etc.
    // Power button (small cylinder)
    const buttonGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16);
    const buttonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });
    const powerButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    powerButton.position.set(
        width * 0.4,
        -height * 0.4,
        depth * 0.3
    );
    powerButton.rotation.z = Math.PI / 2;
    computer.add(powerButton);

    // Add the computer to the scene
    scene.add(computer);

    // Return the computer group and its component meshes for interaction
    return {
        group: computer,
        meshes: components.map(c => computer.getObjectByName(c.name))
    };
}
