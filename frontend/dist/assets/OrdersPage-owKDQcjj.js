import"./rolldown-runtime-hePW80VL.js";import{n as e,t}from"./jsx-runtime-DE3RlOCf.js";import{c as n}from"./api-B_NpKJmv.js";import{d as r,f as i,x as a}from"./index-CytT0jWM.js";e();var o=t(),s=()=>{let{data:e,isLoading:t}=i({queryKey:[`my-orders`],queryFn:()=>n.getAll()}),s=e?.data?.data||[];return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r,{children:(0,o.jsx)(`title`,{children:`My Orders - BJ'S Natural Care`})}),(0,o.jsx)(`div`,{style:{paddingTop:`calc(var(--nav-height) + 40px)`,paddingBottom:`80px`,minHeight:`80vh`},children:(0,o.jsxs)(`div`,{className:`container`,style:{maxWidth:`1200px`},children:[(0,o.jsxs)(`div`,{style:{marginBottom:`32px`,display:`flex`,alignItems:`center`,gap:`16px`},children:[(0,o.jsx)(a,{to:`/account`,style:{color:`var(--color-text-muted)`,textDecoration:`none`,fontSize:`1.2rem`,transition:`color 0.2s`},children:`←`}),(0,o.jsx)(`h1`,{className:`section-title`,style:{marginBottom:0,fontSize:`2rem`},children:`My Orders`})]}),t?(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[1,2,3].map(e=>(0,o.jsx)(`div`,{className:`skeleton`,style:{height:`80px`,borderRadius:`8px`}},e))}):s.length===0?(0,o.jsxs)(`div`,{className:`empty-state`,children:[(0,o.jsx)(`div`,{className:`empty-state__icon`,children:`📦`}),(0,o.jsx)(`h2`,{className:`empty-state__title`,children:`No orders yet`}),(0,o.jsx)(`p`,{className:`empty-state__text`,children:`You haven't placed any orders yet.`}),(0,o.jsx)(a,{to:`/shop`,className:`btn btn-outline-gold`,children:`Start Shopping`})]}):(0,o.jsx)(`div`,{className:`orders-list`,children:s.map(e=>(0,o.jsxs)(a,{to:`/account/orders/${e.id}`,className:`order-row-card`,children:[(0,o.jsxs)(`div`,{className:`order-row-left`,children:[(0,o.jsxs)(`div`,{className:`order-row-header`,children:[(0,o.jsx)(`span`,{className:`order-id`,children:e.orderNumber}),(0,o.jsx)(`span`,{className:`status-badge status-${e.status.toLowerCase()}`,children:e.status}),(0,o.jsx)(`span`,{className:`status-badge status-${e.paymentStatus.toLowerCase()}`,children:e.paymentStatus})]}),(0,o.jsxs)(`div`,{className:`order-row-details`,children:[new Date(e.createdAt).toLocaleDateString(`en-US`,{year:`numeric`,month:`short`,day:`numeric`}),`\xA0•\xA0 `,e.items?.reduce((e,t)=>e+t.quantity,0)||0,` item`,e.items?.length===1?``:`s`,`\xA0•\xA0 `,e.paymentMethod]})]}),(0,o.jsxs)(`div`,{className:`order-row-right`,children:[(0,o.jsxs)(`span`,{className:`order-total`,children:[`₹`,Number(e.total).toLocaleString(`en-IN`)]}),(0,o.jsx)(`span`,{className:`order-chevron`,children:`>`})]})]},e.id))})]})}),(0,o.jsx)(`style`,{children:`
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .order-row-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 8px;
          background: transparent;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .order-row-card:hover {
          border-color: var(--color-gold);
          background: rgba(255,255,255,0.02);
        }
        .order-row-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .order-row-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-id {
          font-family: var(--font-serif);
          color: var(--color-gold);
          font-weight: 600;
          font-size: 1.15rem;
        }
        .order-row-details {
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }
        .order-row-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .order-total {
          color: var(--color-ivory);
          font-weight: 700;
          font-size: 1.1rem;
        }
        .order-chevron {
          color: var(--color-text-muted);
          font-family: monospace;
          font-size: 1.2rem;
          transition: transform 0.2s;
        }
        .order-row-card:hover .order-chevron {
          transform: translateX(4px);
          color: var(--color-gold);
        }
        @media (max-width: 640px) {
          .order-row-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .order-row-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `})]})};export{s as default};