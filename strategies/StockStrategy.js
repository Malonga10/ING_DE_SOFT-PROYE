// strategies/StockStrategy.js
class PhysicalStockStrategy {
    validate(product, quantity) {
        if (product.stock < quantity) {
            throw new Error('Stock insuficiente para producto físico');
        }
    }
}

class DigitalStockStrategy {
    validate(product, quantity) {
        // Los productos digitales no restan stock físico 
        console.log("Validación digital: Stock infinito.");
    }
}

module.exports = { PhysicalStockStrategy, DigitalStockStrategy };