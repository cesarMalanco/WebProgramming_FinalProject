// Datos de productos de ejemplo
        const products = [
            {
                id: 1,
                name: "Guitarra Eléctrica Gibson Les Paul",
                description: "Guitarra eléctrica de cuerpo sólido con pastillas humbucker, ideal para rock y blues.",
                price: 1200.00,
                category: "instrumentos",
                image: "/IMAGES/TiredCat_No-bg.png",
                stock: 3,
                featured: true
            },
            {
                id: 2,
                name: "Vinilo - Pink Floyd The Dark Side of the Moon",
                description: "Edición especial en vinilo del álbum clásico de Pink Floyd, remasterizado.",
                price: 85.00,
                category: "discos",
                image: "/IMAGES/TiredCat_No-bg.png",
                stock: 10,
                featured: false
            },
            {
                id: 3,
                name: "Amplificador Marshall 100W",
                description: "Amplificador de guitarra con sonido característico Marshall, perfecto para conciertos.",
                price: 450.00,
                category: "instrumentos",
                image: "/IMAGES/TiredCat_No-bg.png",
                stock: 0,
                featured: false
            },
            {
                id: 4,
                name: "Batería Acústica Pearl",
                description: "Set de batería acústica profesional de 5 piezas, ideal para estudios y presentaciones en vivo.",
                price: 800.00,
                category: "instrumentos",
                image: "/IMAGES/TiredCat_No-bg.png",
                stock: 2,
                featured: true
            },
            {
                id: 5,
                name: "Álbum - The Beatles Abbey Road",
                description: "Edición de lujo del icónico álbum de The Beatles con fotos exclusivas y material adicional.",
                price: 65.00,
                category: "albumes",
                image: "/IMAGES/TiredCat_No-bg.png",
                stock: 15,
                featured: false
            },
            {
                id: 6,
                name: "Vinilo - Queen A Night at the Opera",
                description: "Vinilo de edición limitada del álbum clásico de Queen, incluye el éxito Bohemian Rhapsody.",
                price: 75.00,
                category: "discos",
                image: "/IMAGES/TiredCat_No-bg.png",
                stock: 8,
                featured: true
            },
            {
                id: 7,
                name: "Teclado Digital Yamaha",
                description: "Teclado digital de 88 teclas con sonidos realistas y funciones de grabación.",
                price: 600.00,
                category: "instrumentos",
                image: "/IMAGES/TiredCat_No-bg.png",
                stock: 5,
                featured: false
            },
            {
                id: 8,
                name: "Álbum - Michael Jackson Thriller",
                description: "Edición especial del álbum más vendido de todos los tiempos, conmemorativa.",
                price: 55.00,
                category: "albumes",
                image: "/IMAGES/TiredCat_No-bg.png",
                stock: 12,
                featured: false
            }
        ];

        // Estado del catálogo
        let catalogState = {
            products: products,
            filteredProducts: products,
            currentFilter: 'all'
        };

        // Elementos del DOM
        const productsGrid = document.getElementById('products-grid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const wishlistBadge = document.getElementById('wishlist-badge');

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            renderProducts();
            setupEventListeners();
            updateWishlistBadge();
        });

        // Renderizar productos
        function renderProducts() {
            if (catalogState.filteredProducts.length === 0) {
                productsGrid.innerHTML = `
                    <div class="empty-catalog-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                        <i class="fa-solid fa-music" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--text-muted); margin-bottom: 15px;">No hay productos en esta categoría</h3>
                        <p style="color: var(--text-light);">Prueba con otra categoría o vuelve más tarde.</p>
                    </div>
                `;
                return;
            }

            productsGrid.innerHTML = catalogState.filteredProducts.map(product => {
                const stockStatus = getStockStatus(product.stock);
                const stockText = getStockText(product.stock);
                const isOutOfStock = product.stock === 0;
                
                return `
                <div class="product-card" data-category="${product.category}">
                    ${product.featured ? '<span class="product-badge">Destacado</span>' : ''}
                    <img src="${product.image}" alt="${product.name}" class="product-image"
                         onerror="this.src='https://via.placeholder.com/300x200/F8F3EB/8B5E3C?text=🎵'">
                    <div class="product-info">

                        <div class="product-top">
                            <div class="product-category">${formatCategory(product.category)}</div>
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                        </div>

                        <div class="product-bottom">
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <div class="product-stock ${stockStatus}">
                                <i class="fa-solid ${isOutOfStock ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
                                ${stockText}
                            </div>
                            <div class="product-actions">
                                <button class="btn btn-primary" onclick="addToCart(${product.id})" 
                                    ${isOutOfStock ? 'disabled' : ''}>
                                    <i class="fa-solid fa-cart-plus"></i>
                                    ${isOutOfStock ? 'Agotado' : 'Agregar'}
                                </button>
                                <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">
                                    <i class="fa-regular fa-heart"></i>
                                    Favorito
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
                `;
            }).join('');
        }

        // Configurar event listeners
        function setupEventListeners() {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    // Actualizar botones activos
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Aplicar filtro
                    applyFilter(filter);
                });
            });
        }

        // Aplicar filtro
        function applyFilter(filter) {
            catalogState.currentFilter = filter;
            
            if (filter === 'all') {
                catalogState.filteredProducts = catalogState.products;
            } else {
                catalogState.filteredProducts = catalogState.products.filter(
                    product => product.category === filter
                );
            }
            
            renderProducts();
        }

        // Funciones auxiliares
        function getStockStatus(stock) {
            if (stock === 0) return 'stock-out';
            if (stock <= 2) return 'stock-low';
            return 'stock-available';
        }

        function getStockText(stock) {
            if (stock === 0) return 'Agotado';
            if (stock <= 2) return `Últimas ${stock} unidades`;
            return 'Disponible';
        }

        function formatCategory(category) {
            const categories = {
                'instrumentos': 'Instrumento',
                'albumes': 'Álbum',
                'discos': 'Disco de Vinilo'
            };
            return categories[category] || category;
        }

        // Funciones de interacción
        function addToCart(productId) {
            const product = catalogState.products.find(p => p.id === productId);
            if (product) {
                // Aquí implementar la lógica para agregar al carrito
                Swal.fire({
                    title: '¡Producto agregado!',
                    text: `Mira tus producto en la página del carrito`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#F8F3EB',
                    color: '#2B1E14'
                });
                
                // Actualizar badge del carrito
                updateCartBadge();
            }
        }

        function addToWishlist(productId) {
            const product = catalogState.products.find(p => p.id === productId);
            if (product) {
                // Aquí implementar la lógica para agregar a la wishlist
                Swal.fire({
                    title: '¡Producto agregado a Favoritas!',
                    text: `Mira tus producto en la Wishlist`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#F8F3EB',
                    color: '#2B1E14'
                });
                
                // Actualizar badge de la wishlist
                updateWishlistBadge();
            }
        }

        function updateWishlistBadge() {
            if (!wishlistBadge) return;
            
            // Simular incremento ( estado de la aplicación)
            const currentCount = parseInt(wishlistBadge.textContent) || 0;
            wishlistBadge.textContent = currentCount + 1;
            wishlistBadge.style.display = 'inline-block';
        }

        function updateCartBadge() {
            const cartBadge = document.getElementById('cart-badge');
            if (!cartBadge) return;
            
            // Simular incremento ( estado de la aplicación)
            const currentCount = parseInt(cartBadge.textContent) || 0;
            cartBadge.textContent = currentCount + 1;
            cartBadge.style.display = 'inline-block';
        }

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

// Hacer funciones globales para los onclick
    window.addToCart = addToCart;
    window.addToWishlist = addToWishlist;