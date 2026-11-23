/* ==========================================
   ANALYTICS STUDIO
   Task 05 - Interactive Dashboard
   HTML + CSS + JavaScript + LocalStorage
========================================== */

const STORAGE_KEY = "analytics_dashboard_data";
const SETTINGS_KEY = "analytics_dashboard_settings";

const defaultTransactions = [
    {
        id: "TXN-2026-001",
        name: "Olivia Martin",
        initials: "OM",
        product: "Premium Membership",
        date: "23 Nov 2026",
        amount: 24500,
        status: "completed"
    },
    {
        id: "TXN-2026-002",
        name: "Noah Williams",
        initials: "NW",
        product: "Annual Subscription",
        date: "22 Nov 2026",
        amount: 18500,
        status: "pending"
    },
    {
        id: "TXN-2026-003",
        name: "Sophia Anderson",
        initials: "SA",
        product: "Business Package",
        date: "21 Nov 2026",
        amount: 42000,
        status: "completed"
    },
    {
        id: "TXN-2026-004",
        name: "Liam Thompson",
        initials: "LT",
        product: "Basic Membership",
        date: "20 Nov 2026",
        amount: 8500,
        status: "failed"
    },
    {
        id: "TXN-2026-005",
        name: "Emma Johnson",
        initials: "EJ",
        product: "Premium Membership",
        date: "19 Nov 2026",
        amount: 24500,
        status: "completed"
    },
    {
        id: "TXN-2026-006",
        name: "James Wilson",
        initials: "JW",
        product: "Annual Subscription",
        date: "18 Nov 2026",
        amount: 18500,
        status: "pending"
    }
];

const elements = {
    body: document.getElementById("transactionBody"),
    search: document.getElementById("searchInput"),
    filter: document.getElementById("statusFilter"),
    empty: document.getElementById("emptyState"),
    error: document.getElementById("errorState"),
    loading: document.getElementById("skeletonState"),
    table: document.getElementById("tableContainer"),
    footer: document.getElementById("tableFooter"),
    count: document.getElementById("resultCount"),
    reset: document.getElementById("resetFilters"),
    retry: document.getElementById("retryButton"),
    selector: document.getElementById("stateSelector"),
    add: document.getElementById("addTransactionBtn")
};

function loadTransactions() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Could not read saved transactions:", error);
    }

    return [...defaultTransactions];
}

function saveTransactions() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error("Could not save transactions:", error);
    }
}

function loadSettings() {
    try {
        return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    } catch (error) {
        console.error("Could not read saved dashboard settings:", error);
        return {};
    }
}

function saveSettings() {
    const settings = {
        state: currentState,
        search: elements.search.value,
        filter: elements.filter.value
    };

    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Could not save dashboard settings:", error);
    }
}

let transactions = loadTransactions();
const savedSettings = loadSettings();
let currentState = "ideal";

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}

function renderTransactions(data) {
    elements.body.replaceChildren();

    data.forEach(transaction => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        const id = document.createElement("span");
        id.className = "transaction-id";
        id.textContent = transaction.id;
        idCell.appendChild(id);

        const customerCell = document.createElement("td");
        const customerWrapper = document.createElement("div");
        const avatar = document.createElement("div");
        const customerName = document.createElement("span");
        customerWrapper.className = "customer-cell";
        avatar.className = "customer-avatar";
        customerName.className = "customer-name";
        avatar.textContent = transaction.initials;
        customerName.textContent = transaction.name;
        customerWrapper.append(avatar, customerName);
        customerCell.appendChild(customerWrapper);

        const productCell = document.createElement("td");
        const product = document.createElement("span");
        product.className = "product-name";
        product.textContent = transaction.product;
        productCell.appendChild(product);

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;

        const amountCell = document.createElement("td");
        const amount = document.createElement("span");
        amount.className = "amount";
        amount.textContent = formatCurrency(transaction.amount);
        amountCell.appendChild(amount);

        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = `status ${transaction.status}`;
        status.textContent =
            transaction.status.charAt(0).toUpperCase() +
            transaction.status.slice(1);
        statusCell.appendChild(status);

        row.append(
            idCell,
            customerCell,
            productCell,
            dateCell,
            amountCell,
            statusCell
        );
        elements.body.appendChild(row);
    });
}

