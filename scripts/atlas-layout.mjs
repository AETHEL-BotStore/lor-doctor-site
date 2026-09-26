import {entries, groups} from '../content/entries.mjs';
import {atlasRegions, atlasSpecs} from '../content/atlas.mjs';

const h = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const organInfo = {
  nose: {title:'Нос и пазухи', short:'Нос', verb:'Дыхание и обоняние', text:'Нос помогает дышать и чувствовать запахи. Пазухи и носоглотка связаны с соседними отделами.'},
  ear: {title:'Уши и слух', short:'Уши', verb:'Слух и равновесие', text:'Наружное, среднее и внутреннее ухо отвечают за слух и равновесие; слуховая труба ведет к носоглотке.'},
  throat: {title:'Горло и голос', short:'Горло', verb:'Глотание и речь', text:'Миндалины, глотка и гортань участвуют в глотании, дыхании и образовании голоса.'}
};
const featured = {
  nose:['blocked-nose','acute-sinusitis','allergic-rhinitis','nasal-polyps','nosebleed','nasal-fracture'],
  ear:['ear-pain','earwax','acute-otitis-media','tinnitus','blocked-ear','sudden-hearing-loss'],
  throat:['sore-throat','acute-tonsillitis','pharyngitis','laryngitis','snoring','persistent-hoarseness']
};
const bubbleLabels = {
  'blocked-nose':'Заложен нос', 'acute-sinusitis':'Синусит', 'allergic-rhinitis':'Аллергия',
  'nasal-polyps':'Полипы носа', nosebleed:'Кровь из носа', 'nasal-fracture':'Травма носа',
  'ear-pain':'Болит ухо', earwax:'Серная пробка', 'acute-otitis-media':'Средний отит',
  tinnitus:'Шум или писк', 'blocked-ear':'Заложило ухо', 'sudden-hearing-loss':'Резко упал слух',
  'sore-throat':'Болит горло', 'acute-tonsillitis':'Ангина', pharyngitis:'Фарингит',
  laryngitis:'Ларингит', snoring:'Храп', 'persistent-hoarseness':'Осиплость голоса'
};
const bySlug = Object.fromEntries(entries.map(entry => [entry.slug, entry]));
const organOf = entry => atlasRegions[atlasSpecs[entry.slug].region].organ;
const grouped = organ => entries.filter(entry => organOf(entry) === organ);

// Projected points on the front-facing illustrations. Internal structures are not visible on skin.
const projection = {
  sinuses:[50,35], maxillary:[64,46], frontal:[50,25], 'nasal-mucosa':[50,60], turbinates:[50,61],
  'nasal-cavity':[50,60], septum:[50,63], adenoid:[55,73], 'nasal-bone':[50,31], 'anterior-septum':[50,66],
  olfactory:[50,39], nasopharynx:[55,73],
  'middle-ear':[45,49], 'ear-canal':[45,49], eustachian:[45,54], eardrum:[45,49], mastoid:[51,72],
  cochlea:[45,49], vestibular:[57,35], ossicles:[45,49],
  tonsils:[37,29], pharynx:[50,36], larynx:[50,65], peritonsillar:[38,29], epiglottis:[50,48],
  'vocal-folds':[50,66], 'soft-palate':[50,17], airway:[50,71], salivary:[34,57], 'neck-node':[64,70]
};
const coord = region => projection[region] || [50,50];

function mapMarkup(depth, compact=false) {
  const pre = '../'.repeat(depth);
  const organButton = (id, extra='') => `<button class="ent-organ ent-organ--${id}${extra}" type="button" data-map-organ="${id}" aria-label="Показать заболевания: ${h(organInfo[id].title)}"><img src="${pre}assets/organs/${id}.png" alt="" loading="${compact?'lazy':'eager'}"><span>${h(organInfo[id].short)}</span></button>`;
  const bubbles = Object.entries(featured).map(([organ,slugs]) => `<div class="ent-bubbles ent-bubbles--${organ}" data-map-bubbles="${organ}" ${organ==='nose'?'':'hidden'}>${slugs.map((slug,i) => {
    const entry=bySlug[slug], spec=atlasSpecs[slug], region=atlasRegions[spec.region];
    return `<button class="ent-bubble ent-bubble--${i+1}" type="button" data-map-disease="${slug}" data-organ="${organ}" data-title="${h(entry.title)}" data-region="${h(region.label)}" data-note="${h(spec.note)}" aria-label="Подробнее: ${h(entry.title)}">${h(bubbleLabels[slug] || entry.title)}</button>`;
  }).join('')}</div>`).join('');
  return `<div class="ent-map ${compact?'ent-map--compact':''}" data-ent-map data-depth="${depth}" data-current-organ="nose">
    <div class="ent-map-canvas">
      <div class="ent-map-halo" aria-hidden="true"></div>
      <svg class="ent-map-connections" viewBox="0 0 1000 630" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ent-line-${depth}"><stop stop-color="#77aeb2"/><stop offset=".5" stop-color="#b8d6d0"/><stop offset="1" stop-color="#77aeb2"/></linearGradient></defs><path d="M 265 237 C 349 236 372 205 500 226 C 628 205 651 236 735 237"/><path d="M 500 265 C 500 354 500 360 500 439"/><path class="ent-line-soft" d="M 274 265 C 326 361 395 389 486 462 M 726 265 C 674 361 605 389 514 462"/><circle cx="500" cy="226" r="6"/><circle cx="265" cy="237" r="5"/><circle cx="735" cy="237" r="5"/><circle cx="500" cy="439" r="5"/></svg>
      ${organButton('ear',' ent-organ--left')}${organButton('nose')}${organButton('ear',' ent-organ--right')}${organButton('throat')}
      ${bubbles}
      <p class="ent-map-instruction">Наведите на орган или выберите его ниже</p>
    </div>
    <div class="ent-map-toolbar"><span>ОБЛАСТИ ВРАЧА</span><div role="group" aria-label="Выбрать орган">${Object.entries(organInfo).map(([id,o])=>`<button type="button" data-map-tab="${id}" aria-pressed="${id==='nose'}">${h(o.title)}</button>`).join('')}</div></div>
    <div class="ent-map-detail" data-map-detail hidden><div><span>ВЫБРАННАЯ ТЕМА <i aria-hidden="true"></i> <b data-map-detail-region></b></span><h3 data-map-detail-title></h3><p data-map-detail-note></p></div><div class="ent-map-detail-actions"><a data-map-zoom href="${compact?'atlas/#explore':'#explore'}">Рассмотреть ближе <span aria-hidden="true">↓</span></a><a data-map-detail-link href="#">Открыть статью <span aria-hidden="true">↗</span></a></div></div>
  </div>`;
}

