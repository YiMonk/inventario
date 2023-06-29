const { BrowserWindow, Notification } = require("electron");
const { getConnection } = require("./database");

let window;

const createProduct = async (product) => {
  try {
    const conn = await getConnection();
    const result = await conn.query("INSERT INTO producto SET ?", product);
    product.id = result.insertId;

 
    new Notification({
      title: "Inventario",
      body: "Producto guardado exitosamente",
    }).show();


    return product;
  } catch (error) {
    console.log(error);
  }
};


const getProducts = async () => {
  const conn = await getConnection(); 
  const results = await conn.query("SELECT * FROM producto ORDER BY id DESC");
  return results;
};

const deleteProduct = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("DELETE FROM producto WHERE id = ?", id);
  return result;
};

const updateProduct = async (id, product) => {
  const conn = await getConnection();
  const result = await conn.query("UPDATE producto SET ? WHERE Id = ?", [
    product,
    id,
  ]);
  console.log(result)
};

function createWindow() {
  window = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadFile("src/ui/index.html");
  
}

module.exports = {
  createWindow,
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct
};
