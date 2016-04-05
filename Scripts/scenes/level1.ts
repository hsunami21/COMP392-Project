/**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
module scenes {
    /**
     * The Level1 class is where the main action occurs for the game
     * 
     * @class Level1
     * @param havePointerLock {boolean}
     */
    export class Level1 extends scenes.Scene {
        private havePointerLock: boolean;
        private element: any;

        private blocker: HTMLElement;
        private instructions: HTMLElement;
        private spotLight: SpotLight;
        private groundGeometry: CubeGeometry;
        private groundPhysicsMaterial: Physijs.Material;
        private groundMaterial: PhongMaterial;
        private ground: Physijs.Mesh;
        private groundTexture: Texture;
        private groundTextureNormal: Texture;
        private playerGeometry: CubeGeometry;
        private playerMaterial: Physijs.Material;
        private player: Physijs.Mesh;
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
        
        //Platform
        private platformGeometry: CubeGeometry;
        private platformMaterial: Physijs.Material;
        private platform: Physijs.Mesh;
        
        //Wall
        private wallGeometry: CubeGeometry;
        private wallMaterial: Physijs.Material;
        private wall: Physijs.Mesh;

        private velocity: Vector3;
        private prevTime: number;
        private clock: Clock;

        private stage: createjs.Stage;
        private scoreLabel: createjs.Text;
        private timerLabel: createjs.Text;
        private gotoLabel: createjs.Text;
        private scoreValue: number;
        private timerValue: number;
        private gotoText: string;
        
        private randomNum: number;
        private waitTime: boolean;
        private gameOver: boolean;
        
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
            this.waitTime = false;

            this.stage = new createjs.Stage(canvas);
            this.velocity = new Vector3(0, 0, 0);

            // setup a THREE.JS Clock object
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
            // initialize  score and lives values
            this.scoreValue = 0;
            this.timerValue = 60;

            // Add Lives Label
            this.timerLabel = new createjs.Text(
                "TIME: " + this.timerValue,
                "40px Consolas",
                "#ffffff"
            );
            this.timerLabel.x = config.Screen.WIDTH * 0.4;
            this.timerLabel.y = (config.Screen.HEIGHT * 0.1) * 0.15;
            this.stage.addChild(this.timerLabel);
            console.log("Added Lives Label to stage");

            // Add Score Label
            this.scoreLabel = new createjs.Text(
                "SCORE: " + this.scoreValue,
                "40px Consolas",
                "#ffffff"
            );
            this.scoreLabel.x = config.Screen.WIDTH * 0.1;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.1) * 0.15;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
            
            // Add Location Label
            this.gotoLabel = new createjs.Text(
                "GO TO: " + this.randomLocation(),
                "40px Consolas",
                "#ffffff"
            );
            this.gotoLabel.x = config.Screen.WIDTH * 0.65;
            this.gotoLabel.y = (config.Screen.HEIGHT * 0.1) * 0.15;
            this.stage.addChild(this.gotoLabel);
            console.log("Added Location Label to stage");
        }

        /**
         * Add a spotLight to the scene
         * 
         * @method addSpotLight
         * @return void
         */
        private addSpotLight(): void {
            // Spot Light
            this.spotLight = new SpotLight(0xffffff);
            this.spotLight.position.set(20, 128, -15);
            this.spotLight.castShadow = true;
            this.spotLight.intensity = 2;
            this.spotLight.lookAt(new Vector3(0, 0, 0));
            this.spotLight.shadowCameraNear = 2;
            this.spotLight.shadowCameraFar = 200;
            this.spotLight.shadowCameraLeft = -5;
            this.spotLight.shadowCameraRight = 5;
            this.spotLight.shadowCameraTop = 5;
            this.spotLight.shadowCameraBottom = -5;
            this.spotLight.shadowMapWidth = 2048;
            this.spotLight.shadowMapHeight = 2048;
            this.spotLight.shadowDarkness = 0.5;
            this.spotLight.name = "Spot Light";
            this.add(this.spotLight);
            console.log("Added spotLight to scene");
        }

        /**
         * Add a ground plane to the scene
         * 
         * @method addGround
         * @return void
         */
        private addGround(): void {
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/GravelCobble.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);

            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/GravelCobbleNormal.png');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);

            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            this.groundMaterial.bumpMap = this.groundTextureNormal;
            this.groundMaterial.bumpScale = 0.2;

            this.groundGeometry = new BoxGeometry(128, 1, 128);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
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
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);

            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(0, 5, 10);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.add(this.player);
            console.log("Added Player to Scene");
        }
        
        /**
         * Add the Green Platform to the scene
         * 
         * @method addGreenPlatform
         * @return void
         */
        
        private addGreenPlatform(): void {
            // Platform Object
            this.platformGeometry = new BoxGeometry(10, 2, 10);
            this.platformMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x01DF01 }), 0.4, 0);
            
            this.platform = new Physijs.ConvexMesh(this.platformGeometry, this.platformMaterial, 0);
            this.platform.position.set(-50, 1, 50)
            this.platform.receiveShadow = true;
            this.platform.name = "GreenPlatform";
            this.add(this.platform);
            console.log("Added Green Platform to Scene")
        }
        
        /**
         * Add the Green Platform to the scene
         * 
         * @method addGreenPlatform
         * @return void
         */
        
        private addBluePlatform(): void {
            // Platform Object
            this.platformGeometry = new BoxGeometry(10, 2, 10);
            this.platformMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x0000FF }), 0.4, 0);
            
            this.platform = new Physijs.ConvexMesh(this.platformGeometry, this.platformMaterial, 0);
            this.platform.position.set(50, 1, -50)
            this.platform.receiveShadow = true;
            this.platform.name = "BluePlatform";
            this.add(this.platform);
            console.log("Added Blue Platform to Scene")
        }
        
        /**
         * Add the Green Platform to the scene
         * 
         * @method addGreenPlatform
         * @return void
         */
        
        private addRedPlatform(): void {
            // Platform Object
            this.platformGeometry = new BoxGeometry(10, 2, 10);
            this.platformMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xFF0000 }), 0.4, 0);
            
            this.platform = new Physijs.ConvexMesh(this.platformGeometry, this.platformMaterial, 0);
            this.platform.position.set(50, 1, 50)
            this.platform.receiveShadow = true;
            this.platform.name = "RedPlatform";
            this.add(this.platform);
            console.log("Added Red Platform to Scene")
        }
        
        /**
         * Add wall to the scene
         * 
         * @method addWalls
         * @return void
         */
        
         private addWalls(): void {
             // wall Object
             this.wallGeometry = new BoxGeometry(1, 1, 10);
             this.wallMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x0000FF }), 0.4, 0);
            
             this.wall = new Physijs.ConvexMesh(this.wallGeometry, this.wallMaterial, 0);
             this.wall.position.set(-3, 1, 0)
             this.wall.receiveShadow = true;
             this.wall.name = "wall1";
             this.add(this.wall);
             console.log("Added wall1 to Scene")
         }

        /**
         * Add the death plane to the scene
         * 
         * @method addDeathPlane
         * @return void
         */
        private addDeathPlane(): void {
            this.deathPlaneGeometry = new BoxGeometry(100, 1, 100);
            this.deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({ color: 0xff0000 }), 0.4, 0.6);

            this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.deathPlaneMaterial, 0);
            this.deathPlane.position.set(0, -10, 0);
            this.deathPlane.name = "DeathPlane";
            this.add(this.deathPlane);
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
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            } else {
                this.keyboardControls.enabled = false;
                this.mouseControls.enabled = false;
                if (this.gameOver) {
                    this.blocker.style.display = 'none';
                    document.removeEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
                }
                else {
                    // disable our mouse and keyboard controls
                    this.blocker.style.display = '-webkit-box';
                    this.blocker.style.display = '-moz-box';
                    this.blocker.style.display = 'box';
                    this.instructions.style.display = '';
                }
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

        // Check Controls Function

        /**
         * This method updates the player's position based on user input
         * 
         * @method checkControls
         * @return void
         */
        private checkControls(): void {
            if (this.keyboardControls.enabled) {
                this.velocity = new Vector3();

                var time: number = performance.now();
                var delta: number = (time - this.prevTime) / 1000;

                if (this.isGrounded) {
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
                    }

                    this.cameraLook();

                } // isGrounded ends

                //reset Pitch and Yaw
                this.mouseControls.pitch = 0;
                this.mouseControls.yaw = 0;

                this.prevTime = time;
            } // Controls Enabled ends
            else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
            }
        }
        
        private reduceTimer(): void{
            var self = this;
            if (!this.waitTime) {
                this.waitTime = true;
                setTimeout(function() {
                    self.timerValue += -1;
                    self.waitTime = false;
                }, 1000);
            }
        }
        
        private randomLocation(): string {
            this.randomNum = Math.floor(Math.random() * 3);
            console.log(this.randomNum);
            switch (this.randomNum) {
                case 0:
                    if (this.gotoText == "Red Platform") {
                        this.randomLocation();
                    }
                    else {
                        this.gotoText = "Red Platform";
                    }
                    break;
                case 1:
                    if (this.gotoText == "Green Platform") {
                        this.randomLocation();
                    }
                    else {
                        this.gotoText = "Green Platform";
                    }
                    break;
                case 2:
                    if (this.gotoText == "Blue Platform") {
                        this.randomLocation();
                    }
                    else {
                        this.gotoText = "Blue Platform";
                    }
                    break;
            }
            return this.gotoText;
        }

        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {
            
            // Set random location at start
            this.randomLocation();
            
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

            // Add Spot Light to the scene
            this.addSpotLight();

            // Ground Object
            this.addGround();

            // Add player controller
            this.addPlayer();
            
            //Add green platform
            this.addGreenPlatform();
            
            //Add blue platform
            this.addBluePlatform();
            
            //Add red platform
            this.addRedPlatform();
            
            //Add walls
            this.addWalls();

            // Add custom coin imported from Blender
            this.addCoinMesh();

            // Add death plane to the scene
            this.addDeathPlane();

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
                    this.scoreValue += 100;
                    this.scoreLabel.text = "SCORE: " + this.scoreValue;
                    this.gotoLabel.text = "GO TO: " + this.randomLocation();

                }
                
                if(eventObject.name === "GreenPlatform"){
                    this.gotoLabel.text = "Go TO: " + this.randomLocation();
                }
                
                if(eventObject.name === "BluePlatform"){
                    this.gotoLabel.text = "Go TO: " + this.randomLocation();
                }
                
                if(eventObject.name === "RedPlatform"){
                    this.gotoLabel.text = "Go TO: " + this.randomLocation();
                }

                if (eventObject.name === "DeathPlane") {
                    createjs.Sound.play("hit");
                    this.remove(this.player);
                    this.player.position.set(0, 5, 10);
                    this.add(this.player);
                }
            }.bind(this));

            // create parent-child relationship with camera and player
            this.player.add(camera);
            camera.position.set(0, 1, 0);

            this.simulate();
        }

        /**
         * Camera Look function
         * 
         * @method cameraLook
         * @return void
         */
        private cameraLook(): void {
            var zenith: number = THREE.Math.degToRad(90);
            var nadir: number = THREE.Math.degToRad(-90);

            var cameraPitch: number = camera.rotation.x + this.mouseControls.pitch;

            // Constrain the Camera Pitch
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        }

        /**
         * @method update
         * @returns void
         */
        public update(): void {
            
            if (this.gameOver == true) {
                document.exitPointerLock(); 
                this.children = [];
                this.player.remove(camera);
                currentScene = config.Scene.OVER;
                changeScene();
            }

            this.timerLabel.text = "TIME: " + this.timerValue;

            if (this.timerValue >= 0) {
                this.reduceTimer();
            }
            else {
                this.gameOver = true;
            }

            this.coins.forEach(coin => {
                coin.setAngularFactor(new Vector3(0, 0, 0));
                coin.setAngularVelocity(new Vector3(0, 1, 0));
            });

            this.checkControls();
            this.stage.update();
            this.simulate();
        }

        /**
         * Responds to screen resizes
         * 
         * @method resize
         * @return void
         */
        public resize(): void {
            canvas.style.width = "100%";
            this.timerLabel.x = config.Screen.WIDTH * 0.4;
            this.timerLabel.y = (config.Screen.HEIGHT * 0.1) * 0.15;
            this.scoreLabel.x = config.Screen.WIDTH * 0.1;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.1) * 0.15;
            this.gotoLabel.x = config.Screen.WIDTH * 0.65;
            this.gotoLabel.y = (config.Screen.HEIGHT * 0.1) * 0.15;
            this.stage.update();
        }
    }
}