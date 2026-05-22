function svgToDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function roundFruit({ fill, stroke, leaf = true, shine = true }) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="g" cx="34%" cy="28%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.52"/>
          <stop offset="42%" stop-color="${fill}"/>
          <stop offset="100%" stop-color="${stroke}"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="55" r="36" fill="url(#g)" stroke="${stroke}" stroke-width="4"/>
      ${shine ? '<ellipse cx="37" cy="39" rx="9" ry="14" fill="#ffffff" opacity="0.22"/>' : ''}
      ${leaf ? `<path d="M53 22 C61 10 74 9 83 17 C71 20 62 24 53 22Z" fill="#4f9a3d" stroke="#2e6f2c" stroke-width="3"/><path d="M50 24 C48 17 45 12 40 8" fill="none" stroke="#6b3f21" stroke-width="5" stroke-linecap="round"/>` : ''}
    </svg>
  `);
}

export const fruitImages = [
  roundFruit({ fill: '#ff4d46', stroke: '#a9211d' }),
  roundFruit({ fill: '#ff9b2f', stroke: '#d96511' }),
  roundFruit({ fill: '#ffe25b', stroke: '#d7a617' }),
  roundFruit({ fill: '#8ed94f', stroke: '#3f8f2b' }),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M55 18 C64 9 73 9 81 15" fill="none" stroke="#4a8a36" stroke-width="6" stroke-linecap="round"/>
      <g fill="#8050bd" stroke="#523184" stroke-width="4">
        <circle cx="42" cy="30" r="16"/><circle cx="60" cy="32" r="16"/><circle cx="33" cy="51" r="16"/>
        <circle cx="52" cy="53" r="17"/><circle cx="69" cy="52" r="15"/><circle cx="50" cy="73" r="15"/>
      </g>
    </svg>
  `),
  roundFruit({ fill: '#4f70df', stroke: '#263f97', leaf: false }),
  roundFruit({ fill: '#ff9c94', stroke: '#dc5b68' }),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 15 C62 28 58 38 68 48 C82 62 72 91 50 91 C28 91 18 62 32 48 C42 38 38 28 50 15Z" fill="#c6db63" stroke="#7e9c35" stroke-width="4"/>
      <path d="M52 18 C59 9 67 8 76 13" fill="none" stroke="#4f9a3d" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `),
  roundFruit({ fill: '#753c9c', stroke: '#4a2369' }),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M46 24 C52 12 61 9 72 10 M56 26 C50 15 43 11 34 11" fill="none" stroke="#4f9a3d" stroke-width="5" stroke-linecap="round"/>
      <circle cx="36" cy="62" r="24" fill="#dd2338" stroke="#8f1426" stroke-width="4"/>
      <circle cx="68" cy="63" r="23" fill="#e8394c" stroke="#8f1426" stroke-width="4"/>
    </svg>
  `),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M12 39 C27 86 73 86 88 39Z" fill="#319c4d" stroke="#207236" stroke-width="4"/>
      <path d="M20 43 C34 73 66 73 80 43Z" fill="#df3d4d" stroke="#f8d9d9" stroke-width="4"/>
      <g fill="#1c1b1a"><circle cx="43" cy="57" r="3"/><circle cx="58" cy="58" r="3"/><circle cx="51" cy="69" r="3"/></g>
    </svg>
  `),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 91 C20 65 17 35 39 27 C45 25 49 27 50 31 C52 27 57 25 63 27 C85 35 80 66 50 91Z" fill="#e93546" stroke="#a61b28" stroke-width="4"/>
      <path d="M35 27 L50 9 L66 27 L51 22Z" fill="#4d9c4b" stroke="#2d7136" stroke-width="3"/>
      <g fill="#ffe088"><circle cx="41" cy="47" r="2.5"/><circle cx="58" cy="49" r="2.5"/><circle cx="49" cy="65" r="2.5"/></g>
    </svg>
  `),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 7 L58 31 L47 25 L38 33 L42 12Z" fill="#4d9c4b" stroke="#2d7136" stroke-width="3"/>
      <ellipse cx="50" cy="61" rx="30" ry="35" fill="#f0b93e" stroke="#b77722" stroke-width="4"/>
      <path d="M29 48 L71 74 M71 48 L29 74 M50 28 L50 94" fill="none" stroke="#b77722" stroke-width="3"/>
    </svg>
  `),
  roundFruit({ fill: '#ffa43d', stroke: '#df5632', leaf: false }),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="52" r="38" fill="#7b5a36" stroke="#4d3520" stroke-width="4"/>
      <circle cx="50" cy="52" r="22" fill="#e8f0a8" stroke="#7ebf42" stroke-width="5"/>
      <g fill="#1d1a18"><circle cx="40" cy="43" r="2.5"/><circle cx="60" cy="43" r="2.5"/><circle cx="40" cy="62" r="2.5"/><circle cx="60" cy="62" r="2.5"/></g>
    </svg>
  `),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="53" r="37" fill="#8a5a35" stroke="#4d3520" stroke-width="4"/>
      <g fill="#1d1a18"><circle cx="39" cy="43" r="4"/><circle cx="54" cy="39" r="4"/><circle cx="59" cy="54" r="4"/></g>
    </svg>
  `),
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M17 63 C45 89 81 74 87 25 C74 55 45 70 22 48Z" fill="#f8d645" stroke="#b88620" stroke-width="5" stroke-linejoin="round"/>
      <path d="M19 63 C48 78 74 63 86 26" fill="none" stroke="#b88620" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `),
  roundFruit({ fill: '#e84535', stroke: '#b5221c' }),
  roundFruit({ fill: '#95d46b', stroke: '#6aa33f', leaf: false }),
  roundFruit({ fill: '#bd2c47', stroke: '#711326' }),
];
