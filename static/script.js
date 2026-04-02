const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const historyList = document.getElementById('history-list');
const newChatBtn = document.getElementById('new-chat-btn');
const welcomeMessage = document.getElementById('welcome-message');

let currentChatId = null;

// Adjust textarea height automatically
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    sendBtn.disabled = this.value.trim() === '';
});

messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);
newChatBtn.addEventListener('click', createNewChat);

async function loadChats() {
    try {
        const res = await fetch('/api/chats');
        const chats = await res.json();
        historyList.innerHTML = '';
        chats.forEach(chat => {
            const div = document.createElement('div');
            div.className = `history-item ${chat.id === currentChatId ? 'active' : ''}`;
            div.textContent = chat.title;
            div.onclick = () => loadChat(chat.id);
            historyList.appendChild(div);
        });
    } catch (e) {
        console.error("Failed to load chats API");
    }
}

async function createNewChat() {
    currentChatId = null;
    chatMessages.innerHTML = `
        <div class="welcome-message" id="welcome-message">
            <h1>How can I help you today?</h1>
        </div>
    `;
    updateSidebarSelection();
}

function updateSidebarSelection() {
    document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
    loadChats();
}

async function loadChat(chatId) {
    currentChatId = chatId;
    updateSidebarSelection();
    
    try {
        const res = await fetch(`/api/chats/${chatId}`);
        const messages = await res.json();
        
        chatMessages.innerHTML = '';
        if (messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="welcome-message" id="welcome-message">
                    <h1>How can I help you today?</h1>
                </div>
            `;
        } else {
            messages.forEach(m => appendMessage(m.role, m.content));
            scrollToBottom();
        }
    } catch(e) {
        console.error("Failed to load chat messages");
    }
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Disable input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    
    if (document.getElementById('welcome-message')) {
        document.getElementById('welcome-message').remove();
    }
    
    // If no chat selected, create one based on message title
    if (!currentChatId) {
        const title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
        try {
            const res = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            const data = await res.json();
            currentChatId = data.id;
            loadChats(); // refresh sidebar
        } catch(e) {
            console.error("Failed creating chat");
            return;
        }
    }
    
    // Append user message
    appendMessage('user', text);
    scrollToBottom();
    
    // Show typing indicator
    const indicatorId = 'typing-' + Date.now();
    appendTypingIndicator(indicatorId);
    scrollToBottom();
    
    // Send to API
    try {
        const res = await fetch(`/api/chats/${currentChatId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: text })
        });
        const data = await res.json();
        
        // Remove typing
        const typingEl = document.getElementById(indicatorId);
        if(typingEl) typingEl.remove();
        
        // Append bot message
        appendMessage('assistant', data.content);
        scrollToBottom();
    } catch(e) {
        const typingEl = document.getElementById(indicatorId);
        if(typingEl) typingEl.innerHTML = "Error getting response.";
    }
}

function appendMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? 'U' : 'AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content; // prevents HTML injection
    
    if (role === 'user') {
        div.appendChild(contentDiv);
        div.appendChild(avatar);
    } else {
        div.appendChild(avatar);
        div.appendChild(contentDiv);
    }
    
    chatMessages.appendChild(div);
}

function appendTypingIndicator(id) {
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.id = id;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content typing-indicator';
    contentDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    div.appendChild(avatar);
    div.appendChild(contentDiv);
    
    chatMessages.appendChild(div);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initial load
loadChats();
