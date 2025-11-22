// Conectar al servidor de websockets
const socket = io();

// Referencias a elementos del DOM
const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');
const emptyState = document.getElementById('emptyState');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const connectionStatus = document.getElementById('connectionStatus');

// Función para mostrar error
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Función para renderizar productos
function renderProducts(products) {
    if (products.length === 0) {
        productsList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    productsList.innerHTML = products.map(product => {
        let stockClass = 'stock-available';
        let stockIcon = '✓';
        
        if (product.stock === 0) {
            stockClass = 'stock-out';
            stockIcon = '✗';
        } else if (product.stock <= 10) {
            stockClass = 'stock-low';
            stockIcon = '⚠';
        }

        return `
            <div class="product-card" data-id="${product.id}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p><strong>Código:</strong> <span class="product-code">${product.code}</span></p>
                <p class="product-price">$${product.price}</p>
                <p><strong>Categoría:</strong> ${product.category}</p>
                <p>
                    <strong>Stock:</strong> 
                    <span class="product-stock ${stockClass}">${stockIcon} ${product.stock} unidades</span>
                </p>
                <p><strong>ID:</strong> ${product.id}</p>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">
                    Eliminar
                </button>
            </div>
        `;
    }).join('');
}

// Función para eliminar producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        socket.emit('deleteProduct', productId);
    }
}

// Event listener para el formulario
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        code: document.getElementById('code').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value.trim(),
        status: true,
        thumbnails: []
    };

    // Validaciones básicas
    if (!productData.title || !productData.description || !productData.code) {
        showError('Todos los campos obligatorios deben estar completos');
        return;
    }

    if (productData.price <= 0) {
        showError('El precio debe ser mayor a 0');
        return;
    }

    if (productData.stock < 0) {
        showError('El stock no puede ser negativo');
        return;
    }

    // Emitir evento para crear producto
    socket.emit('createProduct', productData);

    // Limpiar formulario
    productForm.reset();
});

// Escuchar eventos del servidor
socket.on('connect', () => {
    console.log('Conectado al servidor');
    connectionStatus.textContent = 'Conectado';
    connectionStatus.className = 'connected';
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
    connectionStatus.textContent = 'Desconectado';
    connectionStatus.className = 'disconnected';
});

socket.on('products', (products) => {
    console.log('Productos recibidos:', products.length);
    renderProducts(products);
});

socket.on('error', (message) => {
    console.error('Error:', message);
    showError(message);
});

// Hacer la función deleteProduct global
window.deleteProduct = deleteProduct;