"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var PickerToolbar = function (_a) {
    var title = _a.title, showToolbar = _a.showToolbar, confirmText = _a.confirmText, cancelText = _a.cancelText, onCancel = _a.onCancel, onConfirm = _a.onConfirm;
    var renderTitle = function () {
        if (title) {
            return <react_native_1.Text style={styles.title}>{title}</react_native_1.Text>;
        }
        else {
            return <react_native_1.Text style={styles.title}>标题</react_native_1.Text>;
        }
    };
    var renderCancel = function () {
        var text = cancelText ? cancelText : "取消";
        return (<react_native_1.Text onPress={onCancel} style={styles.cancel}>{text}</react_native_1.Text>);
    };
    var renderConfirm = function () {
        var text = confirmText ? confirmText : "确定";
        return (<react_native_1.Text onPress={onConfirm} style={styles.confirm}>{text}</react_native_1.Text>);
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.toolbar}>
        {renderCancel()}
        {renderTitle()}
        {renderConfirm()}
      </react_native_1.View>
    </react_native_1.View>);
};
var styles = react_native_1.StyleSheet.create({
    container: {
        width: "100%",
        height: 48,
        position: "absolute",
        backgroundColor: "#fff",
        zIndex: 9999,
        top: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    toolbar: {
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    cancel: {
        paddingLeft: 16,
        fontSize: 14,
        color: "#969799"
    },
    title: {
        fontSize: 16,
        color: "#323233"
    },
    confirm: {
        paddingRight: 16,
        fontSize: 14,
        color: "#1989FA"
    }
});
exports["default"] = PickerToolbar;
