import React from "react"
import {
  View, Text, ScrollView, StyleSheet, Dimensions, ViewStyle,
  Platform, NativeSyntheticEvent, NativeScrollEvent
} from "react-native"
import PickerToolbar from "./PickerToolBar"
import type { PickerToolBarProps } from "./PickerToolBar"

export interface PickerProps<T extends string | number> extends PickerToolBarProps {
  value?: T
  columns?: Array<any>
  optionHeight?: number
  height?: number
  fields?: any
  onChange?: (...args: any) => void
}

export type ScrollPickerHandle = {
  scrollToTargetIndex: (val: number) => void
}

let timer: any = null

const Picker: { <T extends string | number>(props: PickerProps<T> & { ref?: React.Ref<ScrollPickerHandle> }): React.ReactNode }
  = React.forwardRef((properties, ref) => {

    const { columns, value, onChange, onConfirm, ...props } = properties

    const fields = properties.fields ? properties.fields : { text: "text", value: "value" }

    const optionHeight = properties.optionHeight ? properties.optionHeight : 44

    const height = properties.height ? properties.height : 300

    const deviceInfo = Dimensions.get("window")

    const pickerView = React.useRef<ScrollView>(null)

    const [selectedIndex, setSelectedIndex] = React.useState<number>(0)

    const [isDrag, setIsDrag] = React.useState<boolean>(false)

    const [isScrollTo, setIsScrollTo] = React.useState<boolean>(false)

    const [isMomentum, setIsMomentum] = React.useState<boolean>(false)

    const [initialized, setInitialized] = React.useState<boolean>(false)

    const Header: React.ReactNode = (
      <View style={{ height: (height - optionHeight) / 2, flex: 1 }}></View>
    )

    const Footer: React.ReactNode = (
      <View style={{ height: (height - optionHeight) / 2, flex: 1 }}></View>
    )

    const lineStyle: ViewStyle = {
      width: deviceInfo.width,
      height: optionHeight,
      position: "absolute",
      top: (height - optionHeight) / 2,
      borderTopColor: "#f0f0f0",
      borderBottomColor: "#f0f0f0",
      borderTopWidth: 2,
      borderBottomWidth: 2
    }

    const renderOptions = () => {
      return columns?.map((option: any, key: number) => {
        const optionStyle: ViewStyle = {
          height: optionHeight,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }

        const text = option && option[fields.text]
        const isSelected = key === selectedIndex

        return (
          <View style={optionStyle} key={key}>
            <Text style={isSelected ? styles.active : styles.column}>{text}</Text>
          </View>
        )
      })
    }

    const onScrollBeginDrag = () => {
      setIsDrag(true)
      if (Platform.OS === "ios") {
        setIsScrollTo(false)
      }
      timer && clearTimeout(timer)
    }

    const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIsDrag(false)
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        if (!isMomentum) {
          setScrollFixed({ ...event })
        }
      }, 50)
    }

    const onMomentumScrollBegin = () => {
      setIsMomentum(true)
      timer && clearTimeout(timer)
    }

    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIsMomentum(false)
      if (!isScrollTo && !isDrag) {
        setScrollFixed({ ...event })
      }
    }

    React.useEffect(() => {
      if (columns && columns.length) {
        const index = columns?.findIndex(el => el.value === value)
        setSelectedIndex(index >= 0 ? index : 0)
      }
    }, [value])

    React.useEffect(() => {
      if (initialized) return
      setInitialized(true)

      setTimeout(() => {
        const y = optionHeight * selectedIndex
        pickerView?.current?.scrollTo({ y })
      }, 0)

      return () => {
        timer && clearTimeout(timer)
      }
    }, [timer, optionHeight, selectedIndex, pickerView])

    React.useImperativeHandle(ref, () => ({
      scrollToTargetIndex: (val: number) => {
        setSelectedIndex(val)
        pickerView?.current?.scrollTo({ y: val * optionHeight })
      }
    }))

    const setScrollFixed = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      let y = 0
      if (event?.nativeEvent?.contentOffset) {
        y = event.nativeEvent.contentOffset.y
      }
      const active = Math.round(y / optionHeight)
      const innerHeight = active * optionHeight
      setSelectedIndex(active)
      if (innerHeight !== y) {
        if (Platform.OS === "ios") {
          setIsScrollTo(true)
        }
        pickerView?.current?.scrollTo({ y: innerHeight });
      }
      if (selectedIndex === active) {
        return;
      }
      if (onChange) {
        const selectedValue = columns && columns[active]
        onChange(selectedValue, active)
      }
    }, [optionHeight, columns, value, onChange, props])

    const mainStyle: ViewStyle = {
      height,
      flex: 1,
      backgroundColor: "#ffffff",
      overflow: "hidden",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    }

    return (
      <View style={styles.positions}>
        <ScrollView style={styles.container}>
          <PickerToolbar title={props.title} showToolbar={props.showToolbar}
            cancelText={props.cancelText} confirmText={props.confirmText}
            onCancel={props.onCancel} onConfirm={() => onConfirm && onConfirm(columns && columns[selectedIndex][fields.value])} />
          <View style={mainStyle}>
            <View style={lineStyle}></View>
            <ScrollView
              ref={pickerView}
              bounces={false}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              onScrollBeginDrag={onScrollBeginDrag}
              onScrollEndDrag={onScrollEndDrag}
              onMomentumScrollBegin={onMomentumScrollBegin}
              onMomentumScrollEnd={onMomentumScrollEnd}
            >
              {Header}
              {renderOptions()}
              {Footer}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    )
  })

const styles = StyleSheet.create({
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
})

export default Picker
