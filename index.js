const galleryList = document.querySelector(".galleryList");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("q");
const APIURL = "https://fakestoreapi.com/products";

let products = [];
let selectedProduct = null;

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

getProducts().then(() => renderProducts(products));
