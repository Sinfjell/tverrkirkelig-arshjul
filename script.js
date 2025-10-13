// Global state
let allTasks = [];
let currentFilter = 'all';
let completedTasks = new Set();

const monthNames = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

// Load completed tasks from Firebase
async function loadCompletedTasks() {
    try {
        if (!window.db) {
            const saved = localStorage.getItem('completedTasks');
            if (saved) completedTasks = new Set(JSON.parse(saved));
            return;
        }
        
        const snapshot = await getDocs(collection(window.db, 'taskStatus'));
        completedTasks.clear();
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.completed) completedTasks.add(doc.id);
            
            // Load due date override from Firebase
            if (data.dueDate) {
                localStorage.setItem(`task_${doc.id}_dueDate`, data.dueDate);
            }
        });
        
        console.log('Loaded completed tasks from Firebase:', completedTasks.size);
    } catch (error) {
        console.error('Error loading completed tasks:', error);
        const saved = localStorage.getItem('completedTasks');
        if (saved) completedTasks = new Set(JSON.parse(saved));
    }
}

// Get effective due date (stored override or original from JSON)
function getTaskDueDate(task) {
    const stored = localStorage.getItem(`task_${task.id}_dueDate`);
    return stored || task.dueDate;
}

// Set task due date in localStorage
function setTaskDueDate(taskId, dueDate) {
    localStorage.setItem(`task_${taskId}_dueDate`, dueDate);
}

// Remove task due date override (revert to JSON original)
function removeTaskDueDateOverride(taskId) {
    localStorage.removeItem(`task_${task.id}_dueDate`);
}

// Move task to next year when completed
function moveTaskToNextYear(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task || !task.dueDate) return;
    
    const currentDueDate = getTaskDueDate(task);
    const dueDate = new Date(currentDueDate);
    dueDate.setFullYear(dueDate.getFullYear() + 1);
    const newDueDate = dueDate.toISOString().split('T')[0];
    
    setTaskDueDate(taskId, newDueDate);
    console.log(`Moved task ${taskId} to next year: ${newDueDate}`);
}

// Move task back to current year when unchecked
function moveTaskToCurrentYear(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task || !task.dueDate) return;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const dueDate = new Date(task.dueDate); // Use original JSON date
    dueDate.setFullYear(currentYear);
    const newDueDate = dueDate.toISOString().split('T')[0];
    
    setTaskDueDate(taskId, newDueDate);
    console.log(`Moved task ${taskId} back to current year: ${newDueDate}`);
}

// Save single task status to Firebase
async function saveTaskStatus(taskId, completed) {
    try {
        const task = allTasks.find(t => t.id === taskId);
        
        if (completed && task && isTaskOverdue(task)) {
            moveTaskToNextYear(taskId);
            localStorage.setItem(`task_${taskId}_completed_year`, new Date().getFullYear().toString());
        } else if (!completed && task) {
            moveTaskToCurrentYear(taskId);
            localStorage.removeItem(`task_${taskId}_completed_year`);
        }
        
        if (!window.db) {
            localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
            return;
        }
        
        // Get the effective due date (override or original)
        const effectiveDueDate = task ? getTaskDueDate(task) : null;
        
        const taskRef = doc(window.db, 'taskStatus', taskId);
        await setDoc(taskRef, {
            completed: completed,
            lastUpdated: new Date(),
            taskId: taskId,
            dueDate: effectiveDueDate // Save the due date override to Firebase
        }, { merge: true });
        
        console.log(`Saved task ${taskId} to Firebase: ${completed}, dueDate: ${effectiveDueDate}`);
    } catch (error) {
        console.error('Error saving task status:', error);
        localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
    }
}

function saveCompletedTasks() {
    localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
}

function getAllTaskIds() {
    return allTasks.map(task => task.id);
}

function checkForNewYearReset() {
    const today = new Date();
    const isNewYear = today.getMonth() === 0 && today.getDate() === 1;
    const currentYear = today.getFullYear();
    const lastResetYear = localStorage.getItem('lastNewYearReset');
    
    if (isNewYear && (!lastResetYear || parseInt(lastResetYear) < currentYear)) {
        completedTasks.clear();
        localStorage.removeItem('completedTasks');
        
        allTasks.forEach(task => {
            localStorage.removeItem(`task_${task.id}_completed_year`);
            localStorage.removeItem(`task_${task.id}_dueDate`); // Clear due date overrides
        });
        
        localStorage.setItem('lastNewYearReset', currentYear.toString());
        console.log(`🎉 FULL RESET for new year ${currentYear}!`);
        saveCompletedTasks();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();
    await loadCompletedTasks();
    checkForNewYearReset();
    setupFilterButtons();
    renderTasks();
    setupFirebaseListener();
    setupNavigationHighlighting();
});

