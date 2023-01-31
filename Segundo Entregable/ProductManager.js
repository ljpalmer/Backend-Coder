const FILE_SYSTEM = require('fs');
const FILE_NAME = "productos.json";

class ProductManager {    
    constructor(path, persistenceManager) {
        this._products = [];
        this._path = path;
        this._persistenceManager = persistenceManager;
        if(!persistenceManager.fncValidateIfExistsPath(path)){            
            console.log('[SYSTEM] Creando directorio con mkdirAsync: '+ this._path);
            persistenceManager.fncMakeDirectory(this._path);
            // FILE_SYSTEM.mkdirSync(this._path);            

            let success = persistenceManager.fncWritePersistence(this._path, FILE_NAME, this._products);   
                (success == true) ? console.log('[SYSTEM] Se guardo correctamente.') : console.log('[SYSTEM] Problemas al guardar.');


        }  else{
            console.log('[SYSTEM] Carpeta ya se encuentra creada');
        }      
    }
    addProduct(product) {        
        if (!this.fncValidateCodeProductExist(product.code)) {
            if (this.fncValidateAllValuesIncluded(product)) {
                // product.id = this._products.length + 1;
                product.id  = this.generateIdForProduct();
                this._products.push(product);
                console.log(`[SYSTEM] Se registro el producto el ID generado es: ${product.id}`);                
                let success = this._persistenceManager.fncWritePersistence(this._path, FILE_NAME, this._products);   
                (success == true) ? console.log('[SYSTEM] Se guardo correctamente.') : console.log('[SYSTEM] Problemas al guardar.');

            } else {
                console.log(`[SYSTEM] No se pudo agregar el producto ${product.title}, falta 1 o mas argumentos.`);
            }
        } else {
            console.log("[SYSTEM] No se pudo agregar el producto, campo [Code] Repetido.");
        }
    };

    getProducts() {        
        this._products = this._persistenceManager.fncReadFromPersistence(this._path,FILE_NAME);

        if (this._products.length == 0) {
            console.log("[SYSTEM] Lista de productos vacia.");
        } else {
            this._products.forEach(product => {
                    console.log(product);
                });
            console.log(`[SYSTEM] Tamaño de la lista ${this._products.length}.`);
        }
    };

    getProductById(id) {        
        this._products = this._persistenceManager.fncReadFromPersistence(this._path,FILE_NAME);

        let productPosition = this._products.findIndex(x => x.id == id);
        console.log(`[SYSTEM] Posición de la búsqueda: ${productPosition}`);
        if (productPosition >= 0) {
            console.log("[SYSTEM] Producto Encontrado: "+ Object.entries(this._products[productPosition]));
        } else {
            console.log("[SYSTEM] Código ingresado no existe (Not Found!).");
        }
    };

    updateProductById(id, product){
        this._products = this._persistenceManager.fncReadFromPersistence(this._path,FILE_NAME);

        let productPosition = this._products.findIndex(x => x.id == id);
        if (productPosition >= 0) {
            //actualizamos los valores
            this._products[productPosition].title = product.title;
            this._products[productPosition].description = product.description;
            this._products[productPosition].price = product.price;
            this._products[productPosition].thumbnail = product.thumbnail;
            this._products[productPosition].code = product.code;
            this._products[productPosition].stock = product.stock;
            //Persistimos los datos
            let success = this._persistenceManager.fncWritePersistence(this._path, FILE_NAME, this._products);   
            (success == true) ? console.log('[SYSTEM] Se guardo correctamente') : console.log('[SYSTEM] Problemas al guardar');
        }else{
            //no se puede actualizar
            console.log("[SYSTEM] Producto no encontrado, no se pudo actualizar.");
        }
    }

    generateIdForProduct(){
        let id = 0;        
        this._products = this._persistenceManager.fncReadFromPersistence(this._path,FILE_NAME);
        if(this._products.length == 0){
            id = 1;
        }else{
            id = this._products[this._products.length - 1].id + 1;
        }
        return id;
    }

    deleteProductById(id){
        this._products = this._persistenceManager.fncReadFromPersistence(this._path,FILE_NAME);
        let productPosition = this._products.findIndex(x => x.id == id);
        if (productPosition >= 0) {
            this._products.splice(productPosition, 1);
            let success = this._persistenceManager.fncWritePersistence(this._path, FILE_NAME, this._products);   
            (success == true) ? console.log('[SYSTEM] Se elimino correctamente') : console.log('[SYSTEM] Problemas al guardar la eliminacion');
        }else{
            console.log("[SYSTEM] Producto no encontrado, no se pudo eliminar.");
        }
    }

    fncValidateCodeProductExist(code) {
        let keyFunction = false;
        this._products.forEach(product => {
                if (product.code === code) {
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

class PersistenceManager{
    constructor(){

    }

    fncMakeDirectory(path){
        let success = false;
        try {
            FILE_SYSTEM.mkdirSync(path);    
            success = true;
        } catch (error) {
            success = false;
        }
        return success;
    }

    fncValidateIfExistsPath(path){
        let validate = true;
        if(!FILE_SYSTEM.existsSync(path)){       
            validate= false;
        }
        return validate;
    }

    fncReadFromPersistence(path, filename){
        console.log('[SYSTEM] Leyendo registros en directorio: '+ path);     
        let rawdata = FILE_SYSTEM.readFileSync(path+'/'+filename);
        let obj = JSON.parse(rawdata);
        return obj;
    }

    fncWritePersistence(path, filename, object){     
        let success = false;
        try {
            console.log('[SYSTEM] Guardando registro en directorio: '+ path);
            let json = JSON.stringify(object);
            FILE_SYSTEM.writeFileSync(path+'/'+filename,json);            
            success = true;
        } catch (error) {
            success = false;
            console.log('[SYSTEM] '+ error);
        }           
        return success;
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
let productManager = new ProductManager('json', new PersistenceManager());

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
    'abc324'
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

console.log("[SYSTEM] Agregamos un nuevo producto a la persistencia");
let product03 = new Product(
    "Producto Prueba Nuevo",
    "Este es un producto de prueba nuevo",
    200,
    'Sin Imagen',
    'abc567',
    50
);
productManager.addProduct(product03);


console.log("[SYSTEM] Agregamos un nuevo producto a la persistencia");
let product04 = new Product(
    "Producto Prueba Nuevo",
    "Este es un producto de prueba nuevo",
    300,
    'Sin Imagen',
    'abc890',
    10
);
productManager.addProduct(product04);

console.log("Obtener Productos con los nuevos productos ingresados");
console.log("=====================================================");
productManager.getProducts();

console.log("Actualizamos el Producto 3 con nuevos datos");
console.log("===========================================");
//Actualizamos el titulo y el stock
product03.title="Producto Prueba Nuevo Modificado";
product03.stock=60;
productManager.updateProductById(3, product03);

console.log("Obtener Productos con el producto id 3 modificado");
console.log("=================================================");
productManager.getProducts();

console.log("Procedemos a eliminar el producto id 2");
console.log("======================================");
productManager.deleteProductById(2);

console.log("Obtener Productos despues de eliminar el producto id 2");
console.log("======================================================");
productManager.getProducts();





