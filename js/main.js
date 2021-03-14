init();

function init() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    })
    //for implementing UI Interaction
    controls = new THREE.OrbitControls(camera, renderer.domElement)

    //create a shape
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var cubeMaterials = [1,2,3,4,5,6].map(item=>new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('img/'+item+'.jpg'),side:THREE.DoubleSide}));

    //create a material,color or image texture
    var material = new THREE.MeshFaceMaterial(cubeMaterials);
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 3;

    //providing lights
    var ambientLight = new THREE.AmbientLight(0xFFFFFF,2.0);
    scene.add(ambientLight);

    //game logic
    var update = function () {
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.005;
    };
    //draw scene
    var render = function () {
        renderer.render(scene, camera);
    }
    //run game loop (update, render, repeat)
    var GameLoop = function () {
        requestAnimationFrame(GameLoop);
        update();
        render();
    }

    GameLoop();

}