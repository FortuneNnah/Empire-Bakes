//  header scroll/glass effect
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const htmlEl = document.documentElement;
  const navLinks = document.querySelector(".navlinks");
  const menuIcon = navToggle.querySelector("i");

  // Toggle nav
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));

    htmlEl.classList.toggle("nav-open"); // CSS overlay

    // toggle icon
    if (menuIcon) {
      menuIcon.classList.toggle("fa-bars");
      menuIcon.classList.toggle("fa-xmark");
    }
  });

  // Close nav when clicking a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      htmlEl.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      if (menuIcon) {
        menuIcon.classList.add("fa-bars");
        menuIcon.classList.remove("fa-xmark");
      }
    });
  });

  // Close nav when clicking outside
  document.addEventListener("click", (e) => {
    if (!htmlEl.classList.contains("nav-open")) return;

    if (!e.target.closest("header")) {
      htmlEl.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      if (menuIcon) {
        menuIcon.classList.add("fa-bars");
        menuIcon.classList.remove("fa-xmark");
      }
    }
  });
});

// Toast & cart logic
const toast = document.getElementById("toastContainer");
const cartCountEl = document.getElementById("cartCount");
let count = Number(cartCountEl?.textContent || 0);

function showToast(message = "Item added to cart") {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

// Attach handler to all add buttons
document.querySelectorAll(".addbtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    count += 1;
    if (cartCountEl) cartCountEl.textContent = count;
    showToast("Added to cart ✔");
  });
});

// Cart open/close
const cartIcon = document.querySelector("#cartIcon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const addCartButtons = document.querySelectorAll(".addbtn");
addCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const productCard = event.target.closest(".product-card");
    addToCart(productCard);
  });
});

const cartContent = document.querySelector(".cart-content");
const addToCart = (productCard) => {
  const productImgSrc = productCard.querySelector("img").src;
  const productTItle = productCard.querySelector(".product-title").textContent;
  const productPrice = productCard.querySelector(".price").textContent;

  const cartItems = cartContent.querySelectorAll(".cart-product-title");
  for (let item of cartItems) {
    if (item.textContent === productTItle) {
      showToast("Item already in cart");
      return;
    }
  }

  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");
  cartBox.innerHTML = `
  <img src="${productImgSrc}" class="cart-img">
        <div class="cart-detail">
          <h2 class="cart-product-title">${productTItle}</h2>
          <span class="cart-price">${productPrice}</span>
          <div class="cart-quantity">
            <button id="decrement">-</button>
            <span class="number">1</span>
            <button id="increment">+</button>
          </div>
        </div>
        <i class="fa-solid fa-trash cart-delete"></i>
        `;

  cartContent.appendChild(cartBox);

  cartBox.querySelector(".cart-delete").addEventListener("click", () => {
    cartBox.remove();

    updateCartCount(-1);

    updateTotalprice();
  });

  cartBox.querySelector(".cart-quantity").addEventListener("click", (event) => {
    const numberElement = cartBox.querySelector(".number");
    const decrementButton = cartBox.querySelector("#decrement");
    let quantity = numberElement.textContent;

    if(event.target.id === "decrement" && quantity > 1){
      quantity --;
      if(quantity === 1){
        decrementButton.style.color = "#333"
      }
    } else if(event.target.id === "increment"){
      quantity++;
      decrementButton.style.color = "#999"
    }

    numberElement.textContent = quantity;

    updateTotalprice();
  });

  updateCartCount(1);

  updateTotalprice();
};


const updateTotalprice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const cartBoxes = document.querySelectorAll(".cart-box");
  let total = 0;
  cartBoxes.forEach(cartBox => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");
     const priceText = priceElement.textContent;
    const cleanPrice = parseFloat(priceText.replace(/[^0-9.]/g, "")); 
    const quantity = parseInt(quantityElement.textContent) || 0;
    total += cleanPrice * quantity;
  });

  // Format and display total price with ₦
  totalPriceElement.textContent = `₦${total.toLocaleString()}`;

  return total;
};

// cartItemCountBadge
let cartItemCount = 0;
const updateCartCount = change => {
  const cartItemCountBadge = document.querySelector(".cart-item-count");
  cartItemCount += change;
  if(cartItemCount > 0){
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
  } else{
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = "";
  }
}
;
const buyNowBtn = document.querySelector(".btn-buy");

buyNowBtn.addEventListener("click", function(){
  let email = "fortunenotes667@gmail.com";
  let total = updateTotalprice();
  let amount = total * 100;
  let publickey = "pk_test_cbba5486e1ca1b618c729fc73caec9a9c05fe81a";

console.log("Returned total:", total);

  let handler = PaystackPop.setup({
    key: publickey,
    email: email,
    amount: amount,
    currency: "NGN",
    ref: "PSK_" + Math.floor(Math.random() * 1000000000),
    callback: function(){
      showToast("Payment successful");
      console.log(response);
    },
    onclose: function(){
      showToast("Transaction Failed");
    }
  });
  handler.openIframe();
})