// Estado de la wishlist
let wishlistState = {
    items: []
};

// Elementos del DOM
const wishlistContainer = document.getElementById('wishlist-container');
const wishlistBadge = document.getElementById('wishlist-badge');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
    updateWishlistBadge();
});

// Cargar wishlist (simulando datos)
function loadWishlist() {
    // Datos de ejemplo - reemplazar con llamada a API 
    const mockWishlist = [
        {
            id: 1,
            name: "Guitarra Eléctrica Gibson Les Paul",
            price: 1200.00,
            image: "/IMAGES/TiredCat_No-bg.png",
            category: "Instrumentos",
            stock: 3,
            onSale: true
        },
        {
            id: 2,
            name: "Vinilo - Pink Floyd The Dark Side of the Moon",
            price: 85.00,
            image: "/IMAGES/TiredCat_No-bg.png",
            category: "Discos",
            stock: 10,
            onSale: false
        },
        {
            id: 3,
            name: "Amplificador Marshall 100W",
            price: 450.00,
            image: "/IMAGES/TiredCat_No-bg.png",
            category: "Equipos",
            stock: 0,
            onSale: true
        },
        {
            id: 4,
            name: "Batería Acústica Pearl",
            price: 800.00,
            image: "/IMAGES/TiredCat_No-bg.png",
            category: "Instrumentos",
            stock: 2,
            onSale: false
        }, 
        {
            id: 5,
            name: "Batería Acústica Pearl",
            price: 800.00,
            image: "/IMAGES/TiredCat_No-bg.png",
            category: "Instrumentos",
            stock: 9,
            onSale: false
        }, 
    ];
    
    wishlistState.items = mockWishlist;
    updateWishlistDisplay();
}

