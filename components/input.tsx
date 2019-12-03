
import React, { useContext, useState, useRef } from 'react'
import { pick } from 'dot-object'

import { KeyboardTypeOptions, TextInputProps, Text, DatePickerIOS, View } from 'react-native'
import { TextInput, Checkbox, Caption } from 'react-native-paper'
import DateTimePickerModal from 'react-native-modal-datetime-picker'


import { StylesContext } from '../contexts/styles'
import { FormContext } from './form'


interface Props {
  name: string,
  placeholder?: string,
  value?: any,
  type?: 'email' | 'password' | 'newpassword' | 'phone' | 'number' | 'url' | 'checkbox' | 'multiline' | 'datetime',
  label?: string,
  optional?: boolean,
  disabled?: boolean,
  autoFocus?: boolean,
  autoComplete?: string,
  flat?: boolean
  submitter?: boolean
}

export const Input: React.FunctionComponent<Props> = props => {
  const { colors, sizes } = useContext(StylesContext)

  return <FormContext.Consumer>
  {context => {
    const value = pick(props.name, context.values)
    return {
      datetime: <DatetimePicker name={props.name}
        onConfirm={date => context.onChange(props.name, date)}
        value={value}
        style={{ marginBottom: sizes.base, fontSize: sizes.base }}
        label={props.label} />,
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
          height: sizes.base * 3.33,
          ...props.disabled && { opacity: 0.5 },
        }}
        onChangeText={text => context.onChange(props.name, text)}
        defaultValue={value || props.value}
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
        } as {[key: string]: TextInputProps['textContentType']})[props.type]} />
  }}
  </FormContext.Consumer>
}


export const DatetimePicker: React.FunctionComponent<{
  name: string
  onConfirm: (date: Date) => void
  value?: Date
  label?: string
  style?: any
}> = props => {
  const [visible, setVisibility] = useState(false)
  const input = useRef()
  
  return <>
    <TextInput ref={input}
      mode='outlined'
      style={props.style}
      onFocus={() => setVisibility(true)}
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
      onCancel={() => setVisibility(false)} />
  </>
}
