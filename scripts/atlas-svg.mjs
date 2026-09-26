import {atlasRegions, atlasSpecs, modeLabels} from '../content/atlas.mjs';

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const anatomy = {
  nose: `<g fill="none" stroke="#48798a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M167 91 Q225 55 341 85 Q430 112 458 197 Q483 270 445 354 Q425 403 364 412"/>
    <path d="M167 91 Q181 135 164 174 L120 274 Q109 296 148 300 L174 302 Q170 344 202 364 Q245 390 333 381"/>
    <path d="M173 183 Q211 175 246 194 Q299 202 357 188 L421 188 Q453 201 446 229"/>
    <path d="M145 313 Q187 303 231 319 Q272 330 309 308 Q343 288 389 295 L437 293"/>
    <path d="M177 229 Q201 240 227 246 Q259 259 307 244 Q354 225 416 245"/>
    <path d="M188 260 Q218 274 252 275 Q301 273 329 258"/>
    <path d="M192 289 Q224 306 260 296"/>
    <path d="M357 188 Q377 169 399 189 Q407 205 396 222"/>
    <path d="M389 295 Q402 315 398 345 L391 390"/>
  </g>
  <path d="M171 214 Q160 231 169 250" fill="none" stroke="#a4cbd0" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="273" cy="112" rx="36" ry="21" fill="#d7edf0" stroke="#6e9fa9" stroke-width="3"/>
  <path d="M251 234 Q275 214 315 231 Q335 250 319 279 Q285 297 253 279 Q239 262 251 234Z" fill="#d7edf0" stroke="#6e9fa9" stroke-width="3"/>
  <path d="M354 247 Q370 239 382 252 Q382 270 361 268Z" fill="#c8e5e7" stroke="#6e9fa9" stroke-width="3"/>
  <path d="M147 317 Q172 308 196 321" fill="none" stroke="#e4b6aa" stroke-width="8" stroke-linecap="round"/>
  <text x="117" y="405" class="small-label">НОС И ПАЗУХИ · СХЕМА СБОКУ</text>`,
  ear: `<g fill="none" stroke="#4b7d8d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M150 271 Q105 243 110 177 Q116 118 167 106 Q219 98 247 147 Q264 174 246 204"/>
    <path d="M147 271 Q129 300 157 332 Q182 355 211 333 Q225 319 221 292"/>
    <path d="M160 254 Q132 206 156 174 Q172 152 199 165 Q223 181 211 205 Q194 224 180 210"/>
    <path d="M171 261 Q217 228 285 237"/>
    <path d="M294 201 Q300 242 288 280" stroke="#a06665" stroke-width="8"/>
    <path d="M306 197 Q321 215 339 208 Q352 200 361 218 Q368 228 378 222" stroke="#bd9580" stroke-width="8"/>
    <path d="M350 260 Q365 287 389 308 L420 364" stroke="#7aaebb" stroke-width="13"/>
    <path d="M399 147 Q410 110 443 126 Q466 147 446 171 Q421 190 400 168 Q378 137 401 118 Q420 93 454 103" stroke="#75acb5" stroke-width="10"/>
    <path d="M420 240 C465 211 485 251 451 281 C419 309 394 272 421 254 C447 240 457 263 439 271" stroke="#75acb5" stroke-width="12"/>
    <path d="M467 249 Q498 240 523 260" stroke="#8bb7bd" stroke-width="6"/>
  </g>
  <path d="M310 290 Q327 319 322 353 Q303 376 280 369" fill="none" stroke="#afced0" stroke-width="16" stroke-linecap="round"/>
  <text x="117" y="405" class="small-label">УХО · СХЕМАТИЧЕСКИЙ РАЗРЕЗ</text>`,
  throat: `<g fill="none" stroke="#4b7d8d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M184 88 Q263 54 353 97 Q407 140 420 211 Q432 310 397 400"/>
    <path d="M184 88 Q192 152 169 189 Q147 220 180 242 L226 254 Q239 315 271 392"/>
    <path d="M182 242 Q221 222 255 232 L313 240 Q341 234 353 207 L354 149"/>
    <path d="M245 143 Q279 158 310 161 Q329 162 346 152" stroke="#9bbec0" stroke-width="9"/>
    <path d="M314 180 Q329 190 332 214" stroke="#b89189" stroke-width="11"/>
    <path d="M345 197 Q367 225 361 258 Q344 279 343 297"/>
    <path d="M320 268 Q335 267 345 282" stroke="#a1857c" stroke-width="9"/>
    <path d="M333 296 Q314 317 335 370 Q352 391 378 378"/>
    <path d="M356 304 L356 393" stroke="#7daeb9" stroke-width="15"/>
    <path d="M335 343 Q354 332 376 343" stroke="#d79889" stroke-width="10"/>
  </g>
  <ellipse cx="296" cy="222" rx="15" ry="23" fill="#d9e9e9" stroke="#8cafa9" stroke-width="3"/>
  <ellipse cx="242" cy="290" rx="27" ry="21" fill="#d9e9e9" stroke="#8cafa9" stroke-width="3"/>
  <ellipse cx="273" cy="340" rx="12" ry="18" fill="#d9e9e9" stroke="#8cafa9" stroke-width="3"/>
  <text x="117" y="405" class="small-label">ГОРЛО И ГОРТАНЬ · СХЕМА СБОКУ</text>`
};

