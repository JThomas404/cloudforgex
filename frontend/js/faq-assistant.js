// Smart FAQ Assistant - Minimalistic
class SmartFAQAssistant {
    constructor() {
        this.isExpanded = false;
        this.knowledgeBase = {
            "services": "Jarred offers cloud engineering services including AWS architecture, Terraform infrastructure as code, Kubernetes orchestration, DevOps automation, and cloud security consulting.",
            "experience": "Jarred is an AWS Certified Solutions Architect with CCNA certification, specializing in cloud infrastructure, automation, and security. He has successfully completed projects including SQL Server migrations and cloud architecture implementations.",
            "skills": "Jarred's technical skills include AWS, Azure, Terraform, Docker, Kubernetes, Python, Bash, PowerShell, GitHub Actions, and cloud security practices.",
            "contact": "You can contact Jarred via email at jarredthomas101@gmail.com, connect on LinkedIn, or view his work on GitHub at JThomas404.",
            "projects": "Jarred's notable projects include CloudForgeX (a complete AWS infrastructure portfolio) and SQL Server Migration with enhanced disaster recovery. All projects showcase real-world cloud engineering implementations.",
            "certifications": "Jarred holds AWS Certified Solutions Architect - Associate (2024) and CCNA Cisco Certified Network Associate (2023) certifications, with Linux Foundation LFCS in progress."
        };
        this.init();
    }

    init() {
        this.bindEvents();
        // Start in collapsed state
        this.setCollapsedState();
    }

    bindEvents() {
        const header = document.querySelector('.faq-header');
        const input = document.getElementById('faq-input');
        const sendBtn = document.getElementById('faq-send');

        header.addEventListener('click', () => this.toggleChat());
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
    }

    setCollapsedState() {
        const assistant = document.getElementById('faq-assistant');
        assistant.classList.add('collapsed');
        assistant.classList.remove('expanded');
        this.isExpanded = false;
    }

    setExpandedState() {
        const assistant = document.getElementById('faq-assistant');
        assistant.classList.remove('collapsed');
        assistant.classList.add('expanded');
        this.isExpanded = true;
        
        // Type welcome message when first expanded
        if (!this.hasWelcomed) {
            setTimeout(() => {
                this.typeWelcomeMessage();
                this.hasWelcomed = true;
            }, 300);
        }
    }

    toggleChat() {
        if (this.isExpanded) {
            this.setCollapsedState();
        } else {
            this.setExpandedState();
        }
    }

    typeWelcomeMessage() {
        const welcomeText = "Hi! I'm your Smart FAQ Assistant. Ask me anything about Jarred's work, skills, or services!";
        const element = document.getElementById('welcome-text');
        if (element) {
            this.typeWriter(element, welcomeText, 50);
        }
    }

    typeWriter(element, text, speed = 50) {
        element.innerHTML = '';
        element.classList.add('typewriter-cursor');
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                setTimeout(() => {
                    element.classList.remove('typewriter-cursor');
                }, 500);
            }
        }, speed);
    }

    sendMessage() {
        const input = document.getElementById('faq-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 500);
    }

    addMessage(message, type) {
        const messagesContainer = document.getElementById('faq-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `faq-message ${type}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${message}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('faq-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'faq-message bot-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        messageDiv.appendChild(contentDiv);
        
        messagesContainer.appendChild(messageDiv);
        
        this.typeWriter(contentDiv, message, 50);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Simple keyword matching
        for (const [key, value] of Object.entries(this.knowledgeBase)) {
            if (lowerQuestion.includes(key) || 
                (key === 'services' && (lowerQuestion.includes('what') || lowerQuestion.includes('do'))) ||
                (key === 'contact' && lowerQuestion.includes('contact')) ||
                (key === 'skills' && (lowerQuestion.includes('skill') || lowerQuestion.includes('technology'))) ||
                (key === 'experience' && lowerQuestion.includes('experience')) ||
                (key === 'projects' && lowerQuestion.includes('project')) ||
                (key === 'certifications' && (lowerQuestion.includes('cert') || lowerQuestion.includes('qualification')))) {
                return value;
            }
        }
        
        return "I'd be happy to help! You can ask me about Jarred's services, skills, experience, projects, certifications, or how to contact him. What would you like to know?";
    }
}

// Initialize the FAQ Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartFAQAssistant();
});