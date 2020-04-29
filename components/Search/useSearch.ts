import { useState, useCallback } from 'react'
import { queryDefaultOptions } from '../../lib/apollo/client'
import { useQuery } from '@apollo/react-hooks'
import { useRouter } from 'next/router'

import SEARCH_QUERY from './graphql/search.graphql'

type FilterValues = {
    [key: string]: {
        eq: string
    }
}

export const useSearch = (props: { queryString?: string }) => {
    const history = useRouter()

    const { queryString = '' } = props

    const [filters] = useState<FilterValues>({})

    const search = useQuery(SEARCH_QUERY, {
        ...queryDefaultOptions,
        variables: { search: queryString, filters },
    })

    const handleOnNewSearch = useCallback(
        async (newQuery: string) => {
            if (newQuery.length === 0 || newQuery.length > 2) {
                await history.push(`/search?query=${newQuery}`, `/search?query=${newQuery}`, { shallow: true })
                window.scrollTo(0, 0)
            }
        },
        [history]
    )

    return {
        queries: {
            search,
        },
        api: {
            search: handleOnNewSearch,
        },
    }
}
