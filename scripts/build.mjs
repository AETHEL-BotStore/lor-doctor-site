import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {entries, groups, sources} from '../content/entries.mjs';
import {atlasRegions, atlasSpecs} from '../content/atlas.mjs';
import {homeAtlas, homeAllLinks, articleVisual, atlasPage} from './atlas-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs');
const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const h = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const txt = value => h(value).replace(/\n/g, '<br>');
const doctor = config.doctorName || 'Имя врача уточняется';
const siteName = config.doctorName ? `${config.doctorName} — ЛОР-врач` : 'ЛОР-врач — персональный сайт';
const origin = config.siteUrl ? config.siteUrl.replace(/\/?$/, '/') : '';
const publishReady = Boolean(origin && config.doctorName && config.city && (config.phone || config.medsiUrl || config.botUrl) && config.medicalReviewCompleted);
const url = p => origin ? new URL(p, origin).href : '';
const relative = (depth, p='') => '../'.repeat(depth) + p;
const icon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23103349'/%3E%3Cpath d='M19 17v17c0 12 7 17 13 17s13-5 13-17V17M19 32h26' fill='none' stroke='%2396ded7' stroke-width='5' stroke-linecap='round'/%3E%3C/svg%3E";
function ensure(p) { fs.mkdirSync(path.dirname(p), {recursive:true}); }
function write(p, body) { const target=path.join(out,p); ensure(target); fs.writeFileSync(target, body, 'utf8'); }
function schema(obj) { return `<script type="application/ld+json">${json({'@context':'https://schema.org',...obj})}</script>`; }
function head({title,description,depth=0,pathname='',type='website',crumbs=[],notFound=false}) {
  const canonical = publishReady ? `<link rel="canonical" href="${h(url(pathname))}">` : '';
  const ogUrl = publishReady ? `<meta property="og:url" content="${h(url(pathname))}">` : '';
  const breadcrumb = publishReady && crumbs.length ? schema({'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:url(c.path)}))}) : '';
  const webPage = schema({'@type':type === 'article' ? 'MedicalWebPage' : 'WebPage',name:title,description, inLanguage:'ru-RU', ...(publishReady ? {url:url(pathname)} : {})});
  const asset = p => notFound && origin ? url(p) : relative(depth,p);
  return `<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="theme-color" content="#103349">\n<meta name="robots" content="${publishReady?'index, follow':'noindex, follow'}">\n<title>${h(title)}</title>\n<meta name="description" content="${h(description)}">\n${canonical}\n<link rel="icon" type="image/svg+xml" href="${icon}">\n<meta property="og:type" content="${type === 'article'?'article':'website'}">\n<meta property="og:locale" content="ru_RU">\n<meta property="og:site_name" content="${h(siteName)}">\n<meta property="og:title" content="${h(title)}">\n<meta property="og:description" content="${h(description)}">\n${ogUrl}\n<meta name="twitter:card" content="summary">\n<link rel="stylesheet" href="${asset('assets/site.css')}">\n<link rel="stylesheet" href="${asset('assets/extra.css')}">\n<link rel="stylesheet" href="${asset('assets/atlas.css')}">\n${webPage}${breadcrumb}\n</head>`;
}
function brand(depth, home=relative(depth)){return `<a class="brand" href="${home}" aria-label="Главная страница"><span class="brand-mark">Л</span><span>ЛОР<span class="brand-light">-врач</span><small>Персональный сайт специалиста</small></span></a>`;}
function header(depth,active='') { const home=active==='not-found'?(origin||'index.html'):relative(depth); const topic=active==='not-found'?(origin?url('topics/'):'topics/'):relative(depth,'topics/'); return `<a class="skip" href="#main">К содержанию</a><header class="site-header"><div class="wrap header-inner">${brand(depth,home)}<nav class="desktop-nav" aria-label="Основная навигация"><a href="${home}#about">О враче</a><a href="${active==='not-found'&&origin?url('atlas/'):relative(depth,'atlas/')}" ${active==='atlas'?'aria-current="page"':''}>Атлас</a><a href="${topic}" ${active==='topics'?'aria-current="page"':''}>Темы и симптомы</a><a href="${home}#appointment">Запись</a></nav><a class="header-link" href="${home}#appointment">Как записаться <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button></div><nav class="mobile-nav" id="mobile-nav" aria-label="Мобильная навигация" hidden><a href="${home}#about">О враче</a><a href="${active==='not-found'&&origin?url('atlas/'):relative(depth,'atlas/')}" ${active==='atlas'?'aria-current="page"':''}>Атлас</a><a href="${topic}" >Темы и симптомы</a><a href="${home}#appointment">Запись</a></nav></header>`; }
function footer(depth,notFound=false){const home=notFound?(origin||'index.html'):relative(depth); const topic=notFound?(origin?url('topics/'):'topics/'):relative(depth,'topics/'); const script=notFound&&origin?url('assets/site.js'):relative(depth,'assets/site.js'); return `<footer class="site-footer"><div class="wrap footer-grid"><div>${brand(depth,home)}<p>Информация помогает ориентироваться в симптомах и не заменяет осмотр и индивидуальные рекомендации врача.</p></div><div><strong>Разделы</strong><a href="${notFound&&origin?url('atlas/'):relative(depth,'atlas/')}">Анатомический атлас</a><a href="${topic}" >Заболевания и жалобы</a><a href="${home}#about">О враче</a><a href="${home}#appointment">Запись</a></div><div><strong>Важно</strong><p>При угрозе дыханию, сильном кровотечении или внезапной потере слуха обращайтесь за неотложной помощью.</p></div></div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} ${h(siteName)}</span><span>Независимый персональный сайт врача. Не является официальным сайтом ${h(config.clinicName)}.</span></div></footer><script src="${script}" defer></script><script src="${notFound&&origin?url('assets/atlas.js'):relative(depth,'assets/atlas.js')}" defer></script>`;}
function bookingCards(){
  const actions = [
    {label:'Позвонить врачу',caption:'Номер телефона',url:config.phone ? `tel:${config.phone.replace(/[^+\d]/g,'')}` : '',display:config.phone || 'Номер добавим позже'},
    {label:'Записаться через МЕДСИ',caption:'Приложение и запись в клинике',url:config.medsiUrl,display:config.medsiUrl?'Перейти к записи':'Ссылка появится позже'},
    {label:'Онлайн-консультация',caption:'Через бот врача',url:config.botUrl,display:config.botUrl?'Открыть бот':'Ссылка появится позже'},
    {label:'Блог и сообщения',caption:'Instagram врача',url:config.instagramUrl,display:config.instagramUrl?'Открыть Instagram':'Ссылка появится позже'}
  ];
  return actions.map(a=>`<div class="booking-card"><span class="booking-caption">${h(a.caption)}</span><h3>${h(a.label)}</h3>${a.url ? `<a href="${h(a.url)}" ${a.url.startsWith('http')?'target="_blank" rel="noopener noreferrer"':''}>${h(a.display)} <span aria-hidden="true">↗</span></a>` : `<span class="booking-unavailable">${h(a.display)}</span>`}</div>`).join('');
}
function appointment(depth,compact=false){return `<section class="appointment-band ${compact?'appointment-compact':''}" id="appointment"><div class="wrap"><div class="section-heading"><div><p class="section-kicker">ЗАПИСЬ И СВЯЗЬ</p><h2>Обсудим ваши симптомы и дальнейшие шаги</h2></div><p>Прием в ${h(config.clinicName)} и онлайн-консультация. Способы связи станут активны после получения контактов врача.</p></div><div class="booking-grid">${bookingCards()}</div></div></section>`;}
function about(depth,compact=false){
  const focus=Array.isArray(config.focusAreas)?config.focusAreas.filter(Boolean):[];
  const pending=!config.doctorName||!config.education||!config.experience||!focus.length;
  return `<section class="section wrap about-section ${compact?'about-compact':''}" id="about"><div class="about-layout"><div><p class="section-kicker">О СПЕЦИАЛИСТЕ</p><h2>${config.doctorName ? h(config.doctorName) : 'Врач-оториноларинголог'}</h2><p class="section-intro">Помогает разобраться с заболеваниями уха, горла и носа: от частых жалоб до ситуаций, когда нужен углубленный осмотр и маршрут к профильной помощи.</p>${pending?'<p class="about-note">Подтвержденные сведения об образовании, стаже и направлениях работы будут добавлены после согласования с врачом.</p>':''}</div><div class="profile-facts"><div><span>Специальность</span><strong>Оториноларингология</strong></div><div><span>Клиника</span><strong>${h(config.clinicName)}</strong></div><div><span>Опыт работы</span><strong>${config.experience?h(config.experience):'Уточняется'}</strong></div><div><span>Образование</span><strong>${config.education?h(config.education):'Уточняется'}</strong></div><div><span>Направления работы</span><strong>${focus.length?h(focus.join(', ')):'Уточняются'}</strong></div><div><span>Город приема</span><strong>${config.city?h(config.city):'Уточняется'}</strong></div></div></div></section>`;
}
const card = (e,depth)=>`<a class="topic-card" href="${relative(depth,`topics/${e.slug}/`)}"><span class="topic-card-group">${h(groups[e.group].title)}</span><h3>${h(e.title)}</h3><p>${h(e.intro)}</p><span class="topic-card-link">Читать материал <span aria-hidden="true">↗</span></span></a>`;
const featuredSlugs=['sore-throat','blocked-nose','ear-pain','blocked-ear','nasal-fracture','acute-sinusitis'];
const relatedMap={
  'sore-throat':['acute-tonsillitis','pharyngitis','peritonsillar-abscess','laryngitis'],
  'blocked-nose':['allergic-rhinitis','acute-sinusitis','nasal-polyps','deviated-septum'],
  'ear-pain':['acute-otitis-media','otitis-externa','ear-barotrauma','eardrum-perforation'],
  'blocked-ear':['earwax','eustachian-tube-dysfunction','otitis-media-effusion','sudden-hearing-loss'],
  'nasal-fracture':['nosebleed','deviated-septum','septal-perforation','one-sided-nasal-symptoms'],
  'ear-discharge':['otitis-externa','chronic-otitis-media','eardrum-perforation','cholesteatoma'],
  'long-runny-nose':['allergic-rhinitis','chronic-sinusitis','nasal-polyps','medication-rhinitis'],
  'globus':['laryngopharyngeal-reflux','postnasal-drip','swallowing-difficulty','persistent-hoarseness'],
  'one-sided-nasal-symptoms':['deviated-septum','maxillary-sinusitis','nasal-polyps','nosebleed'],
  'child-ent':['adenoid-hypertrophy','adenoiditis','acute-otitis-media','otitis-media-effusion'],
  'sudden-hearing-loss':['blocked-ear','tinnitus','labyrinthitis','earwax'],
  'acute-tonsillitis':['sore-throat','recurrent-tonsillitis','peritonsillar-abscess','pharyngitis'],
  'acute-sinusitis':['maxillary-sinusitis','frontal-sinusitis','blocked-nose','chronic-sinusitis'],
  'tinnitus':['gradual-hearing-loss','sudden-hearing-loss','meniere','earwax'],
  'snoring':['sleep-apnea','adenoid-hypertrophy','deviated-septum','nasal-polyps']
};
function relatedFor(e){
  const selected=(relatedMap[e.slug]||[]).map(slug=>entries.find(x=>x.slug===slug)).filter(Boolean);
  for(const x of entries.filter(x=>x.group===e.group && x.slug!==e.slug)){
    if(selected.length===4) break;
    if(!selected.includes(x)) selected.push(x);
  }
  return selected.slice(0,4);
}
function home(){
 const featured=featuredSlugs.map(s=>entries.find(e=>e.slug===s)).filter(Boolean);
 const description='Консультация ЛОР-врача в МЕДСИ: помощь при заболеваниях уха, горла и носа, симптомы, когда обращаться к врачу и способы записи.';
 return `${head({title:`ЛОР-врач: консультации и заболевания уха, горла и носа | ${siteName}`,description,pathname:''})}<body>${header(0)}<main id="main"><section class="hero wrap"><div class="hero-copy"><p class="eyebrow"><span class="eyebrow-line"></span> ОТОРИНОЛАРИНГОЛОГИЯ · ПРИЕМ В ${h(config.clinicName).toUpperCase()}</p><h1>Когда беспокоят ухо, горло или нос — нужен <em>понятный план</em></h1><p class="hero-lead">Разобраться в симптомах, найти причину и выбрать дальнейшие шаги вместе с ЛОР-врачом. Без лишней тревоги и лечения наугад.</p><div class="hero-actions"><a class="button button-primary" href="#appointment">Варианты записи <span aria-hidden="true">↗</span></a><a class="text-link" href="topics/">Посмотреть все темы <span aria-hidden="true">↗</span></a></div><div class="hero-note"><span class="note-icon" aria-hidden="true">i</span><span>При затруднении дыхания, сильном кровотечении или внезапной потере слуха нужна срочная медицинская помощь.</span></div></div><aside class="hero-panel" aria-labelledby="panel-title"><div class="panel-head"><span class="panel-kicker">НАВИГАЦИЯ ПО СИМПТОМАМ</span><span class="panel-symbol" aria-hidden="true">✳</span></div><h2 id="panel-title">С чего начать?</h2><p>Выберите жалобу и узнайте, что может быть причиной и когда стоит обратиться к врачу.</p><div class="symptom-list"><a href="topics/blocked-nose/"><span>Заложен нос</span><span aria-hidden="true">↗</span></a><a href="topics/sore-throat/"><span>Болит горло</span><span aria-hidden="true">↗</span></a><a href="topics/ear-pain/"><span>Болит ухо</span><span aria-hidden="true">↗</span></a><a href="topics/sudden-hearing-loss/"><span>Внезапно снизился слух</span><span aria-hidden="true">↗</span></a></div><div class="panel-bottom"><span class="small-pulse" aria-hidden="true"></span> Материалы для первичной ориентации</div></aside></section><section class="intro-strip"><div class="wrap strip-grid"><div><strong>01</strong><span>Внимание к вашим жалобам</span></div><div><strong>02</strong><span>Осмотр и объяснение причин</span></div><div><strong>03</strong><span>План дальнейших действий</span></div></div></section>${about(0)}${homeAtlas()}<section class="section topics-preview wrap" id="topics"><div class="section-heading"><div><p class="section-kicker">ПОЛЕЗНЫЕ МАТЕРИАЛЫ</p><h2>Найдите ответ на свой вопрос</h2></div><p>Каждый материал объясняет конкретную жалобу или заболевание: признаки, первые шаги, обследование и ситуации, когда нельзя ждать.</p></div><div class="topic-grid">${featured.map(e=>card(e,0)).join('')}</div><div class="section-end"><a class="button button-outline" href="topics/">Открыть все материалы <span aria-hidden="true">↗</span></a></div></section>${homeAllLinks()}${appointment(0)}<section class="section wrap editorial-note"><p class="section-kicker">О МАТЕРИАЛАХ</p><h2>Понятно, проверяемо, без самодиагностики</h2><p>Страницы подготовлены как справочные материалы на основе открытых источников NHS и ENT Health. Перед публичным запуском тексты и сведения о специалисте должны пройти проверку врача. Диагноз и лечение определяются индивидуально после осмотра.</p></section></main>${footer(0)}</body></html>`;
}
function topics(){
 const description='Справочник ЛОР-врача: заболевания и жалобы со стороны носа, пазух, уха, слуха, горла и голоса. Симптомы, первые шаги и поводы обратиться за помощью.';
 const sections=Object.entries(groups).map(([key,g])=>`<section class="directory-group" id="${key}"><div class="directory-title"><h2>${h(g.title)}</h2><p>${h(g.description)}</p></div><div class="directory-list">${entries.filter(e=>e.group===key).map(e=>`<a class="directory-item" href="${e.slug}/" data-search="${h([e.title,...e.queries].join(' ').toLowerCase())}"><span>${h(e.title)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`).join('');
 return `${head({title:`Заболевания и симптомы ЛОР-органов | ${siteName}`,description,depth:1,pathname:'topics/',crumbs:[{name:'Главная',path:''},{name:'Темы и симптомы',path:'topics/'}]})}<body>${header(1,'topics')}<main id="main"><div class="wrap directory-main"><nav class="breadcrumbs" aria-label="Путь к странице"><a href="../">Главная</a><span aria-hidden="true">/</span><span>Темы и симптомы</span></nav><p class="section-kicker">СПРАВОЧНИК</p><h1>Заболевания и жалобы</h1><p class="directory-lead">Выберите тему или начните с привычного описания симптома. Материалы помогают подготовиться к разговору с врачом и понять, когда помощь нужна быстрее.</p><div class="directory-search"><label for="topic-search">Поиск по темам</label><input id="topic-search" type="search" placeholder="Например, болит ухо или гайморит" autocomplete="off"><p id="search-count" aria-live="polite">${entries.length} материалов</p></div><nav class="group-jump" aria-label="Разделы справочника">${Object.entries(groups).map(([key,g])=>`<a href="#${key}">${h(g.title)}</a>`).join('')}</nav>${sections}<p class="empty-search" hidden>Ничего не найдено. Попробуйте другое название жалобы или заболевания.</p></div>${appointment(1,true)}</main>${footer(1)}</body></html>`;
}
function page(e){
 const depth=2; const title=`${e.title}: симптомы, что делать и когда к ЛОР-врачу | ${siteName}`;
 const description=`${e.title}: ${e.intro} Признаки, первые шаги, обследование и поводы для срочного обращения.`.slice(0,220);
 const related=relatedFor(e);
 const s=sources[e.source] || sources.ent;
 const isUrgent=['epiglottitis','mastoiditis','peritonsillar-abscess','sudden-hearing-loss'].includes(e.slug);
 return `${head({title,description,depth,pathname:`topics/${e.slug}/`,type:'article',crumbs:[{name:'Главная',path:''},{name:'Темы и симптомы',path:'topics/'},{name:e.title,path:`topics/${e.slug}/`}]})}<body>${header(depth,'topics')}<main id="main"><div class="wrap article-wrap"><nav class="breadcrumbs" aria-label="Путь к странице"><a href="../../">Главная</a><span aria-hidden="true">/</span><a href="../">Темы и симптомы</a><span aria-hidden="true">/</span><span>${h(e.title)}</span></nav><div class="article-heading"><div><p class="section-kicker">${h(groups[e.group].title).toUpperCase()}</p><h1>${h(e.title)}</h1><p class="article-lead">${h(e.intro)}</p><div class="article-actions"><a class="button button-primary" href="#appointment">Как записаться <span aria-hidden="true">↗</span></a><a class="text-link" href="#signs">Читать о симптомах <span aria-hidden="true">↓</span></a></div></div><aside class="quick-card ${isUrgent?'quick-urgent':''}"><span class="quick-label">КОГДА НЕЛЬЗЯ ЖДАТЬ</span><p>${h(e.urgent)}</p><span>При экстренных симптомах обращайтесь за неотложной помощью, не ожидая плановой записи.</span></aside></div>${articleVisual(e)}<div class="article-grid"><article class="article-body"><section id="signs"><h2>Как это проявляется</h2><p>Обратите внимание на сочетание признаков и то, как они меняются со временем:</p><ul class="sign-list">${e.signs.map(x=>`<li>${h(x)}</li>`).join('')}</ul></section><section><h2>Что важно отличить</h2><p>${h(e.difference)}</p></section><section><h2>Что можно сделать до осмотра</h2><p>${h(e.before)}</p></section><section><h2>Как уточняют причину и выбирают лечение</h2><p>${h(e.plan)}</p><p>Решение о лекарствах, обследованиях и процедурах зависит от осмотра, возраста, сопутствующих болезней и противопоказаний. Дистанционно по описанию симптомов надежный диагноз поставить нельзя.</p></section><section class="article-warning"><h2>Когда обращаться срочно</h2><p>${h(e.urgent)}</p></section><section class="article-source"><h2>Источник и проверка</h2><p>Материал опирается на открытые сведения из <a href="${h(s.url)}" target="_blank" rel="noopener noreferrer">${h(s.title)}</a>. Текст подготовлен для первичной ориентации и ожидает медицинской проверки специалистом до публикации.</p></section></article><aside class="article-aside"><div class="aside-card"><span class="section-kicker">ЛОР-КОНСУЛЬТАЦИЯ</span><h3>Нужен индивидуальный план?</h3><p>Осмотр помогает отличить похожие причины симптомов и выбрать лечение именно для вашей ситуации.</p><a href="#appointment">Варианты записи <span aria-hidden="true">↗</span></a></div><div class="aside-card aside-related"><span class="section-kicker">ПО ТЕМЕ</span>${related.map(x=>`<a href="../${x.slug}/">${h(x.title)} <span aria-hidden="true">↗</span></a>`).join('')}</div></aside></div></div>${about(depth,true)}${appointment(depth,true)}<section class="section wrap more-topics"><div class="section-heading"><div><p class="section-kicker">ПРОДОЛЖИТЬ ЧТЕНИЕ</p><h2>Смежные темы</h2></div><a class="text-link" href="../">Весь справочник <span aria-hidden="true">↗</span></a></div><div class="related-grid">${related.map(x=>`<a href="../${x.slug}/">${h(x.title)} <span aria-hidden="true">↗</span></a>`).join('')}</div></section></main>${footer(depth)}</body></html>`;
}

if (new Set(entries.map(e=>e.slug)).size !== entries.length) throw new Error('Duplicate slugs');
if (entries.some(e=>!groups[e.group] || !e.title || e.signs.length<3)) throw new Error('Invalid content record');
if (entries.some(e=>!atlasSpecs[e.slug] || !atlasRegions[atlasSpecs[e.slug].region])) throw new Error('Atlas entry missing');
fs.mkdirSync(out,{recursive:true});
const topicsDir=path.join(out,'topics');
if (fs.existsSync(topicsDir)) fs.rmSync(topicsDir,{recursive:true,force:true});
write('index.html',home());
write('topics/index.html',topics());
write('atlas/index.html',atlasPage({head,header,footer,appointment,siteName}));
for (const e of entries) {
  write(`topics/${e.slug}/index.html`,page(e));
}
write('robots.txt',`User-agent: *\nAllow: /\n${publishReady?`Sitemap: ${url('sitemap.xml')}\n`:''}`);
if (publishReady) {
  const paths=['','atlas/','topics/',...entries.map(e=>`topics/${e.slug}/`)];
  write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${h(url(p))}</loc></url>`).join('')}</urlset>`);
} else if (fs.existsSync(path.join(out,'sitemap.xml'))) fs.rmSync(path.join(out,'sitemap.xml'));
write('404.html',`${head({title:'Страница не найдена | ЛОР-врач',description:'Такой страницы нет. Перейдите на главную или в справочник заболеваний и симптомов.',notFound:true})}<body>${header(0,'not-found')}<main id="main" class="wrap not-found"><p class="section-kicker">ОШИБКА 404</p><h1>Такой страницы нет</h1><p>Возможно, адрес изменился. Выберите нужную тему в справочнике.</p><a class="button button-primary" href="${origin?url('topics/'):'topics/'}">Открыть справочник <span aria-hidden="true">↗</span></a></main>${footer(0,true)}</body></html>`);
console.log(`Built ${entries.length + 3} pages. Search indexing: ${publishReady?'enabled':'disabled until content and contacts are approved'}.`);
