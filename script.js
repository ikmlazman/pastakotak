document.addEventListener("DOMContentLoaded", function () {
    const menuItems = [
        { name: "Carbonara", price: 7 },
        { name: "Bolognese", price: 8 },
        { name: "Aglio Olio", price: 9 },
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
        });
        totalPriceEl.textContent = total.toLocaleString();
    }

    function updateOrderSummary() {
        orderSummary.innerHTML = "";
        Object.keys(orderData).forEach((key) => {
            if (orderData[key].quantity > 0) {
                const li = document.createElement("li");
                li.textContent = `${key}: ${orderData[key].quantity} pcs`;
                orderSummary.appendChild(li);
            }
        });
    }

    function createMenuList() {
        menuContainer.innerHTML = "";
        orderData = {};

        menuItems.forEach((item, index) => {
            orderData[item.name] = { quantity: 0, price: item.price };

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("order-item");
            itemDiv.innerHTML = `
                <p>${item.name} - ${item.price} MYR</p>
                <div class="quantity-control">
                    <button class="minus" data-index="${index}">-</button>
                    <span id="qty-${index}">0</span>
                    <button class="plus" data-index="${index}">+</button>
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

    sendOrderBtn.addEventListener("click", function () {
        let orderText = "Hi! I'd like to order:\n";
        let hasOrder = false;

        Object.keys(orderData).forEach((key) => {
            if (orderData[key].quantity > 0) {
                hasOrder = true;
                orderText += `- ${key}: ${orderData[key].quantity} pcs (${orderData[key].quantity * orderData[key].price} MYR)\n`;
            }
        });

        if (!hasOrder) {
            alert("Please select at least one item.");
            return;
        }

        orderText += `\nTotal: ${totalPriceEl.textContent} MYR`;
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

