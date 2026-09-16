import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{r}from"./api-GVepoN7G.js";import{n as i,t as a}from"./eye-CCrctPE5.js";import{O as o,d as s,u as c,x as l}from"./index-Duwot0Bh.js";var u=e(t(),1),d=n(),f=()=>{let[e]=o(),t=e.get(`token`),[n,f]=(0,u.useState)(``),[p,m]=(0,u.useState)(``),[h,g]=(0,u.useState)(!1),[_,v]=(0,u.useState)(!1),[y,b]=(0,u.useState)(``),[x,S]=(0,u.useState)(!1);return(0,u.useEffect)(()=>{t||b(`Invalid or missing reset token. Please request a new password reset link.`)},[t]),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s,{children:(0,d.jsx)(`title`,{children:`Reset Password — BJ'S Natural Care`})}),(0,d.jsx)(`div`,{className:`auth-page`,children:(0,d.jsxs)(`div`,{className:`auth-card animate-fade-up`,children:[(0,d.jsxs)(`div`,{className:`auth-header`,children:[(0,d.jsx)(l,{to:`/`,className:`auth-logo`,children:`BJ'S NATURAL CARE`}),(0,d.jsx)(`h1`,{className:`auth-title`,children:`Reset Password`}),(0,d.jsx)(`p`,{className:`auth-subtitle`,children:_?`Your password has been successfully reset.`:`Please enter your new password below.`})]}),_?(0,d.jsxs)(`div`,{className:`fp-success`,children:[(0,d.jsx)(`div`,{className:`fp-success-icon`,children:`✓`}),(0,d.jsx)(`p`,{className:`fp-success-text`,children:`Your password has been reset successfully. You can now log in with your new password.`}),(0,d.jsx)(l,{to:`/login`,className:`btn btn-primary btn-full`,children:`Return to Login`})]}):(0,d.jsx)(`form`,{onSubmit:async e=>{if(e.preventDefault(),b(``),!t){b(`Invalid reset token.`);return}if(n.length<8){b(`Password must be at least 8 characters long`);return}if(!/[A-Z]/.test(n)){b(`Password must contain at least one uppercase letter`);return}if(!/[0-9]/.test(n)){b(`Password must contain at least one number`);return}if(!/[\W_]/.test(n)){b(`Password must contain at least one special character`);return}if(n!==p){b(`Passwords do not match`);return}g(!0);try{await r.resetPassword(t,n),v(!0),c.success(`Password has been reset successfully!`)}catch(e){let t=e.response?.data?.message||`Failed to reset password. The link may have expired.`;c.error(t),b(t)}finally{g(!1)}},className:`auth-form`,children:!t&&y?(0,d.jsxs)(`div`,{className:`fp-success`,children:[(0,d.jsx)(`p`,{className:`form-error`,style:{fontSize:`1rem`,marginBottom:`24px`},children:y}),(0,d.jsx)(l,{to:`/forgot-password`,className:`btn btn-outline-gold btn-full`,children:`Request New Link`})]}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`New Password`}),(0,d.jsxs)(`div`,{className:`password-input-wrapper`,children:[(0,d.jsx)(`input`,{type:x?`text`:`password`,className:`form-input pr-10 ${y&&n.length>0&&n.length<8?`error`:``}`,placeholder:`At least 8 chars, 1 uppercase, 1 number, 1 special char`,value:n,onChange:e=>{f(e.target.value),b(``)},autoFocus:!0}),(0,d.jsx)(`button`,{type:`button`,className:`password-toggle`,onClick:()=>S(!x),children:x?(0,d.jsx)(i,{size:18}):(0,d.jsx)(a,{size:18})})]})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Confirm New Password`}),(0,d.jsxs)(`div`,{className:`password-input-wrapper`,children:[(0,d.jsx)(`input`,{type:x?`text`:`password`,className:`form-input pr-10 ${y&&n!==p?`error`:``}`,placeholder:`Confirm new password`,value:p,onChange:e=>{m(e.target.value),b(``)}}),(0,d.jsx)(`button`,{type:`button`,className:`password-toggle`,onClick:()=>S(!x),children:x?(0,d.jsx)(i,{size:18}):(0,d.jsx)(a,{size:18})})]}),y&&(0,d.jsx)(`p`,{className:`form-error`,children:y})]}),(0,d.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-full btn-lg ${h?`btn-loading`:``}`,disabled:h,style:{marginTop:`16px`},children:!h&&`Reset Password`})]})})]})}),(0,d.jsx)(`style`,{children:`
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
      `})]})};export{f as default};