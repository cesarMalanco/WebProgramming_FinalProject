// ===== CONFIGURACIÓN Y ESTADO GLOBAL =====
// Guarda el estado de la página actual y configuración
const AppState = {
    currentPage: 'dashboard',
    pages: {
        dashboard: {
            title: 'Dashboard',
            desc: 'Bienvenido al panel de administración'
        },
        agregar: {
            title: 'Agregar Producto',
            desc: 'Añade nuevos productos al catálogo'
        },
        actualizar: {
            title: 'Actualizar Producto',
            desc: 'Modifica información de productos existentes'
        },
        eliminar: {
            title: 'Eliminar Producto',
            desc: 'Gestiona la eliminación de productos'
        },
        clientes: {
            title: 'Gestión de Clientes',
            desc: 'Administra la información de clientes'
        },
        pedidos: {
            title: 'Gestión de Pedidos',
            desc: 'Revisa y gestiona los pedidos'
        }
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboardData();
    setupImageUpload();
});

// ===== FUNCIONES PRINCIPALES =====
function initializeApp() {
    // Mostrar la página actual
    showPage('dashboard');
    
    // Configurar formularios
    setupForms();
}

function setupEventListeners() {
    // Navegación del sidebar
    const menuItems = document.querySelectorAll('.menu-item[data-page]');
    menuItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Formulario de agregar producto
    const addForm = document.getElementById('add-product-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddProduct);
    }

    // Búsqueda de productos
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearchProduct);
    }
}

function setupImageUpload() {
    const imageInput = document.getElementById('product-image');
    const uploadBox = document.getElementById('image-upload-box');
    const previewImg = document.getElementById('image-preview');

    // Abrir selector al hacer clic en la caja
    if (uploadBox) {
        uploadBox.addEventListener('click', () => {
            imageInput.click();
        });
    }

    // Cambiar vista previa cuando seleccionan imagen
    if (imageInput) {
        imageInput.addEventListener('change', () => {
            const file = imageInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                previewImg.src = reader.result;
                previewImg.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        });
    }
}

function handleNavigation(event) {
    const menuItem = event.currentTarget;
    const page = menuItem.dataset.page;
    
    if (page === 'logout') {
        handleLogout();
        return;
    }
    
    showPage(page);
    updateActiveMenu(menuItem);
}

// ===== NAVEGACIÓN DE PÁGINAS =====
function showPage(page) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`${page}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Actualiza el encabezado
    updateHeader(page);
    
    // Cargar datos de la página en la que se está
    loadPageData(page);
    
    // Actualizar estado
    AppState.currentPage = page;
}

// ===== ACTUALIZACIÓN DE INTERFAZ =====
function updateActiveMenu(activeItem) {
    // Remover clase active de todos los items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al item seleccionado
    activeItem.classList.add('active');
}

// Actualiza el título y descripción del encabezado
function updateHeader(page) {
    const pageInfo = AppState.pages[page];
    if (pageInfo) {
        document.getElementById('page-title').textContent = pageInfo.title;
        document.getElementById('page-desc').textContent = pageInfo.desc;
    }
}

// ===== FUNCIONES DE DATOS =====
function loadDashboardData() {
    // Lógica de carga de datos (back)
}

function updateDashboardStats(data) {
    // Actualizar estadísticas en el dashboard (con datos del back)
}

// Cargar datos específicos para cada página
function loadPageData(page) {
    switch(page) {
        case 'agregar':
            // Resetear formulario
            const addForm = document.getElementById('add-product-form');
            if (addForm) addForm.reset();
            // Limpiar vista previa de imagen
            const previewImg = document.getElementById('image-preview');
            if (previewImg) {
                previewImg.classList.add('hidden');
                previewImg.src = '';
            }
            break;
        case 'actualizar':
            // Limpiar búsqueda
            const searchInput = document.getElementById('search-product');
            if (searchInput) searchInput.value = '';
            break;
        case 'eliminar':
            loadProductsForDeletion();
            break;
    }
}

// ===== MANEJO DE FORMULARIOS =====
function setupForms() {
    // Validación en tiempo real para formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showInputError(input, 'Este campo es obligatorio');
            isValid = false;
        } else {
            clearInputError(input);
        }
    });
    
    return isValid;
}

function showInputError(input, message) {
    clearInputError(input);
    input.style.borderColor = 'var(--accent)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.style.color = 'var(--accent)';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function clearInputError(input) {
    input.style.borderColor = '';
    const existingError = input.parentNode.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
}

// ===== MANEJO DE PRODUCTOS =====
function handleAddProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const productData = Object.fromEntries(formData);
    
    // Validación adicional
    if (!validateProductData(productData)) {
        return;
    }
    
    // Envío de datos al backend (pendiente)


    
    // Mostrar feedback
    showNotification('Producto agregado correctamente', 'success');
    
    // Resetear formulario
    form.reset();
    
    // Limpiar vista previa de imagen
    const previewImg = document.getElementById('image-preview');
    if (previewImg) {
        previewImg.classList.add('hidden');
        previewImg.src = '';
    }
}

function validateProductData(data) {
    if (parseFloat(data.price) <= 0) {
        showNotification('El precio debe ser mayor a 0', 'error');
        return false;
    }
    
    if (parseInt(data.stock) < 0) {
        showNotification('El stock no puede ser negativo', 'error');
        return false;
    }
    
    return true;
}

function handleSearchProduct() {
    const searchTerm = document.getElementById('search-product').value.trim();
    
    if (!searchTerm) {
        showNotification('Ingresa un término de búsqueda', 'warning');
        return;
    }
    
    // Lógica de búsqueda (back)
}


// seccion para actualizar productos (con base de datos y back)


function loadProductsForDeletion() {
    // Lógica de carga de productos (back)
    
    
}

function displayProductsForDeletion(products) {
    const container = document.getElementById('delete-products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="no-data">No hay productos para mostrar</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <span class="product-name">${product.name}</span>
            <span class="product-price">$${product.price}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                <i class="fa-solid fa-trash"></i> Eliminar
            </button>
        </div>
    `).join('');
}

function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
        return;
    }
    
    // Lógica de eliminación (back)
    showNotification('Producto eliminado correctamente', 'success');
    
    // Actualizar estadísticas
    updateProductCount(-1);
}

function updateProductCount(change) {
    const currentCount = parseInt(document.getElementById('total-products').textContent);
    document.getElementById('total-products').textContent = Math.max(0, currentCount + change);
}

// ===== UTILIDADES =====
function handleLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Simular logout
        showNotification('Sesión cerrada correctamente', 'info');
        
        // Redireccionar (simulado)
        setTimeout(() => {
            window.location.href = '/FRONTEND/PAGES/login.html';
        }, 1000);
    }
}

function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Estilos básicos para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px',
        boxShadow: 'var(--shadow)'
    });
    
    // Colores según el tipo
    const colors = {
        success: 'var(--primary)',
        error: 'var(--accent)',
        warning: 'var(--vibrant-3)',
        info: 'var(--primary-light)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // quitar después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== ESTILOS ADICIONALES DINÁMICOS =====
const dynamicStyles = `
    .product-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: var(--bg-light);
        border-radius: 10px;
        margin-bottom: 10px;
    }
    
    .btn-sm {
        padding: 8px 16px;
        font-size: 12px;
    }
    
    .no-data {
        text-align: center;
        color: var(--text-muted);
        font-style: italic;
        padding: 20px;
    }
    
    .input-error {
        color: var(--accent) !important;
        font-size: 12px !important;
        margin-top: 5px !important;
    }
`;

// Injectar estilos dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);