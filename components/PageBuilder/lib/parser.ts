import configs from '../configs'
import { toPascalCase } from '@storystore/ui/dist/lib'

const getComponentData = (type: string, node?: HTMLElement) => {
    const name = toPascalCase(type)

    if (!node) {
        return {
            name,
            items: [],
        }
    }

    const { appearance } = node.dataset

    /** Dataset comes in first child element if the Component Appearance is "contained" */
    const currentNode = appearance === 'contained' ? (node.childNodes[0] as HTMLElement) : node

    const config = (configs as any)[name]

    if (!config) return null

    const component = {
        component: config.component,
        props: config.props(currentNode),
    }

    return {
        component: component.component,
        name,
        items: [],
        props: component.props,
    }
}

/**
 * Walk over tree nodes extracting each content types configuration
 */
const walk = (rootEl: Node, component: any) => {
    const tree = document.createTreeWalker(rootEl, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)

    let currentNode = tree.nextNode()

    while (currentNode) {
        if (currentNode.nodeType !== Node.ELEMENT_NODE) {
            currentNode = tree.nextNode()
            continue
        }

        const contentType = (currentNode as HTMLElement).getAttribute('data-content-type')

        if (!contentType) {
            currentNode = tree.nextNode()
            continue
        }

        const data = getComponentData(contentType, currentNode as HTMLElement)

        if (!data) {
            currentNode = tree.nextNode()
            continue
        }

        // Add children elements
        component.items.push(data)

        walk(currentNode, data)

        currentNode = tree.nextSibling()
    }

    return component
}

export const htmlToProps = (htmlStr: string) => {
    const container = new DOMParser().parseFromString(htmlStr, 'text/html')
    const stageContentType = getComponentData('root-container')
    const result = walk(container.body, stageContentType)

    if (process.env.NODE_ENV !== 'production') {
        console.group('🏗 PageBuilder')
        console.log('Content Types', result)
        console.groupEnd()
    }

    return result
}
