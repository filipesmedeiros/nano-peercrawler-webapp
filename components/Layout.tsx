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
      <button
        className="w-fit px-3 py-2 text-white bg-blue-600 dark:bg-blue-800 rounded border-2 border-blue-600 dark:border-blue-800"
        onClick={onDarkModeClick}
      >
        Toggle dark mode
      </button>
      {children}
    </div>
  )
}

export default Layout
