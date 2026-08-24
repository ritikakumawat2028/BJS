import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{r}from"./api-DYzY90uH.js";import{d as i,u as a,x as o}from"./index-DqVxBjse.js";var s=e(t(),1),c=n(),l=()=>{let[e,t]=(0,s.useState)(``),[n,l]=(0,s.useState)(!1),[u,d]=(0,s.useState)(!1),[f,p]=(0,s.useState)(``);return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{children:(0,c.jsx)(`title`,{children:`Forgot Password — BJ'S Natural Care`})}),(0,c.jsx)(`div`,{className:`auth-page`,children:(0,c.jsxs)(`div`,{className:`auth-card animate-fade-up`,children:[(0,c.jsxs)(`div`,{className:`auth-header`,children:[(0,c.jsx)(o,{to:`/`,className:`auth-logo`,children:`BJ'S NATURAL CARE`}),(0,c.jsx)(`h1`,{className:`auth-title`,children:`Forgot Password`}),(0,c.jsx)(`p`,{className:`auth-subtitle`,children:u?`Check your email for the reset link`:`Enter your email and we'll send you a reset link`})]}),u?(0,c.jsxs)(`div`,{className:`fp-success`,children:[(0,c.jsx)(`div`,{className:`fp-success-icon`,children:`✉`}),(0,c.jsxs)(`p`,{className:`fp-success-text`,children:[`We've sent a password reset link to `,(0,c.jsx)(`strong`,{children:e}),`. Please check your inbox (and spam folder).`]}),(0,c.jsx)(`button`,{className:`btn btn-outline-gold btn-full`,onClick:()=>{d(!1),t(``)},children:`Try a different email`})]}):(0,c.jsxs)(`form`,{onSubmit:async t=>{if(t.preventDefault(),p(``),!e){p(`Email is required`);return}if(!/\S+@\S+\.\S+/.test(e)){p(`Please enter a valid email address`);return}l(!0);try{await r.forgotPassword(e),d(!0),a.success(`Reset link sent! Check your inbox.`)}catch(e){let t=e.response?.data?.message||`Something went wrong. Please try again.`;a.error(t),p(t)}finally{l(!1)}},className:`auth-form`,children:[(0,c.jsxs)(`div`,{className:`form-group`,children:[(0,c.jsx)(`label`,{className:`form-label`,children:`Email Address`}),(0,c.jsx)(`input`,{type:`email`,id:`forgot-email`,className:`form-input ${f?`error`:``}`,placeholder:`Enter your email`,value:e,onChange:e=>{t(e.target.value),p(``)},autoComplete:`email`,autoFocus:!0}),f&&(0,c.jsx)(`p`,{className:`form-error`,children:f})]}),(0,c.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-full btn-lg ${n?`btn-loading`:``}`,disabled:n,children:!n&&`Send Reset Link`})]}),(0,c.jsx)(`div`,{className:`auth-footer`,style:{marginTop:`24px`},children:(0,c.jsxs)(`p`,{children:[`Remembered your password?`,` `,(0,c.jsx)(o,{to:`/login`,style:{color:`var(--color-gold)`},children:`Sign In`})]})})]})}),(0,c.jsx)(`style`,{children:`
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
        .auth-footer { text-align: center; font-size: 0.875rem; color: var(--color-text-muted); }
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
        .fp-success-text strong { color: var(--color-ivory); }
      `})]})};export{l as default};