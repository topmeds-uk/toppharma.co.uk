(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const number = (form.dataset.whatsappNumber || '').replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(number)) return;

  const button = form.querySelector('[type="submit"]');
  button.disabled = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const message = [
      'Top Pharma contact enquiry',
      'Name: ' + fields.get('name'),
      'Email: ' + fields.get('email'),
      'Subject: ' + fields.get('subject'),
      'Message: ' + fields.get('message'),
    ].join('\n');
    window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
})();
