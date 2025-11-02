import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsPath = path.join(__dirname, '../data/carts.json');
const cartManager = new CartManager(cartsPath);

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({
            status: 'success',
            payload: newCart,
            message: 'Carrito creado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(Number(cid));

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: `Carrito con id ${cid} no encontrado`
            });
        }

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(Number(cid), Number(pid));
        
        res.json({
            status: 'success',
            payload: updatedCart,
            message: 'Producto agregado al carrito exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;