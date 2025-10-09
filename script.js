// State
let allTasks = [];
let currentFilter = 'all';

// Month names in Norwegian
const monthNames = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember', 'Løpende'
];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();
    setupFilterButtons();
    renderTasks();
});

// Load tasks from JSON file
async function loadTasks() {
    try {
        const response = await fetch('data/tasks.json');
        if (!response.ok) {
            throw new Error('Could not load tasks');
        }
        allTasks = await response.json();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Kunne ikke laste oppgaver. Vennligst prøv igjen senere.');
    }
}

// Setup filter button event listeners
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update filter and re-render
            currentFilter = button.dataset.role;
            renderTasks();
        });
    });
}

// Filter tasks based on current filter
function getFilteredTasks() {
    if (currentFilter === 'all') {
        return allTasks;
    }
    
    return allTasks.filter(task => {
        // If task has no role, show it in all filters
        if (!task.role || task.role === '') {
            return true;
        }
        return task.role === currentFilter;
    });
}

// Organize tasks by month
function organizeTasksByMonth(tasks) {
    const tasksByMonth = {};
    
    // Initialize all months
    for (let i = 1; i <= 12; i++) {
        tasksByMonth[i] = [];
    }
    tasksByMonth['lopende'] = []; // For tasks without due date
    
    // Group tasks by month
    tasks.forEach(task => {
        if (task.month === null) {
            tasksByMonth['lopende'].push(task);
        } else {
            tasksByMonth[task.month].push(task);
        }
    });
    
    return tasksByMonth;
}

// Render all tasks
function renderTasks() {
    const container = document.getElementById('tasks-container');
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Ingen oppgaver funnet</h3>
                <p>Det er ingen oppgaver for dette filteret.</p>
            </div>
        `;
        return;
    }
    
    const tasksByMonth = organizeTasksByMonth(filteredTasks);
    let html = '';
    
    // Render each month
    for (let month = 1; month <= 12; month++) {
        const monthTasks = tasksByMonth[month];
        
        if (monthTasks.length > 0) {
            html += renderMonthSection(month, monthNames[month - 1], monthTasks);
        }
    }
    
    // Render "Løpende" tasks
    if (tasksByMonth['lopende'].length > 0) {
        html += renderMonthSection('lopende', 'Løpende', tasksByMonth['lopende']);
    }
    
    container.innerHTML = html;
}

// Render a month section
function renderMonthSection(monthId, monthName, tasks) {
    const tasksHtml = tasks.map(task => renderTaskCard(task)).join('');
    
    return `
        <div class="month-section" data-month="${monthId}">
            <h2 class="month-header">${monthName}</h2>
            <div class="tasks-list">
                ${tasksHtml}
            </div>
        </div>
    `;
}

// Render a single task card
function renderTaskCard(task) {
    const roleClass = task.role ? task.role.toLowerCase() : '';
    const roleBadge = task.role ? `<span class="role-badge ${roleClass}">${task.role}</span>` : '';
    
    const assigneesHtml = task.assignees && task.assignees.length > 0
        ? `
            <div class="task-info">
                <strong>Ansvarlig:</strong>
                <div class="task-assignees">
                    ${task.assignees.map(assignee => `<span class="assignee-tag">${assignee}</span>`).join('')}
                </div>
            </div>
        `
        : '';
    
    const tagsHtml = task.tags && task.tags.length > 0
        ? `
            <div class="task-info">
                <div class="task-tags">
                    ${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `
        : '';
    
    const dueDateHtml = task.dueDate
        ? `
            <div class="task-info">
                <strong>Frist:</strong> ${formatDate(task.dueDate)}
            </div>
        `
        : '';
    
    const quarterHtml = task.quarter
        ? `
            <div class="task-info">
                <strong>Kvartal:</strong> ${task.quarter}
            </div>
        `
        : '';
    
    const sopLinkHtml = task.sopUrl
        ? `<a href="${task.sopUrl}" target="_blank" rel="noopener noreferrer" class="sop-link">📄 Se SOP</a>`
        : '';
    
    return `
        <div class="task-card role-${roleClass}" data-role="${task.role || 'all'}">
            <div class="task-header">
                <div class="task-title">${task.taskName}</div>
                ${roleBadge}
            </div>
            <div class="task-details">
                ${assigneesHtml}
                ${dueDateHtml}
                ${quarterHtml}
                ${tagsHtml}
                ${sopLinkHtml}
            </div>
        </div>
    `;
}

// Format date to Norwegian format
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}. ${month.toLowerCase()} ${year}`;
}

// Show error message
function showError(message) {
    const container = document.getElementById('tasks-container');
    container.innerHTML = `
        <div class="empty-state">
            <h3>⚠️ Feil</h3>
            <p>${message}</p>
        </div>
    `;
}

