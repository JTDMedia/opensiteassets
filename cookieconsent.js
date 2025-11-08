(function(){
  var STORAGE_KEY = 'cookie_consent_status';
  var EXPIRY_DAYS = 365;

  try {
    if (localStorage && localStorage.getItem(STORAGE_KEY) === 'accepted') return;
  } catch (e) {}

  var css = `
  .cv-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);opacity:0;pointer-events:none;transition:opacity .4s ease;z-index:2147483646}
  .cv-overlay.show{opacity:1;pointer-events:auto}
  .cv-consent-wrap{position:fixed;right:20px;bottom:20px;z-index:2147483647;max-width:360px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#0f172a}
  .cv-consent{background:linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,250,0.96));backdrop-filter:blur(6px);border-radius:14px;box-shadow:0 8px 32px rgba(2,6,23,0.12);padding:18px;display:flex;gap:12px;align-items:center;transform:translateY(24px) scale(0.98);opacity:0;transition:opacity .35s cubic-bezier(.2,.9,.3,1),transform .45s cubic-bezier(.2,.9,.3,1);border:1px solid rgba(2,6,23,0.06)}
  .cv-consent.show{opacity:1;transform:translateY(0) scale(1)}
  .cv-consent__icon{flex:0 0 44px;height:44px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#6366f1,#06b6d4);color:white;font-weight:700;font-size:20px}
  .cv-consent__body{flex:1;min-width:0}
  .cv-consent__title{font-size:14px;font-weight:600;margin:0 0 4px 0}
  .cv-consent__desc{font-size:13px;margin:0;color:#475569;line-height:1.3}
  .cv-consent__actions{display:flex;gap:8px;align-items:center;margin-left:12px}
  .cv-btn{appearance:none;border:0;padding:10px 14px;border-radius:10px;font-weight:600;cursor:pointer;font-size:13px}
  .cv-btn--accept{background:#f1f5f9;color:#0f172a;border:1px solid rgba(15,23,42,0.1)}
  .cv-btn--accept:hover{background:#e2e8f0}
  .cv-link{font-size:13px;color:#2563eb;text-decoration:underline;cursor:pointer}
  @media (max-width:480px){.cv-consent-wrap{left:12px;right:12px;bottom:16px;max-width:calc(100% - 24px)}.cv-consent{flex-direction:row}}
  @media (prefers-reduced-motion:reduce){.cv-consent{transition:none}}
  `;

  var style=document.createElement('style');
  style.type='text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // Create overlay
  var overlay=document.createElement('div');
  overlay.className='cv-overlay';
  document.body.appendChild(overlay);

  var wrap=document.createElement('div');
  wrap.className='cv-consent-wrap';
  wrap.setAttribute('aria-live','polite');

  var dialog=document.createElement('div');
  dialog.className='cv-consent';
  dialog.setAttribute('role','dialog');
  dialog.setAttribute('aria-label','Cookie consent');

  var icon=document.createElement('div');
  icon.className='cv-consent__icon';
  icon.textContent='🍪';

  var body=document.createElement('div');
  body.className='cv-consent__body';

  var title=document.createElement('p');
  title.className='cv-consent__title';
  title.textContent='Cookies & Privacy';

  var desc=document.createElement('p');
  desc.className='cv-consent__desc';
  desc.innerHTML='We use cookies to make this site work properly. By clicking “Accept all”, you agree to the use of cookies.';

  body.appendChild(title);
  body.appendChild(desc);

  var actions=document.createElement('div');
  actions.className='cv-consent__actions';

  var accept=document.createElement('button');
  accept.className='cv-btn cv-btn--accept';
  accept.type='button';
  accept.textContent='Accept all';
  accept.setAttribute('aria-label','Accept all cookies');

  actions.appendChild(accept);

  dialog.appendChild(icon);
  dialog.appendChild(body);
  dialog.appendChild(actions);
  wrap.appendChild(dialog);
  document.body.appendChild(wrap);

  requestAnimationFrame(function(){
    setTimeout(function(){
      overlay.classList.add('show');
      dialog.classList.add('show');
    },20);
  });

  function setAccepted(){
    try{
      if(localStorage){
        var payload={status:'accepted',ts:Date.now(),expires:Date.now()+EXPIRY_DAYS*24*60*60*1000};
        localStorage.setItem(STORAGE_KEY,'accepted');
        localStorage.setItem(STORAGE_KEY+'_meta',JSON.stringify(payload));
      }
    }catch(e){}
  }

  function hideAndRemove(){
    dialog.classList.remove('show');
    overlay.classList.remove('show');
    dialog.style.pointerEvents='none';
    setTimeout(function(){
      if(wrap&&wrap.parentNode)wrap.parentNode.removeChild(wrap);
      if(overlay&&overlay.parentNode)overlay.parentNode.removeChild(overlay);
    },420);
  }

  accept.addEventListener('click',function(){setAccepted();hideAndRemove();try{window.dispatchEvent(new CustomEvent('cookieConsent:accepted',{detail:{method:'accept-all'}}));}catch(e){}});
  accept.addEventListener('keyup',function(ev){if(ev.key==='Enter')accept.click();});

  try{
    var meta=localStorage&&localStorage.getItem(STORAGE_KEY+'_meta');
    if(meta){try{var m=JSON.parse(meta);if(m.expires&&Date.now()>m.expires){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(STORAGE_KEY+'_meta');}}catch(e){}}
  }catch(e){}

  window.CookieConsent=window.CookieConsent||{};
  window.CookieConsent.status=function(){try{return localStorage&&localStorage.getItem(STORAGE_KEY);}catch(e){return null;}};
  window.CookieConsent.accept=function(){accept.click();};
})();