export function homeAtlas() {
  return `<section class="section wrap home-atlas" id="atlas-preview"><div class="section-heading"><div><p class="section-kicker">ИНТЕРАКТИВНАЯ КАРТА</p><h2>Ухо, горло и нос связаны</h2></div><p>Наведите на орган или коснитесь его. Вокруг появятся заболевания и жалобы, с которыми обращаются к ЛОР-врачу.</p></div>${mapMarkup(0,true)}<div class="section-end"><a class="button button-outline" href="atlas/">Исследовать карту и все темы <span aria-hidden="true">↗</span></a></div></section>`;
}

export function homeAllLinks() {
  return `<section class="section wrap home-library" id="all-articles"><div class="section-heading"><div><p class="section-kicker">ВСЕ МАТЕРИАЛЫ</p><h2>Заболевания и частые жалобы</h2></div><p>Выберите тему по названию состояния или по жалобе. Все материалы также доступны через <a href="topics/">поиск в справочнике</a>.</p></div><div class="home-library-groups">${Object.entries(groups).map(([key,g])=>`<div class="home-library-group"><h3>${h(g.title)}</h3><ul>${entries.filter(e=>e.group===key).map(e=>`<li><a href="topics/${e.slug}/">${h(e.title)}<span aria-hidden="true">↗</span></a></li>`).join('')}</ul></div>`).join('')}</div></section>`;
}

export function articleVisual(entry) {
  const spec=atlasSpecs[entry.slug], region=atlasRegions[spec.region], organ=region.organ, [x,y]=coord(spec.region);
  return `<figure class="article-visual"><div class="article-visual-heading"><span class="section-kicker">ВИЗУАЛЬНАЯ КАРТА</span><h2>Связанная область: ${h(region.label)}</h2></div><div class="article-visual-content"><div class="article-visual-image" data-mode="${spec.mode}" style="--x:${x}%;--y:${y}%"><img src="../../assets/organs/${organ}.png" alt="${h(organInfo[organ].title)}: изображение органа спереди" loading="lazy" width="1536" height="1024"><span class="condition-effect" aria-hidden="true"></span><span class="article-visual-marker" aria-hidden="true"></span></div><div class="article-visual-copy"><span class="article-visual-tag">${h(organInfo[organ].title)}</span><h3>${h(entry.title)}</h3><p>${h(spec.note)}</p><a href="../../atlas/?condition=${entry.slug}#explore">Посмотреть на карте <span aria-hidden="true">↗</span></a></div></div><figcaption>Цвет и метка условно показывают тип изменения и ориентировочную проекцию области. Глубокие структуры на внешнем виде не видны; изображение не предназначено для самодиагностики.</figcaption></figure>`;
}

