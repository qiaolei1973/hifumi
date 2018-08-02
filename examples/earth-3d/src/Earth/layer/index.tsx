import * as React from 'react';
import { json as jsonLoader } from 'd3';
import { FeatureCollection } from 'geojson';
import * as PropTypes from 'prop-types';
import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
} from 'three';
import { default as SphereVectorLayer } from '../texture';

interface Props {
    data: string;
}

interface State {
    data?: FeatureCollection
}

const contextTypes = {
    renderer: PropTypes.instanceOf(WebGLRenderer),
    baseScene: PropTypes.instanceOf(Scene),
    camera: PropTypes.instanceOf(PerspectiveCamera),
    updateScene: PropTypes.func,
    radius: PropTypes.number,
};

export default class Layer extends React.Component<Props> {
    protected static contextTypes = contextTypes;

    public state: State = {
        data: undefined
    }

    public async componentWillMount() {
        const geojson = await jsonLoader(this.props.data) as FeatureCollection;
        this.setState({ data: geojson });
    }

    public render() {
       return <SphereVectorLayer data={this.state.data} parentScene={this.context.baseScene} />;
    }
}
