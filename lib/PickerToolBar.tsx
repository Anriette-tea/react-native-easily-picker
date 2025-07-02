import React from "react"
import { View, StyleSheet, Text } from "react-native"

export interface PickerToolBarProps {
  title?: React.ReactNode
  showToolbar?: boolean
  confirmText?: React.ReactNode
  cancelText?: React.ReactNode
  onCancel?: (...args: any) => void
  onConfirm?: (...args: any) => void
}

const PickerToolbar = ({ title, showToolbar, confirmText, 
  cancelText, onCancel, onConfirm 
}: PickerToolBarProps) => {

  const renderTitle = () => {
    if (title) {
      return <Text style={styles.title}>{title}</Text>
    } else {
      return <Text style={styles.title}>标题</Text>
    }
  }

  const renderCancel = () => {
    const text = cancelText ? cancelText : "取消"

    return (
      <Text onPress={onCancel} style={styles.cancel}>{text}</Text>
    )
  }

  const renderConfirm = () => {
    const text = confirmText ? confirmText : "确定"

    return (
      <Text onPress={onConfirm} style={styles.confirm}>{text}</Text>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        { renderCancel() }
        { renderTitle() }
        { renderConfirm() }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    alignItems: "center",
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
})

export default PickerToolbar
