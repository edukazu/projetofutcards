// battle.js
// Implementa um único pitch cuja largura lógica = BASE_WIDTH * 3 (3x).
// Se não couber na viewport, aplica transform: scale(...) (<=1) para evitar scroll.
// Além disso atualiza variáveis CSS (largura/altura lógicas e espessuras de marcação)
// para que as marcações fiquem proporcionais ao tamanho lógico.

(function(){
  const pitch = document.getElementById('pitch');
  if(!pitch) return;

  const BASE_WIDTH = 420; // px - largura base de 1 campo
  const MULTIPLIER = 3;   // queremos 3x na horizontal (largura lógica)
  const RATIO = 0.46;     // largura / altura do campo
  const VIEWPORT_MARGIN = 0.98; // margem para caber na viewport

  // Função para aplicar tamanho lógico e escala
  function applySizing(){
    // dimensões lógicas alvo (sempre 3x em largura)
    const logicalWidth = BASE_WIDTH * MULTIPLIER; // ex: 1260
    const logicalHeight = logicalWidth / RATIO;

    // calcular o máximo disponível na viewport considerando margem
    const maxW = Math.floor(window.innerWidth * VIEWPORT_MARGIN);
    const maxH = Math.floor(window.innerHeight * VIEWPORT_MARGIN);

    // escala necessária (<=1) para caber tanto na largura quanto na altura
    const scaleX = maxW / logicalWidth;
    const scaleY = maxH / logicalHeight;
    const scale = Math.min(1, scaleX, scaleY);

    // Computar marcações proporcionais (em px) com limites mínimos
    const markingWidth = Math.max(1, Math.round(logicalWidth * 0.0025)); // ~3px em 1200px
    const centerCircleSize = Math.max(90, Math.round(logicalWidth * 0.11)); // ajusta círculo central proporcionalmente
    const border = Math.max(4, Math.round(logicalWidth * 0.0045)); // borda do campo proporcional

    // Aplicar variáveis CSS ao elemento (com unidades)
    pitch.style.setProperty('--pitch-w', logicalWidth + 'px');
    pitch.style.setProperty('--pitch-h', logicalHeight + 'px');
    pitch.style.setProperty('--marking-width', markingWidth + 'px');
    pitch.style.setProperty('--center-circle-size', centerCircleSize + 'px');
    pitch.style.setProperty('--border', border + 'px');

    // Aplicar escala visual para caber sem scroll
    pitch.style.transform = 'scale(' + scale + ')';
    pitch.style.transformOrigin = 'center center';
  }

  // Inicial e ao redimensionar/orientationchange
  window.addEventListener('resize', applySizing, { passive: true });
  window.addEventListener('orientationchange', applySizing, { passive: true });
  applySizing();

  // Utilitário para inspecionar valores
  window.pitchInfo = function(){
    const rect = pitch.getBoundingClientRect();
    const cs = getComputedStyle(pitch);
    return {
      logicalWidth: cs.getPropertyValue('--pitch-w'),
      logicalHeight: cs.getPropertyValue('--pitch-h'),
      markingWidth: cs.getPropertyValue('--marking-width'),
      centerCircleSize: cs.getPropertyValue('--center-circle-size'),
      border: cs.getPropertyValue('--border'),
      clientRect: rect,
      transform: cs.getPropertyValue('transform') || pitch.style.transform
    };
  };

  console.info('Pitch carregado. Largura lógica = ' + (BASE_WIDTH * MULTIPLIER) + 'px; aplicando scale quando necessário para evitar rolagem.');
})();