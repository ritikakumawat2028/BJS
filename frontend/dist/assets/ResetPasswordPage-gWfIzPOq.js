import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{r}from"./api-C6NvANl9.js";import{O as i,d as a,u as o,x as s}from"./index-BgqKvp_9.js";var c=e(t(),1),l=n(),u=()=>{let[e]=i(),t=e.get(`token`),[n,u]=(0,c.useState)(``),[d,f]=(0,c.useState)(``),[p,m]=(0,c.useState)(!1),[h,g]=(0,c.useState)(!1),[_,v]=(0,c.useState)(``);return(0,c.useEffect)(()=>{t||v(`Invalid or missing reset token. Please request a new password reset link.`)},[t]),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(a,{children:(0,l.jsx)(`title`,{children:`Reset Password — BJ'S Natural Care`})}),(0,l.jsx)(`div`,{className:`auth-page`,children:(0,l.jsxs)(`div`,{className:`auth-card animate-fade-up`,children:[(0,l.jsxs)(`div`,{className:`auth-header`,children:[(0,l.jsx)(s,{to:`/`,className:`auth-logo`,children:`BJ'S NATURAL CARE`}),(0,l.jsx)(`h1`,{className:`auth-title`,children:`Reset Password`}),(0,l.jsx)(`p`,{className:`auth-subtitle`,children:h?`Your password has been successfully reset.`:`Please enter your new password below.`})]}),h?(0,l.jsxs)(`div`,{className:`fp-success`,children:[(0,l.jsx)(`div`,{className:`fp-success-icon`,children:`✓`}),(0,l.jsx)(`p`,{className:`fp-success-text`,children:`Your password has been reset successfully. You can now log in with your new password.`}),(0,l.jsx)(s,{to:`/login`,className:`btn btn-primary btn-full`,children:`Return to Login`})]}):(0,l.jsx)(`form`,{onSubmit:async e=>{if(e.preventDefault(),v(``),!t){v(`Invalid reset token.`);return}if(n.length<6){v(`Password must be at least 6 characters long`);return}if(n!==d){v(`Passwords do not match`);return}m(!0);try{await r.resetPassword(t,n),g(!0),o.success(`Password has been reset successfully!`)}catch(e){let t=e.response?.data?.message||`Failed to reset password. The link may have expired.`;o.error(t),v(t)}finally{m(!1)}},className:`auth-form`,children:!t&&_?(0,l.jsxs)(`div`,{className:`fp-success`,children:[(0,l.jsx)(`p`,{className:`form-error`,style:{fontSize:`1rem`,marginBottom:`24px`},children:_}),(0,l.jsx)(s,{to:`/forgot-password`,className:`btn btn-outline-gold btn-full`,children:`Request New Link`})]}):(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(`div`,{className:`form-group`,children:[(0,l.jsx)(`label`,{className:`form-label`,children:`New Password`}),(0,l.jsx)(`input`,{type:`password`,className:`form-input ${_&&n.length>0&&n.length<6?`error`:``}`,placeholder:`Enter new password (min 6 characters)`,value:n,onChange:e=>{u(e.target.value),v(``)},autoFocus:!0})]}),(0,l.jsxs)(`div`,{className:`form-group`,children:[(0,l.jsx)(`label`,{className:`form-label`,children:`Confirm New Password`}),(0,l.jsx)(`input`,{type:`password`,className:`form-input ${_&&n!==d?`error`:``}`,placeholder:`Confirm new password`,value:d,onChange:e=>{f(e.target.value),v(``)}}),_&&(0,l.jsx)(`p`,{className:`form-error`,children:_})]}),(0,l.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-full btn-lg ${p?`btn-loading`:``}`,disabled:p,style:{marginTop:`16px`},children:!p&&`Reset Password`})]})})]})}),(0,l.jsx)(`style`,{children:`
        .auth-page {
          min-height: 100vh;
          background: var(--color-black);
          display: flex; align-items: center; justify-content: center;
          padding: var(--space-6);
          background-image: radial-gradient(ellipse at 20% 50%, rgba(201,162,39,0.04) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 20%, rgba(201,162,39,0.02) 0%, transparent 50%);
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--color-charcoal);
          border: 1px solid var(--color-border-gold);
          border-radius: var(--radius-lg);
          padding: var(--space-10) var(--space-8);
        }
        .auth-header { text-align: center; margin-bottom: var(--space-8); }
        .auth-logo {
          display: inline-block;
          font-family: var(--font-serif);
          font-size: 0.9rem;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          margin-bottom: var(--space-5);
        }
        .auth-title { font-family: var(--font-serif); font-size: 2rem; color: var(--color-ivory); margin-bottom: var(--space-2); }
        .auth-subtitle { font-size: 0.875rem; color: var(--color-text-muted); }
        .auth-form { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6); }
        .fp-success { text-align: center; padding: var(--space-4) 0; }
        .fp-success-icon {
          font-size: 3rem;
          margin-bottom: var(--space-4);
          display: block;
          color: var(--color-gold);
        }
        .fp-success-text {
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-6);
          font-size: 0.95rem;
        }
      `})]})};export{u as default};