// Navigation highlighting for Årshjul page
function setupNavigationHighlighting() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Check if current path matches the link href
        if ((currentPath === '/' && href === '/') || 
            (currentPath === '/arshjul.html' && href === '/arshjul.html') ||
            (currentPath === '/arshjul' && href === '/arshjul')) {
            link.classList.add('active');
        }
    });
}

function normalizeDateToCurrentYear(task) {
    if (!task.dueDate) return task;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const dueDate = new Date(task.dueDate);
    const taskMonth = task.month - 1;
    
    let targetYear = currentYear;
    if (taskMonth < currentMonth) {
        targetYear = currentYear + 1;
    }
    
    dueDate.setFullYear(targetYear);
    task.dueDate = dueDate.toISOString().split('T')[0];
    
    return task;
}

async function loadTasks() {
    try {
        const response = await fetch('data/tasks.json');
        if (!response.ok) throw new Error('Could not load tasks');
        
        const tasks = await response.json();
        allTasks = tasks.map(task => normalizeDateToCurrentYear(task));
        console.log('Tasks loaded and normalized to current year cycle');
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Kunne ikke laste oppgaver. Vennligst prøv igjen senere.');
    }
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.role;
            renderTasks();
        });
    });
}

function getFilteredTasks() {
    if (currentFilter === 'all') return allTasks;
    return allTasks.filter(task => task.role === currentFilter || !task.role);
}

function getCurrentMonth() {
    return new Date().getMonth() + 1;
}

function getSortedMonthOrder() {
    const currentMonth = getCurrentMonth();
    const months = [];
    
    for (let i = 0; i < 12; i++) {
        const month = ((currentMonth - 1 + i) % 12) + 1;
        months.push(month);
    }
    
    return months;
}

function isTaskOverdue(task) {
    const effectiveDueDate = getTaskDueDate(task);
    if (!effectiveDueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(effectiveDueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
}

function isMonthBeforeCurrent(month) {
    const currentMonth = getCurrentMonth();
    return month < currentMonth;
}

function sortTasksInMonth(tasks, monthId) {
    const isPastMonth = isMonthBeforeCurrent(monthId);
    
    return tasks.sort((a, b) => {
        const aCompleted = completedTasks.has(a.id);
        const bCompleted = completedTasks.has(b.id);
        const aOverdue = isPastMonth || isTaskOverdue(a);
        const bOverdue = isPastMonth || isTaskOverdue(b);
        
        if (!aCompleted && aOverdue && (!bCompleted && bOverdue)) {
            const aDueDate = getTaskDueDate(a);
            const bDueDate = getTaskDueDate(b);
            if (aDueDate && bDueDate) {
                return new Date(aDueDate) - new Date(bDueDate);
            }
            return 0;
        }
        if (!aCompleted && aOverdue) return -1;
        if (!bCompleted && bOverdue) return 1;
        
        if (!aCompleted && !aOverdue && (!bCompleted && !bOverdue)) {
            const aDueDate = getTaskDueDate(a);
            const bDueDate = getTaskDueDate(b);
            if (aDueDate && bDueDate) {
                return new Date(aDueDate) - new Date(bDueDate);
            }
            return 0;
        }
        if (!aCompleted && !aOverdue) return -1;
        if (!bCompleted && !bOverdue) return 1;
        
        if (aCompleted && !aOverdue && (bCompleted && !bOverdue)) return 0;
        if (aCompleted && !aOverdue) return -1;
        if (bCompleted && !bOverdue) return 1;
        
        if (aCompleted && aOverdue && (bCompleted && bOverdue)) {
            const aDueDate = getTaskDueDate(a);
            const bDueDate = getTaskDueDate(b);
            if (aDueDate && bDueDate) {
                return new Date(bDueDate) - new Date(aDueDate);
            }
            return 0;
        }
        return 0;
    });
}

function organizeTasksByMonth(tasks) {
    const tasksByMonth = {};
    
    for (let i = 1; i <= 12; i++) {
        tasksByMonth[i] = [];
    }
    
    tasks.forEach(task => {
        if (task.month !== null) {
            tasksByMonth[task.month].push(task);
        }
    });
    
    Object.keys(tasksByMonth).forEach(month => {
        tasksByMonth[month] = sortTasksInMonth(tasksByMonth[month], month);
    });
    
    return tasksByMonth;
}

function getOverdueTasks(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
        if (completedTasks.has(task.id)) return false;
        
        const effectiveDueDate = getTaskDueDate(task);
        if (!effectiveDueDate) return false;
        
        const dueDate = new Date(effectiveDueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        return dueDate < today;
    }).sort((a, b) => {
        const aDueDate = getTaskDueDate(a);
        const bDueDate = getTaskDueDate(b);
        return new Date(aDueDate) - new Date(bDueDate);
    });
}

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
    
    let html = '';
    
    const overdueTasks = getOverdueTasks(filteredTasks);
    if (overdueTasks.length > 0) {
        html += '<div class="overdue-section">';
        html += '<h2 class="overdue-title">⚠️ Over fristen</h2>';
        html += '<div class="month-tasks">';
        overdueTasks.forEach(task => {
            html += renderTaskCard(task);
        });
        html += '</div></div>';
    }
    
    const tasksByMonth = organizeTasksByMonth(filteredTasks);
    const sortedMonths = getSortedMonthOrder();
    
    sortedMonths.forEach(month => {
        const monthTasks = tasksByMonth[month];
        
        if (monthTasks && monthTasks.length > 0) {
            const monthName = monthNames[month - 1];
            html += renderMonthSection(month, monthName, monthTasks);
        }
    });
    
    container.innerHTML = html;
    setupCheckboxListeners();
}