// Actualizar display de la wishlist
function updateWishlistDisplay() {
    if (wishlistState.items.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist-message">
                <i class="fa-solid fa-heart"></i>
                <p>Tu lista de deseos está vacía</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">Agrega productos que te gusten</p>
            </div>
        `;
        return;
    }
    
    // Agregar contador de productos
    const wishlistSummary = `
        <div class="wishlist-summary">
            <div class="wishlist-count">
                ${wishlistState.items.length} producto${wishlistState.items.length > 1 ? 's' : ''} en la lista de deseos
            </div>
        </div>
    `;
    
    wishlistContainer.innerHTML = wishlistSummary + wishlistState.items.map(item => {
        const stockStatus = getStockStatus(item.stock);
        const stockText = getStockText(item.stock);
        const isOutOfStock = item.stock === 0;
        
        return `
        <div class="wishlist-item ${isOutOfStock ? 'out-of-stock' : ''}" data-id="${item.id}">
            
            <img src="${item.image}" alt="${item.name}" 
                 onerror="this.src='https://via.placeholder.com/100x100/F8F3EB/8B5E3C?text=🎵'">
            
            <div class="wishlist-info">
                <strong>${item.name}</strong>
                <span class="wishlist-category">${item.category}</span>
                <div class="wishlist-price">$${item.price.toFixed(2)}</div>
                
                <span class="wishlist-stock ${stockStatus}">${stockText}</span>
                
                ${isOutOfStock ? '<div class="restock-notice">Próximamente disponible</div>' : ''}
            </div>
            
            <div class="wishlist-actions-item">
                <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${item.id})" 
                    ${isOutOfStock ? 'disabled' : ''} title="${isOutOfStock ? 'Producto agotado' : 'Agregar al carrito'}">
                    <i class="fa-solid fa-cart-plus"></i>
                    ${isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
                </button>
                <button class="remove-wishlist-btn" onclick="removeFromWishlist(${item.id})" title="Eliminar de la lista">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Función auxiliar para estado de stock
function getStockStatus(stock) {
    if (stock === 0) return 'stock-out';
    if (stock <= 2) return 'stock-low';
    return 'stock-available';
}

function getStockText(stock) {
    if (stock === 0) return 'Agotado';
    if (stock <= 2) return 'Últimas unidades';
    return 'Disponible';
}

// Agregar producto al carrito desde la wishlist
function addToCartFromWishlist(productId) {
    const item = wishlistState.items.find(item => item.id === productId);
    if (item) {
        // implementar la lógica para agregar al carrito
        Swal.fire({
            title: '¡Agregado al carrito!',
            text: `"${item.name}" ha sido agregado a tu carrito`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#F8F3EB',
            color: '#2B1E14'
        });
        
        // Animación de confirmación
        const itemElement = document.querySelector(`.wishlist-item[data-id="${productId}"]`);
        if (itemElement) {
            itemElement.classList.add('adding');
            setTimeout(() => {
                itemElement.classList.remove('adding');
            }, 600);
        }
    }
}

// Eliminar producto de la wishlist
function removeFromWishlist(productId) {
    const item = wishlistState.items.find(item => item.id === productId);
    
    Swal.fire({
        title: '¿Eliminar de la lista?',
        text: `¿Quieres eliminar "${item.name}" de tu lista de deseos?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#F8F3EB',
        color: '#2B1E14'
    }).then((result) => {
        if (result.isConfirmed) {
            const itemElement = document.querySelector(`.wishlist-item[data-id="${productId}"]`);
            if (itemElement) {
                itemElement.classList.add('removing');
                setTimeout(() => {
                    wishlistState.items = wishlistState.items.filter(item => item.id !== productId);
                    updateWishlistDisplay();
                    updateWishlistBadge();
                    
                    Swal.fire({
                        title: 'Eliminado',
                        text: 'Producto removido de tu lista de deseos',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        background: '#F8F3EB',
                        color: '#2B1E14'
                    });
                }, 500);
            }
        }
    });
}

// Limpiar toda la wishlist
function clearWishlist() {
    if (wishlistState.items.length === 0) {
        Swal.fire({
            title: 'Lista vacía',
            text: 'Tu lista de deseos ya está vacía',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false,
            background: '#F8F3EB',
            color: '#2B1E14'
        });
        return;
    }
    
    Swal.fire({
        title: '¿Limpiar lista completa?',
        text: `¿Estás seguro de que quieres eliminar todos los productos (${wishlistState.items.length}) de tu lista de deseos?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, limpiar todo',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        background: '#F8F3EB',
        color: '#2B1E14'
    }).then((result) => {
        if (result.isConfirmed) {
            wishlistState.items = [];
            updateWishlistDisplay();
            updateWishlistBadge();
            
            Swal.fire({
                title: '¡Lista limpiada!',
                text: 'Todos los productos han sido eliminados de tu lista de deseos',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#F8F3EB',
                color: '#2B1E14'
            });
        }
    });
}

// Agregar todos los productos disponibles al carrito
function addAllToCart() {
    const availableItems = wishlistState.items.filter(item => item.stock > 0);
    
    if (availableItems.length === 0) {
        Swal.fire({
            title: 'No hay productos disponibles',
            text: 'Todos los productos en tu lista están actualmente agotados',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
            background: '#F8F3EB',
            color: '#2B1E14'
        });
        return;
    }
    
    Swal.fire({
        title: '¿Agregar todo al carrito?',
        text: `¿Quieres agregar ${availableItems.length} producto${availableItems.length > 1 ? 's' : ''} disponibles a tu carrito?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar todo',
        cancelButtonText: 'Cancelar',
        background: '#F8F3EB',
        color: '#2B1E14'
    }).then((result) => {
        if (result.isConfirmed) {
            // implementar la lógica para agregar todos al carrito
            Swal.fire({
                title: '¡Productos agregados!',
                text: `${availableItems.length} producto${availableItems.length > 1 ? 's' : ''} agregado${availableItems.length > 1 ? 's' : ''} a tu carrito`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#F8F3EB',
                color: '#2B1E14'
            });
            
            // Animación para todos los items
            availableItems.forEach(item => {
                const itemElement = document.querySelector(`.wishlist-item[data-id="${item.id}"]`);
                if (itemElement) {
                    itemElement.classList.add('adding');
                    setTimeout(() => {
                        itemElement.classList.remove('adding');
                    }, 600);
                }
            });
        }
    });
}

// Actualizar badge de la wishlist
function updateWishlistBadge() {
    if (!wishlistBadge) return;

    const totalItems = wishlistState.items.length;

    if (totalItems === 0) {
        wishlistBadge.style.display = 'none';
    } else {
        wishlistBadge.style.display = 'inline-block';
        wishlistBadge.textContent = totalItems > 99 ? '99+' : totalItems.toString();
    }
}

// Función para agregar producto a la wishlist (desde otras páginas)
function addToWishlist(product) {
    // Verificar si el producto ya está en la wishlist
    const existingItem = wishlistState.items.find(item => item.id === product.id);
    
    if (existingItem) {
        Swal.fire({
            title: 'Ya en tu lista',
            text: 'Este producto ya está en tu lista de deseos',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false,
            background: '#F8F3EB',
            color: '#2B1E14'
        });
        return;
    }
    
    // Agregar producto a la wishlist
    wishlistState.items.push(product);
    updateWishlistBadge();
    
    Swal.fire({
        title: '¡Agregado a favoritos!',
        text: 'Producto agregado a tu lista de deseos',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#F8F3EB',
        color: '#2B1E14'
    });
}

// Exportar funciones para uso global
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.clearWishlist = clearWishlist;
window.addAllToCart = addAllToCart;
window.addToCartFromWishlist = addToCartFromWishlist;