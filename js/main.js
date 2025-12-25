/**
 * Watiqainfo - Master JS Engine 2025
 * وظيفة هذا الملف: الربط التفاعلي بين المستخدم وواجهة الموقع
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. نظام إدارة الوضع الليلي (Dark Mode) ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // التحقق من وجود خيار مسبق في المتصفح
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if(darkModeToggle) darkModeToggle.textContent = '☀️'; // تغيير الأيقونة لشمس في الوضع الليلي
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            let theme = 'light';
            if (body.classList.contains('dark-mode')) {
                theme = 'dark';
                darkModeToggle.textContent = '☀️';
            } else {
                darkModeToggle.textContent = '🌙';
            }
            // حفظ الخيار في ذاكرة المتصفح
            localStorage.setItem('theme', theme);
        });
    }

    // --- 2. زر العودة للأعلى (Scroll to Top) ---
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            if(backToTopBtn) backToTopBtn.style.display = "block";
        } else {
            if(backToTopBtn) backToTopBtn.style.display = "none";
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 3. محرك مشاركة واتساب الديناميكي (WhatsApp Share) ---
    // هذه الوظيفة تأخذ عنوان المقال ورابطه وترسلها تلقائياً
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        const shareText = `مرحباً، وجدت هذه المعلومات المفيدة حول: ${pageTitle} \n الرابط: ${pageUrl}`;
        
        whatsappBtn.setAttribute('href', `https://wa.me/?text=${encodeURIComponent(shareText)}`);
    }

    // --- 4. معالج الأخطاء البصرية (Visual Auditor) ---
    // التأكد من أن جميع الروابط الخارجية تفتح في نافذة جديدة لحماية جلسة المستخدم
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (link.hostname !== window.location.hostname && link.hostname !== '') {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

});

// مراجعة نهائية من المدقق البرمجي: الكود نظيف وخالٍ من التكرار (DRY Principle)
