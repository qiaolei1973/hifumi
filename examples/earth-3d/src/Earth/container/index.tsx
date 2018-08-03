import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as THREE from 'three';
import { CameraContext, Point } from '../types';
import Event from '../event';
// tslint:disable-next-line
const OrbitControls = require('three-orbit-controls')(THREE);
const {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    SphereGeometry,
    // MeshNormalMaterial,
    Mesh,
    MeshPhongMaterial,
} = THREE;

interface Props {
    radius: number;
};
interface State {
    camera?: THREE.PerspectiveCamera;
    move?: Point;
}

const childContextTypes = {
    renderer: PropTypes.instanceOf(WebGLRenderer),
    baseScene: PropTypes.instanceOf(Scene),
    camera: PropTypes.instanceOf(PerspectiveCamera),
    container: PropTypes.element,
    updateScene: PropTypes.func,
    radius: PropTypes.number,
};

export default class Earth extends React.Component<Props> {
    protected static childContextTypes = childContextTypes;
    private renderer = new WebGLRenderer({ antialias: true, alpha: true });
    private scene = new Scene();
    private container?: HTMLDivElement | null;
    private controls: any;
    private rect: ClientRect | DOMRect;

    public state: State = {
        camera: undefined,
        move: undefined,
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

    private animate = () => {
        this.controls.update();
        this._update();
        requestAnimationFrame(this.animate);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const guardContainer: HTMLDivElement = this.container as HTMLDivElement;
        this.setState({
            move: {
                x: ((event.clientX - this.rect.left) / guardContainer.clientWidth) * 2 - 1,
                y: -((event.clientY - this.rect.top) / guardContainer.clientHeight) * 2 + 1
            }
        });
    }

    public componentDidMount() {
        const guardContainer: HTMLDivElement = this.container as HTMLDivElement;
        const { clientHeight: height, clientWidth: width } = guardContainer;
        this.rect = guardContainer.getBoundingClientRect();

        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(0, 0, 3.5);
        camera.lookAt(0, 0, 0);
        this.setState({ camera });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new SphereGeometry(this.props.radius, 32, 32);
        const phoneMaterial = new MeshPhongMaterial({ color: 0xFF0000 });
        const sphere = new Mesh(geometry, phoneMaterial);
        this.scene.add(sphere);
        guardContainer.appendChild(this.renderer.domElement);

        const controls = new OrbitControls(camera);
        this.controls = controls;
        this.animate();
    }

    public render() {
        return (
            <div
                ref={node => { this.container = node }}
                style={{ height: '100%', width: '100%' }}
                onMouseMove={this.handleMouseMove}
            >
                {this.state.camera && this.props.children}
                <Event move={this.state.move} />
            </div>
        );
    }
}