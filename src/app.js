import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Importar routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

// Importar ProductManager para websockets
import ProductManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Configurar Handlebars con helpers personalizados
app.engine('handlebars', engine({
    helpers: {
        // Helper para comparar si un número es mayor que otro
        gt: function(a, b) {
            return a > b;
        },
        // Helper para multiplicar (útil para cálculos)
        multiply: function(a, b) {
            return a * b;
        },
        // Helper para igualdad estricta
        eq: function(a, b) {
            return a === b;
        },
        // Helper para comparar menor que
        lt: function(a, b) {
            return a < b;
        }
    }
}));

app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.use('/', viewsRouter);

// Iniciar servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`\nServidor corriendo en http://localhost:${PORT}`);
    console.log(`\nVistas disponibles:`);
    console.log(`   - http://localhost:${PORT}/`);
    console.log(`   - http://localhost:${PORT}/realtimeproducts`);
    console.log(`\nAPI Endpoints:`);
    console.log(`   - GET    http://localhost:${PORT}/api/products`);
    console.log(`   - POST   http://localhost:${PORT}/api/products`);
    console.log(`   - GET    http://localhost:${PORT}/api/products/:pid`);
    console.log(`   - PUT    http://localhost:${PORT}/api/products/:pid`);
    console.log(`   - DELETE http://localhost:${PORT}/api/products/:pid\n`);
});

// Configurar Socket.io
const io = new Server(httpServer);

// Instancia de ProductManager para websockets
const productManager = new ProductManager();

// Manejo de conexiones WebSocket
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Enviar lista de productos al conectarse
    try {
        const products = await productManager.getProducts();
        socket.emit('products', products);
    } catch (error) {
        socket.emit('error', 'Error al cargar productos');
    }

    // Escuchar evento para crear producto
    socket.on('createProduct', async (productData) => {
        try {
            const newProduct = await productManager.addProduct(productData);
            
            // Emitir a todos los clientes la lista actualizada
            const products = await productManager.getProducts();
            io.emit('products', products);
            
            console.log('Producto creado:', newProduct.title);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    // Escuchar evento para eliminar producto
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(parseInt(productId));
            
            // Emitir a todos los clientes la lista actualizada
            const products = await productManager.getProducts();
            io.emit('products', products);
            
            console.log('Producto eliminado: ID', productId);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Exportar io para usar en routers si es necesario
export { io };