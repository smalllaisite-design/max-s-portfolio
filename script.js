const clock = document.querySelector('#clock');
const tick = () => {
  clock.textContent = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'Asia/Shanghai'
  }).format(new Date());
};
tick();
setInterval(tick, 1000);

const dot = document.querySelector('.cursor-dot');
let x = innerWidth / 2;
let y = innerHeight / 2;
let dx = x;
let dy = y;
window.addEventListener('mousemove', event => {
  x = event.clientX;
  y = event.clientY;
});
function followCursor() {
  dx += (x - dx) * .18;
  dy += (y - dy) * .18;
  dot.style.transform = `translate(${dx - 11}px, ${dy - 11}px)`;
  requestAnimationFrame(followCursor);
}
followCursor();

document.querySelectorAll('a, .tile').forEach(element => {
  element.addEventListener('mouseenter', () => {
    dot.style.width = '32px';
    dot.style.height = '32px';
  });
  element.addEventListener('mouseleave', () => {
    dot.style.width = '22px';
    dot.style.height = '22px';
  });
});

const services = [
  {
    zh: '1.食品快消包装策略与设计',
    en: 'FOOD & FMCG PACKAGING DESIGN'
  },
  {
    zh: '2.会员超市渠道沟通与产品商业化',
    en: 'CLUB RETAIL & PRODUCT LAUNCH'
  },
  {
    zh: '3.产品包材工艺、打样对色与量产交付',
    en: 'PACKAGING & PRODUCTION DELIVERY'
  },
  {
    zh: '4.品牌视觉、展厅官网与数字化设计',
    en: 'BRAND VISUALS & DIGITAL DESIGN'
  }
];
document.querySelectorAll('.service-copy-group').forEach((group, index) => {
  const service = services[index];
  if (!service) return;
  group.querySelector('.service-label').textContent = service.zh;
  group.querySelector('.service-translation').textContent = service.en;
});

const serviceItemsReveal = document.querySelector('.service-items-reveal');
const servicesSection = document.querySelector('#about');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealServicesSection = () => {
  servicesSection?.classList.add('is-in-view');
  serviceItemsReveal?.classList.add('is-visible');
};

if (servicesSection && (reduceMotion || !('IntersectionObserver' in window))) {
  revealServicesSection();
} else if (servicesSection) {
  const serviceRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealServicesSection();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  serviceRevealObserver.observe(servicesSection);
}

const heroTitle = document.querySelector('.hero h1');
const ribbonPath = document.querySelector('.hero-ribbon path');
if (heroTitle) {
  const title = "Max's Portfolio";
  const mIndex = [...title].findIndex((character) => character.toLowerCase() === 'm');
  const stretchIndex = [...title].findIndex((character) => character.toLowerCase() === 'p');
  heroTitle.setAttribute('aria-label', title);
  heroTitle.innerHTML = [...title].map((character, index) => {
    const glyph = character === ' ' ? '&nbsp;' : character;
    const crossedGlyph = ['p', 't'].includes(character.toLowerCase());
    const letter = character.toLowerCase();
    const stretchClass = letter === 'm' ? ' m-stretch-glyph' : letter === 'p' ? ' p-stretch-glyph' : '';
    const isStretchGlyph = Boolean(stretchClass);
    let glyphMarkup = `<span class="title-glyph${stretchClass}">${glyph}</span>`;
    if (stretchIndex < index) glyphMarkup = `<span class="after-p-glyph">${glyphMarkup}</span>`;
    if (mIndex < index) glyphMarkup = `<span class="after-m-glyph">${glyphMarkup}</span>`;
    return `<span class="max-title-char${crossedGlyph ? ' is-ribbon-covered' : ''}${isStretchGlyph ? ' is-title-stretch' : ''}" aria-hidden="true" style="--char-index:${index}">${glyphMarkup}</span>`;
  }).join('');
  document.title = title;
}

if (ribbonPath) {
  ribbonPath.ownerSVGElement.setAttribute('viewBox', '0 0 1400 600');
  ribbonPath.setAttribute('d', 'M-100 330 C-23 252 53 78 130 95 C208 112 289 406 365 430 C441 454 512 238 585 245 C658 252 731 483 805 470 C879 458 960 185 1030 170 C1100 155 1147 378 1225 380 C1303 382 1408 247 1500 180');
}

const footerTitle = document.querySelector('.footer h2');
if (footerTitle) footerTitle.textContent = "Max's Studio";

const serviceList = document.querySelector('.service-list');
const worksHeading = document.querySelector('.works > h2');
if (serviceList && worksHeading) {
  const alignServicesToWorks = () => {
    if (window.matchMedia('(max-width: 700px)').matches) {
      serviceList.style.removeProperty('--works-align-shift');
      return;
    }

    const currentOffset = new DOMMatrixReadOnly(getComputedStyle(serviceList).transform).m41;
    const shift = currentOffset + worksHeading.getBoundingClientRect().left - serviceList.getBoundingClientRect().left;
    serviceList.style.setProperty('--works-align-shift', `${shift}px`);
  };

  alignServicesToWorks();
  window.addEventListener('resize', alignServicesToWorks, { passive: true });
  document.fonts?.ready.then(alignServicesToWorks);
}

