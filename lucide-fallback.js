const lucideFallbackPaths = {
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  sparkles: 'M5 12l5 5L20 7M4 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7z',
  'flower-2': 'M9 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm-6 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z',
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z',
  gift: 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7M2 12h20M12 22V12M12 2v10M7 7h10',
  'layout-grid': 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  star: 'M12 2l3 7h7l-5.5 4.1L18 21l-6-3.9L6 21l1.5-7.9L2 9h7l3-7z',
  x: 'M18 6 6 18M6 6l12 12',
  shuffle: 'M16 3h5v5M8 21H3v-5M21 3 14 10m-4 4-7 7M21 14V9m-5 5h5',
  'pen-tool': 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z',
  'check-circle': 'M9 12l2 2 4-4M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
  'x-circle': 'M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2 22 6.48 22 12 17.52 22 12 22zm3.29-13.29L14.41 12l.88.88a1 1 0 0 1-1.42 1.42L13 13.41l-.88.88a1 1 0 1 1-1.42-1.42L11.59 12l-.88-.88a1 1 0 1 1 1.42-1.42L13 10.59l.88-.88a1 1 0 0 1 1.42 0z',
  inbox: 'M22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7M22 12l-6 8H8l-6-8M2 7h20',
  palette: 'M12 3a9 9 0 0 0 0 18 7 7 0 0 0 7-7c0-2.39-1.03-4.55-2.69-6.11A2 2 0 0 0 15.45 6 2 2 0 0 0 14 5.46 3 3 0 0 1 15.14 2.9 5 5 0 0 0 12 3z',
  calculator: 'M8 3h8v4H8V3zm-2 6h12v12H6V9zm3 3h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z',
  'book-open': 'M2 5.5C2 4.67 2.67 4 3.5 4h4.5a1 1 0 0 1 1 1v13.5a1 1 0 0 1-1 1H3.5A1.5 1.5 0 0 1 2 18.5V5.5zm9 0C11 4.67 11.67 4 12.5 4H17a1 1 0 0 1 1 1v13.5a1 1 0 0 1-1 1h-4.5A1.5 1.5 0 0 1 11 18.5V5.5z',
  beaker: 'M8 2h8l2.5 7.5V18a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2V9.5L8 2z',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 0v20M2 12h20',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 5a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  compass: 'M12 2l7 7-7 7-7-7 7-7zm0 4v5l3 1-3-6z',
  briefcase: 'M4 7h16v12H4V7zm6-4h4v4H10V3z',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 12l2 2 4-4'
};

function lucideCreateFallbackIcons() {
  const lucideApi = (typeof lucide !== 'undefined' && lucide) || window.lucide || window.Lucide;
  if (lucideApi && typeof lucideApi.createIcons === 'function') {
    lucideApi.createIcons();
    return;
  }

  document.querySelectorAll('[data-lucide]').forEach(el => {
    if (el.tagName.toLowerCase() !== 'i') return;
    const name = el.getAttribute('data-lucide');
    const classes = el.getAttribute('class') || '';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('class', `lucide ${classes}`.trim());
    const d = lucideFallbackPaths[name] || lucideFallbackPaths.star;
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    el.replaceWith(svg);
  });
}

window.lucideCreateFallbackIcons = lucideCreateFallbackIcons;
window.addEventListener('DOMContentLoaded', lucideCreateFallbackIcons);
window.addEventListener('load', lucideCreateFallbackIcons);
setTimeout(lucideCreateFallbackIcons, 300);
