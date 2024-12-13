// === Initialize Socket.IO ===
const socket = io.connect(window.location.origin);

// === Handle Socket Connection ===
socket.on('connect', () => {
    console.log('Socket.IO connected:', socket.id);

    // Join common rooms (e.g., notifications, public chats)
    socket.emit('join', { room: 'global_notifications' });
});

// === Real-Time Notifications ===
socket.on('notification', (data) => {
    displayNotification(data.message, data.type || 'info');
});

function displayNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container');
    if (notificationContainer) {
        const newNotification = document.createElement('div');
        newNotification.className = alert alert-${type};
        newNotification.textContent = message;
        notificationContainer.appendChild(newNotification);

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (newNotification.parentNode) {
                newNotification.parentNode.removeChild(newNotification);
            }
        }, 5000);
    }
}

// === Real-Time Chat ===
// Send a chat message to a specific room
function sendChatMessage(room, message) {
    if (message.trim() !== '') {
        socket.emit('chat_message', { room, message });
    }
}

// Receive chat messages
socket.on('chat_message', (data) => {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        const newMessage = document.createElement('div');
        newMessage.className = 'chat-message';
        newMessage.textContent = ${data.sender}: ${data.message};
        chatBox.appendChild(newMessage);

        // Scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

// === Group Communication ===
// Join a specific study group room
function joinStudyGroup(groupId) {
    socket.emit('join', { room: group_${groupId} });
    console.log(Joined group_${groupId});
}

// Leave a specific study group room
function leaveStudyGroup(groupId) {
    socket.emit('leave', { room: group_${groupId} });
    console.log(Left group_${groupId});
}

// Receive group messages
socket.on('group_message', (data) => {
    const groupChatBox = document.getElementById(group-chat-${data.groupId});
    if (groupChatBox) {
        const newGroupMessage = document.createElement('div');
        newGroupMessage.className = 'group-message';
        newGroupMessage.textContent = ${data.sender}: ${data.message};
        groupChatBox.appendChild(newGroupMessage);

        // Scroll to the latest message
        groupChatBox.scrollTop = groupChatBox.scrollHeight;
    }
});

// Send a group message
function sendGroupMessage(groupId, message) {
    if (message.trim() !== '') {
        socket.emit('group_message', { groupId, message });
    }
}

// === Typing Indicators ===
let typingTimeout;

function startTyping(room) {
    socket.emit('typing', { room });

    // Stop typing indicator after 3 seconds of inactivity
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        stopTyping(room);
    }, 3000);
}

function stopTyping(room) {
    socket.emit('stop_typing', { room });
}

// Display typing indicators
socket.on('typing', (data) => {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.textContent = ${data.user} is typing...;
        typingIndicator.style.display = 'block';
    }
});

socket.on('stop_typing', () => {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
});

// === Real-Time Updates ===
// Listen for updates (e.g., new study materials, changes in group members)
socket.on('update', (data) => {
    console.log('Update received:', data);

    // Example: Handle new study materials
    if (data.type === 'new_material') {
        const materialsContainer = document.getElementById('materials-container');
        if (materialsContainer) {
            const newMaterial = document.createElement('div');
            newMaterial.className = 'material-item';
            newMaterial.innerHTML = `
                <h5>${data.material.title}</h5>
                <p>${data.material.description}</p>
                <a href="${data.material.download_url}" class="btn btn-primary">Download</a>
            `;
            materialsContainer.appendChild(newMaterial);
        }
    }
});

// === User-Specific Features ===
// Notify when a user joins or leaves a room
socket.on('user_joined', (data) => {
    console.log(${data.user} joined ${data.room});
    displayNotification(${data.user} has joined the room., 'success')
});

socket.on('user_left', (data) => {
    console.log(${data.user} left ${data.room});
    displayNotification(${data.user} has left the room., 'warning');
});

// === Utility Functions ===
// Handle reconnection attempts
socket.on('disconnect', () => {
    console.warn('Socket.IO disconnected.');
    displayNotification('Disconnected from server. Attempting to reconnect...', 'danger');
});

socket.on('reconnect', (attempt) => {
    console.log('Reconnected to server after', attempt, 'attempts.');
    displayNotification('Reconnected to server!', 'success');
});

// Smooth scrolling for chat messages
function smoothScrollToBottom(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
        });
    }
}

