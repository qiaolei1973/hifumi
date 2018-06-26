import * as React from 'react';
import InputNumber from 'antd/lib/input-number';
import Row from 'antd/lib/row'
import Col from 'antd/lib/col';

import 'antd/lib/input-number/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/col/style/css';
import './style.less';

type mat4 = ReadonlyArray<number>;

interface MatrixProps {
    mat4: mat4;
    onChange: (mat4: mat4) => void;
}

export default class Matrix extends React.Component<MatrixProps> {
    constructor(props: MatrixProps) {
        super(props);
        this.actual = [...props.mat4];
    }
    actual: number[];

    handleItemChange = (num: number, x: number, y: number) => {
        if (num === undefined) return;
        this.actual[4 * x + y] = num;
        this.props.onChange(this.actual);
    }

    public render() {
        const { mat4 } = this.props;
        let mat4Copy = [...mat4]; // floatArray to array.
        const _mat4 = [];
        while (mat4Copy.length) {
            _mat4.push(mat4Copy.splice(0, 4));
        }
        const renderLine = (line: ReadonlyArray<number>, lineNum: number) => (
            <Row gutter={16} key={lineNum} >
                {
                    line.map((v, columnNum) => (
                        <Col span={6} key={columnNum} >
                            <InputNumber
                                size="small"
                                defaultValue={v}
                                onChange={(num) => this.handleItemChange(num === undefined ? 0 : Number(num), lineNum, columnNum)}
                            />
                        </Col>
                    ))
                }
            </Row>)

        return (
            <div className="matrix" >
                {
                    _mat4.map((line, i) => renderLine(line, i))
                }
            </div>)
    }
}