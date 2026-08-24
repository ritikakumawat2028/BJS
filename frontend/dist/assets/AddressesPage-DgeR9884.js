import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{t as r}from"./useMutation-BJ-m186X.js";import{u as i}from"./api-OvqCb2De.js";import{d as a,f as o,p as s,u as c,x as l}from"./index-CCD-mkdr.js";var u=e(t(),1),d=n(),f=()=>{let e=s(),{data:t,isLoading:n}=o({queryKey:[`my-addresses`],queryFn:()=>i.getAddresses()}),f=t?.data?.data||[],[p,m]=(0,u.useState)(!1),[h,g]=(0,u.useState)({label:`Home`,firstName:``,lastName:``,phone:``,line1:``,line2:``,city:``,state:``,country:`India`,pincode:``,isDefault:!1}),_=r({mutationFn:e=>i.addAddress(e),onSuccess:()=>{e.invalidateQueries({queryKey:[`my-addresses`]}),c.success(`Address added successfully`),m(!1),g({label:`Home`,firstName:``,lastName:``,phone:``,line1:``,line2:``,city:``,state:``,country:`India`,pincode:``,isDefault:!1})},onError:()=>c.error(`Failed to add address`)}),v=r({mutationFn:e=>i.deleteAddress(e),onSuccess:()=>{e.invalidateQueries({queryKey:[`my-addresses`]}),c.success(`Address deleted`)}});return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{children:(0,d.jsx)(`title`,{children:`My Addresses - BJ'S Natural Care`})}),(0,d.jsx)(`div`,{style:{paddingTop:`calc(var(--nav-height) + 40px)`,paddingBottom:`80px`,minHeight:`80vh`},children:(0,d.jsxs)(`div`,{className:`container`,style:{maxWidth:`1200px`},children:[(0,d.jsxs)(`div`,{style:{marginBottom:`32px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`16px`},children:[(0,d.jsx)(l,{to:`/account`,style:{color:`var(--color-text-muted)`,textDecoration:`none`,fontSize:`1.2rem`,transition:`color 0.2s`},children:`←`}),(0,d.jsx)(`h1`,{className:`section-title`,style:{marginBottom:0,fontSize:`2rem`},children:`My Addresses`})]}),(0,d.jsx)(`button`,{className:`btn btn-primary`,onClick:()=>m(!0),children:`+ Add New Address`})]}),n?(0,d.jsx)(`div`,{className:`addresses-grid`,children:[1,2].map(e=>(0,d.jsx)(`div`,{className:`skeleton`,style:{height:`200px`,borderRadius:`8px`}},e))}):f.length===0?(0,d.jsxs)(`div`,{className:`empty-state`,children:[(0,d.jsx)(`div`,{className:`empty-state__icon`,children:`📍`}),(0,d.jsx)(`h2`,{className:`empty-state__title`,children:`No addresses saved`}),(0,d.jsx)(`p`,{className:`empty-state__text`,children:`Add a shipping address to speed up checkout.`})]}):(0,d.jsx)(`div`,{className:`addresses-grid`,children:f.map(e=>(0,d.jsxs)(`div`,{className:`address-card`,children:[(0,d.jsxs)(`div`,{className:`address-card-header`,children:[(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,d.jsx)(`span`,{className:`address-label`,children:e.label||`Home`}),e.isDefault&&(0,d.jsx)(`span`,{className:`address-badge-default`,children:`Default`})]}),(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[!e.isDefault&&(0,d.jsx)(`button`,{className:`btn-text-muted`,children:`Set Default`}),(0,d.jsx)(`button`,{className:`btn-icon`,onClick:()=>v.mutate(e.id),children:(0,d.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,d.jsx)(`polyline`,{points:`3 6 5 6 21 6`}),(0,d.jsx)(`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`})]})})]})]}),(0,d.jsxs)(`div`,{className:`address-card-body`,children:[(0,d.jsxs)(`h3`,{className:`address-name`,children:[e.firstName,` `,e.lastName]}),(0,d.jsx)(`p`,{className:`address-phone`,children:e.phone}),(0,d.jsxs)(`p`,{className:`address-text`,children:[e.line1,e.line2?`, ${e.line2}`:``,(0,d.jsx)(`br`,{}),e.city,`, `,e.state,` — `,e.pincode]})]})]},e.id))})]})}),p&&(0,d.jsx)(`div`,{className:`modal-overlay`,onClick:()=>m(!1),children:(0,d.jsxs)(`div`,{className:`modal`,onClick:e=>e.stopPropagation(),children:[(0,d.jsx)(`button`,{className:`modal-close`,onClick:()=>m(!1),children:`✕`}),(0,d.jsx)(`h2`,{style:{fontFamily:`var(--font-serif)`,fontSize:`1.5rem`,marginBottom:`24px`,color:`var(--color-ivory)`},children:`Add New Address`}),(0,d.jsxs)(`form`,{onSubmit:e=>{e.preventDefault(),_.mutate(h)},className:`address-form`,children:[(0,d.jsxs)(`div`,{className:`form-row`,children:[(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`First Name`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,required:!0,value:h.firstName,onChange:e=>g({...h,firstName:e.target.value})})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Last Name`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,required:!0,value:h.lastName,onChange:e=>g({...h,lastName:e.target.value})})]})]}),(0,d.jsxs)(`div`,{className:`form-row`,children:[(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Phone Number`}),(0,d.jsx)(`input`,{type:`tel`,className:`form-input`,required:!0,value:h.phone,onChange:e=>g({...h,phone:e.target.value})})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Label (e.g. Home, Work)`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,value:h.label,onChange:e=>g({...h,label:e.target.value})})]})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Address Line 1`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,required:!0,value:h.line1,onChange:e=>g({...h,line1:e.target.value})})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Address Line 2 (Optional)`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,value:h.line2,onChange:e=>g({...h,line2:e.target.value})})]}),(0,d.jsxs)(`div`,{className:`form-row`,children:[(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`City`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,required:!0,value:h.city,onChange:e=>g({...h,city:e.target.value})})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`State`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,required:!0,value:h.state,onChange:e=>g({...h,state:e.target.value})})]})]}),(0,d.jsxs)(`div`,{className:`form-row`,children:[(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Pincode`}),(0,d.jsx)(`input`,{type:`text`,className:`form-input`,required:!0,value:h.pincode,onChange:e=>g({...h,pincode:e.target.value})})]}),(0,d.jsx)(`div`,{className:`form-group`,style:{display:`flex`,alignItems:`flex-end`,paddingBottom:`12px`},children:(0,d.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,cursor:`pointer`,color:`var(--color-text-secondary)`},children:[(0,d.jsx)(`input`,{type:`checkbox`,checked:h.isDefault,onChange:e=>g({...h,isDefault:e.target.checked})}),`Set as default address`]})})]}),(0,d.jsxs)(`div`,{style:{marginTop:`24px`,display:`flex`,gap:`16px`},children:[(0,d.jsx)(`button`,{type:`button`,className:`btn btn-outline`,style:{flex:1},onClick:()=>m(!1),children:`Cancel`}),(0,d.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,style:{flex:1},disabled:_.isPending,children:_.isPending?`Saving...`:`Save Address`})]})]})]})}),(0,d.jsx)(`style`,{children:`
        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .address-card {
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 8px;
          padding: 24px;
          background: transparent;
          transition: border-color 0.2s;
        }
        .address-card:hover {
          border-color: var(--color-gold);
        }
        .address-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .address-label {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .address-badge-default {
          color: var(--color-gold);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .address-card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .address-name {
          font-family: var(--font-serif);
          color: var(--color-gold);
          font-size: 1.1rem;
          margin-bottom: 2px;
        }
        .address-phone {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          margin-bottom: 12px;
        }
        .address-text {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .btn-text-muted {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-text-muted:hover {
          color: var(--color-ivory);
        }
        .btn-icon {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .btn-icon:hover {
          color: var(--color-error);
        }
        .address-form .form-row {
          display: flex;
          gap: 16px;
        }
        .address-form .form-row > * {
          flex: 1;
        }
        @media (max-width: 768px) {
          .addresses-grid {
            grid-template-columns: 1fr;
          }
          .address-form .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `})]})};export{f as default};