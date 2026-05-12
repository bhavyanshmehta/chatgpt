const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const historyList = document.getElementById('history-list');
const newChatBtn = document.getElementById('new-chat-btn');
const welcomeMessage = document.getElementById('welcome-message');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

// Image upload elements
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image-btn');

let currentChatId = null;
let selectedImage = null;

// Theme Toggle Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'Dark Mode';
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        
        if (isLight) {
            localStorage.setItem('theme', 'light');
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
        } else {
            localStorage.setItem('theme', 'dark');
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
        }
    });
}

initTheme();

// Image Upload Listeners
if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            selectedImage = this.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            }
            reader.readAsDataURL(selectedImage);
            sendBtn.disabled = false;
        }
    });

    removeImageBtn.addEventListener('click', () => {
        selectedImage = null;
        fileInput.value = '';
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '';
        sendBtn.disabled = messageInput.value.trim() === '';
    });
}

// Adjust textarea height automatically
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    sendBtn.disabled = this.value.trim() === '' && !selectedImage;
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
            messages.forEach(m => {
                const imgUrl = m.image_path ? `/${m.image_path}` : null;
                appendMessage(m.role, m.content, imgUrl);
            });
            scrollToBottom();
        }
    } catch(e) {
        console.error("Failed to load chat messages");
    }
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text && !selectedImage) return;
    
    const currentText = text || "Attached Image";

    // Disable input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    imagePreviewContainer.style.display = 'none';
    
    // Store image for rendering
    const fileToSend = selectedImage;
    const localImageSrc = imagePreview.src;
    
    selectedImage = null;
    fileInput.value = '';
    imagePreview.src = '';
    
    if (document.getElementById('welcome-message')) {
        document.getElementById('welcome-message').remove();
    }
    
    // If no chat selected, create one based on message title
    if (!currentChatId) {
        const title = text ? (text.substring(0, 30) + (text.length > 30 ? '...' : '')) : 'Image Chat';
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
    appendMessage('user', currentText, fileToSend ? localImageSrc : null);
    scrollToBottom();
    
    // Show typing indicator
    const indicatorId = 'typing-' + Date.now();
    appendTypingIndicator(indicatorId);
    scrollToBottom();
    
    // Send to API via FormData
    try {
        const formData = new FormData();
        formData.append('content', currentText);
        if (fileToSend) {
            formData.append('image', fileToSend);
        }

        const res = await fetch(`/api/chats/${currentChatId}/messages`, {
            method: 'POST',
            body: formData
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

function appendMessage(role, content, imageSrc = null) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? 'U' : 'AI';
    
    const contentContainer = document.createElement('div');
    contentContainer.className = 'message-content';
    
    if (imageSrc) {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.className = 'message-image';
        contentContainer.appendChild(img);
    }
    
    const textDiv = document.createElement('div');
    textDiv.textContent = content; // prevents HTML injection
    contentContainer.appendChild(textDiv);
    
    if (role === 'user') {
        div.appendChild(contentContainer);
        div.appendChild(avatar);
    } else {
        div.appendChild(avatar);
        div.appendChild(contentContainer);
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