const projectTiles = [...document.querySelectorAll('.masonry .tile')];
function watermarkedImageSource(source) {
  const url = new URL(source, document.baseURI);
  url.searchParams.set('v', 'wm-20261019-05');
  return url.href;
}
const projectOverlay = document.querySelector('#project-overlay');
const projectDialog = projectOverlay?.querySelector('.project-dialog');
const projectClose = projectOverlay?.querySelector('.project-dialog-close');
const projectGallery = document.querySelector('#project-gallery');
const projectDialogScroll = projectOverlay?.querySelector('.project-dialog-scroll');
const projectScrollbar = projectOverlay?.querySelector('.project-scrollbar');
const projectScrollThumb = projectOverlay?.querySelector('.project-scroll-thumb');
let projectOpener = null;
let previousBodyOverflow = '';
let projectScrollTimer;
let projectCloseTimer;
let projectCloseTransitionHandler;
let previousProjectScrollTop = 0;
let projectScrollFrame = 0;

const localProjectGalleries = {
  'future-object-10': [
    ['future-object-10-01.jpg', 1467, 2200, '模特手持谷物碗单杯'],
    ['future-object-10-02.jpg', 1467, 2200, '礼盒与谷物碗餐桌陈列'],
    ['future-object-10-03.jpg', 1467, 2200, '牛奶与谷物碗静物'],
    ['future-object-10-04.jpg', 1467, 2200, '人物与礼盒包装'],
    ['future-object-10-05.jpg', 1467, 2200, '多杯产品与谷物食材'],
    ['future-object-10-06.jpg', 1466, 2200, '蜂蜜搭配谷物碗食用场景'],
    ['future-object-10-07.jpg', 1467, 2200, '礼盒与谷物碗食用特写'],
    ['future-object-10-08.jpg', 1467, 2200, '蓝黄场景与单杯产品'],
    ['future-object-10-09.jpg', 2200, 1466, '谷物碗系列横版陈列'],
    ['future-object-10-10.jpg', 1467, 2200, '蜂蜜与牛奶谷物碗创意场景'],
    ['future-object-10-11.jpg', 1467, 2200, '谷物碗舀取特写'],
    ['future-object-10-12.jpg', 1467, 2200, '餐桌上的谷物碗食用场景']
  ],
  'future-object-11': [
    ['future-object-11-01.jpg', 2200, 1467, '礼盒与单杯产品横版静物'],
    ['future-object-11-02.jpg', 1467, 2200, '牛乳与桃胶食材组合'],
    ['future-object-11-03.jpg', 1467, 2200, '桃胶产品俯拍'],
    ['future-object-11-04.jpg', 1467, 2200, '单杯包装与早餐场景'],
    ['future-object-11-05.jpg', 1467, 2200, '牛乳倒入桃胶碗'],
    ['future-object-11-06.jpg', 1467, 2200, '桃胶舀取特写'],
    ['future-object-11-07.jpg', 1467, 2200, '办公用品与随身单杯产品']
  ],
  'future-object-12': [
    ['future-object-12-01.jpg', 1572, 2200, '模特与山水燕盏礼盒'],
    ['future-object-12-02.jpg', 1268, 2200, '礼盒与丝带主视觉'],
    ['future-object-12-03.jpg', 1467, 2200, '燕盏内盒与山水礼盒陈列'],
    ['future-object-12-04.jpg', 2200, 1467, '山水主题礼盒横版静物'],
    ['future-object-12-05.jpg', 1467, 2200, '燕盏与茶具食用场景'],
    ['future-object-12-06.jpg', 1489, 2200, '模特品尝燕窝与圆盒展示'],
    ['future-object-12-07.jpg', 1511, 2200, '人物与圆形燕盏内盒'],
    ['future-object-12-08.jpg', 2200, 1467, '人物与礼盒横版场景'],
    ['future-object-12-09.jpg', 1467, 2200, '模特与山水礼盒近景'],
    ['future-object-12-10.jpg', 1467, 2200, '人物手持独立燕盏包装'],
    ['future-object-12-11.jpg', 1467, 2200, '人物与燕盏包装特写'],
    ['future-object-12-12.jpg', 1467, 2200, '人物展示独立燕盏包装']
  ],
  'future-object-13': [
    ['future-object-13-01.jpg', 1467, 2200, '礼盒与蜜薯食材静物'],
    ['future-object-13-02.jpg', 1467, 2200, '蜜薯羹礼盒主视觉'],
    ['future-object-13-03.jpg', 1467, 2200, '单杯产品与米粮食材'],
    ['future-object-13-04.jpg', 1467, 2200, '蜜薯羹包装与食用展示'],
    ['future-object-13-05.jpg', 1467, 2200, '烤制年糕与蜜薯羹'],
    ['future-object-13-06.jpg', 1467, 2200, '微波加热与蜜薯羹场景'],
    ['future-object-13-07.jpg', 1467, 2200, '年糕拉丝食用特写'],
    ['future-object-13-08.jpg', 1467, 2200, '蜜薯与茶器食用场景'],
    ['future-object-13-09.jpg', 1467, 2200, '蜜薯羹单杯食用特写']
  ],
  'future-object-14': [
    ['future-object-14-01.jpg', 2200, 1467, '礼盒与谷物杯横版陈列'],
    ['future-object-14-02.jpg', 1467, 2200, '玉米谷物杯与水果食材'],
    ['future-object-14-03.jpg', 1467, 2200, '谷物杯与轻食搭配'],
    ['future-object-14-04.jpg', 1467, 2200, '谷物杯舀取与食材展示'],
    ['future-object-14-05.jpg', 1467, 2200, '运动场景与玉米谷物杯'],
    ['future-object-14-06.jpg', 1467, 2200, '居家场景与谷物杯礼盒'],
    ['future-object-14-07.jpg', 1467, 2200, '微波加热谷物杯'],
    ['future-object-14-08.jpg', 1467, 2200, '办公阅读与谷物杯食用场景']
  ],
  'future-object-07': [
    ['future-object-07-01.jpg', 1467, 2200, '金黄酥皮月饼与燕窝场景'],
    ['future-object-07-02.jpg', 1467, 2200, '绿色纹理月饼与茶饮'],
    ['future-object-07-03.jpg', 1467, 2200, '绿色月饼与水果静物'],
    ['future-object-07-04.jpg', 1467, 2200, '粉色月饼与桃子场景'],
    ['future-object-07-05.jpg', 1467, 2200, '黑白纹理月饼与咖啡场景'],
    ['future-object-07-06.jpg', 1467, 2200, '紫色月饼与紫薯静物'],
    ['future-object-07-07.jpg', 1467, 2200, '月饼与坚果食材场景'],
    ['future-object-07-08.jpg', 1467, 2200, '双色月饼切面展示'],
    ['future-object-07-09.jpg', 1466, 2200, '多色月饼与星空圆镜'],
    ['future-object-07-10.jpg', 2200, 1238, '星海流云礼盒横版陈列'],
    ['future-object-07-11.jpg', 1237, 2200, '打开的星海流云礼盒']
  ],
  'future-object-08': [
    ['future-object-08-01.jpg', 1465, 2200, '早餐食用与产品包装展示'],
    ['future-object-08-02.jpg', 1469, 2200, '微波加热与单杯产品'],
    ['future-object-08-03.jpg', 1467, 2200, '礼盒与食材组合'],
    ['future-object-08-04.jpg', 1462, 2200, '暖味燕窝粥礼盒静物'],
    ['future-object-08-05.jpg', 1469, 2200, '燕窝粥食材与食用特写'],
    ['future-object-08-06.jpg', 1467, 2200, '包装与食材创意造型'],
    ['future-object-08-07.jpg', 1460, 2200, '办公场景与单杯产品'],
    ['future-object-08-08.jpg', 1467, 2200, '单杯产品随身携带场景']
  ],
  'future-object-09': [
    ['future-object-09-01.jpg', 1467, 2200, '展开的端午燕窝礼盒'],
    ['future-object-09-02.jpg', 1467, 2200, '多色水晶糕点与冰块'],
    ['future-object-09-03.jpg', 1467, 2200, '金黄色水晶糕点与水果'],
    ['future-object-09-04.jpg', 1467, 2200, '红色水晶糕点与水果'],
    ['future-object-09-05.jpg', 1467, 2200, '粉色水晶糕点与桃子'],
    ['future-object-09-06.jpg', 1467, 2200, '绿色水晶糕点与葡萄'],
    ['future-object-09-07.jpg', 1280, 1920, '模特展示三角礼盒'],
    ['future-object-09-08.jpg', 1280, 1920, '模特与礼盒剪影']
  ],
  'hush-form': [
    ['hush-form-01.jpg', 1467, 2200, '单盏燕窝与金色燕子装饰'],
    ['hush-form-02.jpg', 1467, 2200, '燕窝炖煮与餐具场景'],
    ['hush-form-03.jpg', 1467, 2200, '圆形燕盏内盒包装'],
    ['hush-form-04.jpg', 1467, 2200, '手提礼盒与燕盏静物'],
    ['hush-form-05.jpg', 1467, 2200, '燕盏取用与圆盒陈列'],
    ['hush-form-06.jpg', 1467, 2200, '双层圆盒与燕盏展示'],
    ['hush-form-07.jpg', 1467, 2200, '燕盏与炖盅组合'],
    ['hush-form-08.jpg', 2200, 1467, '礼盒与燕盏横版陈列'],
    ['hush-form-09.jpg', 1467, 2200, '圆形内盒与金色丝带'],
    ['hush-form-10.jpg', 1467, 2200, '礼盒与金色丝带主视觉'],
    ['hush-form-11.jpg', 1467, 2200, '礼盒与手提袋组合'],
    ['hush-form-12.jpg', 2200, 1467, '礼盒与茶具横版静物'],
    ['hush-form-13.jpg', 1467, 2200, '礼盒与燕盏竖版陈列']
  ],
  'fold-field': [
    ['fold-field-01.jpg', 1467, 2200, '双人分享花胶羹俯拍'],
    ['fold-field-02.jpg', 2200, 1275, '礼盒与产品横版陈列'],
    ['fold-field-03.jpg', 1467, 2200, '香芋豆乳花胶羹食用特写'],
    ['fold-field-04.jpg', 1467, 2200, '单杯与食材组合'],
    ['fold-field-05.jpg', 1467, 2200, '礼盒与多杯产品展示'],
    ['fold-field-06.jpg', 1467, 2200, '多杯包装平面陈列'],
    ['fold-field-07.jpg', 1467, 2200, '单杯包装与书本静物'],
    ['fold-field-08.jpg', 1467, 2200, '花胶羹舀取特写'],
    ['fold-field-09.jpg', 1467, 2200, '花胶羹与香芋食材场景']
  ],
  'future-object-01': [
    ['future-object-01-01.jpg', 1540, 2200, '模特与燕窝粥单杯展示'],
    ['future-object-01-02.jpg', 1300, 2200, '模特手持金色礼盒'],
    ['future-object-01-03.jpg', 1650, 2200, '展开的礼盒与包装信息'],
    ['future-object-01-04.jpg', 1650, 2200, '模特与礼盒手提袋陈列'],
    ['future-object-01-05.jpg', 1650, 2200, '燕窝粥食用特写'],
    ['future-object-01-06.jpg', 1631, 2200, '金色礼盒与手提袋静物'],
    ['future-object-01-07.jpg', 1467, 2200, '燕窝与单杯包装特写'],
    ['future-object-01-08.jpg', 1467, 2200, '谷物燕窝粥舀取特写']
  ],
  'future-object-02': [
    ['future-object-02-01.jpg', 1467, 2200, '金色单杯与谷物食材'],
    ['future-object-02-02.jpg', 1468, 2200, '红色背景单杯与谷物组合'],
    ['future-object-02-03.jpg', 1467, 2200, '蓝色单杯与牛奶食材'],
    ['future-object-02-04.jpg', 1467, 2200, '粉色单杯与谷物食材'],
    ['future-object-02-05.jpg', 2200, 1465, '全家福礼盒横版陈列'],
    ['future-object-02-06.jpg', 1467, 2200, '多口味单杯组合展示'],
    ['future-object-02-07.jpg', 1467, 2200, '打开的全家福礼盒'],
    ['future-object-02-08.jpg', 2200, 1466, '人物展示礼盒内装'],
    ['future-object-02-09.jpg', 1468, 2200, '人物手提全家福礼盒']
  ],
  'future-object-06': [
    ['future-object-06-01.jpg', 1466, 2200, '展开的赛龙粥礼盒'],
    ['future-object-06-02.jpg', 1467, 2200, '礼盒与荷叶山水静物'],
    ['future-object-06-03.jpg', 2200, 1467, '赛龙粥礼盒横版陈列'],
    ['future-object-06-04.jpg', 1543, 2200, '燕窝粥与谷物食材'],
    ['future-object-06-05.jpg', 1476, 2200, '礼盒与产品俯拍场景'],
    ['future-object-06-06.jpg', 1446, 2200, '模特手持燕窝粥单杯'],
    ['future-object-06-07.jpg', 1471, 2200, '燕窝粥与单杯包装特写'],
    ['future-object-06-08.jpg', 1467, 2200, '礼盒与燕窝谷物陈列'],
    ['future-object-06-09.jpg', 1517, 2200, '模特手提赛龙粥礼盒'],
    ['future-object-06-10.jpg', 1474, 2200, '模特展示礼盒包装'],
    ['future-object-06-11.jpg', 1527, 2200, '人物与绿色礼盒主视觉']
  ],
};

