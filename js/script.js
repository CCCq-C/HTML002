// 当前活动的部分索引
let currentSection = 0;
const sections = document.querySelectorAll('.section');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取导航元素
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-item a');
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    
    // 处理汉堡菜单点击
    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', () => {
            mobileMenuIcon.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }

    // 点击导航链接时关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // 关闭移动端菜单
            if (mobileMenuIcon) {
                mobileMenuIcon.classList.remove('active');
            }
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
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 处理菜单图标的显示/隐藏
        if (mobileMenuIcon) {
            if (scrollTop > lastScrollTop) {
                // 向下滚动
                mobileMenuIcon.style.opacity = '0';
            } else {
                // 向上滚动
                mobileMenuIcon.style.opacity = '1';
            }
        }
        lastScrollTop = scrollTop;
        
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // 更新导航栏激活状态
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            }
        });
    });

    // 处理移动端触摸事件
    if ('ontouchstart' in window) {
        let touchStartX = 0;
        
        navList.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        navList.addEventListener('touchmove', (e) => {
            if (navList.classList.contains('active')) {
                const touchEndX = e.touches[0].clientX;
                const diff = touchStartX - touchEndX;
                
                if (diff > 50) { // 向左滑动超过50px
                    if (mobileMenuIcon) {
                        mobileMenuIcon.classList.remove('active');
                    }
                    navList.classList.remove('active');
                }
            }
        });

        // 点击外部关闭菜单
        document.body.addEventListener('touchstart', function(e) {
            if (navList.classList.contains('active') && 
                !e.target.closest('.nav-list') && 
                !e.target.closest('.mobile-menu-icon')) {
                if (mobileMenuIcon) {
                    mobileMenuIcon.classList.remove('active');
                }
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
