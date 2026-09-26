// Educational schematic metadata. These are location guides, not diagnostic images.
const rows = `
acute-sinusitis|sinuses|inflammation|Пазухи и полость носа могут воспаляться одновременно.
chronic-sinusitis|sinuses|inflammation|Длительное воспаление требует уточнения причины и оценки слизистой.
maxillary-sinusitis|maxillary|inflammation|Отмечена верхнечелюстная пазуха под глазницей.
frontal-sinusitis|frontal|inflammation|Отмечена лобная пазуха над глазницей.
allergic-rhinitis|nasal-mucosa|inflammation|Аллергическая реакция затрагивает слизистую носа.
nonallergic-rhinitis|nasal-mucosa|inflammation|Слизистая может реагировать на раздражители без аллергии.
medication-rhinitis|turbinates|swelling|Длительное применение сосудосуживающих средств поддерживает отек слизистой.
nasal-polyps|nasal-cavity|growth|Полипы могут перекрывать воздушный поток в полости носа.
deviated-septum|septum|deviation|Перегородка отклонена; значимость определяют по симптомам и осмотру.
turbinate-hypertrophy|turbinates|swelling|Увеличенные носовые раковины могут сужать ход для воздуха.
adenoid-hypertrophy|adenoid|growth|Глоточная миндалина расположена в носоглотке, позади полости носа.
adenoiditis|adenoid|inflammation|Воспаление глоточной миндалины возможно в носоглотке.
nasal-fracture|nasal-bone|fracture|После удара нужно исключить смещение костей и гематому перегородки.
nosebleed|anterior-septum|bleeding|Частый источник кровотечения находится в передней части перегородки.
loss-of-smell|olfactory|signal|Обонятельная зона находится высоко в полости носа; причин потери запаха много.
postnasal-drip|nasopharynx|flow|Слизь может стекать из носоглотки по задней стенке глотки.
septal-perforation|septum|perforation|Отверстие в перегородке требует осмотра и уточнения причины.
acute-otitis-media|middle-ear|inflammation|За барабанной перепонкой может развиваться воспаление среднего уха.
otitis-externa|ear-canal|inflammation|Воспаление расположено в наружном слуховом проходе.
chronic-otitis-media|middle-ear|inflammation|Длительные изменения могут затрагивать среднее ухо и перепонку.
otitis-media-effusion|middle-ear|fluid|Жидкость может находиться за целой барабанной перепонкой.
eustachian-tube-dysfunction|eustachian|blockage|Слуховая труба соединяет среднее ухо с носоглоткой.
earwax|ear-canal|blockage|Скопление серы может закрывать наружный слуховой проход.
eardrum-perforation|eardrum|perforation|Отмечен возможный дефект барабанной перепонки.
otomycosis|ear-canal|growth|Грибковое воспаление бывает в наружном слуховом проходе.
mastoiditis|mastoid|inflammation|Сосцевидный отросток расположен позади уха.
cholesteatoma|middle-ear|growth|Образование может находиться в полости среднего уха.
sudden-hearing-loss|cochlea|signal|Внезапное снижение слуха нельзя считать обычной пробкой без осмотра.
gradual-hearing-loss|cochlea|signal|Причины постепенного снижения слуха могут быть в разных отделах слуховой системы.
tinnitus|cochlea|signal|Шум в ухе — симптом; схема не показывает его единственную причину.
bppv|vestibular|motion|При ДППГ нарушается движение частиц во внутреннем ухе.
meniere|vestibular|fluid|Схема показывает внутреннее ухо, связанное со слухом и равновесием.
labyrinthitis|vestibular|inflammation|Лабиринт внутреннего уха участвует в равновесии и слухе.
otosclerosis|ossicles|growth|Изменения косточек среднего уха могут мешать передаче звука.
ear-barotrauma|eardrum|pressure|Разница давления может воздействовать на перепонку и среднее ухо.
acute-tonsillitis|tonsils|inflammation|Небные миндалины находятся по бокам зева.
recurrent-tonsillitis|tonsils|inflammation|Повторные эпизоды воспаления затрагивают небные миндалины.
pharyngitis|pharynx|inflammation|Воспаление слизистой глотки может вызывать боль при глотании.
laryngitis|larynx|inflammation|Гортань и голосовые складки участвуют в образовании голоса.
peritonsillar-abscess|peritonsillar|fluid|Скопление гноя может возникать рядом с миндалиной.
epiglottitis|epiglottis|swelling|Отек надгортанника способен быстро нарушить дыхание.
vocal-nodules|vocal-folds|growth|Узелки возникают на голосовых складках.
vocal-polyp|vocal-folds|growth|Полип может располагаться на одной голосовой складке.
laryngopharyngeal-reflux|larynx|flow|Заброс содержимого может раздражать гортаноглотку; симптомы неспецифичны.
snoring|soft-palate|vibration|Вибрация мягких тканей во сне может сопровождаться храпом.
sleep-apnea|airway|blockage|Во сне верхние дыхательные пути могут периодически сужаться.
swallowing-difficulty|pharynx|flow|Глотание включает несколько отделов; причину определяют после оценки.
throat-foreign-body|pharynx|foreign|Ощущение инородного тела требует уточнения его наличия и места.
salivary-gland-inflammation|salivary|inflammation|Слюнная железа находится вне просвета глотки.
neck-lump|neck-node|growth|Уплотнение на шее может иметь разные причины и требует осмотра.
persistent-hoarseness|vocal-folds|signal|Стойкое изменение голоса требует осмотра голосовых складок.
laryngeal-cancer-signs|larynx|signal|Стойкие симптомы требуют исключения серьезных причин; схема не показывает опухоль.
sore-throat|pharynx|field|Боль в горле может исходить из нескольких соседних областей.
blocked-nose|nasal-cavity|field|Заложенность бывает при разных причинах в полости носа.
ear-pain|middle-ear|field|Боль в ухе бывает связана с наружным, средним ухом и соседними областями.
blocked-ear|ear-canal|field|Ощущение заложенности не означает, что причина обязательно в слуховом проходе.
ear-discharge|ear-canal|field|Выделения могут исходить из наружного или среднего уха.
long-runny-nose|nasal-mucosa|field|Затяжные выделения имеют разные причины, включая воспаление и аллергию.
globus|pharynx|field|Ощущение кома в горле не указывает на конкретное изменение ткани.
one-sided-nasal-symptoms|nasal-cavity|field|Односторонние симптомы требуют осмотра; возможные причины различаются.
child-ent|adenoid|field|У детей носоглотка, ухо и горло связаны общим маршрутом обследования.
`;

