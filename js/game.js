let camera, scene, renderer; //Threejs globalstate
const originalBoxSize = 3; //original width and height of the box

function init() {
    scene = new THREE.Scene();

    //Foundation
    addLayer(0, 0, originalBoxSize, originalBoxSize);

    //FirstLayer
    addLayer(-10, 0, originalBoxSize, originalBoxSize, 'x');

    //set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    //Camera
    const width = 10;
    const height = width * (window.innerHeight / window.innerWidth);
    camera = new THREE.OrthographicCamera(
        width / -2, //left,
        width / 2, //right
        height / 2, //top
        height / -2, //bottom,
        1, //near,
        100, //far
    );

    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight, window.innerHeight);
    renderer.render(scene, camera);

    //Add to html
    document.body.appendChild(renderer.domElement);

    //Events
    let gameStarted = false;

    window.addEventListener("click",()=>{
        if(!gameStarted){
            renderer.setAnimationLoop(animation);
            gameStarted = true;
        }
        else{
            const topLayer = stack[stack.length-1];
            const direction = topLayer.direction;

            //Next layer
            const nextX = direction == "x"?0:-10;
            const nextZ = direction == "z"?0:-10;
            const newWidth = originalBoxSize;
            const newDepth = originalBoxSize;
            const nextDirection = direction == "x" ? "z" :"x";

            addLayer(nextX,nextZ,newWidth,newDepth,nextDirection);
        }
    });

    function animation(){
        const speed = 0.25;

        const topLayer = stack[stack.length-1];
        topLayer.threejs.position[topLayer.direction] +=speed;

        //4 is the initial camera height
        if(camera.position.y < boxHeight * (stack.length -2)+4){
        console.log( camera.position)
            camera.position.y += 0.15;
        }
        renderer.render(scene, camera);
    }

}

init();