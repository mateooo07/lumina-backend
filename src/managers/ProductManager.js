import fs from 'fs/promises';

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.init();
    }

    async init() {
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, JSON.stringify([]));
            console.log('Archivo products.json creado');
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(productData) {
        const products = await this.getProducts();

        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        const missingFields = requiredFields.filter(field => !productData[field]);

        if (missingFields.length > 0) {
            throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
        }

        const existingProduct = products.find(p => p.code === productData.code);
        if (existingProduct) {
            throw new Error(`Ya existe un producto con el código: ${productData.code}`);
        }

        if (isNaN(productData.price) || productData.price <= 0) {
            throw new Error('El precio debe ser un número mayor a 0');
        }

        if (isNaN(productData.stock) || productData.stock < 0) {
            throw new Error('El stock debe ser un número mayor o igual a 0');
        }

        const newId = products.length > 0 
            ? Math.max(...products.map(p => p.id)) + 1 
            : 1;

        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: Number(productData.price),
            status: productData.status !== undefined ? productData.status : true,
            stock: Number(productData.stock),
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };

        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        
        console.log(`Producto creado: ${newProduct.title} (ID: ${newProduct.id})`);
        return newProduct;
    }

    async updateProduct(id, updateData) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }

        const { id: _, ...dataToUpdate } = updateData;

        if (dataToUpdate.code) {
            const existingProduct = products.find(p => p.code === dataToUpdate.code && p.id !== id);
            if (existingProduct) {
                throw new Error(`Ya existe un producto con el código: ${dataToUpdate.code}`);
            }
        }

        if (dataToUpdate.price !== undefined) {
            if (isNaN(dataToUpdate.price) || dataToUpdate.price <= 0) {
                throw new Error('El precio debe ser un número mayor a 0');
            }
            dataToUpdate.price = Number(dataToUpdate.price);
        }

        if (dataToUpdate.stock !== undefined) {
            if (isNaN(dataToUpdate.stock) || dataToUpdate.stock < 0) {
                throw new Error('El stock debe ser un número mayor o igual a 0');
            }
            dataToUpdate.stock = Number(dataToUpdate.stock);
        }

        products[index] = {
            ...products[index],
            ...dataToUpdate,
            id: products[index].id 
        };

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        
        console.log(`Producto actualizado: ID ${id}`);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(product => product.id !== id);

        if (products.length === filteredProducts.length) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }

        await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
        
        console.log(`Producto eliminado: ID ${id}`);
        return { message: 'Producto eliminado correctamente' };
    }
}

export default ProductManager;