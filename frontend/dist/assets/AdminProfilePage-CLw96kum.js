import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{d as r}from"./api-C6NvANl9.js";import{d as i,l as a,u as o}from"./index-BgqKvp_9.js";var s=e(t(),1),c=n(),l=()=>{let{user:e,fetchMe:t}=a(),[n,l]=(0,s.useState)(!1),[u,d]=(0,s.useState)(e?.email||``),[f,p]=(0,s.useState)(``),[m,h]=(0,s.useState)(``),[g,_]=(0,s.useState)(``);return(0,c.jsxs)(`div`,{className:`admin-profile-page`,children:[(0,c.jsx)(i,{children:(0,c.jsx)(`title`,{children:`Admin Profile — BJ'S Natural Care`})}),(0,c.jsx)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`24px`},children:(0,c.jsx)(`h1`,{className:`admin-page-title`,style:{marginBottom:0},children:`My Profile`})}),(0,c.jsxs)(`div`,{className:`profile-grid`,children:[(0,c.jsxs)(`div`,{className:`profile-card`,children:[(0,c.jsx)(`h3`,{children:`Update Email`}),(0,c.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),u)try{l(!0),await r.updateProfile({email:u}),await t(),o.success(`Email updated successfully`)}catch(e){o.error(e.response?.data?.message||`Failed to update email`)}finally{l(!1)}},children:[(0,c.jsxs)(`div`,{className:`form-group`,children:[(0,c.jsx)(`label`,{children:`Email Address`}),(0,c.jsx)(`input`,{type:`email`,className:`form-input`,value:u,onChange:e=>d(e.target.value),required:!0})]}),(0,c.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:n,children:n?`Updating...`:`Update Email`})]})]}),(0,c.jsxs)(`div`,{className:`profile-card`,children:[(0,c.jsx)(`h3`,{children:`Change Password`}),(0,c.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),!f||!m||!g){o.error(`Please fill all password fields`);return}if(m!==g){o.error(`New passwords do not match`);return}try{l(!0),await r.updatePassword({currentPassword:f,newPassword:m}),o.success(`Password updated successfully`),p(``),h(``),_(``)}catch(e){o.error(e.response?.data?.message||`Failed to update password`)}finally{l(!1)}},children:[(0,c.jsxs)(`div`,{className:`form-group`,children:[(0,c.jsx)(`label`,{children:`Current Password`}),(0,c.jsx)(`input`,{type:`password`,className:`form-input`,value:f,onChange:e=>p(e.target.value),required:!0})]}),(0,c.jsxs)(`div`,{className:`form-group`,children:[(0,c.jsx)(`label`,{children:`New Password`}),(0,c.jsx)(`input`,{type:`password`,className:`form-input`,value:m,onChange:e=>h(e.target.value),required:!0})]}),(0,c.jsxs)(`div`,{className:`form-group`,children:[(0,c.jsx)(`label`,{children:`Confirm New Password`}),(0,c.jsx)(`input`,{type:`password`,className:`form-input`,value:g,onChange:e=>_(e.target.value),required:!0})]}),(0,c.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:n,children:n?`Updating...`:`Change Password`})]})]})]}),(0,c.jsx)(`style`,{children:`
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
      `})]})};export{l as default};