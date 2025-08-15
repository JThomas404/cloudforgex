// EVE AI Assistant - Clean Implementation
class EVEAssistant {
    static TIMING = {
        WELCOME_DELAY: 500,
        TYPEWRITER_SPEED: 25,
        THINKING_DURATION: 800,
        QUESTION_CLICK_DELAY: 600
    };
    
    constructor() {
        this.isExpanded = true;
        this.elements = {};
        this.suggestedQuestions = [];
        this.currentThinking = null;
        this.activeTimers = new Set();
        
        window.addEventListener('beforeunload', () => this.cleanup());
        
        this.configureMarkdown();
        this.init();
    }

    configureMarkdown() {
        if (typeof marked !== 'undefined') {
            marked.setOptions({ breaks: true, gfm: true, sanitize: false });
            const renderer = new marked.Renderer();
            renderer.link = function(token) {
                const { href, title, text } = token;
                if (!href) return text;
                const isExternal = href.startsWith('http');
                const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
                const titleAttr = title ? ` title="${title}"` : '';
                return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
            };
            marked.setOptions({ renderer });
        }
    }

    async init() {
        await this.loadQuestions();
        this.cacheElements();
        this.bindEvents();
        this.setExpandedState();
        setTimeout(() => this.showWelcome(), EVEAssistant.TIMING.WELCOME_DELAY);
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('/data/suggested-questions.json');
            this.suggestedQuestions = await response.json();
        } catch (error) {
            this.suggestedQuestions = [
                "How was the chatbot built?",
                "What are Jarred's future plans and aspirations?",
                "What's Jarred's approach to problem-solving?",
                "What tools and technologies does Jarred use most?",
                "What certifications does Jarred hold?",
                "What's Jarred's most impactful project?"
            ];
        }
    }
    
    cacheElements() {
        this.elements = {
            assistant: document.getElementById('faq-assistant'),
            header: document.querySelector('.faq-header'),
            input: document.getElementById('faq-input'),
            sendBtn: document.getElementById('faq-send'),
            messagesContainer: document.getElementById('faq-messages'),
            welcomeText: document.getElementById('welcome-text')
        };
    }

    bindEvents() {
        this.elements.header?.addEventListener('click', () => this.toggleChat());
        this.elements.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.elements.sendBtn?.addEventListener('click', () => this.sendMessage());
    }

    setExpandedState() {
        this.elements.assistant?.classList.remove('collapsed');
        this.elements.assistant?.classList.add('expanded');
        this.isExpanded = true;
    }

    toggleChat() {
        if (this.isExpanded) {
            this.elements.assistant?.classList.add('collapsed');
            this.elements.assistant?.classList.remove('expanded');
            this.isExpanded = false;
        } else {
            this.setExpandedState();
        }
    }

    showWelcome() {
        const welcomeText = "Hi! I'm EVE, your AI assistant. Ask me about Jarred's work, projects, or certifications. Try @suggestedquestions for ideas.";
        if (this.elements.welcomeText) {
            this.typeText(this.elements.welcomeText, welcomeText, () => {
                this.makeClickable(this.elements.welcomeText);
            });
        }
    }

    // Professional content reveal like ChatGPT
    revealContent(element, htmlContent) {
        const sentences = htmlContent.split(/(?<=[.!?])\s+/);
        let currentIndex = 0;
        element.innerHTML = '';
        
        const timer = setInterval(() => {
            if (currentIndex < sentences.length) {
                const partialContent = sentences.slice(0, currentIndex + 1).join(' ');
                element.innerHTML = DOMPurify.sanitize(partialContent);
                currentIndex++;
                this.scrollToBottom();
            } else {
                clearInterval(timer);
                this.activeTimers.delete(timer);
            }
        }, 100);
        
        this.activeTimers.add(timer);
    }


    
    typeText(element, text, callback) {
        element.textContent = '';
        element.classList.add('typewriter-cursor');
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                this.scrollToBottom();
            } else {
                clearInterval(timer);
                this.activeTimers.delete(timer);
                element.classList.remove('typewriter-cursor');
                callback?.();
            }
        }, EVEAssistant.TIMING.TYPEWRITER_SPEED);
        
        this.activeTimers.add(timer);
    }

    // Make @suggestedquestions clickable
    makeClickable(element) {
        const html = element.innerHTML;
        const clickableHtml = html.replace(
            '@suggestedquestions',
            '<span class="suggested-questions-trigger">@suggestedquestions</span>'
        );
        element.innerHTML = clickableHtml;
        
        const trigger = element.querySelector('.suggested-questions-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                this.elements.input.value = '@suggestedquestions';
                this.sendMessage();
            });
        }
    }

    // Validate user input
    validateInput(message) {
        if (!message || message.length < 2) {
            return "Please type a proper question - at least 2 characters.";
        }
        if (message.length > 1000) {
            return "Message too long. Please keep it under 1000 characters.";
        }
        return null;
    }

    // Handle message sending
    async sendMessage() {
        if (!this.elements.input) return;
        
        const message = this.elements.input.value.trim();
        
        this.addUserMessage(message);
        this.elements.input.value = '';
        
        const validationError = this.validateInput(message);
        if (validationError) {
            this.addBotMessage(validationError, 'validation');
            return;
        }
        
        this.showThinking();
        
        try {
            const response = await this.generateResponse(message);
            this.hideThinking();
            this.addBotMessage(response.text, response.source);
        } catch (error) {
            this.hideThinking();
            this.addBotMessage("I'm having trouble right now. Please try again in a moment.", 'error');
        }
    }

    // Add user message to chat
    addUserMessage(message) {
        if (!this.elements.messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'faq-message user-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message;
        messageDiv.appendChild(contentDiv);
        
        this.elements.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // Source-based rendering - AI and knowledge content gets formatting
    addBotMessage(message, source = 'unknown') {
        if (!this.elements.messagesContainer) return;
        
        if (message === "Here are some questions you can ask me:") {
            this.addQuestionsMessage(message);
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'faq-message bot-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        messageDiv.appendChild(contentDiv);
        
        this.elements.messagesContainer.appendChild(messageDiv);
        
        // Handle different response types with enhanced formatting
        if (source === 'ai' || source === 'knowledge' || source === 'suggested') {
            // Process all content through markdown for consistent formatting
            const htmlContent = marked.parse(message);
            this.revealContent(contentDiv, htmlContent);
        } else {
            // Simple text with typing for validation/error messages
            this.typeText(contentDiv, message);
        }
        
        this.scrollToBottom();
    }

    addQuestionsMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'faq-message bot-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        messageDiv.appendChild(contentDiv);
        
        this.elements.messagesContainer.appendChild(messageDiv);
        
        this.typeText(contentDiv, message, () => {
            this.addQuestions(contentDiv);
        });
    }

    addQuestions(container) {
        const questionsDiv = document.createElement('div');
        questionsDiv.className = 'eve-questions';
        
        this.suggestedQuestions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'eve-question';
            button.textContent = question;
            button.addEventListener('click', () => this.handleQuestionClick(question));
            questionsDiv.appendChild(button);
        });
        
        container.appendChild(questionsDiv);
        this.scrollToBottom();
    }

    async handleQuestionClick(question) {
        this.addUserMessage(question);
        this.showThinking();
        
        try {
            const response = await this.generateResponse(question);
            this.hideThinking();
            this.addBotMessage(response.text, response.source);
        } catch (error) {
            console.error('Question click error:', error);
            this.hideThinking();
            this.addBotMessage("I'm having trouble right now. Please try again in a moment.", 'error');
        }
    }

    // Generate response with source tracking
    async generateResponse(question) {
        const trimmed = question.trim();
        const lower = trimmed.toLowerCase();

        if (lower.includes('@suggestedquestions')) {
            return { text: "Here are some questions you can ask me:", source: 'system' };
        }

        try {
            const response = await fetch('https://r7xn947zpk.execute-api.us-east-1.amazonaws.com/prod/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: trimmed
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { 
                text: data.response || "I'm having trouble generating a response right now.", 
                source: 'ai' 
            };

        } catch (error) {
            console.error('API Error:', error);
            return { 
                text: "I'm having trouble connecting to my AI service right now. Please try again in a moment.", 
                source: 'error' 
            };
        }
    }

    showThinking() {
        if (!this.elements.messagesContainer || this.currentThinking) return;
        
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'faq-message bot-message thinking-message';
        thinkingDiv.innerHTML = `
            <div class="message-content thinking-indicator">
                <span>EVE is thinking</span>
                <div class="thinking-dots">
                    <div class="thinking-dot"></div>
                    <div class="thinking-dot"></div>
                    <div class="thinking-dot"></div>
                </div>
            </div>
        `;
        
        this.currentThinking = thinkingDiv;
        this.elements.messagesContainer.appendChild(thinkingDiv);
        this.scrollToBottom();
    }

    hideThinking() {
        this.currentThinking?.remove();
        this.currentThinking = null;
    }

    scrollToBottom() {
        if (this.elements.messagesContainer) {
            this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        }
    }

    // Cleanup resources
    cleanup() {
        this.activeTimers.forEach(timer => clearInterval(timer));
        this.activeTimers.clear();
    }
}

// Initialise EVE assistant
document.addEventListener('DOMContentLoaded', () => {
    window.eveAssistant = new EVEAssistant();
});