function marker(mode, x, y) {
  const common = `transform="translate(${x} ${y})"`;
  if (mode === 'field') return `<g ${common}><circle r="41" fill="#f1d6b0" opacity=".35"/><circle r="27" fill="none" stroke="#d58f61" stroke-width="3" stroke-dasharray="5 6"/><circle r="7" fill="#bd735e"/></g>`;
  if (mode === 'inflammation') return `<g ${common}><circle r="29" fill="#e9a392" opacity=".35"/><path d="M-24 0 Q-15 -16 -7 0 T10 0 T26 0" fill="none" stroke="#c77369" stroke-width="6" stroke-linecap="round"/><circle r="7" fill="#c77369"/></g>`;
  if (mode === 'swelling') return `<g ${common}><ellipse rx="31" ry="23" fill="#e8a89d" opacity=".65" stroke="#c77770" stroke-width="2"/><path d="M-14 0H14" stroke="#fff" stroke-width="3"/></g>`;
  if (mode === 'growth') return `<g ${common}><path d="M-22 15Q-34 -3 -17 -13Q-10 -28 4 -16Q23 -25 28 -5Q35 17 15 20Q2 29 -22 15Z" fill="#c68989" opacity=".9" stroke="#a36570" stroke-width="2"/><circle cx="-4" cy="-3" r="5" fill="#eed0c7"/></g>`;
  if (mode === 'deviation') return `<g ${common}><path d="M-24 -29Q-6 -11 8 0Q20 12 23 29" fill="none" stroke="#c7756b" stroke-width="7"/><path d="M-1 -33V32" fill="none" stroke="#8cabb4" stroke-width="3" stroke-dasharray="5 5"/></g>`;
  if (mode === 'fracture') return `<g ${common}><path d="M-29 -22L-6 -4L4 -17L30 14" fill="none" stroke="#be7068" stroke-width="8"/><path d="M-3 4L13 23" fill="none" stroke="#be7068" stroke-width="5"/></g>`;
  if (mode === 'bleeding') return `<g ${common}><path d="M0 -30C-10 -10 -17 -3 -17 9A17 17 0 0 0 17 9C17 -3 10 -10 0 -30Z" fill="#bf6f67"/><path d="M-6 5Q-7 13 0 17" fill="none" stroke="#efc3b7" stroke-width="4"/></g>`;
  if (mode === 'perforation') return `<g ${common}><circle r="25" fill="#d9a9a0" stroke="#ad6868" stroke-width="3"/><circle r="11" fill="#f7f5ee" stroke="#ad6868" stroke-width="2"/></g>`;
  if (mode === 'fluid') return `<g ${common}><circle r="29" fill="#a6ced8" opacity=".65" stroke="#619ba8" stroke-width="2"/><path d="M-24 7Q-12 2 0 7T24 7" fill="none" stroke="#4f95a5" stroke-width="4"/><circle cy="-8" cx="6" r="4" fill="#fff"/></g>`;
  if (mode === 'blockage') return `<g ${common}><path d="M-25 -20L25 20M25 -20L-25 20" stroke="#bc7770" stroke-width="8" stroke-linecap="round"/><circle r="32" fill="none" stroke="#bc7770" stroke-width="2"/></g>`;
  if (mode === 'motion' || mode === 'vibration') return `<g ${common}><circle r="7" fill="#aa7777"/><path d="M-29 -12Q-39 0 -29 12M29 -12Q39 0 29 12M-20 -22Q-33 -9 -20 4M20 -22Q33 -9 20 4" fill="none" stroke="#b88975" stroke-width="3" stroke-linecap="round"/></g>`;
  if (mode === 'flow') return `<g ${common}><path d="M-30 -18Q0 -20 10 0T30 18" fill="none" stroke="#6dabb6" stroke-width="8" stroke-linecap="round"/><path d="M19 11L31 19L20 25" fill="none" stroke="#6dabb6" stroke-width="4"/></g>`;
  if (mode === 'signal') return `<g ${common}><circle r="26" fill="#d1e5e4"/><path d="M-24 2H-13L-5 -14L3 14L12 -7L18 2H27" fill="none" stroke="#a07379" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  if (mode === 'pressure') return `<g ${common}><path d="M-33 0H-10M-19 -10L-9 0L-19 10M33 0H10M19 -10L9 0L19 10" fill="none" stroke="#bc8670" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  return `<g ${common}><circle r="19" fill="#b78478"/><circle r="6" fill="#fff2e8"/></g>`;
}

