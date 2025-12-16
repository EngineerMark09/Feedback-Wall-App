// ============================================
// Feedback Wall App - Main JavaScript
// ============================================

// Initialize Supabase client
let supabase;

try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error('Supabase initialization failed:', error);
}

// DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const messagesList = document.getElementById('messagesList');
const refreshBtn = document.getElementById('refreshBtn');
const totalPostsEl = document.getElementById('totalPosts');
const todayPostsEl = document.getElementById('todayPosts');

// ============================================
// Initialize App
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    setupEventListeners();
});

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Character counter
    messageInput.addEventListener('input', () => {
        charCount.textContent = messageInput.value.length;
    });

    // Form submit
    feedbackForm.addEventListener('submit', handleSubmit);

    // Refresh button
    refreshBtn.addEventListener('click', () => {
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => refreshBtn.style.transform = '', 500);
        loadMessages();
    });
}

// ============================================
// Load Messages from Supabase
// ============================================
async function loadMessages() {
    messagesList.innerHTML = '<div class="loading">Loading messages...</div>';

    try {
        // Check if Supabase is configured
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') {
            messagesList.innerHTML = `
                <div class="error-state">
                    <strong>⚠️ Setup Required</strong><br>
                    Please configure Supabase in <code>js/config.js</code>
                </div>
            `;
            return;
        }

        // Fetch messages
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        // Update stats
        updateStats(data);

        // Render messages
        if (data.length === 0) {
            messagesList.innerHTML = `
                <div class="empty-state">
                    <span>💭</span>
                    <p>No messages yet. Be the first to post!</p>
                </div>
            `;
        } else {
            messagesList.innerHTML = data.map(msg => createMessageCard(msg)).join('');
        }

    } catch (error) {
        console.error('Error loading messages:', error);
        messagesList.innerHTML = `
            <div class="error-state">
                <strong>❌ Error loading messages</strong><br>
                ${error.message}
            </div>
        `;
    }
}

// ============================================
// Create Message Card HTML
// ============================================
function createMessageCard(msg) {
    const name = escapeHtml(msg.name || 'Anonymous');
    const message = escapeHtml(msg.message);
    const time = formatTime(msg.created_at);

    return `
        <div class="message-card">
            <div class="message-header">
                <span class="message-author">${name}</span>
                <span class="message-time">${time}</span>
            </div>
            <p class="message-content">${message}</p>
        </div>
    `;
}

// ============================================
// Handle Form Submit
// ============================================
async function handleSubmit(e) {
    e.preventDefault();

    const name = nameInput.value.trim() || 'Anonymous';
    const message = messageInput.value.trim();

    if (!message) {
        showToast('Please enter a message', 'error');
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
        const { error } = await supabase
            .from('messages')
            .insert([{ name, message }]);

        if (error) throw error;

        // Success
        showToast('Message posted! 🎉', 'success');
        nameInput.value = '';
        messageInput.value = '';
        charCount.textContent = '0';
        loadMessages();

    } catch (error) {
        console.error('Error posting:', error);
        showToast('Error posting message: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

// ============================================
// Update Stats
// ============================================
function updateStats(messages) {
    totalPostsEl.textContent = messages.length;

    // Count today's posts
    const today = new Date().toDateString();
    const todayCount = messages.filter(msg => 
        new Date(msg.created_at).toDateString() === today
    ).length;
    todayPostsEl.textContent = todayCount;
}

// ============================================
// Utility Functions
// ============================================
function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) return 'Just now';
    // Less than 1 hour
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    // Less than 24 hours
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    // Less than 7 days
    if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
    // Otherwise show date
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = '') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => toast.remove(), 3000);
}
