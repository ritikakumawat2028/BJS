import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{E as r,S as i,l as a,o,u as s,w as c,x as l}from"./index-CCD-mkdr.js";var u=e(t(),1),d=n(),f=[{items:[{label:`Dashboard`,to:`/admin`,icon:`◉`,end:!0}]},{label:`Catalog`,icon:`▦`,isCollapsible:!0,items:[{label:`Products`,to:`/admin/products`,icon:`◈`},{label:`Categories`,to:`/admin/categories`,icon:`▤`},{label:`Inventory`,to:`/admin/inventory`,icon:`⊟`}]},{label:`Orders`,icon:`◎`,isCollapsible:!0,items:[{label:`All Orders`,to:`/admin/orders`,end:!0},{label:`Pending`,to:`/admin/orders?status=PENDING`},{label:`Processing`,to:`/admin/orders?status=PROCESSING`},{label:`Shipped`,to:`/admin/orders?status=SHIPPED`},{label:`Delivered`,to:`/admin/orders?status=DELIVERED`},{label:`Returns`,to:`/admin/orders?status=RETURN_REQUESTED`},{label:`Refunds`,to:`/admin/orders?status=REFUNDED`}]},{items:[{label:`Customers`,to:`/admin/customers`,icon:`◐`},{label:`Payments`,to:`/admin/payments`,icon:`₹`}]},{label:`Marketing`,icon:`✦`,isCollapsible:!0,items:[{label:`Banners`,to:`/admin/banners`},{label:`Campaigns`,to:`/admin/campaigns`},{label:`Coupons`,to:`/admin/coupons`},{label:`Promotions`,to:`/admin/promotions`}]},{items:[{label:`Reviews`,to:`/admin/reviews`,icon:`★`},{label:`Analytics`,to:`/admin/analytics`,icon:`📈`}]},{items:[{label:`Settings`,to:`/admin/settings`,icon:`⚙`},{label:`Admin Activity Logs`,to:`/admin/audit-logs`,icon:`≡`}]}],p=({group:e,setSidebarOpen:t})=>{let[n,r]=(0,u.useState)(!1);return e.label?(0,d.jsxs)(`div`,{className:`admin-nav-group`,style:{marginBottom:`8px`},children:[(0,d.jsxs)(`button`,{className:`admin-nav-item`,onClick:()=>r(!n),style:{width:`100%`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,background:`none`,border:`none`,cursor:`pointer`,outline:`none`},children:[(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[e.icon&&(0,d.jsx)(`span`,{className:`admin-nav-icon`,children:e.icon}),(0,d.jsx)(`span`,{className:`admin-nav-label`,style:{fontWeight:600},children:e.label})]}),(0,d.jsx)(`span`,{style:{fontSize:`0.7rem`,opacity:.5,transition:`transform 0.2s`,transform:n?`rotate(180deg)`:`rotate(0deg)`},children:`▼`})]}),(0,d.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`2px`,overflow:`hidden`,maxHeight:n?`500px`:`0px`,transition:`max-height 0.3s ease-in-out`},children:(0,d.jsx)(`div`,{style:{paddingLeft:`36px`,paddingTop:`4px`,paddingBottom:`4px`,display:`flex`,flexDirection:`column`,gap:`2px`},children:e.items.map(e=>(0,d.jsxs)(i,{to:e.to,end:e.end,className:({isActive:e})=>`admin-nav-item sub-item ${e?`active`:``}`,onClick:()=>t(!1),style:{padding:`6px 12px`,fontSize:`0.85rem`,minHeight:`auto`,borderRadius:`6px`},children:[e.icon&&(0,d.jsx)(`span`,{className:`admin-nav-icon`,style:{fontSize:`0.9rem`,marginRight:`8px`},children:e.icon}),(0,d.jsx)(`span`,{className:`admin-nav-label`,children:e.label})]},e.to))})})]}):(0,d.jsx)(`div`,{className:`admin-nav-group`,style:{marginBottom:`8px`},children:e.items.map(e=>(0,d.jsxs)(i,{to:e.to,end:e.end,className:({isActive:e})=>`admin-nav-item ${e?`active`:``}`,onClick:()=>t(!1),children:[e.icon&&(0,d.jsx)(`span`,{className:`admin-nav-icon`,children:e.icon}),(0,d.jsx)(`span`,{className:`admin-nav-label`,children:e.label})]},e.to))})},m=()=>{let[e,t]=(0,u.useState)(!1),{user:n,logout:i}=a(),m=r();return(0,d.jsxs)(`div`,{className:`admin-layout`,children:[e&&(0,d.jsx)(`div`,{className:`admin-sidebar-overlay`,onClick:()=>t(!1)}),(0,d.jsxs)(`aside`,{className:`admin-sidebar ${e?`open`:``}`,children:[(0,d.jsxs)(`div`,{className:`admin-sidebar__logo`,children:[(0,d.jsxs)(l,{to:`/`,children:[(0,d.jsx)(`span`,{style:{fontFamily:`var(--font-serif)`,fontSize:`0.9rem`,letterSpacing:`0.2em`,color:`var(--color-gold)`},children:`BJ'S`}),(0,d.jsx)(`span`,{style:{fontSize:`0.55rem`,letterSpacing:`0.2em`,color:`var(--color-text-muted)`,display:`block`,marginTop:`2px`},children:`ADMIN PANEL`})]}),(0,d.jsx)(`button`,{className:`admin-sidebar__close`,onClick:()=>t(!1),style:{color:`var(--color-text-muted)`},children:`✕`})]}),(0,d.jsx)(`nav`,{className:`admin-sidebar__nav`,style:{padding:`16px`,overflowY:`auto`,flex:1},children:f.map((e,n)=>(0,d.jsx)(p,{group:e,setSidebarOpen:t},n))}),(0,d.jsxs)(`div`,{className:`admin-sidebar__footer`,children:[(0,d.jsxs)(`div`,{className:`admin-user`,children:[(0,d.jsxs)(`div`,{className:`admin-user__avatar`,children:[n?.firstName?.[0],n?.lastName?.[0]]}),(0,d.jsxs)(`div`,{children:[(0,d.jsxs)(`p`,{style:{fontSize:`0.875rem`,color:`var(--color-ivory)`,fontWeight:500},children:[n?.firstName,` `,n?.lastName]}),(0,d.jsx)(`p`,{style:{fontSize:`0.75rem`,color:`var(--color-gold)`,textTransform:`uppercase`,letterSpacing:`0.1em`},children:typeof n?.role==`string`?n.role:n?.role?.name})]})]}),(0,d.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,marginTop:`12px`},children:[(0,d.jsx)(l,{to:`/`,className:`btn btn-outline btn-sm`,style:{flex:1,textAlign:`center`},children:`← Store`}),(0,d.jsx)(`button`,{className:`btn btn-outline btn-sm`,style:{flex:1},onClick:async()=>{await i(),s.success(`Logged out`),m(`/login`)},children:`Sign Out`})]})]})]}),(0,d.jsxs)(`div`,{className:`admin-content`,children:[(0,d.jsxs)(`header`,{className:`admin-topbar`,children:[(0,d.jsx)(`button`,{className:`admin-hamburger`,onClick:()=>t(!e),style:{color:`var(--color-text-muted)`,background:`none`,border:`none`,cursor:`pointer`},children:(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,d.jsx)(`line`,{x1:`3`,y1:`12`,x2:`21`,y2:`12`}),(0,d.jsx)(`line`,{x1:`3`,y1:`18`,x2:`21`,y2:`18`})]})}),(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`16px`,marginLeft:`auto`},children:[(0,d.jsx)(l,{to:`/shop`,style:{fontSize:`0.8rem`,color:`var(--color-text-muted)`,letterSpacing:`0.1em`},target:`_blank`,children:`View Store ↗`}),(0,d.jsx)(`div`,{style:{width:`1px`,height:`20px`,background:`var(--color-border)`}}),(0,d.jsx)(o,{}),(0,d.jsx)(`span`,{style:{fontSize:`0.875rem`,color:`var(--color-text-secondary)`},children:n?.firstName})]})]}),(0,d.jsx)(`div`,{style:{padding:`24px`},children:(0,d.jsx)(c,{})})]}),(0,d.jsx)(`style`,{children:`
        .admin-sidebar__logo {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        .admin-sidebar__close { display: none; }
        .admin-sidebar__nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
          display: flex; flex-direction: column; gap: 2px;
        }
        .admin-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .admin-nav-item:hover { color: var(--color-ivory); background: var(--color-surface); }
        .admin-nav-item.active { color: var(--color-gold); background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.2); }
        .admin-nav-icon { width: 18px; text-align: center; flex-shrink: 0; font-size: 0.9rem; }
        .admin-nav-label { font-size: 0.875rem; letter-spacing: 0.03em; }
        .admin-sidebar__footer {
          padding: 16px 12px;
          border-top: 1px solid var(--color-border);
        }
        .admin-user { display: flex; align-items: center; gap: 12px; }
        .admin-user__avatar {
          width: 36px; height: 36px;
          background: rgba(201,162,39,0.15);
          border: 1px solid var(--color-border-gold);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 600; color: var(--color-gold);
          flex-shrink: 0;
        }
        .admin-sidebar-overlay { display: none; }
        .admin-hamburger { display: none; }
        @media (max-width: 768px) {
          .admin-sidebar { position: fixed; top: 0; left: 0; height: 100%; z-index: var(--z-modal); transform: translateX(-100%); transition: transform var(--transition-base); box-shadow: 10px 0 30px rgba(0,0,0,0.5); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: calc(var(--z-modal) - 1); backdrop-filter: blur(4px); }
          .admin-sidebar__close { display: flex; background: none; border: none; cursor: pointer; font-size: 1.2rem; }
          .admin-content { margin-left: 0; }
          .admin-hamburger { display: flex !important; }
        }
      `})]})};export{m as default};