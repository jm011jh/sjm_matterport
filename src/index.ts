import { makeVideoRenderer, videoRendererType } from "./comp/VideoRenderer";
import { boxRendererType2, makeBoxRenderer2 } from "./comp/Box2";
import { mp4RendererType, makeMp4Renderer } from "./comp/Mp4Renderer";
import { mp4RendererType2, makeMp4Renderer2 } from "./comp/Mp4Renderer2";
import { canvasRendererType, makeCanvasRenderer } from "./comp/CanvasRenderer";
import { tunerType, makeTuner } from "./comp/Tuner";
import { HoverSpy, ClickSpy } from "./spy";
const showcase = document.getElementById("showcase") as HTMLIFrameElement;
const key = "gq59t06h713y2hrsw35cmkutc";

// declare this file is a module
export {};

// augment window with the MP_SDK property
declare global {
  interface Window {
    MP_SDK: any;
  }
}

showcase.addEventListener("load", async function () {
  let sdk;
  try {
    //#region basic
    sdk = await showcase.contentWindow.MP_SDK.connect(showcase, key, "3.6");
    sdk.Scene.register(videoRendererType, makeVideoRenderer);
    sdk.Scene.register(boxRendererType2, makeBoxRenderer2);
    sdk.Scene.register(mp4RendererType, makeMp4Renderer);
    sdk.Scene.register(mp4RendererType2, makeMp4Renderer2);
    sdk.Scene.register(canvasRendererType, makeCanvasRenderer);
    sdk.Scene.register(tunerType, makeTuner);
    const [sceneObject] = await sdk.Scene.createObjects(1);
    //#endregion basic

    //#region inputNode==========
    // const inputNode = sceneObject.addNode();
    // const inputComp = inputNode.addComponent("mp.input", {
    //   eventsEnabled: true,
    //   userNavigationEnabled: false,
    // });
    // inputComp.spyOnEvent(new ClickSpy());
    // inputComp.inputs.userNavigationEnabled = true;
    // inputComp.inputs.eventsEnabled = false;
    // inputNode.start();
    //#endregion inputNode==========
    //#region lightNode==========
    const lightsNode = sceneObject.addNode();
    const lights2Node = sceneObject.addNode();
    lights2Node.addComponent("mp.pointLight", {
      color: {
        r: 1,
        g: 1,
        b: 1,
      },
      intensity: 2,
      position: {
        x: 14,
        y: 0,
        z: -10,
      },
      distance: 20,
      decay: 1,
      debug: true,
    });
    lightsNode.addComponent("mp.ambientLight", {
      enabled: true,
      color: { r: 1, g: 1, b: 1 },
      intensity: 0.5,
    });
    lightsNode.start();
    lights2Node.start();
    //#endregion lightNode==========

    //#region gltfNode==========
    const gltfNode = sceneObject.addNode();
    gltfNode.position.set(17, 1, -10);
    const gltfComp = gltfNode.addComponent("mp.gltfLoader", {
      // url: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Parrot.glb",
      url: "../data/Parrot.glb",
      localScale: {
        x: 0.03,
        y: 0.03,
        z: 0.03,
      },
    });
    gltfComp.spyOnEvent(new HoverSpy());
    gltfComp.spyOnEvent(new ClickSpy());
    gltfNode.start();
    const fbxNode = sceneObject.addNode();
    const fbxComp = fbxNode.addComponent("mp.fbxLoader", {
      visible: true,
      url: "../data/tv.fbx",
      localScale: {
        x: 0.01,
        y: 0.01,
        z: 0.01,
      },
      localRotation: {
        x: 0,
        y: -90,
        z: 0,
      },
    });
    fbxComp.spyOnEvent(new HoverSpy());
    fbxComp.spyOnEvent(new ClickSpy());
    fbxNode.position.set(21.4, 0.35, -12);
    fbxNode.start();
    //#endregion gltfNode==========
    //#region boxNode==========
    const videoNode = sceneObject.addNode();
    const videoComp = videoNode.addComponent("mp.videoRenderer", {
      visible: true,
      // src: "https://images.samsung.com/is/content/samsung/assets/us/home-appliances/bespoke/virtual-showroom/2022_bespoke-us_kv_center_pc.mp4",
      src: "../data/test.mp4",
      rotation: {
        x: 0,
        y: -90,
        z: 0,
      },
    });
    // videoNode.obj3D.rotation.z = (-2 * Math.PI) / 180;
    videoComp.spyOnEvent(new HoverSpy());
    videoNode.start();
    videoNode.position.set(21.7, 1.1, -12.01);
    //#endregion boxNode==========
    //#region tunerNode==========
    const tunerNode = sceneObject.addNode();
    tunerNode.addComponent("mp.tuner", {
      //event receiver
      urls: [
        "https://www.bloomberg.com/media-manifest/streams/us.m3u8",
        "../src/mp4/test.mp4",
      ],
    });
    tunerNode.start();
    //#endregion tunerNode==========
    const eventPath = sceneObject.addEventPath(
      videoComp,
      "play",
      "my-reciever-update"
    );
    const emitPath = sceneObject.addEmitPath(
      gltfComp,
      "INTERACTION.CLICK",
      "my-component-updated"
    );
    sceneObject.bindPath(eventPath, emitPath);
    console.log(sceneObject);
  } catch (e) {
    console.error(e);
    return;
  }

  console.log("%c  Hello Bundle SDK! ", "background: #333333; color: #00dd00");
  console.log(sdk);
});
