import React, { useEffect } from 'react'

import Ideogram from 'ideogram'

export default function ReactIdeogram(props: Record<string, unknown>) {
  useEffect(() => {
    new Ideogram({
      ...props,
      dataDir: '/',
      container: '#ideo-container',
    })
  }, [props])
  return <div style={{ padding: 10, margin: 10 }} id="ideo-container"></div>
}
