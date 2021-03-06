"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.build = exports.wrap = exports.styles = exports.colors = exports.sizes = undefined;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _color = require("color");

var _color2 = _interopRequireDefault(_color);

var _reactWrapper = require("./reactWrapper");

var reactWrapper = _interopRequireWildcard(_reactWrapper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('react-native-tachyons');

/* global require */
var NativeTachyons = {
    wrap: reactWrapper.wrap,

    /* placeholder */
    styles: {},

    /* placeholder */
    colors: {},

    /* placeholder */
    sizes: {},

    build: function build() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var StyleSheet = arguments[1];

        _lodash2.default.defaultsDeep(options, {
            rem: 16,
            colors: {
                lighten: 0.2,
                darken: 0.2,
                palette: {
                    white: "#ffffff",
                    black: "#000000"
                }
            }
        });

        /* assign all the styles */
        var styleSheet = {};
        _lodash2.default.assign(styleSheet, require("./styles/borders").styles);
        _lodash2.default.assign(styleSheet, require("./styles/flexbox").default);
        _lodash2.default.assign(styleSheet, require("./styles/fontWeights").default);
        _lodash2.default.assign(styleSheet, require("./styles/images").default);
        _lodash2.default.assign(styleSheet, require("./styles/text").default);
        _lodash2.default.assign(styleSheet, require("./styles/opacity").default);
        _lodash2.default.assign(styleSheet, require("./styles/utilities").default);

        /* calculate rem scales */
        var REM_SCALED = [require("./styles/heights").heights, require("./styles/heights").minHeights, require("./styles/heights").maxHeights, require("./styles/widths").widths, require("./styles/widths").minWidths, require("./styles/widths").maxWidths, require("./styles/spacing").default, require("./styles/typeScale").default, require("./styles/borders").radii];
        _lodash2.default.forEach(REM_SCALED, function (subSheet) {
            _lodash2.default.assign(styleSheet, _lodash2.default.mapValues(subSheet, function (style) {
                return _lodash2.default.mapValues(style, function (val) {
                    return val * options.rem;
                });
            }));
        });

        /* calculate sizes for export */
        var sizes = {};
        _lodash2.default.forEach([require("./styles/heights").heights, require("./styles/heights").minHeights, require("./styles/heights").maxHeights, require("./styles/widths").widths, require("./styles/widths").minWidths, require("./styles/widths").maxWidths, require("./styles/spacing").default, require("./styles/typeScale").default], function (obj) {
            _lodash2.default.forEach(obj, function (rule, tachyonsKey) {
                _lodash2.default.forEach(rule, function (val) {
                    sizes[tachyonsKey] = val * options.rem;
                });
            });
        });
        _lodash2.default.assign(NativeTachyons.sizes, hyphensToUnderscores(sizes));
        debug("got sizes:", sizes);

        /* colors: dark and light variant */
        var allColors = _lodash2.default.transform(options.colors.palette, function (result, val, key) {
            result[key] = val;

            /* light and dark alternatives */
            if (options.colors.lighten !== false) {
                result["light-" + key] = (0, _color2.default)(val).lighten(options.colors.lighten).hexString();
            }
            if (options.colors.darken !== false) {
                result["dark-" + key] = (0, _color2.default)(val).darken(options.colors.darken).hexString();
            }

            /* alpha variants */
            for (var i = 10; i < 100; i = i + 10) {
                var name = key + "-" + i;
                var rgbString = (0, _color2.default)(val).alpha(i / 100).rgbString();
                debug("writing alpha variant: " + name + ": " + rgbString);
                result[name] = rgbString;
            }
        }, {});

        /* colors: background, foreground and border */
        _lodash2.default.forEach(allColors, function (val, key) {
            styleSheet["bg-" + key] = { backgroundColor: val };
            styleSheet["" + key] = { color: val };
            styleSheet["b--" + key] = { borderColor: val };
        }, {});

        _lodash2.default.assign(NativeTachyons.colors, hyphensToUnderscores(allColors));
        _lodash2.default.assign(NativeTachyons.styles, StyleSheet.create(hyphensToUnderscores(styleSheet)));
    }
};

function hyphensToUnderscores(sourceObj) {
    var translated = {};

    /* copy all properties */
    _lodash2.default.assign(translated, sourceObj);

    /* create hypened versions */
    _lodash2.default.forEach(sourceObj, function (val, key) {
        if (key.includes("-")) {
            debug("replacing " + key + " -> " + key.replace(/-/g, "_"));
            translated[key.replace(/-/g, "_")] = val;
        }
    });

    return translated;
}

exports.default = NativeTachyons;
var sizes = exports.sizes = NativeTachyons.sizes;
var colors = exports.colors = NativeTachyons.colors;
var styles = exports.styles = NativeTachyons.styles;
var wrap = exports.wrap = reactWrapper.wrap;
var build = exports.build = NativeTachyons.build;