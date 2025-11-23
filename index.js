const galleryList = document.querySelector(".galleryList");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("q");
const galleryItem = document.querySelector(".galleryItem");
const productDetailSection = document.getElementById("productDetailSection");
const cartButton = document.getElementById("cartButton");
const APIURL = "https://fakestoreapi.com/products";

let products = [];
let selectedProduct = null;
let cart = [];

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
    cart.push(product);
    console.log("cart", cart);
    updateCartButton();
    closeModal();
  });
}

function showCartModal() {
  closeModal();

  const groupedItems = groupCartItems(cart);
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
                  <p>Cantidad: ${item.quantity}</p>
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
    </div>
  `;
  modal.classList.add("modal");
  productDetailSection.appendChild(modal);
  productDetailSection.style.display = "flex";
}

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

updateCartButton();
getProducts().then(() => renderProducts(products));
