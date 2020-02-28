import React from 'react'
import { NextComponentType } from 'next'

import Error from '../components/Error'

import { useNetworkStatus } from '../hooks/useNetworkStatus'
import useValueUpdated from '../hooks/useValueUpdated'
import { useRouter } from 'next/router'

export type OfflineProps = {}

const Offline: NextComponentType<any, any, OfflineProps> = ({}) => {
    const router = useRouter()

    const online = useNetworkStatus()

    /**
     * Refresh page url once is back online
     */
    useValueUpdated(() => {
        if (online) {
            router.reload()
        }
    }, online)

    return <Error type="Offline" />
}

export default Offline