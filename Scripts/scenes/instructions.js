var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scenes;
(function (scenes) {
    var Instructions = (function (_super) {
        __extends(Instructions, _super);
        function Instructions() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++
        Instructions.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#ffffff";
        };
        Instructions.prototype._initialize = function () {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";
            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        };
        // PUBLIC METHODS ++++++++++++++++++++++++++++++++++++++++++++++
        Instructions.prototype.start = function () {
            this._gameLabel = new createjs.Text("INSTRUCTIONS", "48px Consolas", "#000000");
            this._gameLabel.regX = this._gameLabel.getMeasuredWidth() * 0.5;
            this._gameLabel.regY = this._gameLabel.getMeasuredLineHeight() * 0.5;
            this._gameLabel.x = config.Screen.WIDTH * 0.5;
            this._gameLabel.y = config.Screen.HEIGHT * 0.5 - 250;
            this._stage.addChild(this._gameLabel);
            this._instrLabel = new createjs.Text("The objective of this game is to train your memory as well as help you\n\n" +
                "learn your colours. You will be shown a map at the beginning of each level\n\n" +
                "for 10 seconds. After that, you will be told to run to specific locations.\n\n\n" +
                "Your goal is to run to the location as fast as you can. The faster you get\n\n" +
                "there, the more points you will score. You will lose 10 seconds if you run\n\n" +
                "to the wrong location - so be careful!\n\n\n" +
                "(W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)", "24px Consolas", "#000000");
            // this._instrLabel.regX = this._instrLabel.getMeasuredWidth() * 0.5;
            // this._instrLabel.regY = this._instrLabel.getMeasuredLineHeight() * 0.5;
            this._instrLabel.x = config.Screen.WIDTH * 0.22;
            this._instrLabel.y = config.Screen.HEIGHT * 0.5 - 200;
            this._stage.addChild(this._instrLabel);
            this._backButton = new createjs.Bitmap(assets.getResult("BackButton"));
            this._backButton.regX = this._backButton.getBounds().width * 0.5;
            this._backButton.regY = this._backButton.getBounds().height * 0.5;
            this._backButton.x = config.Screen.WIDTH * 0.5;
            this._backButton.y = (config.Screen.HEIGHT * 0.5) + 250;
            this._stage.addChild(this._backButton);
            this._backButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._backButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._backButton.on("click", function (event) {
                currentScene = config.Scene.MENU;
                changeScene();
            });
        };
        Instructions.prototype.update = function () {
            this._stage.update();
        };
        Instructions.prototype.resize = function () {
            this._setupCanvas();
        };
        return Instructions;
    }(scenes.Scene));
    scenes.Instructions = Instructions;
})(scenes || (scenes = {}));
//# sourceMappingURL=instructions.js.map