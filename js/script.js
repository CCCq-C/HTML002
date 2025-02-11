// 当前活动的部分索引
let currentSection = 0;
const sections = document.querySelectorAll('.section');

// 导航菜单交互
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navItems = document.querySelectorAll('.nav-item');
    let isMenuOpen = false;

    // 点击菜单按钮
    navToggle.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        this.classList.toggle('active');
        navList.classList.toggle('active');
        
        // 动画延迟
        navItems.forEach((item, index) => {
            if (isMenuOpen) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100 + index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
            }
        });
    });

    // 点击导航项关闭菜单
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navToggle.classList.remove('active');
                navList.classList.remove('active');
                isMenuOpen = false;
                navItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(20px)';
                });
            }
        });
    });

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            navToggle.classList.remove('active');
            navList.classList.remove('active');
            isMenuOpen = false;
            navItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            });
        }
    });

    // 获取导航元素
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

    // 创建霓虹光标
    const neonCursor = document.createElement('div');
    neonCursor.className = 'neon-cursor';
    document.body.appendChild(neonCursor);

    // 获取图片容器
    const imageContainer = document.querySelector('.neon-image-container');
    const growthImage = document.querySelector('.growth-image');
    let isOverImage = false;
    let currentHue = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let frameId = null;

    // 颜色变化函数
    function updateColor(x, y) {
        const containerRect = imageContainer.getBoundingClientRect();
        const relativeX = (x - containerRect.left) / containerRect.width;
        const relativeY = (y - containerRect.top) / containerRect.height;
        
        // 使用相对位置计算色相值（0-360）
        const hue = (relativeX * 180 + relativeY * 180) % 360;
        
        // 平滑过渡到新的颜色
        const targetHue = hue;
        const diff = targetHue - currentHue;
        
        // 确保色相值变化采用最短路径
        if (Math.abs(diff) > 180) {
            currentHue += diff > 0 ? -360 : 360;
        }
        
        // 非常缓慢的颜色变化
        currentHue += (targetHue - currentHue) * 0.05;
        currentHue = ((currentHue % 360) + 360) % 360;
        
        return currentHue;
    }

    // 更新光标位置和效果
    function updateCursor(e) {
        if (!isOverImage) return;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // 检查鼠标是否在容器内
        const containerRect = imageContainer.getBoundingClientRect();
        if (mouseX < containerRect.left || 
            mouseX > containerRect.right || 
            mouseY < containerRect.top || 
            mouseY > containerRect.bottom) {
            isOverImage = false;
            neonCursor.classList.remove('active');
            cancelAnimationFrame(frameId);
            frameId = null;
            growthImage.style.filter = 'contrast(1.2) brightness(1.1)';
            return;
        }
        
        // 更平滑的跟随效果
        lastMouseX += (mouseX - lastMouseX) * 0.15;
        lastMouseY += (mouseY - lastMouseY) * 0.15;
        
        const hue = updateColor(mouseX, mouseY);
        const relativeX = (mouseX - containerRect.left) / containerRect.width;
        const relativeY = (mouseY - containerRect.top) / containerRect.height;
        
        // 根据鼠标位置调整光晕大小和强度
        const distance = Math.sqrt(
            Math.pow((relativeX - 0.5) * 2, 2) + 
            Math.pow((relativeY - 0.5) * 2, 2)
        );
        
        const scale = Math.max(0.7, 1 - distance * 0.3);
        const opacity = Math.max(0.4, 1 - distance * 0.5);
        
        // 更新光标样式
        neonCursor.style.transform = `translate3d(${lastMouseX - 75}px, ${lastMouseY - 75}px, 0) scale(${scale})`;
        neonCursor.style.background = `
            radial-gradient(circle, 
                hsla(${hue}, 100%, 70%, ${opacity * 0.8}) 0%,
                hsla(${hue}, 100%, 60%, ${opacity * 0.4}) 20%,
                hsla(${hue}, 100%, 50%, ${opacity * 0.2}) 40%,
                transparent 70%
            )
        `;
        
        // 应用图片效果
        growthImage.style.filter = `contrast(1.2) brightness(1.1) hue-rotate(${hue}deg)`;
        
        frameId = requestAnimationFrame(() => updateCursor(e));
    }

    // 监听鼠标移动
    document.addEventListener('mousemove', (e) => {
        if (!frameId) {
            updateCursor(e);
        }
    });

    // 监听图片容器的鼠标事件
    imageContainer.addEventListener('mouseenter', (e) => {
        isOverImage = true;
        neonCursor.classList.add('active');
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        updateCursor(e);
    });

    imageContainer.addEventListener('mouseleave', () => {
        isOverImage = false;
        neonCursor.classList.remove('active');
        cancelAnimationFrame(frameId);
        frameId = null;
        growthImage.style.filter = 'contrast(1.2) brightness(1.1)';
    });

    // 移动端优化
    if ('ontouchstart' in window) {
        imageContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            updateCursor({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        });
        
        imageContainer.addEventListener('touchstart', (e) => {
            isOverImage = true;
            neonCursor.classList.add('active');
            const touch = e.touches[0];
            lastMouseX = touch.clientX;
            lastMouseY = touch.clientY;
        });
        
        imageContainer.addEventListener('touchend', () => {
            isOverImage = false;
            neonCursor.classList.remove('active');
            cancelAnimationFrame(frameId);
            frameId = null;
            growthImage.style.filter = 'contrast(1.2) brightness(1.1)';
        });
    }
});
