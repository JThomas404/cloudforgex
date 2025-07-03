/**
 * Initialize header toggle functionality for mobile navigation
 * Handles opening/closing mobile menu and auto-close on navigation
 */
function initHeaderToggle() {
    try {
        const headerToggleBtn = document.querySelector('.header-toggle');
        const header = document.querySelector('#header');
        
        if (!headerToggleBtn || !header) {
            console.warn('Header toggle elements not found');
            return;
        }
        
        function headerToggle() {
            header.classList.toggle('header-show');
            headerToggleBtn.classList.toggle('fa-bars');
            headerToggleBtn.classList.toggle('fa-times');
        }
        
        headerToggleBtn.addEventListener('click', headerToggle);
        
        // Hide mobile nav on same-page/hash links
        const navLinks = document.querySelectorAll('#navmenu a');
        navLinks.forEach(navLink => {
            navLink.addEventListener('click', () => {
                if (header.classList.contains('header-show')) {
                    headerToggle();
                }
            });
        });
    } catch (error) {
        console.error('Error initializing header toggle:', error);
    }
}

/**
 * Initialize scroll to top button functionality
 * Shows/hides button based on scroll position and handles smooth scrolling
 */
function initScrollTop() {
    try {
        const scrollTop = document.querySelector('.scroll-top');
        
        if (!scrollTop) {
            console.warn('Scroll top button not found');
            return;
        }
        
        const SCROLL_THRESHOLD = 100;
        
        function toggleScrollTop() {
            const shouldShow = window.scrollY > SCROLL_THRESHOLD;
            scrollTop.classList.toggle('active', shouldShow);
        }
        
        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('load', toggleScrollTop);
        document.addEventListener('scroll', toggleScrollTop);
    } catch (error) {
        console.error('Error initializing scroll top:', error);
    }
}

/**
 * Initialize navigation menu scrollspy functionality
 * Highlights active navigation links based on scroll position
 */
function initNavmenuScrollspy() {
    try {
        const navmenulinks = document.querySelectorAll('.navmenu a');
        
        if (navmenulinks.length === 0) {
            console.warn('No navigation menu links found for scrollspy');
            return;
        }
        
        const SCROLL_OFFSET = 200;
        
        function navmenuScrollspy() {
            try {
                navmenulinks.forEach(navmenulink => {
                    if (!navmenulink.hash) return;
                    const section = document.querySelector(navmenulink.hash);
                    if (!section) return;
                    
                    const position = window.scrollY + SCROLL_OFFSET;
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (position >= sectionTop && position <= sectionBottom) {
                        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
                        navmenulink.classList.add('active');
                    } else {
                        navmenulink.classList.remove('active');
                    }
                });
            } catch (error) {
                console.warn('Error in scrollspy update:', error);
            }
        }
        
        window.addEventListener('load', navmenuScrollspy);
        document.addEventListener('scroll', navmenuScrollspy);
    } catch (error) {
        console.error('Error initializing navigation scrollspy:', error);
    }
}

/**
 * Initialize preloader functionality
 * Removes preloader element when page is fully loaded
 */
function initPreloader() {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove();
        });
    }
}

/**
 * Typewriter effect for hero section
 */
function initTypewriter() {
    const TYPEWRITER_CONFIG = {
        text: "From Terraform to Kubernetes — I Design, Automate, and Secure the Cloud.",
        speed: 50
    };
    
    const element = document.getElementById('typed-text');
    if (!element) return;
    
    let index = 0;
    
    function typeWriter() {
        if (index < TYPEWRITER_CONFIG.text.length) {
            element.innerHTML += TYPEWRITER_CONFIG.text.charAt(index);
            index++;
            setTimeout(typeWriter, TYPEWRITER_CONFIG.speed);
        }
    }
    
    typeWriter();
}
  


/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        initHeaderToggle();
        initScrollTop();
        initNavmenuScrollspy();
        initPreloader();
        initTypewriter();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});


