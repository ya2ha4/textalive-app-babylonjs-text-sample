import { ArcRotateCamera, Camera, Color4, Engine, HemisphericLight, IFontData, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import earcut from "earcut";

export class BabylonjsText3DSample {
    private _engine: Engine;
    private _scene: Scene;
    private _camera: Camera;
    private _light: HemisphericLight;

    private _fontLoaded: boolean;
    private _fontData: IFontData;
    private _textMesh: Mesh;

    private _createdText: string;

    public constructor() {
        const canvas = document.getElementById("canvas-container") as HTMLCanvasElement;
        this._engine = new Engine(canvas, true);
        this._scene = new Scene(this._engine);
        this._camera = new ArcRotateCamera("camera", -Math.PI / 2.0, Math.PI / 2.5, 100.0, new Vector3(), this._scene);
        this._camera.attachControl(true);
        this._light = new HemisphericLight("light", new Vector3(0, 1, -1), this._scene);

        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        
        window.addEventListener("resize", () => {
            this._engine.resize();
        });

        this._fontLoaded = false;
        fetch("fonts/M_PLUS_1_Code_Regular_yu_rounded.json")
            .then((response) => response.json())
            .then((data) => {
                this._fontData = data;
                this._fontLoaded = true;
            });
    }

    public isInitialized(): boolean {
        return this._fontLoaded;
    }

    public Disp3DText(text: string): void {
        if (!this.isInitialized()) {
            throw Error("BabylonjsText3DSample is not Initialized.");
        }

        if (this._createdText == text) {
            return;
        }

        if (this._textMesh instanceof Mesh) {
            this._textMesh.dispose();
        }
        this._textMesh = MeshBuilder.CreateText("SampleText", text, this._fontData,
        {
            size: 4,
            resolution: 8,
            depth: 1,
            perLetterFaceColors: (index: number) => {
                return [
                    new Color4(1, 1, 1, 1),
                    new Color4(1, 0, 1, 1),
                    new Color4(1, 1, 1, 1)
                ];
            }
        }, this._scene, earcut);
        this._createdText = text;
    }
}