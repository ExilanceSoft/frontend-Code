import React from 'react'
import { Translation } from 'react-i18next'
import doctor from './views/Admin/FranchiseRequests'
// import DoctorDahboard from './views/Doctor/DoctorDashboard'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const MenuManagement = React.lazy(() => import('./views/Admin/MenuManagement'))
const Branches = React.lazy(() => import('./views/Admin/Branches'))
const VisitorTestimonialsPage =React.lazy(() => import('./views/Admin/VisitorTestimonialsPage'))
const FranchiseRequests = React.lazy(() => import('./views/Admin/FranchiseRequests'));
const JobPositions = React.lazy(() => import('./views/Admin/JobPositions'));
const JobApplicationFollowUp = React.lazy(() => import('./views/Admin/JobApplicationFollowUp'));
const OnlineOrderLinks = React.lazy(() => import('./views/Admin/OnlineOrderLinks'));
const ImagesPage = React.lazy(() => import('./views/Admin/ImagesPage'));
const TestimonialsPage = React.lazy(() => import('./views/Admin/TestimonialsPage'));
const AdminDashboard =React.lazy(() => import('./views/Admin/AdminDashboard'));
const CategoriesManagement =React.lazy(() => import('./views/Admin/CategoriesManagement'));

const UserRegistaration = React.lazy(() => import('./views/Admin/UserRegistaration'))

const GalleryCategoriesPage =React.lazy(() => import('./views/Admin/GalleryCategoriesPage'));
// // vicitor
// const CheckInOutPage = React.lazy(() => import('./views/visitor/CheckInOutPage'))
// const DonationHistoryPage = React.lazy(() => import('./views/visitor/DonationHistoryPage'))
// const ProductPage1 = React.lazy(() => import('./views/visitor/ProductPage'))
// const AdoptedAnimalHealth = React.lazy(() => import('./views/visitor/AdoptedAnimalHealth'))
// const DoctorCheckupHistory = React.lazy(() => import('./views/visitor/DoctorCheckupHistory'))
// const EventRequestForm = React.lazy(() => import('./views/visitor/EventRequestForm'))
// const Events = React.lazy(() => import('./views/visitor/Events'))
// const Alert = React.lazy(() => import('./views/visitor/Alert'))
// const ChatApp = React.lazy(() => import('./views/visitor/ChatApp'))
// const Appointments = React.lazy(() => import('./views/Doctor/Appointments'))
// const Notification1 = React.lazy(() => import('./views/Doctor/Notification'))

// Buttons
// const Appointments = React.lazy(() => import('./views/Doctor/Appointments'))
// const Products = React.lazy(() => import('./views/Doctor/Products'))
// const DoctorCheckInOut = React.lazy(() => import('./views/Doctor/DoctorCheckInOut'))
// const EventR = React.lazy(() => import('./views/Doctor/EventR'))
// const Event = React.lazy(() => import('./views/Doctor/Event'))
// const PaymentTable = React.lazy(() => import('./views/Doctor/PaymentTable'))
// const ChatApp1 = React.lazy(() => import('./views/Doctor/ChatApp1'))

//Forms

// const DatePicker = React.lazy(() => import('./views/forms/date-picker/DatePicker'))
// const DateRangePicker = React.lazy(() => import('./views/forms/date-range-picker/DateRangePicker'))
// const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
// const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
// const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
// const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
// const MultiSelect = React.lazy(() => import('./views/forms/multi-select/MultiSelect'))
// const Range = React.lazy(() => import('./views/forms/range/Range'))
// const Select = React.lazy(() => import('./views/forms/select/Select'))
// const TimePicker = React.lazy(() => import('./views/forms/time-picker/TimePicker'))
// const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

// Icons
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
// const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// const SmartTable = React.lazy(() => import('./views/smart-table/SmartTable'))

// Plugins
// const Calendar = React.lazy(() => import('./views/plugins/calendar/Calendar'))
// const Charts = React.lazy(() => import('./views/plugins/charts/Charts'))
// const GoogleMaps = React.lazy(() => import('./views/plugins/google-maps/GoogleMaps'))

// const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

// const Invoice = React.lazy(() => import('./views/apps/invoicing/Invoice'))

