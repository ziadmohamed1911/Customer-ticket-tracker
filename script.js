const STORAGE_KEY = "tickets"
const STATUSES = ["open", "in progress", "closed"]

const form = document.getElementById("form")
const ticketList = document.getElementById("ticket-list")

// Load saved tickets and repair old ones that have no id or status
const tickets = (JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []).map(
    (ticket) => ({
        ...ticket,
        id: ticket.id ?? crypto.randomUUID(),
        status: ticket.status ?? "open",
    })
)

/* ---------- helpers ---------- */

const escapeHTML = (text) =>
    String(text).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[char])

const formatDate = () =>
    new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })

// Finds the ticket object that the clicked/changed element belongs to
const getTicketFromEvent = (e) => {
    const id = e.target.closest(".ticket")?.dataset.id
    return tickets.find((ticket) => ticket.id === id)
}

// Single place that saves AND redraws, so the two never get out of sync
const commit = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    renderTickets()
}

// Turns form data into a plain object; File objects are saved as their name
// (localStorage can't store real files)
const getFormData = () => {
    const data = {}
    for (const [key, value] of new FormData(form)) {
        data[key] = value instanceof File ? value.name : value
    }
    return data
}

/* ---------- templates ---------- */

const statusOptions = (current) =>
    STATUSES.map(
        (status) =>
            `<option value="${status}"${status === current ? " selected" : ""}>${status}</option>`
    ).join("")

const ticketTemplate = (ticket) => `
    <div class="ticket" data-id="${ticket.id}">
        <div class="ticket-main-info">
            <div class="ticket-start">
                <h2 class="ticket-title">${escapeHTML(ticket.subject)}</h2>
                <button type="button" class="remove-btn">remove</button>
            </div>
            <div class="ticket-end">
                <h3 class="${escapeHTML(ticket.priority)}">${escapeHTML(ticket.priority)}</h3>
                <select class="status-select">${statusOptions(ticket.status)}</select>
            </div>
        </div>
        <div class="ticket-info">
            <p>${escapeHTML(ticket.message)}</p>
            <h5>Submitted on: ${ticket.date}</h5>
        </div>
        <div class="submitter-info">
            <h2>${escapeHTML(ticket.fullName)}</h2>
            <h3>${escapeHTML(ticket.email)}</h3>
        </div>
    </div>`

function renderTickets() {
    ticketList.innerHTML = tickets.length
        ? tickets.map(ticketTemplate).join("")
        : `<h2 class="no-tickets-line">There are no tickets in the queue!</h2>`
}

/* ---------- events ---------- */

form.addEventListener("submit", (e) => {
    e.preventDefault()

    tickets.push({
        ...getFormData(), // fullName, email, subject, message, priority
        status: "open",
        date: formatDate(),
        id: crypto.randomUUID(),
    })

    commit()
    form.reset()
})

ticketList.addEventListener("change", (e) => {
    if (!e.target.matches(".status-select")) return

    const ticket = getTicketFromEvent(e)
    if (!ticket) return

    ticket.status = e.target.value
    commit()
})

ticketList.addEventListener("click", (e) => {
    if (!e.target.closest(".remove-btn")) return

    const ticket = getTicketFromEvent(e)
    if (!ticket) return

    tickets.splice(tickets.indexOf(ticket), 1)
    commit()
})

/* ---------- init ---------- */

function renderCopyright() {
    const copyrightSection = document.getElementById("copyright-section")
    copyrightSection.innerHTML = `<p>&copy; ${getCurrentYear()} Ziad Mohamed. All rights reserved.</p>`
}

function getCurrentYear() {
    return new Date().getFullYear()
}

renderCopyright()
commit() // saves the repaired tickets and draws the list