function hideAllStates() {
    elements.empty.hidden = true;
    elements.error.hidden = true;
    elements.loading.hidden = true;
    elements.table.hidden = false;
    elements.footer.hidden = false;
}

function filterTransactions() {
    const query = elements.search.value.toLowerCase().trim();
    const selectedStatus = elements.filter.value;
    const filtered = transactions.filter(transaction => {
        const matchesSearch =
            transaction.name.toLowerCase().includes(query) ||
            transaction.id.toLowerCase().includes(query) ||
            transaction.product.toLowerCase().includes(query);
        const matchesStatus =
            selectedStatus === "all" ||
            transaction.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    hideAllStates();

    if (filtered.length === 0) {
        elements.table.hidden = true;
        elements.footer.hidden = true;
        elements.empty.hidden = false;
        currentState = "empty";
    } else {
        renderTransactions(filtered);
        elements.count.textContent =
            `Showing ${filtered.length} of ${transactions.length} transactions`;
        currentState = "ideal";
    }

    elements.selector.value = currentState;
    saveSettings();
}

function showEmptyState() {
    hideAllStates();
    elements.table.hidden = true;
    elements.footer.hidden = true;
    elements.empty.hidden = false;
    currentState = "empty";
    saveSettings();
}

function showLoadingState() {
    hideAllStates();
    elements.table.hidden = true;
    elements.footer.hidden = true;
    elements.loading.hidden = false;
    currentState = "loading";
    saveSettings();
}

function showErrorState() {
    hideAllStates();
    elements.table.hidden = true;
    elements.footer.hidden = true;
    elements.error.hidden = false;
    currentState = "error";
    saveSettings();
}

function showOverflowState() {
    const overflowTransaction = {
        id: "TXN-2026-999",
        name: "Alexander Christopher Montgomery",
        initials: "AM",
        product: "Enterprise Business Membership and Premium Analytics Package",
        date: "23 Nov 2026",
        amount: 12500000,
        status: "completed"
    };

    hideAllStates();
    renderTransactions([...transactions, overflowTransaction]);
    elements.count.textContent = `Showing ${transactions.length + 1} transactions`;
    currentState = "overflow";
    saveSettings();
}

function showState(state) {
    if (!["ideal", "empty", "loading", "error", "overflow"].includes(state)) {
        state = "ideal";
    }

    if (state === "ideal") {
        filterTransactions();
    } else if (state === "empty") {
        showEmptyState();
    } else {
        elements.search.value = "";
        elements.filter.value = "all";

        if (state === "loading") {
            showLoadingState();
        } else if (state === "error") {
            showErrorState();
        } else {
            showOverflowState();
        }
    }

    elements.selector.value = currentState;
}

elements.search.addEventListener("input", filterTransactions);
elements.filter.addEventListener("change", filterTransactions);

elements.reset.addEventListener("click", () => {
    elements.search.value = "";
    elements.filter.value = "all";
    showState("ideal");
});

elements.retry.addEventListener("click", () => {
    elements.retry.disabled = true;
    showLoadingState();

    setTimeout(() => {
        elements.retry.disabled = false;
        showState("ideal");
    }, 1200);
});

elements.add.addEventListener("click", () => {
    const nextNumber = transactions.reduce((highest, transaction) => {
        const match = /^TXN-\d{4}-(\d+)$/.exec(transaction.id);
        return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0) + 1;

    transactions.unshift({
        id: `TXN-2026-${String(nextNumber).padStart(3, "0")}`,
        name: "New Customer",
        initials: "NC",
        product: "Premium Membership",
        date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }),
        amount: 24500,
        status: "completed"
    });

    saveTransactions();
    elements.search.value = "";
    elements.filter.value = "all";
    showState("ideal");
});

elements.selector.addEventListener("change", () => {
    showState(elements.selector.value);
});

function initializeDashboard() {
    elements.search.value =
        typeof savedSettings.search === "string" ? savedSettings.search : "";
    elements.filter.value =
        ["all", "completed", "pending", "failed"].includes(savedSettings.filter)
            ? savedSettings.filter
            : "all";

    const validStates = ["ideal", "empty", "loading", "error", "overflow"];
    currentState = validStates.includes(savedSettings.state)
        ? savedSettings.state
        : "ideal";

    if (currentState === "loading") {
        currentState = "ideal";
    }

    showState(currentState);
}

initializeDashboard();
