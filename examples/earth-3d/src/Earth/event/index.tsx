import * as React from 'react';
import {
    Raycaster,
    Vector2,
    PerspectiveCamera,
    // Object3D,
    Scene,
} from 'three';
import * as PropTypes from 'prop-types';
import { Point } from '../types';

interface Props {
    move?: Point;
}


const contextTypes = {
    camera: PropTypes.instanceOf(PerspectiveCamera),
    baseScene: PropTypes.instanceOf(Scene),
};

export default class Event extends React.Component<Props> {
    protected static contextTypes = contextTypes;

    private raycaster = new Raycaster();
    private mouse = new Vector2();
    // private intersectElement: Object3D;

    public componentDidUpdate() {
        if (!this.props.move) {
            return;
        }
        this.raycaster.setFromCamera(this.mouse, this.context.camera);
        const intersects = this.raycaster.intersectObjects((this.context.baseScene as Scene).children);
        console.log('intersects: ', intersects);
    }

    public render() {
        return null;
    }
}
