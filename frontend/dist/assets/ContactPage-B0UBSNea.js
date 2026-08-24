import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{t as r}from"./api-B_NpKJmv.js";import{a as i,d as a,r as o,t as s,u as c}from"./index-D0zStIXg.js";var l=i(`clock`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 6v6l4 2`,key:`mmk7yg`}]]),u=i(`mail`,[[`path`,{d:`m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7`,key:`132q7q`}],[`rect`,{x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`,key:`izxlao`}]]),d=i(`map-pin`,[[`path`,{d:`M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,key:`1r0f0z`}],[`circle`,{cx:`12`,cy:`10`,r:`3`,key:`ilqhr7`}]]),f=i(`phone`,[[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,key:`9njp5v`}]]),p=i(`send`,[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`,key:`1ffxy3`}],[`path`,{d:`m21.854 2.147-10.94 10.939`,key:`12cjpa`}]]),m=e(t(),1),h=n(),g={initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:`-50px`},transition:{duration:.7,ease:[.25,.46,.45,.94]}},_=()=>{let{data:e}=o(),[t,n]=(0,m.useState)({name:``,email:``,phone:``,subject:``,message:``}),[i,_]=(0,m.useState)(!1),v=e=>{n(t=>({...t,[e.target.name]:e.target.value}))},y=async e=>{e.preventDefault(),_(!0);try{await r.createTicket({...t,orderNumber:``}),c.success(`Your message has been sent successfully! We will get back to you within 2 hours.`),n({name:``,email:``,phone:``,subject:``,message:``})}catch(e){c.error(e.response?.data?.message||`Failed to send message. Please try again.`)}finally{_(!1)}};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(a,{children:(0,h.jsxs)(`title`,{children:[`Contact Us — `,e?.store_name||`BJ'S Natural Care`]})}),(0,h.jsxs)(`section`,{className:`contact-hero`,children:[(0,h.jsx)(`div`,{className:`contact-hero__bg`,style:{backgroundImage:`url('/contact-hero.jpg')`}}),(0,h.jsx)(`div`,{className:`contact-hero__overlay`}),(0,h.jsxs)(`div`,{className:`container contact-hero__content`,children:[(0,h.jsx)(s.div,{className:`contact-hero__subtitle`,...g,children:`GET IN TOUCH`}),(0,h.jsx)(s.h1,{className:`contact-hero__title`,...g,transition:{delay:.1,duration:.7},children:`We Would Love to Hear From You`}),(0,h.jsxs)(s.p,{className:`contact-hero__text`,...g,transition:{delay:.2,duration:.7},children:[`Have a question, feedback, or just want to say hello? Our concierge`,(0,h.jsx)(`br`,{}),`team responds to every message within 2 hours.`]})]})]}),(0,h.jsx)(`section`,{className:`contact-main`,children:(0,h.jsxs)(`div`,{className:`container contact-main__inner`,children:[(0,h.jsxs)(s.div,{className:`contact-form-section`,...g,children:[(0,h.jsx)(`h2`,{className:`contact-heading`,children:`Send Us a Message`}),(0,h.jsx)(`p`,{className:`contact-desc`,children:`Fill out the form below and we will get back to you within 2 hours during business hours.`}),(0,h.jsxs)(`form`,{className:`contact-form`,onSubmit:y,children:[(0,h.jsxs)(`div`,{className:`form-group-full`,children:[(0,h.jsxs)(`label`,{className:`contact-label`,children:[`Full Name `,(0,h.jsx)(`span`,{className:`text-muted`,children:`(optional)`})]}),(0,h.jsx)(`input`,{type:`text`,name:`name`,className:`contact-input`,value:t.name,onChange:v,placeholder:`Your full name`})]}),(0,h.jsxs)(`div`,{className:`form-row`,children:[(0,h.jsxs)(`div`,{className:`form-group`,children:[(0,h.jsxs)(`label`,{className:`contact-label`,children:[`Email Address `,(0,h.jsx)(`span`,{className:`text-red`,children:`*`})]}),(0,h.jsx)(`input`,{type:`email`,name:`email`,className:`contact-input`,required:!0,value:t.email,onChange:v,placeholder:`you@example.com`})]}),(0,h.jsxs)(`div`,{className:`form-group`,children:[(0,h.jsxs)(`label`,{className:`contact-label`,children:[`Phone Number `,(0,h.jsx)(`span`,{className:`text-muted`,children:`(optional)`})]}),(0,h.jsx)(`input`,{type:`tel`,name:`phone`,className:`contact-input`,value:t.phone,onChange:v,placeholder:`+91 98765 43210`})]})]}),(0,h.jsxs)(`div`,{className:`form-group-full`,children:[(0,h.jsxs)(`label`,{className:`contact-label`,children:[`Subject `,(0,h.jsx)(`span`,{className:`text-muted`,children:`(optional)`})]}),(0,h.jsxs)(`select`,{name:`subject`,className:`contact-input contact-select`,value:t.subject,onChange:v,children:[(0,h.jsx)(`option`,{value:``,children:`Select a topic`}),(0,h.jsx)(`option`,{value:`Order Inquiry`,children:`Order Inquiry`}),(0,h.jsx)(`option`,{value:`Product Question`,children:`Product Question`}),(0,h.jsx)(`option`,{value:`Feedback`,children:`Feedback`}),(0,h.jsx)(`option`,{value:`Other`,children:`Other`})]})]}),(0,h.jsxs)(`div`,{className:`form-group-full`,children:[(0,h.jsxs)(`label`,{className:`contact-label`,children:[`Your Message `,(0,h.jsx)(`span`,{className:`text-red`,children:`*`})]}),(0,h.jsx)(`textarea`,{name:`message`,className:`contact-input contact-textarea`,required:!0,value:t.message,onChange:v,rows:5,placeholder:`Tell us how we can help you...`,maxLength:500}),(0,h.jsx)(`div`,{className:`form-char-count`,children:`Maximum 500 characters`})]}),(0,h.jsxs)(`button`,{type:`submit`,className:`contact-submit`,disabled:i,children:[i?`Sending...`:`Send Message`,` `,(0,h.jsx)(p,{size:18})]})]})]}),(0,h.jsxs)(s.div,{className:`contact-info-section`,...g,transition:{delay:.2},children:[(0,h.jsxs)(`div`,{className:`contact-info-card`,children:[(0,h.jsx)(`div`,{className:`contact-info-icon`,children:(0,h.jsx)(u,{size:20,strokeWidth:1.5})}),(0,h.jsxs)(`div`,{className:`contact-info-content`,children:[(0,h.jsx)(`h3`,{children:`Email`}),(0,h.jsx)(`p`,{children:`jay250576@gmail.com`}),(0,h.jsx)(`a`,{href:`mailto:jay250576@gmail.com`,className:`contact-link`,children:`Send Email →`})]})]}),(0,h.jsxs)(`div`,{className:`contact-info-card`,children:[(0,h.jsx)(`div`,{className:`contact-info-icon`,children:(0,h.jsx)(f,{size:20,strokeWidth:1.5})}),(0,h.jsxs)(`div`,{className:`contact-info-content`,children:[(0,h.jsx)(`h3`,{children:`Phone`}),(0,h.jsxs)(`p`,{children:[`+91 92745 96622`,(0,h.jsx)(`br`,{}),`Mon-Sat, 10 AM - 7 PM IST`]}),(0,h.jsx)(`a`,{href:`tel:+919274596622`,className:`contact-link`,children:`Call Us →`})]})]}),(0,h.jsxs)(`div`,{className:`contact-info-card`,children:[(0,h.jsx)(`div`,{className:`contact-info-icon`,children:(0,h.jsx)(d,{size:20,strokeWidth:1.5})}),(0,h.jsxs)(`div`,{className:`contact-info-content`,children:[(0,h.jsx)(`h3`,{children:`Visit Our Store`}),(0,h.jsx)(`p`,{children:`Surat, Gujarat, India`}),(0,h.jsx)(`a`,{href:`https://maps.google.com/?q=Surat,Gujarat,India`,target:`_blank`,rel:`noreferrer`,className:`contact-link`,children:`Get Directions →`})]})]}),(0,h.jsxs)(`div`,{className:`contact-info-card`,children:[(0,h.jsx)(`div`,{className:`contact-info-icon`,children:(0,h.jsx)(l,{size:20,strokeWidth:1.5})}),(0,h.jsxs)(`div`,{className:`contact-info-content`,children:[(0,h.jsx)(`h3`,{children:`Business Hours`}),(0,h.jsxs)(`div`,{className:`hours-grid`,children:[(0,h.jsx)(`span`,{children:`Monday - Friday`}),(0,h.jsx)(`span`,{children:`10:00 AM - 8:00 PM`}),(0,h.jsx)(`span`,{children:`Saturday`}),(0,h.jsx)(`span`,{children:`10:00 AM - 7:00 PM`}),(0,h.jsx)(`span`,{children:`Sunday`}),(0,h.jsx)(`span`,{children:`11:00 AM - 6:00 PM`})]})]})]}),(0,h.jsxs)(`div`,{className:`contact-social`,children:[(0,h.jsx)(`h3`,{children:`Follow Us`}),(0,h.jsxs)(`div`,{className:`contact-social-icons`,children:[(0,h.jsx)(`a`,{href:`https://www.instagram.com/bjs.essence?igsi=dWF1c3Uya3NlcHMz&utm_source=qr`,className:`social-icon`,target:`_blank`,rel:`noopener noreferrer`,children:(0,h.jsxs)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,h.jsx)(`rect`,{x:`2`,y:`2`,width:`20`,height:`20`,rx:`5`,ry:`5`}),(0,h.jsx)(`path`,{d:`M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z`}),(0,h.jsx)(`line`,{x1:`17.5`,y1:`6.5`,x2:`17.51`,y2:`6.5`})]})}),(0,h.jsx)(`a`,{href:`https://wa.me/919274596622`,className:`social-icon`,target:`_blank`,rel:`noopener noreferrer`,children:(0,h.jsx)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,h.jsx)(`path`,{d:`M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z`})})})]})]})]})]})}),(0,h.jsx)(`section`,{className:`contact-map`,children:(0,h.jsx)(`iframe`,{src:`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.986877864115!2d72.79155097587889!3d21.171804284897003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1716301234567!5m2!1sen!2sin`,width:`100%`,height:`450`,style:{border:0,display:`block`},allowFullScreen:!0,loading:`lazy`,referrerPolicy:`no-referrer-when-downgrade`,title:`Store Location Map`})}),(0,h.jsx)(`style`,{children:`
        /* Hero */
        .contact-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: calc(var(--nav-height) + 40px) 24px 60px;
        }
        .contact-hero__bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .contact-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, #000000 100%);
          z-index: 1;
        }
        .contact-hero__content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }
        .contact-hero__subtitle {
          color: var(--color-gold);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .contact-hero__title {
          font-family: var(--font-serif);
          font-size: 3.5rem;
          line-height: 1.15;
          color: var(--color-ivory);
          margin-bottom: 24px;
          font-weight: 500;
        }
        .contact-hero__text {
          font-size: 1.15rem;
          color: #e5e5e5;
          line-height: 1.6;
        }

        /* Main Section */
        .contact-main {
          background: #000;
          padding: 80px 24px;
        }
        .contact-main__inner {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: start;
        }

        /* Form */
        .contact-heading {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: #fff;
          margin-bottom: 8px;
        }
        .contact-desc {
          color: #888;
          font-size: 0.95rem;
          margin-bottom: 40px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .form-group-full, .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .contact-label {
          color: #e5e5e5;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .text-muted { color: #666; font-size: 0.8rem; font-weight: normal; }
        .text-red { color: #ff4d4f; }
        .contact-input {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 4px;
          padding: 14px 16px;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .contact-input:focus {
          outline: none;
          border-color: var(--color-gold);
        }
        .contact-input::placeholder { color: #444; }
        .contact-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }
        .contact-select option { background: #111; color: #fff; }
        .contact-textarea { resize: vertical; }
        .form-char-count {
          color: #666;
          font-size: 0.8rem;
          margin-top: -4px;
        }
        .contact-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--color-gold);
          color: #000;
          padding: 14px 32px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          align-self: flex-start;
          margin-top: 8px;
        }
        .contact-submit:hover { background: var(--color-soft-gold); }
        .contact-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Info Cards */
        .contact-info-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .contact-info-card {
          display: flex;
          gap: 20px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
        }
        .contact-info-icon {
          width: 40px; height: 40px;
          background: #fadca1;
          color: #000;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .contact-info-content h3 {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 8px;
        }
        .contact-info-content p {
          color: #888;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .contact-link {
          color: var(--color-gold);
          font-size: 0.9rem;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .contact-link:hover { color: #fff; }
        
        .hours-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px 24px;
          color: #888;
          font-size: 0.95rem;
        }
        .hours-grid span:nth-child(even) {
          text-align: right;
          color: #a3a3a3;
        }

        .contact-social {
          margin-top: 16px;
        }
        .contact-social h3 {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 16px;
        }
        .contact-social-icons {
          display: flex;
          gap: 12px;
        }
        .social-icon {
          width: 40px; height: 40px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          transition: all 0.2s;
        }
        .social-icon:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }

        /* Map */
        .contact-map {
          width: 100%;
          background: #000;
        }

        @media (max-width: 1024px) {
          .contact-main__inner { grid-template-columns: 1fr; gap: 60px; }
          .contact-hero__title { font-size: 3rem; }
        }
        @media (max-width: 768px) {
          .contact-hero__title { font-size: 2.2rem; }
          .form-row { grid-template-columns: 1fr; gap: 24px; }
        }
      `})]})};export{_ as default};