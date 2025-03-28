import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CBadge,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilBasket,
  cilBell,
  cilChartPie,
  cilSpeedometer,
  cilUserFollow,
  cilUserUnfollow,
} from '@coreui/icons'

const AppHeaderDropdownNotif = () => {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://your-api.com/notifications') // Replace with actual API
        const data = await response.json()

        // Assuming API returns an array of notifications with a `read` property
        setNotifications(data)
        const unread = data.filter((notif) => !notif.read).length
        setUnreadCount(unread)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
        <span className="d-inline-block my-1 mx-2 position-relative">
          <CIcon icon={cilBell} size="lg" />
          {unreadCount > 0 && (
            <CBadge color="danger" position="top-end" shape="rounded-circle" className="p-1">
              <span className="visually-hidden">{unreadCount} new alerts</span>
            </CBadge>
          )}
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="py-0">
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
          {t('notificationsCounter', { counter: unreadCount })}
        </CDropdownHeader>
        {notifications.length === 0 ? (
          <CDropdownItem>{t('noNewNotifications')}</CDropdownItem>
        ) : (
          notifications.map((notif, index) => (
            <CDropdownItem key={index}>
              <CIcon icon={notif.icon || cilBell} className="me-2 text-primary" />
              {notif.message}
            </CDropdownItem>
          ))
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownNotif
