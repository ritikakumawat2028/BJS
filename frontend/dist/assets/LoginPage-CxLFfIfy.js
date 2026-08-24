import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{n as r,t as i}from"./eye-CLkfAPer.js";import{E as a,d as o,l as s,u as c,x as l}from"./index-DqVxBjse.js";var u=e(t(),1),d=n(),f=()=>{let[e,t]=(0,u.useState)({email:``,password:``}),[n,f]=(0,u.useState)(!1),[p,m]=(0,u.useState)(!1),[h,g]=(0,u.useState)({}),{login:_}=s(),v=a(),y=()=>{let t={};return e.email?/\S+@\S+\.\S+/.test(e.email)||(t.email=`Invalid email`):t.email=`Email is required`,e.password||(t.password=`Password is required`),g(t),Object.keys(t).length===0};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(o,{children:(0,d.jsx)(`title`,{children:`Sign In ??? BJ'S Natural Care`})}),(0,d.jsx)(`div`,{className:`auth-page`,children:(0,d.jsxs)(`div`,{className:`auth-card animate-fade-up`,children:[(0,d.jsxs)(`div`,{className:`auth-header`,children:[(0,d.jsx)(l,{to:`/`,className:`auth-logo`,children:`BJ'S NATURAL CARE`}),(0,d.jsx)(`h1`,{className:`auth-title`,children:`Welcome Back`}),(0,d.jsx)(`p`,{className:`auth-subtitle`,children:`Sign in to your account`})]}),(0,d.jsxs)(`form`,{onSubmit:async t=>{if(t.preventDefault(),y()){m(!0);try{await _(e.email,e.password),c.success(`Welcome back!`);let{user:t}=s.getState();t?.role===`ADMIN`||t?.role===`STAFF`?v(`/admin`):v(`/account`)}catch(e){if(e.response?.data?.errors&&Array.isArray(e.response.data.errors)){let t={};e.response.data.errors.forEach(e=>{let n=e.field.replace(`body.`,``);t[n]=e.message}),g(t),c.error(`Please fix the errors in the form.`)}else c.error(e.response?.data?.message||`Invalid email or password`)}finally{m(!1)}}},className:`auth-form`,children:[(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Email Address`}),(0,d.jsx)(`input`,{type:`email`,name:`email`,className:`form-input ${h.email?`error`:``}`,placeholder:`Enter your email`,value:e.email,onChange:e=>t(t=>({...t,email:e.target.value}))}),h.email&&(0,d.jsx)(`p`,{className:`form-error`,children:h.email})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,d.jsx)(`label`,{className:`form-label`,children:`Password`}),(0,d.jsx)(l,{to:`/forgot-password`,style:{fontSize:`0.8rem`,color:`var(--color-gold)`},children:`Forgot password?`})]}),(0,d.jsxs)(`div`,{style:{position:`relative`},children:[(0,d.jsx)(`input`,{type:n?`text`:`password`,name:`password`,className:`form-input ${h.password?`error`:``}`,placeholder:`Enter your password`,value:e.password,onChange:e=>t(t=>({...t,password:e.target.value})),style:{paddingRight:`40px`}}),(0,d.jsx)(`button`,{type:`button`,onClick:()=>f(!n),style:{position:`absolute`,right:`12px`,top:`50%`,transform:`translateY(-50%)`,background:`transparent`,border:`none`,color:`#ffffff`,cursor:`pointer`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:10},"aria-label":n?`Hide password`:`Show password`,children:n?(0,d.jsx)(r,{size:20}):(0,d.jsx)(i,{size:20})})]}),h.password&&(0,d.jsx)(`p`,{className:`form-error`,children:h.password})]}),(0,d.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-full btn-lg ${p?`btn-loading`:``}`,disabled:p,children:!p&&`Sign In`})]}),(0,d.jsx)(`div`,{className:`auth-footer`,children:(0,d.jsxs)(`p`,{children:[`Don't have an account? `,(0,d.jsx)(l,{to:`/register`,style:{color:`var(--color-gold)`},children:`Create one`})]})})]})}),(0,d.jsx)(`style`,{children:`
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
      `})]})};export{f as default};