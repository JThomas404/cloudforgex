// EVE AI Assistant
class EVEAssistant {
    constructor() {
        this.isExpanded = true; // Start expanded
        this.suggestedQuestionsShown = false; // Track if suggested questions were shown
        this.suggestedQuestions = [
            "How was the chatbot built?",
            "What are Jarred's future plans and aspirations?",
            "What's Jarred's approach to problem-solving?",
            "What tools and technologies does Jarred use most?",
            "What certifications does Jarred hold?",
            "What's Jarred's most impactful project?"
        ];
        this.knowledgeBase = {
            "services": "Jarred offers cloud engineering services including AWS architecture, Terraform infrastructure as code, Kubernetes orchestration, DevOps automation, and cloud security consulting.",
            "experience": "Jarred is an AWS Certified Solutions Architect with CCNA certification, specializing in cloud infrastructure, automation, and security. He has successfully completed projects including SQL Server migrations and cloud architecture implementations.",
            "skills": "Jarred's technical skills include AWS, Azure, Terraform, Docker, Kubernetes, Python, Bash, PowerShell, GitHub Actions, and cloud security practices.",
            "contact": "You can contact Jarred via email at jarredthomas101@gmail.com, connect on LinkedIn, or view his work on GitHub at JThomas404.",
            "projects": "Jarred's notable projects include CloudForgeX (a complete AWS infrastructure portfolio) and SQL Server Migration with enhanced disaster recovery. All projects showcase real-world cloud engineering implementations.",
            "certifications": "Jarred holds AWS Certified Solutions Architect - Associate (2024) and CCNA Cisco Certified Network Associate (2023) certifications, with Linux Foundation LFCS in progress.",
            "chatbot_built": "You're actually speaking to me through a serverless architecture built on AWS! I'm powered by Claude Instant via Amazon Bedrock, with a modern JavaScript frontend using ES6 classes. The entire system runs on AWS infrastructure with Terraform IaC, featuring real-time message handling, typewriter animations, and responsive design. It's a perfect example of Jarred's cloud engineering expertise in action.",
            "future_plans": "Jarred's vision is one of continuous evolution in cloud engineering. He's focused on mastering advanced AWS services, expanding into multi-cloud architectures, and developing expertise in AI/ML integration with cloud infrastructure. His goal is to become a recognized thought leader in cloud automation and help organizations transform their infrastructure for the modern digital landscape.",
            "problem_solving": "Jarred approaches every problem with a mindset rooted in clarity, systematic analysis, and scalable solutions. He starts by understanding the root cause, evaluates multiple approaches, and implements solutions that not only fix immediate issues but prevent future problems. His methodology combines technical expertise with strategic thinking to deliver robust, maintainable infrastructure.",
            "tools_technologies": "Jarred works with a modern, cloud-native toolset including AWS (his primary cloud platform), Terraform for Infrastructure as Code, Docker and Kubernetes for containerization, Python and Bash for automation, GitHub Actions for CI/CD, and PowerShell for Windows environments. He's constantly expanding his toolkit to stay current with emerging technologies.",
            "most_impactful": "That would be Jarred's SQL Server Migration and Modernization project at SEIDOR Networks for Butternut Box. He prevented a critical system failure by leading a comprehensive root cause investigation, then architected and executed a strategic migration that included high availability setup, disaster recovery implementation, and modernized maintenance procedures. This project showcased his ability to work under pressure while delivering enterprise-grade solutions."
        };
        this.init();
    }

    init() {
        this.bindEvents();
        // Start in expanded state
        this.setExpandedState();
        // Show EVE's welcome message immediately
        setTimeout(() => {
            this.typeEVEWelcomeMessage();
        }, 500);
    }

