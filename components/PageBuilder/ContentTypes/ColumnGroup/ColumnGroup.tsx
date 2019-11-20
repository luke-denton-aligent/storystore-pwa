import React from 'react'
import { Component } from '@pmet-public/luma-ui/dist/lib'
import { Root } from './ColumnGroup.styled'

export type ColumnGroupProps = {}

export const ColumnGroup: Component<ColumnGroupProps> = ({ ...props }) => {
    return <Root {...props} />
}