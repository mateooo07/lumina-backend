import fs from 'fs/promises';

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.init();
    }

    async init() {
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, JSON.stringify([]));
            console.log('Archivo carts.json creado');
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer carritos:', error);
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async createCart() {
        const carts = await this.getCarts();

        const newId = carts.length > 0 
            ? Math.max(...carts.map(c => c.id)) + 1 
            : 1;

        const newCart = {
            id: newId,
            products: []
        };

        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        
        console.log(`Carrito creado: ID ${newId}`);
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);

        if (cartIndex === -1) {
            throw new Error(`Carrito con id ${cartId} no encontrado`);
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
            console.log(`Cantidad incrementada del producto ${productId} en carrito ${cartId}`);
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
            console.log(`Producto ${productId} agregado al carrito ${cartId}`);
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        
        return cart;
    }
}

export default CartManager;