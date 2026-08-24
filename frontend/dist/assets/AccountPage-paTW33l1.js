import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{r}from"./api-B_NpKJmv.js";import{E as i,d as a,l as o,s,u as c,x as l}from"./index-CytT0jWM.js";var u=e(t(),1),d=n(),f=()=>{let{user:e,logout:t,updateUser:n}=o(),f=s(e=>e.itemCount()),p=i(),[m,h]=(0,u.useState)(!1),[g,_]=(0,u.useState)(!1),[v,y]=(0,u.useState)({firstName:e?.firstName||``,lastName:e?.lastName||``,phone:e?.phone||``});return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{children:(0,d.jsx)(`title`,{children:`My Account - BJ'S Natural Care`})}),(0,d.jsx)(`div`,{style:{paddingTop:`calc(var(--nav-height) + 40px)`,paddingBottom:`80px`,minHeight:`80vh`},children:(0,d.jsxs)(`div`,{className:`container`,style:{maxWidth:`1200px`},children:[(0,d.jsxs)(`div`,{className:`account-header-box`,children:[(0,d.jsxs)(`div`,{className:`account-user-info`,children:[(0,d.jsx)(`div`,{className:`account-avatar`,children:e?.firstName?.[0]?.toUpperCase()||`U`}),(0,d.jsxs)(`div`,{children:[(0,d.jsxs)(`h1`,{className:`account-name`,children:[`Hello, `,e?.firstName,` `,e?.lastName]}),(0,d.jsx)(`p`,{className:`account-email`,children:e?.email}),(0,d.jsx)(`button`,{className:`btn-edit-profile`,onClick:()=>h(!0),children:`Edit Profile`})]})]}),(0,d.jsxs)(`button`,{className:`btn-sign-out`,onClick:async()=>{await t(),p(`/`)},children:[(0,d.jsxs)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`}),(0,d.jsx)(`polyline`,{points:`16 17 21 12 16 7`}),(0,d.jsx)(`line`,{x1:`21`,y1:`12`,x2:`9`,y2:`12`})]}),`Sign Out`]})]}),(0,d.jsxs)(`div`,{className:`account-grid`,children:[(e?.role===`ADMIN`||e?.role?.name===`ADMIN`)&&(0,d.jsxs)(l,{to:`/admin`,className:`account-card`,style:{borderColor:`var(--color-gold)`},children:[(0,d.jsx)(`div`,{className:`account-card-icon`,style:{color:`var(--color-gold)`},children:(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`rect`,{x:`3`,y:`3`,width:`18`,height:`18`,rx:`2`,ry:`2`}),(0,d.jsx)(`line`,{x1:`3`,y1:`9`,x2:`21`,y2:`9`}),(0,d.jsx)(`line`,{x1:`9`,y1:`21`,x2:`9`,y2:`9`})]})}),(0,d.jsx)(`h3`,{className:`account-card-title`,children:`Admin Dashboard`}),(0,d.jsx)(`p`,{className:`account-card-desc`,children:`Manage store, products & orders`})]}),(0,d.jsxs)(l,{to:`/account/orders`,className:`account-card`,children:[(0,d.jsx)(`div`,{className:`account-card-icon`,children:(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`path`,{d:`M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z`}),(0,d.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,d.jsx)(`path`,{d:`M16 10a4 4 0 0 1-8 0`})]})}),(0,d.jsx)(`h3`,{className:`account-card-title`,children:`My Orders`}),(0,d.jsx)(`p`,{className:`account-card-desc`,children:`View and track your orders`})]}),(0,d.jsxs)(l,{to:`/wishlist`,className:`account-card`,children:[(0,d.jsx)(`div`,{className:`account-card-icon`,children:(0,d.jsx)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:(0,d.jsx)(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})})}),(0,d.jsx)(`h3`,{className:`account-card-title`,children:`Wishlist`}),(0,d.jsx)(`p`,{className:`account-card-desc`,children:`Products you've saved`})]}),(0,d.jsxs)(l,{to:`/account/addresses`,className:`account-card`,children:[(0,d.jsx)(`div`,{className:`account-card-icon`,children:(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`path`,{d:`M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z`}),(0,d.jsx)(`circle`,{cx:`12`,cy:`10`,r:`3`})]})}),(0,d.jsx)(`h3`,{className:`account-card-title`,children:`Addresses`}),(0,d.jsx)(`p`,{className:`account-card-desc`,children:`Manage shipping addresses`})]}),(0,d.jsxs)(l,{to:`/cart`,className:`account-card account-card--cart`,children:[(0,d.jsx)(`div`,{className:`account-card-icon`,children:(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`circle`,{cx:`9`,cy:`21`,r:`1`}),(0,d.jsx)(`circle`,{cx:`20`,cy:`21`,r:`1`}),(0,d.jsx)(`path`,{d:`M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6`})]})}),(0,d.jsx)(`h3`,{className:`account-card-title`,children:`Shopping Cart`}),(0,d.jsxs)(`p`,{className:`account-card-desc`,children:[f,` items in your cart`]}),f>0&&(0,d.jsx)(`span`,{className:`account-cart-badge`,children:f})]})]})]})}),m&&(0,d.jsx)(`div`,{className:`modal-overlay`,onClick:()=>h(!1),children:(0,d.jsxs)(`div`,{className:`modal`,onClick:e=>e.stopPropagation(),children:[(0,d.jsx)(`button`,{className:`modal-close`,onClick:()=>h(!1),children:`✕`}),(0,d.jsx)(`h2`,{style:{fontFamily:`var(--font-serif)`,fontSize:`1.5rem`,marginBottom:`24px`,color:`var(--color-ivory)`},children:`Edit Profile`}),(0,d.jsxs)(`form`,{onSubmit:async e=>{e.preventDefault(),_(!0);try{await r.updateMe(v),n(v),c.success(`Profile updated successfully`),h(!1)}catch{c.error(`Failed to update profile`)}finally{_(!1)}},children:[(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`First Name`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,required:!0,value:v.firstName,onChange:e=>y({...v,firstName:e.target.value})})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Last Name`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,required:!0,value:v.lastName,onChange:e=>y({...v,lastName:e.target.value})})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Phone Number`}),(0,d.jsx)(`input`,{type:`tel`,className:`form-input`,value:v.phone,onChange:e=>y({...v,phone:e.target.value}),placeholder:`Optional`})]}),(0,d.jsxs)(`div`,{style:{marginTop:`32px`,display:`flex`,gap:`16px`},children:[(0,d.jsx)(`button`,{type:`button`,className:`btn btn-outline`,style:{flex:1},onClick:()=>h(!1),children:`Cancel`}),(0,d.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,style:{flex:1},disabled:g,children:g?`Saving...`:`Save Changes`})]})]})]})}),(0,d.jsx)(`style`,{children:`
        .account-header-box {
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 8px;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .account-user-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .account-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          color: var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
        }
        .account-name {
          font-family: var(--font-serif);
          font-size: 1.7rem;
          color: var(--color-ivory);
          margin-bottom: 4px;
        }
        .account-email {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .btn-edit-profile {
          color: var(--color-gold);
          font-size: 0.85rem;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .btn-edit-profile:hover {
          color: var(--color-soft-gold);
        }
        .btn-sign-out {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .btn-sign-out:hover {
          color: var(--color-error);
        }
        .account-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .account-card {
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 8px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.3s ease;
          background: transparent;
          text-decoration: none;
          position: relative;
        }
        .account-card:hover {
          border-color: var(--color-gold);
          transform: translateY(-4px);
        }
        .account-card-icon {
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }
        .account-card-title {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--color-gold);
          margin-bottom: 8px;
        }
        .account-card-desc {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .account-cart-badge {
          position: absolute;
          bottom: 24px;
          right: 24px;
          background-color: var(--color-gold);
          color: var(--color-black);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }
        @media (max-width: 1024px) {
          .account-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .account-header-box {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
          .account-grid {
            grid-template-columns: 1fr;
          }
        }
      `})]})};export{f as default};