// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        document.querySelector('nav').classList.remove('active');
    });
});

// Product Modal Functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.querySelector('.close-modal');
const modalProductName = document.getElementById('modalProductName');
const modalProductPrice = document.getElementById('modalProductPrice');
const paymentMethods = document.querySelectorAll('.payment-method');
const paymentForm = document.getElementById('paymentForm');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.getAttribute('data-product');
        const productPrice = this.getAttribute('data-price');
        
        modalProductName.textContent = productName;
        modalProductPrice.textContent = `$${productPrice}`;
        
        paymentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', function() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(e) {
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
        paymentMethods.forEach(m => m.classList.remove('active'));
        this.classList.add('active');
    });
});

paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Here you would typically process the payment
    // For this demo, we'll just show an alert
    alert('Thank you for your purchase! Your order has been placed.');
    
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    this.reset();
    
    // Remove active class from payment methods
    paymentMethods.forEach(m => m.classList.remove('active'));
});

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    alert(`Thank you for subscribing with ${emailInput.value}! You'll receive our beauty tips soon.`);
    emailInput.value = '';
});

// Format Card Number Input
const cardNumberInput = document.getElementById('cardNumber');
cardNumberInput.addEventListener('input', function() {
    let value = this.value.replace(/\s+/g, '');
    if (value.length > 0) {
        value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    this.value = value;
});

// Format Expiry Date Input
const expiryDateInput = document.getElementById('expiryDate');
expiryDateInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.value = value;
});
