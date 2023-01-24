class ProductManager {
    constructor() {
        this._products = [];
    }
    addProduct(product) {        
        if (!this.fncValidateCodeProductExist(product.code)) {
            if (this.fncValidateAllValuesIncluded(product)) {
                product.id = this._products.length + 1;
                this._products.push(product);
                console.log(`Se registro el producto el ID generado es: ${product.id}`);
            } else {
                console.log(`No se pudo agregar el producto ${product.title}, falta 1 o mas argumentos.`);
            }
        } else {
            console.log("No se pudo agregar el producto, campo [Code] Repetido.");
        }
    };

    getProducts() {        
        if (this._products.length == 0) {
            console.log("Lista de productos vacia.");
        } else {
            this._products.forEach(product => {
                    console.log(product);
                });
            console.log(`Tamaño de la lista ${this._products.length}.`);
        }
    };

    getProductById(id) {
        let productPosition = this._products.findIndex(x => x.id == id);
        console.log(`Posición de la búsqueda: ${productPosition}`);
        if (productPosition >= 0) {
            console.log("Producto Encontrado: "+ Object.entries(this._products[productPosition]));
        } else {
            console.log("Código ingresado no existe (Not Found!).");
        }
    };

    fncValidateCodeProductExist(Code) {
        let keyFunction = false;
        this._products.forEach(product => {
                if (product.code === Code) {
                    keyFunction=true;
                }
            });
        return keyFunction;
    }

    fncValidateAllValuesIncluded(product) {
        let keyFunction = true;
        let values = Object.values(product);
        values.forEach(element => {
            if (typeof element === 'undefined') {
                keyFunction = false;
            };
        });
        return keyFunction;
    }
}

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = 0;
    }
}

console.log("PROCESO DE TESTING");
console.log("Obtener Productos");
console.log("=================");
let productManager = new ProductManager();

productManager.getProducts();

let product01 = new Product(
    "Producto Prueba",
    "Este es un producto de prueba",
    200,
    'Sin Imagen',
    'abc123',
    25
);
//Este producto no se declaro stock, no debe permitir agregarlo por la validacion
let product02 = new Product(
    "Producto Prueba",
    "Este es un producto de prueba",
    200,
    'Sin Imagen',
    'abc321'
);

console.log("Agregar Productos al ProductManager");
console.log("===================================");
productManager.addProduct(product01);
productManager.addProduct(product02); //Producto no se agregara por no declarar todos los campos
//Obtener todos los productos cargados
console.log("Obtener Productos");
console.log("=================");
productManager.getProducts();
//Se intentara registrar el mismo producto de nuevo
productManager.addProduct(product01); //No permitira el regitro por la validacion al campo CODE
//Obtener el producto con el codigo 1
console.log("Obtener Productos con Codigo 1");
console.log("==============================");
productManager.getProductById(1);
//Obtener el producto con el codigo 3, mensaje Not Found!
console.log("Obtener Productos con Codigo 3, devolvera que producto no existe");
console.log("=========================================");
productManager.getProductById(3);