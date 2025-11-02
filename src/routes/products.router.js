import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, '../data/products.json');
const productManager = new ProductManager(productsPath);

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json({
            status: 'success',
            payload: products
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(Number(pid));

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: `Producto con id ${pid} no encontrado`
            });
        }

        res.json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json({
            status: 'success',
            payload: newProduct,
            message: 'Producto creado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productManager.updateProduct(Number(pid), req.body);
        
        res.json({
            status: 'success',
            payload: updatedProduct,
            message: 'Producto actualizado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productManager.deleteProduct(Number(pid));
        
        res.json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;