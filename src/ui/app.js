const { remote } = require("electron");
const main = remote.require("./main");

const morstrarForm = document.querySelector("#morstrarForm");
const productForm = document.querySelector("#productForm");

const morstrarFiltro = document.querySelector("#morstrarFiltro");
const filtroForm = document.querySelector("#filtroForm");
const filtro = document.querySelector("#filtro")

const productoMarca = document.querySelector("#marca");
const productoModelo = document.querySelector("#modelo");
const productoSerialFabricante = document.querySelector("#serialFabricante");
const productoActivoFijo = document.querySelector("#activoFijo");
const productoProveedor = document.querySelector("#proveedor");
const productoFechaCompra = document.querySelector("#fechaCompra");
const productoEstatus = document.querySelector("#estatus");
const productoMotivo = document.querySelector("#motivo");
const productoOrigen = document.querySelector("#origen");
const productoEnvio = document.querySelector("#envio");
const productoRef = document.querySelector("#referencia");
const productoUbicacionFisica = document.querySelector("#ubicacionFisica");
const productoObservacion = document.querySelector("#observacion");
const productoFechaGrafico = document.querySelector("#fechaGrafico");
const productoConcatenarMF = document.querySelector("#concatenarMF");
const productoCantidad = document.querySelector("#cantidad");

const productsList = document.querySelector("#products");

let products = [];
let editingStatus = false;
let editProductId;


//Borrar
const deleteProduct = async (id) => {
  const response = confirm("Estas seguro de eliminar este producto?");
  if (response) {
    await main.deleteProduct(id);
    await getProducts();
  }
  return;
};

//Editar o Agregar
const editProduct = async (id) => {
  const producto = await main.getProductById(id);
  productoMarca.value = producto.marca;
  productoModelo.value = producto.modelo;
  productoSerialFabricante.value = producto.serialFabricante;
  productoActivoFijo.value = producto.activoFijo;
  productoProveedor.value = producto.proveedor;
  productoFechaCompra.value = producto.fechaCompra;
  productoEstatus.value = producto.estatus;
  productoMotivo.value = producto.motivo;
  productoOrigen.value = producto.origen;
  productoEnvio.value = producto.envio;
  productoRef.value = producto.referencia;
  productoUbicacionFisica.value = producto.ubicacionFisica;
  productoObservacion.value = producto.observacion;
  productoFechaGrafico.value = producto.fechaGrafico;
  productoConcatenarMF.value = producto.concatenarMF;
  productoCantidad.value = producto.cantidad;

  editingStatus = true;
  editProductId = id;
  
 
};

//Ocultar o mostrar formulario
morstrarForm.addEventListener('click', () => {
  if(productForm.style.display === 'none') {
    productForm.style.display = 'block';
  } else {
    productForm.style.display = 'none' ; 
  }
})

//Ocultar o mostrar filtro
morstrarFiltro.addEventListener('click', () => {
  if(filtroForm.style.display === 'none') {
    filtroForm.style.display = 'block';
  } else {
    filtroForm.style.display = 'none' ; 
  }
});


productForm.addEventListener('keydown',function(e) {
  if (e.keyIdentifier=='U+000A' || e.keyIdentifier=='Enter' || e.keyCode==13) {
      if (e.target.type=='text' && e.target.type=='date') {
          e.preventDefault();

          return false;
      }
  }
}, true);

// actualizar lista
productForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const product = {
      marca: productoMarca.value,
      modelo: productoModelo.value,
      serialFabricante: productoSerialFabricante.value,
      activoFijo: productoActivoFijo.value,
      proveedor: productoProveedor.value,
      fechaCompra: productoFechaCompra.value,
      estatus: productoEstatus.value,
      motivo: productoMotivo.value,
      origen: productoOrigen.value,
      envio: productoEnvio.value,
      referencia: productoRef.value,
      ubicacionFisica: productoUbicacionFisica.value,
      observacion: productoObservacion.value,
      fechaGrafico: productoFechaGrafico.value,
      concatenarMF: productoConcatenarMF.value,
      cantidad: productoCantidad.value,
    }

    if (!editingStatus) {
      const savedProduct = await main.createProduct(product);
      console.log(savedProduct);
    } else {
      const productUpdated = await main.updateProduct(editProductId, product);
      console.log(productUpdated);

      // Reset
      editingStatus = false;
      editProductId = "";
    }

    productForm.reset();
    getProducts();
  } catch (error) {
    console.log(error);
  }
});

//mostrar lista
function renderProducts(tasks) {
  productsList.innerHTML = "";
  tasks.forEach((t) => {
    productsList.innerHTML += `
     
      <table>
      <th scope="col" class="text-nowrap px-5">${t.marca}</th>
      <th scope="col" class="text-nowrap px-4">${t.modelo}</th>
      <th scope="col" class="text-nowrap px-5">${t.serialFabricante}</th>
      <th scope="col" class="text-nowrap px-5">${t.activoFijo}</th>
      <th scope="col" class="text-nowrap px-5">${t.proveedor}</th>
      <th scope="col" class="text-nowrap px-5">${t.fechaCompra}</th>
      <th scope="col" class="text-nowrap px-3">${t.estatus}</th>
      <th scope="col" class="text-nowrap px-5">${t.motivo}</th>
      <th scope="col" class="text-nowrap px-5">${t.origen}</th>
      <th scope="col" class="text-nowrap px-5">${t.envio}</th>
      <th scope="col" class="text-nowrap px-5">${t.referencia}</th>
      <th scope="col" class="text-nowrap px-5">${t.ubicacionFisica}</th>
      <th scope="col" class="text-nowrap px-5">${t.observacion}</th>
      <th scope="col" class="text-nowrap px-5">${t.fechaGrafico}</th>
      <th scope="col" class="text-nowrap px-5">${t.concatenarMF}</th>
      <th scope="col" class="text-nowrap px-5">${t.cantidad}</th>
      <th scope="col" class="text-nowrap px-5">
        

              <button class="btn btn-secondary btn-sm" onclick="editProduct('${t.id}')">
              <img src="../Iconos/pencil-square.svg">
                EDITAR 
              </button>

              <button class="btn btn-danger btn-sm" onclick="deleteProduct('${t.id}')">
              <img src="../Iconos/trash3-fill.svg">
                ELIMINAR
              </button>

           
        </th>
        </table>

    `;
  });
}


const getProducts = async () => {
  products = await main.getProducts();
  renderProducts(products);
};

async function init() {
  getProducts();
}

init();
