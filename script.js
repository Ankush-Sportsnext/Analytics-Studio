
/* =========================================
   ANALYTICS STUDIO
   Interactive Functionality
========================================= */

// 1. SAMPLE TRANSACTION DATA

const transactions = [
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


// 2. DOM ELEMENTS

const transactionBody = document.getElementById("transactionBody");

const searchInput = document.getElementById("searchInput");

const statusFilter = document.getElementById("statusFilter");

const emptyState = document.getElementById("emptyState");

const errorState = document.getElementById("errorState");

const skeletonState = document.getElementById("skeletonState");

const tableContainer = document.getElementById("tableContainer");

const tableFooter = document.getElementById("tableFooter");

const resultCount = document.getElementById("resultCount");

const resetFilters = document.getElementById("resetFilters");

const retryButton = document.getElementById("retryButton");

const stateSelector = document.getElementById("stateSelector");


// 3. FORMAT CURRENCY

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

}


// 4. DISPLAY TRANSACTION ROWS

function renderTransactions(data) {

    transactionBody.innerHTML = "";

    data.forEach(transaction => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="customer-cell">
                    <div class="customer-avatar">
                        ${transaction.initials}
                    </div>

                    <span class="customer-name" title="${transaction.name}">
                        ${transaction.name}
                    </span>
                </div>
            </td>
            <td>${transaction.date}</td>
            <td>10:30 PM</td>
            <td>
                <span class="status ${transaction.status}">
                    ${transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </span>
            </td>
            <td>
                <span class="amount">
                    ${formatCurrency(transaction.amount)}
                </span>
            </td>
        `;

        transactionBody.appendChild(row);

    });

}


// 5. SEARCH AND FILTER FUNCTIONALITY

function filterTransactions() {

    const searchTerm = searchInput.value.toLowerCase().trim();

    const selectedStatus = statusFilter.value;

    const filteredData = transactions.filter(transaction => {

        const matchesSearch =
            transaction.name.toLowerCase().includes(searchTerm) ||
            transaction.id.toLowerCase().includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            transaction.status === selectedStatus;

        return matchesSearch && matchesStatus;

    });

    renderTransactions(filteredData);

    // Show empty state when no matching records exist

    const hasResults = filteredData.length > 0;

    tableContainer.hidden = !hasResults;

    emptyState.hidden = hasResults;

    errorState.hidden = true;

    skeletonState.hidden = true;

    tableFooter.hidden = !hasResults;

    // Update result count

    if (hasResults) {

        resultCount.textContent =
            `Showing 1–${filteredData.length} of ${filteredData.length} transactions`;

    }

}


// 6. SEARCH EVENT

searchInput.addEventListener("input", () => {

    stateSelector.value = "ideal";

    filterTransactions();

});


// 7. STATUS FILTER EVENT

statusFilter.addEventListener("change", () => {

    stateSelector.value = "ideal";

    filterTransactions();

});


// 8. RESET FILTERS

resetFilters.addEventListener("click", () => {

    searchInput.value = "";

    statusFilter.value = "all";

    stateSelector.value = "ideal";

    showState("ideal");

});


// 9. FIVE UI STATES

function showState(state) {

    // Hide all special states first

    emptyState.hidden = true;

    errorState.hidden = true;

    skeletonState.hidden = true;

    tableContainer.hidden = false;

    tableFooter.hidden = false;

    // IDEAL STATE

    if (state === "ideal") {

        renderTransactions(transactions);

        tableContainer.hidden = false;

        tableFooter.hidden = false;

        resultCount.textContent =
            `Showing 1–${transactions.length} of ${transactions.length} transactions`;

    }


    // EMPTY STATE

    else if (state === "empty") {

        transactionBody.innerHTML = "";

        tableContainer.hidden = true;

        tableFooter.hidden = true;

        emptyState.hidden = false;

    }


    // SKELETON LOADING STATE

    else if (state === "skeleton") {

        tableContainer.hidden = true;

        tableFooter.hidden = true;

        skeletonState.hidden = false;

    }


    // ERROR STATE

    else if (state === "error") {

        tableContainer.hidden = true;

        tableFooter.hidden = true;

        errorState.hidden = false;

    }


    // OVERFLOW STATE

    else if (state === "overflow") {

        const overflowData = [
            {
                id: "TXN-2026-999",
                name: "Alexander Christopher Montgomery",
                initials: "AM",
                product: "Enterprise Business Membership and Premium Analytics Package",
                date: "23 Nov 2026",
                amount: 12500000,
                status: "completed"
            },
            ...transactions.slice(0, 3)
        ];

        renderTransactions(overflowData);

        tableContainer.hidden = false;

        tableFooter.hidden = false;

        resultCount.textContent =
            "Showing 1–4 of 4 transactions";

    }

}


// 10. STATE PREVIEW CONTROL

stateSelector.addEventListener("change", () => {

    searchInput.value = "";

    statusFilter.value = "all";

    showState(stateSelector.value);

});


// 11. RETRY ACTION

retryButton.addEventListener("click", () => {

    stateSelector.value = "ideal";

    showState("ideal");

});


// 12. INITIAL DASHBOARD RENDER

showState("ideal");
