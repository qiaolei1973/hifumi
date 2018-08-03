import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
    Scene, DirectionalLight,
} from 'three';
import { Point } from '../types';

interface Props {
    color?: number;
    parentScene?: Scene;
    position?: Point;
    autoUpdate?: boolean;
}


const contextTypes = {
    baseScene: PropTypes.instanceOf(Scene),
    updateScene: PropTypes.func,
};

export default class Light extends React.Component<Props> {
    protected static contextTypes = contextTypes;
    private light: DirectionalLight;

    private initLight(): void {
        if (this.light) {
            return;
        }
        const light = new DirectionalLight(this.props.color || 0xFFFFFF);
        const position = this.props.position || { x: 0, y: 0, z: 0 };
        const scene = this.props.parentScene || (this.context.baseScene as Scene);
        light.position.set(position.x, position.y, position.z || 0);
        this.light = light;
        scene.add(light);
        if (this.props.autoUpdate) {
            this.context.updateScene();
        }
    }

    public componentWillMount() {
        this.initLight();
    }

    public componentDidUpdate() {
        this.initLight();
    }

    public render() {
        return null;
    }
}
