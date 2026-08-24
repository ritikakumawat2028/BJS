import"./rolldown-runtime-hePW80VL.js";import{n as e,t}from"./jsx-runtime-DE3RlOCf.js";import{E as n,c as r,l as i,s as a,x as o}from"./index-DqVxBjse.js";e();var s=e=>e?e.includes(`res.cloudinary.com`)?e.includes(`upload/f_auto,q_auto`)?e:e.replace(`/upload/`,`/upload/f_auto,q_auto/`):e:``,c=t(),l=({product:e,isWishlistPage:t})=>{let l=a(e=>e.addItem),u=r(e=>e.toggle),d=r(e=>e.isWishlisted),f=i(e=>e.isAuthenticated),p=n(),m=e.comparePrice?Math.round((Number(e.comparePrice)-Number(e.price))/Number(e.comparePrice)*100):0,h=!e.inventory||e.inventory.quantity>0,g=d(e.id),_=async t=>{if(t.preventDefault(),!f){p(`/login`);return}await l(e.id)},v=async t=>{if(t.preventDefault(),!f){p(`/login`);return}await u(e.id)},y=e.images?.find(e=>e.isThumbnail)?.url||e.images?.[0]?.url,b=e.images&&e.images.length>1?e.images.find(e=>!e.isThumbnail)?.url||e.images[1].url:null;return(0,c.jsxs)(o,{to:`/products/${e.slug}`,className:`product-card ${t?`product-card--wishlist`:``}`,style:{display:`block`},children:[(0,c.jsxs)(`div`,{className:`product-card__image-wrap`,children:[(0,c.jsx)(`img`,{src:s(y)||`https://images.unsplash.com/photo-1541643600914-78b084683702?w=400`,alt:e.name,className:`product-card__image product-card__image--primary`,loading:`lazy`}),b&&(0,c.jsx)(`img`,{src:s(b),alt:`${e.name} lifestyle`,className:`product-card__image product-card__image--secondary`,loading:`lazy`}),!t&&(0,c.jsxs)(`div`,{className:`product-card__badges`,children:[e.isBestseller&&(0,c.jsx)(`span`,{className:`product-card__badge-bestseller`,children:`Bestseller`}),e.isNewArrival&&(0,c.jsx)(`span`,{className:`product-card__badge-new`,children:`New Arrival`}),m>0&&(0,c.jsxs)(`span`,{className:`product-card__badge-sale`,children:[`-`,m,`%`]})]}),(0,c.jsx)(`button`,{className:`product-card__wishlist ${t?`wishlist-page-icon`:``}`,onClick:v,"aria-label":g?`Remove from wishlist`:`Add to wishlist`,children:g?(0,c.jsx)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`#C9A227`,stroke:`#C9A227`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,c.jsx)(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})}):(0,c.jsx)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`none`,stroke:`#C9A227`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,c.jsx)(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})})}),(0,c.jsx)(`div`,{className:`product-card__hover-action`,children:h?(0,c.jsx)(`button`,{className:`product-card__add-btn`,onClick:_,children:t?`Move to Cart`:`Add to Cart`}):(0,c.jsx)(`button`,{className:`product-card__add-btn product-card__add-btn--disabled`,disabled:!0,children:`Out of Stock`})})]}),(0,c.jsxs)(`div`,{className:`product-card__body`,children:[(0,c.jsx)(`div`,{className:`product-card__category`,children:e.category?.name||`Category`}),(0,c.jsx)(`h3`,{className:`product-card__name`,children:e.name}),(0,c.jsxs)(`div`,{className:`product-card__rating`,children:[(0,c.jsx)(`span`,{className:`product-card__stars`,children:`★★★★☆`}),(0,c.jsx)(`span`,{className:`product-card__rating-val`,children:`(4.8)`})]}),(0,c.jsxs)(`div`,{className:`product-card__price`,children:[(0,c.jsxs)(`span`,{className:`product-card__price-current`,children:[`₹`,Number(e.price).toLocaleString(`en-IN`)]}),!t&&e.comparePrice&&(0,c.jsxs)(`span`,{className:`product-card__price-original`,children:[`₹`,Number(e.comparePrice).toLocaleString(`en-IN`)]})]})]}),(0,c.jsx)(`style`,{children:`
        .product-card {
          display: flex; flex-direction: column; height: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--color-black, #000);
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
        }
        .product-card:hover { 
          border-color: rgba(255,255,255,0.2); 
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .product-card__image-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #111; display: flex; align-items: center; justify-content: center; }
        .product-card__image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; transition: opacity 0.4s ease, transform 0.4s ease; }
        .product-card__image--primary { opacity: 1; transform: scale(1); }
        .product-card__image--secondary { opacity: 0; transform: scale(1.05); }
        
        .product-card:hover .product-card__image--primary { opacity: 0; transform: scale(1.05); }
        .product-card:hover .product-card__image--secondary { opacity: 1; transform: scale(1); }
        .product-card:hover .product-card__image--primary:only-of-type { opacity: 1; transform: scale(1.05); }

        .product-card__badges { position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 2; }
        .product-card__badge-bestseller, .product-card__badge-sale { font-size: 0.65rem; font-weight: 700; color: #000; background: #C9A227; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
        .product-card__badge-new { font-size: 0.65rem; font-weight: 700; color: #000; background: #9E9E9E; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .product-card__wishlist {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-card__wishlist:hover { transform: scale(1.1); }
        
        .product-card__hover-action {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 0;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          z-index: 3;
        }
        .product-card:hover .product-card__hover-action {
          transform: translateY(0);
        }
        .product-card__add-btn { width: 100%; background: #C9A227; color: #000; border: none; padding: 12px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; }
        .product-card__add-btn:hover { background: #D4AF37; }
        .product-card__add-btn--disabled { background: #333; color: #888; cursor: not-allowed; }
        
        .product-card__body { padding: 16px; display: flex; flex-direction: column; flex: 1; background: #000; }
        .product-card__category { font-size: 0.65rem; color: #C9A227; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; }
        .product-card__name { font-family: var(--font-serif); font-size: 1.25rem; color: #C9A227; margin-bottom: 6px; font-weight: 400; }
        .product-card__rating { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
        .product-card__stars { color: #C9A227; font-size: 0.8rem; letter-spacing: 2px; }
        .product-card__rating-val { color: #888; font-size: 0.75rem; }
        .product-card__price { display: flex; align-items: center; gap: 8px; margin-top: auto; }
        .product-card__price-current { font-size: 1.1rem; font-weight: 600; color: #fff; }
        .product-card__price-original { font-size: 0.85rem; color: #888; text-decoration: line-through; }

        .product-card--wishlist {
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
      `})]})};export{s as n,l as t};