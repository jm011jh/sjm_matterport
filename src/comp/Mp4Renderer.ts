import { SceneComponent, ComponentOutput } from "../SceneComponent";
import { VideoTexture } from "three";

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
  // texture: Mesh | null;
  texture: any;
} & ComponentOutput;

class VideoRenderer extends SceneComponent {
  private video: HTMLVideoElement;
  private texture: VideoTexture;

  inputs: Inputs = {
    src: null,
  };

  outputs = {
    texture: null,
  } as Outputs;

  events: Events = {
    [Event.Play]: true,
  };
  onInputsUpdated() {
    console.log("@@@@@@@@@@@@@@@@@@@@########################## ");
    this.releaseTexture();

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

    // this.texture = new THREE.VideoTexture(this.video);
    // this.texture.minFilter = THREE.LinearFilter;
    // this.texture.magFilter = THREE.LinearFilter;
    // this.texture.format = THREE.RGBAFormat;
    const videoImage = document.createElement("canvas");
    videoImage.width = 400;
    videoImage.height = 204;
    const videoImageContext = videoImage.getContext("2d");
    videoImageContext.fillStyle = "#000000";
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
    const videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    const movieMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
    });
    const movieGeometry = new THREE.PlaneGeometry(240, 100, 4, 4);
    const movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    // this.texture = movieScreen;
    this.outputs.texture = movieScreen;
  }

  onDestroy() {
    this.releaseTexture();
  }
  onEvent(eventType: string, eventData: unknown): void {
    if (eventType === Event.Play) {
      console.log("video onEvent play");
      this.video.crossOrigin = "anonymous";
      this.video.muted = true;
      this.video.load();
      this.video.play();
    }
  }
  releaseTexture() {
    if (this.texture) {
      this.outputs.texture = null;
      this.texture.dispose();
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

export const mp4RendererType = "mp.mp4Renderer";
export function makeMp4Renderer() {
  return new VideoRenderer();
}
