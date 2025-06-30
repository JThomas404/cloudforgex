// Header toggle functionality
function initHeaderToggle() {
    const headerToggleBtn = document.querySelector('.header-toggle');
    const header = document.querySelector('#header');
    
    if (headerToggleBtn && header) {
        function headerToggle() {
            header.classList.toggle('header-show');
            headerToggleBtn.classList.toggle('fa-bars');
            headerToggleBtn.classList.toggle('fa-times');
        }
        headerToggleBtn.addEventListener('click', headerToggle);
        
        // Hide mobile nav on same-page/hash links
        document.querySelectorAll('#navmenu a').forEach(navmenu => {
            navmenu.addEventListener('click', () => {
                if (header.classList.contains('header-show')) {
                    headerToggle();
                }
            });
        });
    }
}

// Scroll top button
function initScrollTop() {
    let scrollTop = document.querySelector('.scroll-top');
    
    if (scrollTop) {
        function toggleScrollTop() {
            window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
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
    }
}

// Navmenu Scrollspy
function initNavmenuScrollspy() {
    let navmenulinks = document.querySelectorAll('.navmenu a');
    
    function navmenuScrollspy() {
        navmenulinks.forEach(navmenulink => {
            if (!navmenulink.hash) return;
            let section = document.querySelector(navmenulink.hash);
            if (!section) return;
            let position = window.scrollY + 200;
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
                navmenulink.classList.add('active');
            } else {
                navmenulink.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);
}

// Preloader
function initPreloader() {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove();
        });
    }
}

  const text = "From Terraform to Kubernetes — I Design, Automate, and Secure the Cloud.";
  const speed = 50;
  let index = 0;
  
  function typeWriter() {
    if (index < text.length) {
      document.getElementById("typed-text").innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, speed);
    }
  }
  
  window.onload = typeWriter;
  
  // Chatbot functionality
function initChatbot() {
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotWindow = document.getElementById("chatbot-window");
    const chatbotClose = document.getElementById("chatbot-close");
    const chatbotForm = document.getElementById("chatbot-form");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");
    
    if (chatbotToggle && chatbotWindow && chatbotClose) {
        chatbotToggle.onclick = () => chatbotWindow.classList.toggle("hidden");
        chatbotClose.onclick = () => chatbotWindow.classList.add("hidden");
        
        if (chatbotForm) {
            chatbotForm.onsubmit = function(e) {
                e.preventDefault();
                if (chatbotInput.value.trim() === '') return;
                
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'message user';
                userMsg.innerText = chatbotInput.value;
                chatbotMessages.appendChild(userMsg);
                
                // Add bot response
                const botMsg = document.createElement('div');
                botMsg.className = 'message bot';
                botMsg.innerText = '🤖 Claude integration coming soon! For now, check out the GitHub projects or contact Jarred directly.';
                chatbotMessages.appendChild(botMsg);
                
                chatbotInput.value = '';
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            };
        }
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initHeaderToggle();
    initScrollTop();
    initNavmenuScrollspy();
    initPreloader();
    initChatbot();
});


