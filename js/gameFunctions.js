let stack = [],
    overhangs = [];
const boxHeight = 1;

function addLayer(x, z, width, depth, direction) {
    const y = boxHeight + stack.length; // add new box  one level higher
    const layer = generateBox(x, y, z, width, depth);
    layer.direction = direction;
    stack.push(layer);
}

function addOverhang(x, z, width, depth) {
    const y = boxHeight * (stack.length - 1); // Add the new box one the same layer
    const overhang = generateBox(x, y, z, width, depth, true);
    overhangs.push(overhang);
}

function generateBox(x, y, z, width, depth) {
    const geometry = new THREE.BoxGeometry(width, boxHeight, depth);
    const color = new THREE.Color(`hsl(${30+stack.length*4},70%, 50%)`);
    const material = new THREE.MeshLambertMaterial({
        color,shininess: 150
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    scene.add(mesh);

    return {
        threejs: mesh,
        width,
        depth
    }
}