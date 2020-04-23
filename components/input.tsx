
import React, { useContext, useState, useRef } from 'react'
import { pick } from 'dot-object'

import { KeyboardTypeOptions, TextInputProps, Text, View, Picker } from 'react-native'
import { TextInput, Checkbox, Caption } from 'react-native-paper'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Slider from '@react-native-community/slider'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { StylesContext } from '../contexts/styles'
import { FormContext } from './form'


interface Props {
  name: string
  placeholder?: string
  value?: any
  type?: 'email' | 'password' | 'newpassword' | 'phone' | 'number' | 'url' | 'checkbox' | 'picker' | 'multiline' | 'datetime' | 'slider'
  label?: string
  optional?: boolean
  disabled?: boolean
  min?: number
  max?: number
  options?: Array<{ label: string, value: string }>
  autoFocus?: boolean
  autoComplete?: string
  flat?: boolean
  next?: boolean
  submitter?: boolean
}

export const Input: React.FunctionComponent<Props> = props => {
  const { colors, sizes } = useContext(StylesContext)

  return <FormContext.Consumer>
  {context => {
    const value = pick(props.name, context.values)
    return {
      datetime: <DatetimePicker value={value}
        onConfirm={date => context.onChange(props.name, date)}
        style={{ marginBottom: sizes.base, fontSize: sizes.base }}
        label={props.label} />,
      slider: <>
        <RangeSlider value={value}
          onChange={v => context.onChange(props.name, v)}
          min={props.min}
          max={props.max} />
      </>,
      checkbox: <View style={{ 
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Checkbox.Android color={colors.green}
          disabled={props.disabled}
          status={value ? 'checked' : 'unchecked'}
          onPress={() => context.onChange(props.name, value !== undefined
            ? !value : true)} />
        {props.label && <Caption onPress={() => context.onChange(props.name, value !== undefined
            ? !value : true)}>{props.label}</Caption>}
      </View>,
    }[props.type]
      || <TextInput
        mode={props.flat ? 'flat' : 'outlined'}
        theme={{ colors: { background: 'white' } }}
        style={{ marginBottom: sizes.base, ...context.inline && { flex: 1 },
          fontSize: sizes.base,
          ...props.type !== 'multiline' && { height: sizes.base * 3.33 },
          ...props.disabled && { opacity: 0.5 },
        }}
        onChangeText={text => context.onChange(props.name, text)}
        defaultValue={value || props.value}
        returnKeyType={props.next ? 'next' : 'done'}
        label={props.label}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        autoCapitalize={props.type === 'multiline' ? 'sentences' : 'none'}
        autoCorrect={false}
        editable={!props.disabled}
        blurOnSubmit={props.submitter}
        multiline={props.type === 'multiline'}
        secureTextEntry={props.type === 'password' || props.type === 'newpassword'}
        keyboardType={({
          email: 'email-address',
          phone: 'phone-pad',
          number: 'numeric',
          url: 'url',
        } as {[key: string]: KeyboardTypeOptions})[props.type]}
        textContentType={({
          email: 'emailAddress',
          password: 'password',
          newpassword: 'newPassword',
          phone: 'telephoneNumber',
          url: 'URL',
        } as {[key: string]: TextInputProps['textContentType']})[props.type]}
        {...props.type === 'picker' && { render: () => {
          return <Picker selectedValue={value || props.value}
            onValueChange={text => context.onChange(props.name, text)}
            itemStyle={{ textAlign: 'left', marginHorizontal: sizes.base }}>
            {props.optional && <Picker.Item label={' '} value={undefined} />}
            {props.options.map(option => <Picker.Item key={option.value} label={option.label} value={option.value} />)}
          </Picker>
        } }} />
  }}
  </FormContext.Consumer>
}


export const DatetimePicker: React.FunctionComponent<{
  onConfirm: (date: Date) => void
  value?: Date
  label?: string
  style?: any
}> = props => {
  const [visible, setVisibility] = useState(false)
  
  return <>
    <TextInput
      mode='outlined'
      style={props.style}
      onTouchEnd={() => setVisibility(true)}
      editable={false}
      value={props.value && props.value.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
      label={`${props.label} Date`} />
    <DateTimePickerModal
      isVisible={visible}
      mode='datetime'
      onConfirm={date => {
        props.onConfirm(date)
        setVisibility(false)
      }}
      onCancel={() => {
        setVisibility(false)
      }} />
  </>
}

export const RangeSlider: React.FunctionComponent<{
  onChange: (value: number) => void
  value?: number
  min: number
  max: number
}> = props => {
  const { colors, sizes } = useContext(StylesContext)

  return <>
    {/* <Text style={{
      color: colors.green,
      textAlign: 'center',
    }}>
      {props.value}
    </Text> */}
    <View>
      <MultiSlider values={[props.value]} enableLabel={true} customLabel={RangeSliderLabel} enabledTwo={false}
        min={props.min}
        max={props.max}
        step={0.1}
        onValuesChange={values => props.onChange(parseFloat(values[0].toFixed(1)))}
        trackStyle={{ backgroundColor: colors.greys[1] }}
        selectedStyle={{ backgroundColor: colors.green }}
        pressedMarkerStyle={{ shadowOffset: { height: 2 } }} />
      {/* <Slider value={props.value}
        minimumTrackTintColor={colors.green}
        maximumTrackTintColor={colors.green}
        step={0.1}
        minimumValue={props.min}
        maximumValue={props.max}
        onValueChange={v => props.onChange(parseFloat(v.toFixed(1)))} /> */}
      {/* <Slider value={props.value}
        // style={{ position: 'absolute', width: '100%' }}
        inverted
        minimumTrackTintColor={colors.green}
        maximumTrackTintColor={colors.green}
        step={0.1}
        minimumValue={props.min}
        maximumValue={props.max} /> */}
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {props.min && <Caption>
        {props.min.toFixed(1).replace('-', '+')}
      </Caption>}
      {props.max && <Caption>
        {props.max.toFixed(1).replace('-', '+')}
      </Caption>}
    </View>
  </>
}

export const RangeSliderLabel: React.FunctionComponent<{
  oneMarkerPressed: boolean
  twoMarkerPressed: boolean
  oneMarkerValue: number
  twoMarkerValue: number
  oneMarkerLeftPosition: number
  twoMarkerLeftPosition: number
}> = props => {
  const one = props.oneMarkerValue !== undefined
  const two = props.twoMarkerValue !== undefined

  return (one || two) ? <Caption style={{
    position: 'absolute',
    bottom: '100%',
    left: (props.oneMarkerLeftPosition || props.twoMarkerLeftPosition || 0),
    transform: [],
  }}>
    {(one 
      ? props.oneMarkerValue
      : props.twoMarkerValue).toFixed(1).replace('-', '+')}
  </Caption> : null
}
