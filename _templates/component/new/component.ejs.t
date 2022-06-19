---
to: components/<%= name %>.tsx
---
import type { FC } from 'react'

// delete if not needed
export interface Props {
  // your props here
}

const <%= componentName %>: FC<Props> = ({ children }) => {
    return <>{children}</>
}

export default <%= componentName %>
