import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import '@/styles/globals.css'
import { UserProvider } from '@/utils/userContext'


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
  )
}