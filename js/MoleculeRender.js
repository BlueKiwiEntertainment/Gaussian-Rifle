let moleculeScene;
let moleculeControls;
let moleculeRenderer;
let moleculeLabelRenderer;
let moleculeCamera;
let moleculeAtomsGroup;
let moleculeBondsGroup;
let bondWidth = 0.1;

function moleculeRender(canvasId) {

	console.log("Molecule render start");

	//SETUP BASE SCENE/RENDER
	var canvas = document.getElementById(canvasId);
	//------------------------------------------------------------Renderer
	moleculeRenderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
	var container = document.getElementById("container");
	moleculeRenderer.setSize(container.clientWidth, container.clientHeight);

	moleculeLabelRenderer = new CSS2DRenderer();
	moleculeLabelRenderer.setSize(container.offsetWidth, container.offsetHeight);
	moleculeLabelRenderer.domElement.style.position = 'absolute';
	moleculeLabelRenderer.domElement.style.top = `${container.offsetTop}px`;
	moleculeLabelRenderer.domElement.style.pointerEvents = 'none';

	if (window.innerWidth > 800) {
		moleculeRenderer.shadowMap.enabled = true;
		moleculeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
		moleculeRenderer.shadowMap.needsUpdate = true;
	};

	container.appendChild(moleculeRenderer.domElement);
	container.appendChild(moleculeLabelRenderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	function onWindowResize() {
		moleculeCamera.aspect = container.offsetWidth / container.offsetHeight;
		moleculeCamera.updateProjectionMatrix();
		moleculeRenderer.setSize(container.clientWidth, container.clientHeight);
	};



	//-------------------------------------------------------------------Camera
	moleculeCamera = new THREE.PerspectiveCamera(70, container.offsetWidth / container.offsetHeight, 0.1, 1000);
	moleculeRenderer.setPixelRatio(window.devicePixelRatio);
	moleculeCamera.position.set(0, 2, 14);
	moleculeScene = new THREE.Scene();
	//END SETUP

	//Add thingys to the moleculeScene
	var gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
	//----------------------------------------------------------------- Lights
	var ambientLight = new THREE.AmbientLight(0x404040);
	var lightFront = new THREE.SpotLight(0x718093, 1);
	var lightBack = new THREE.PointLight(0x718093, 0.5);
    
	lightFront.rotation.x = 45 * Math.PI / 180;
	lightFront.rotation.z = -45 * Math.PI / 180;
	lightFront.position.set(5, 5, 5);
	lightFront.castShadow = true;
	lightFront.shadow.mapSize.width = 6000;
	lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
	lightFront.penumbra = 0.1;
	lightBack.position.set(0, 6, 0);

	moleculeScene.add(moleculeCamera);
	moleculeScene.add(lightFront);
	moleculeScene.add(lightBack);
	moleculeScene.add(ambientLight);


	moleculeScene.add(gridHelper);

	var setcolor = 0x192a56;

	moleculeScene.background = new THREE.Color(setcolor);

	moleculeAtomsGroup = new THREE.Group();
	moleculeBondsGroup = new THREE.Group();

	moleculeScene.add(moleculeAtomsGroup);
    moleculeScene.add(moleculeBondsGroup);

	//---------------------------------------------------------------Controls


	moleculeControls = new TrackballControls(moleculeCamera, moleculeRenderer.domElement);
	moleculeControls.minDistance = 0;
	moleculeControls.maxDistance = 2000;


	//End add thingys


	//----------------------------------------------------------------- ANIMATE



	//----------------------------------------------------------------- Main-ish
	animateMolecule();




}

var animateMolecule = function () {
	var time = Date.now() * 0.00005;
	requestAnimationFrame(animateMolecule);

	moleculeControls.update();

	moleculeRenderer.render(moleculeScene, moleculeCamera);

}

var moleculeToRender = function (jsonMolecule) {



	
	var molecule = JSON.parse(jsonMolecule);
	moleculeCreator(molecule);
	//Cheat sheet:
	//atoms: atom[]
	//bonds: bond[]
	//atom: symbol (string), atomicNumber(int), coordinates(type), CPKColor(string)
	//coordinates: x(float) y(float) z(float)
	//bond: atom1(type: atom) atom2(type: atom) Now I realise its overkill, it only should have coordiantes...

}

var moleculeCreator = function (molecule) {


	//Lets create geometry for atoms

	for (let i = 0, l = molecule.atoms.length; i < l; i++) {



		var atom = molecule.atoms[i];



		var geometry = new THREE.SphereGeometry(0.5, 32, 32);

		var material = new THREE.MeshStandardMaterial({
			color: "rgb(" + atom.CPKColor + ")",
			roughness: 0.5,
			metalness: 0.2,
			//emissive: "rgb(" + atom.CPKColor + ")",
			//emissiveIntensity: 0.5,
			shading: THREE.SmoothShading
		});

		var sphere = new THREE.Mesh(geometry, material);



		sphere.position.x = atom.coordinates.x;
		sphere.position.y = atom.coordinates.y;
		sphere.position.z = atom.coordinates.z;


		moleculeAtomsGroup.add(sphere);

	}

	//This time we create bonds
	//Dont use line material because you cant adjust width 


	for (let i = 0, l = molecule.bonds.length; i < l; i++) {
		var bond = molecule.bonds[i];
		var geometry = new THREE.SphereGeometry();
		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			shading: THREE.SmoothShading
		});



		var atom1 = bond.atom1;
		var atom2 = bond.atom2;

		var startAtomPoint = new THREE.Vector3(atom1.coordinates.x, atom1.coordinates.y, atom1.coordinates.z);
		var endAtomPoint = new THREE.Vector3(atom2.coordinates.x, atom2.coordinates.y, atom2.coordinates.z);

		geometry.vertices.push(startAtomPoint);
		geometry.vertices.push(endAtomPoint);


		var line = new THREE.Mesh(geometry, material);

        line.position.copy(startAtomPoint.lerp(endAtomPoint, 0.5));
		line.scale.set(bondWidth, bondWidth, (startAtomPoint.distanceTo(endAtomPoint)) - 2.7 * bondWidth);
		line.lookAt(endAtomPoint);


		moleculeBondsGroup.add(line);
	}



	//Log molecule
	//console.log(molecule);
	animateMolecule();


}


