import { SceneComponent, ComponentOutput } from "../SceneComponent";
import { Texture } from "three";

type Inputs = {
  visible: boolean;
};

type Outputs = {
  texture: Texture | null;
} & ComponentOutput;

class BoxRenderer2 extends SceneComponent {
  private material: any;

  inputs: Inputs = {
    visible: false,
  };

  outputs = {
    texture: null,
  } as Outputs;

  onInit() {
    const THREE = this.context.three;
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const material = new THREE.MeshBasicMaterial({ color: 0x0ff000 });
    const mesh = new THREE.Mesh(geometry, this.material);
    this.outputs.objectRoot = mesh;
    this.material = material;
  }
  onEvent(eventType: string, eventData: unknown): void {
    console.log(eventType);
  }
  onDestroy() {
    this.material.dispose();
  }
}

export const boxRendererType2 = "mp.boxRenderer2";
export function makeBoxRenderer2() {
  return new BoxRenderer2();
}
