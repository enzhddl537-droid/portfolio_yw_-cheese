// 추가 01. 자세히보기 — href를 실제 주소로 바꾸면 링크로 이동합니다.
const dialog = document.querySelector('#work-dialog');
const title = document.querySelector('#work-title');
const preview = document.querySelector('#work-preview');

// 주소에 붙은 마크다운 역슬래시를 제거하고 외부 링크는 기본 이동 사용
function cleanProjectHref(link) {
    let href = (link.getAttribute('href') || '').trim();
    href = href.replace(/\\(?=[:._~/-])/g, '');
    if (href.startsWith('www.')) href = 'https://' + href;
    link.setAttribute('href', href);
    return href;
}
document.querySelectorAll('.work-link, .project-link').forEach(cleanProjectHref);

document.querySelectorAll('.work-link').forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = cleanProjectHref(link);
        const desktopImage = link.dataset.modalImage || '';
        // 외부 주소는 이미지 팝업으로 가로채지 않습니다.
        if (!desktopImage && /^https?:\/\//i.test(href)) return;
        if ((!desktopImage && href !== link.dataset.image) || event.ctrlKey || event.metaKey) return;
        event.preventDefault();
        title.textContent = link.dataset.title;
        preview.src = desktopImage || (window.matchMedia('(max-width:600px)').matches && link.dataset.mobileImage ? link.dataset.mobileImage : link.dataset.image);
        preview.alt = link.dataset.title;
        dialog.append(cheeseCursor);
        dialog.showModal();
        dialog.scrollTop = 0;
        document.body.classList.add('preview-open');
    });
});

// 추가 02. 비버모아 주소를 입력하기 전에는 페이지 이동 방지
// portfolio.html의 beaver-process / beaver-prototype href에 실제 URL을 넣으세요.
document.querySelectorAll('.project-link').forEach((link) => {
    link.addEventListener('click', (event) => {
        if (!link.getAttribute('href')) event.preventDefault();
    });
});

// 추가 03. 팝업 닫기 (ESC는 dialog 기본 동작)
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
    document.body.append(cheeseCursor);
    document.body.classList.remove('preview-open');
});
dialog.addEventListener('click', (event) => {
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});

// 추가 04. 고탑 — 클릭 시 페이지 맨 위까지 부드럽게 이동
const gotop = document.querySelector('.gotop');
gotop.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
});

// 추가 05. 반응형 버튼 — 클릭한 버튼 색 반전 (hover 효과 없음)
document.querySelectorAll('.responsive .detail-button').forEach((button) => {
    button.addEventListener('click', () => {
        if (!window.matchMedia('(max-width: 1200px)').matches) return;
        document.querySelectorAll('.responsive .detail-button.is-selected').forEach((item) => item.classList.remove('is-selected'));
        button.classList.add('is-selected');
    });
});

// 추가 06. 햄버거 메뉴 — 바깥 클릭, ESC, 섹션 선택 시 닫기
const menuToggle = document.querySelector('.menu-toggle');
const menuPanel = document.querySelector('.menu-panel');
function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    menuPanel.hidden = !open;
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
menuPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
        const originalTarget = link.getAttribute('href');
        const mobileIntro = window.matchMedia('(max-width:600px)').matches && ['#hero-responsive', '#profile-responsive'].includes(originalTarget);
        const target = document.querySelector(mobileIntro ? '.mobilhero' : originalTarget);
        if (!target) return;
        event.preventDefault();
        setMenu(false);
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        target.setAttribute('tabindex', '-1');
        target.focus({preventScroll: true});
    });
});
document.addEventListener('click', (event) => {
    if (!event.target.closest('.responsive-menu')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menuPanel.hidden) {
        setMenu(false);
        menuToggle.focus();
    }
});
window.matchMedia('(max-width: 1200px)').addEventListener('change', () => setMenu(false));


// 제공 이미지 커서: 실제 마우스 이동이 있는 경우만 적용
const cheeseCursor = document.querySelector('.cheese-cursor');
const fineCursor = window.matchMedia('(hover:hover) and (pointer:fine)');
window.addEventListener('pointermove', (event) => {
    if (!fineCursor.matches || event.pointerType !== 'mouse') return;
    cheeseCursor.style.transform = `translate3d(${event.clientX - 3}px, ${event.clientY - 4}px, 0)`;
    document.documentElement.classList.add('cheese-cursor-active');
}, {passive:true});
document.addEventListener('mouseleave', () => document.documentElement.classList.remove('cheese-cursor-active'));
window.addEventListener('blur', () => document.documentElement.classList.remove('cheese-cursor-active'));
fineCursor.addEventListener('change', () => document.documentElement.classList.remove('cheese-cursor-active'));
