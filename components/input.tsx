
import React from 'react'
import { FormContext } from './form'
import { KeyboardTypeOptions, TextInputProps, Text, DatePickerIOS, View } from 'react-native'
import { TextInput, Checkbox, Caption } from 'react-native-paper'


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
  submitter?: boolean
}

export const Input: React.FunctionComponent<Props> = props => {
  return <FormContext.Consumer>
    {context => ({
      datetime: <DatePickerIOS date={context.values[props.name] || props.value || new Date()}
        onDateChange={date => context.onChange(props.name, date)} />,
      checkbox: <View style={{ 
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Checkbox.Android color='#007251' status={context.values[props.name] ? 'checked' : 'unchecked'} />
        <Caption onPress={() => context.onChange(props.name, context.values[props.name] !== undefined
          ? !context.values[props.name] : true)}>{props.label}</Caption>
      </View>,
    }[props.type]
      || <TextInput
        mode='outlined'
        theme={{ colors: { background: 'white' } }}
        style={{ marginBottom: 16 }}
        onChangeText={text => context.onChange(props.name, text)}
        defaultValue={props.value}
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
        } as {[key: string]: TextInputProps['textContentType']})[props.type]} />)}
  </FormContext.Consumer>
}
