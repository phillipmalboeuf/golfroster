
import React, { useContext } from 'react'
import { FormContext } from './form'
import { KeyboardTypeOptions, TextInputProps, Text, DatePickerIOS, View } from 'react-native'
import { TextInput, Checkbox, Caption } from 'react-native-paper'
import { pick } from 'dot-object'
import { StylesContext } from '../contexts/styles'


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
      datetime: <DatePickerIOS date={value || props.value || new Date()}
        onDateChange={date => context.onChange(props.name, date)} />,
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
