import React from 'react'
import { Footer } from './components/footer'
import { LeftContainer } from './views/leftContainer'
import { RightContainer } from './views/rightContainer'

const App = () => {
  return (
    <body className="flex flex-col min-h-screen">
      <main class="flex flex-grow flex-row" >
        <LeftContainer />
        <RightContainer />
      </main>
      <Footer />
    </body>
  )
}

export default App