export function atlasPage({head,header,footer,appointment,siteName}) {
  const first=bySlug['acute-sinusitis'];
  const tabButtons=Object.entries(organInfo).map(([id,o])=>`<button type="button" class="atlas-organ-tab" data-organ-tab="${id}" aria-pressed="${id==='nose'}">${h(o.title)}</button>`).join('');
  const lists=Object.keys(organInfo).map(organ=>`<div class="atlas-organ-list" data-organ-list="${organ}" ${organ==='nose'?'':'hidden'}><p class="atlas-list-intro">${grouped(organ).length} тем в разделе</p>${grouped(organ).map(entry=>{
    const spec=atlasSpecs[entry.slug], region=atlasRegions[spec.region], [x,y]=coord(spec.region);
    return `<div class="atlas-disease-row" data-row="${entry.slug}" data-filter="${h([entry.title,...entry.queries].join(' ').toLowerCase())}"><button type="button" data-condition="${entry.slug}" data-title="${h(entry.title)}" data-region="${h(region.label)}" data-note="${h(spec.note)}" data-organ="${organ}" data-mode="${spec.mode}" data-x="${x}" data-y="${y}" aria-pressed="${entry.slug===first.slug}">${h(entry.title)}</button><a href="../topics/${entry.slug}/" aria-label="Читать статью: ${h(entry.title)}">↗</a></div>`;
  }).join('')}</div>`).join('');
  return `${head({title:`Интерактивная карта уха, горла и носа | ${siteName}`,description:'Интерактивная карта ЛОР-органов: реалистичные изображения носа и ушей, горло, связь между органами, заболевания и жалобы, ссылки на статьи.',depth:1,pathname:'atlas/',crumbs:[{name:'Главная',path:''},{name:'Интерактивная карта',path:'atlas/'}]})}<body>${header(1,'atlas')}<main id="main"><section class="atlas-hero wrap"><nav class="breadcrumbs" aria-label="Путь к странице"><a href="../">Главная</a><span aria-hidden="true">/</span><span>Карта ЛОР-органов</span></nav><div class="atlas-hero-copy"><p class="section-kicker">ИНТЕРАКТИВНАЯ КАРТА ЛОР-ОРГАНОВ</p><h1>Три области.<br><em>Одна система.</em></h1><p>Нос, уши и горло связаны. Выберите орган, чтобы увидеть частые заболевания и симптомы, а затем откройте подробный материал.</p><a class="button button-primary" href="#map">Исследовать карту <span aria-hidden="true">↓</span></a></div><div class="atlas-hero-stat"><span>03</span><strong>связанные области</strong><p>Наведите или нажмите на орган. Кружки вокруг него покажут темы для изучения.</p></div></section><section class="atlas-map-section" id="map"><div class="wrap"><div class="atlas-map-heading"><div><span>01 / ВИЗУАЛЬНАЯ КАРТА</span><h2>Выберите, что беспокоит</h2></div><p>Подсказки помогают найти материал и подготовиться к разговору с врачом. Диагноз устанавливают после осмотра.</p></div>${mapMarkup(1)}</div></section><section class="section wrap atlas-explore" id="explore"><div class="section-heading"><div><p class="section-kicker">РАССМОТРЕТЬ БЛИЖЕ</p><h2>Все заболевания и жалобы</h2></div><p>Выберите орган и тему. Изображение приблизится к связанной области, а рядом появится пояснение и ссылка на полную статью.</p></div><div class="atlas-tabs" role="group" aria-label="Выбор органа">${tabButtons}</div><div class="atlas-explorer"><div class="atlas-explorer-figure"><div class="atlas-figure-top"><span id="atlas-organ-name">Нос и пазухи</span><span>ВИД СПЕРЕДИ · ОРИЕНТИРОВОЧНАЯ ПРОЕКЦИЯ</span></div><div class="atlas-focus-image" data-focus-organ="nose" data-mode="inflammation" style="--x:50%;--y:35%"><img id="atlas-current-image" src="../assets/organs/nose.png" alt="Нос: изображение спереди" width="1536" height="1024"><span class="condition-effect" aria-hidden="true"></span><span id="atlas-focus-marker" class="atlas-focus-marker" aria-hidden="true"></span></div><div class="atlas-selected"><span class="atlas-selected-kicker">ВЫБРАННАЯ ТЕМА</span><h3 id="atlas-current-title">${h(first.title)}</h3><p id="atlas-current-region">${h(atlasRegions[atlasSpecs[first.slug].region].label)}</p><p id="atlas-current-note">${h(atlasSpecs[first.slug].note)}</p><a id="atlas-current-link" href="../topics/${first.slug}/">Читать материал полностью <span aria-hidden="true">↗</span></a></div></div><div class="atlas-explorer-index"><label for="atlas-search">Найти тему в выбранном разделе</label><input id="atlas-search" type="search" placeholder="Например, гайморит или заложенность" autocomplete="off"><div class="atlas-list-scroll">${lists}</div><p class="atlas-no-results" hidden>Тем не найдено. Попробуйте другой запрос.</p></div></div><p class="atlas-legend">Внешний вид органа и цветная метка помогают ориентироваться. Многие болезни затрагивают внутренние структуры, которые снаружи не видны. Изображение не показывает диагноз или назначение лечения.</p></section><section class="atlas-next"><div class="wrap atlas-next-inner"><div><p class="section-kicker">ДАЛЬШЕ ПО ТЕМЕ</p><h2>От карты — к понятному плану</h2><p>В каждой статье: симптомы, отличие похожих состояний, первые шаги и признаки, когда помощь нужна срочно.</p></div><a class="button button-primary" href="../topics/">Весь справочник <span aria-hidden="true">↗</span></a></div></section>${appointment(1,true)}</main>${footer(1)}</body></html>`;
}
