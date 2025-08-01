// EVE AI Assistant - Complete Implementation
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
        
        // Cleanup timers on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        this.questionMapping = {
            "How was the chatbot built?": "chatbot_built",
            "What are Jarred's future plans and aspirations?": "future_plans",
            "What's Jarred's approach to problem-solving?": "problem_solving",
            "What tools and technologies does Jarred use most?": "tools_technologies",
            "What certifications does Jarred hold?": "certifications",
            "What's Jarred's most impactful project?": "most_impactful"
        };
        this.knowledgeBase = {
            "chatbot_built": `You're actually speaking to me through a fully <a href="https://aws.amazon.com/serverless/" target="_blank">serverless architecture</a> built on AWS — and I think it's pretty elegant.<br><br>Here's how it works behind the scenes:<br><br>• When you send a message, it's routed through <a href="https://docs.aws.amazon.com/apigateway/" target="_blank">API Gateway</a><br>• That request triggers an <a href="https://docs.aws.amazon.com/lambda/" target="_blank">AWS Lambda</a> function, written in <a href="https://www.python.org/" target="_blank">Python</a><br>• I generate a response using <a href="https://www.anthropic.com/news/introducing-claude" target="_blank">Claude Instant</a> via <a href="https://aws.amazon.com/bedrock/" target="_blank">Amazon Bedrock</a><br>• The reply is returned and stored in <a href="https://docs.aws.amazon.com/dynamodb/" target="_blank">Amazon DynamoDB</a> to track context<br><br>Jarred also uses <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" target="_blank">SSM Parameter Store</a> for secret management and strict <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank">CORS policies</a> to secure communication.<br><br><blockquote>This setup is cloud-native, efficient, and ready to scale.</blockquote>`,
            "future_plans": `I love this question... Jarred's vision is one of continuous evolution.<br><br> He's focused on staying ahead in both <a href="https://aws.amazon.com/what-is-cloud-computing/" target="_blank">cloud computing</a> and artificial intelligence, where <a href="https://en.wikipedia.org/wiki/Automation" target="_blank">automation</a>, scalability, and smart design converge. One area he's especially excited about is the <em><a href="https://aws.amazon.com/blogs/machine-learning/unlocking-the-power-of-model-context-protocol-mcp-on-aws/" target="_blank">Model Context Protocol (MCP)</a></em> — a framework that brings AI agents into cloud environments to make decisions more intelligently, efficiently, and securely.<br><br>Behind the scenes, Jarred is sharpening his skills in <a href="https://www.python.org/" target="_blank">Python</a> and <a href="https://www.json.org/" target="_blank">JSON</a> — the core languages that power cloud automation and AI integration. These tools help him build systems that aren't just functional… they're adaptive, resilient, and ready for what's next.<br><br><blockquote>In short: Jarred's goal is to architect platforms that are not only scalable and secure — but intelligent, self-evolving, and built for the future.</blockquote>`,
            "problem_solving": `Jarred approaches every problem like a system designer — grounded in fundamentals and focused on long-term clarity, not just quick fixes.<br><br> He believes that the key to effective problem-solving lies in asking the <em>right questions</em>, not jumping straight to implementation. His method balances strategic thinking with hands-on technical depth.<br><br>Here's how he works:<br><br>• <strong>Clarifies the fundamentals</strong> — before touching any tools, he ensures he understands <em>why</em> the problem exists and what the <em>ideal outcome</em> looks like<br>• <strong>Breaks the problem into layers</strong> — infrastructure, logic, automation, and user outcomes are treated as distinct components that must align<br>• <strong>Avoids over-engineering</strong> — he keeps solutions lean, elegant, and easy to maintain, choosing simplicity over complexity<br>• <strong>Validates through iteration</strong> — rather than assuming, he tests early and often, adapting based on real-world feedback<br>• <strong>Builds for maintainability</strong> — every solution is designed with the next engineer in mind: clear structure, smart defaults, and minimal surprises<br><br><blockquote>Jarred doesn't just fix things — he <em>understands</em>, <em>simplifies</em>, and <em>builds to last</em>. That's what sets his approach apart.</blockquote>`,
            "tools_technologies": `Jarred works with a toolset designed for <strong>automation</strong>, <strong>security</strong>, and <strong>cloud scalability</strong>. His strength lies in how he connects and automates across platforms.<br><br>• <strong>Cloud & Infrastructure:</strong> AWS, Azure, Terraform, Docker, GitHub Actions, CI/CD<br>• <strong>Scripting & Automation:</strong> Python, Boto3, Bash, PowerShell, JSON, YAML<br>• <strong>Key AWS Services:</strong> Lambda, API Gateway, DynamoDB, Bedrock, S3, Route 53, CloudFront, IAM, SSM, CloudWatch<br>• <strong>Developer Tools:</strong> VS Code, Git, Postman, Notion, Nginx<br><br><blockquote>He doesn't just use tools — he <em>orchestrates</em> them to build resilient, modular, and intelligent cloud-native systems.</blockquote>`,
            "certifications": `Jarred's certifications reflect his commitment to real-world expertise and platform fluency:<br><br><div class="cert-list">• <strong>AWS Certified Solutions Architect – Associate (SAA-C03)</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/AWS%20Certified%20Solutions%20Architect%20-%20Associate%20certificate.pdf">View Certificate</button><br><br>• <strong>AWS Certified Cloud Practitioner (CLF-C02)</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/AWS%20Certified%20Cloud%20Practitioner%20certificate.pdf">View Certificate</button><br><br>• <strong>Cisco Certified Network Associate (CCNA)</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/CCNA%20Cisco%20Certified%20Network%20Associate%20certificate.pdf">View Certificate</button><br><br>• <strong>Microsoft Certified: Azure Fundamentals (AZ-900)</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/Microsoft%20Certified-%20Azure%20Fundamentals%20(AZ-900).pdf">View Certificate</button><br><br>• <strong>Power Platform Fundamentals (PL-900)</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/Power%20Platform%20Fundamentals%20(PL-900).pdf">View Certificate</button><br><br>• <strong>Mimecast Cloud Gateway Fundamentals</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/Mimecast%20Email%20Security%20Cloud%20Gateway%20Fundamentals%20Certification.pdf">View Certificate</button><br><br>• <strong>Python Programming for AWS (Boto3)</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/Python%20Programming%20for%20AWS%20(Boto3).pdf">View Certificate</button><br><br>• <strong>Docker Mastery</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/Docker%20Mastery.pdf">View Certificate</button><br><br>• <strong>Terraform Associate Hands-On Labs</strong><br><button class="cert-btn" data-cert="https://d1hcjp46h1clr8.cloudfront.net/assets/documents/Terraform%20Associate%20Hands-On%20Labs.pdf">View Certificate</button><br><br>• <strong>Linux Foundation Certified Systems Administrator</strong> <em>(in progress)</em></div><br><br>These show not just study — but <em>depth, breadth, and applied competence</em>.`,
            "most_impactful": `Jarred's most defining project is his <strong>Serverless Web Application Project</strong> — but what made it truly impactful wasn't just what he built, but how he rebuilt it.<br><br>The first two launches failed — not because the system didn't work, but because Jarred was focused on what worked... not on what worked best. That setback forced him to think like a real cloud engineer to build not just functional architecture, but resilient, scalable, and maintainable systems that would stand up in production environments.<br><br>He took on multiple roles:<br><br>• <strong>DevOps Engineer</strong> – wrote the backend and deployed the frontend<br>• <strong>Solutions Architect</strong> – designed the infrastructure using <a href="https://www.terraform.io/" target="_blank">Terraform</a> and <a href="https://docs.github.com/en/actions" target="_blank">GitHub Actions</a><br>• <strong>Cloud Engineer</strong> – automated and secured the full deployment in AWS<br><br>That failure taught Jarred how to rebuild with clarity, humility, and discipline — and it became the project that shaped his mindset more than any certification ever could.<br><br><a href="https://github.com/JThomas404/AWS-Automation-with-Python-Boto3-and-Lambda-Projects" target="_blank">Serverless Web Application Project Repo</a>`
        };
        
        // Configure marked.js
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                sanitize: false
            });
        }

        this.init();
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
        if (this.elements.header) {
            this.elements.header.addEventListener('click', () => this.toggleChat());
        }
        
        if (this.elements.input) {
            this.elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        if (this.elements.sendBtn) {
            this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        }
    }

    setExpandedState() {
        if (this.elements.assistant) {
            this.elements.assistant.classList.remove('collapsed');
            this.elements.assistant.classList.add('expanded');
            this.isExpanded = true;
        }
    }

    toggleChat() {
        if (this.isExpanded) {
            this.elements.assistant.classList.add('collapsed');
            this.elements.assistant.classList.remove('expanded');
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

    // Character-by-character typing
    typeText(element, text, callback) {
        element.innerHTML = '';
        element.classList.add('typewriter-cursor');
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                this.activeTimers.delete(timer);
                element.classList.remove('typewriter-cursor');
                if (callback) callback();
            }
        }, EVEAssistant.TIMING.TYPEWRITER_SPEED);
        
        this.activeTimers.add(timer);
    }

    // Enhanced line-by-line with professional formatting
    typeLineByLine(element, message, callback) {
        // Pre-process message for better formatting
        const processedMessage = message
            .replace(/^- /gm, '• ')  // Convert dashes to bullets
            .replace(/\n\n/g, '\n \n')  // Add spacing for empty lines
            .split('\n');
        
        let lineIndex = 0;
        
        const typeNextLine = () => {
            if (lineIndex < processedMessage.length) {
                const line = processedMessage[lineIndex].trim();
                
                if (line) {
                    const lineDiv = document.createElement('div');
                    lineDiv.style.marginBottom = line.startsWith('•') ? '8px' : '4px';
                    element.appendChild(lineDiv);
                    
                    // Type plain text first, then apply formatting
                    this.typeText(lineDiv, line, () => {
                        try {
                            const formattedLine = marked.parseInline(line);
                            lineDiv.innerHTML = formattedLine;
                        } catch (error) {
                            // Keep plain text if formatting fails
                        }
                        lineIndex++;
                        setTimeout(typeNextLine, 100);
                    });
                } else {
                    // Empty line for spacing
                    const spaceDiv = document.createElement('div');
                    spaceDiv.innerHTML = '&nbsp;';
                    element.appendChild(spaceDiv);
                    lineIndex++;
                    setTimeout(typeNextLine, 50);
                }
            } else {
                if (callback) callback();
            }
        };
        
        typeNextLine();
    }

    // Extract text nodes from HTML element
    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        return textNodes;
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
            this.addBotMessage("Please type a proper question - at least 2 characters.", 'validation');
            return false;
        }
        if (message.length > 1000) {
            this.addBotMessage("Message too long. Please keep it under 1000 characters.", 'validation');
            return false;
        }
        return true;
    }

    // Handle message sending
    async sendMessage() {
        if (!this.elements.input) return;
        
        const message = this.elements.input.value.trim();
        if (!this.validateInput(message)) return;
        
        this.addUserMessage(message);
        this.elements.input.value = '';
        
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
        
        // Source-based detection (reliable)
        const shouldFormat = source === 'ai' || source === 'knowledge' || message.includes('<');
        
        if (shouldFormat) {
            // Progressive line-by-line typing
            this.typeLineByLine(contentDiv, message, () => {
                this.addCertificateHandlers(contentDiv);
            });
        } else {
            // Simple typing for errors and validation
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
            
            if (this.questionMapping[trimmed]) {
                const key = this.questionMapping[trimmed];
                return { text: this.knowledgeBase[key], source: 'knowledge' };
            }
            return { 
                text: "I'm having trouble connecting to my AI service right now. Please try again in a moment.", 
                source: 'error' 
            };
        }
    }

    // Display thinking animation
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

    // Remove thinking animation
    hideThinking() {
        if (this.currentThinking) {
            this.currentThinking.remove();
            this.currentThinking = null;
        }
    }

    // Scroll chat to bottom
    scrollToBottom() {
        if (this.elements.messagesContainer) {
            this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        }
    }

    // Make certificate buttons clickable
    addCertificateHandlers(element) {
        const certButtons = element.querySelectorAll('.cert-btn');
        
        certButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const certUrl = button.getAttribute('data-cert');
                if (certUrl) {
                    window.open(certUrl, '_blank', 'noopener,noreferrer');
                }
            });
        });
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