//Molecule atoms stored in moleculeAtomsGroup;
//Molecule bonds stored in moleculeBondsGroup;


let allAnimations = [];

var moleculeToAnimate = function (jsonMoleculeArray){

	//Clear all animations
	allAnimations = [];
    //Clear molecule
	moleculeAtomsGroup.children = [];
	moleculeBondsGroup.children = [];
    
    
	var molecules = JSON.parse(jsonMoleculeArray);


	moleculeCreator(molecules[0]);

    //create animation for each atom in the molecule

	var animations = [];
    allAnimations.push(animations);

		for (var i = 0; i < molecules[0].atoms.length; i++) {
			animation = new TimelineMax({ repeat: -1, repeatDelay: 1, yoyo: false });

			animations.push(animation);
        
	}

	var animationsBonds = [];
	var animationsBondsRot = [];
	var animationsBondsSca = [];
	allAnimations.push(animationsBonds);
	allAnimations.push(animationsBondsRot);
    allAnimations.push(animationsBondsSca);
	for (var i = 0; i < molecules[0].atoms.length; i++) {
		animation = new TimelineMax({ repeat: -1, repeatDelay: 1, yoyo: false });

		animationsBonds.push(animation);

	}
	for (var i = 0; i < molecules[0].atoms.length; i++) {
		animation = new TimelineMax({ repeat: -1, repeatDelay: 1, yoyo: false });

		animationsBondsRot.push(animation);

	}
	for (var i = 0; i < molecules[0].atoms.length; i++) {
		animation = new TimelineMax({ repeat: -1, repeatDelay: 1, yoyo: false });

		animationsBondsSca.push(animation);

	}
    

        
		for (let i = 1, l = molecules.length; i < l; i++) {
			var molecule = molecules[i];


			//Animate all the atoms moving
			for (var j = 0; j < molecule.atoms.length; j++) {

				//Using TweenMax
				var atom = molecule.atoms[j];
				var previousAtom = molecules[i - 1].atoms[j];
				var sphere = moleculeAtomsGroup.children[j];
				animations[j].to(sphere.position, 0.5, 
					{ x: atom.coordinates.x, y: atom.coordinates.y, z: atom.coordinates.z, ease: Power1.easeInOut });

                    
			}
			//Animate all the bonds moving
			for (var j = 0; j < molecule.bonds.length; j++) {

				//Using TweenMax

                //this will be our new bond data calculate same way as in create molecules
				var bond = molecule.bonds[j];

                
				var line = moleculeBondsGroup.children[j];

				var atom1 = bond.atom1;
				var atom2 = bond.atom2;

				var startAtomPoint = new THREE.Vector3(atom1.coordinates.x, atom1.coordinates.y, atom1.coordinates.z);
				var endAtomPoint = new THREE.Vector3(atom2.coordinates.x, atom2.coordinates.y, atom2.coordinates.z);

                //creating cube for the purpose of rotation simulation

				var geometry = new THREE.SphereGeometry(0.5, 32, 32);
				var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
				var simuLine = new THREE.Mesh(geometry, material);
				simuLine.position.copy(startAtomPoint.lerp(endAtomPoint, 0.5));
				simuLine.scale.set(bondWidth, bondWidth, (startAtomPoint.distanceTo(endAtomPoint)) - 2.7 * bondWidth);
				simuLine.lookAt(endAtomPoint);

				animationsBonds[j].to(line.position, 0.5, {
					x: simuLine.position.x, y: simuLine.position.y, z: simuLine.position.z, ease: Power1.easeInOut
				});

				animationsBondsRot[j].to(line.rotation, 0.5, {
					_x: simuLine.rotation._x, _y: simuLine.rotation._y, _z: simuLine.rotation._z, ease: Power1.easeInOut
				});

				animationsBondsSca[j].to(line.scale, 0.5, {
					x: simuLine.scale.x, y: simuLine.scale.y, _z: simuLine.scale.z, ease: Power1.easeInOut
				});
                

			}
                  

		}


    //play animation
	for (var k = 0; k < animations.length; k++) {
		animations[k].play();
	}

	for (var k = 0; k < animationsBonds.length; k++) {
		animationsBonds[k].play();
		animationsBondsRot[k].play();
    }
    
	
        
}


//allAnimations is an array of arrays of TimelineMax
var pauseAnimation = function () {
	

	for (var i = 0; i < allAnimations.length; i++) {
		var animations = allAnimations[i];
		for (var j = 0; j < animations.length; j++) {
			animations[j].pause();
		}
	}
    
}

var resumeAnimation = function () {
	//allAnimations is an array of arrays of TimelineMax
	for (var i = 0; i < allAnimations.length; i++) {
		var animations = allAnimations[i];
		for (var j = 0; j < animations.length; j++) {
			animations[j].play();
		}
	}
    

    
}


