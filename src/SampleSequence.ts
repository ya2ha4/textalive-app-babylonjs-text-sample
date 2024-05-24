import { IPlayerApp, IVideo, Player, PlayerVideoOptions, Timer } from "textalive-app-api";
import { BabylonjsText3DSample } from "./BabylonjsText3DSample";

type SequenceState = "new" | "initializing" | "initialized" | "playing";

export class BabylonjsText3DSampleSequence {
    protected _status: SequenceState;
    protected _babylon: BabylonjsText3DSample;

    public constructor() {
        this._status = "new";
        console.info(`status:${this._status}`);
        this._babylon = new BabylonjsText3DSample();
    }

    public initialize(): void {
        const container = document.getElementById("canvas-container")!;
        container.addEventListener("click", (event) => this.click(event));

        this._status = "initializing";
        console.info(`status:${this._status}`);

        this.update();
    }

    public isInitialized(): boolean {
        return this._babylon.isInitialized();
    }

    public update(): void {
        requestAnimationFrame(() => {
            this.update();
        });

        if (this._status == "initializing" && this.isInitialized()) {
            this._status = "initialized";
            console.info(`status:${this._status}`);
            this._babylon.Disp3DText("Setup OK!");
        }
    }

    protected click(event: MouseEvent): void {
        if (this._status == "initialized") {
            this._babylon.Disp3DText("Click!");
        }
    }
}

export class TextAliveAppAPISampleSequence extends BabylonjsText3DSampleSequence{
    private _isPlayerReady: boolean;
    private _textalivePlayer: Player;
    private _video: IVideo;

    public constructor() {
        super();
        this._isPlayerReady = false;
    }

    public override initialize(): void {
        super.initialize();

        this._textalivePlayer = new Player({
            app: {
                token: "your token"
            },
            valenceArousalEnabled: true,
            vocalAmplitudeEnabled: true,
            mediaElement: document.querySelector<HTMLElement>("#media"),
        });
        this._textalivePlayer.addListener({
            onAppReady: (app) => this.onAppReady(app),
            onVideoReady: (v) => this.onVideoReady(v),
            onTimerReady: (t) => this.onTimerReady(t),
            onTimeUpdate: (pos) => this.onTimeUpdate(pos),
        });
    }

    public override isInitialized(): boolean {
        return this._isPlayerReady && super.isInitialized();
    }

    public override update(): void {
        requestAnimationFrame(() => {
            this.update();
        });

        if (this._status == "initializing" && this.isInitialized()) {
            this._status = "initialized";
            console.info(`status:${this._status}`);
            this._babylon.Disp3DText("Setup OK!");
        }
    }

    protected override click(event: MouseEvent): void {
        if (this._status == "initialized") {
            this._status = "playing";
            this._babylon.Disp3DText("");
            this._textalivePlayer.requestPlay();
        }
    }

    private onAppReady(app: IPlayerApp): void {
        if (!app.songUrl) {
            const musicUrl = "https://piapro.jp/t/RoPB/20220122172830";
            const options: PlayerVideoOptions = {
                video: {
                    // 音楽地図訂正履歴: https://songle.jp/songs/2243651/history
                    beatId: 4086301,
                    chordId: 2221797,
                    repetitiveSegmentId: 2247682,
                    // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FRoPB%2F20220122172830
                    lyricId: 53718,
                    lyricDiffId: 7076,
                }
            };
            this._textalivePlayer.createFromSongUrl(musicUrl, options);
        }
    }

    private onVideoReady(v: IVideo): void {
        this._video = v;
    }

    private onTimerReady(t: Timer): void {
        this._isPlayerReady = true;
    }

    private onTimeUpdate(position: number): void {
        const phrase = this._video.findPhrase(position);
        if (phrase) {
            this._babylon.Disp3DText(phrase.text);
        } else {
            this._babylon.Disp3DText("");
        }
    }
}
