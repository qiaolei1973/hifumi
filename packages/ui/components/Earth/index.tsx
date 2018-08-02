/*
 * @Author: qiaolei@gagogroup.com
 * @Date: 2018-07-14 17:04:28
 * @Last Modified by: qiaolei@gagogroup.com
 * @Last Modified time: 2018-08-01 17:32:05
 */
import * as React from 'react';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Camera,
    DirectionalLight,
} from 'three';
import './style.css';

interface Props {
}
/**
 * @description 3d地球模型
 * @export
 * @class Earth
 */
export default class Earth extends React.Component<Props, any> {

    constructor(props: Props) {
        super(props);
    }

    private readonly CLS = 'earth-3d-container';
    private container?: HTMLDivElement | null;
    private renderer = new WebGLRenderer({ antialias: true, alpha: true });
    private scene = new Scene();
    private camera?: Camera;
    private bufferCamera = new PerspectiveCamera(70, 2, 1, 1000);

    state = {
        camera: null,
        width: null,
        height: null,
        introductionVis: false,
    };

    /**
     * @description 创建光源模型
     * @private
     * @returns 光源模型
     * @memberof Earth
     */
    private createLights() {
        const directionalLight = new DirectionalLight(0xFF0000);

        return directionalLight;
    }

    /**
     * @description 更新画面（重绘）
     * @private
     * @returns
     * @memberof Earth
     */
    private update(): void {
        if (!this.camera) return;
        this.renderer.render(this.scene, this.camera);
    }

    public componentWillMount(){
        this.renderer.setClearColor(0xFFFFFF, 0);
        this.bufferCamera.position.z = 1.4;
    }

    public async componentDidMount() {
        const guardContainer: HTMLDivElement = this.container as HTMLDivElement;
    }

    public render() {
        return (
            <div className={this.CLS} ref={node => { this.container = node; }} />
        );
    }
}
