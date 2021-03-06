import React from 'react'
import { Component } from '@storystore/ui/dist/lib'
import { Root } from './Heading.styled'

export type HeadingProps = {
    as: string
    text: string
}

export const Heading: Component<HeadingProps> = ({ as, text, ...props }) => {
    return (
        <Root as={as} {...props}>
            {text}
        </Root>
    )
}
