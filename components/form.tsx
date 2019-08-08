

import React from 'react'
import { View } from 'react-native'

import { Button, HelperText } from 'react-native-paper'


export const FormContext = React.createContext({
  values: {} as { [key: string]: any },
  onChange(name: string, value: any): void { return },
})


interface Props {
  cta?: string,
  onSubmit: (values: { [key: string]: any }) => Promise<string | JSX.Element | void>
}
interface State {
  values: { [key: string]: any },
  waiting: boolean,
  response?: string | JSX.Element,
  error?: string | JSX.Element
}

export class Form extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      values: {},
      waiting: false,
    }
  }

  private onSubmit() {
    this.setState({
      waiting: true,
      error: undefined,
    })

    this.props.onSubmit(this.state.values).then(response => this.setState({
        response: response || undefined,
        waiting: false,
      })).catch(error => this.setState({
        error: error.message,
        waiting: false,
      }))
  }

  private onChange(name: string, value: any) {
    this.setState({
      values : {
        ...this.state.values,
        [name]: value,
      },
    })
  }

  public render() {
    return this.state.response
    ? this.state.response
    : <View>
      <FormContext.Provider value={{
        onChange: this.onChange.bind(this),
        values: this.state.values,
      }}>
        {this.props.children}
      </FormContext.Provider>
      {this.state.error && <HelperText type='error'>{this.state.error}</HelperText>}
      {this.state.waiting
        ? <Button onPress={e => null} disabled>{'One moment...'}</Button>
        : <Button onPress={e => this.onSubmit()}>{this.props.cta || 'Save'}</Button>}
    </View>
  }
}
