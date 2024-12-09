const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('input[type="text"]');


let cart = JSON.parse(localStorage.getItem('cart')) || [];


function updateCartCount() {

    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = count;
}


function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}


function displayCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>السلة فارغة.</p>';
        document.querySelector('.cart-total').style.display = 'none';
        return;
    }

    document.querySelector('.cart-total').style.display = 'block';

    cart.forEach((item, index) => {
        total += item.discountedPrice * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>السعر: ${item.discountedPrice}$</p>
                <p>الكمية: ${item.quantity}</p>
            </div>
            <button class="remove-item" data-index="${index}">إزالة</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);


    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItem);
    });
}


function removeItem(e) {
    const index = e.target.getAttribute('data-index');
    cart.splice(index, 1);
    saveCart();
    displayCart();
}


cartButton.addEventListener('click', () => {
    displayCart();
    cartModal.style.display = 'block';
});


closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});


window.addEventListener('click', (e) => {
    if (e.target == cartModal) {
        cartModal.style.display = 'none';
    }
});

const addToCartButtons = document.querySelectorAll(' button ');

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

function addToCart(e) {

    let productElement = e.target.closest('.product') || e.target.closest('.book-item');


    const imgSrc = productElement.querySelector('img').src;
    const title = productElement.querySelector('h3, .book-title').textContent;
    const discountedPriceText = productElement.querySelector('.discounted-price').textContent;
    const discountedPrice = parseFloat(discountedPriceText.replace('$', ''));

   
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
  
        const cartItem = {
            imgSrc,
            title,
            discountedPrice,
            quantity: 1
        };
 
        cart.push(cartItem);
    }

    saveCart();
    alert('تم إضافة الكتاب إلى السلة!');
}


searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    filterProducts(query);
});


searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim().toLowerCase();
    filterProducts(query);
});


function filterProducts(query) {
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const title = product.querySelector('h3, .book-title').textContent.toLowerCase();
        const category = product.querySelector('.category').textContent.toLowerCase();

        if (title.includes(query) || category.includes(query)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

checkoutButton.addEventListener('click', () => {
    window.location.href = 'checkout.html';
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

function displayCheckoutCart() {
    const checkoutCartItems = document.getElementById('checkout-cart-items');
    const checkoutCartTotal = document.getElementById('checkout-cart-total');

    if (!checkoutCartItems) return; 

    checkoutCartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        checkoutCartItems.innerHTML = '<p>السلة فارغة.</p>';
        document.querySelector('.cart-summary .cart-total').style.display = 'none';
        return;
    }

    document.querySelector('.cart-summary .cart-total').style.display = 'block';

    cart.forEach((item, index) => {
        total += item.discountedPrice * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>السعر: ${item.discountedPrice}$</p>
                <p>الكمية: ${item.quantity}</p>
            </div>
        `;
        checkoutCartItems.appendChild(cartItem);
    });

    checkoutCartTotal.textContent = total.toFixed(2);
}

const checkoutForm = document.getElementById('checkout-form');

if (checkoutForm) {
    document.addEventListener('DOMContentLoaded', displayCheckoutCart);

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiry = document.getElementById('expiry').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (name && email && address && cardNumber.length === 16 && expiry.length === 5 && cvv.length === 3) {
            alert('تم إتمام عملية الدفع بنجاح! شكراً لتسوقك معنا.');
            cart = [];
            saveCart();
            window.location.href = 'index.html';
        } else {
            alert('يرجى ملء جميع الحقول بشكل صحيح.');
        }
    });
}