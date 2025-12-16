"use strict";

// ============================================
// Feedback Wall App - Main JavaScript
// ============================================
// Initialize Supabase client
var supabase;

try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.error('Supabase initialization failed:', error);
} // DOM Elements


var feedbackForm = document.getElementById('feedbackForm');
var nameInput = document.getElementById('nameInput');
var messageInput = document.getElementById('messageInput');
var charCount = document.getElementById('charCount');
var submitBtn = document.getElementById('submitBtn');
var messagesList = document.getElementById('messagesList');
var refreshBtn = document.getElementById('refreshBtn');
var totalPostsEl = document.getElementById('totalPosts');
var todayPostsEl = document.getElementById('todayPosts'); // ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  loadMessages();
  setupEventListeners();
}); // ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
  // Character counter
  messageInput.addEventListener('input', function () {
    charCount.textContent = messageInput.value.length;
  }); // Form submit

  feedbackForm.addEventListener('submit', handleSubmit); // Refresh button

  refreshBtn.addEventListener('click', function () {
    refreshBtn.style.transform = 'rotate(360deg)';
    setTimeout(function () {
      return refreshBtn.style.transform = '';
    }, 500);
    loadMessages();
  });
} // ============================================
// Load Messages from Supabase
// ============================================


function loadMessages() {
  var _ref, data, error;

  return regeneratorRuntime.async(function loadMessages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          messagesList.innerHTML = '<div class="loading">Loading messages...</div>';
          _context.prev = 1;

          if (!(SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE')) {
            _context.next = 5;
            break;
          }

          messagesList.innerHTML = "\n                <div class=\"error-state\">\n                    <strong>\u26A0\uFE0F Setup Required</strong><br>\n                    Please configure Supabase in <code>js/config.js</code>\n                </div>\n            ";
          return _context.abrupt("return");

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(supabase.from('messages').select('*').order('created_at', {
            ascending: false
          }).limit(50));

        case 7:
          _ref = _context.sent;
          data = _ref.data;
          error = _ref.error;

          if (!error) {
            _context.next = 12;
            break;
          }

          throw error;

        case 12:
          // Update stats
          updateStats(data); // Render messages

          if (data.length === 0) {
            messagesList.innerHTML = "\n                <div class=\"empty-state\">\n                    <span>\uD83D\uDCAD</span>\n                    <p>No messages yet. Be the first to post!</p>\n                </div>\n            ";
          } else {
            messagesList.innerHTML = data.map(function (msg) {
              return createMessageCard(msg);
            }).join('');
          }

          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](1);
          console.error('Error loading messages:', _context.t0);
          messagesList.innerHTML = "\n            <div class=\"error-state\">\n                <strong>\u274C Error loading messages</strong><br>\n                ".concat(_context.t0.message, "\n            </div>\n        ");

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 16]]);
} // ============================================
// Create Message Card HTML
// ============================================


function createMessageCard(msg) {
  var name = escapeHtml(msg.name || 'Anonymous');
  var message = escapeHtml(msg.message);
  var time = formatTime(msg.created_at);
  return "\n        <div class=\"message-card\">\n            <div class=\"message-header\">\n                <span class=\"message-author\">".concat(name, "</span>\n                <span class=\"message-time\">").concat(time, "</span>\n            </div>\n            <p class=\"message-content\">").concat(message, "</p>\n        </div>\n    ");
} // ============================================
// Handle Form Submit
// ============================================


function handleSubmit(e) {
  var name, message, _ref2, error;

  return regeneratorRuntime.async(function handleSubmit$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          e.preventDefault();
          name = nameInput.value.trim() || 'Anonymous';
          message = messageInput.value.trim();

          if (message) {
            _context2.next = 6;
            break;
          }

          showToast('Please enter a message', 'error');
          return _context2.abrupt("return");

        case 6:
          // Disable button
          submitBtn.disabled = true;
          submitBtn.classList.add('loading');
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(supabase.from('messages').insert([{
            name: name,
            message: message
          }]));

        case 11:
          _ref2 = _context2.sent;
          error = _ref2.error;

          if (!error) {
            _context2.next = 15;
            break;
          }

          throw error;

        case 15:
          // Success
          showToast('Message posted! 🎉', 'success');
          nameInput.value = '';
          messageInput.value = '';
          charCount.textContent = '0';
          loadMessages();
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](8);
          console.error('Error posting:', _context2.t0);
          showToast('Error posting message: ' + _context2.t0.message, 'error');

        case 26:
          _context2.prev = 26;
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          return _context2.finish(26);

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 22, 26, 30]]);
} // ============================================
// Update Stats
// ============================================


function updateStats(messages) {
  totalPostsEl.textContent = messages.length; // Count today's posts

  var today = new Date().toDateString();
  var todayCount = messages.filter(function (msg) {
    return new Date(msg.created_at).toDateString() === today;
  }).length;
  todayPostsEl.textContent = todayCount;
} // ============================================
// Utility Functions
// ============================================


function formatTime(dateString) {
  var date = new Date(dateString);
  var now = new Date();
  var diff = now - date; // Less than 1 minute

  if (diff < 60000) return 'Just now'; // Less than 1 hour

  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'; // Less than 24 hours

  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'; // Less than 7 days

  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago'; // Otherwise show date

  return date.toLocaleDateString();
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  // Remove existing toast
  var existing = document.querySelector('.toast');
  if (existing) existing.remove(); // Create new toast

  var toast = document.createElement('div');
  toast.className = "toast ".concat(type);
  toast.textContent = message;
  document.body.appendChild(toast); // Remove after 3 seconds

  setTimeout(function () {
    return toast.remove();
  }, 3000);
}
//# sourceMappingURL=app.dev.js.map
