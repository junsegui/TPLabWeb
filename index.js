const galleryList = document.querySelector(".galleryList");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("q");
const galleryItem = document.querySelector(".galleryItem");
const productDetailSection = document.getElementById("productDetailSection");
const cartButton = document.getElementById("cartButton");
const btnRemoveOne = document.querySelector(".btnRemoveOne");
const btnAddOne = document.querySelector(".btnAddOne");
const btnRemoveAll = document.querySelector(".btnRemoveAll");
const APIURL = "https://fakestoreapi.com/products";

let products = [];
let selectedProduct = null;
let cart = [];

// --- localStorage helpers ---
function saveCartToStorage() {

    localStorage.setItem('cart', JSON.stringify(cart));

}

function loadCartFromStorage() {

    const raw = localStorage.getItem('cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];

}

function clearCart() {
  cart = [];
  updateCartButton();
  saveCartToStorage();
  showCartModal();
}

function checkoutCart() {

  cart = [];
  updateCartButton();
  saveCartToStorage();
  closeModal();

  alert('Gracias por tu compra — el carrito ha sido procesado.');
}

function groupCartItems(cartItems) {
  const grouped = {};
  cartItems.forEach((item) => {
    if (!grouped[item.id]) {
      grouped[item.id] = { ...item, quantity: 0 };
    }
    grouped[item.id].quantity += 1;
  });
  return Object.values(grouped);
}

function updateCartButton() {
  cartButton.textContent = `🛒 Cart (${cart.length})`;
}

async function getProducts() {
  const response = await fetch(APIURL);
  const data = await response.json();
  products = data;
  console.log("products", products);
}

function renderProducts(productsToRender) {
  galleryList.innerHTML = "";
  productsToRender.forEach((product) => {
    const li = document.createElement("li");
    li.classList.add("galleryItem");
    li.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="galleryItemInfo">
        <h3>${product.title}</h3>
        <p class="galleryItemPrice">$${product.price}</p>
      </div>
    `;
    li.addEventListener("click", () => {
      selectedProduct = product;
      console.log("selected", selectedProduct);
      showProductDetails(selectedProduct);
    });
    galleryList.appendChild(li);
  });
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(query)
  );
  renderProducts(filteredProducts);
});

function showProductDetails(product) {
  const modal = document.createElement("div");
  console.log("product in modal", product.title);
  modal.innerHTML = `
    <div class="modalContent">
      <span class="closeButton">&times;</span>
      <img class="productDetailImage" src="${product.image}" alt="${product.title}" />
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p class="galleryItemPrice">$${product.price}</p>
      <button class="addToCartButton">Add to Cart</button>
    </div>
  `;
  modal.classList.add("modal");
  productDetailSection.appendChild(modal);
  productDetailSection.style.display = "flex";

  const addToCartButton = modal.querySelector(".addToCartButton");
  addToCartButton.addEventListener("click", () => {
    addToCart(product)
  });
}

function addToCart(product) {
  cart.push(product);
  updateCartButton();
  closeModal();
}

function showCartModal() {
  closeModal();

  const groupedItems = groupCartItems(cart);
  console.log(groupedItems);
  
  const itemsMarkup = groupedItems.length
    ? `<ul class="cartList">
        ${groupedItems
          .map(
            (item) => `
              <li class="cartItem">
                <img src="${item.image}" alt="${item.title}" />
                <div>
                  <h3>${item.title}</h3>
                  <p class="galleryItemPrice">$${item.price}</p>
                  <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                  <div class="cartItemActions">
                    <button class="btnRemoveAll" data-id="${item.id}">🗑️</button>
                    <button class="btnRemoveOne" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btnAddOne" data-id="${item.id}">+</button>
                  </div>
                </div>
              </li>`
          )
          .join("")}
      </ul>`
    : `<p class="emptyCart">Tu carrito está vacío</p>`;

  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="modalContent">
      <span class="closeButton">&times;</span>
      <h2>Carrito</h2>
      ${itemsMarkup}
      ${cart.length !== 0?"<div class='cartActions'><button class='btnClearCart'>Vaciar carrito</button><button class='btnCheckout'>Finalizar compra</button></div>":""}
      </div>
  `;
  modal.classList.add("modal");
  productDetailSection.appendChild(modal);
  productDetailSection.style.display = "flex";
}

function addOneById(id) {
  const productToAdd = products.find((p) => p.id === id);
  if (productToAdd) {
    cart.push(productToAdd);
    updateCartButton();
  saveCartToStorage();
  showCartModal();
  }
}

function removeOneById(id) {
  const idx = cart.findIndex((p) => p.id === id);
  if (idx > -1) {
    cart.splice(idx, 1);
    updateCartButton();
  saveCartToStorage();
  showCartModal();
  }
}

function removeAllById(id) {
  cart = cart.filter((p) => p.id !== id);
  updateCartButton();
  saveCartToStorage();
  showCartModal();
}

productDetailSection.addEventListener("click", (e) => {
  const target = e.target;
  if (target.matches(".btnAddOne")) {
    const id = parseInt(target.dataset.id, 10);
    addOneById(id);
  } else if (target.matches(".btnRemoveOne")) {
    const id = parseInt(target.dataset.id, 10);
    removeOneById(id);
  } else if (target.matches(".btnRemoveAll")) {
    const id = parseInt(target.dataset.id, 10);
    removeAllById(id);
  } else if (target.matches('.btnClearCart')) {
    clearCart();
  } else if (target.matches('.btnCheckout')) {
    checkoutCart();
  } else if (target.classList.contains("closeButton")) {
    closeModal();
  }
});



function closeModal() {
  productDetailSection.style.display = "none";
  productDetailSection.innerHTML = "";
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("closeButton")) {
    closeModal();
  }
});

productDetailSection.addEventListener("focusout", (e) => {
  closeModal();
});

document.addEventListener("mousedown", (event) => {
  if (productDetailSection && !productDetailSection.contains(event.target)) {
    closeModal();
  }
});

cartButton.addEventListener("click", showCartModal);

cart = loadCartFromStorage();
updateCartButton();
getProducts().then(() => renderProducts(products));
