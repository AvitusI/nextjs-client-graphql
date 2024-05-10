'use client'

import { PropsWithChildren, useMemo } from 'react'
import {
  UrqlProvider,
  ssrExchange,
  fetchExchange,
  createClient,
} from '@urql/next'
import { cacheExchange } from '@urql/exchange-graphcache' // like redux for graphql

import { url } from '@/utils/url'
import { getToken } from '@/utils/token'

export default function GQLProvider({ children }: PropsWithChildren) {
  const [client, ssr] = useMemo(() => {  // Memorizes the function
    const ssr = ssrExchange({  // ssrExchange makes sure it doesn't break on server
      isClient: typeof window !== 'undefined',
    })

    const client = createClient({
      url,
      exchanges: [cacheExchange({}), ssr, fetchExchange], // Plugins
      fetchOptions: () => {
        const token = getToken()

        return token
          ? {
            headers: { authorization: `Bearer ${token}` }, // If you use cookies, you don't have to do this
          }
          : {}
      },
    })

    return [client, ssr]
  }, [])

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  )
}

// read about useReducer