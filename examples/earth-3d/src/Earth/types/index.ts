import { WebGLRenderer, Scene, PerspectiveCamera } from "three";

export interface CameraContext {
    renderer: WebGLRenderer;
    baseScene: Scene;
    camera?: PerspectiveCamera;
    radius: number;
    updateScene: () => void;
    container?: HTMLDivElement | null;
}

export interface Point {
    x: number;
    y: number;
    z?: number;
}