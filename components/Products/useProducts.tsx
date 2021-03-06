import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { queryDefaultOptions } from '~/lib/apollo/client'
import { getURLSearchAsObject } from '~/lib/getURLSearchAsObject'
import { FiltersGroupProps } from '@storystore/ui/dist/components/Filters'

import { useRouter } from 'next/router'

import FILTERS_QUERY from './graphql/filterTypes.graphql'
import PRODUCTS_QUERY from './graphql/products.graphql'

const TYPES = {
    FilterEqualTypeInput: 'equal',
    FilterMatchTypeInput: 'match',
    FilterRangeTypeInput: 'range',
}

export type FilterValues = {
    [key: string]: {
        in?: string[]
        eq?: string
    }
}

export type UseFiltersProps = {
    search?: string
    filters?: FilterValues
}

export const useProducts = (props: UseFiltersProps) => {
    const { search, filters: filtersValues = {} } = props

    const history = useRouter()

    const [panelOpen, setPanelOpen] = useState(false)

    /**
     * Attribute Type is not part of the Filter Query. We need to query all types available first,
     */
    const filters = useQuery(FILTERS_QUERY, {
        ...queryDefaultOptions,
        fetchPolicy: 'cache-first',
    })

    const filtersDefaultValues = useMemo(() => {
        return JSON.parse(history.query?.filters?.toString() || '{}')
    }, [history])

    const filtersCount = useMemo(() => Object.keys(filtersDefaultValues).reduce((total, key) => (filtersDefaultValues[key]?.length ?? 0) + total, 0), [filtersDefaultValues])

    const filterTypes = filters.data?.filterTypes?.fields

    // Get Variables with their corresponding functional value
    const filterVariables = useMemo(() => {
        if (!filterTypes) return {}
        return Object.entries(filtersDefaultValues).reduce((_groups, [name, _values]: any) => {
            const attributeType: keyof typeof TYPES = filterTypes.find((field: any) => field.name === name)?.type.name

            const type = TYPES[attributeType]

            let value

            switch (type) {
                case 'range':
                    // ['10_20', '20-30']-> { from: '10', to: '30'}
                    const { from, to } = _values.reduce(
                        (accum: any, item: any) => {
                            const _price = item.split('_')
                            const _from = Number(_price[0])
                            const _to = Number(_price[1])

                            return {
                                from: _from < accum.from ? _from : accum.from,
                                to: _to > accum.to ? _to : accum.to,
                            }
                        },
                        { from: 0, to: 0 }
                    )

                    value = { from: String(from), to: String(to) }
                    break

                case 'match':
                    value = { in: typeof _values === 'string' ? _values : [..._values] }
                    break

                case 'equal':
                    value = { in: typeof _values === 'string' ? _values : [..._values] }
                    break

                default:
                    // let's do "match" as default
                    value = { match: typeof _values === 'string' ? _values : _values[0] }
                    break
            }

            return {
                ..._groups,
                [name]: value,
            }
        }, {})
    }, [filtersDefaultValues, filterTypes])

    const sortingDefaultValues = useMemo(() => {
        return history.query?.sortBy && JSON.parse(history.query.sortBy.toString())
    }, [history])

    const sortingValues = useMemo(() => {
        if (!sortingDefaultValues?.sortBy) return

        const [key, value] = sortingDefaultValues.sortBy.split(',')

        return { [key]: value }
    }, [sortingDefaultValues])

    /** Get Products */
    const products = useQuery(PRODUCTS_QUERY, {
        ...queryDefaultOptions,
        variables: { search, sort: sortingValues, filters: { ...filtersValues, ...filterVariables } },
    })

    // Lets transform our groups
    const groups: FiltersGroupProps[] = [
        ...(products.data?.products?.filters?.map((filter: any) => {
            /**
             * Let's include the Type since it's not returned within the GraphQL Query.
             */
            // const attributeType: keyof typeof TYPES = filterTypes.find((field: any) => field.name === filter.code)?.type.name
            // const type = TYPES[attributeType]

            /** Fix some Labels */
            const items = filter.options.map((option: any) => {
                let label = option.label

                switch (label) {
                    case '0':
                        label = 'No'
                        break

                    case '1':
                        label = 'Yes'
                        break
                    default:
                        break
                }

                return {
                    _id: option.value,
                    count: option.count,
                    label,
                    value: option.value.toString(),
                }
            })

            const count = filtersDefaultValues[filter.code]?.length

            return {
                _id: filter.code,
                title: filter.title + (count ? ` (${count})` : ''),
                name: filter.code,
                items,
            }
        }) ?? []),
    ]

    // Handle Toggling of Filters
    const handleTogglePanel = useCallback(
        (state = !panelOpen) => {
            setPanelOpen(state)
        },
        [panelOpen]
    )

    // Handle Updates on Filter
    const handleOnFilterUpdate = useCallback(
        fields => {
            const { pathname, asPath } = history

            /** We use our little helper because getting "query" from Next.js useRouter() also returns urlResolver params */
            const query = getURLSearchAsObject()

            /** Merge selected values with fields values and filter down to only selected */
            const groups = Object.keys(fields).reduce((accum, key) => (!!fields[key].length ? { ...accum, [key]: fields[key] } : { ...accum }), {})

            /** Update the URL Query */
            history.push(
                {
                    pathname,
                    query: {
                        ...query,
                        filters: JSON.stringify({ ...groups }),
                    },
                },
                {
                    pathname: asPath.split('?')[0],
                    query: {
                        ...query,
                        filters: JSON.stringify({ ...groups }),
                    },
                }
            )
        },
        [history]
    )

    // Handle Updates on Filter
    const handleOnSortingUpdate = useCallback(
        fields => {
            const sortBy = JSON.stringify({ ...fields })
            const { pathname, asPath } = history

            /** We use our little helper because getting "query" from Next.js useRouter() also returns urlResolver params */
            const query = getURLSearchAsObject()

            /** Update the URL Query */
            history.push(
                {
                    pathname,
                    query: {
                        ...query,
                        sortBy,
                    },
                },
                {
                    pathname: asPath.split('?')[0],
                    query: {
                        ...query,
                        sortBy,
                    },
                }
            )
        },
        [history]
    )

    const { count, pagination, sorting, items } = products.data?.products ?? {}

    const productUrlSuffix = products.data?.store?.productUrlSuffix || ''

    return {
        ...products,
        loading: products.loading || filters.loading,
        data: {
            panelOpen,
            productUrlSuffix,
            count,
            pagination,
            items,
            sorting: {
                ...sorting,
                defaultValues: sortingDefaultValues || { sortBy: `${sorting?.default},DESC` },
            },
            filters: {
                count: filtersCount,
                defaultValues: filtersDefaultValues,
                groups,
            },
        },

        api: {
            togglePanel: handleTogglePanel,
            onFilterUpdate: handleOnFilterUpdate,
            onSortingUpdate: handleOnSortingUpdate,
        },
    }
}
