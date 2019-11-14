

import React from 'react'
import { View } from 'react-native'

import { Button, HelperText } from 'react-native-paper'
import { str } from 'dot-object'


export const FormContext = React.createContext({
  values: {} as { [key: string]: any },
  inline: false as boolean,
  onChange(name: string, value: any): void { return },
})


interface Props {
  cta?: string | JSX.Element
  hideButton?: boolean
  inline?: boolean
  onSubmit: (values: { [key: string]: any }) => Promise<string | JSX.Element | void>
}
interface State {
  values: { [key: string]: any },
  waiting: boolean,
  response?: string | JSX.Element | void,
  error?: string | JSX.Element
}

export class Form extends React.Component<Props, State> {

  public state: State = {
    values: {},
    waiting: false,
  }
  

  public submit() {
    this.setState({
      waiting: true,
      error: undefined,
    })

    this.props.onSubmit(this.state.values).then(response => this.setState({
        response,
        waiting: false,
        values: {},
      })).catch(error => this.setState({
        error: error.message,
        waiting: false,
      }))
  }

  private onChange(name: string, value: any) {
    const values = this.state.values
    str(name, value, values)
    this.setState({ values })
  }

  public render() {
    return this.state.response
    ? this.state.response
    : <View style={{ ...this.props.inline && { flexDirection: 'row' }}}>
      <FormContext.Provider value={{
        onChange: this.onChange.bind(this),
        inline: this.props.inline,
        values: this.state.values,
      }}>
        {this.props.children}
      </FormContext.Provider>
      {this.state.error && <HelperText type='error'>{this.state.error}</HelperText>}
      {!this.props.hideButton && (this.state.waiting
      ? <Button mode={this.props.inline ? 'text' : 'contained'} uppercase={false} disabled>{this.props.inline ? '...' : 'One moment...'}</Button>
      : <Button mode={this.props.inline ? 'text' : 'contained'} uppercase={false}
        onPress={() => this.submit()}>{this.props.cta || 'Save'}</Button>)}
    </View>
  }
}
