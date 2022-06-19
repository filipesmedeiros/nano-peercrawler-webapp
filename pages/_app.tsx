import type { AppProps } from 'next/app'
import { FC, useEffect } from 'react'
import 'tailwindcss/tailwind.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {}, [])
  return <Component {...pageProps} />
}

export default MyApp