const routes = [
  { path: '/', exact: true, name: <Translation>{(t) => t('home')}</Translation> },
  {
    path: '/dashboard',
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    element: Dashboard,
  },
  // {
  //   path: '/Admin',
  //   name: <Translation>{(t) => t('theme')}</Translation>,
  //   element: Colors,
  //   exact: true,
  // },
  { path: '/Admin/MenuManagement', name: <Translation>{(t) => t('MenuManagement')}</Translation>, element: MenuManagement },
  { path: '/Admin/VisitorTestimonialsPage', name: <Translation>{(t) => t('VisitorTestimonialsPage')}</Translation>, element: VisitorTestimonialsPage },
  { path: '/Admin/JobApplicationFollowUp', name: <Translation>{(t) => t('JobApplicationFollowUp')}</Translation>, element: JobApplicationFollowUp },
  { path: '/Admin/FranchiseRequests', name: <Translation>{(t) => t('FranchiseRequests')}</Translation>, element: FranchiseRequests },
  { path: '/Admin/Branches', name: <Translation>{(t) => t('Branches')}</Translation>, element: Branches },
  { path: '/Admin/GalleryCategoriesPage', name: <Translation>{(t) => t('GalleryCategoriesPage')}</Translation>, element: GalleryCategoriesPage },
  { path: '/Admin/ImagesPage', name: <Translation>{(t) => t('ImagesPage')}</Translation>, element: ImagesPage },
  { path: '/Admin/TestimonialsPage', name: <Translation>{(t) => t('TestimonialsPage')}</Translation>, element: TestimonialsPage },
  { path: '/Admin/OnlineOrderLinks', name: <Translation>{(t) => t('OnlineOrderLinks')}</Translation>, element: OnlineOrderLinks },
  { path: '/Admin/JobPositions', name: <Translation>{(t) => t('JobPositions')}</Translation>, element: JobPositions },
  { path: '/Admin/AdminDashboard', name: <Translation>{(t) => t('AdminDashboard')}</Translation>, element: AdminDashboard },
   {  path: '/Admin/UserRegistaration', name: <Translation>{(t) => t('UserRegistaration')}</Translation>, element: UserRegistaration },
  {  path: '/Admin/CategoriesManagement', name: <Translation>{(t) => t('CategoriesManagement')}</Translation>, element: CategoriesManagement },
  // {
  //   path: '/visitor',
  //   name: <Translation>{(t) => t('theme')}</Translation>,
  //   element: Colors,
  //   exact: true,
  // },
  
  
  // {
  //   path: '/forms',
  //   name: <Translation>{(t) => t('forms')}</Translation>,
  //   element: FormControl,
  //   exact: true,
  // },
  
  // { path: '/forms/select', name: 'Select', element: Select },
  // { path: '/forms/multi-select', name: 'Multi Select', element: MultiSelect },
  // // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  // { path: '/forms/range', name: 'Range', element: Range },
  // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  // { path: '/forms/date-picker', name: 'Date Picker', element: DatePicker },
  // { path: '/forms/date-range-picker', name: 'Date Range Picker', element: DateRangePicker },
  // { path: '/forms/time-picker', name: 'Time Picker', element: TimePicker },
  // { path: '/forms/layout', name: 'Layout', element: Layout },
  // { path: '/forms/validation', name: 'Validation', element: Validation },
  // {
  //   path: '/icons',
  //   exact: true,
  //   name: <Translation>{(t) => t('icons')}</Translation>,
  //   element: CoreUIIcons,
  // },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', element: Flags },
  // { path: '/icons/brands', name: 'Brands', element: Brands },
  // {
  //   path: '/notifications',
  //   name: <Translation>{(t) => t('notifications')}</Translation>,
  //   element: Alerts,
  //   exact: true,
  // },
  // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  // { path: '/notifications/badges', name: 'Badges', element: Badges },
  // { path: '/notifications/modals', name: 'Modals', element: Modals },
  // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // {
  //   path: '/plugins',
  //   name: <Translation>{(t) => t('plugins')}</Translation>,
  //   element: Calendar,
  //   exact: true,
  // },
  // {
  //   path: '/plugins/calendar',
  //   name: <Translation>{(t) => t('calendar')}</Translation>,
  //   element: Calendar,
  // },
  // {
  //   path: '/plugins/charts',
  //   name: <Translation>{(t) => t('charts')}</Translation>,
  //   element: Charts,
  // },
  // { path: '/plugins/google-maps', name: 'GoogleMaps', element: GoogleMaps },
  // { path: '/smart-table', name: 'Smart Table', element: SmartTable },
  // { path: '/widgets', name: <Translation>{(t) => t('widgets')}</Translation>, element: Widgets },
  // {
  //   path: '/apps',
  //   name: <Translation>{(t) => t('apps')}</Translation>,
  //   element: Invoice,
  //   exact: true,
  // },
  // { path: '/apps/invoicing', name: 'Invoice', element: Invoice, exact: true },
  // { path: '/apps/invoicing/invoice', name: 'Invoice', element: Invoice },
  // { path: '/apps/email', name: 'Email', exact: true },
  // { path: '/apps/email/inbox', name: 'Inbox', exact: true },
  // { path: '/apps/email/compose', name: 'Compose', exact: true },
  // { path: '/apps/email/message', name: 'Message', exact: true },
]

export default routes
