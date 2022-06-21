import {
  donationAddress,
  email,
  fediverse,
  github,
  network,
  twitter,
} from 'lib/constants'
import { FC, ReactNode, useEffect } from 'react'

export interface Props {
  children: ReactNode
}

const toggleHtmlDarkClass = () =>
  document.querySelector('html')!.classList.toggle('dark')

const addHtmlDarkClass = () =>
  document.querySelector('html')!.classList.add('dark')

const Layout: FC<Props> = ({ children }) => {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') addHtmlDarkClass()
  }, [])

  const onDarkModeClick = () => {
    toggleHtmlDarkClass()
    if (localStorage.getItem('theme') === 'dark')
      localStorage.setItem('theme', 'light')
    else localStorage.setItem('theme', 'dark')
  }

  return (
    <div className="p-6 flex flex-col gap-4 bg-blue-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold dark:text-white">
        Nano {network !== 'live' ? `${network} ` : ''}network peer explorer
      </h1>
      <button
        className="w-fit px-3 py-2 text-white bg-blue-600 dark:bg-blue-800 rounded border-2 border-blue-600 dark:border-blue-800"
        onClick={onDarkModeClick}
      >
        Toggle dark mode
      </button>
      {children}
      <footer className="flex flex-col gap-3">
        <span id="not-maintained">
          Not maintained by{' '}
          <a
            className="text-blue-500 hover:text-blue-800"
            href="https://nano.org/nano-foundation"
          >
            The Nano Foundation
          </a>
        </span>
        <a className="text-blue-500 hover:text-blue-800 w-fit" href={github}>
          Github repo with code
        </a>
        <a
          className="text-blue-500 hover:text-blue-800 w-fit"
          href="https://test.nano.org/"
        >
          More info on the nano test network
        </a>
        <span>
          Contact me on{' '}
          <a
            className="text-blue-500 hover:text-blue-800"
            href={`https://twitter.com/${twitter}`}
          >
            Twitter
          </a>
          ,{' '}
          <a className="text-blue-500 hover:text-blue-800" href={fediverse}>
            the fediverse
          </a>{' '}
          or by{' '}
          <a
            className="text-blue-500 hover:text-blue-800"
            href={`mailto:${email}`}
          >
            email
          </a>
        </span>
        <span className="text-xs">
          Donations:{' '}
          <a
            className="text-blue-500 hover:text-blue-800"
            href={`nano:${donationAddress}`}
          >
            {donationAddress}
          </a>
        </span>
      </footer>
    </div>
  )
}

export default Layout
