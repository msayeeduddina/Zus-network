import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import AppWrapper from 'components/app-wrapper'

import { store, persistor } from 'store'

import '../src/styles/globals.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWrapper>
          <Component {...pageProps} />
        </AppWrapper>
      </PersistGate>
    </Provider>
  )
}
