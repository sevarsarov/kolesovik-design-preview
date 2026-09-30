/* Local-only interactive design model. No network, product cookies, or production data. */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rub = n => `${new Intl.NumberFormat('ru-RU').format(n)} ₽`;
  const icons = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    car:'<path d="m5 17-1 2v2h2l1-2h10l1 2h2v-2l-1-2M4 17l1.6-7a2 2 0 0 1 2-1.5h8.8a2 2 0 0 1 2 1.5l1.6 7H4ZM6 13h12M7 17h.01M17 17h.01"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    chat:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.8-5.5a9 9 0 0 1-.8-4A8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5M12 7v5l3 2"/>',
    arrow:'<path d="m9 18 6-6-6-6"/>',back:'<path d="m15 18-6-6 6-6"/>',
    file:'<path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6m-6 4h6"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    tire:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5m0 8v5M3 12h5m8 0h5"/>',
    card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
    send:'<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
    attach:'<path d="m20 11.5-8.4 8.4a5 5 0 0 1-7.1-7.1L14 3.4a3.5 3.5 0 0 1 5 5L9.7 17.7a2 2 0 0 1-2.8-2.8L15 6.8"/>',
    mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/>',
    x:'<path d="M18 6 6 18M6 6l12 12"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    warning:'<path d="M12 3 2 21h20L12 3Zm0 6v5m0 3h.01"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    logout:'<path d="M10 17l5-5-5-5m5 5H3m9-9h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.more}</svg>`;
  const cars = [
    {id:1,name:'Toyota Camry',year:2019,plate:'А 123 АА 77',mileage:'84 200 км',last:'18 сентября 2026',booking:'3 октября, 10:30',recommendation:'Проверить передние тормозные колодки',archived:false},
    {id:2,name:'Kia Rio',year:2021,plate:'В 456 ВВ 77',mileage:'43 510 км',last:'12 августа 2026',booking:null,recommendation:null,archived:false},
    {id:3,name:'Škoda Octavia',year:2016,plate:'Е 789 ЕЕ 77',mileage:null,last:'26 апреля 2024',booking:null,recommendation:null,archived:true}
  ];
  const orders = [
    {id:2418,number:'А-2418',date:'18 сентября 2026',car:cars[0],title:'Плановое ТО и диагностика ходовой',total:12980,status:'Закрыт',pdf:true},
    {id:2380,number:'А-2380',date:'12 августа 2026',car:cars[1],title:'Замена тормозных колодок',total:10400,status:'Закрыт',pdf:true},
    {id:2264,number:'А-2264',date:'7 мая 2026',car:cars[0],title:'Замена масла и фильтров',total:8900,status:'Закрыт',pdf:false},
    {id:1904,number:'А-1904',date:'26 апреля 2024',car:cars[2],title:'Диагностика кондиционера',total:4200,status:'Закрыт',pdf:false}
  ];
  const scenarioOptions = {
    home:['normal','no-booking','error','many','loading','success','warning'],
    garage:['one','many','empty','archived','loading','error'],
    car:['normal','current-booking','recommendations','empty-history','long-history','archived','loading','error'],
    history:['normal','empty','loading','error'],
    order:['normal','legacy-payment','pdf-unavailable','readonly','loading','error'],
    bookings:['normal','no-slots','conflict','unknown-outcome','cannot-reschedule','cannot-cancel','empty','loading','error','success'],
    more:['normal','loading','empty','error'],
    recommendations:['normal','empty','loading','error'],
    warranty:['normal','empty','loading','error'],
    storage:['normal','empty','loading','error'],
    payments:['normal','empty','loading','error'],
    documents:['normal','empty','loading','error'],
    store:['normal'],
    login:['phone','otp','loading','wrong-code','expired','attempt-limit','sms-unavailable','rate-limit','success'],
    ask:['new','history','customer-admin','handoff','booking-event','closed','continue','sending','error','unknown-outcome']
  };
  const scenarioNames = {
    normal:'Обычное', 'no-booking':'Нет будущей записи',error:'Ошибка',many:'Несколько автомобилей',loading:'Загрузка',success:'Успех',warning:'Предупреждение',one:'Один автомобиль',empty:'Пусто',archived:'Архивный автомобиль','current-booking':'Текущая запись',recommendations:'Рекомендации','empty-history':'Нет истории','long-history':'Длинная история','legacy-payment':'Старый статус оплаты','pdf-unavailable':'PDF недоступен',readonly:'Только чтение','no-slots':'Нет слотов',conflict:'409: запись изменилась','unknown-outcome':'Неизвестный результат','cannot-reschedule':'Перенос недоступен','cannot-cancel':'Отмена недоступна',phone:'Телефон',otp:'Код SMS','wrong-code':'Неверный код',expired:'Код истёк','attempt-limit':'Лимит попыток','sms-unavailable':'SMS недоступна','rate-limit':'Лимит запросов',new:'Новый разговор',history:'История', 'customer-admin':'Клиент → администратор',handoff:'Передача администратору','booking-event':'Событие записи',closed:'Диалог завершён',continue:'Продолжить общение',sending:'Отправляется'
  };
  const routeNames = {home:'Главная',garage:'Мои автомобили',car:'Автомобиль',history:'История обслуживания',order:'Акт',bookings:'Записи',more:'Ещё',recommendations:'Рекомендации',warranty:'Гарантия',storage:'Шины на хранении',payments:'Оплаты и возвраты',documents:'Документы',store:'Магазин',login:'Вход'};
  const state = {route:'home',id:1,scenario:'normal',theme:localStorage.getItem('kolesovik.customer-prototype.theme') || 'light',controls:false,overlay:null,chat:false,chatScenario:'history',draft:'',chatMessages:[],chatNotice:'',chatSendState:'idle',bookingStep:-1,bookingMonth:9,bookingDate:'',bookingService:'',bookingTime:'',bookingCar:0,bookingMode:'create',bookingTargetId:null,bookingResult:null,bookings:[{id:1,isoDate:'2026-10-03',date:'3 октября 2026',time:'10:30',service:'Плановое ТО',carId:1,branch:'КОЛЕСОВИК · Центр',status:'Подтверждена'}],bookingNotice:'',loginStep:'phone',phone:'',otp:'',resend:38,origin:'history',historyCar:'all',secondaryId:1,contextCarId:null};
  const app = $('#app');
  const overlayRoot = $('#overlay-root');
  const controlsRoot = document.createElement('div');
  controlsRoot.id = 'controls-root';
  document.body.append(controlsRoot);
  const live = $('#live');
  let focusReturn = null;
  let chatFocusReturn = null;
  let chatShell = null;
  let chatInput = null;
  let chatListeners = null;
  let chatBackgroundAria = null;
  const chatDiagnostics = {chatOpenCount:0,chatCloseCount:0,chatSendCount:0,chatDestroyCount:0,lastLifecycleEvent:'init',pendingChatTimers:0};
  if(new URLSearchParams(location.search).has('chatQa')){
    chatDiagnostics.snapshot=()=>({chat:state.chat,chatSendState:state.chatSendState,listenerActive:Boolean(chatListeners),shellCount:document.querySelectorAll('.chat-overlay').length});
    window.__customerChatDiagnostics=chatDiagnostics;
  }
  let lastRoute = '';
  const scrollByRoute = new Map();
  const announce = message => {live.textContent=''; setTimeout(()=>live.textContent=message,10)};
  const resolveTheme = () => state.theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light') : state.theme;
  const applyTheme = () => {document.documentElement.dataset.theme=resolveTheme();document.documentElement.style.colorScheme=resolveTheme();};
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(state.theme==='system'){applyTheme();announce('Системная тема обновлена.')}});
  function setTheme(theme){state.theme=theme;localStorage.setItem('kolesovik.customer-prototype.theme',theme);applyTheme();render();announce(`Тема: ${theme==='light'?'Светлая':theme==='dark'?'Тёмная':'Системная'}`)}
  const pathFor = (route,id) => ({home:'/',garage:'/cars',car:`/cars/${id||1}`,history:'/orders',order:`/orders/${id||2418}`,bookings:'/bookings',more:'/more',recommendations:'/recommendations',warranty:'/warranty',storage:'/storage',payments:'/payments',documents:'/documents',store:'/store',login:'/login'})[route] || '/';
  function parsePath(){let path=decodeURIComponent(location.hash.replace(/^#/,'')||'/');if(path==='/')return ['home',1];if(/^\/cars\/\d+$/.test(path))return ['car',Number(path.split('/')[2])];if(/^\/orders\/\d+$/.test(path))return ['order',Number(path.split('/')[2])];return Object.entries({garage:'/cars',history:'/orders',bookings:'/bookings',more:'/more',recommendations:'/recommendations',warranty:'/warranty',storage:'/storage',payments:'/payments',documents:'/documents',store:'/store',login:'/login'}).find(([,p])=>p===path)?.[0] ? [Object.entries({garage:'/cars',history:'/orders',bookings:'/bookings',more:'/more',recommendations:'/recommendations',warranty:'/warranty',storage:'/storage',payments:'/payments',documents:'/documents',store:'/store',login:'/login'}).find(([,p])=>p===path)[0],1] : ['home',1]}
  function contentScroll(){return matchMedia('(max-width:899px)').matches&&state.route!=='login'?($('#main')?.scrollTop||0):scrollY}
  function restoreContentScroll(value){if(matchMedia('(max-width:899px)').matches&&state.route!=='login'){const main=$('#main');if(main)main.scrollTop=value}else scrollTo(0,value)}
  function navigate(route,id,scenario){if(state.chat)closeChat();scrollByRoute.set(state.route,contentScroll());state.route=route;state.id=id||1;state.scenario=scenario||({garage:'many',login:'phone'}[route]||'normal');state.bookingStep=-1;state.bookingNotice='';location.hash=pathFor(route,id);render();requestAnimationFrame(()=>{restoreContentScroll(scrollByRoute.get(route)||0);$('#main-title')?.focus({preventScroll:true})})}
  function status(text,type=''){return `<span class="status ${type}">${esc(text)}</span>`}
  const archiveLabel=()=>'<span class="archive-label"><i aria-hidden="true"></i>Архив</span>';
  function button(text,action,klass=''){return `<button type="button" class="button ${klass}" data-action="${action}">${text}</button>`}
  function navButton(route,label,ico){let selected=state.route===route||(route==='garage'&&state.route==='car')||(route==='history'&&state.route==='order');return `<button type="button" data-route="${route}" ${selected?'aria-current="page"':''}>${icon(ico)}<span>${label}</span></button>`}
  function shell(content,readable=false){const mobileNav=`<nav class="bottom-nav" aria-label="Основная навигация">${navButton('home','Главная','home')}${navButton('garage','Авто','car')}${navButton('bookings','Записи','calendar')}<button type="button" data-action="open-chat">${icon('chat')}<span>Написать</span></button>${navButton('more','Ещё','more')}</nav>`;return `<div class="app-shell"><aside class="sidebar" aria-label="Боковая навигация"><div class="brand"><span class="brand-mark">К</span>КОЛЕСОВИК</div><div class="nav-heading eyebrow">Кабинет клиента</div><nav class="side-nav" aria-label="Основная навигация">${navButton('home','Главная','home')}${navButton('garage','Мой гараж','car')}${navButton('bookings','Записи','calendar')}${navButton('history','История обслуживания','history')}${navButton('more','Ещё','more')}</nav><div class="sidebar-bottom">${button(`${icon('chat')} Написать сервису`,'open-chat','primary block')}<div class="sidebar-user"><strong>Мария Петрова</strong>Демонстрационный профиль</div></div></aside><div class="main"><div class="mobile-top"><div class="brand"><span class="brand-mark">К</span>КОЛЕСОВИК</div><button class="icon-button" data-action="open-chat" aria-label="Написать сервису">${icon('chat')}</button></div><main class="main-inner ${readable?'readable':''}" id="main">${content}</main></div>${state.route==='bookings'&&state.bookingStep>=0?'':mobileNav}</div>`}
  const head=(eyebrow,title,subtitle='',action='')=>`<header class="page-header"><div><div class="eyebrow">${eyebrow}</div><h1 id="main-title" tabindex="-1">${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div>${action}</header>`;
  const section=(title,content,action='')=>`<section class="content-section"><div class="section-title"><h2>${title}</h2>${action}</div>${content}</section>`;
  const stateBox=(title,detail,kind='')=>`<div class="inline-state ${kind}" role="${kind==='danger'?'alert':'status'}"><strong>${title}</strong><p>${detail}</p>${kind==='danger'?button('Повторить','reset-scenario','small'):''}</div>`;
  const loading = () => `<div class="panel"><div class="skeleton line short"></div><div class="skeleton line"></div><div class="skeleton block"></div></div>`;
  const commonState=()=>state.scenario==='loading'?loading():state.scenario==='error'?stateBox('Не удалось загрузить сведения','Проверьте соединение и повторите попытку. Другие разделы кабинета доступны.','danger'):null;
  function home(){let common=commonState();const hasBooking=state.scenario!=='no-booking';const many=state.scenario==='many';let action=button(`${icon('plus')} Записаться`,'new-booking','primary');let booking=hasBooking?`<div class="hero-panel"><div class="accent-rule"></div><div class="eyebrow">Ближайший визит</div><h2>Суббота, 3 октября · 10:30</h2><p>Toyota Camry · Плановое ТО<br>КОЛЕСОВИК · Центр</p><div class="hero-actions">${status('Подтверждена','success')}${button('Управлять записью','go-bookings')}</div></div>`:`<div class="hero-panel"><div class="accent-rule"></div><div class="eyebrow">Следующий шаг</div><h2>Будущих записей нет</h2><p>Выберите удобное время для обслуживания своего автомобиля.</p><div class="hero-actions">${action}</div></div>`;
    let carsShown=many?cars.slice(0,3):cars.slice(0,1);let carList=`<div class="panel" style="padding-block:4px">${carsShown.map(c=>`<div class="home-car"><span class="row-symbol">${icon('car')}</span><div><strong>${c.name}</strong><small>${c.plate} · ${c.last}</small></div><button data-route="car" data-id="${c.id}">Открыть</button></div>`).join('')}</div>`;
    return shell(`${head('Личный кабинет','Здравствуйте, Мария','Ваши автомобили и ближайшие действия.')}${common||`<div class="page-grid"><div><div class="eyebrow" style="margin-bottom:12px">Сейчас важно</div>${booking}${section('Мои автомобили',carList,`<button class="link-button" data-route="garage">Все автомобили ${icon('arrow')}</button>`)}${section('Последнее обслуживание',`<div class="panel"><div class="entity-row" style="padding-top:0"><div><h3>Плановое ТО и диагностика ходовой</h3><p>Toyota Camry · 18 сентября · акт А-2418</p></div><div class="meta-right"><strong class="amount">${rub(12980)}</strong></div></div><button class="link-button" data-route="order" data-id="2418" data-origin="home">Открыть акт ${icon('arrow')}</button></div>`)}</div><aside class="stack">${state.scenario==='warning'?stateBox('Пробег требует уточнения','У одного из обслуживаний пробег помечен для проверки.','warning'):''}<div class="panel stack"><div class="eyebrow">На связи</div><h2>Есть вопрос по автомобилю?</h2><p class="muted" style="font-size:.85rem">Продолжите разговор с сервисом в одном окне.</p>${button(`${icon('chat')} Написать сервису`,'open-chat','primary')}</div><div class="panel stack-tight"><div class="eyebrow">По вашим авто</div><p style="font-size:.86rem">Есть рекомендация: проверить передние тормозные колодки.</p><button class="link-button" data-route="recommendations">Все рекомендации ${icon('arrow')}</button></div></aside></div>`}`,true)
  }
  function garage(){let common=commonState();let shown=state.scenario==='one'?cars.slice(0,1):state.scenario==='archived'?cars.slice(2):cars;let body=state.scenario==='empty'?`<div class="panel"><span class="empty-illustration">${icon('car')}</span><h2>Автомобилей пока нет</h2><p class="muted" style="margin-top:8px">Автомобиль появится здесь после оформления обращения в сервисе.</p><div style="margin-top:18px">${button('Написать сервису','open-chat')}</div></div>`:`<div class="garage-list">${shown.map(c=>`<article class="car-card"><div><div class="eyebrow">${c.archived?'Автомобиль':'Ваш автомобиль'}</div><h2>${c.name} <span class="subtle" style="font-weight:450">${c.year}</span></h2><span class="plate mono">${c.plate}</span>${c.archived?archiveLabel():''}</div><div class="facts"><span>Пробег<strong>${c.mileage||'Нет данных'}</strong></span><span>Последнее обслуживание<strong>${c.last}</strong></span><span>Ближайшая запись<strong>${c.booking||'Нет записи'}</strong></span></div><div class="footer"><span style="font-size:.76rem;color:var(--text-2)">${c.recommendation?'Есть рекомендация':'Рекомендаций нет'}</span><button class="link-button" data-route="car" data-id="${c.id}">Открыть автомобиль ${icon('arrow')}</button></div></article>`).join('')}</div>`;return shell(`${head('Мой гараж','Мои автомобили','Сведения о машинах, визитах и сервисной истории.')}${common||body}`,true)}
  const currentCar=()=>cars.find(c=>c.id===state.id)||cars[0];
  function car(){const c=currentCar();let common=commonState();let scoped=orders.filter(o=>o.car.id===c.id);if(state.scenario==='empty-history')scoped=[];if(state.scenario==='long-history')scoped=[...scoped,...Array.from({length:9},(_,i)=>({id:1000+i,number:`А-${1800+i}`,date:`${12+i} июня 2025`,car:c,title:i%2?'Проверка подвески':'Плановое техническое обслуживание',total:5800+i*430,status:'Закрыт',pdf:false}))];let current=(state.scenario==='current-booking'||(c.booking&&!c.archived))?`<div class="current-item primary-line"><strong>Ближайшая запись · ${c.booking||'3 октября, 10:30'}</strong><p>Плановое ТО · КОЛЕСОВИК · Центр</p><button class="link-button" data-route="bookings">Управлять записью ${icon('arrow')}</button></div>`:'';let currentOrder=state.scenario==='current-booking'?`<div class="current-item"><strong>Текущее обслуживание</strong><p>Автомобиль находится в сервисе. Подробности уточняются у администратора.</p></div>`:'';let rec=state.scenario==='recommendations'||c.recommendation?`<div class="current-item"><strong>Рекомендация</strong><p>${c.recommendation||'Проверить состояние тормозной системы'}</p><button class="link-button" data-route="recommendations">Подробнее ${icon('arrow')}</button></div>`:'';let timeline=scoped.length?`<div class="timeline">${scoped.map(o=>`<article class="timeline-item"><time>${o.date}</time><h3>${o.title}</h3><p>Акт ${o.number} · ${o.status}</p><footer><strong class="amount">${rub(o.total)}</strong><button class="link-button" data-route="order" data-id="${o.id}" data-origin="car">Открыть акт ${icon('arrow')}</button></footer></article>`).join('')}</div>`:stateBox('История пока пуста','После первого обслуживания здесь появятся краткие записи о визитах.');return shell(`<button class="back-link" data-route="garage">${icon('back')} Мои автомобили</button>${head('Сервисная книжка',c.name,`${c.year} год${c.archived?'':' · Ваш автомобиль'}`)}${common||`<div class="page-grid"><div><div class="hero-panel"><div class="car-identity"><div><div class="eyebrow">Автомобиль</div><h2 style="margin-top:7px">${c.name}</h2><p>${c.year} год · Последний пробег: ${c.mileage||'нет данных'}</p></div><span class="plate mono">${c.plate}</span></div>${c.archived?`<div class="car-archive-inline">${archiveLabel()}</div>`:''}</div>${section('Что сейчас',current||currentOrder||rec?`<div class="car-current">${current}${currentOrder}${rec}</div>`:stateBox('Нет активных событий','Будущих записей и актуальных рекомендаций для этого авто нет.'))}${section('История обслуживания',timeline)}</div><aside>${section('Связанные сведения',`<div class="panel" style="padding-block:5px">${[['Рекомендации','recommendations','spark'],['Гарантия','warranty','shield'],['Шины на хранении','storage','tire'],['Документы','documents','file']].map(([label,route,ico])=>`<button class="doc-action" data-route="${route}"><span>${icon(ico)} ${label}</span>${icon('arrow')}</button>`).join('')}</div>`)}<div class="panel stack" style="margin-top:20px"><div class="eyebrow">Нужна помощь?</div><p style="font-size:.84rem">Уточните вопрос по этому автомобилю в сервисе.</p>${button('Написать сервису','open-chat')}</div></aside></div>`}`,true)}
  function history(){let common=commonState();let shown=state.historyCar==='all'?orders:orders.filter(o=>String(o.car.id)===state.historyCar);let body=state.scenario==='empty'?stateBox('Обслуживаний пока нет','Акты появятся здесь после первого завершённого визита.'): `<div class="entity-list">${shown.map(o=>`<article class="entity-row"><div class="row-leading"><span class="row-symbol">${icon('file')}</span><div><h3>${o.title}</h3><p>${o.date} · ${o.car.name} · ${o.car.plate}</p><p>Акт ${o.number} · ${o.status}</p></div></div><div class="meta-right"><strong class="amount">${rub(o.total)}</strong><button data-route="order" data-id="${o.id}" data-origin="history">Открыть акт</button></div></article>`).join('')}</div>`;return shell(`${head('Все автомобили','История обслуживания','Хронология всех завершённых обращений.',`<label class="field history-filter"><span class="sr-only">Автомобиль</span><select id="history-car"><option value="all" ${state.historyCar==='all'?'selected':''}>Все автомобили</option>${cars.map(c=>`<option value="${c.id}" ${state.historyCar===String(c.id)?'selected':''}>${c.name}</option>`).join('')}</select></label>`)}${common||body}`,true)}
  function order(){let o=orders.find(x=>x.id===state.id)||orders[0];let common=commonState();let legacy=state.scenario==='legacy-payment';let noPdf=state.scenario==='pdf-unavailable'||!o.pdf;let back=state.origin==='car'?`<button class="back-link" data-route="car" data-id="${o.car.id}">${icon('back')} Вернуться к автомобилю</button>`:`<button class="back-link" data-route="history">${icon('back')} Вся история</button>`;const rows=(values)=>`<div class="entity-list">${values.map(([name,qty,price])=>`<div class="entity-row"><div><h3>${name}</h3><p>${qty} шт.</p></div><strong class="amount">${rub(price)}</strong></div>`).join('')}</div>`;return shell(`${back}${head('Акт обслуживания',`Акт ${o.number}`,`${o.date} · ${o.car.name} · только чтение`)}${common||`<div class="page-grid"><div><div class="panel"><div class="eyebrow">Сведения об обращении</div><dl class="key-value" style="margin-top:19px"><dt>Автомобиль</dt><dd>${o.car.name} · <span class="mono">${o.car.plate}</span></dd><dt>Филиал</dt><dd>КОЛЕСОВИК · Центр</dd><dt>Пробег</dt><dd>${o.car.mileage||'Нет данных'}</dd><dt>Статус</dt><dd>${o.status}</dd></dl></div>${section('Что произошло',`<div class="panel stack"><div><div class="eyebrow">С чем обратились</div><p style="margin-top:7px">Плановое обслуживание, проверить стук при движении.</p></div><div class="divider"></div><div><div class="eyebrow">Что обнаружили</div><p style="margin-top:7px">Износ передних тормозных колодок.</p></div><div class="divider"></div><div><div class="eyebrow">Что сделали</div><p style="margin-top:7px">Заменили масло и фильтр, проверили ходовую часть.</p></div></div>`)}${section('Работы',rows([['Замена масла и фильтра',1,3200],['Диагностика ходовой части',1,2400]]))}${section('Запчасти',rows([['Масло моторное',1,5580],['Фильтр масляный',1,1800]]))}${section('Рекомендации',`<div class="current-item"><strong>Проверить передние тормозные колодки</strong><p>Рекомендация мастера по результату диагностики.</p></div>`)}</div><aside><div class="panel stack"><div class="eyebrow">Расчёт</div><div class="order-total"><span>Итого</span><strong class="amount">${rub(o.total)}</strong></div>${legacy?stateBox('Детализация оплаты недоступна','Для этого акта сохранён только прежний статус оплаты.','warning'):`<div class="stack-tight">${status('Оплачено','success')}<p class="muted" style="font-size:.78rem">Остаток к оплате: 0 ₽</p></div>`}</div>${section('Документы',noPdf?stateBox('PDF пока недоступен','Электронный файл для этого акта не предоставлен.'): `<div class="panel"><button class="doc-action" data-action="pdf-demo"><span>Акт ${o.number}<small>PDF · действие в прототипе</small></span>${icon('file')}</button></div>`)}<p class="readonly-note" style="margin-top:15px">Сведения доступны только для просмотра.</p></aside></div>`}`,true)}
  function bookingCard(b){const noReschedule=state.scenario==='cannot-reschedule';const noCancel=state.scenario==='cannot-cancel';return `<article class="booking-card"><div class="booking-card-top"><div><div class="eyebrow">${b.date} · ${b.time}</div><h3 style="margin-top:8px">${b.service}</h3><p>${cars.find(c=>c.id===b.carId)?.name||'Автомобиль'} · ${b.branch}</p></div>${status(b.status,'success')}</div><div class="booking-actions">${button('Перенести','reschedule','small') .replace('data-action="reschedule"',`data-action="reschedule" data-booking="${b.id}" ${noReschedule?'disabled aria-label="Перенос недоступен"':''}`)}${button('Отменить','cancel-booking','small ghost').replace('data-action="cancel-booking"',`data-action="cancel-booking" data-booking="${b.id}" ${noCancel?'disabled aria-label="Отмена недоступна"':''}`)}</div>${(noReschedule||noCancel)?`<p class="notice">${noReschedule?'Перенос':'Отмена'} этой записи недоступ${noReschedule?'ен':'на'}. Можно написать сервису.</p>`:''}</article>`}
  const bookingDateLabel=date=>date?new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`)):'';
  function bookingCalendar(){
    const month=state.bookingMonth,first=new Date(Date.UTC(2026,month,1));
    const offset=(first.getUTCDay()+6)%7,count=new Date(Date.UTC(2026,month+1,0)).getUTCDate();
    const labels={available:'Места есть',limited:'Мало мест',full:'Нет мест',closed:'Закрыто'};
    const shortLabels={available:'Есть',limited:'Мало',full:'Нет',closed:'Закр.'};
    let days=Array.from({length:offset},()=>'<span class="booking-day-blank" aria-hidden="true"></span>').join('');
    for(let day=1;day<=count;day++){
      const date=`2026-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const weekday=new Date(`${date}T12:00:00Z`).getUTCDay();
      const availability=weekday===0?'closed':day%7===5?'full':day%4===0?'limited':'available';
      const selected=state.bookingDate===date;
      days+=`<button class="booking-day booking-day--${availability}" data-booking-date="${date}" aria-pressed="${selected}" aria-label="${bookingDateLabel(date)} · ${labels[availability]}${selected?' · Выбрано':''}" ${availability==='full'||availability==='closed'?'disabled':''}><strong>${day}</strong>${selected?'':`<span>${shortLabels[availability]}</span>`}</button>`;
    }
    return `<div class="booking-calendar"><div class="booking-calendar-month"><button class="icon-button" data-action="booking-month-prev" aria-label="Предыдущий месяц" ${month===9?'disabled':''}>${icon('back')}</button><h3>${new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric',timeZone:'UTC'}).format(first).replace(/ г\.$/,'')}</h3><button class="icon-button" data-action="booking-month-next" aria-label="Следующий месяц" ${month===10?'disabled':''}>${icon('arrow')}</button></div><div class="booking-weekdays" aria-hidden="true">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="booking-days" aria-label="Календарь записи">${days}</div><p class="booking-legend"><span>● Места есть</span><span>◐ Мало мест</span><span>— Нет мест / закрыто</span></p></div>`
  }
  function bookingSummary(booking){
    const b=booking||{branch:'КОЛЕСОВИК · Центр',service:state.bookingService,carId:state.bookingCar,isoDate:state.bookingDate,time:state.bookingTime};
    const car=cars.find(c=>c.id===b.carId);
    return `<dl class="booking-summary"><div><dt>Филиал</dt><dd>${b.branch}</dd></div><div><dt>Дата</dt><dd>${bookingDateLabel(b.isoDate)}</dd></div><div><dt>Время</dt><dd>${b.time}</dd></div><div><dt>Услуга</dt><dd>${b.service}</dd></div><div><dt>Автомобиль</dt><dd>${car?.name||'Автомобиль'} · ${car?.plate||'—'}</dd></div></dl>`
  }
  function bookingWizard(){
    const move=state.bookingMode==='reschedule',step=state.bookingStep;
    const steps=move?['Дата','Время','Подтверждение']:['Дата','Услуга','Время','Автомобиль','Подтверждение'];
    const last=steps.length-1,target=state.bookings.find(b=>b.id===state.bookingTargetId);
    let body='',ready=false;
    if(step===0){body=`<p class="booking-selection">Выберите день. Время указано по часовому поясу филиала.</p>${bookingCalendar()}`;ready=Boolean(state.bookingDate)}
    if(!move&&step===1){body=`<p class="booking-selection">${bookingDateLabel(state.bookingDate)}</p><div class="booking-choices">${['Плановое ТО','Диагностика ходовой','Шиномонтаж'].map(s=>`<button class="booking-choice" data-service="${s}" aria-pressed="${state.bookingService===s}"><span>${icon('car')}</span><strong>${s}</strong><span aria-hidden="true">${state.bookingService===s?'✓':'○'}</span></button>`).join('')}</div>`;ready=Boolean(state.bookingService)}
    const timeStep=move?1:2;
    if(step===timeStep){
      body=`<p class="booking-selection">${bookingDateLabel(state.bookingDate)}${move?'':` · ${state.bookingService}`}</p>${state.scenario==='no-slots'?`<div class="booking-no-slots"><h3>Свободных слотов нет</h3><p>Выберите другой день. Доступность может измениться.</p>${button('Выбрать другую дату','booking-other-date')}</div>`:`<div class="booking-times">${['09:00','10:30','12:00','14:30','16:00','17:30'].map(t=>`<button data-time="${t}" aria-pressed="${state.bookingTime===t}">${t}</button>`).join('')}</div>`}`;
      ready=Boolean(state.bookingTime)&&state.scenario!=='no-slots';
    }
    if(!move&&step===3){body=`<p class="booking-selection">${bookingDateLabel(state.bookingDate)} · ${state.bookingTime}</p><div class="booking-choices"><h3>Ваши автомобили</h3>${cars.filter(c=>!c.archived).map(c=>`<button class="booking-choice" data-booking-car="${c.id}" aria-pressed="${state.bookingCar===c.id}"><span>${icon('car')}</span><strong>${c.name}<small>${c.plate}</small></strong><span aria-hidden="true">${state.bookingCar===c.id?'✓':'○'}</span></button>`).join('')}</div>`;ready=Boolean(state.bookingCar)}
    if(step===last){body=`<p class="booking-selection">Проверьте детали перед подтверждением.</p>${move?bookingSummary({...target,isoDate:state.bookingDate,time:state.bookingTime}):bookingSummary()}`;ready=true}
    const fixed=move?`<div class="booking-fixed" aria-label="Неизменяемый контекст записи"><span>Переносится только дата и время</span><strong>${target?.service||'Услуга'} · ${cars.find(c=>c.id===target?.carId)?.name||'Автомобиль'}</strong><small>${target?.branch||'КОЛЕСОВИК · Центр'}</small></div>`:'';
    return `<section class="booking-wizard" aria-label="${move?'Перенос записи':'Новая запись'}"><div class="booking-progress"><span>Шаг ${step+1} из ${steps.length} · ${steps[step]}</span><div role="progressbar" aria-label="Шаги записи" aria-valuemin="1" aria-valuemax="${steps.length}" aria-valuenow="${step+1}"><i style="width:${((step+1)/steps.length)*100}%"></i></div></div><div class="booking-wizard-content">${fixed}${step===0?'':`<h2>${step===last?'Проверьте запись':move&&step===1?'Выберите время':steps[step]}</h2>`}${body}</div><footer class="booking-wizard-footer">${button('← Назад','booking-back','ghost')}${button(step===last?(move?'Подтвердить перенос':'Записаться'):'Продолжить','booking-next','primary').replace('data-action=',`${ready?'':'disabled '}data-action=`)}</footer></section>`
  }
  function bookingResult(){
    const result=state.bookingResult;
    return `<div class="booking-result"><span class="booking-result-mark" aria-hidden="true">✓</span><h2>${result?.kind==='reschedule'?'Запись перенесена':'Запись подтверждена'}</h2>${bookingSummary(result?.booking)}${button('Открыть мои записи','booking-view-list')}${result?.kind==='create'?'<p class="notice">Это локальный результат прототипа. Запись в сервисе не создаётся.</p>':''}</div>`
  }
  function bookings(){
    const common=commonState();
    const notice=state.bookingNotice?stateBox(state.bookingNotice,'Это локальный результат прототипа.','success'):'';
    const statusMessage=state.scenario==='conflict'?stateBox('Запись изменилась','Обновите сведения и выберите время заново. Старая версия не отправляется повторно.','warning'):state.scenario==='unknown-outcome'?stateBox('Результат операции неизвестен','Обновите список записей перед повторным действием.','warning'):'';
    const list=`<div class="booking-list-flow">${notice}${statusMessage}<div class="booking-start">${button(`${icon('plus')} Новая запись`,'new-booking','primary')}</div><div class="section-title"><h2>Ближайшие записи</h2></div>${state.scenario==='empty'||state.bookings.length===0?stateBox('Будущих записей нет','Новая запись сразу появится здесь после подтверждения.'):state.bookings.map(bookingCard).join('')}</div>`;
    const body=state.bookingStep===-2?bookingResult():state.bookingStep>=0?bookingWizard():list;
    return shell(`${head('Планы обслуживания','Записи','Будущие визиты и действия с ними.')}${common||body}`,true)
  }
  function more(){const items=[['Рекомендации','Дальнейшие работы','spark','recommendations'],['Гарантия','Обращения и результат','shield','warranty'],['Шины на хранении','Комплекты и сроки','tire','storage'],['Оплаты и возвраты','История операций','card','payments'],['Документы','Доступные PDF','file','documents'],['История обслуживания','Акты по всем авто','history','history']];let common=commonState();return shell(`${head('Разделы кабинета','Ещё','Документы, связанные сведения и настройки.')}${common||`<div class="more-grid">${items.map(([t,s,ico,route])=>`<button class="more-link" data-route="${route}">${icon(ico)}<span><strong>${t}</strong><small>${s}</small></span>${icon('arrow')}</button>`).join('')}<button class="more-link" data-route="store">${icon('spark')}<span><strong>Магазин</strong><small>Дизайн-концепция · следующий этап</small></span>${icon('arrow')}</button></div>${section('Оформление',`<div class="panel"><p class="muted" style="font-size:.84rem;margin-bottom:14px">Тема сохраняется только для этого прототипа.</p><div class="theme-group" role="group" aria-label="Тема оформления">${['light','dark','system'].map(x=>`<button data-theme-choice="${x}" aria-pressed="${state.theme===x}">${x==='light'?'Светлая':x==='dark'?'Тёмная':'Системная'}</button>`).join('')}</div></div>`)}<div style="margin-top:22px">${button(`${icon('logout')} Выйти`,'logout','ghost')}</div>`}`,true)}
  function secondary(){
    const route=state.route,common=commonState();
    const map={
      recommendations:{intro:'Советы мастера по вашим автомобилям.',items:[['Проверить передние тормозные колодки','Toyota Camry · акт А-2418 · актуально','warning'],['Проверить аккумулятор перед зимой','Kia Rio · акт А-2380','']]},
      warranty:{intro:'Гарантийные обращения и связанные акты.',items:[['Проверка выполненной работы','Toyota Camry · обращение от 21 сентября','success']]},
      storage:{intro:'Комплекты шин, переданные на хранение.',items:[['Зимний комплект · 4 шины','Toyota Camry · хранение до 15 октября','success']]},
      payments:{intro:'История операций. Тип операции не означает способ оплаты.',items:[['Предоплата · акт А-2418','12 сентября 2026 · Toyota Camry','success',3000],['Оплата · акт А-2418','18 сентября 2026 · Toyota Camry','success',9980],['Возврат · акт А-2264','8 мая 2026 · Toyota Camry','',1800]]},
      documents:{intro:'Файлы, доступные для ваших обращений.',items:[['Акт А-2418 · PDF','Toyota Camry · 18 сентября 2026',''],['Акт А-2380 · PDF','Kia Rio · 12 августа 2026','']]}
    };
    const data=map[route],contextCar=cars.find(c=>c.id===state.contextCarId);
    if(contextCar){data.items=data.items.filter(item=>item[1].includes(contextCar.name));data.intro=`Связано с автомобилем ${contextCar.name}.`}
    const detail=state.secondaryId===2&&data.items.length>0;
    let content;
    if(state.scenario==='empty'||data.items.length===0)content=stateBox('Пока нет сведений','Когда они появятся в сервисе, вы увидите их здесь.');
    else if(route==='payments')content=`<div class="entity-list">${data.items.map(i=>`<div class="entity-row"><div><h3>${i[0]}</h3><p>${i[1]}</p></div><strong class="amount">${rub(i[3])}</strong></div>`).join('')}</div>`;
    else if(route==='documents')content=`<div class="entity-list">${data.items.map(i=>`<button class="doc-action" data-action="pdf-demo"><span>${i[0]}<small>${i[1]}</small></span>${icon('file')}</button>`).join('')}</div>`;
    else if(detail&&route!=='recommendations')content=`<div class="panel stack"><div class="eyebrow">${routeNames[route]} · сведения</div><h2>${data.items[0][0]}</h2><p class="muted">${data.items[0][1]}</p><div class="divider"></div><dl class="key-value"><dt>Автомобиль</dt><dd>${contextCar?.name||'Toyota Camry'}</dd><dt>Статус</dt><dd>Актуально</dd><dt>Связанный акт</dt><dd>А-2418</dd></dl>${route==='storage'?`<div class="inline-state"><strong>Документы</strong><p>Договор доступен; акт возврата пока не предоставлен.</p><button class="link-button" data-action="pdf-demo">Открыть договор ${icon('file')}</button></div>`:button('Открыть исходный акт','secondary-order')}</div>`;
    else content=`<div class="entity-list">${data.items.map((i,n)=>`<article class="entity-row"><div><h3>${i[0]}</h3><p>${i[1]}</p></div><div class="meta-right">${status(n?'История':'Актуально',i[2])}<br><button data-action="secondary-detail" data-secondary="${route}">${route==='recommendations'?'Открыть акт':'Подробнее'}</button></div></article>`).join('')}</div>`;
    const back=detail?`<button class="back-link" data-action="secondary-back">${icon('back')} ${routeNames[route]}</button>`:contextCar?`<button class="back-link" data-route="car" data-id="${contextCar.id}">${icon('back')} ${contextCar.name}</button>`:`<button class="back-link" data-route="more">${icon('back')} Ещё</button>`;
    return shell(`${back}${head('Связанные сведения',routeNames[route],data.intro)}${common||content}`,true)
  }
  function store(){return shell(`<button class="back-link" data-route="more">${icon('back')} Ещё</button>${head('Будущий этап','Магазин','Дизайн-концепция')}${stateBox('Следующий отдельный этап','Каталог и оформление заказа здесь не реализованы. После принятия Customer Core возможен Customer Store Prototype на общем catalog domain Next.','info')}`,true)}
  function login(){const stage=['phone','otp'].includes(state.scenario)?state.scenario:state.loginStep;const errorMap={'wrong-code':'Неверный код. Проверьте SMS.','expired':'Код истёк. Получите новый код.','attempt-limit':'Лимит попыток исчерпан. Подождите перед новым запросом.','sms-unavailable':'Вход по SMS временно недоступен.','rate-limit':'Слишком много запросов. Подождите и повторите.'};let err=errorMap[state.scenario];let form=stage==='otp'?`<form id="otp-form" class="form-stack"><label class="field">Код из SMS<input id="otp" class="otp-input" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" value="${esc(state.otp)}" aria-label="Шестизначный код из SMS"></label><button class="button primary block" type="submit">${state.scenario==='loading'?'Проверяем…':'Войти'}</button><button class="link-button" type="button" data-action="resend" ${state.resend>0?'disabled':''}>Отправить код снова${state.resend>0?` через ${state.resend} с`:''}</button><button class="link-button" type="button" data-action="login-back">Изменить номер</button></form>`:`<form id="phone-form" class="form-stack"><label class="field">Номер телефона<div class="phone-input"><span>+7</span><input id="phone" inputmode="tel" autocomplete="tel-national" placeholder="(999) 000-00-00" maxlength="15" value="${esc(state.phone)}" aria-label="Номер телефона без кода страны"></div><small>Отправим код подтверждения по SMS.</small></label><button class="button primary block" type="submit">${state.scenario==='loading'?'Отправляем…':'Получить код'}</button></form>`;return `<div class="login-shell"><div class="login-branding"><div class="brand" style="padding:0"><span class="brand-mark">К</span>КОЛЕСОВИК</div><div><div class="accent-rule"></div><h1>Всё о вашем автомобиле — в одном месте.</h1><p>Записи, история обслуживания, документы и связь с сервисом.</p></div><footer>ДИЗАЙН-ПРОТОТИП / вымышленные данные</footer></div><main class="login-content"><div class="login-panel"><div class="eyebrow">Личный кабинет</div><h2 id="main-title" tabindex="-1">${stage==='otp'?'Введите код':'Вход по телефону'}</h2><p>${stage==='otp'?'Код отправлен на номер +7 '+(state.phone||'(999) 123-45-67'):'Войдите, чтобы продолжить работу с автомобилями.'}</p>${err?`<div class="inline-state danger login-error" role="alert"><strong>${err}</strong></div>`:''}${state.scenario==='success'?stateBox('Вход подтверждён','В прототипе откройте кабинет кнопкой ниже.','success'):form}${state.scenario==='success'?button('Перейти в кабинет','login-finish','primary block'):''}<p class="login-foot">Все действия в этом экране локальны. SMS не отправляется.</p></div></main></div>`}
  function render(){applyTheme();let route=state.route;document.documentElement.classList.toggle('customer-shell-active',route!=='login');document.body.classList.toggle('customer-shell-active',route!=='login');app.innerHTML=({home,garage,car,history,order,bookings,more,recommendations:secondary,warranty:secondary,storage:secondary,payments:secondary,documents:secondary,store,login})[route]();renderOverlays();lastRoute=route}
  function openControls(){
    if(state.controls)return;
    focusReturn=document.activeElement;
    state.controls=true;
    controlsRoot.innerHTML=renderControls();
    $('.controls-panel select',controlsRoot)?.focus();
  }
  function closeControls(){
    if(!state.controls)return;
    state.controls=false;
    controlsRoot.replaceChildren();
    const fallback=state.chat?chatShell?.querySelector('[data-action="open-controls"]'):$('#controls-open');
    (focusReturn?.isConnected?focusReturn:fallback)?.focus({preventScroll:true});
    focusReturn=null;
  }
  function chatMessages(){let s=state.chatScenario;let messages=[{type:'customer',text:'Здравствуйте! Хотела уточнить по обслуживанию Camry.',time:'10:16'},{type:'system',text:'Разговор передан администратору',time:'10:16'},{type:'admin',text:'Здравствуйте, Мария. Подскажите, что вас интересует?',time:'10:19'}];if(s==='new')messages=[];if(s==='customer-admin')messages=messages.filter((_,i)=>i!==1);if(s==='handoff')messages=messages.slice(0,2);if(s==='booking-event'||s==='history'||s==='closed'||s==='continue')messages.push({type:'event',text:'Запись подтверждена · 3 октября, 10:30 · Toyota Camry · Плановое ТО',time:'10:20'});if(s==='closed'||s==='continue')messages.push({type:'system',text:'Разговор завершён. Вы можете написать снова.',time:'11:04'});messages.push(...state.chatMessages);return messages}
  function chatMessageHtml(m){
    if(m.type==='system')return `<div class="chat-system" role="note"><span>${icon('spark')}</span>${esc(m.text)}</div>`;
    if(m.type==='event')return `<div class="chat-booking-event"><div class="chat-event-kicker">${icon('calendar')} Событие записи</div><strong>Запись подтверждена</strong><p>${esc(m.text.replace(/^Запись подтверждена · /,''))}</p><button class="link-button" data-action="chat-booking">Посмотреть запись ${icon('arrow')}</button></div>`;
    return `<div class="chat-message ${m.type==='customer'?'mine':''}"><div class="chat-author">${m.type==='customer'?'Вы':'Администратор'} <time>${esc(m.time)}</time></div><div class="chat-bubble">${esc(m.text)}</div></div>`;
  }
  function chatHistoryHtml(){
    const messages=chatMessages();
    return `<div class="chat-date">Сегодня</div>${messages.length?messages.map(chatMessageHtml).join(''):`<div class="chat-empty"><span class="empty-illustration">${icon('chat')}</span><h2>Напишите сервису</h2><p>Ваш разговор начнётся здесь. Ответ администратора появится в диалоге.</p></div>`}`;
  }
  function renderChat(){
    return `<div class="overlay chat-overlay" data-overlay="chat"><section class="drawer" role="dialog" aria-modal="true" aria-labelledby="chat-title"><header class="chat-header"><span class="chat-brand">К</span><div class="chat-header-title"><strong id="chat-title">Написать сервису</strong><small>КОЛЕСОВИК · Центр</small></div><div class="chat-header-actions"><button class="icon-button" data-action="open-controls" aria-label="Сценарии прототипа">⚙</button><button class="icon-button" data-action="close-chat" aria-label="Закрыть диалог">${icon('x')}</button></div></header><div class="chat-context"><span class="chat-presence"><i></i><span id="chat-presence-text">На связи с сервисом</span></span><span>Текущий филиал</span></div><div class="chat-history" id="chat-history" role="log" aria-label="История сообщений" tabindex="0">${chatHistoryHtml()}</div><form id="chat-form" class="chat-composer"><div class="chat-feedback" id="chat-feedback" hidden></div><div class="chat-placeholder-note" id="chat-notice" role="status" hidden></div><div class="composer-row"><button class="chat-tool" type="button" data-action="chat-attachment" aria-label="Вложения — будущая функция" title="FUTURE DESIGN PLACEHOLDER · Вложения">${icon('attach')}</button><textarea id="chat-input" rows="1" placeholder="Сообщение сервису" aria-label="Сообщение сервису" maxlength="1000">${esc(state.draft)}</textarea><button class="chat-send" type="submit" aria-label="Отправить сообщение">${icon('send')}</button><button class="chat-tool" type="button" data-action="chat-dictation" aria-label="Диктовка — будущая функция" title="FUTURE DESIGN PLACEHOLDER · Диктовка">${icon('mic')}</button></div><div class="composer-note" id="chat-composer-note">Вложения и диктовка · FUTURE DESIGN PLACEHOLDER</div></form><div class="chat-closed" hidden><strong>Разговор завершён</strong><p>История доступна. Вы можете начать общение снова с этим филиалом.</p>${button('Продолжить общение','chat-continue','primary')}</div></section></div>`;
  }
  function resizeChatInput(){
    if(!chatInput)return;
    chatInput.style.height='auto';
    chatInput.style.height=Math.min(chatInput.scrollHeight,108)+'px';
    chatInput.style.overflowY=chatInput.scrollHeight>108?'auto':'hidden';
  }
  function syncChatView(){
    if(!chatShell)return;
    const closed=state.chatSendState==='closed';
    chatShell.querySelector('#chat-presence-text').textContent=closed?'История разговора':'На связи с сервисом';
    chatShell.querySelector('#chat-form').hidden=closed;
    chatShell.querySelector('.chat-closed').hidden=!closed;
    const hasDraft=Boolean(state.draft.trim());
    const send=chatShell.querySelector('.chat-send');
    const mic=chatShell.querySelector('[data-action="chat-dictation"]');
    send.hidden=!hasDraft;
    send.disabled=state.chatSendState!=='idle';
    mic.hidden=hasDraft;
    mic.disabled=state.chatSendState==='sending_demo';
    chatShell.querySelector('#chat-composer-note').textContent=state.chatSendState==='sending_demo'?'Отправляется…':'Вложения и диктовка · FUTURE DESIGN PLACEHOLDER';
    const feedback=chatShell.querySelector('#chat-feedback');
    feedback.hidden=!['error_demo','unknown_demo'].includes(state.chatSendState);
    if(state.chatSendState==='error_demo'){
      feedback.className='chat-feedback danger';feedback.setAttribute('role','alert');
      feedback.innerHTML='<strong>Не удалось отправить</strong><span>Текст сохранён. Проверьте соединение и повторите попытку.</span>';
    }else if(state.chatSendState==='unknown_demo'){
      feedback.className='chat-feedback warning';feedback.setAttribute('role','status');
      feedback.innerHTML='<strong>Результат отправки неизвестен</strong><span>Проверьте историю перед повтором.</span><button data-action="chat-reconcile" type="button">Проверил историю</button>';
    }else{feedback.replaceChildren();feedback.removeAttribute('role')}
    const notice=chatShell.querySelector('#chat-notice');
    notice.hidden=!state.chatNotice;
    notice.textContent=state.chatNotice;
    resizeChatInput();
  }
  function refreshChatHistory(){
    if(!chatShell)return;
    const history=chatShell.querySelector('#chat-history');
    const atBottom=history.scrollHeight-history.scrollTop-history.clientHeight<80;
    history.innerHTML=chatHistoryHtml();
    if(atBottom)history.scrollTop=history.scrollHeight;
  }
  function appendChatMessage(message){
    const history=chatShell?.querySelector('#chat-history');
    if(!history)return;
    const atBottom=history.scrollHeight-history.scrollTop-history.clientHeight<80;
    history.querySelector('.chat-empty')?.remove();
    history.insertAdjacentHTML('beforeend',chatMessageHtml(message));
    if(atBottom)history.scrollTop=history.scrollHeight;
  }
  function bindChatListeners(){
    chatListeners=new AbortController();
    const signal=chatListeners.signal;
    const listen=(node,type,handler)=>node.addEventListener(type,handler,{signal});
    let composing=false;
    listen(chatShell.querySelector('[data-action="close-chat"]'),'click',e=>{e.preventDefault();e.stopPropagation();closeChat()});
    listen(chatShell.querySelector('[data-action="open-controls"]'),'click',e=>{e.preventDefault();e.stopPropagation();openControls()});
    listen(chatInput,'compositionstart',()=>{composing=true});
    listen(chatInput,'compositionend',()=>{composing=false;state.draft=chatInput.value;syncChatView()});
    listen(chatInput,'input',()=>{state.draft=chatInput.value;syncChatView();chatDiagnostics.lastLifecycleEvent='input'});
    listen(chatShell.querySelector('#chat-form'),'submit',e=>{
      e.preventDefault();e.stopPropagation();
      if(composing||state.chatSendState!=='idle')return;
      const value=chatInput.value.trim();
      if(!value)return;
      const message={type:'customer',text:value,time:'сейчас'};
      state.chatMessages.push(message);
      appendChatMessage(message);
      chatInput.value='';state.draft='';state.chatNotice='';
      syncChatView();
      chatDiagnostics.chatSendCount++;
      chatDiagnostics.lastLifecycleEvent='send';
      live.textContent='Сообщение добавлено в локальный диалог';
    });
    listen(chatShell.querySelector('[data-action="chat-attachment"]'),'click',e=>{e.stopPropagation();state.chatNotice='Вложения — FUTURE DESIGN PLACEHOLDER. Отправка файлов в прототипе недоступна.';syncChatView()});
    listen(chatShell.querySelector('[data-action="chat-dictation"]'),'click',e=>{e.stopPropagation();state.chatNotice='Диктовка — FUTURE DESIGN PLACEHOLDER. Запись звука в прототипе недоступна.';syncChatView()});
    listen(chatShell.querySelector('[data-action="chat-continue"]'),'click',e=>{e.stopPropagation();state.chatScenario='continue';state.chatSendState='idle';refreshChatHistory();syncChatView()});
    listen(chatShell,'click',e=>{
      const action=e.target.closest('[data-action]')?.dataset.action;
      if(action==='chat-booking'){e.stopPropagation();closeChat();navigate('bookings')}
      if(action==='chat-reconcile'){e.stopPropagation();state.chatSendState='idle';state.chatNotice='Проверьте историю перед повторной отправкой сообщения.';syncChatView()}
    });
    listen(chatShell,'keydown',e=>{
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeChat();return}
      if(e.key!=='Tab')return;
      const nodes=[...chatShell.querySelectorAll('button:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(n=>n.getClientRects().length);
      if(!nodes.length)return;
      if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus()}
      else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus()}
    });
  }
  function renderControls(){let routes=Object.keys(routeNames).filter(x=>x!=='car'&&x!=='order');return `<div class="controls" data-overlay="controls"><section class="controls-panel" role="dialog" aria-modal="true" aria-labelledby="controls-title"><header><h2 id="controls-title">Prototype Controls</h2><button class="icon-button" data-action="close-controls" aria-label="Закрыть Prototype Controls">${icon('x')}</button></header><p>Локальные сценарии. Данные и действия вымышлены.</p><label class="field">Экран<select id="control-route">${routes.map(r=>`<option value="${r}" ${state.route===r?'selected':''}>${routeNames[r]}</option>`).join('')}<option value="car" ${state.route==='car'?'selected':''}>Карточка автомобиля</option><option value="order" ${state.route==='order'?'selected':''}>Полный акт</option><option value="ask" ${state.chat?'selected':''}>Написать сервису</option></select></label><label class="field">Состояние<select id="control-scenario">${(scenarioOptions[state.chat?'ask':state.route]||['normal']).map(s=>`<option value="${s}" ${(state.chat?state.chatScenario:state.scenario)===s?'selected':''}>${scenarioNames[s]||s}</option>`).join('')}</select></label><label class="field">Тема<select id="control-theme"><option value="light" ${state.theme==='light'?'selected':''}>Светлая</option><option value="dark" ${state.theme==='dark'?'selected':''}>Тёмная</option><option value="system" ${state.theme==='system'?'selected':''}>Системная</option></select></label><footer>${button('Скрыть controls','close-controls')}</footer></section></div>`}
  function renderDialog(){if(!state.overlay)return '';let type=state.overlay.type;let b=state.bookings.find(x=>x.id===state.overlay.id)||state.bookings[0];let title=type==='cancel'?'Отменить запись?':type==='pdf'?'Документ в прототипе':type==='logout'?'Выйти из кабинета?':'Подтверждение';let body=type==='cancel'?`<p> ${b?.date} · ${b?.time}<br><strong>${b?.service}</strong><br>${b?.branch}</p><p class="muted" style="margin-top:13px">После отмены запись исчезнет из списка будущих визитов.</p>`:type==='pdf'?`<p>В этом локальном дизайн-прототипе PDF не загружается.</p>`:type==='logout'?`<p>Вы вернётесь на демонстрационный экран входа.</p>`:'<p>Действие локально для прототипа.</p>';let act=type==='cancel'?button('Отменить запись','confirm-cancel','danger'):type==='logout'?button('Выйти','confirm-logout','primary'):'';return `<div class="overlay" data-overlay="dialog"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><header><h2 id="dialog-title">${title}</h2><button class="icon-button" data-action="close-dialog" aria-label="Закрыть окно">${icon('x')}</button></header><div class="dialog-body">${body}</div><footer class="dialog-footer">${button(type==='pdf'?'Понятно':'Оставить','close-dialog')}${act}</footer></section></div>`}
  function renderOverlays(){
    if(state.chat){
      if(!chatShell){
        overlayRoot.innerHTML=renderChat();
        chatShell=overlayRoot.querySelector('.chat-overlay');
        chatInput=chatShell.querySelector('#chat-input');
        bindChatListeners();
        const history=chatShell.querySelector('#chat-history');
        history.scrollTop=history.scrollHeight;
      }
      syncChatView();
      return;
    }
    overlayRoot.innerHTML=renderDialog();
  }
  function openChat(scenario){
    if(state.chat){
      if(scenario){state.chatScenario=scenario;state.chatSendState=scenario==='closed'?'closed':scenario==='sending'?'sending_demo':scenario==='error'?'error_demo':scenario==='unknown-outcome'?'unknown_demo':'idle';refreshChatHistory();syncChatView()}
      return;
    }
    chatFocusReturn=document.activeElement;
    state.chat=true;state.chatScenario=scenario||'history';state.chatSendState=scenario==='closed'?'closed':scenario==='sending'?'sending_demo':scenario==='error'?'error_demo':scenario==='unknown-outcome'?'unknown_demo':'idle';state.chatNotice='';state.draft='';state.chatMessages=[];
    document.documentElement.classList.add('chat-open');
    document.body.classList.add('chat-open');
    const bar=$('#prototype-bar');
    chatBackgroundAria=[app.getAttribute('aria-hidden'),bar.getAttribute('aria-hidden')];
    app.setAttribute('aria-hidden','true');bar.setAttribute('aria-hidden','true');
    renderOverlays();
    chatDiagnostics.chatOpenCount++;chatDiagnostics.lastLifecycleEvent='open';
    chatShell.querySelector('[data-action="close-chat"]').focus({preventScroll:true});
  }
  function destroyChatSession(){
    chatListeners?.abort();chatListeners=null;
    chatShell?.remove();chatShell=null;chatInput=null;
    state.controls=false;controlsRoot.replaceChildren();
    document.documentElement.classList.remove('chat-open');
    document.body.classList.remove('chat-open');
    const bar=$('#prototype-bar');
    for(const [node,value] of [[app,chatBackgroundAria?.[0]],[bar,chatBackgroundAria?.[1]]]){
      if(value===null||value===undefined)node.removeAttribute('aria-hidden');else node.setAttribute('aria-hidden',value);
    }
    chatBackgroundAria=null;
    state.chat=false;state.chatScenario='history';state.chatSendState='idle';state.chatNotice='';state.draft='';state.chatMessages=[];
    chatDiagnostics.chatDestroyCount++;chatDiagnostics.lastLifecycleEvent='destroy';
  }
  function closeChat(){
    if(!state.chat)return;
    const returnTo=chatFocusReturn;
    const wasEditing=document.activeElement===chatInput;
    destroyChatSession();
    chatDiagnostics.chatCloseCount++;chatDiagnostics.lastLifecycleEvent='close';
    const fallback=[...document.querySelectorAll('[data-action="open-chat"]')].find(x=>x.getClientRects().length);
    if(!wasEditing)(returnTo?.isConnected?returnTo:fallback)?.focus({preventScroll:true});
    chatFocusReturn=null;focusReturn=null;
  }
  function openDialog(type,id){focusReturn=document.activeElement;state.overlay={type,id};renderOverlays();$('.dialog .icon-button')?.focus();document.body.style.overflow='hidden'}
  function closeDialog(){state.overlay=null;document.body.style.overflow='';renderOverlays();focusReturn?.focus()}
  function setScenario(s){
    if(state.chat){
      state.chatScenario=s;
      state.chatSendState=s==='closed'?'closed':s==='sending'?'sending_demo':s==='error'?'error_demo':s==='unknown-outcome'?'unknown_demo':'idle';
      state.chatNotice='';
      refreshChatHistory();syncChatView();
    }else{
      const previous=state.scenario;state.scenario=s;
      if(state.route==='login'&&['phone','otp'].includes(s))state.loginStep=s;
      if(state.route==='car'&&s==='archived'){state.id=3;window.history.replaceState(null,'','#/cars/3')}
      else if(state.route==='car'&&previous==='archived'){state.id=1;window.history.replaceState(null,'','#/cars/1')}
      if(state.route==='bookings')state.bookingNotice=s==='success'?'Запись подтверждена':'';
      render();
    }
    if(state.chat)live.textContent=`Сценарий: ${scenarioNames[s]||s}`;
    else announce(`Сценарий: ${scenarioNames[s]||s}`);
  }
  function startNewBooking(){
    if(state.route!=='bookings')navigate('bookings');
    state.bookingMode='create';state.bookingStep=0;state.bookingMonth=9;
    state.bookingDate='';state.bookingService='';state.bookingTime='';state.bookingCar=0;
    state.bookingTargetId=null;state.bookingResult=null;state.bookingNotice='';state.scenario='normal';render();
  }
  function startReschedule(id){
    const booking=state.bookings.find(b=>b.id===id);if(!booking)return;
    state.bookingMode='reschedule';state.bookingStep=0;state.bookingTargetId=id;
    state.bookingDate=booking.isoDate;state.bookingMonth=Number(booking.isoDate?.slice(5,7)||10)-1;
    state.bookingTime=booking.time;state.bookingResult=null;state.bookingNotice='';render();
  }
  function bookingNext(){
    const move=state.bookingMode==='reschedule',step=state.bookingStep,last=move?2:4;
    const ready=move?[Boolean(state.bookingDate),Boolean(state.bookingTime),true][step]:[Boolean(state.bookingDate),Boolean(state.bookingService),Boolean(state.bookingTime)&&state.scenario!=='no-slots',Boolean(state.bookingCar),true][step];
    if(!ready)return;
    if(step<last){state.bookingStep++;render();return}
    if(state.scenario==='conflict'||state.scenario==='unknown-outcome'){
      state.bookingStep=-1;state.bookingNotice='';render();announce(state.scenario==='conflict'?'Запись изменилась. Обновите данные.':'Результат операции неизвестен. Проверьте список записей.');return;
    }
    let booking;
    if(move){
      booking=state.bookings.find(b=>b.id===state.bookingTargetId);if(!booking)return;
      booking.isoDate=state.bookingDate;booking.date=bookingDateLabel(state.bookingDate);booking.time=state.bookingTime;
    }else{
      booking={id:Date.now(),isoDate:state.bookingDate,date:bookingDateLabel(state.bookingDate),time:state.bookingTime,service:state.bookingService,carId:state.bookingCar,branch:'КОЛЕСОВИК · Центр',status:'Подтверждена'};
      state.bookings.unshift(booking);
    }
    state.bookingResult={kind:move?'reschedule':'create',booking:{...booking}};
    state.bookingStep=-2;state.scenario='success';render();announce(move?'Запись перенесена':'Запись подтверждена');
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('.chat-overlay'))return;
    const t=e.target.closest('[data-route],[data-action],[data-theme-choice],[data-service],[data-time],[data-booking-car],[data-booking-date]');if(!t)return;
    if(t.dataset.route){if(t.dataset.origin)state.origin=t.dataset.origin;if(['recommendations','warranty','storage','documents'].includes(t.dataset.route))state.contextCarId=state.route==='car'?state.id:null;if(t.dataset.route==='more')state.contextCarId=null;navigate(t.dataset.route,Number(t.dataset.id)||undefined);return}
    if(t.dataset.themeChoice){setTheme(t.dataset.themeChoice);return}
    if(t.dataset.bookingDate){state.bookingDate=t.dataset.bookingDate;state.bookingTime='';render();return}
    if(t.dataset.service){state.bookingService=t.dataset.service;render();return}
    if(t.dataset.time){state.bookingTime=t.dataset.time;render();return}
    if(t.dataset.bookingCar){state.bookingCar=Number(t.dataset.bookingCar);render();return}
    switch(t.dataset.action){
      case 'open-chat':openChat();break;
      case 'open-controls':openControls();break;case 'close-controls':closeControls();break;
      case 'reset-scenario':setScenario(state.route==='garage'?'many':'normal');break;
      case 'new-booking':startNewBooking();break;case 'go-bookings':navigate('bookings');break;
      case 'booking-next':bookingNext();break;
      case 'booking-back':if(state.bookingStep>0)state.bookingStep--;else state.bookingStep=-1;render();break;
      case 'booking-month-prev':state.bookingMonth=Math.max(9,state.bookingMonth-1);state.bookingDate='';state.bookingTime='';render();break;
      case 'booking-month-next':state.bookingMonth=Math.min(10,state.bookingMonth+1);state.bookingDate='';state.bookingTime='';render();break;
      case 'booking-other-date':state.bookingStep=0;state.bookingDate='';state.bookingTime='';state.scenario='normal';render();break;
      case 'booking-view-list':state.bookingStep=-1;state.bookingResult=null;state.bookingNotice='';state.scenario='normal';render();break;
      case 'reschedule':startReschedule(Number(t.dataset.booking));break;
      case 'cancel-booking':openDialog('cancel',Number(t.dataset.booking));break;
      case 'confirm-cancel':state.bookings=state.bookings.filter(b=>b.id!==state.overlay.id);state.bookingNotice='Запись отменена';closeDialog();render();announce('Запись отменена');break;
      case 'close-dialog':closeDialog();break;case 'pdf-demo':openDialog('pdf');break;
      case 'logout':openDialog('logout');break;case 'confirm-logout':closeDialog();navigate('login');break;
      case 'login-finish':navigate('home');break;case 'login-back':state.loginStep='phone';state.scenario='phone';render();break;
      case 'resend':state.resend=38;state.scenario='otp';render();announce('Демонстрационный код отправлен локально');break;
      case 'secondary-detail':if(state.route==='recommendations'){state.origin='history';navigate('order',2418)}else{state.secondaryId=2;render()}break;
      case 'secondary-back':state.secondaryId=1;render();break;case 'secondary-order':state.origin='history';navigate('order',2418);break;
    }
  }
  );
  $('#controls-open').addEventListener('click',openControls);
  document.addEventListener('change',e=>{
    if(e.target.id==='control-route'){
      const route=e.target.value;
      closeControls();
      if(route==='ask'){
        if(state.chat){state.chatScenario='new';state.chatSendState='idle';refreshChatHistory();syncChatView()}
        else openChat('new');
      }else navigate(route,route==='order'?2418:1);
      openControls();
    }
    if(e.target.id==='control-scenario')setScenario(e.target.value);
    if(e.target.id==='control-theme')setTheme(e.target.value);
    if(e.target.id==='history-car'){state.historyCar=e.target.value;render()}
    if(e.target.id==='booking-date')state.bookingDate=e.target.value;
  });
  document.addEventListener('input',e=>{
    if(e.target.closest('.chat-overlay'))return;
    if(e.target.id==='phone'){
      let d=e.target.value.replace(/\D/g,'').replace(/^7/,'').slice(0,10),v='';
      if(d.length)v='('+d.slice(0,3)+(d.length>=3?') ':'');
      if(d.length>3)v+=d.slice(3,6);
      if(d.length>6)v+='-'+d.slice(6,8);
      if(d.length>8)v+='-'+d.slice(8,10);
      e.target.value=v;state.phone=v;
    }
    if(e.target.id==='otp'){e.target.value=e.target.value.replace(/\D/g,'').slice(0,6);state.otp=e.target.value}
  });
  document.addEventListener('submit',e=>{
    if(e.target.closest('.chat-overlay'))return;
    if(e.target.id==='phone-form'){
      e.preventDefault();
      if(state.phone.replace(/\D/g,'').length!==10){announce('Укажите 10 цифр номера');$('#phone')?.focus();return}
      state.loginStep='otp';state.scenario='otp';render();$('#otp')?.focus();
    }
    if(e.target.id==='otp-form'){
      e.preventDefault();
      if(state.otp.length!==6){announce('Введите шестизначный код');return}
      state.scenario='success';render();
    }
  });
  document.addEventListener('keydown',e=>{if(e.target.closest('.chat-overlay'))return;if(e.key==='Escape'){if(state.controls){closeControls();return}if(state.overlay){closeDialog();return}}if(e.key!=='Tab')return;let container=state.controls?$('.controls-panel'):state.overlay?$('.dialog'):null;if(!container)return;let nodes=[...container.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(n=>n.getClientRects().length);if(!nodes.length)return;let first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
  window.addEventListener('hashchange',()=>{let [route,id]=parsePath();if(route!==state.route||id!==state.id){state.route=route;state.id=id;state.scenario=route==='garage'?'many':route==='login'?'phone':'normal';render();restoreContentScroll(0)}});
  const [initialRoute,initialId]=parsePath();state.route=initialRoute;state.id=initialId;state.scenario=initialRoute==='garage'?'many':initialRoute==='login'?'phone':'normal';render();
  setInterval(()=>{if(state.route==='login'&&state.loginStep==='otp'&&state.resend>0){state.resend--;let b=$('[data-action="resend"]');if(b){b.textContent=`Отправить код снова${state.resend>0?` через ${state.resend} с`:''}`;b.disabled=state.resend>0}}},1000);
})();
