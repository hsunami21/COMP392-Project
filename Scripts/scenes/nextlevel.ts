module scenes {
    export class Next extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _gameLabel: createjs.Text;
        private _nextLevelButton: createjs.Bitmap;

        constructor() {
            super();

            this._initialize();
            this.start();
        }

        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++

        private _setupCanvas(): void {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#ffffff";
        }

        private _initialize(): void {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";

            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        }

        // PUBLIC METHODS ++++++++++++++++++++++++++++++++++++++++++++++

        public start(): void {
            this._gameLabel = new createjs.Text(
                "NEXT LEVEL",
                "64px Consolas",
                "#000000");
            this._gameLabel.regX = this._gameLabel.getMeasuredWidth() * 0.5;
            this._gameLabel.regY = this._gameLabel.getMeasuredLineHeight() * 0.5;
            this._gameLabel.x = config.Screen.WIDTH * 0.5;
            this._gameLabel.y = config.Screen.HEIGHT * 0.5 - 100;
            this._stage.addChild(this._gameLabel);
            
            this._nextLevelButton = new createjs.Bitmap(assets.getResult("StartButton"));
            this._nextLevelButton.regX = this._nextLevelButton.getBounds().width * 0.5;
            this._nextLevelButton.regY = this._nextLevelButton.getBounds().height * 0.5;
            this._nextLevelButton.x = config.Screen.WIDTH * 0.5;
            this._nextLevelButton.y = (config.Screen.HEIGHT * 0.5) + 50;
            this._stage.addChild(this._nextLevelButton);

            this._nextLevelButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });

            this._nextLevelButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });

            this._nextLevelButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.LEVEL2;
                changeScene();
            });
            
        }

        public update(): void {
            this._stage.update();
            this.simulate();
        }

        public resize(): void {
            this._setupCanvas();
        }
    }
}