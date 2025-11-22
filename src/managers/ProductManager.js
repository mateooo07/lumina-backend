import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
    constructor(filePath = path.join(__dirname, '../data/products.json')) {
        this.path = filePath;
        this.products = [];
        this.init();
    }

    async init() {
        try {
            await fs.access(this.path);
        } catch (error) {
            // Si el archivo no existe, crearlo con array vacío
            await fs.writeFile(this.path, JSON.stringify([], null, 2));
        }
        await this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            this.products = [];
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error);
            throw error;
        }
    }

    async getProducts(limit) {
        await this.loadProducts();
        if (limit) {
            return this.products.slice(0, parseInt(limit));
        }
        return this.products;
    }

    async getProductById(id) {
        await this.loadProducts();
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }
        return product;
    }

    async addProduct(productData) {
        await this.loadProducts();

        // Validar campos requeridos
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        const missingFields = requiredFields.filter(field => !productData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
        }

        // Validar que el código no esté duplicado
        const codeExists = this.products.some(p => p.code === productData.code);
        if (codeExists) {
            throw new Error(`Ya existe un producto con el código: ${productData.code}`);
        }

        // Validar tipos
        if (typeof productData.price !== 'number' || productData.price <= 0) {
            throw new Error('El precio debe ser un número mayor a 0');
        }

        if (typeof productData.stock !== 'number' || productData.stock < 0) {
            throw new Error('El stock debe ser un número mayor o igual a 0');
        }

        // Generar ID
        const newId = this.products.length > 0 
            ? Math.max(...this.products.map(p => p.id)) + 1 
            : 1;

        // Crear producto
        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };

        this.products.push(newProduct);
        await this.saveProducts();

        console.log(`Producto creado: ${newProduct.title} (ID: ${newProduct.id})`);
        return newProduct;
    }

    async updateProduct(id, updates) {
        await this.loadProducts();

        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }

        // No permitir actualizar el ID
        delete updates.id;

        // Si se actualiza el código, validar que no esté duplicado
        if (updates.code) {
            const codeExists = this.products.some(p => p.code === updates.code && p.id !== id);
            if (codeExists) {
                throw new Error(`Ya existe un producto con el código: ${updates.code}`);
            }
        }

        // Actualizar producto
        this.products[index] = {
            ...this.products[index],
            ...updates
        };

        await this.saveProducts();

        console.log(`Producto actualizado: ID ${id}`);
        return this.products[index];
    }

    async deleteProduct(id) {
        await this.loadProducts();

        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }

        const deletedProduct = this.products[index];
        this.products.splice(index, 1);
        await this.saveProducts();

        console.log(`Producto eliminado: ${deletedProduct.title} (ID: ${id})`);
        return deletedProduct;
    }
}

export default ProductManager;