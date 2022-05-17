let body,
    mainContainer,
    scene,
    renderer,
    camera,
    cameraLookAt = new THREE.Vector3(0, 0, 0),
    cameraTarget = new THREE.Vector3(0, 0, 800),
    windowWidth,
    windowHeight,
    windowHalfWidth,
    windowHalfHeight,
    points,
    mouseX = 0,
    mouseY = 0,
    gui,
    stats,
    contentElement,
    colors = ['#09bf84', '#1e8cdd', '#e1642c', '#591edd', '#1fd257'],
    graphics,
    currentGraphic = 0,
    graphicCanvas,
    gctx,
    canvasWidth = 800,
    canvasHeight = 460,
    graphicPixels,
    particles = [],
    graphicOffsetX = canvasWidth / 4.15,
    graphicOffsetY = canvasHeight / 4,
    canvas




let resetScene = function () {

    renderer.clear()
}

var pimRenderer = function (canvasID, xcoords, ycoords) {
    
    console.log("start");

    //SETUP
    
    mainContainer = document.getElementById("container3");
    canvas = document.getElementById(canvasID);
    
    windowWidth = mainContainer.clientWidth
    windowHeight = mainContainer.clientHeight;
    windowHalfWidth = windowWidth / 2;
    windowHalfHeight = windowHeight / 2;

    
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);


    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvas        
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    mainContainer.appendChild(renderer.domElement);
    renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);


    
    scene.background = new THREE.Color(0x121418);


    camera = new THREE.PerspectiveCamera(75, mainContainer.offsetWidth / mainContainer.offsetHeight, 0.1, 4000);
    camera.position.z = 800;

    //graphicCanvas = document.getElementById(canvasID);


    


    var shadowLight = new THREE.DirectionalLight(0xffffff, 2);
    shadowLight.position.set(20, 0, 10);
    scene.add(shadowLight);

    var light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(-20, 0, 20);
    scene.add(light);

    var backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(0, 0, -20);
    scene.add(backLight);
    


    //---------------------------------------------------------------------------------------Graphic  


    var initBgObjects = function(){
        for (let i = 0; i < 40; i++) {
            createBgObject(i);
        }
    }

    function createBgObject(i){
        var geometry = new THREE.SphereGeometry(10, 6, 6);
        var material = new THREE.MeshBasicMaterial({ color: 0xdddddd });
        var sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        var x = Math.random() * windowWidth * 2 - windowWidth;
        var y = Math.random() * windowHeight * 2 - windowHeight;
        var z = Math.random() * -2000 - 200;
        sphere.position.set(x, y, z);
    }
    
    function onMouseMove(event){
        mouseX = (event.clientX - windowHalfWidth);
        mouseY = (event.clientY - windowHalfHeight);
        cameraTarget.x = (mouseX * -1) / 2;
        cameraTarget.y = mouseY / 2;
    }

    function onWindowResize() {
        setWindowSize();

        camera.aspect = mainContainer.offsetWidth / mainContainer.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
    };

    function setWindowSize() {

        
        windowWidth = mainContainer.clientWidth
        windowHeight = mainContainer.clientHeight;
        windowHalfWidth = windowWidth / 2;
        windowHalfHeight = windowHeight / 2;
    }

    
    initBgObjects();
    updateGraphicInitial(xcoords, ycoords);

    
    //Check if already animating

    if (!isAnimating) {


        animate();
    }
    isAnimating = true;
}

let isAnimating = false;

let animate = function () {

        requestAnimationFrame(animate);
        updateParticles();
        camera.position.lerp(cameraTarget, 0.2);
        camera.lookAt(cameraLookAt);
        render();

}



let render = function(){
    renderer.render(scene, camera);
}

//-----------------------------------------------------------------------------updateGraphic

var updateGraphicInitial = function (xcoords, ycoords) {

    graphicPixels = [];


    for (let i = 0; i < xcoords.length; i++) {
        graphicPixels.push({    
            x: xcoords[i],
            y: ycoords[i]
        });
        
    }  

        for (let i = 0; i < particles.length; i++) {

            randomPos(particles[i].particle.targetPosition);

        }

    
    setTimeout(() => {
        setParticlesInitial();
    }, 500);
    
    
}