    bindEvents() {
        const header = document.querySelector('.faq-header');
        const input = document.getElementById('faq-input');
        const sendBtn = document.getElementById('faq-send');

        header.addEventListener('click', (e) => {
            // Check if clicked on mobile close area (right side of header on mobile)
            if (window.innerWidth <= 768) {
                const rect = header.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX > rect.width - 100) {
                    this.setCollapsedState();
                    return;
                }
            }
            this.toggleChat();
        });
        
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
    }

    toggleChat() {
        if (this.isExpanded) {
            this.setCollapsedState();
        } else {
            this.setExpandedState();
        }
    }

    typeEVEWelcomeMessage() {
        const welcomeText = "Hi! I'm EVE, an AI chatbot powered by Claude Instant via Amazon Bedrock. Ask me anything about Jarred's work, projects, or certifications. Not sure what to ask? Try the @suggestedquestions below";
        const element = document.getElementById('welcome-text');
        if (element) {
            this.typeWriterWithClickable(element, welcomeText, 50);
        }
    }

    typeWriter(element, text, speed = 50, callback = null) {
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
                    if (callback) callback();
                }, 500);
            }
        }, speed);
    }

    typeWriterWithClickable(element, text, speed = 50) {
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
                    // Make @suggestedquestions clickable
                    this.makeClickableSuggestedQuestions(element);
                }, 500);
            }
        }, speed);
    }



    makeClickableSuggestedQuestions(element) {
        const html = element.innerHTML;
        const clickableHtml = html.replace(
            '@suggestedquestions',
            '<span class="suggested-questions-trigger">@suggestedquestions</span>'
        );
        element.innerHTML = clickableHtml;
        
        // Add click event
        const trigger = element.querySelector('.suggested-questions-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                this.triggerSuggestedQuestions();
            });
        }
    }

    triggerSuggestedQuestions() {
        const input = document.getElementById('faq-input');
        if (input) {
            input.value = '@suggestedquestions';
            input.focus();
            // Auto-send the message
            setTimeout(() => {
                this.sendMessage();
            }, 100);
        }
    }

    sendMessage() {
        const input = document.getElementById('faq-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show thinking indicator
        this.showThinkingIndicator();
        
        setTimeout(() => {
            this.hideThinkingIndicator();
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 800);
    }

    addMessage(message, type) {
        const messagesContainer = document.getElementById('faq-messages');
        if (!messagesContainer || !message) return;
        
        try {
            const messageDiv = document.createElement('div');
            messageDiv.className = `faq-message ${type}-message`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = message; // Secure text rendering
            messageDiv.appendChild(contentDiv);
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.warn('Error adding message:', error);
        }
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('faq-messages');
        if (!messagesContainer || !message) return;
        
        try {
            // Check if this is a suggested questions response
            if (message === "Here are some questions you can ask me:") {
                this.addBotMessageWithQuestions(message);
                return;
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'faq-message bot-message';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            messageDiv.appendChild(contentDiv);
            
            messagesContainer.appendChild(messageDiv);
            
            this.typeWriter(contentDiv, message, 50);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.warn('Error adding bot message:', error);
        }
    }

    generateResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Handle suggested questions trigger (only show once)
        if (lowerQuestion.includes('@suggestedquestions')) {
            if (this.suggestedQuestionsShown) {
                return "I've already shown you the suggested questions above. Feel free to click on any of them or ask me something else!";
            }
            this.suggestedQuestionsShown = true;
            return this.createSuggestedQuestionsResponse();
        }
        
        // Enhanced keyword matching for all knowledge base entries
        for (const [key, value] of Object.entries(this.knowledgeBase)) {
            if (lowerQuestion.includes(key) || 
                (key === 'services' && (lowerQuestion.includes('what') || lowerQuestion.includes('do'))) ||
                (key === 'contact' && lowerQuestion.includes('contact')) ||
                (key === 'skills' && (lowerQuestion.includes('skill') || lowerQuestion.includes('technology'))) ||
                (key === 'experience' && lowerQuestion.includes('experience')) ||
                (key === 'projects' && lowerQuestion.includes('project')) ||
                (key === 'certifications' && (lowerQuestion.includes('cert') || lowerQuestion.includes('qualification'))) ||
                (key === 'chatbot_built' && (lowerQuestion.includes('chatbot') || lowerQuestion.includes('built'))) ||
                (key === 'future_plans' && (lowerQuestion.includes('future') || lowerQuestion.includes('plans') || lowerQuestion.includes('aspirations'))) ||
                (key === 'problem_solving' && (lowerQuestion.includes('problem') || lowerQuestion.includes('approach'))) ||
                (key === 'tools_technologies' && (lowerQuestion.includes('tools') || lowerQuestion.includes('technologies') || lowerQuestion.includes('use most'))) ||
                (key === 'most_impactful' && (lowerQuestion.includes('impactful') || lowerQuestion.includes('most important')))) {
                return value;
            }
        }
        
        return "I'd be happy to help! You can ask me about Jarred's services, skills, experience, projects, certifications, or how to contact him. What would you like to know?";
    }

    createSuggestedQuestionsResponse() {
        return "Here are some questions you can ask me:";
    }

    createSuggestedQuestionsHTML() {
        let html = "<ul class='suggested-questions-list'>";
        
        this.suggestedQuestions.forEach(question => {
            html += `<li class='suggested-question-item' data-question='${question}'>${question}</li>`;
        });
        
        html += "</ul>";
        return html;
    }

    addBotMessageWithQuestions(message) {
        const messagesContainer = document.getElementById('faq-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'faq-message bot-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        messageDiv.appendChild(contentDiv);
        
        messagesContainer.appendChild(messageDiv);
        
        // Type the intro text first
        this.typeWriter(contentDiv, message, 50, () => {
            // After typing completes, append the HTML list
            const questionsHTML = this.createSuggestedQuestionsHTML();
            contentDiv.innerHTML += questionsHTML;
            
            // Add click handlers to the questions
            this.addSuggestedQuestionsClickHandlers(contentDiv);
            
            // Scroll after content is fully rendered
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    }

    addSuggestedQuestionsClickHandlers(container) {
        if (!container) return;
        
        try {
            const questionItems = container.querySelectorAll('.suggested-question-item');
            questionItems.forEach(item => {
                item.addEventListener('click', () => {
                    const question = item.getAttribute('data-question');
                    if (question) {
                        this.handleSuggestedQuestionClick(question);
                    }
                });
            });
        } catch (error) {
            console.warn('Error adding suggested questions click handlers:', error);
        }
    }

    handleSuggestedQuestionClick(question) {
        // Add user message
        this.addMessage(question, 'user');
        
        // Show thinking indicator
        this.showThinkingIndicator();
        
        // Generate and add bot response
        setTimeout(() => {
            this.hideThinkingIndicator();
            const response = this.generateResponse(question);
            this.addBotMessage(response);
        }, 600);
    }

    showThinkingIndicator() {
        const messagesContainer = document.getElementById('faq-messages');
        if (!messagesContainer) return;
        
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
        
        messagesContainer.appendChild(thinkingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideThinkingIndicator() {
        const thinkingMessage = document.querySelector('.thinking-message');
        if (thinkingMessage) {
            thinkingMessage.remove();
        }
    }
}

// Initialize EVE Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EVEAssistant();
});