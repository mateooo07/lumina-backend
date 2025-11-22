import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager(); // Sin parámetros

// Vista Home - Lista estática de productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', {
            title: 'Lumina Lámparas - Catálogo',
            products,
            hasProducts: products.length > 0
        });
    } catch (error) {
        res.render('home', {
            title: 'Lumina Lámparas - Catálogo',
            products: [],
            hasProducts: false,
            error: 'Error al cargar productos'
        });
    }
});

// Vista Real Time Products - Con WebSockets
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', {
            title: 'Lumina Lámparas - Productos en Tiempo Real',
            products,
            hasProducts: products.length > 0
        });
    } catch (error) {
        res.render('realTimeProducts', {
            title: 'Lumina Lámparas - Productos en Tiempo Real',
            products: [],
            hasProducts: false,
            error: 'Error al cargar productos'
        });
    }
});

export default router;