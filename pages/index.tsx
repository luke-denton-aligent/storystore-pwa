import React from 'react'
import { NextPage } from 'next'
import { withApollo } from '~/lib/apollo/withApollo'

import App from '~/components/App'
import HomeTemplate from '../components/Home'

type HomeProps = {}

const Home: NextPage<HomeProps> = ({}) => {
    return (
        <App>
            <HomeTemplate />
        </App>
    )
}

// Enable next.js ssr
Home.getInitialProps = async ({}) => {
    // res?.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return {}
}

export default withApollo(Home)
