import { useEffect, FC } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useMemo } from 'react'
import { useRuntime, canUseDOM } from 'vtex.render-runtime'

import useDataPixel from '../hooks/useDataPixel'


interface UsePageViewArgs {
  title?: string
  cacheKey?: string
  skip?: boolean
}

const fields = [
  'firstName',
  'lastName',
  'document',
  'id',
  'email',
  'phone',
  'isAuthenticated',
] as const

interface SessionResponse {
  response: {
    namespaces: {
      profile?: {
        firstName?: {
          value: string
        }
        lastName?: {
          value: string
        }
        document?: {
          value: string
        }
        id?: {
          value: string
        }
        email?: {
          value: string
        }
        phone?: {
          value: string
        }
        isAuthenticated?: {
          value: string
        }
      }
    }
  }
}

export const usePageView = ({
  title,
  cacheKey,
  skip,
}: UsePageViewArgs = {}) => {
  const { route, account } = useRuntime()
  const pixelCacheKey = cacheKey ?? route.routeId

  const eventData = useMemo(() => {
    if (!canUseDOM || skip) {
      return null
    }

    return {
      event: 'pageView',
      pageTitle: title ?? document.title,
      pageUrl: location.href,
      referrer:
        document.referrer.indexOf(location.origin) === 0
          ? undefined
          : document.referrer,
      accountName: account,
      routeId: route?.routeId ? route.routeId : '',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, title, canUseDOM, pixelCacheKey])

  useDataPixel(skip ? null : eventData, pixelCacheKey)
}

// const SKIP_PAGES = ['store.search', 'store.product']

const getSessionPromiseFromWindow: any = () =>
  !(window as any).__RENDER_8_SESSION__ ||
  !(window as any).__RENDER_8_SESSION__.sessionPromise
    ? Promise.resolve(null)
    : (window as any).__RENDER_8_SESSION__.sessionPromise

const toBoolean = (value: string) => value.toLowerCase() === 'true'

function getUserData(
  profileFields: SessionResponse['response']['namespaces']['profile']
) {
  if (!profileFields) {
    return {}
  }

  return fields.reduce<Record<string, string | boolean>>((acc, key) => {
    const value = profileFields[key]?.value

    if (value) {
      acc[key] = key === 'isAuthenticated' ? toBoolean(value) : value
    }

    return acc
  }, {})
}

const CombinedPixel: FC<Partial<UsePageViewArgs>> = ({ title }) => {
  const { push } = usePixel()
  const { route } = useRuntime()
  // let eventData: any;



  // First Code - Fetching user data and pushing it
  useEffect(() => {
    getSessionPromiseFromWindow().then((data: SessionResponse) => {
      const profileFields = data?.response?.namespaces?.profile

      if (!profileFields) {
        return
      }

      const userData = getUserData(profileFields)

      // const skip =
      // route && SKIP_PAGES.some(routeId => route.routeId.indexOf(routeId) === 0)
      // usePageView({ title, skip })

      push({
        event: 'userData',
        ...userData,
      })

        const eventData =

        {
          event: 'pageView',
          pageTitle: title ?? document.title,
          pageUrl: location.href,
          referrer:
            document.referrer.indexOf(location.origin) === 0
              ? undefined
              : document.referrer,
          accountName: 'auchan123',
          routeId: route?.routeId ? route.routeId : '',
        }

      // const skip = false;
      // const pixelCacheKey = route.routeId

      useDataPixel(eventData, route.routeId);


    })
  }, [push])



  // Second code - Use page view only when the user data has been loaded
  // useEffect(() => {
  //   if (!isUserDataLoaded) {
  //     return
  //   }

  //   const skip =
  //     route && SKIP_PAGES.some(routeId => route.routeId.indexOf(routeId) === 0)
  //   usePageView({ title, skip })
  // }, [isUserDataLoaded, route, title])



  return null
}

export default CombinedPixel
