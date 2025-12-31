window.addEventListener("message", (event) => {
    const data = event.data;

    if (data.action === "open") {
        document.body.style.display = "block"; 

        if (data.cashRollCount !== undefined) {
            document.getElementById("cashRollAmount").textContent = data.cashRollCount;
        }
    } else if (data.action === "close") {
        document.body.style.display = "none"; 
        setTimeout(() => {
            document.querySelectorAll('.qty-input').forEach(inp => {
                inp.value = 1;
            });

            document.querySelectorAll('.item').forEach(div => {
                const unit = Number(div.dataset.unitPrice) || 0;
                const priceEl = div.querySelector('.item-price');
                if (priceEl) {
                    priceEl.innerHTML = `<i class="fa fa-money"></i> ${unit} Cash Rolls`;
                }
            });
            for (const k in sellOffers) delete sellOffers[k];
        }, 0);
    }
});


const items = [
    { 
        name: "Lockpick", 
        name2: "Lockpick",
        price: 60, 
        description: "A small tool used to pick locks.", 
        image: "nui://qb-inventory/html/images/items/Lockpick.png" 
    },
    { 
        name: "Thermal Drill", 
        name2: "Drill",
        price: 4500, 
        description: "A drill that melts through metal safes.", 
        image: "nui://qb-inventory/html/images/items/Drill.png" 
    },
    { 
        name: "C4 Explosive", 
        name2: "weapon_stickybomb",
        price: 7500, 
        description: "A powerful explosive for breaching walls.", 
        image: "nui://qb-inventory/html/images/items/weapon_stickybomb.png" 
    },
    { 
        name: "Night Vision", 
        name2: "nightvision",
        price: 5000, 
        description: "Enhances vision in complete darkness.", 
        image: "nui://qb-inventory/html/images/items/nightvision.png" 
    },
        { 
        name: "Thermite Bomb", 
        name2: "thermite_bomb",
        price: 60, 
        description: "Theft equipment.", 
        image: "nui://qb-inventory/html/images/items/np_phone_bomb.png" 
    },
    { 
        name: "C4 Bomb", 
        name2: "c4_bomb",
        price: 4500, 
        description: "Theft equipment.", 
        image: "nui://qb-inventory/html/images/items/c4_bomb.png" 
    },
    { 
        name: "Cutter", 
        name2: "cutter",
        price: 7500, 
        description: "Theft equipment.", 
        image: "nui://qb-inventory/html/images/items/cutter.png" 
    },
    { 
        name: "Bag", 
        name2: "bag",
        price: 5000, 
        description: "Theft equipment.", 
        image: "nui://qb-inventory/html/images/items/bag.png" 
    },
];

const sellItems = [
    {
        name: "Painting G",
        id: "paintingg",
        description: "Painting G",
        image: "nui://qb-inventory/html/images/items/paintingg.png",
        minPrice: 100,
        maxPrice: 300
    },
    {
        name: "Painting F",
        id: "paintingf",
        description: "Painting F",
        image: "nui://qb-inventory/html/images/items/paintingf.png",
        minPrice: 100,
        maxPrice: 300
    },
    {
        name: "Painting H",
        id: "paintingh",
        description: "Painting H",
        image: "nui://qb-inventory/html/images/items/paintingh.png",
        minPrice: 100,
        maxPrice: 300
    },
    {
        name: "Painting J",
        id: "paintingj",
        description: "Painting J",
        image: "nui://qb-inventory/html/images/items/paintingj.png",
        minPrice: 100,
        maxPrice: 300
    },

    {
        name: "Van Diamond",
        id: "vanDiamond",
        description: "Van Diamond",
        image: "nui://qb-inventory/html/images/items/vanDiamond.png",
        minPrice: 100,
        maxPrice: 300
    },
    {
        name: "Van Panther",
        id: "vanPanther",
        description: "Van Panther",
        image: "nui://qb-inventory/html/images/items/vanPanther.png",
        minPrice: 100,
        maxPrice: 300
    },
    {
        name: "Van Necklace",
        id: "vanNecklace",
        description: "Van Necklace",
        image: "nui://qb-inventory/html/images/items/vanNecklace.png",
        minPrice: 100,
        maxPrice: 300
    },
    {
        name: "Van Bottle",
        id: "vanBottle",
        description: "Van Bottle",
        image: "nui://qb-inventory/html/images/items/vanBottle.png",
        minPrice: 100,
        maxPrice: 300
    },
];