export const atlasSpecs = Object.fromEntries(rows.trim().split('\n').map(line => {
  const [slug, region, mode, note] = line.split('|');
  return [slug, {region, mode, note}];
}));

export const atlasRegions = {
  'sinuses': {organ:'nose', label:'Околоносовые пазухи', x:278, y:174},
  'maxillary': {organ:'nose', label:'Верхнечелюстная пазуха', x:281, y:263},
  'frontal': {organ:'nose', label:'Лобная пазуха', x:274, y:111},
  'nasal-mucosa': {organ:'nose', label:'Слизистая носа', x:206, y:255},
  'turbinates': {organ:'nose', label:'Носовые раковины', x:244, y:290},
  'nasal-cavity': {organ:'nose', label:'Полость носа', x:219, y:303},
  'septum': {organ:'nose', label:'Носовая перегородка', x:191, y:269},
  'adenoid': {organ:'nose', label:'Носоглотка', x:402, y:252},
  'nasal-bone': {organ:'nose', label:'Кости носа', x:177, y:173},
  'anterior-septum': {organ:'nose', label:'Передний отдел перегородки', x:150, y:319},
  'olfactory': {organ:'nose', label:'Обонятельная зона', x:248, y:209},
  'nasopharynx': {organ:'nose', label:'Носоглотка', x:395, y:285},
  'middle-ear': {organ:'ear', label:'Среднее ухо', x:327, y:241},
  'ear-canal': {organ:'ear', label:'Слуховой проход', x:228, y:244},
  'eustachian': {organ:'ear', label:'Слуховая труба', x:379, y:322},
  'eardrum': {organ:'ear', label:'Барабанная перепонка', x:292, y:239},
  'mastoid': {organ:'ear', label:'Сосцевидный отросток', x:315, y:333},
  'cochlea': {organ:'ear', label:'Улитка', x:430, y:275},
  'vestibular': {organ:'ear', label:'Вестибулярный аппарат', x:438, y:171},
  'ossicles': {organ:'ear', label:'Слуховые косточки', x:341, y:215},
  'tonsils': {organ:'throat', label:'Небные миндалины', x:298, y:224},
  'pharynx': {organ:'throat', label:'Глотка', x:348, y:218},
  'larynx': {organ:'throat', label:'Гортань', x:354, y:321},
  'peritonsillar': {organ:'throat', label:'Область рядом с миндалиной', x:313, y:201},
  'epiglottis': {organ:'throat', label:'Надгортанник', x:333, y:286},
  'vocal-folds': {organ:'throat', label:'Голосовые складки', x:354, y:345},
  'soft-palate': {organ:'throat', label:'Мягкое небо', x:310, y:169},
  'airway': {organ:'throat', label:'Верхние дыхательные пути', x:375, y:257},
  'salivary': {organ:'throat', label:'Слюнная железа', x:242, y:290},
  'neck-node': {organ:'throat', label:'Область шеи', x:272, y:340}
};

export const modeLabels = {
  inflammation:'воспаление', swelling:'отек', growth:'изменение ткани',
  deviation:'изменение формы', fracture:'травма', bleeding:'кровотечение',
  signal:'функция и нервный сигнал', flow:'движение и отток',
  perforation:'дефект ткани', fluid:'жидкость', blockage:'сужение',
  motion:'движение', pressure:'давление', vibration:'вибрация',
  foreign:'инородное тело', field:'область поиска причины'
};
