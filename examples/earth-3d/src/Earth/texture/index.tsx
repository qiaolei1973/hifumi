import * as React from 'react';
import { FeatureCollection } from 'geojson';
import * as PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import {
    WebGLRenderer,
    PerspectiveCamera,
    WebGLRenderTarget,
    LinearFilter,
    NearestFilter,
    MeshMaterialType,
    ExtrudeGeometry,
    MeshPhongMaterial,
    Shape,
    Scene,
    Group,
    Mesh,
    Vector2,
    SphereGeometry,
} from 'three';

interface Props {
    data?: FeatureCollection;
    parentScene: Scene;
}

const contextTypes = {
    renderer: PropTypes.instanceOf(WebGLRenderer),
    updateScene: PropTypes.func,
    radius: PropTypes.number,
};

export default class Texture extends React.Component<Props> {
    protected static contextTypes = contextTypes;
    private bufferCamera = new PerspectiveCamera(70, 2, 1, 1000);
    private renderTarget = new WebGLRenderTarget(4096, 2048, { minFilter: LinearFilter, magFilter: NearestFilter });
    private full: Group;
    private groupPool = {};

    constructor(props: Props) {
        super(props);
        this.bufferCamera.position.z = 6.8;
    }

    private _createMapGroupByGeojson(geojson: FeatureCollection): Group {
        const full = new Group();
        const { features } = geojson;

        const ringToPoints = (ring: number[][]): Vector2[] => {
            return ring.map((point) => {
                return new Vector2(point[0] * 0.05, point[1] * 0.05);
            });
        }

        const createPolygon = (polygon: number[][][], material: MeshMaterialType): Mesh => {
            const outRing = polygon[0];
            const outerPoints = ringToPoints(outRing);
            const polygonShape = new Shape(outerPoints);

            polygon.slice(1).forEach((hole) => {
                const innerPoints = ringToPoints(hole);
                const holeShape = new Shape(innerPoints);
                polygonShape.holes.push(holeShape);
            });
            const geometry = new ExtrudeGeometry(polygonShape, {
                depth: 0.02,
                bevelEnabled: false,
            });
            return new Mesh(geometry, material);
        };

        features.forEach((feature) => {
            const phoneMaterial = new MeshPhongMaterial({ color: 0xDDDDDD });
            const group = new Group();
            if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach(polygon => {
                    group.add(createPolygon(polygon, phoneMaterial));
                });
            } else if (feature.geometry.type === 'Polygon') {
                group.add(createPolygon(feature.geometry.coordinates, phoneMaterial));
            }
            this.groupPool[group.uuid] = group;
            full.add(group);
        });
        return full;
    }

    private initTextureSphere() {
        if (!this.props.data || this.full) {
            return;
        }
        const scene = new Scene();
        const mesh = this._createMapGroupByGeojson(this.props.data);
        scene.add(mesh);
        (this.context.renderer as WebGLRenderer).render(scene, this.bufferCamera, this.renderTarget);
        const sphere = new Mesh(
            new SphereGeometry(this.context.radius, 32, 32),
            new MeshPhongMaterial({ map: this.renderTarget.texture, transparent: true, opacity: 0.8 })
        );
        this.props.parentScene.add(sphere);
    }

    public shouldComponentUpdate(nextProps: Props) {
        return !isEqual(this.props.data, nextProps.data);
    }

    public componentWillMount() {
        this.initTextureSphere();
    }

    public componentDidUpdate() {
        this.initTextureSphere();
    }

    public render() {
        return null;
    }
}