let currentPage = 'buy';
const sellOffers = {}; 


function updateCashRoll(delta) {
    const el = document.getElementById('cashRollAmount');
    if (!el) return;
    const cur = parseInt(el.textContent || '0', 10) || 0;
    el.textContent = cur + delta;
}

function showItemMessage(container, text, timeout = 2500) {
    let msg = container.querySelector('.item-msg');
    if (!msg) {
        msg = document.createElement('div');
        msg.className = 'item-msg';
        msg.style.marginTop = '8px';
        msg.style.fontSize = '13px';
        msg.style.color = '#fff';
        container.appendChild(msg);
    }
    msg.textContent = text;
    if (timeout) setTimeout(() => { if (msg) msg.remove(); }, timeout);
}


function renderPage(page, query = '') {
    const itemsList = document.getElementById("itemsList");
    itemsList.innerHTML = ""; 

    const dataset = page === 'buy' ? items : sellItems;
    const filtered = dataset.filter(item => item.name.toLowerCase().includes(query));

    filtered.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const itemImage = document.createElement("img");
        itemImage.alt = item.name;

        const imageKey = item.name2 || item.id || item.name.toLowerCase().replace(/\s+/g, "_");
        const tryPaths = [
            `nui://qb-inventory/html/images/items/${imageKey}.png`,
            `nui://qb-inventory/html/images/${imageKey}.png`,
            item.image || ''
        ];
        itemImage.src = tryPaths[0];
        itemImage._tryIndex = 0;
        itemImage.onerror = function () {
            this._tryIndex = (this._tryIndex || 0) + 1;
            if (this._tryIndex < tryPaths.length && tryPaths[this._tryIndex]) {
                this.src = tryPaths[this._tryIndex];
            } else {
                this.onerror = null;
                this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            }
        };

        const imageLabel = document.createElement('div');
        imageLabel.className = 'item-image-name';
        imageLabel.textContent = imageKey;

        const itemName = document.createElement("div");
        itemName.classList.add("item-name");
        itemName.textContent = item.name;

        const itemDescription = document.createElement("div");
        itemDescription.classList.add("item-description");
        itemDescription.textContent = item.description;

        const itemPrice = document.createElement("div");
        itemPrice.classList.add("item-price");

        const qtyWrapper = document.createElement('div');
        qtyWrapper.classList.add('qty-wrapper');

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.classList.add('qty-btn');

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.classList.add('qty-btn');

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = 1;
        qtyInput.max = 999;
        qtyInput.value = 1;
        qtyInput.classList.add('qty-input');
        qtyInput.style.width = '60px';

        qtyWrapper.appendChild(minusBtn);
        qtyWrapper.appendChild(qtyInput);
        qtyWrapper.appendChild(plusBtn);

        const updatePriceDisplay = (unitPrice) => {
            const qty = Math.max(1, Math.floor(Number(qtyInput.value) || 1));
            qtyInput.value = qty;
            const total = unitPrice * qty;
            itemPrice.innerHTML = `<i class="fa fa-money"></i> ${total} Cash Rolls`;
        };

        if (page === 'buy') {
            const unit = item.price;
            itemDiv.dataset.unitPrice = unit;
            updatePriceDisplay(unit);


            minusBtn.addEventListener('click', () => { qtyInput.value = Math.max(1, Number(qtyInput.value) - 1); updatePriceDisplay(unit); });
            plusBtn.addEventListener('click', () => { qtyInput.value = Math.min(999, Number(qtyInput.value) + 1); updatePriceDisplay(unit); });
            qtyInput.addEventListener('input', () => updatePriceDisplay(unit));

            const buyButton = document.createElement("button");
            buyButton.classList.add("buy-button");
            buyButton.textContent = "Purchase";
            buyButton.onclick = () => {
                const amount = Math.max(1, Math.floor(Number(qtyInput.value) || 1));
                const total = unit * amount;
                buyButton.disabled = true;
                fetch(`https://${GetParentResourceName()}/buyItem`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemName: item.name2, unitPrice: unit, amount: amount, totalPrice: total }),
                }).then(response => {
                    if (response && response.ok) {
                        updateCashRoll(-total);
                        showItemMessage(itemDiv, `Purchased ${amount} for ${total} cash rolls`);
                    } else {
                        showItemMessage(itemDiv, 'Purchase failed');
                    }
                }).catch(() => {
                    showItemMessage(itemDiv, 'Network error');
                }).finally(() => { buyButton.disabled = false; });
            };

            itemDiv.appendChild(itemImage);
            itemDiv.appendChild(imageLabel);
            itemDiv.appendChild(itemName);
            itemDiv.appendChild(itemDescription);
            itemDiv.appendChild(itemPrice);
            itemDiv.appendChild(qtyWrapper);
            itemDiv.appendChild(buyButton);
        } else {
            if (!sellOffers[item.id]) {
                const min = item.minPrice || 1;
                const max = item.maxPrice || (min + 100);
                const unitOffer = Math.floor(Math.random() * (max - min + 1)) + min;
                sellOffers[item.id] = unitOffer;
            }
            const unitOffer = sellOffers[item.id];
            itemDiv.dataset.unitPrice = unitOffer;
            updatePriceDisplay(unitOffer);

            minusBtn.addEventListener('click', () => { qtyInput.value = Math.max(1, Number(qtyInput.value) - 1); updatePriceDisplay(unitOffer); });
            plusBtn.addEventListener('click', () => { qtyInput.value = Math.min(999, Number(qtyInput.value) + 1); updatePriceDisplay(unitOffer); });
            qtyInput.addEventListener('input', () => updatePriceDisplay(unitOffer));

            const sellButton = document.createElement("button");
            sellButton.classList.add("buy-button");
            sellButton.textContent = "Sell";
            sellButton.onclick = () => {
                const amount = Math.max(1, Math.floor(Number(qtyInput.value) || 1));
                const total = unitOffer * amount;
                sellButton.disabled = true;
                fetch(`https://${GetParentResourceName()}/sellItem`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: item.id, itemName: item.name, unitPrice: unitOffer, amount: amount, totalPrice: total, giveItem: 'cash_roll', giveAmount: total }),
                }).then(response => {
                    if (response && response.ok) {
                        updateCashRoll(total);
                        showItemMessage(itemDiv, `Sold ${amount} for ${total} cash rolls`);
                    } else {
                        showItemMessage(itemDiv, 'Sell failed');
                    }
                }).catch(() => {
                    showItemMessage(itemDiv, 'Network error');
                }).finally(() => { sellButton.disabled = false; });
            };

            itemDiv.appendChild(itemImage);
            itemDiv.appendChild(itemName);
            itemDiv.appendChild(itemDescription);
            itemDiv.appendChild(itemPrice);
            itemDiv.appendChild(qtyWrapper);
            itemDiv.appendChild(sellButton);
        }


        itemsList.appendChild(itemDiv);
    });
}


document.addEventListener('DOMContentLoaded', () => {

    const buyTab = document.getElementById('buyTab');
    const sellTab = document.getElementById('sellTab');

    function setActiveTab(tab) {
        buyTab.classList.remove('active');
        sellTab.classList.remove('active');
        tab.classList.add('active');
    }

    buyTab.addEventListener('click', () => {
        currentPage = 'buy';
        setActiveTab(buyTab);
        renderPage('buy');
    });

    sellTab.addEventListener('click', () => {
        currentPage = 'sell';
        setActiveTab(sellTab);
        renderPage('sell');
    });

    renderPage('buy');
});

document.getElementById("searchInput").addEventListener("input", function (event) {
    const query = event.target.value.toLowerCase();
    renderPage(currentPage, query);
});

document.getElementById("exitButton").addEventListener("click", function () {
    fetch(`https://${GetParentResourceName()}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        fetch(`https://${GetParentResourceName()}/cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
    }
});