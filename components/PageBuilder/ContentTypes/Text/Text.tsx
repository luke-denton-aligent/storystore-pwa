import React from 'react'
import { Component } from '@pmet-public/luma-ui/dist/lib'
import Html, { HtmlProps } from '@pmet-public/luma-ui/dist/components/Html'
import { Root } from './Text.styled'

export type TextProps = HtmlProps

export const Text: Component<TextProps> = ({ children, ...props }) => {
    return <Root as={Html} {...props} />
}