// Estado del carrito
let cartState = {
    items: [],
    subtotal: 0,
    shipping: 0,
    giftWrap: false,
    discount: 0,
    total: 0
    
};

// Elementos del DOM
const productsContainer = document.getElementById('products-container');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const giftCostElement = document.getElementById('gift-cost');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');
const giftWrapCheckbox = document.getElementById('gift-wrap');

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    setupEventListeners();
    
});

// Función para aplicar cupón
function applyCoupon() {
    const couponInput = document.querySelector('.coupon-input input');
    const couponCode = couponInput.value.trim();
    const couponApplied = document.querySelector('.coupon-applied');
    
    if (!couponCode) {
        Swal.fire({
            title: 'Código vacío',
            text: 'Por favor ingresa un código de cupón',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            background: '#F8F3EB',
            color: '#2B1E14'
        });
        return;
    }
    
    // validación de cupón
    const validCoupons = {
        
    };
    
    const coupon = validCoupons[couponCode];
    
    if (coupon) {
        if (coupon.shipping) {
            cartState.shipping = 0;
            document.querySelector('.line.shipping .line-value').innerHTML = 
                '<span class="free-shipping">Gratis</span> <span class="express-shipping">EXPRESS</span>';
        } else {
            cartState.discount = cartState.subtotal * coupon.discount;
        }
        
        calculateTotals();
        
        // Mostrar cupón aplicado
        couponApplied.innerHTML = `
            <div class="coupon-success">
                <i class="fa-solid fa-check-circle"></i>
                <span>${coupon.name} aplicado</span>
            </div>
            <button class="remove-coupon" onclick="removeCoupon()">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        couponApplied.classList.add('show');
        
        // Ocultar input
        document.getElementById('couponInput').classList.remove('show');
        
        Swal.fire({
            title: '¡Cupón aplicado!',
            text: `Has activado: ${coupon.name}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: '#F8F3EB',
            color: '#2B1E14'
        });
        
    } else {
        Swal.fire({
            title: 'Cupón inválido',
            text: 'El código ingresado no es válido o ha expirado',
            icon: 'error',
            confirmButtonText: 'Intentar otro',
            background: '#F8F3EB',
            color: '#2B1E14'
        });
    }
    
    couponInput.value = '';
}

// Función para remover cupón
function removeCoupon() {
    cartState.discount = 0;
    cartState.shipping = 10; // Reestablecer envío por defecto
    calculateTotals();
    
    document.querySelector('.coupon-applied').classList.remove('show');
    document.querySelector('.line.shipping .line-value').textContent = '$10.00';
}

// Función para toggle cupón
function toggleCoupon() {
    const couponInput = document.getElementById('couponInput');
    couponInput.classList.toggle('show');

    if (couponInput.classList.contains('show')) {
        couponInput.querySelector('input').focus();
    }
}


// Función para calcular totales
function calculateTotals() {
    // Subtotal
    cartState.subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Envío 
    if (cartState.shipping !== 0) {
        cartState.shipping = cartState.subtotal > 100 ? 0 : 10; // Envío gratis sobre $100 (usado para simular - implementar los envios por paises)
    }
    
    // Envoltura de regalo
    const giftCost = cartState.giftWrap ? 20 : 0;
    
    // Total
    cartState.total = cartState.subtotal + cartState.shipping + giftCost - cartState.discount;
    
    updateTotalDisplay();
    updateCartBadge();
}

// Función para mostrar totales
function updateTotalDisplay() {
    subtotalElement.textContent = `$${cartState.subtotal.toFixed(2)}`;
    
    // Envío
    if (cartState.shipping === 0) {
        shippingElement.innerHTML = '<span class="free-shipping">Gratis</span>';
    } else {
        shippingElement.textContent = `$${cartState.shipping.toFixed(2)}`;
    }
    
    // Envoltura
    giftCostElement.textContent = cartState.giftWrap ? `$${20.00.toFixed(2)}` : '$0.00';
    
    // Descuento
    if (cartState.discount > 0) {
        discountElement.innerHTML = `-$${cartState.discount.toFixed(2)} <span class="savings-badge">Ahorro</span>`;
    } else {
        discountElement.textContent = '$0.00';
    }
    
    // Total
    totalElement.textContent = `$${cartState.total.toFixed(2)}`;
    
    // Animación del botón de pago si hay productos
    const payButton = document.querySelector('.btn-next');
    if (cartState.items.length > 0 && cartState.total > 0) {
        payButton.classList.add('pulse');
    } else {
        payButton.classList.remove('pulse');
    }
}

