var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scenes;
(function (scenes) {
    var Next = (function (_super) {
        __extends(Next, _super);
        function Next() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++
        Next.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#ffffff";
        };
        Next.prototype._initialize = function () {
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
        Next.prototype.start = function () {
            this._gameLabel = new createjs.Text("NEXT LEVEL", "64px Consolas", "#000000");
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
            this._nextLevelButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._nextLevelButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._nextLevelButton.on("click", function (event) {
                currentScene = config.Scene.LEVEL2;
                changeScene();
            });
        };
        Next.prototype.update = function () {
            this._stage.update();
            this.simulate();
        };
        Next.prototype.resize = function () {
            this._setupCanvas();
        };
        return Next;
    })(scenes.Scene);
    scenes.Next = Next;
})(scenes || (scenes = {}));
//# sourceMappingURL=nextlevel.js.map