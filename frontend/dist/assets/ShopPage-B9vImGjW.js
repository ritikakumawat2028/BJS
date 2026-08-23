import{r as e}from"./rolldown-runtime-hePW80VL.js";import{n as t,t as n}from"./jsx-runtime-DE3RlOCf.js";import{l as r,s as i}from"./api-D9u4oh4j.js";import{O as a,d as o,f as s,t as c,x as l}from"./index-BxgBeFpD.js";import{t as u}from"./ProductCard-DMD5un6H.js";var d=e(t(),1),f=n(),p={hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:.1}}},m={hidden:{opacity:0,y:20},show:{opacity:1,y:0,transition:{duration:.5,ease:[.25,.46,.45,.94]}}},h=()=>{let[e,t]=a(),[n,h]=(0,d.useState)({page:1,limit:12,category:e.get(`category`)||void 0,subcategory:e.get(`subcategory`)||void 0,search:e.get(`search`)||void 0,gender:e.get(`gender`)||void 0,sort:e.get(`sort`)||`newest`,featured:e.get(`featured`)===`true`,bestseller:e.get(`bestseller`)===`true`,newArrival:e.get(`newArrival`)===`true`}),[g,_]=(0,d.useState)({min:``,max:``}),[v,y]=(0,d.useState)(!1);(0,d.useEffect)(()=>{let t=e.get(`category`)||void 0;h(n=>({...n,category:t,subcategory:n.category===t?n.subcategory:void 0,search:e.get(`search`)||void 0}))},[e]);let{data:b,isLoading:x}=s({queryKey:[`products`,n],queryFn:()=>r.getAll({...n,minPrice:g.min||void 0,maxPrice:g.max||void 0})}),{data:S}=s({queryKey:[`categories`],queryFn:()=>i.getAll()}),C=b?.data?.data||[],w=b?.data?.pagination,T=S?.data?.data||[],E=e=>{let t=T.find(t=>t.slug===e);return t?t.name:e.split(`-`).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(` `)},D=(e,t)=>{h(n=>({...n,[e]:t,page:1}))},O=()=>(0,f.jsxs)(`div`,{className:`product-card`,children:[(0,f.jsx)(`div`,{className:`skeleton`,style:{aspectRatio:`3/4`}}),(0,f.jsxs)(`div`,{style:{padding:`16px`},children:[(0,f.jsx)(`div`,{className:`skeleton`,style:{height:`16px`,marginBottom:`8px`,width:`70%`}}),(0,f.jsx)(`div`,{className:`skeleton`,style:{height:`14px`,width:`50%`}})]})]});return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(o,{children:(0,f.jsx)(`title`,{children:`Shop ??? BJ'S Natural Care`})}),(0,f.jsxs)(`div`,{style:{paddingTop:`var(--nav-height)`},children:[(0,f.jsxs)(`div`,{className:`shop-header ${n.category?`shop-header--category`:``}`,style:n.category?{backgroundImage:`url(${n.category===`fragrance`?`https://public.readdy.ai/ai/img_res/f682c1ec4ecd0bd7dcec60e9b50b2d80.jpg`:n.category===`hair-care`?`https://public.readdy.ai/ai/img_res/c63fa98daea1dca6f21cbc9f0d2b932a.jpg`:n.category===`skin-care`?`https://public.readdy.ai/ai/img_res/d4e5882dc5c5fda45cf81a161be1cb4a.jpg`:n.category===`natural-care`?`https://public.readdy.ai/ai/img_res/2c4b5da4455932bd864205f53302f109.jpg`:n.category===`body-care`?`https://public.readdy.ai/ai/img_res/19ec0adabc268a426b7f985d246acca9.jpg`:n.category===`gift-sets`?`https://public.readdy.ai/ai/img_res/bc4097a9a8a5871f93cb05a3f9fe0ca7.jpg`:`https://images.unsplash.com/photo-1608248593842-8d7d964268e0?w=1600`})`}:{},children:[(0,f.jsx)(`div`,{className:`shop-header__overlay`}),(0,f.jsxs)(`div`,{className:`container`,style:{position:`relative`,zIndex:2},children:[(0,f.jsx)(`h1`,{className:`shop-header__title`,children:n.category?E(n.category):`Shop All Products`}),(0,f.jsx)(`p`,{className:`shop-header__subtitle`,children:n.category?n.category===`fragrance`?`Discover our curated collection of premium fragrances, from intoxicating oud perfumes to delicate floral scents.`:`Explore our luxurious collection of ${E(n.category).toLowerCase()} crafted with the finest natural ingredients.`:w?`${w.total} products found`:`Loading...`})]})]}),n.category&&(0,f.jsxs)(`div`,{className:`container`,children:[(0,f.jsxs)(`div`,{className:`breadcrumb`,style:{margin:`20px 0`,fontSize:`0.85rem`,color:`var(--color-text-muted)`},children:[(0,f.jsx)(l,{to:`/`,style:{color:`inherit`,textDecoration:`none`},children:`Home`}),(0,f.jsx)(`span`,{style:{margin:`0 8px`},children:`>`}),(0,f.jsx)(l,{to:`/shop`,style:{color:`inherit`,textDecoration:`none`},children:`Shop`}),(0,f.jsx)(`span`,{style:{margin:`0 8px`},children:`>`}),(0,f.jsx)(`span`,{style:{color:`var(--color-gold)`},children:E(n.category)})]}),(0,f.jsxs)(`div`,{className:`shop-subcategories`,style:{display:`flex`,gap:`12px`,marginBottom:`30px`,flexWrap:`wrap`},children:[(0,f.jsxs)(`button`,{onClick:()=>D(`subcategory`,void 0),style:{borderRadius:`20px`,padding:`8px 20px`,fontSize:`0.85rem`,cursor:`pointer`,fontFamily:`var(--font-sans)`,fontWeight:n.subcategory?400:500,transition:`all 0.2s`,border:`1px solid ${n.subcategory?`rgba(255,255,255,0.3)`:`var(--color-gold)`}`,background:n.subcategory?`transparent`:`var(--color-gold)`,color:n.subcategory?`var(--color-gold)`:`#000`},children:[`All `,E(n.category)]}),(n.category===`fragrance`?[{id:`perfumes`,name:`Perfumes`},{id:`edp`,name:`Eau de Parfum`},{id:`premium`,name:`Premium Fragrances`},{id:`gift`,name:`Gift Sets`}]:n.category===`hair-care`?[{id:`shampoo`,name:`Shampoo`},{id:`conditioner`,name:`Conditioner`},{id:`hair-oil`,name:`Hair Oil`},{id:`hair-serum`,name:`Hair Serum`}]:n.category===`skin-care`?[{id:`face-care`,name:`Face Care`},{id:`body-care`,name:`Body Care`},{id:`moisturizers`,name:`Moisturizers`}]:n.category===`natural-care`?[{id:`herbal-products`,name:`Herbal Products`},{id:`natural-oils`,name:`Natural Oils`},{id:`wellness-products`,name:`Wellness Products`}]:T.find(e=>e.slug===n.category)?.subcategories||[]).map(e=>{let t=e.slug||e.id,r=n.subcategory===t;return(0,f.jsx)(`button`,{onClick:()=>D(`subcategory`,t),style:{borderRadius:`20px`,padding:`8px 20px`,fontSize:`0.85rem`,cursor:`pointer`,fontFamily:`var(--font-sans)`,fontWeight:r?500:400,transition:`all 0.2s`,border:`1px solid ${r?`var(--color-gold)`:`rgba(255,255,255,0.3)`}`,background:r?`var(--color-gold)`:`transparent`,color:r?`#000`:`var(--color-gold)`},onMouseOver:e=>!r&&(e.currentTarget.style.borderColor=`var(--color-gold)`),onMouseOut:e=>!r&&(e.currentTarget.style.borderColor=`rgba(255,255,255,0.3)`),children:e.name},t)})]})]}),(0,f.jsx)(`div`,{className:`container`,children:(0,f.jsxs)(`div`,{className:`shop-layout ${n.category?`shop-layout--category`:``}`,children:[v&&(0,f.jsx)(`div`,{className:`shop-sidebar-overlay`,onClick:()=>y(!1)}),!n.category&&(0,f.jsxs)(`aside`,{className:`shop-sidebar ${v?`shop-sidebar--open`:``}`,children:[(0,f.jsxs)(`div`,{className:`shop-sidebar-header`,children:[(0,f.jsx)(`h2`,{className:`shop-sidebar-header-title`,children:`Filters`}),(0,f.jsx)(`button`,{className:`shop-sidebar-close`,onClick:()=>y(!1),children:`✕`})]}),(0,f.jsxs)(`div`,{className:`shop-sidebar__inner`,children:[(0,f.jsxs)(`div`,{className:`shop-filter-group`,children:[(0,f.jsx)(`h3`,{className:`shop-filter-title`,children:`CATEGORIES`}),T.map(e=>(0,f.jsxs)(`label`,{className:`shop-checkbox-label`,children:[(0,f.jsx)(`input`,{type:`checkbox`,checked:n.category===e.slug,onChange:t=>D(`category`,t.target.checked?e.slug:void 0)}),e.name]},e.id))]}),(0,f.jsxs)(`div`,{className:`shop-filter-group`,children:[(0,f.jsx)(`h3`,{className:`shop-filter-title`,children:`PRICE RANGE`}),[{label:`Under ₹500`,min:`0`,max:`500`},{label:`₹500 - ₹1,000`,min:`500`,max:`1000`},{label:`₹1,000 - ₹2,000`,min:`1000`,max:`2000`},{label:`₹2,000 - ₹3,000`,min:`2000`,max:`3000`},{label:`₹3,000+`,min:`3000`,max:``}].map((e,t)=>(0,f.jsxs)(`label`,{className:`shop-checkbox-label`,children:[(0,f.jsx)(`input`,{type:`radio`,name:`priceRange`,checked:g.min===e.min&&g.max===e.max,onChange:()=>{_({min:e.min,max:e.max}),h(e=>({...e,page:1}))}}),e.label]},t))]}),(0,f.jsxs)(`div`,{className:`shop-filter-group`,children:[(0,f.jsx)(`h3`,{className:`shop-filter-title`,children:`FOR`}),[`Unisex`,`Men`,`Women`].map(e=>(0,f.jsxs)(`label`,{className:`shop-checkbox-label`,children:[(0,f.jsx)(`input`,{type:`radio`,name:`gender`,checked:n.gender===e||e===`Unisex`&&!n.gender,onChange:()=>D(`gender`,e===`Unisex`?void 0:e)}),e]},e))]}),(0,f.jsxs)(`div`,{className:`shop-filter-group`,children:[(0,f.jsx)(`h3`,{className:`shop-filter-title`,children:`TAGS`}),(0,f.jsx)(`div`,{className:`shop-tags-cloud`,children:`aloe.anti-aging.argan.ayurvedic.bhringraj.biotin.body care.body lotion.body scrub.coconut.coffee.evening.exfoliation.face care.face cream.floral.fragrance.frizz control.gel.gift.gift set.gold.hair care.hair oil.hair repair.herbal`.split(`.`).map(e=>(0,f.jsx)(`span`,{className:`shop-tag-item`,children:e},e))})]}),(0,f.jsx)(`button`,{className:`btn btn-outline btn-full`,onClick:()=>{h({page:1,limit:12,sort:`newest`}),_({min:``,max:``})},children:`Clear Filters`})]})]}),(0,f.jsxs)(`main`,{className:`shop-main`,children:[n.category&&(0,f.jsxs)(`div`,{style:{marginBottom:`24px`,fontSize:`0.85rem`,color:`var(--color-text-muted)`},children:[w?.total||C.length,` products`]}),!n.category&&(0,f.jsxs)(`div`,{className:`shop-toolbar`,style:{justifyContent:`flex-end`},children:[(0,f.jsx)(`div`,{className:`shop-mobile-filter-wrap`,children:(0,f.jsxs)(`button`,{className:`shop-mobile-filter-btn btn btn-outline btn-sm`,onClick:()=>y(!0),children:[(0,f.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,f.jsx)(`line`,{x1:`4`,y1:`6`,x2:`20`,y2:`6`}),(0,f.jsx)(`line`,{x1:`8`,y1:`12`,x2:`20`,y2:`12`}),(0,f.jsx)(`line`,{x1:`12`,y1:`18`,x2:`20`,y2:`18`})]}),`Filters`]})}),(0,f.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,f.jsx)(`span`,{className:`shop-sort-label`,style:{fontSize:`0.85rem`,color:`var(--color-text-muted)`},children:`Sort by:`}),(0,f.jsxs)(`select`,{className:`form-select`,style:{width:`160px`,fontSize:`0.85rem`,padding:`8px 12px`,background:`transparent`,color:`var(--color-ivory)`,border:`1px solid var(--color-border)`,borderRadius:`4px`},value:n.sort,onChange:e=>D(`sort`,e.target.value),children:[(0,f.jsx)(`option`,{value:`newest`,style:{background:`#000`},children:`Newest`}),(0,f.jsx)(`option`,{value:`price-low`,style:{background:`#000`},children:`Price: Low to High`}),(0,f.jsx)(`option`,{value:`price-high`,style:{background:`#000`},children:`Price: High to Low`}),(0,f.jsx)(`option`,{value:`popular`,style:{background:`#000`},children:`Most Popular`}),(0,f.jsx)(`option`,{value:`rating`,style:{background:`#000`},children:`Best Rated`})]})]})]}),x?(0,f.jsx)(`div`,{className:`products-grid`,children:Array.from({length:12}).map((e,t)=>(0,f.jsx)(O,{},t))}):C.length===0?(0,f.jsxs)(`div`,{className:`empty-state`,children:[(0,f.jsx)(`p`,{className:`empty-state__title`,children:`No products found`}),(0,f.jsx)(`p`,{className:`empty-state__text`,children:`Try adjusting your filters or explore all products.`}),(0,f.jsx)(`button`,{className:`btn btn-outline-gold`,onClick:()=>h({page:1,limit:12,sort:`newest`}),children:`Clear Filters`})]}):(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(c.div,{className:`products-grid`,variants:p,initial:`hidden`,animate:`show`,children:C.map(e=>(0,f.jsx)(c.div,{variants:m,children:(0,f.jsx)(u,{product:e})},e.id))}),w&&w.totalPages>1&&(0,f.jsxs)(`div`,{className:`pagination shop-pagination`,children:[(0,f.jsx)(`button`,{className:`page-btn page-btn-arrow`,disabled:n.page===1,onClick:()=>D(`page`,(n.page||1)-1),children:(0,f.jsx)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:(0,f.jsx)(`polyline`,{points:`15 18 9 12 15 6`})})}),Array.from({length:Math.min(w.totalPages,7)},(e,t)=>t+1).map(e=>(0,f.jsx)(`button`,{className:`page-btn ${n.page===e?`active`:``}`,onClick:()=>D(`page`,e),children:e},e)),(0,f.jsx)(`button`,{className:`page-btn page-btn-arrow`,disabled:n.page===w.totalPages,onClick:()=>D(`page`,(n.page||1)+1),children:(0,f.jsx)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:(0,f.jsx)(`polyline`,{points:`9 18 15 12 9 6`})})})]})]})]})]})})]}),(0,f.jsx)(`style`,{children:`
        .shop-header {
          position: relative;
          padding: var(--space-8) 0 var(--space-6);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-10);
          background-color: var(--color-black);
        }
        .shop-header--category {
          padding: 100px 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          text-align: center;
          border-bottom: none;
        }
        .shop-header__overlay {
          display: none;
        }
        .shop-header--category .shop-header__overlay {
          display: block;
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }
        .shop-header__title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: var(--color-ivory);
          font-weight: 400;
          margin-bottom: 8px;
        }
        .shop-header--category .shop-header__title {
          font-size: 3.5rem;
        }
        .shop-header__subtitle {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          max-width: 600px;
          line-height: 1.6;
        }
        .shop-header--category .shop-header__subtitle {
          color: var(--color-ivory);
          font-size: 1rem;
          margin: 0 auto;
        }
        .shop-layout { display: grid; grid-template-columns: 240px 1fr; gap: var(--space-10); padding-bottom: var(--space-16); }
        .shop-layout--category { grid-template-columns: 1fr; }
        .shop-sidebar { position: sticky; top: calc(var(--nav-height) + 20px); height: fit-content; max-height: calc(100vh - var(--nav-height) - 40px); overflow-y: auto; }
        .shop-sidebar__inner { display: flex; flex-direction: column; gap: var(--space-8); }
        .shop-filter-group { }
        .shop-filter-title { font-family: var(--font-serif); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--color-gold); margin-bottom: var(--space-4); }
        .shop-checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--color-text-secondary); cursor: pointer; padding: 4px 0; margin-bottom: 4px; transition: color 0.2s; }
        .shop-checkbox-label:hover { color: var(--color-ivory); }
        .shop-checkbox-label input { appearance: none; width: 14px; height: 14px; border: 1px solid var(--color-text-secondary); border-radius: 2px; outline: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .shop-checkbox-label input[type="radio"] { border-radius: 50%; }
        .shop-checkbox-label input:checked { background: var(--color-ivory); border-color: var(--color-ivory); }
        .shop-tags-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
        .shop-tag-item { font-size: 0.75rem; color: var(--color-text-muted); cursor: pointer; transition: color 0.2s; }
        .shop-tag-item:hover { color: var(--color-ivory); }
        .shop-main { min-width: 0; }
        .shop-mobile-filter-wrap { display: none; }
        .shop-toolbar { display: flex; justify-content: flex-end; align-items: center; margin-bottom: var(--space-6); gap: 16px; }
        .shop-sort-label { font-size: 0.8rem; color: var(--color-text-muted); margin-right: 12px; }
        .shop-mobile-filter-btn { display: none; }
        .shop-pagination { display: flex; justify-content: flex-end; margin-top: 40px; gap: 8px; }
        .shop-pagination .page-btn { background: transparent; border: 1px solid var(--color-border); color: var(--color-text-secondary); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
        .shop-pagination .page-btn:hover { border-color: var(--color-gold); color: var(--color-gold); }
        .shop-pagination .page-btn.active { background: var(--color-gold); color: var(--color-black); border-color: var(--color-gold); font-weight: 600; }
        .shop-pagination .page-btn-arrow { border-color: var(--color-border); }
        .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
        .shop-layout--category .products-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1024px) {
          .shop-layout { grid-template-columns: 200px 1fr; gap: var(--space-6); }
        }
        @media (max-width: 768px) {
          .shop-layout { grid-template-columns: 1fr; }
          .shop-sidebar { position: fixed; top: 0; left: 0; width: 300px; height: 100vh; background: var(--color-charcoal); z-index: var(--z-modal); transform: translateX(-100%); transition: transform 0.3s; padding: var(--space-6); border-right: 1px solid var(--color-border); }
          .shop-sidebar--open { transform: translateX(0); box-shadow: 10px 0 30px rgba(0,0,0,0.5); }
          .shop-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: calc(var(--z-modal) - 1); backdrop-filter: blur(4px); }
          .shop-sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); padding-bottom: var(--space-4); border-bottom: 1px solid rgba(255,255,255,0.1); }
          .shop-sidebar-header-title { font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-gold); margin: 0; }
          .shop-sidebar-close { background: none; border: none; color: var(--color-ivory); font-size: 1.25rem; cursor: pointer; }
          .shop-mobile-filter-wrap { display: block; margin-right: auto; }
          .shop-mobile-filter-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .shop-layout--category .products-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .shop-toolbar { flex-direction: column; align-items: flex-start; gap: 12px; }
          .shop-mobile-filter-wrap { margin-right: 0; width: 100%; }
          .shop-mobile-filter-btn { width: 100%; justify-content: center; }
          .products-grid { grid-template-columns: 1fr 1fr; gap: var(--space-2); }
        }
        @media (max-width: 360px) { .products-grid { grid-template-columns: 1fr; } }
      `})]})};export{h as default};