var updateGraphic = function (xcoords, ycoords) {

    graphicPixels = [];


    for (let i = 0; i < xcoords.length; i++) {
        graphicPixels.push({
            x: xcoords[i],
            y: ycoords[i]
        });

    }

        for (let i = 0; i < particles.length; i++) {

            randomPos(particles[i].particle.targetPosition);

        }


    setTimeout(() => {
        setParticles();
    }, 500);


}




//------------------------------------------------------------------------------------Particles start

let setParticles = function () {
    for (let i = 0; i < graphicPixels.length; i++) {
        if (particles[i]) {
            var pos = getGraphicPos(graphicPixels[i]);
            particles[i].particle.targetPosition.x = pos.x;
            particles[i].particle.targetPosition.y = pos.y;
            particles[i].particle.targetPosition.z = pos.z;
        } else {
            var p = new Particle();
            p.init(i);
            scene.add(p.particle);
            particles[i] = p;
        }
    }

    for (let i = graphicPixels.length; i < particles.length; i++) {
        randomPos(particles[i].particle.targetPosition, true);
    }

    console.log('Total Particles: ' + particles.length);
}

let setParticlesInitial = function () {

    //delete particles
    for (let i = 0; i < particles.length; i++) {
        scene.remove(particles[i]);
    }
    

    for (let i = 0; i < graphicPixels.length; i++) {

            var p = new Particle();
            p.init(i);
            scene.add(p.particle);
            particles[i] = p;

    }

    for (let i = graphicPixels.length; i < particles.length; i++) {
        randomPos(particles[i].particle.targetPosition, true);
    }

    console.log('Total Particles: ' + particles.length);
}

let getGraphicPos =  function (pixel) {
    var posX = (pixel.x - graphicOffsetX - Math.random() * 4 - 2) * 3;
    var posY = (pixel.y - graphicOffsetY - Math.random() * 4 - 2) * 3;
    var posZ = -20 * Math.random() + 40;

    return { x: posX, y: posY, z: posZ };
}



let Particle = function() {
    this.vx = Math.random() * 0.05;
    this.vy = Math.random() * 0.05;
}

Particle.prototype.init = function (i) {
    var particle = new THREE.Object3D();
    var geometryCore = new THREE.SphereGeometry(2, 4, 4);
    var materialCore = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length]
    });

    var box = new THREE.Mesh(geometryCore, materialCore);
    box.geometry.__dirtyVertices = true;
    box.geometry.dynamic = true;

    var pos = getGraphicPos(graphicPixels[i]);
    particle.targetPosition = new THREE.Vector3(pos.x, pos.y, pos.z);

    particle.position.set(windowWidth * 0.5, windowHeight * 0.5, -10 * Math.random() + 20);
    randomPos(particle.position);

    for (var i = 0; i < box.geometry.vertices.length; i++) {
        box.geometry.vertices[i].x += -2 + Math.random() * 4;
        box.geometry.vertices[i].y += -2 + Math.random() * 4;
        box.geometry.vertices[i].z += -2 + Math.random() * 4;
    }

    particle.add(box);
    this.particle = particle;
}

Particle.prototype.updateRotation = function () {
    this.particle.rotation.x += this.vx;
    this.particle.rotation.y += this.vy;
}

Particle.prototype.updatePosition = function () {
    this.particle.position.lerp(this.particle.targetPosition, 0.1);
}

function updateParticles() {
    for (var i = 0, l = particles.length; i < l; i++) {
        particles[i].updateRotation();
        particles[i].updatePosition();
    }
}
//------------------------------------------------------------------------------------Particles end



//---------------------------------------------------------------------------------------Random position


let randomPos = function(vector, outFrame = false) {
    var radius = outFrame ? (windowWidth * 2) : (windowWidth * -2);
    var centerX = 0;
    var centerY = 0;

    // ensure that p(r) ~ r instead of p(r) ~ constant
    var r = windowWidth + radius * Math.random();
    var angle = Math.random() * Math.PI * 2;

    // compute desired coordinates
    vector.x = centerX + r * Math.cos(angle);
    vector.y = centerY + r * Math.sin(angle);
    vector.z = Math.random() * windowWidth;
}


