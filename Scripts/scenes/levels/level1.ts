/**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
module scenes {
    /**
     * The Play class is where the main action occurs for the game
     * 
     * @class Level1
     * @param havePointerLock {boolean}
     */
    export class Level1 extends scenes.Scene {
        private havePointerLock: boolean;
        private element: any;

        private blocker: HTMLElement;
        private instructions: HTMLElement;
        private directionLight: DirectionalLight;
        private ambientLight: AmbientLight;
        private groundGeometry: CubeGeometry;
        private groundPhysicsMaterial: Physijs.Material;
        private groundMaterial: PhongMaterial;
        private ground: Physijs.Mesh;
        private groundTexture: Texture;
        private groundTextureNormal: Texture;
        private reticleGeometry: PlaneGeometry;
        private reticleMaterial: PhongMaterial;
        private reticleTexture: Texture;
        private reticle: Mesh;
        private playerGeometry: CubeGeometry;
        private playerMaterial: Material;
        private player: Mesh;
        private keyboardControls: objects.KeyboardControls;
        private mouseControls: objects.MouseControls;
        private isGrounded: boolean;
        private coinGeometry: Geometry;
        private coinMaterial: Physijs.Material;
        private coins: Physijs.ConcaveMesh[];
        private coinCount: number;
        private deathPlaneGeometry: CubeGeometry;
        private deathPlaneMaterial: Physijs.Material;
        private deathPlane: Physijs.Mesh;
        
        //Charge Bar
        private chargeBar: Mesh[];
        private chargeBarGeometry: PlaneGeometry;
        private chargeBarMaterials: PhongMaterial[];
        private chargeBarTextures: Texture[];
        private chargePower: number;
        
        private directionLineMaterial: LineBasicMaterial;
        private directionLineGeometry: Geometry;
        private directionLine: Line;

        private velocity: Vector3;
        private prevTime: number;
        private clock: Clock;

        private stage: createjs.Stage;
        private scoreLabel: createjs.Text;
        private shotsLabel: createjs.Text;
        //public scoreValue: number;
        //private shotsValue: number;
        private creator :builder.Creator = new builder.Creator();

        
        /**
         * @constructor
         */
        constructor() {
            super();

            this._initialize();
            this.start();
        }

        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++

        /**
         * Sets up the initial canvas for the play scene
         * 
         * @method setupCanvas
         * @return void
         */
        private _setupCanvas(): void {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
            canvas.style.backgroundColor = "#000000";
        }

        /**
         * The initialize method sets up key objects to be used in the scene
         * 
         * @method _initialize
         * @returns void
         */
        private _initialize(): void {
            // Create to HTMLElements
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";

            // setup canvas for menu scene
            this._setupCanvas();
            
            
            this.coinCount = 10;
            this.prevTime = 0;
            this.stage = new createjs.Stage(canvas);
            this.velocity = new Vector3(0, 0, 0);
            
            // setup a THREE.JS Clock objectg
            this.clock = new Clock();

            // Instantiate Game Controls
            this.keyboardControls = new objects.KeyboardControls();
            this.mouseControls = new objects.MouseControls();
        }
        /**
         * This method sets up the scoreboard for the scene
         * 
         * @method setupScoreboard
         * @returns void
         */
        private setupScoreboard(): void {
            // initialize  score and shots values
            scoreValue = 0;
            shotsValue = 5;

            // Add shots Label
            this.shotsLabel = new createjs.Text(
                "Shots: " + shotsValue,
                "40px Consolas",
                "#ffffff"
            );
            this.shotsLabel.x = config.Screen.WIDTH * 0.1;
            this.shotsLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.shotsLabel);
            console.log("Added shots Label to stage");

            // Add Score Label
            this.scoreLabel = new createjs.Text(
                "Score: " + scoreValue,
                "40px Consolas",
                "#ffffff"
            );
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
        }

        /**
         * Add a directional light to the scene
         * 
         * @method addDirectionalLight
         * @return void
         */
        private addDirectionalLight(): void {
            // Directional Light
            this.directionLight = new DirectionalLight(0xffffff, 1.2);
            this.directionLight.position.set(5, 40, 20);
            this.directionLight.castShadow = true;
            this.directionLight.lookAt(new Vector3(0, 0, 0));
            this.directionLight.shadowCameraNear = 2;
            this.directionLight.shadowCameraFar = 200;
            this.directionLight.shadowCameraLeft = -5;
            this.directionLight.shadowCameraRight = 5;
            this.directionLight.shadowCameraTop = 5;
            this.directionLight.shadowCameraBottom = -5;
            this.directionLight.shadowMapWidth = 2048;
            this.directionLight.shadowMapHeight = 2048;
            this.directionLight.shadowDarkness = 0.5;
            this.directionLight.name = "Directional Light";
            this.add(this.directionLight);
            console.log("Added directional light to scene");
        }
        
        /**
         * Add an ambient light to the scene
         * 
         * @method addAmbientLight
         * @return void
         */
        private addAmbientLight(): void{
            // Ambient Light
            this.ambientLight = new AmbientLight(0x303030);
            this.add(this.ambientLight);
            console.log("Added an Ambient Light to Scene");
        }

        /**
         * Add a ground plane to the scene
         * 
         * @method addGround
         * @return void
         */
        private addGround(): void {
            /*this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/GravelCobble.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);

            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/GravelCobbleNormal.png');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);*/

            this.groundMaterial = new PhongMaterial({ color: 0x00FF00 });
            /*this.groundMaterial.map = this.groundTexture;
            this.groundMaterial.bumpMap = this.groundTextureNormal;
            this.groundMaterial.bumpScale = 0.2;*/

            this.groundGeometry = new BoxGeometry(128, 1, 128);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 1, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.ground.position.set(0, -0.5, 0);
            this.add(this.ground);
            console.log("Added Burnt Ground to scene");
        }

        /**
         * Adds the player controller to the scene
         * 
         * @method addPlayer
         * @return void
         */
        private addPlayer(): void {
            
            
            
            // Player Object
            this.playerGeometry = new BoxGeometry(2, 4, 2);
            this.playerMaterial = new LambertMaterial({ color: 0x00ff00 });

            this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
            this.player.position.set(0, 4, 0);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.add(this.player);
            
            this.directionLineMaterial = new LineBasicMaterial({ color: 0xBadBad });
            this.directionLineGeometry = new Geometry();
            this.directionLineGeometry.vertices.push(new Vector3(0, 0, 0)); // line origin
            this.directionLineGeometry.vertices.push(new Vector3(0, 0, -50)); // end of the line
            this.directionLine = new Line(this.directionLineGeometry, this.directionLineMaterial);
            this.player.add(this.directionLine);
            console.log("Added DirectionLine to the Player");
            
            //console.log("Added Player to Scene");
        }

        /**
         * Add the death plane to the scene
         * 
         * @method addDeathPlane
         * @return void
         */
        /*private addDeathPlane(): void {
            this.deathPlaneGeometry = new BoxGeometry(100, 1, 100);
            this.deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({ color: 0xff0000 }), 0.4, 0.6);

            this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.deathPlaneMaterial, 0);
            this.deathPlane.position.set(0, -10, 0);
            this.deathPlane.name = "DeathPlane";
            this.add(this.deathPlane);
        }*/
        
        /**
         * Adds the reticle to the camera
         * 
         * @method addReticle
         * @return void
         */
        private addReticle(): void {
            //Reticle Object
            this.reticleTexture = new THREE.TextureLoader().load('../../Assets/images/reticleTexture.png');
            this.reticleTexture.wrapS = THREE.RepeatWrapping;
            this.reticleTexture.wrapT = THREE.RepeatWrapping;
            this.reticleTexture.repeat.set(1, 1);
            
            this.reticleGeometry = new PlaneGeometry(0.02, 0.02);
            this.reticleMaterial = new PhongMaterial({emissive: 0xFFFFFF});
            this.reticleMaterial.map = this.reticleTexture;
            this.reticleMaterial.transparent = true;
            this.reticleMaterial.opacity = 1;
            this.reticle = new Mesh(this.reticleGeometry, this.reticleMaterial);
            this.reticle.name = "Reticle";
            camera.add(this.reticle);
            this.reticle.position.set(0, 0.01, -0.2);
        }
        
        /**
         * Adds the chargeBar to the camera
         * 
         * @method addChargeBar
         * @return void
         */
        private addChargeBar(): void {
            //ChargeBar Object
            this.chargePower = 1.0;
            this.chargeBarGeometry = new PlaneGeometry(0.03, 0.015);
            this.chargeBar = [];
            this.chargeBarMaterials = [];
            this.chargeBarTextures = [];
            
            for (var i = 0; i < 13; i++){
                this.chargeBarTextures[i] = new THREE.TextureLoader().load('../../Assets/images/charge-bar/charge-bar-' + i + '.png');
                this.chargeBarTextures[i].wrapS = THREE.RepeatWrapping;
                this.chargeBarTextures[i].wrapT = THREE.RepeatWrapping;
                this.chargeBarTextures[i].repeat.set(1, 1);

                this.chargeBarMaterials[i] = new PhongMaterial({emissive: 0xFFFFFF});
                this.chargeBarMaterials[i].map = this.chargeBarTextures[i];
                this.chargeBarMaterials[i].transparent = true;
                this.chargeBarMaterials[i].opacity = 0;
                this.chargeBar[i] = new Mesh(this.chargeBarGeometry, this.chargeBarMaterials[i]);
                this.chargeBar[i].name = "ChargeBar-" + i;
                camera.add(this.chargeBar[i]);
                this.chargeBar[i].position.set(0, -0.042, -0.2);
            }
            
            this.chargeBarMaterials[0].opacity = 1;
            this.chargeBarMaterials[1].opacity = 1;
        }
       
        private generateLevel():void{
            //Create Golden Cubes
            this.creator.createCube(-5.5, 6.5, -15.5, 1, this);
            this.creator.createCube(-0.5, 6.5, -15.5, 1, this);
            this.creator.createCube(4.5, 6.5, -15.5, 1, this);
            
            // Set Positions
            var cubetangle1Pos = new Vector3(-5, 0, -15);
            var cubetangle2Pos = new Vector3(0, 0, -15);
            var cubetangle3Pos = new Vector3(5, 0, -15);
            var cubeamid1Pos = new Vector3(-5, 3, -15);
            var cubeamid2Pos = new Vector3(0, 3, -15);
            var cubeamid3Pos = new Vector3(5, 3, -15);
            
            // Instantiate Cubetangles
            this.creator.createCubetangle(3, 3, 3, cubetangle1Pos, this);
            this.creator.createCubetangle(3, 3, 3, cubetangle2Pos, this);
            this.creator.createCubetangle(3, 3, 3, cubetangle3Pos, this);
            
            // Instantiate Cubeamids
            this.creator.createCubeamid(3, cubeamid1Pos, this);
            this.creator.createCubeamid(3, cubeamid2Pos, this);
            this.creator.createCubeamid(3, cubeamid3Pos, this);
        }
        

        /**
         * This method adds a coin to the scene
         * 
         * @method addCoinMesh
         * @return void
         */
        private addCoinMesh(): void {
            var self = this;

            this.coins = new Array<Physijs.ConvexMesh>(); // Instantiate a convex mesh array

            var coinLoader = new THREE.JSONLoader().load("../../Assets/imported/coin.json", function(geometry: THREE.Geometry) {
                var phongMaterial = new PhongMaterial({ color: 0xE7AB32 });
                phongMaterial.emissive = new THREE.Color(0xE7AB32);

                var coinMaterial = Physijs.createMaterial((phongMaterial), 0.4, 0.6);

                for (var count: number = 0; count < self.coinCount; count++) {
                    self.coins[count] = new Physijs.ConvexMesh(geometry, coinMaterial);
                    self.coins[count].receiveShadow = true;
                    self.coins[count].castShadow = true;
                    self.coins[count].name = "Coin";
                    self.setCoinPosition(self.coins[count]);
                    console.log("Added Coin Mesh to Scene, at position: " + self.coins[count].position);
                }
            });


        }

        /**
         * This method randomly sets the coin object's position
         * 
         * @method setCoinPosition
         * @return void
         */
        private setCoinPosition(coin: Physijs.ConvexMesh): void {
            var randomPointX: number = Math.floor(Math.random() * 20) - 10;
            var randomPointZ: number = Math.floor(Math.random() * 20) - 10;
            coin.position.set(randomPointX, 10, randomPointZ);
            this.add(coin);
        }

        /**
         * Event Handler method for any pointerLockChange events
         * 
         * @method pointerLockChange
         * @return void
         */
        pointerLockChange(event): void {
            if (document.pointerLockElement === this.element /*||
                document.mozPointerLockElement === this.element ||
                document.webkitPointerLockElement === this.element*/){
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            } else {
                // disable our mouse and keyboard controls
                if (shotsValue <= 0) {
                    this.blocker.style.display = 'none';
                    document.removeEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
                } else {
                this.blocker.style.display = '-webkit-box';
                this.blocker.style.display = '-moz-box';
                this.blocker.style.display = 'box';
                this.instructions.style.display = '';
                }
                this.keyboardControls.enabled = false;
                this.mouseControls.enabled = false;
                console.log("PointerLock disabled");
            }
        }

        /**
         * Event handler for PointerLockError
         * 
         * @method pointerLockError
         * @return void
         */
        private pointerLockError(event): void {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        }

        /**
         * This method checks the charge level and shows the appropriate textures
         * 
         * @method checkCharge
         * @return void
         */
         private checkCharge(): void{
             if (this.chargePower > 12) { this.chargePower = 12 };
             
             for (var i = 2; i < this.chargeBar.length; i++){
                 if (this.chargePower >= i) {
                     this.chargeBarMaterials[i].opacity = 1;
                 }
                 else {
                     this.chargeBarMaterials[i].opacity = 0;
                 }
             }
         }
         
         /**
         * This method creates and launches a sphere projectile
         * 
         * Projectile is create at player position
         * 
         * @method launchSphere
         * @return void
         */
         private launchSphere(launchPower: number, launchAngle: number, launchYaw: number): void{
             if (shotsValue > 0){
                this.creator.createProjectile(this.player.position.x, this.player.position.y + 2, this.player.position.z, 
                1, 5, 5, this, launchPower, launchAngle, launchYaw);
             }
         }


        // Check Controls Function

        /**
         * This method updates the player's position based on user input
         * 
         * @method checkControls
         * @return void
         */
        private checkControls(): void {
            if (this.keyboardControls.enabled) {
                
                //this.velocity = new Vector3();

                var time: number = performance.now();
                var delta: number = (time - this.prevTime) / 1000;
                
                                //ChargeBar
                if (this.keyboardControls.charge){
                    this.chargePower += 3 * delta;
                }
                else {
                    if (this.chargePower > 1){
                    this.launchSphere(this.chargePower * 5000 * delta, camera.rotation.x * 2000, camera.rotation.y * 700);
                    shotsValue--;
                    this.shotsLabel.text = "Shots: " + shotsValue;
                     if (shotsValue <= 0) {
                        // Exit Pointer Lock
                        document.exitPointerLock();
                        this.children = []; // an attempt to clean up
                        this.player.remove(camera);

                        // Play the Game Over Scene
                        currentScene = config.Scene.OVER;
                        changeScene();
                    }
                    
                    }
                    this.chargePower = 0;
                }
                this.checkCharge();

                /*if (this.isGrounded) {
                    var direction = new Vector3(0, 0, 0);
                    if (this.keyboardControls.moveForward) {
                        this.velocity.z -= 400.0 * delta;
                    }
                    if (this.keyboardControls.moveLeft) {
                        this.velocity.x -= 400.0 * delta;
                    }
                    if (this.keyboardControls.moveBackward) {
                        this.velocity.z += 400.0 * delta;
                    }
                    if (this.keyboardControls.moveRight) {
                        this.velocity.x += 400.0 * delta;
                    }
                    if (this.keyboardControls.jump) {
                        this.velocity.y += 4000.0 * delta;
                        if (this.player.position.y > 4) {
                            this.isGrounded = false;
                            createjs.Sound.play("jump");
                        }

                    }

                    this.player.setDamping(0.7, 0.1);
                    // Changing player's rotation
                    this.player.setAngularVelocity(new Vector3(0, this.mouseControls.yaw, 0));
                    direction.addVectors(direction, this.velocity);
                    direction.applyQuaternion(this.player.quaternion);
                    if (Math.abs(this.player.getLinearVelocity().x) < 20 && Math.abs(this.player.getLinearVelocity().y) < 10) {
                        this.player.applyCentralForce(direction);
                    }*/

                    this.cameraLook();

                } // isGrounded ends

                //reset Pitch and Yaw
                this.mouseControls.pitch = 0;
                this.mouseControls.yaw = 0;

                this.prevTime = time;
            //} 
            // Controls Enabled ends
            /*else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
            }*/
        }

        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {
            var self = this;

            // Set Up Scoreboard
            this.setupScoreboard();

            //check to see if pointerlock is supported
            this.havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;



            // Check to see if we have pointerLock
            if (this.havePointerLock) {
                this.element = document.body;

                this.instructions.addEventListener('click', () => {

                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");

                    this.element.requestPointerLock = this.element.requestPointerLock ||
                        this.element.mozRequestPointerLock ||
                        this.element.webkitRequestPointerLock;

                    this.element.requestPointerLock();
                });

                document.addEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
            }

            // Scene changes for Physijs
            this.name = "Main";
            this.fog = new THREE.Fog(0xffffff, 0, 750);
            this.setGravity(new THREE.Vector3(0, -10, 0));

            this.addEventListener('update', () => {
                this.simulate(undefined, 2);
            });
            
            // Add Ambient Light to the scene
            this.addAmbientLight();
           
            
            // Add Directional Light to the scene
            this.addDirectionalLight();

            // Ground Object
            this.addGround();

            // Add player controller
            this.addPlayer();

            // Add custom coin imported from Blender
            //this.addCoinMesh();

            // Add death plane to the scene
            //this.addDeathPlane();

            // Collision Check


            this.player.addEventListener('collision', function(eventObject) {
                if (eventObject.name === "Ground") {
                    this.isGrounded = true;
                    createjs.Sound.play("land");
                }
                if (eventObject.name === "Coin") {
                    createjs.Sound.play("coin");
                    this.remove(eventObject);
                    this.setCoinPosition(eventObject);
                    scoreValue += 100;
                    this.scoreLabel.text = "SCORE: " + scoreValue;
                }

                if (eventObject.name === "DeathPlane") {
                    createjs.Sound.play("hit");
                    shotsValue--;
                   
                    this.remove(this.player);
                    this.player.position.set(0, 20, 40);
                    this.add(this.player);
                }
            }.bind(this));

            // create parent-child relationship with camera and player
            this.player.add(camera);
            camera.position.set(0,2,0);
            
            // Add UI Elements
            this.addReticle();
            this.addChargeBar();
            
            
            this.generateLevel();

            this.simulate();
        }

        /**
         * Camera Look function
         * 
         * @method cameraLook
         * @return void
         */
        private cameraLook(): void {
            var zenith: number = THREE.Math.degToRad(25);
            var nadir: number = THREE.Math.degToRad(-25);

            var cameraPitch: number = camera.rotation.x + this.mouseControls.pitch;
            var cameraYaw: number = camera.rotation.y + this.mouseControls.yaw;

            // Constrain the Camera Pitch & Yaw
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
            camera.rotation.y = THREE.Math.clamp(cameraYaw, nadir, zenith);
        }

        /**
         * @method update
         * @returns void
         */
        public update(): void {
            /*
            this.coins.forEach(coin => {
                coin.setAngularFactor(new Vector3(0, 0, 0));
                coin.setAngularVelocity(new Vector3(0, 1, 0));
            });*/

            this.checkControls();
            this.stage.update();
        }

        /**
         * Responds to screen resizes
         * 
         * @method resize
         * @return void
         */
        public resize(): void {
            canvas.style.width = "100%";
            this.shotsLabel.x = config.Screen.WIDTH * 0.1;
            this.shotsLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        }
    }
}