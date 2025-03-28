// import React from 'react'
// import { NavLink } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'

// import {
//   CCloseButton,
//   CSidebar,
//   CSidebarBrand,
//   CSidebarHeader,
//   CSidebarToggler,
// } from '@coreui/react-pro'
// import CIcon from '@coreui/icons-react'

// import { AppSidebarNav } from './AppSidebarNav'
// import navigation from '../_visitornav'

// const VisitorSidebar = () => {
//   const dispatch = useDispatch()
//   const unfoldable = useSelector((state) => state.sidebarUnfoldable)
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   return (
//     <CSidebar
//       colorScheme="light"
//       position="fixed"
//       unfoldable={unfoldable}
//       visible={sidebarShow}
//       onVisibleChange={(visible) => {
//         dispatch({ type: 'set', sidebarShow: visible })
//       }}
//     >
//       <CSidebarHeader className="bg-primary border-bottom">
//         <CSidebarBrand as={NavLink} to="/">
//           <span className="sidebar-brand-full" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
//             Goshala
//           </span>
//           <span className="sidebar-brand-narrow" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
//             G
//           </span>
//         </CSidebarBrand>
//         <CCloseButton
//           className="d-lg-none"
//           dark
//           onClick={() => dispatch({ type: 'set', sidebarShow: false })}
//         />
//         <CSidebarToggler
//           onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
//         />
//       </CSidebarHeader>
//       <AppSidebarNav items={navigation} />
//     </CSidebar>
//   )
// }

// export default React.memo(VisitorSidebar)