export function organSvg(organ, spec, title, id='diagram') {
  const region = atlasRegions[spec.region];
  if (!region || region.organ !== organ) throw new Error(`Invalid atlas region for ${title}`);
  const {x,y,label} = region;
  const boxY = Math.max(65, Math.min(340, y - 54));
  const labelText = label.length > 24 ? `<text x="589" y="${boxY + 43}" class="region-label">${esc(label.slice(0,24))}</text><text x="589" y="${boxY + 66}" class="region-label">${esc(label.slice(24).trim())}</text>` : `<text x="589" y="${boxY + 53}" class="region-label">${esc(label)}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 470" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(title)}: схематическая область</title><desc id="${id}-desc">${esc(spec.note)} Не является изображением конкретного пациента или способом постановки диагноза.</desc><style>.small-label{font:600 13px Arial,sans-serif;letter-spacing:1.2px;fill:#537d88}.region-label{font:600 18px Arial,sans-serif;fill:#173f4c}.meta-label{font:500 14px Arial,sans-serif;fill:#63838a}</style><rect width="900" height="470" rx="30" fill="#f5faf8"/><path d="M73 56H530" stroke="#d6e8e6" stroke-width="2"/><circle cx="308" cy="242" r="171" fill="#e8f3f1" opacity=".65"/>${anatomy[organ]}${marker(spec.mode,x,y)}<path d="M${x+29} ${y-11}Q${Math.max(x+75,520)} ${y-38} 565 ${boxY+52}" fill="none" stroke="#a67570" stroke-width="2.5" stroke-dasharray="5 6"/><circle cx="${x}" cy="${y}" r="4" fill="#863f4c"/><rect x="565" y="${boxY}" width="285" height="93" rx="19" fill="#fff" stroke="#d8e5df"/><text x="589" y="${boxY+26}" class="meta-label">ЗОНА ВНИМАНИЯ · ${esc(modeLabels[spec.mode]).toUpperCase()}</text>${labelText}<text x="566" y="433" class="meta-label">Схема для ориентации · Не показывает клинический диагноз</text></svg>`;
}

export function visualFor(entry) {
  const spec = atlasSpecs[entry.slug];
  if (!spec) throw new Error(`No atlas specification for ${entry.slug}`);
  return {spec, organ:atlasRegions[spec.region].organ, svg:organSvg(atlasRegions[spec.region].organ,spec,entry.title,`atlas-${entry.slug}`)};
}
