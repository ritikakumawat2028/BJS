import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{E as r,d as i,s as a,x as o}from"./index-BxgBeFpD.js";var s=e(t(),1),c=n(),l=()=>{let{cart:e,removeItem:t,updateItem:n,applyCoupon:l,removeCoupon:u,isLoading:d}=a(),[f,p]=(0,s.useState)(``),[m,h]=(0,s.useState)(!1),g=r(),_=e=>`₹${e.toLocaleString(`en-IN`)}`;return!e||e.items.length===0?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{children:(0,c.jsx)(`title`,{children:`Your Cart - BJ'S Natural Care`})}),(0,c.jsx)(`div`,{style:{paddingTop:`calc(var(--nav-height) + 40px)`,paddingBottom:`80px`,minHeight:`60vh`},children:(0,c.jsx)(`div`,{className:`container`,children:(0,c.jsxs)(`div`,{className:`empty-state`,children:[(0,c.jsx)(`div`,{className:`empty-state__icon`,children:`🛒`}),(0,c.jsx)(`h1`,{className:`empty-state__title`,children:`Your cart is empty`}),(0,c.jsx)(`p`,{className:`empty-state__text`,children:`Looks like you haven't added any luxury items to your cart yet.`}),(0,c.jsx)(o,{to:`/shop`,className:`btn btn-primary`,children:`Start Shopping`})]})})})]}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{children:(0,c.jsx)(`title`,{children:`Your Cart (${e.items.length}) - BJ'S Natural Care`})}),(0,c.jsx)(`div`,{style:{paddingTop:`calc(var(--nav-height) + 40px)`,paddingBottom:`80px`,minHeight:`80vh`},children:(0,c.jsxs)(`div`,{className:`container`,children:[(0,c.jsx)(`h1`,{className:`section-title`,style:{fontFamily:`var(--font-serif)`,fontSize:`2rem`,marginBottom:`8px`,color:`var(--color-ivory)`},children:`Shopping Cart`}),(0,c.jsxs)(`p`,{style:{color:`var(--color-text-muted)`,marginBottom:`32px`},children:[e.items.length,` items in your cart`]}),(0,c.jsxs)(`div`,{className:`cart-page-grid`,children:[(0,c.jsxs)(`div`,{className:`cart-page-items`,children:[(0,c.jsx)(`div`,{className:`cart-cards-container`,children:e.items.map(e=>{let r=e.variant?.price??e.product.price,i=e.variant?.image||e.product.images?.[0]?.url;return(0,c.jsxs)(`div`,{className:`cart-card`,children:[(0,c.jsx)(o,{to:`/products/${e.product.slug}`,className:`cart-card__img-link`,children:(0,c.jsx)(`img`,{src:i,alt:e.product.name,className:`cart-card__img`})}),(0,c.jsxs)(`div`,{className:`cart-card__info`,children:[(0,c.jsxs)(`div`,{className:`cart-card__top`,children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(o,{to:`/products/${e.product.slug}`,className:`cart-card__title`,children:e.product.name}),e.variant&&(0,c.jsx)(`div`,{className:`cart-card__variant`,children:e.variant.name})]}),(0,c.jsx)(`button`,{className:`cart-card__remove`,onClick:()=>t(e.id),disabled:d,"aria-label":`Remove item`,children:(0,c.jsxs)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,c.jsx)(`polyline`,{points:`3 6 5 6 21 6`}),(0,c.jsx)(`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`})]})})]}),(0,c.jsxs)(`div`,{className:`cart-card__bottom`,children:[(0,c.jsxs)(`div`,{className:`qty-selector`,children:[(0,c.jsx)(`button`,{className:`qty-btn`,onClick:()=>n(e.id,e.quantity-1),disabled:d||e.quantity<=1,children:`-`}),(0,c.jsx)(`span`,{className:`qty-value`,children:e.quantity}),(0,c.jsx)(`button`,{className:`qty-btn`,onClick:()=>n(e.id,e.quantity+1),disabled:d,children:`+`})]}),(0,c.jsx)(`div`,{className:`cart-card__price`,children:_(Number(r)*e.quantity)})]})]})]},e.id)})}),(0,c.jsxs)(`div`,{className:`cart-actions-row`,children:[(0,c.jsx)(o,{to:`/shop`,className:`cart-action-link`,children:`← Continue Shopping`}),(0,c.jsx)(`button`,{className:`cart-action-link`,onClick:()=>{},style:{border:`none`,background:`transparent`},children:`Clear Cart`})]})]}),(0,c.jsx)(`div`,{className:`cart-page-summary`,children:(0,c.jsxs)(`div`,{className:`cart-summary-card`,children:[(0,c.jsx)(`h2`,{style:{fontFamily:`var(--font-serif)`,fontSize:`1.4rem`,marginBottom:`24px`,color:`var(--color-ivory)`,fontWeight:500},children:`Order Summary`}),(0,c.jsxs)(`div`,{className:`summary-row`,children:[(0,c.jsx)(`span`,{children:`Subtotal`}),(0,c.jsx)(`span`,{children:_(e.subtotal)})]}),(0,c.jsxs)(`div`,{className:`summary-row`,children:[(0,c.jsx)(`span`,{children:`Tax (18% GST)`}),(0,c.jsx)(`span`,{children:_(e.tax)})]}),(0,c.jsxs)(`div`,{className:`summary-row`,children:[(0,c.jsx)(`span`,{children:`Shipping`}),(0,c.jsx)(`span`,{children:e.shipping===0?(0,c.jsx)(`span`,{style:{color:`var(--color-success)`},children:`Free`}):_(e.shipping)})]}),e.coupon?(0,c.jsxs)(`div`,{className:`summary-row`,style:{color:`var(--color-success)`},children:[(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,c.jsxs)(`span`,{children:[`Discount (`,e.coupon.code,`)`]}),(0,c.jsx)(`button`,{onClick:u,style:{fontSize:`0.7rem`,color:`var(--color-error)`},children:`Remove`})]}),(0,c.jsxs)(`span`,{children:[`-`,_(e.discount)]})]}):(0,c.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),f.trim()){h(!0);try{await l(f),p(``)}finally{h(!1)}}},style:{display:`flex`,gap:`8px`,margin:`16px 0`},children:[(0,c.jsx)(`input`,{type:`text`,className:`form-input`,placeholder:`Coupon code`,value:f,onChange:e=>p(e.target.value.toUpperCase()),style:{padding:`8px 12px`,fontSize:`0.875rem`}}),(0,c.jsx)(`button`,{type:`submit`,className:`btn btn-outline-gold btn-sm`,disabled:m,children:m?`...`:`Apply`})]}),(0,c.jsx)(`div`,{className:`divider`,style:{margin:`20px 0`,borderColor:`rgba(255,255,255,0.2)`}}),(0,c.jsxs)(`div`,{className:`summary-row summary-total`,children:[(0,c.jsx)(`span`,{style:{fontSize:`1.1rem`,fontWeight:600},children:`Grand Total`}),(0,c.jsx)(`span`,{style:{fontSize:`1.3rem`,fontWeight:700},children:_(e.total)})]}),e.shipping>0&&(0,c.jsxs)(`p`,{style:{fontSize:`0.8rem`,color:`var(--color-gold)`,textAlign:`center`,margin:`16px 0`},children:[`Add `,_(999-e.subtotal),` more to your cart for free shipping!`]}),(0,c.jsx)(`button`,{className:`btn btn-primary btn-full btn-lg`,onClick:()=>g(`/checkout`),style:{marginTop:`24px`,fontWeight:600,borderRadius:`4px`},children:`Proceed to Checkout`}),(0,c.jsxs)(`div`,{style:{textAlign:`center`,marginTop:`16px`,fontSize:`0.8rem`,color:`var(--color-text-muted)`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`6px`},children:[(0,c.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,c.jsx)(`rect`,{x:`3`,y:`11`,width:`18`,height:`11`,rx:`2`,ry:`2`}),(0,c.jsx)(`path`,{d:`M7 11V7a5 5 0 0 1 10 0v4`})]}),`Secure Checkout`]})]})})]})]})}),(0,c.jsx)(`style`,{children:`
        .cart-page-grid { display: grid; grid-template-columns: 1fr 400px; gap: 64px; }
        .cart-page-items { display: flex; flex-direction: column; gap: 24px; }
        .cart-cards-container { display: flex; flex-direction: column; gap: 16px; }
        
        .cart-card {
          display: flex;
          gap: 20px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          background: transparent;
        }
        .cart-card__img-link { flex-shrink: 0; }
        .cart-card__img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 6px;
          background: #111;
        }
        .cart-card__info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .cart-card__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .cart-card__title {
          font-family: 'Inter', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--color-gold);
          text-decoration: none;
          display: block;
          margin-bottom: 4px;
        }
        .cart-card__variant {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .cart-card__remove {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }
        .cart-card__remove:hover { color: var(--color-error); }
        
        .cart-card__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .qty-selector {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }
        .qty-btn {
          background: transparent;
          border: none;
          color: var(--color-ivory);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .qty-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
        .qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .qty-value {
          width: 32px;
          text-align: center;
          font-size: 0.9rem;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-card__price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-ivory);
        }
        
        .cart-actions-row {
          display: flex;
          justify-content: space-between;
          padding: 0 4px;
        }
        .cart-action-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
          cursor: pointer;
        }
        .cart-action-link:hover {
          color: var(--color-gold);
        }

        .cart-summary-card { 
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px; 
          padding: 24px; 
          position: sticky; 
          top: calc(var(--nav-height) + 24px); 
        }
        .summary-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          font-size: 0.9rem; 
          color: var(--color-text-muted); 
          margin-bottom: 12px; 
        }
        .summary-row span:last-child {
          color: var(--color-ivory);
        }
        .summary-total { 
          color: var(--color-ivory); 
          margin-bottom: 0; 
          align-items: center;
        }
        .summary-total span:last-child {
          color: var(--color-ivory);
        }
        @media (max-width: 1024px) { 
          .cart-page-grid { grid-template-columns: 1fr; } 
          .cart-summary-card { position: static; } 
        }
        @media (max-width: 768px) {
          .cart-page-grid { gap: 32px; }
        }
        @media (max-width: 480px) {
          .cart-card { flex-direction: column; padding: 12px; }
          .cart-card__img { width: 100%; height: auto; aspect-ratio: 1; }
          .cart-card__bottom { margin-top: 16px; }
          .summary-row { font-size: 0.85rem; }
        }
      `})]})};export{l as default};