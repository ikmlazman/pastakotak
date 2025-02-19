/* menu picture */
function showOptions(id) {
    var optionsMenu = document.getElementById(id);

    // Toggle visibility
    if (optionsMenu.style.display === "none" || optionsMenu.style.display === "") {
        optionsMenu.style.display = "block";
    } else {
        optionsMenu.style.display = "none";
    }
}
/*menu picture */
/* Toggle menu options */
function showOptions(id) {
    var optionsMenu = document.getElementById(id);
    optionsMenu.style.display = (optionsMenu.style.display === "none" || optionsMenu.style.display === "") ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const menuItems = [
        { name: "Aglio Olio Roasted Chicken", price: 12 },
        { name: "Aglio Olio Beef Strips", price: 13 },
        { name: "Aglio Olio Prawn", price: 15 },
        { name: "Alfredo Roasted Chicken", price: 13 },
        { name: "Alfredo Beef Strips", price: 14 },
        { name: "Alfredo Shiitake Mushroom", price: 10 },
        { name: "Alfredo Prawn", price: 15 }
    ];

    const addOns = [
        { name: "Egg Yolk", price: 2 },
        { name: "Chicken/Prawn/Beef", price: 3 },
        { name: "Parmesan", price: 2 }
    ];

    const orderBtn = document.getElementById("order-btn");
    const modal = document.getElementById("order-modal");
    const closeModal = document.querySelector(".close");
    const menuContainer = document.getElementById("menu-items");
    const totalPriceEl = document.getElementById("total-price");
    const sendOrderBtn = document.getElementById("send-whatsapp");
    const orderSummary = document.getElementById("order-summary");

    let orderData = {};

    function updateTotalPrice() {
        let total = 0;
        Object.values(orderData).forEach(item => {
            total += item.quantity * item.price;
            if (item.addOns) {
                item.addOns.forEach(addOn => {
                    total += addOn.quantity * addOn.price;
                });
            }
        });
        totalPriceEl.textContent = total.toLocaleString() + " MYR";
    }

    function updateOrderSummary() {
        orderSummary.innerHTML = "";
        Object.keys(orderData).forEach((key) => {
            if (orderData[key].quantity > 0) {
                const li = document.createElement("li");
                let addOnsText = orderData[key].addOns
                    .filter(addOn => addOn.quantity > 0)
                    .map(addOn => `${addOn.name} x${addOn.quantity}`)
                    .join(", ");
                li.textContent = `${key}: ${orderData[key].quantity} pcs ${addOnsText ? "(" + addOnsText + ")" : ""}`;
                orderSummary.appendChild(li);
            }
        });
    }

    function createMenuList() {
        menuContainer.innerHTML = "";
        orderData = {};

        menuItems.forEach((item, index) => {
            orderData[item.name] = { quantity: 0, price: item.price, addOns: addOns.map(a => ({ ...a, quantity: 0 })) };

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("order-item");
            itemDiv.innerHTML = `
                <p>${item.name} - ${item.price} MYR</p>
                <div class="quantity-control">
                    <button class="minus" data-index="${index}">-</button>
                    <span id="qty-${index}">0</span>
                    <button class="plus" data-index="${index}">+</button>
                </div>
                <div class="addons">
                    <p>Add-ons:</p>
                    ${addOns.map((addOn, addOnIndex) => `
                        <div>
                            <input type="checkbox" id="addon-${index}-${addOnIndex}" data-index="${index}" data-addon="${addOnIndex}">
                            <label for="addon-${index}-${addOnIndex}">${addOn.name} (+${addOn.price} MYR)</label>
                        </div>
                    `).join('')}
                </div>
            `;
            menuContainer.appendChild(itemDiv);
        });
    }

    orderBtn.addEventListener("click", function () {
        modal.style.display = "flex";
        createMenuList();
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    menuContainer.addEventListener("click", function (event) {
        const index = event.target.getAttribute("data-index");
        if (index !== null) {
            const menuItem = menuItems[index];
            const quantityEl = document.getElementById(`qty-${index}`);

            if (event.target.classList.contains("plus")) {
                orderData[menuItem.name].quantity++;
            } else if (event.target.classList.contains("minus") && orderData[menuItem.name].quantity > 0) {
                orderData[menuItem.name].quantity--;
            }

            quantityEl.textContent = orderData[menuItem.name].quantity;
            updateTotalPrice();
            updateOrderSummary();
        }
    });

    menuContainer.addEventListener("change", function (event) {
        const index = event.target.getAttribute("data-index");
        const addOnIndex = event.target.getAttribute("data-addon");

        if (index !== null && addOnIndex !== null) {
            const menuItem = menuItems[index];
            const addOn = orderData[menuItem.name].addOns[addOnIndex];

            if (event.target.checked) {
                addOn.quantity = 1;
            } else {
                addOn.quantity = 0;
            }

            updateTotalPrice();
            updateOrderSummary();
        }
    });

    sendOrderBtn.addEventListener("click", function () {
        let orderText = "Hi! I'd like to order:\n";
        let hasOrder = false;

        Object.keys(orderData).forEach((key) => {
            if (orderData[key].quantity > 0) {
                hasOrder = true;
                let addOnsText = orderData[key].addOns
                    .filter(addOn => addOn.quantity > 0)
                    .map(addOn => `${addOn.name} x${addOn.quantity}`)
                    .join(", ");
                orderText += `- ${key}: ${orderData[key].quantity} pcs ${addOnsText ? "(" + addOnsText + ")" : ""} (${orderData[key].quantity * orderData[key].price} MYR)\n`;
            }
        });

        if (!hasOrder) {
            alert("Please select at least one item.");
            return;
        }

        orderText += `\nTotal: ${totalPriceEl.textContent}`;
        const whatsappURL = `https://wa.me/60139529463?text=${encodeURIComponent(orderText)}`;
        window.open(whatsappURL, "_blank");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("background-music");

    // Set medium volume (0.5 = 50%)
    audio.volume = 0.5;

    // Try to play the audio when the page loads
    audio.play().catch(() => {
        console.log("Autoplay blocked. Waiting for user interaction.");
    });

    // Play when user clicks anywhere (fix for autoplay issues)
    document.body.addEventListener("click", function () {
        audio.play();
    }, { once: true }); // Ensures it runs only once
});

