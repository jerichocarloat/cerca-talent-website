const header = document.querySelector('.header');
const mobileToggle = document.querySelector('.mobile-toggle');
const navItems = [...document.querySelectorAll('.nav-item')];
function closeNavigation({ restoreFocus = false, closeMobile = true } = {}) {
  const active = document.activeElement;
  const mobileWasOpen = header?.classList.contains('menu-open');
  const activeMenu = navItems.find(item => item.classList.contains('open') && item.contains(active));
  const target = mobileWasOpen && closeMobile ? mobileToggle : activeMenu?.querySelector('button');
  navItems.forEach(item => {
    item.classList.remove('open');
    item.querySelector('button')?.setAttribute('aria-expanded', 'false');
  });
  if (closeMobile) {
    header?.classList.remove('menu-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }
  if (restoreFocus) target?.focus();
}
mobileToggle?.addEventListener('click', () => {
  const open = !header.classList.contains('menu-open');
  closeNavigation();
  header.classList.toggle('menu-open', open);
  mobileToggle.setAttribute('aria-expanded', String(open));
});
navItems.forEach(item => item.querySelector('button')?.addEventListener('click', event => {
  const open = !item.classList.contains('open');
  closeNavigation({ closeMobile: false });
  item.classList.toggle('open', open);
  event.currentTarget.setAttribute('aria-expanded', String(open));
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeNavigation({ restoreFocus: true });
});
document.addEventListener('click', event => {
  if (!header?.contains(event.target) || event.target.closest('.navigation a')) closeNavigation();
});
const testimonials=JSON.parse(document.querySelector('#testimonials-data')?.textContent||'[]');
document.querySelectorAll('[data-quote]').forEach(button=>button.addEventListener('click',()=>{const q=testimonials[Number(button.dataset.quote)];if(!q)return;document.querySelector('#quote-text').textContent='“'+q.text+'”';document.querySelector('#quote-role').textContent=q.role;document.querySelector('#quote-context').textContent=q.context;document.querySelectorAll('[data-quote]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});}));
let selectedCategory='all';const search=document.querySelector('#article-search');const applyFilters=()=>{const query=(search?.value||'').toLowerCase().trim();let count=0;document.querySelectorAll('[data-article]').forEach(card=>{const matches=(!query||card.textContent.toLowerCase().includes(query))&&(selectedCategory==='all'||card.dataset.category===selectedCategory);card.hidden=!matches;if(matches)count++;});const empty=document.querySelector('#no-articles');if(empty)empty.hidden=count!==0;const tally=document.querySelector('#article-count');if(tally)tally.textContent=count+' articles';};
search?.addEventListener('input',applyFilters);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{selectedCategory=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});applyFilters();}));
const contactInterest = document.querySelector('#interest');
if (contactInterest && new URLSearchParams(window.location.search).get('interest') === 'candidate') {
  contactInterest.selectedIndex = 1;
}
document.querySelector('#contact-form')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const subject='Cerca Talent inquiry: '+data.get('interest');const body='Name: '+(data.get('firstName')+' '+data.get('lastName'))+'\nEmail: '+data.get('email')+'\nCompany: '+data.get('company')+'\nPhone: '+(data.get('countryCode')||'')+' '+data.get('phone')+'\nInterest: '+data.get('interest')+'\nSMS consent: '+(data.get('smsConsent')?'Yes':'No')+'\nPermission to store information and contact by phone/email: Yes\n\n'+data.get('message');const status=document.querySelector('#form-status');status.hidden=false;status.textContent='Your inquiry is ready. Your email app will open so you can review and send it to Info@CercaTalent.com. If it does not open, email us directly or call +1 201-594-2100.';window.location.href='mailto:Info@CercaTalent.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);});

document.querySelector('#newsletter-form')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const address=new FormData(form).get('email');const status=document.querySelector('#newsletter-status');status.hidden=false;status.textContent='Your email app will open with your subscription request. Review and send it to Cerca Talent.';window.location.href='mailto:Info@CercaTalent.com?subject='+encodeURIComponent('Mailing list subscription request')+'&body='+encodeURIComponent('Please add '+address+' to the Cerca Talent mailing list. I agree to receive your marketing material.');});

// Motion is progressive enhancement: the page stays fully visible if JavaScript
// is unavailable, and people who prefer reduced motion receive no entrance effects.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setupPageMotion() {
  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) return;

  const enterTargets = [
    ...document.querySelectorAll('.hero .eyebrow, .hero h1, .hero-description, .hero-actions, .hero-proof, .inner-hero .breadcrumb, .inner-hero .eyebrow, .inner-hero h1, .inner-hero > p')
  ];

  enterTargets.forEach((element, index) => {
    element.dataset.enter = '';
    element.style.setProperty('--motion-delay', `${Math.min(index * 55, 220)}ms`);
  });

  if (enterTargets.length) {
    document.documentElement.classList.add('motion-ready');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      enterTargets.forEach(element => element.classList.add('is-visible'));
    }));
  }

  const revealSelectors = [
    'main > section:not(.hero):not(.inner-hero)',
    '.industry-card',
    '.function-card',
    '.solution-card',
    '.article-card',
    '.guide-card',
    '.team-card',
    '.job-card'
  ];
  const revealTargets = [...new Set(document.querySelectorAll(revealSelectors.join(',')))];

  if (!revealTargets.length) return;
  document.documentElement.classList.add('motion-ready');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((element, index) => {
    element.dataset.reveal = '';
    const group = element.parentElement;
    const siblings = group ? [...group.children].filter(child => revealTargets.includes(child)) : [];
    const groupIndex = Math.max(0, siblings.indexOf(element));
    element.style.setProperty('--motion-delay', `${Math.min(groupIndex * 50, 200)}ms`);
    observer.observe(element);
  });
}

setupPageMotion();
