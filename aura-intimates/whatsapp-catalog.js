// Mensagem pronta para solicitar o catálogo no WhatsApp
(function () {
  function buildCatalogMessage() {
    return [
      'Olá! Vim pelo site da Aura Intimates ✦',
      'Gostaria de receber o catálogo completo.'
    ].join('\n');
  }

  // Telefone já usado no projeto
  const WHATSAPP_NUMBER = '5585991067509';
  const urlBase = `https://wa.me/${WHATSAPP_NUMBER}`;

  window.sendCatalogWhatsApp = function sendCatalogWhatsApp() {
    const message = buildCatalogMessage();
    window.open(urlBase + '?text=' + encodeURIComponent(message), '_blank');
  };
})();