function updateProjectScrollbar() {
  if (!projectDialogScroll || !projectScrollbar || !projectScrollThumb) return;
  const viewportHeight = projectDialogScroll.clientHeight;
  const contentHeight = projectDialogScroll.scrollHeight;
  const trackHeight = projectScrollbar.clientHeight;
  const maxScroll = contentHeight - viewportHeight;
  if (maxScroll <= 1 || !trackHeight) {
    projectScrollbar.hidden = true;
    return;
  }
  projectScrollbar.hidden = false;
  const thumbHeight = Math.min(trackHeight, Math.max(14, trackHeight * viewportHeight / contentHeight * .5));
  const travel = trackHeight - thumbHeight;
  projectScrollThumb.style.height = `${thumbHeight}px`;
  projectScrollThumb.style.top = `${travel * projectDialogScroll.scrollTop / maxScroll}px`;
}

function scheduleProjectScrollbarUpdate() {
  if (projectScrollFrame) return;
  projectScrollFrame = requestAnimationFrame(() => {
    projectScrollFrame = 0;
    updateProjectScrollbar();
  });
}

function openProject(tile, index) {
  if (!projectOverlay || !projectDialog) return;
  clearTimeout(projectCloseTimer);
  if (projectCloseTransitionHandler) {
    projectOverlay.removeEventListener('transitionend', projectCloseTransitionHandler);
    projectCloseTransitionHandler = null;
  }
  projectOpener = tile;
  const title = tile.querySelector('h3')?.textContent.trim() || 'Selected Project';
  const meta = tile.querySelector('p')?.textContent.trim() || '';
  const featuredImage = tile.querySelector('img');

  document.querySelector('#project-dialog-title').textContent = title;
  document.querySelector('#project-dialog-meta').textContent = meta;

  const relatedImages = [];
  const seenSources = new Set([featuredImage.getAttribute('src')]);
  projectTiles.forEach((relatedTile, relatedIndex) => {
    if (relatedTile === tile) return;
    const image = relatedTile.querySelector('img');
    const source = image?.getAttribute('src');
    if (!image || !source || seenSources.has(source)) return;
    seenSources.add(source);
    relatedImages.push({
      src: image.currentSrc || image.src,
      alt: image.alt || relatedTile.querySelector('h3')?.textContent.trim() || 'Related project photo',
      title: relatedTile.querySelector('h3')?.textContent.trim() || 'Related project',
      meta: relatedTile.querySelector('p')?.textContent.trim() || '',
      orientation: /concept-packaging-02\.png(?:$|[?#])/.test(source) ? 'portrait' : 'landscape',
      index: relatedIndex
    });
  });

  const featuredSource = featuredImage.getAttribute('src') || '';
  const standardProjectPhotos = [{
    src: featuredImage.currentSrc || featuredImage.src,
    alt: featuredImage.alt || title,
    title,
    meta,
    orientation: /concept-packaging-02\.png(?:$|[?#])/.test(featuredSource) ? 'portrait' : 'landscape'
  }, ...relatedImages, {
    src: 'assets/gallery-landscape-01.png',
    alt: '森林绿与暖白色食品包装系列横版展示',
    title: '食品包装系列',
    meta: '策略与包装设计'
  }, {
    src: 'assets/gallery-portrait-01.png',
    alt: '森林绿茶品包装竖版展示',
    title: '茶品包装',
    meta: '包材与视觉设计',
    orientation: 'portrait'
  }, {
    src: 'assets/gallery-landscape-02.png',
    alt: '暖粉与酒红色食品包装系列横版展示',
    title: '节令礼盒系列',
    meta: '包装视觉设计'
  }, {
    src: 'assets/gallery-portrait-02.png',
    alt: '钴蓝色柑橘食品包装竖版展示',
    title: '柑橘食品包装',
    meta: '产品包装设计',
    orientation: 'portrait'
  }];

  const jellyPhotoDescriptions = [
    '海滩场景双杯主视觉',
    '杨枝甘露口味产品特写',
    '椰子风味场景包装',
    '组合装与海滩陈列',
    '芒果风味产品特写',
    '椰子口味双杯场景',
    '多杯组合装展示',
    '椰子口味产品近景',
    '牛奶口味创意场景',
    '森林场景单杯展示',
    '多口味组合装陈列',
    '芒果与椰子风味主视觉'
  ];
  const jellyProjectPhotos = jellyPhotoDescriptions.slice(1).map((description, galleryIndex) => {
    const photoIndex = galleryIndex + 1;
    return {
      src: `assets/web/jelly-project-${String(photoIndex + 1).padStart(2, '0')}.jpg`,
      alt: `十二夏天小胶冻${description}`,
      title: '十二夏天小胶冻',
      meta: `项目影像 ${String(photoIndex + 1).padStart(2, '0')} / 12`,
      orientation: [3, 6].includes(photoIndex) ? 'landscape' : 'portrait'
    };
  });
  const moonlightPhotoDescriptions = [
    '月光宝盒燕窝粥礼盒主视觉',
    '茉莉燕窝粥产品场景',
    '玫瑰燕窝粥产品场景',
    '杭白菊燕麦燕窝粥场景',
    '多口味月光宝盒组合展示',
    '月光宝盒礼盒全景',
    '桂花燕窝粥产品场景',
    '椰子与燕窝粥礼盒人物形象',
    '模特手持月光宝盒礼盒',
    '打开的月光宝盒礼盒',
    '模特展示单杯燕窝粥',
    '模特品尝燕窝粥'
  ];
  const moonlightProjectPhotos = moonlightPhotoDescriptions.slice(1).map((description, galleryIndex) => {
    const photoIndex = galleryIndex + 1;
    return {
      src: `assets/web/moonlight-project-${String(photoIndex + 1).padStart(2, '0')}.jpg`,
      alt: `月光宝盒${description}`,
      title: '月光宝盒',
      meta: `项目影像 ${String(photoIndex + 1).padStart(2, '0')} / 12`,
      orientation: photoIndex === 5 ? 'landscape' : 'portrait'
    };
  });
  const familyPhotoDescriptions = [
    '燕窝粥全家福新春礼盒主视觉',
    '模特展示礼盒与包装细节',
    '人物与礼盒近景',
    '人物手持单杯产品',
    '新春礼盒人物形象',
    '手持礼盒造型展示',
    '桂花燕窝粥产品静物',
    '茉莉燕窝粥与礼盒静物',
    '玫瑰燕窝粥产品静物',
    '茶器与燕窝粥产品场景',
    '多口味产品陈列',
    '玫瑰口味产品场景',
    '茉莉口味产品场景',
    '人物与打开的全家福礼盒',
    '人物展示礼盒内装'
  ];
  const familyProjectPhotos = familyPhotoDescriptions.slice(2).map((description, galleryIndex) => {
    const fileIndex = galleryIndex + 3;
    return {
      src: `assets/web/family-project-${String(fileIndex).padStart(2, '0')}.jpg`,
      alt: `燕窝粥全家福${description}`,
      title: '燕窝粥全家福',
      meta: `项目影像 ${String(fileIndex).padStart(2, '0')} / 15`,
      orientation: fileIndex === 15 ? 'landscape' : 'portrait'
    };
  });
  const futureObjectThreePhotoDescriptions = [
    '礼盒与花胶羹完整产品场景',
    '花胶羹与茶具俯拍场景',
    '礼盒与红豆沙花胶羹近景',
    '陈皮红豆沙花胶羹单杯静物',
    '礼盒与多杯产品组合陈列',
    '花胶羹与茶器蒸汽场景',
    '红豆沙花胶羹食用特写'
  ];
  const futureObjectThreePhotos = futureObjectThreePhotoDescriptions.map((description, galleryIndex) => {
    const fileIndex = galleryIndex + 1;
    return {
      src: `assets/web/future-object-03-${String(fileIndex).padStart(2, '0')}.jpg`,
      alt: `十二夏天陈皮红豆沙花胶羹${description}`,
      title: '十二夏天花胶羹',
      meta: `项目影像 ${String(fileIndex).padStart(2, '0')} / 07`,
      orientation: 'portrait'
    };
  });
  const futureObjectFourPhotoDescriptions = [
    'Hello Kitty 联名礼盒与气球场景',
    'Hello Kitty 礼盒与系列产品静物',
    '多口味谷物碗产品陈列',
    'Hello Kitty 礼盒打开与产品展示',
    'Hello Kitty 礼盒产品近景',
    '不同口味产品平面陈列',
    '玉米口味产品与谷物场景',
    '豆乳口味产品场景',
    '乳糖牛奶口味产品场景',
    'Hello Kitty 手提袋展示',
    'Hello Kitty 礼盒全景陈列'
  ];
  const futureObjectFourPhotos = futureObjectFourPhotoDescriptions.map((description, galleryIndex) => {
    const fileIndex = galleryIndex + 1;
    const paddedIndex = String(fileIndex).padStart(2, '0');
    return {
      src: `assets/web/future-object-04-${paddedIndex}.jpg`,
      alt: `十二夏天 Hello Kitty 礼盒${description}`,
      title: '十二夏天 Hello Kitty 礼盒',
      meta: `项目影像 ${paddedIndex} / 11`,
      orientation: fileIndex === 11 ? 'landscape' : 'portrait'
    };
  });
  const nuArchivePhotoDescriptions = [
    '人物品尝水牛奶谷物碗',
    '亲子分享谷物碗早餐',
    '户外场景与水牛奶谷物碗',
    '水牛奶谷物碗礼盒与多杯产品陈列',
    '水牛奶与谷物碗食材组合',
    '蜂蜜与谷物碗搭配场景',
    '蜂蜜淋入谷物碗特写',
    '微波加热谷物碗场景',
    '加热后的谷物碗产品展示',
    '微波炉取出谷物碗场景',
    '水牛奶谷物碗加热步骤展示'
  ];
  const nuArchivePhotos = nuArchivePhotoDescriptions.map((description, galleryIndex) => {
    const fileIndex = galleryIndex + 1;
    const paddedIndex = String(fileIndex).padStart(2, '0');
    return {
      src: `assets/web/nu-archive-${paddedIndex}.jpg`,
      alt: `山姆水牛奶谷物碗${description}`,
      title: 'Nu Archive',
      meta: `项目影像 ${paddedIndex} / 11`,
      orientation: 'portrait'
    };
  });
  const oatMilkPhotoDescriptions = [
    '燕麦奶、谷物与产品食材组合',
    '燕麦奶谷物碗礼盒主视觉',
    '燕麦奶谷物碗单杯包装特写',
    '早餐品尝与单杯产品展示',
    '微波加热与礼盒产品场景',
    '蜂蜜搭配谷物碗食用特写',
    '办公桌上的谷物碗早餐',
    '居家运动与谷物碗场景',
    '随身携带燕麦奶谷物碗',
    '礼盒、单杯与谷物食材陈列'
  ];
  const oatMilkPhotos = oatMilkPhotoDescriptions.map((description, galleryIndex) => {
    const paddedIndex = String(galleryIndex + 1).padStart(2, '0');
    return {
      src: `assets/web/future-object-05-${paddedIndex}.jpg`,
      alt: `十二夏天燕麦奶谷物碗${description}`,
      title: '十二夏天燕麦奶谷物碗',
      meta: `项目影像 ${paddedIndex} / 10`,
      orientation: 'portrait',
      aspectRatio: '1467 / 2200'
    };
  });
  const localProjectPhotos = localProjectGalleries[tile.dataset.project]?.map(([file, width, height, description], photoIndex, photos) => ({
    src: `assets/web/${file}`,
    alt: `${title}｜${description}`,
    title,
    meta: `项目影像 ${String(photoIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`,
    orientation: height > width ? 'portrait' : 'landscape',
    aspectRatio: `${width} / ${height}`,
    width,
    height,
    localGallery: true
  }));
  const pendingProjectPhotos = tile.hasAttribute('data-pending-project') ? [{
    src: featuredImage.currentSrc || featuredImage.src,
    alt: featuredImage.alt || title,
    title,
    meta: '项目图片待补充',
    aspectRatio: tile.dataset.coverRatio,
    localGallery: true
  }] : null;
  const projectPhotos = localProjectPhotos || pendingProjectPhotos || (tile.dataset.project === 'future-object-05'
    ? oatMilkPhotos
    : tile.classList.contains('tile-a')
    ? jellyProjectPhotos
    : tile.dataset.project === '04'
      ? familyProjectPhotos
      : tile.dataset.project === '02'
        ? moonlightProjectPhotos
        : tile.dataset.project === 'future-object-03'
          ? futureObjectThreePhotos
          : tile.dataset.project === 'future-object-04'
            ? futureObjectFourPhotos
            : tile.dataset.project === 'nu-archive'
              ? nuArchivePhotos
            : standardProjectPhotos);

  projectGallery.replaceChildren();
  projectPhotos.forEach(photo => {
    const figure = document.createElement('figure');
    figure.className = `project-gallery-card${photo.orientation === 'portrait' ? ' project-gallery-card--portrait' : ''}`;
    if (photo.localGallery) figure.classList.add('project-gallery-card--local');
    if (tile.dataset.project) figure.dataset.project = tile.dataset.project;
    const image = document.createElement('img');
    image.src = watermarkedImageSource(photo.src);
    image.alt = photo.alt;
    if (photo.width && photo.height) {
      image.width = photo.width;
      image.height = photo.height;
    }
    image.loading = 'lazy';
    image.decoding = 'async';
    const media = document.createElement('div');
    media.className = 'project-gallery-media';
    if (photo.aspectRatio) media.style.aspectRatio = photo.aspectRatio;
    media.append(image);
    const caption = document.createElement('figcaption');
    const name = document.createElement('strong');
    name.textContent = photo.title;
    const detail = document.createElement('span');
    detail.textContent = photo.meta;
    caption.append(name, detail);
    figure.append(media, caption);
    projectGallery.append(figure);
  });

  if (projectDialogScroll) {
    projectDialogScroll.scrollTop = 0;
    previousProjectScrollTop = 0;
  }
  projectDialog?.classList.remove('is-scrolling-down');
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  document.body.classList.add('project-is-open');
  projectOverlay.setAttribute('aria-hidden', 'false');
  projectOverlay.classList.add('is-open');
  scheduleProjectScrollbarUpdate();
  projectClose?.focus();
}

function closeProject() {
  if (!projectOverlay?.classList.contains('is-open')) return;
  clearTimeout(projectCloseTimer);
  projectOverlay.classList.remove('is-open');
  projectOverlay.setAttribute('aria-hidden', 'true');
  const finishClose = () => {
    if (projectOverlay.classList.contains('is-open')) return;
    clearTimeout(projectCloseTimer);
    if (projectCloseTransitionHandler) {
      projectOverlay.removeEventListener('transitionend', projectCloseTransitionHandler);
      projectCloseTransitionHandler = null;
    }
    document.body.style.overflow = previousBodyOverflow;
    document.body.classList.remove('project-is-open');
    projectOpener?.focus();
  };
  projectCloseTransitionHandler = event => {
    if (event.target === projectOverlay && event.propertyName === 'opacity') finishClose();
  };
  projectOverlay.addEventListener('transitionend', projectCloseTransitionHandler);
  const closeFallbackDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 760;
  projectCloseTimer = setTimeout(finishClose, closeFallbackDelay);
}

projectTiles.forEach((tile, index) => {
  tile.setAttribute('tabindex', '0');
  tile.setAttribute('role', 'button');
  tile.setAttribute('aria-haspopup', 'dialog');
  tile.addEventListener('click', () => openProject(tile, index));
  tile.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openProject(tile, index);
  });
});

projectClose?.addEventListener('click', closeProject);
projectDialogScroll?.addEventListener('scroll', () => {
  const currentScrollTop = projectDialogScroll.scrollTop;
  if (currentScrollTop > previousProjectScrollTop + 1) {
    projectDialog?.classList.add('is-scrolling-down');
  } else if (currentScrollTop < previousProjectScrollTop - 1 || currentScrollTop <= 0) {
    projectDialog?.classList.remove('is-scrolling-down');
  }
  previousProjectScrollTop = currentScrollTop;
  scheduleProjectScrollbarUpdate();
  projectDialog?.classList.add('is-scrolling');
  clearTimeout(projectScrollTimer);
  projectScrollTimer = setTimeout(() => projectDialog?.classList.remove('is-scrolling'), 700);
}, { passive: true });
window.addEventListener('resize', scheduleProjectScrollbarUpdate, { passive: true });
projectOverlay?.addEventListener('click', event => {
  if (event.target === projectOverlay) closeProject();
});
projectOverlay?.addEventListener('pointerover', event => {
  if (event.target.closest('.project-dialog-close, .project-gallery-card')) {
    dot.style.width = '32px';
    dot.style.height = '32px';
  }
});
projectOverlay?.addEventListener('pointerout', event => {
  if (event.target.closest('.project-dialog-close, .project-gallery-card') &&
      !event.relatedTarget?.closest('.project-dialog-close, .project-gallery-card')) {
    dot.style.width = '22px';
    dot.style.height = '22px';
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeProject();
});

const footerSignature = document.querySelector('.footer-signature');
const signatureCanvas = footerSignature?.querySelector('.footer-signature-canvas');
const signatureContext = signatureCanvas?.getContext('2d');

if (footerSignature && signatureCanvas && signatureContext) {
  const signatureText = "Max's Vibe Coding Lab";
  const reducedSignatureMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -1000, y: -1000, active: false };
  let signatureParticles = [];
  let signatureWidth = 0;
  let signatureHeight = 0;
  let signatureDpr = 1;
  let signatureFrame = 0;
  let signatureVisible = false;

  function buildSignatureParticles() {
    const bounds = footerSignature.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    if (signatureFrame) cancelAnimationFrame(signatureFrame);
    signatureFrame = 0;
    signatureWidth = bounds.width;
    signatureHeight = bounds.height;
    signatureDpr = Math.min(window.devicePixelRatio || 1, 2);
    signatureCanvas.width = Math.round(signatureWidth * signatureDpr);
    signatureCanvas.height = Math.round(signatureHeight * signatureDpr);
    signatureContext.setTransform(signatureDpr, 0, 0, signatureDpr, 0, 0);

    const mask = document.createElement('canvas');
    mask.width = signatureCanvas.width;
    mask.height = signatureCanvas.height;
    const maskContext = mask.getContext('2d', { willReadFrequently: true });
    const computed = getComputedStyle(footerSignature);
    const baseSize = parseFloat(computed.fontSize);
    const fontFamily = computed.fontFamily;
    const weight = computed.fontWeight || '800';
    maskContext.setTransform(signatureDpr, 0, 0, signatureDpr, 0, 0);
    maskContext.textAlign = 'center';
    maskContext.textBaseline = 'middle';
    maskContext.fillStyle = '#000';
    maskContext.font = `${weight} ${baseSize}px ${fontFamily}`;
    const measuredWidth = maskContext.measureText(signatureText).width;
    const fontSize = Math.min(baseSize, baseSize * (signatureWidth * .975) / measuredWidth);
    maskContext.font = `${weight} ${fontSize}px ${fontFamily}`;
    maskContext.fillText(signatureText, signatureWidth / 2, signatureHeight / 2);

    const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
    const sampleStep = Math.max(2, Math.round(3 * signatureDpr));
    const nextParticles = [];
    for (let y = 0; y < mask.height; y += sampleStep) {
      for (let x = 0; x < mask.width; x += sampleStep) {
        if (pixels[(y * mask.width + x) * 4 + 3] < 100) continue;
        const targetX = (x + sampleStep / 2) / signatureDpr;
        const targetY = (y + sampleStep / 2) / signatureDpr;
        const scatter = reducedSignatureMotion ? 0 : 16;
        nextParticles.push({
          x: targetX + (Math.random() - .5) * scatter,
          y: targetY + (Math.random() - .5) * scatter,
          targetX,
          targetY,
          vx: 0,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
          glass: Math.random() > .955
        });
      }
    }
    signatureParticles = nextParticles;
    footerSignature.classList.add('has-particles');
    renderSignature(performance.now());
  }

  function renderSignature(time) {
    signatureContext.clearRect(0, 0, signatureWidth, signatureHeight);
    const radius = 78;
    for (const particle of signatureParticles) {
      if (!reducedSignatureMotion) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (pointer.active && distance < radius) {
          const force = (radius - distance) / radius * 1.05;
          const safeDistance = Math.max(1, distance);
          particle.vx += dx / safeDistance * force;
          particle.vy += dy / safeDistance * force;
        }
        particle.vx += (particle.targetX - particle.x) * .022;
        particle.vy += (particle.targetY - particle.y) * .022;
        particle.vx *= .88;
        particle.vy *= .88;
        particle.x += particle.vx;
        particle.y += particle.vy;
      }

      const twinkle = Math.sin(time * .0011 + particle.phase);
      signatureContext.globalAlpha = .76 + twinkle * .18;
      signatureContext.fillStyle = particle.glass && twinkle > .35 ? '#819000' : '#596600';
      signatureContext.beginPath();
      signatureContext.arc(particle.x, particle.y, 1.1, 0, Math.PI * 2);
      signatureContext.fill();
    }
    signatureContext.globalAlpha = 1;
    if (!reducedSignatureMotion && signatureVisible) {
      signatureFrame = requestAnimationFrame(renderSignature);
    }
  }

  function startSignatureAnimation() {
    if (reducedSignatureMotion) {
      renderSignature(performance.now());
      return;
    }
    if (!signatureFrame) signatureFrame = requestAnimationFrame(time => {
      signatureFrame = 0;
      renderSignature(time);
    });
  }

  function stopSignatureAnimation() {
    if (signatureFrame) cancelAnimationFrame(signatureFrame);
    signatureFrame = 0;
  }

  footerSignature.addEventListener('pointermove', event => {
    const bounds = footerSignature.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
    startSignatureAnimation();
  });
  footerSignature.addEventListener('pointerleave', () => { pointer.active = false; });

  if ('IntersectionObserver' in window) {
    const signatureObserver = new IntersectionObserver(entries => {
      signatureVisible = entries[0].isIntersecting;
      if (signatureVisible) startSignatureAnimation();
      else stopSignatureAnimation();
    }, { threshold: .05 });
    signatureObserver.observe(footerSignature);
  } else {
    signatureVisible = true;
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(buildSignatureParticles).observe(footerSignature);
  } else {
    window.addEventListener('resize', buildSignatureParticles, { passive: true });
  }
  document.fonts?.ready.then(buildSignatureParticles);
  buildSignatureParticles();
}
