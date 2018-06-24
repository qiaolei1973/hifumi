"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __importStar = undefined && undefined.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var antd_1 = require("antd");
require("./style.css");

var Matrix = function (_React$Component) {
    _inherits(Matrix, _React$Component);

    function Matrix(props) {
        _classCallCheck(this, Matrix);

        var _this = _possibleConstructorReturn(this, (Matrix.__proto__ || Object.getPrototypeOf(Matrix)).call(this, props));

        _this.handleItemChange = function (num, x, y) {
            if (num === undefined) return;
            _this.actual[4 * x + y] = num;
            _this.props.onChange(_this.actual);
        };
        _this.actual = [].concat(_toConsumableArray(props.mat4));
        return _this;
    }

    _createClass(Matrix, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var mat4 = this.props.mat4;

            var mat4Copy = [].concat(_toConsumableArray(mat4)); // floatArray to array.
            var _mat4 = [];
            while (mat4Copy.length) {
                _mat4.push(mat4Copy.splice(0, 4));
            }
            var renderLine = function renderLine(line, lineNum) {
                return React.createElement(
                    antd_1.Row,
                    { gutter: 16, key: lineNum },
                    line.map(function (v, columnNum) {
                        return React.createElement(
                            antd_1.Col,
                            { span: 6, key: columnNum },
                            React.createElement(antd_1.InputNumber, { size: "small", defaultValue: v, onChange: function onChange(num) {
                                    return _this2.handleItemChange(num === undefined ? 0 : Number(num), lineNum, columnNum);
                                } })
                        );
                    })
                );
            };
            return React.createElement(
                "div",
                { className: "matrix" },
                _mat4.map(function (line, i) {
                    return renderLine(line, i);
                })
            );
        }
    }]);

    return Matrix;
}(React.Component);

exports.default = Matrix;
//# sourceMappingURL=index.jsx.map