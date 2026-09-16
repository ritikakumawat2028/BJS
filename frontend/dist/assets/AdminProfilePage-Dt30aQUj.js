import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{r}from"./api-GVepoN7G.js";import{n as i,t as a}from"./eye-BDFT3ufi.js";import{d as o,l as s,u as c}from"./index-B58T4g9_.js";var l=e(t(),1),u=n(),d=()=>{let{user:e,fetchMe:t}=s(),[n,d]=(0,l.useState)(!1),[f,p]=(0,l.useState)(e?.email||``),[m,h]=(0,l.useState)(``),[g,_]=(0,l.useState)(``),[v,y]=(0,l.useState)(``),[b,x]=(0,l.useState)(!1);return(0,u.jsxs)(`div`,{className:`admin-profile-page`,children:[(0,u.jsx)(o,{children:(0,u.jsx)(`title`,{children:`Admin Profile — BJ'S Natural Care`})}),(0,u.jsx)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`24px`},children:(0,u.jsx)(`h1`,{className:`admin-page-title`,style:{marginBottom:0},children:`My Profile`})}),(0,u.jsxs)(`div`,{className:`profile-grid`,children:[(0,u.jsxs)(`div`,{className:`profile-card`,children:[(0,u.jsx)(`h3`,{children:`Update Email`}),(0,u.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),f)try{d(!0),await r.updateMe({email:f}),await t(),c.success(`Profile updated successfully`)}catch(e){c.error(e.response?.data?.message||`Failed to update profile`)}finally{d(!1)}},children:[(0,u.jsxs)(`div`,{className:`form-group`,children:[(0,u.jsx)(`label`,{children:`Email Address`}),(0,u.jsx)(`input`,{type:`email`,className:`form-input`,value:f,onChange:e=>p(e.target.value),required:!0})]}),(0,u.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:n,children:n?`Updating...`:`Update Email`})]})]}),(0,u.jsxs)(`div`,{className:`profile-card`,children:[(0,u.jsx)(`h3`,{children:`Change Password`}),(0,u.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),!m||!g||!v){c.error(`Please fill all password fields`);return}if(g!==v){c.error(`New passwords do not match`);return}try{d(!0),await r.changePassword({currentPassword:m,newPassword:g}),c.success(`Password updated successfully`),h(``),_(``),y(``)}catch(e){c.error(e.response?.data?.message||`Failed to update password`)}finally{d(!1)}},children:[(0,u.jsxs)(`div`,{className:`form-group`,children:[(0,u.jsx)(`label`,{children:`Current Password`}),(0,u.jsxs)(`div`,{className:`password-input-wrapper`,children:[(0,u.jsx)(`input`,{type:b?`text`:`password`,className:`form-input pr-10`,value:m,onChange:e=>h(e.target.value),required:!0}),(0,u.jsx)(`button`,{type:`button`,className:`password-toggle`,onClick:()=>x(!b),children:b?(0,u.jsx)(i,{size:18}):(0,u.jsx)(a,{size:18})})]})]}),(0,u.jsxs)(`div`,{className:`form-group`,children:[(0,u.jsx)(`label`,{children:`New Password`}),(0,u.jsxs)(`div`,{className:`password-input-wrapper`,children:[(0,u.jsx)(`input`,{type:b?`text`:`password`,className:`form-input pr-10`,value:g,onChange:e=>_(e.target.value),required:!0}),(0,u.jsx)(`button`,{type:`button`,className:`password-toggle`,onClick:()=>x(!b),children:b?(0,u.jsx)(i,{size:18}):(0,u.jsx)(a,{size:18})})]})]}),(0,u.jsxs)(`div`,{className:`form-group`,children:[(0,u.jsx)(`label`,{children:`Confirm New Password`}),(0,u.jsxs)(`div`,{className:`password-input-wrapper`,children:[(0,u.jsx)(`input`,{type:b?`text`:`password`,className:`form-input pr-10`,value:v,onChange:e=>y(e.target.value),required:!0}),(0,u.jsx)(`button`,{type:`button`,className:`password-toggle`,onClick:()=>x(!b),children:b?(0,u.jsx)(i,{size:18}):(0,u.jsx)(a,{size:18})})]})]}),(0,u.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:n,children:n?`Updating...`:`Change Password`})]})]})]}),(0,u.jsx)(`style`,{children:`
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .profile-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .profile-card h3 {
          margin-top: 0;
          margin-bottom: 24px;
          color: var(--color-ivory);
          font-size: 1.25rem;
          font-family: var(--font-serif);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }
        .btn-primary {
          background: var(--color-gold);
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-primary:hover {
          opacity: 0.9;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .password-toggle:hover {
          color: var(--color-ivory);
        }
        .pr-10 {
          padding-right: 2.5rem;
        }
      `})]})};export{d as default};