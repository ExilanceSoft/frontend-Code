import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react-pro'

import routes from '../routes'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const { t } = useTranslation()

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  const lastBreadcrumb = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : null;

  return (
    <>
      {lastBreadcrumb ? (
        <div className="fs-2 fw-semibold">{lastBreadcrumb.name}</div>
      ) : (
        <div className="fs-2 fw-semibold">{t('breadcrumb.default')}</div> // Optional default message
      )}
      <CBreadcrumb className="mb-4">
        <CBreadcrumbItem href="/">{t('home')}</CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>
          )
        })}
      </CBreadcrumb>
    </>
  )
}

export default React.memo(AppBreadcrumb)
