"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var PickerToolBar_1 = require("./PickerToolBar");
var timer = null;
var Picker = react_1["default"].forwardRef(function (properties, ref) {
    var columns = properties.columns, value = properties.value, onChange = properties.onChange, onConfirm = properties.onConfirm, props = __rest(properties, ["columns", "value", "onChange", "onConfirm"]);
    var fields = properties.fields ? properties.fields : { text: "text", value: "value" };
    var optionHeight = properties.optionHeight ? properties.optionHeight : 44;
    var height = properties.height ? properties.height : 300;
    var deviceInfo = react_native_1.Dimensions.get("window");
    var pickerView = react_1["default"].useRef(null);
    var _a = react_1["default"].useState(0), selectedIndex = _a[0], setSelectedIndex = _a[1];
    var _b = react_1["default"].useState(false), isDrag = _b[0], setIsDrag = _b[1];
    var _c = react_1["default"].useState(false), isScrollTo = _c[0], setIsScrollTo = _c[1];
    var _d = react_1["default"].useState(false), isMomentum = _d[0], setIsMomentum = _d[1];
    var _e = react_1["default"].useState(false), initialized = _e[0], setInitialized = _e[1];
    var Header = (<react_native_1.View style={{ height: (height - optionHeight) / 2, flex: 1 }}></react_native_1.View>);
    var Footer = (<react_native_1.View style={{ height: (height - optionHeight) / 2, flex: 1 }}></react_native_1.View>);
    var lineStyle = {
        width: deviceInfo.width,
        height: optionHeight,
        position: "absolute",
        top: (height - optionHeight) / 2,
        borderTopColor: "#f0f0f0",
        borderBottomColor: "#f0f0f0",
        borderTopWidth: 2,
        borderBottomWidth: 2
    };
    var renderOptions = function () {
        return columns === null || columns === void 0 ? void 0 : columns.map(function (option, key) {
            var optionStyle = {
                height: optionHeight,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            };
            var text = option && option[fields.text];
            var isSelected = key === selectedIndex;
            return (<react_native_1.View style={optionStyle} key={key}>
            <react_native_1.Text style={isSelected ? styles.active : styles.column}>{text}</react_native_1.Text>
          </react_native_1.View>);
        });
    };
    var onScrollBeginDrag = function () {
        setIsDrag(true);
        if (react_native_1.Platform.OS === "ios") {
            setIsScrollTo(false);
        }
        timer && clearTimeout(timer);
    };
    var onScrollEndDrag = function (event) {
        setIsDrag(false);
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            if (!isMomentum) {
                setScrollFixed(__assign({}, event));
            }
        }, 50);
    };
    var onMomentumScrollBegin = function () {
        setIsMomentum(true);
        timer && clearTimeout(timer);
    };
    var onMomentumScrollEnd = function (event) {
        setIsMomentum(false);
        if (!isScrollTo && !isDrag) {
            setScrollFixed(__assign({}, event));
        }
    };
    react_1["default"].useEffect(function () {
        if (columns && columns.length) {
            var index = columns === null || columns === void 0 ? void 0 : columns.findIndex(function (el) { return el.value === value; });
            setSelectedIndex(index >= 0 ? index : 0);
        }
    }, [value]);
    react_1["default"].useEffect(function () {
        if (initialized)
            return;
        setInitialized(true);
        setTimeout(function () {
            var _a;
            var y = optionHeight * selectedIndex;
            (_a = pickerView === null || pickerView === void 0 ? void 0 : pickerView.current) === null || _a === void 0 ? void 0 : _a.scrollTo({ y: y });
        }, 0);
        return function () {
            timer && clearTimeout(timer);
        };
    }, [timer, optionHeight, selectedIndex, pickerView]);
    react_1["default"].useImperativeHandle(ref, function () { return ({
        scrollToTargetIndex: function (val) {
            var _a;
            setSelectedIndex(val);
            (_a = pickerView === null || pickerView === void 0 ? void 0 : pickerView.current) === null || _a === void 0 ? void 0 : _a.scrollTo({ y: val * optionHeight });
        }
    }); });
    var setScrollFixed = react_1["default"].useCallback(function (event) {
        var _a, _b;
        var y = 0;
        if ((_a = event === null || event === void 0 ? void 0 : event.nativeEvent) === null || _a === void 0 ? void 0 : _a.contentOffset) {
            y = event.nativeEvent.contentOffset.y;
        }
        var active = Math.round(y / optionHeight);
        var innerHeight = active * optionHeight;
        setSelectedIndex(active);
        if (innerHeight !== y) {
            if (react_native_1.Platform.OS === "ios") {
                setIsScrollTo(true);
            }
            (_b = pickerView === null || pickerView === void 0 ? void 0 : pickerView.current) === null || _b === void 0 ? void 0 : _b.scrollTo({ y: innerHeight });
        }
        if (selectedIndex === active) {
            return;
        }
        if (onChange) {
            var selectedValue = columns && columns[active];
            onChange(selectedValue, active);
        }
    }, [optionHeight, columns, value, onChange, props]);
    var mainStyle = {
        flex: 1,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    };
    return (<react_native_1.View style={styles.positions}>
        <react_native_1.ScrollView style={styles.container}>
          <PickerToolBar_1["default"] title={props.title} showToolbar={props.showToolbar} cancelText={props.cancelText} confirmText={props.confirmText} onCancel={props.onCancel} onConfirm={function () { return onConfirm && onConfirm(columns && columns[selectedIndex][fields.value]); }}/>
          <react_native_1.View style={mainStyle}>
            <react_native_1.View style={lineStyle}></react_native_1.View>
            <react_native_1.ScrollView ref={pickerView} bounces={false} showsVerticalScrollIndicator={false} nestedScrollEnabled onScrollBeginDrag={onScrollBeginDrag} onScrollEndDrag={onScrollEndDrag} onMomentumScrollBegin={onMomentumScrollBegin} onMomentumScrollEnd={onMomentumScrollEnd}>
              {Header}
              {renderOptions()}
              {Footer}
            </react_native_1.ScrollView>
          </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_1.View>);
});
var styles = react_native_1.StyleSheet.create({
    positions: {
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row",
        backgroundColor: "rgba(0, 0, 0, .4)",
        zIndex: 9999
    },
    container: {
        width: "100%",
        position: "relative"
    },
    column: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#888"
    },
    active: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#111"
    }
});
exports["default"] = Picker;
