// Reveal animation for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    for (const el of reveals) {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight * 0.93) {
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
        }
    }
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Ripple effect for Jasper button
// Glow pulse effect for Jasper button
function addGlowPulse(btn) {
    btn.animate([
        { filter: 'drop-shadow(0 0 0px #E3D6FF)' },
        { filter: 'drop-shadow(0 0 24px #E3D6FF)' },
        { filter: 'drop-shadow(0 0 0px #E3D6FF)' }
    ], {
        duration: 1800,
        iterations: Infinity
    });
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.jasper-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            let ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = (e.offsetX - 24) + 'px';
            ripple.style.top = (e.offsetY - 24) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
        addGlowPulse(btn);
    });
});

// Parallax effect for hero background
window.addEventListener('mousemove', function(e) {
    const parallax = document.querySelector('.parallax-bg');
    if (!parallax) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 16;
    parallax.style.transform = `translate(${x}px, ${y}px)`;
});

// --- Jasper-style interactive navigation: show section on menu click ---

// --- Отправка формы CTA через mailto ---
document.addEventListener('DOMContentLoaded', function () {
    const ctaForm = document.getElementById('cta-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(ctaForm);
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const company = formData.get('company') || '';
            const role = formData.get('role') || '';
            const topic = formData.get('topic') || '';
            const subject = encodeURIComponent('Заявка на демо с сайта АгентИИ.рф');
            const body = encodeURIComponent(
                `Имя: ${name}\nEmail: ${email}\nКомпания: ${company}\nРоль: ${role}\nТема: ${topic}`
            );
            // Создаем временную ссылку для mailto и вызываем click
const mailtoLink = document.createElement('a');
mailtoLink.href = `mailto:agentai@internet.ru?subject=${subject}&body=${body}`;
mailtoLink.style.display = 'none';
document.body.appendChild(mailtoLink);
mailtoLink.click();
document.body.removeChild(mailtoLink);
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.jasper-nav-link');
    const sections = ['benefits', 'how', 'solutions', 'compliance', 'faq', 'pilot', 'team', 'security', 'cta'];
    const sectionEls = sections.map(id => document.getElementById(id));
    const hero = document.getElementById('hero');
    const logoLink = document.querySelector('.jasper-logo');
    logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Скрыть все секции кроме hero
    function hideAllSections() {
        sectionEls.forEach(el => { if (el) el.style.display = 'none'; });
        hero.style.display = '';
    }
    // Показать нужную секцию
    function showSection(id) {
        sectionEls.forEach(el => { if (el) el.style.display = 'none'; });
        hero.style.display = 'none';
        const target = document.getElementById(id);
        if (target) {
            target.style.display = '';
            window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
        }
    }
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href').replace('#', '');
            if (sections.includes(href)) {
                showSection(href);
            } else {
                hideAllSections();
            }
        });
    });
    // Открытие формы CTA по кнопке в hero
    const openCtaBtn = document.getElementById('open-cta');
    if (openCtaBtn) {
        openCtaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sectionEls.forEach(el => { if (el) el.style.display = 'none'; });
            hero.style.display = 'none';
            const ctaSection = document.getElementById('cta');
            if (ctaSection) {
                ctaSection.style.display = '';
                window.scrollTo({ top: ctaSection.offsetTop - 60, behavior: 'smooth' });
            }
        });
    }
    // По умолчанию показываем только hero
    hideAllSections();
});
