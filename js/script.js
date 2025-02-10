// 当前活动的部分索引
let currentSection = 0;
const sections = document.querySelectorAll('.section');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取导航元素
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-item a');
    
    // 处理汉堡菜单点击
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navList.classList.toggle('active');
    });

    // 点击导航链接时关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // 关闭移动端菜单
            navToggle.classList.remove('active');
            navList.classList.remove('active');
            
            // 移除所有active类
            navLinks.forEach(link => link.classList.remove('active'));
            // 添加active类到当前点击的链接
            this.classList.add('active');
            
            // 平滑滚动到目标部分
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // 监听滚动事件来更新导航栏状态
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const navHeight = document.querySelector('.nav').offsetHeight;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100; // 添加一些偏移量使切换更自然
            const sectionBottom = sectionTop + section.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        // 更新导航栏激活状态
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

    // 处理移动端触摸事件
    if ('ontouchstart' in window) {
        document.body.addEventListener('touchstart', function(e) {
            if (navList.classList.contains('active') && 
                !e.target.closest('.nav-list') && 
                !e.target.closest('.nav-toggle')) {
                navToggle.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    }

    // 检查URL hash并滚动到对应部分
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