// Cargar carrito (simulando datos de API - implementar)
function loadCart() {
    // Remplazar con llamada a la API real
    const mockProducts = [
        {
            id: 1,
            name: "Guitarra Acústica Fender",
            price: 450.00,
            quantity: 1,
            image: "/IMAGES/TiredCat_No-bg.png",
            category: "Instrumentos"
        },
        {
            id: 2,
            name: "Vinilo - The Beatles Abbey Road",
            price: 75.00,
            quantity: 2,
            image: "/IMAGES/TiredCat_No-bg.png",
            category: "Discos"
        },
        {
            id: 3,
            name: "Vinilo - The Beatles Abbey Road",
            price: 75.00,
            quantity: 2,
            image: "/IMAGES/TiredCat_No-bg.png",
            category: "Discos"
        }
    ];
    
    cartState.items = mockProducts;
    updateCartDisplay();
    calculateTotals();
    updateCartBadge();
}

// Configurar event listeners
function setupEventListeners() {
    // Envoltura de regalo
    if (giftWrapCheckbox) {
        giftWrapCheckbox.addEventListener('change', function() {
            cartState.giftWrap = this.checked;
            calculateTotals();
        });
    }
    
    // Cupón
    const applyCouponBtn = document.querySelector('.btn-apply');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
}

// En tu cart_script.js - función updateCartDisplay actualizada
function updateCartDisplay() {
    if (cartState.items.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Tu carrito está vacío</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">Agrega algunos productos musicales</p>
                <a href="/PAGES/catalogo.html" class="btn">
                    <i class="fa-solid fa-guitar"></i>
                    Explorar Catálogo
                </a>
            </div>
        `;
        return;
    }
    
    // Agregar contador de productos
    const cartSummary = `
        <div class="cart-summary">
            <div class="product-count">
                ${cartState.items.length} producto${cartState.items.length > 1 ? 's' : ''} en el carrito
            </div>
        </div>
    `;
    
    productsContainer.innerHTML = cartSummary + cartState.items.map(item => {
        const subtotal = item.price * item.quantity;
        const stockStatus = item.quantity > 2 ? 'stock-available' : 'stock-low';
        const stockText = item.quantity > 2 ? 'En stock' : 'Stock bajo';
        
        return `
        <div class="product-item" data-id="${item.id}">
            ${item.onSale ? '<span class="product-badge">Oferta</span>' : ''}
            
            <img src="${item.image}" alt="${item.name}">
            
            <div class="product-info">
                <strong>${item.name}</strong>
                <span class="product-category">${item.category}</span>
                <div class="product-price">$${item.price.toFixed(2)}</div>
                
                <div class="product-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" title="Reducir cantidad">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" title="Aumentar cantidad">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                
                <div class="product-subtotal">
                    Subtotal: $${subtotal.toFixed(2)}
                </div>
                
            </div>
            
            <div class="product-actions">
                <button class="wishlist-btn" onclick="moveToWishlist(${item.id})" title="Mover a favoritos">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Eliminar producto">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Nueva función para mover a favoritos
function moveToWishlist(productId) {
    const item = cartState.items.find(item => item.id === productId);
    if (item) {
        Swal.fire({
            title: '¿Mover a favoritos?',
            text: `¿Quieres mover "${item.name}" a tu lista de deseos?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, mover',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí implementar la lógica para mover a favoritos
                removeFromCart(productId);
                Swal.fire({
                    title: '¡Movido!',
                    text: 'Producto agregado a favoritos',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }
}

// Función de eliminación con animación
function removeFromCart(productId) {
    const itemElement = document.querySelector(`.product-item[data-id="${productId}"]`);
    if (itemElement) {
        itemElement.classList.add('removing');
        setTimeout(() => {
            cartState.items = cartState.items.filter(item => item.id !== productId);
            updateCartDisplay();
            calculateTotals();
            updateCartBadge();
        }, 500);
    }
}



// Actualizar cantidad
function updateQuantity(productId, change) {
    const item = cartState.items.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            calculateTotals();
            updateCartBadge();
        }
    }
}


function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

    // Si no hay productos, ocultar el badge
    if (totalItems === 0) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'inline-block';
        badge.textContent = totalItems;
    }
}


function validateCartBeforePayment() {
    if (cartState.items.length === 0) {
        Swal.fire({
                title: '¡Carrito vacío!',
                text: 'Agrega productos al carrito antes de pagar.',
                icon: 'warning',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#8B5E3C',
                background: '#F8F3EB',
                color: '#2B1E14',
                customClass: {
                    popup: 'custom-swal-popup'
                }
            });
        return false;
    }
    return true;
}

// Agregar event listener al botón de pagar
document.addEventListener('DOMContentLoaded', function() {
    const payButton = document.querySelector('.btn-next[href="/PAGES/generalPayment.html"]');
    if (payButton) {
        payButton.addEventListener('click', function(e) {
            if (!validateCartBeforePayment()) {
                e.preventDefault(); // Prevenir la redirección
            }
        });
    }
});

// Función para mostrar la notificación
    function showCopyNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `copy-notification ${type}`;
        notification.innerHTML = `
            <i class="fa-solid fa-${type === 'success' ? 'check' : 'xmark'}"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }




// Exportar para uso global
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.applyCoupon = applyCoupon;
window.toggleCoupon = toggleCoupon;
window.goToPayment = goToPayment;



