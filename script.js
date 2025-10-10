// State
let allTasks = [];
let currentFilter = 'all';
let completedTasks = new Set(); // Track completed tasks

// Load completed tasks from localStorage
function loadCompletedTasks() {
    const saved = localStorage.getItem('completedTasks');
    if (saved) {
        completedTasks = new Set(JSON.parse(saved));
    }
}

// Save completed tasks to localStorage
function saveCompletedTasks() {
    localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
}

// Month names in Norwegian
const monthNames = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember', 'Løpende'
];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    loadCompletedTasks();
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

// Get current month (1-12)
function getCurrentMonth() {
    return new Date().getMonth() + 1; // JavaScript months are 0-indexed
}

// Get sorted month order starting from current month
function getSortedMonthOrder() {
    const currentMonth = getCurrentMonth();
    const order = [];
    
    // Start from current month to end of year
    for (let i = currentMonth; i <= 12; i++) {
        order.push(i);
    }
    
    // Then wrap around to start of year until current month
    for (let i = 1; i < currentMonth; i++) {
        order.push(i);
    }
    
    // Add 'lopende' at the end
    order.push('lopende');
    
    return order;
}

// Check if a task is overdue
function isTaskOverdue(task) {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return dueDate < today;
}

// Check if a month is before current month
function isMonthBeforeCurrent(month) {
    if (month === 'lopende') return false;
    const currentMonth = getCurrentMonth();
    return month < currentMonth;
}

// Sort tasks within a month (smart sorting based on completion and due date)
function sortTasksInMonth(tasks, monthId) {
    const isPastMonth = isMonthBeforeCurrent(monthId);
    
    return tasks.sort((a, b) => {
        const aCompleted = completedTasks.has(a.id);
        const bCompleted = completedTasks.has(b.id);
        const aOverdue = isPastMonth || isTaskOverdue(a);
        const bOverdue = isPastMonth || isTaskOverdue(b);
        
        // Priority 1: Unchecked overdue/past month tasks (top)
        if (!aCompleted && aOverdue && (!bCompleted && bOverdue)) {
            // Both unchecked and overdue, sort by due date
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return 0;
        }
        if (!aCompleted && aOverdue) return -1;
        if (!bCompleted && bOverdue) return 1;
        
        // Priority 2: Unchecked non-overdue tasks
        if (!aCompleted && !aOverdue && (!bCompleted && !bOverdue)) {
            // Sort by due date if both have dates
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return 0;
        }
        if (!aCompleted && !aOverdue) return -1;
        if (!bCompleted && !bOverdue) return 1;
        
        // Priority 3: Checked non-overdue tasks
        if (aCompleted && !aOverdue && (bCompleted && !bOverdue)) return 0;
        if (aCompleted && !aOverdue) return -1;
        if (bCompleted && !bOverdue) return 1;
        
        // Priority 4: Checked overdue/past month tasks (bottom)
        if (aCompleted && aOverdue && (bCompleted && bOverdue)) {
            // Both checked and overdue, sort by due date (oldest at bottom)
            if (a.dueDate && b.dueDate) {
                return new Date(b.dueDate) - new Date(a.dueDate);
            }
            return 0;
        }
        return 0;
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
    
    // Sort tasks within each month
    Object.keys(tasksByMonth).forEach(month => {
        tasksByMonth[month] = sortTasksInMonth(tasksByMonth[month], month);
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
    const sortedMonths = getSortedMonthOrder();
    let html = '';
    
    // Render months in sorted order (starting from current month)
    sortedMonths.forEach(month => {
        const monthTasks = tasksByMonth[month];
        
        if (monthTasks && monthTasks.length > 0) {
            const monthName = month === 'lopende' ? 'Løpende' : monthNames[month - 1];
            html += renderMonthSection(month, monthName, monthTasks);
        }
    });
    
    container.innerHTML = html;
    
    // Setup checkbox event listeners
    setupCheckboxListeners();
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
    const isCompleted = completedTasks.has(task.id);
    const isPastMonth = isMonthBeforeCurrent(task.month);
    const isOverdue = isTaskOverdue(task);
    const needsAttention = (isPastMonth || isOverdue) && !isCompleted;
    
    // Build single-line info
    const infoParts = [];
    
    if (task.assignees && task.assignees.length > 0) {
        infoParts.push(`<strong>Ansvarlig:</strong> ${task.assignees.join(', ')}`);
    }
    
    if (task.dueDate) {
        const dateStr = formatDate(task.dueDate);
        const overdueLabel = needsAttention ? ' <span class="overdue-badge">⚠️ Må følges opp</span>' : '';
        infoParts.push(`<strong>Frist:</strong> ${dateStr}${overdueLabel}`);
    }
    
    const infoLine = infoParts.length > 0 ? `<div class="task-info-line">${infoParts.join(' • ')}</div>` : '';
    
    const sopLinkHtml = task.sopUrl
        ? `<a href="${task.sopUrl}" target="_blank" rel="noopener noreferrer" class="sop-link">📄 SOP</a>`
        : '';
    
    const cardClasses = [
        'task-card',
        `role-${roleClass}`,
        isCompleted ? 'completed' : '',
        needsAttention ? 'overdue' : ''
    ].filter(Boolean).join(' ');
    
    return `
        <div class="${cardClasses}" data-role="${task.role || 'all'}" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${isCompleted ? 'checked' : ''}>
                    <div class="task-title">${task.taskName}</div>
                </div>
                <div class="task-badges">
                    ${roleBadge}
                    ${sopLinkHtml}
                </div>
            </div>
            ${infoLine}
        </div>
    `;
}

// Setup checkbox event listeners
function setupCheckboxListeners() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.dataset.taskId;
            const taskCard = e.target.closest('.task-card');
            
            if (e.target.checked) {
                completedTasks.add(taskId);
                taskCard.classList.add('completed');
            } else {
                completedTasks.delete(taskId);
                taskCard.classList.remove('completed');
            }
            
            saveCompletedTasks();
            
            // Re-render to apply smart sorting
            renderTasks();
        });
    });
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

