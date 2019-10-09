import React, { FunctionComponent, useState, useEffect } from 'react'
import CATEGORY_QUERY from './category.graphql'
import PRODUCTS_QUERY from './products.graphql'

import { useQuery } from '@apollo/react-hooks'
import { useScroll } from 'luma-ui/dist/hooks/useScroll'
import { useResize } from 'luma-ui/dist/hooks/useResize'

import DocumentMetadata from '../DocumentMetadata'
import Link from '../Link'
import CategoryTemplate from 'luma-ui/dist/templates/Category'
import Error from 'next/error'
import ViewLoader from 'luma-ui/dist/components/ViewLoader'

type CategoryProps = {
    id: number
}

type FilterValues = {
    [key: string]: {
        eq: string
    }
}

export const Category: FunctionComponent<CategoryProps> = ({ id }) => {
    const { scrollY, scrollHeight } = useScroll()

    const { height } = useResize()

    const [filterValues, setFilterValues] = useState<FilterValues>({
        category_id: {
            eq: id.toString(),
        },
    })

    const categoryQuery = useQuery(CATEGORY_QUERY, {
        variables: { id },
        fetchPolicy: 'cache-first',
        returnPartialData: true,
    })

    const productsQuery = useQuery(PRODUCTS_QUERY, {
        variables: { filters: filterValues },
        fetchPolicy: 'cache-first',
        returnPartialData: true,
    })

    /**
     * Update filters on ID change
     */
    useEffect(() => {
        setFilterValues({
            category_id: {
                eq: id.toString(),
            },
        })
    }, [id])

    /**
     * Infinite Scroll Effect
     */
    useEffect(() => {
        if (productsQuery.loading) return

        const { products } = productsQuery.data

        // ignore if it is loading or has no pagination
        if (!products.pagination) return

        // don't run if it's in the last page
        if (!(products.pagination.current < products.pagination.total)) return

        // load more products when the scroll reach half of the viewport height
        if (scrollY + height > scrollHeight / 2) {
            productsQuery.fetchMore({
                variables: {
                    currentPage: products.pagination.current + 1, // next page
                },
                updateQuery: (prev: any, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev
                    return {
                        ...prev,
                        products: {
                            ...prev.products,
                            ...fetchMoreResult.products,
                            items: [...prev.products.items, ...fetchMoreResult.products.items],
                        },
                    }
                },
            })
        }
    }, [scrollY])

    if (categoryQuery.loading) {
        return <ViewLoader />
    }

    if (categoryQuery.error) {
        console.error(categoryQuery.error.message)
        return <Error statusCode={500} />
    }

    if (!categoryQuery.data.page) {
        return <Error statusCode={404} />
    }

    const { store, meta, page } = categoryQuery.data

    const products = productsQuery.data && productsQuery.data.products

    function handleOnClickFilterValue(key: string, value: string) {
        setFilterValues({
            ...filterValues,
            [key]: {
                eq: value,
            },
        })
    }

    return (
        <React.Fragment>
            <DocumentMetadata
                title={[store.titlePrefix, meta.title || page.title, store.titleSuffix]}
                description={meta.description}
                keywords={meta.keywords}
            />

            <CategoryTemplate
                display={page.mode}
                cmsBlock={
                    page.cmsBlock && {
                        html: page.cmsBlock,
                    }
                }
                title={{
                    as: 'h2',
                    text: page.title,
                }}
                breadcrumbs={
                    page.breadcrumbs && {
                        items: page.breadcrumbs.map(({ id, text, href }: any) => ({
                            _id: id,
                            as: Link,
                            urlResolver: true,
                            href: '/' + href,
                            text,
                        })),
                    }
                }
                categories={
                    page.categories && {
                        items: page.categories.map(({ _id, text, count, href }: any) => ({
                            _id,
                            as: Link,
                            urlResolver: true,
                            count,
                            text,
                            href: '/' + href,
                        })),
                    }
                }
                filters={
                    products &&
                    products.filters && {
                        label: 'Filters',
                        closeButton: {
                            text: 'Done',
                        },
                        groups: products.filters.map(({ name, key, items }: any) => ({
                            title: name,
                            items: items.map(({ label, count, value }: any) => ({
                                as: 'a',
                                count,
                                href: '#',
                                text: label,
                                onClick: (e: Event) => {
                                    e.preventDefault()
                                    handleOnClickFilterValue(key, value)
                                },
                            })),
                        })),
                    }
                }
                products={{
                    loader: productsQuery.loading && products && { label: 'fetching products ' },
                    items:
                        products &&
                        products.items.map(({ id, image, price, title, urls }: any, index: number) => ({
                            _id: `${id}--${index}`,
                            as: Link,
                            href: urls[urls.length - 1].url,
                            urlResolver: true,
                            image,
                            price: {
                                regular: price.regularPrice.amount.value,
                                currency: price.regularPrice.amount.currency,
                            },
                            title: {
                                text: title,
                            },
                        })),
                }}
            />
        </React.Fragment>
    )
}