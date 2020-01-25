

import React, { FunctionComponent, useState } from 'react'
import { View } from 'react-native'

import { HelperText } from 'react-native-paper'
import { str } from 'dot-object'

import { Button } from './button'


export const FormContext = React.createContext({
  values: {} as { [key: string]: any },
  inline: false as boolean,
  onChange(name: string, value: any): void { return },
})


interface Props {
  values?: { [key: string]: any }
  cta?: string | JSX.Element
  hideButton?: boolean
  inline?: boolean
  onSubmit: (values: { [key: string]: any }) => Promise<string | JSX.Element | void>
}
interface State {
  values: { [key: string]: any },
  waiting: boolean,
  error?: string | JSX.Element
}

export class Form extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      values: props.values || {},
      waiting: false,
    }

    this.onChange = this.onChange.bind(this)
  }
  

  public submit() {
    this.setState({
      waiting: true,
      error: undefined,
    })

    this.props.onSubmit(this.state.values)
      .catch(error => {
        // console.error(error)
        this.setState({
          error: error.message,
          waiting: false,
        })
      })
  }

  public reset() {
    this.setState({
      waiting: false,
      values: {},
    })
  }

  private onChange(name: string, value: any) {
    const values = this.state.values
    str(name, value, values)
    this.setState({ values })
  }

  public render() {
    return <View style={{ ...this.props.inline && { flexDirection: 'row' }}}>
      <FormContext.Provider value={{
        onChange: this.onChange,
        inline: this.props.inline,
        values: this.state.values,
      }}>
        {this.props.children}
      </FormContext.Provider>
      {this.state.error && <HelperText type='error'>{this.state.error}</HelperText>}
      {!this.props.hideButton && (this.state.waiting
      ? <Button contained={!this.props.inline} disabled>{this.props.inline ? '...' : 'One moment...'}</Button>
      : <Button contained={!this.props.inline}
          onPress={() => this.submit()}>{this.props.cta || 'Save'}</Button>)}
    </View>
  }
}
