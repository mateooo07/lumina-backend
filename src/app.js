import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'API Lumina Lámparas funcionando correctamente',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Algo salió mal en el servidor'
    });
});

app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Endpoints disponibles:`);
    console.log(`   - GET    http://localhost:${PORT}/api/products`);
    console.log(`   - POST   http://localhost:${PORT}/api/products`);
    console.log(`   - GET    http://localhost:${PORT}/api/products/:pid`);
    console.log(`   - PUT    http://localhost:${PORT}/api/products/:pid`);
    console.log(`   - DELETE http://localhost:${PORT}/api/products/:pid`);
    console.log(`   - POST   http://localhost:${PORT}/api/carts`);
    console.log(`   - GET    http://localhost:${PORT}/api/carts/:cid`);
    console.log(`   - POST   http://localhost:${PORT}/api/carts/:cid/product/:pid`);
});