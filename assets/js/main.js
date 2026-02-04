// Simple interactivity: mobile toggle and contact form
document.addEventListener('DOMContentLoaded',function(){
  // Year
  document.getElementById('year').textContent=new Date().getFullYear();

  // Mobile nav toggle removed: nav is always visible on narrow viewports (CSS handles layout now)

  // Active nav: add .active and aria-current based on current URL, and show current page in footer
  (function(){
    var current = location.pathname.split('/').pop() || 'index.html';
    var pageNames = { 'index.html':'Home', 'services.html':'Services', 'about.html':'About', 'work.html':'Portfolio', 'contact.html':'Contact' };
    document.querySelectorAll('.nav a').forEach(function(link){
      var href = link.getAttribute('href');
      if(href === current || (href === 'index.html' && (current === '' || current === 'index.html'))){
        link.classList.add('active');
        link.setAttribute('aria-current','page');
      }
    });
    var name = pageNames[current] || (current.replace('.html','') || '');
    var currentEl = document.getElementById('currentPage');
    if(currentEl && name){
      currentEl.textContent = ' · ' + name;
    }
  })();

  var form=document.getElementById('contactForm');
  form && form.addEventListener('submit',function(e){
    e.preventDefault();
    var status=document.getElementById('formStatus');
    var action=form.getAttribute('action') || '';
    var formData=new FormData(form);

    // If user configured a Formspree endpoint (or other form endpoint) submit via fetch
    if(action && action.includes('formspree.io')){
      status.hidden=false; status.textContent='Sending...';
      fetch(action, {method:'POST', body:formData, headers:{'Accept':'application/json'}})
        .then(function(response){
          if(response.ok){
            status.textContent='Thanks! Your message was sent. We will contact you shortly.';
            form.reset();
          }else{
            return response.json().then(function(data){
              status.textContent = data && data.error ? 'Error: ' + data.error : 'Oops! There was a problem sending your message.';
            });
          }
        }).catch(function(){
          status.textContent='Network error. Please try again later.';
        });

    }else{
      // Fallback: open mail client with prefilled message
      var email=form.querySelector('[name="email"]').value || '';
      var name=form.querySelector('[name="name"]').value || '';
      var message=form.querySelector('[name="message"]').value || '';
      var subject=encodeURIComponent('Website Contact from ' + name);
      var body=encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      window.location.href='mailto:info@securetech.example?subject='+subject+'&body='+body;
    }
  });
});