function renderMonthSection(monthId, monthName, tasks) {
    const tasksHtml = tasks.map(task => renderTaskCard(task)).join('');
    
    return `
        <div class="month-section" data-month="${monthId}">
            <h2 class="month-header">${monthName}</h2>
            <div class="month-tasks">
                ${tasksHtml}
            </div>
        </div>
    `;
}

function renderTaskCard(task) {
    const roleClass = task.role ? task.role.toLowerCase() : '';
    const roleBadge = task.role ? `<span class="role-badge ${roleClass}">${task.role}</span>` : '';
    const isCompleted = completedTasks.has(task.id);
    const isPastMonth = isMonthBeforeCurrent(task.month);
    const isOverdue = isTaskOverdue(task);
    const needsAttention = !isCompleted && isOverdue;

    const infoParts = [];

    if (task.assignees && task.assignees.length > 0) {
        infoParts.push(`<strong>Ansvarlig:</strong> ${task.assignees.join(', ')}`);
    }

    const effectiveDueDate = getTaskDueDate(task);
    if (effectiveDueDate) {
        const dateStr = formatDate(effectiveDueDate);
        const overdueLabel = needsAttention ? ' <span class="overdue-badge">⚠️ Over fristen</span>' : '';
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

function setupFirebaseListener() {
    if (!window.db) return;
    
    try {
        const q = query(collection(window.db, 'taskStatus'));
        let isFirstLoad = true;
        
        onSnapshot(q, (snapshot) => {
            if (isFirstLoad) {
                isFirstLoad = false;
                console.log('Firebase listener initialized');
                return;
            }
            
            console.log('Firebase data changed from another user, updating UI...');
            
            const previousSize = completedTasks.size;
            completedTasks.clear();
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.completed) completedTasks.add(doc.id);
                
                // Sync due date override from Firebase
                if (data.dueDate) {
                    localStorage.setItem(`task_${doc.id}_dueDate`, data.dueDate);
                } else {
                    // If no override in Firebase, remove any local override
                    localStorage.removeItem(`task_${doc.id}_dueDate`);
                }
            });
            
            if (completedTasks.size !== previousSize || snapshot.docChanges().length > 0) {
                renderTasks();
            }
        });
    } catch (error) {
        console.error('Error setting up Firebase listener:', error);
    }
}

function setupCheckboxListeners() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const taskId = e.target.dataset.taskId;
            const taskCard = e.target.closest('.task-card');
            const isChecked = e.target.checked;
            
            if (isChecked) {
                completedTasks.add(taskId);
                taskCard.classList.add('completed');
            } else {
                completedTasks.delete(taskId);
                taskCard.classList.remove('completed');
            }
            
            await saveTaskStatus(taskId, isChecked);
            renderTasks();
        });
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${day}. ${month.toLowerCase()}`;
}

function showError(message) {
    const container = document.getElementById('tasks-container');
    container.innerHTML = `
        <div class="empty-state">
            <h3>⚠️ Feil</h3>
            <p>${message}</p>
        </div>
    `;
}