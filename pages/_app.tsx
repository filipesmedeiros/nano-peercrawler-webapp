import type { AppProps } from 'next/app'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import Layout from '@components/Layout'

import fetcher from '@lib/fetcher'

import '../styles/global.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SWRConfig value={{ fetcher }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  )
}

export default MyApp
