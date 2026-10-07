const STORAGE_KEY = 'tickets'

const elements = {
    submitBtn: document.getElementById('submit-btn'),
    ticketList: document.getElementById('ticket-list'),
    submitMessage: document.getElementById('submit-message'),
    fullName: document.getElementById('full-name-input'),
    email: document.getElementById('email-input'),
    message: document.getElementById('message-input'),
    file: document.getElementById('file-upload-input'),
    subject: document.getElementById('subject-input')
}

const tickets = loadTickets()

renderTickets()
elements.submitBtn.addEventListener('click', handleSubmit)

function handleSubmit(e) {
    e.preventDefault()

    tickets.unshift(createTicket())
    saveTickets()
    renderTickets()
    resetForm()
    showSubmitMessage()
}

function createTicket() {
    const file = elements.file.files[0]

    return {
        fullName: elements.fullName.value,
        email: elements.email.value,
        message: elements.message.value,
        fileName: file ? file.name : '',
        ticketId: generateUniqueTicketId(),
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString()
    }
}

function generateUniqueTicketId() {
    return Math.floor(10000 + Math.random() * 90000).toString()
    
}

function escapeHtml(value) {
    const div = document.createElement('div')
    div.textContent = value
    return div.innerHTML
}

function ticketTemplate(ticket) {
    return `
        <div class="ticket">
            
            <h3><strong>Ticket ID:</strong> ${escapeHtml(ticket.ticketId)}</h3>
            <p><strong>Full Name:</strong> ${escapeHtml(ticket.fullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(ticket.email)}</p>
            <p><strong>Message:</strong> ${escapeHtml(ticket.message)}</p>
            ${ticket.fileName
                ? `<p><strong>File:</strong> ${escapeHtml(ticket.fileName)}</p>`
                : ''}
              
        </div>
    `
}

function renderTickets() {
    elements.ticketList.innerHTML = tickets.map(ticketTemplate).join('')
}

function resetForm() {
    const fields = [
        elements.fullName,
        elements.email,
        elements.message,
        elements.file,
        elements.subject
    ]

    fields.forEach(field => {
        if (field) field.value = ''
    })
}

function showSubmitMessage() {
    elements.submitMessage.style.display = 'block'
}

function loadTickets() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
        return Array.isArray(stored) ? stored : []
    } catch {
        return []
    }
}

function saveTickets() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
}