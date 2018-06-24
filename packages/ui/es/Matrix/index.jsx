"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const antd_1 = require("antd");
require("./style.css");
class Matrix extends React.Component {
    constructor(props) {
        super(props);
        this.handleItemChange = (num, x, y) => {
            if (num === undefined)
                return;
            this.actual[4 * x + y] = num;
            this.props.onChange(this.actual);
        };
        this.actual = [...props.mat4];
    }
    render() {
        const { mat4 } = this.props;
        let mat4Copy = [...mat4]; // floatArray to array.
        const _mat4 = [];
        while (mat4Copy.length) {
            _mat4.push(mat4Copy.splice(0, 4));
        }
        const renderLine = (line, lineNum) => (<antd_1.Row gutter={16} key={lineNum}>
                {line.map((v, columnNum) => (<antd_1.Col span={6} key={columnNum}>
                            <antd_1.InputNumber size="small" defaultValue={v} onChange={(num) => this.handleItemChange(num === undefined ? 0 : Number(num), lineNum, columnNum)}/>
                        </antd_1.Col>))}
            </antd_1.Row>);
        return (<div className="matrix">
                {_mat4.map((line, i) => renderLine(line, i))}
            </div>);
    }
}
exports.default = Matrix;
//# sourceMappingURL=index.jsx.map