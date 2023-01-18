import { SceneComponent, ComponentOutput } from "../SceneComponent";
import { Object3D } from "three";

type Inputs = {
  src: MediaStream | string | HTMLVideoElement | null;
};
enum Event {
  Play = "play",
}
type Events = {
  [Event.Play]: boolean;
};
type Outputs = {
  object: Object3D;
} & ComponentOutput;

class VideoRenderer2 extends SceneComponent {
  private video: HTMLVideoElement;

  inputs: Inputs = {
    src: null,
  };

  outputs = {
    object: null,
  } as Outputs;

  events: Events = {
    [Event.Play]: true,
  };
  onInputsUpdated() {
    console.log("@@@@@@@@@@@@@@@@@@@@########################## ");

    const THREE = this.context.three;
    if (!this.inputs.src) {
      this.video.src = "";
      return;
    }

    if (this.inputs.src instanceof HTMLVideoElement) {
      this.video = this.inputs.src;
    } else {
      this.video = this.createVideoElement();

      if (typeof this.inputs.src === "string") {
        this.video.src = this.inputs.src;
      } else {
        this.video.srcObject = this.inputs.src;
      }
      this.video.load();
      this.video.play();
    }
    const videoImage = document.createElement("canvas");
    videoImage.width = 400;
    videoImage.height = 204;
    const videoImageContext = videoImage.getContext("2d");
    videoImageContext.fillStyle = "#ffffff";
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
    videoImageContext.drawImage(this.video, 0, 0);
    const videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    const movieMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
    });
    const movieGeometry = new THREE.PlaneGeometry(240, 100, 4, 4);
    const movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.position.set(0, 50, 0);

    const movieSystem = new THREE.Object3D();
    movieSystem.add(new THREE.AmbientLight(0xffffff, 1));
    movieSystem.add(movieScreen);

    console.log("hi");
    this.outputs.objectRoot = movieSystem;
  }

  onDestroy() {}
  onEvent(eventType: string, eventData: unknown): void {
    if (eventType === Event.Play) {
      console.log("video onEvent play");
      this.video.crossOrigin = "anonymous";
      this.video.muted = true;
      this.video.load();
      this.video.play();
    }
  }
  private createVideoElement() {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    return video;
  }
}

export interface IVideoRenderer extends SceneComponent {
  inputs: Inputs;
  outputs: Outputs;
}

export const mp4RendererType2 = "mp.mp4Renderer2";
export function makeMp4Renderer2() {
  return new VideoRenderer2();
}
