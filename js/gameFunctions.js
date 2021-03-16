let stack = [],
  overhangs = [];
const boxHeight = 1;
let world,
  time = 0; //CannonJs world

function addLayer(x, z, width, depth, direction) {
  const y = boxHeight + stack.length; // add new box  one level higher
  const layer = generateBox(x, y, z, width, depth, false);
  layer.direction = direction;
  stack.push(layer);
}

function addOverhang(x, z, width, depth) {
  const y = boxHeight * (stack.length - 1); // Add the new box one the same layer
  const overhang = generateBox(x, y, z, width, depth, true);
  overhangs.push(overhang);
}

function generateBox(x, y, z, width, depth, falls) {
  //ThreeJs
  const geometry = new THREE.BoxGeometry(width, boxHeight, depth);
  const color = new THREE.Color(`hsl(${30 + stack.length * 4},70%, 50%)`);
  const material = new THREE.MeshLambertMaterial({
    color,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);

  scene.add(mesh);

  //CannonJS
  const shape = new CANNON.Box(
    new CANNON.Vec3(width / 2, boxHeight / 2, depth / 2)
  );
  let mass = falls ? 5 : 0;
  const body = new CANNON.Body({ mass, shape });
  body.position.set(x, y, z);
  world.addBody(body);
  return {
    threejs: mesh,
    cannonjs: body,
    width,
    depth,
  };
}

function cutBox(topLayer, overlap, size, delta,overhangSize) {
  const direction = topLayer.direction;
  //Cut Layer
  const newWidth = direction == "x" ? overlap : topLayer.width;
  const newDepth = direction == "z" ? overlap : topLayer.depth;

  //Update metadata
  topLayer.width = newWidth;
  topLayer.depth = newDepth;

  //Update Threejs model
  topLayer.threejs.scale[direction] = overlap / size;
  topLayer.threejs.position[direction] -= delta / 2;

  //Update CannonJs model
  topLayer.cannonjs.position[direction] -= delta / 2;

  //Replace shape to a smaller one (in Cannonjs can't just simply scale a shape)
  const shape = new CANNON.Box(
    new CANNON.Vec3(newWidth / 2, boxHeight / 2, newDepth / 2)
  );
  topLayer.cannonjs.shapes = [];
  topLayer.cannonjs.addShape(shape);

  //Overhang
  const overhangShift = (overlap / 2 + overhangSize / 2) * Math.sign(delta);
  const overhangX =
    direction == "x"
      ? topLayer.threejs.position.x + overhangShift
      : topLayer.threejs.position.x;
  const overhangZ =
    direction == "z"
      ? topLayer.threejs.position.z + overhangShift
      : topLayer.threejs.position.z;
  const overhangWidth = direction == "x" ? overhangSize : newWidth;
  const overhangDepth = direction == "z" ? overhangSize : newDepth;

  addOverhang(overhangX, overhangZ, overhangWidth, overhangDepth);
}
