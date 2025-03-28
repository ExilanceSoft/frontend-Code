import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilRestaurant,
  cilList,
  cilBuilding,
  cilBriefcase,
  cilUserFollow,
  cilFastfood,
  cilImage,
  cilGrid,
  cilUser,
  cilPeople,
  cilClipboard,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react-pro'
import { Translation } from 'react-i18next'

const _nav = [
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Admin Dashboard')}</Translation>,
    to: '/Admin/AdminDashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: <Translation>{(t) => t('Management')}</Translation>,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Menu Management')}</Translation>,
    to: '/Admin/MenuManagement',
    icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Categories Management')}</Translation>,
    to: '/Admin/CategoriesManagement',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Franchise Requests')}</Translation>,
    to: '/Admin/FranchiseRequests',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Branches Management')}</Translation>,
    to: '/Admin/Branches',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Careers')}</Translation>,
    to: '/Admin',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Job Positions',
        to: '/Admin/JobPositions',
      },
      {
        component: CNavItem,
        name: 'Job Application Follow-Up',
        to: '/Admin/JobApplicationFollowUp',
      },
    ],
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Online Order Links')}</Translation>,
    to: '/Admin/OnlineOrderLinks',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Gallery Management')}</Translation>,
    to: '/Admin',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Images Management',
        to: '/Admin/ImagesPage',
      },
      {
        component: CNavItem,
        name: 'Gallery Categories',
        to: '/Admin/GalleryCategoriesPage',
      },
    ],
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Testimonials Management')}</Translation>,
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Testimonials Page',
        to: '/Admin/TestimonialsPage',
      },
      {
        component: CNavItem,
        name: 'Visitor Testimonials',
        to: '/Admin/VisitorTestimonialsPage',
        badge: {
          color: 'danger-gradient',
        },
      },
    ],
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('UserRegistaration')}</Translation>,
    to: '/Admin/UserRegistaration',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav
