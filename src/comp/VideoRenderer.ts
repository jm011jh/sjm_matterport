import { SceneComponent, ComponentOutput } from "../SceneComponent";
import { Mesh } from "three";

type Inputs = {
  visible: boolean;
  src: string;
  rotation: { x: number; y: number; z: number };
};

type Outputs = { object: Mesh | null } & ComponentOutput;
enum Event {
  Play = "play",
  Pause = "pause",
}
type Events = { [Event.Play]: boolean };
class Videorenderer extends SceneComponent {
  private _material: any;
  private _video: HTMLVideoElement;

  inputs: Inputs = {
    visible: false,
    src: "",
    rotation: { x: 0, y: 0, z: 0 },
  };
  outputs = {
    object: null,
  } as Outputs;

  events: Events = {
    [Event.Play]: true,
  };

  onInit() {
    this._video = this.makeVideo();
    const THREE = this.context.three;
    const videoTexture = new THREE.VideoTexture(this._video);
    const videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    });
    videoMaterial.needsUpdate = true;
    const screen = new THREE.PlaneGeometry(1.95, 1.12);
    const videoScreen = new THREE.Mesh(screen, videoMaterial);

    const videoObject = new THREE.Object3D();
    videoObject.rotateX(THREE.MathUtils.degToRad(this.inputs.rotation.x)),
      videoObject.rotateY(THREE.MathUtils.degToRad(this.inputs.rotation.y)),
      videoObject.rotateZ(THREE.MathUtils.degToRad(this.inputs.rotation.z)),
      videoObject.add(videoScreen);
    console.log(videoObject);
    this._material = videoMaterial;
    this.outputs.objectRoot = videoObject;
  }
  onEvent(eventType: string, eventData: unknown): void {
    this._video.load();
    if (eventType == "play") {
      this._video.play();
    } else if ((eventType = "pause")) {
      this._video.pause();
    }
  }
  onDestroy() {
    this._material.dispose();
  }
  makeVideo() {
    const videoElement = document.createElement("video");
    videoElement.crossOrigin = "anonymous";
    videoElement.controls = false;
    videoElement.width = 320;
    videoElement.height = 240;
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.src = this.inputs.src;
    return videoElement;
  }
}

export const videoRendererType = "mp.videoRenderer";
export function makeVideoRenderer() {
  return new Videorenderer();
}
