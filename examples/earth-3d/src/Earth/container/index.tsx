import * as React from 'react';
import * as PropTypes from 'prop-types';
import { PerspectiveCamera, WebGLRenderer, Scene, SphereGeometry, MeshNormalMaterial, Mesh } from 'three';
import { CameraContext } from '../types';

interface Props {
    radius: number;
};
interface State {
    camera?: PerspectiveCamera;
}

const childContextTypes = {
    renderer: PropTypes.instanceOf(WebGLRenderer),
    baseScene: PropTypes.instanceOf(Scene),
    camera: PropTypes.instanceOf(PerspectiveCamera),
    updateScene: PropTypes.func,
    radius: PropTypes.number,
};

export default class Earth extends React.Component<Props> {
    protected static childContextTypes = childContextTypes;
    private renderer = new WebGLRenderer({ antialias: true, alpha: true });
    private scene = new Scene();
    private container?: HTMLDivElement | null;

    public state: State = {
        camera: undefined
    }

    protected getChildContext(): CameraContext {
        return {
            renderer: this.renderer,
            baseScene: this.scene,
            camera: this.state.camera,
            radius: this.props.radius,
            updateScene: this._update.bind(this),
        }
    }

    private _update() {
        if (this.state.camera === undefined) {
            console.log('还未初始化完成');
            return;
        }
        this.renderer.render(this.scene, this.state.camera);
    }

    public componentDidMount() {
        const guardContainer: HTMLDivElement = this.container as HTMLDivElement;
        const { clientHeight: height, clientWidth: width } = guardContainer;
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(0, 0, 3.5);
        camera.lookAt(0, 0, 0);
        this.setState({ camera });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new SphereGeometry(this.props.radius, 32, 32);
        const material = new MeshNormalMaterial();
        const sphere = new Mesh(geometry, material);
        this.scene.add(sphere);
        guardContainer.appendChild(this.renderer.domElement);
    }

    public componentDidUpdate() {
        this._update();
    }

    public render() {
        return (
            <div ref={node => { this.container = node }} style={{ height: '100%', width: '100%' }}>
                {this.state.camera && this.props.children}
            </div>
        );
    }
}