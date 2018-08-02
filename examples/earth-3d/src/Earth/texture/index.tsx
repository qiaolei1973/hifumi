import * as React from 'react';
import { FeatureCollection } from 'geojson';
import * as PropTypes from 'prop-types';
import { isEqual } from 'underscore';
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
    private renderTarget = new WebGLRenderTarget(2048, 1024, { minFilter: LinearFilter, magFilter: NearestFilter });

    private _createMapGroupByGeojson(geojson: FeatureCollection): Group {
        const group = new Group();
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

        features.forEach(({ geometry, properties }, index) => {
            const phoneMaterial = new MeshPhongMaterial({ color: 0xDDDDDD });
            if (geometry.type === 'MultiPolygon') {
                geometry.coordinates.forEach(polygon => {
                    group.add(createPolygon(polygon, phoneMaterial));
                });
            } else if (geometry.type === 'Polygon') {
                group.add(createPolygon(geometry.coordinates, phoneMaterial));
            }
        });
        return group;
    }

    public shouldComponentUpdate(nextProps: Props) {
        return !isEqual(this.props.data, nextProps.data);
    }

    public componentDidUpdate() {
        if (!this.props.data) {
            return;
        }
        const scene = new Scene();
        const mesh = this._createMapGroupByGeojson(this.props.data);
        scene.add(mesh);
        (this.context.renderer as WebGLRenderer).render(scene, this.bufferCamera, this.renderTarget);
        const sphere = new Mesh(
            new SphereGeometry(this.context.radius + 0.2, 32, 32),
            new MeshPhongMaterial({ map: this.renderTarget.texture, transparent: true, opacity: 0.8 })
        );
        this.props.parentScene.add(sphere);
        this.context.updateScene();
    }

    public render() {
        return null;
    }
}
