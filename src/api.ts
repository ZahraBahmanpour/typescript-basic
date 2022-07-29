import { productForm, queryString, currentSort, currentPage } from "./app.js";
import { Product } from "./product.js";
import {
  clearInputs,
  createPagination,
  gatherFormData,
  generateQueryParams,
  showToast,
} from "./utility.js";

const API_URL = "https://62a4d0d547e6e4006398b48b.mockapi.io/api";

export let currentProductId: string | undefined;

const productsTable = document.querySelector("#products tbody")!;

/////// CREATE ///////
export async function createNewProduct(newProduct: Product) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const createdProduct = await res.json();
    addToDOM(createdProduct);
    clearInputs();
  } catch (error) {
    showToast("Problem occured while creating new product");
    console.log(error);
  }
}

// READ
export async function readProducts() {
  productsTable.innerHTML = "";
  try {
    const res = await fetch(
      `${API_URL}/products${generateQueryParams(
        currentPage,
        currentSort,
        queryString
      )}`
    );
    const data = await res.json();
    const { products, count } = data;
    createPagination(count);
    products.forEach(addToDOM);
  } catch (error) {
    showToast("Problem occured while reading products!");
    console.log(error);
  }
}
async function readProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    return res.json();
  } catch (error) {
    showToast("Problem occured while reading product details!");
    console.log(error);
  }
}
/////// UPDATE ///////
export async function updateProduct(product: Product) {
  const updatedProduct = gatherFormData();
  try {
    if (updatedProduct && product.id) {
      const updatedItem = await updateOnBackend(updatedProduct, product.id);
      updateOnFrontEnd(updatedItem);
    }
  } catch (error) {
    showToast("Problem occured while updating product!");
    console.log(error);
  }
}

async function updateOnBackend(updatedProduct: Product, id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

function updateOnFrontEnd(product: Product) {
  const productRow = productsTable.querySelector(
    `tr[data-id="${product.id}"]`
  )!;
  productRow.innerHTML = "";
  const { nameCell, priceCell, countCell, createDateCell, actionCell } =
    generateTableCells(product);
  productRow.appendChild(nameCell);
  productRow.appendChild(priceCell);
  productRow.appendChild(countCell);
  productRow.appendChild(createDateCell);
  productRow.appendChild(actionCell);
  document.querySelector("#btn-add-product")!.innerHTML = "Add Product";
  clearInputs();
  currentProductId = undefined;
  showToast("Successfully Updated");
}
/////// DELETE ///////
export async function deleteProduct(productId: string) {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    showToast("Successfully Deleted");
    readProducts();
  } catch (error) {
    showToast("Problem occured deleting the product!");
    console.log(error);
  }
}

// UPDATE DOM
function addToDOM(product: Product) {
  const productRow = document.createElement("tr");
  productRow.dataset.id = product.id;
  productRow.style.lineHeight = "40px";
  const { nameCell, priceCell, countCell, createDateCell, actionCell } =
    generateTableCells(product);

  productRow.appendChild(nameCell);
  productRow.appendChild(priceCell);
  productRow.appendChild(countCell);
  productRow.appendChild(createDateCell);
  productRow.appendChild(actionCell);

  productsTable.appendChild(productRow);
}

function generateTableCells(product: Product) {
  const nameCell = document.createElement("td");
  nameCell.innerHTML = product.name;
  nameCell.title = product.name;

  const priceCell = document.createElement("td");
  priceCell.innerHTML = product.price.toString();
  priceCell.title = product.price.toString();

  const countCell = document.createElement("td");
  countCell.innerHTML = product.countInStock.toString();
  countCell.title = product.countInStock.toString();

  const createDateCell = document.createElement("td");
  if (product.createdAt) {
    const date = new Date(product.createdAt).toDateString();
    createDateCell.innerHTML = date;
    createDateCell.title = date;
  }

  const viewButton = document.createElement("button");
  viewButton.dataset.id = product.id;
  viewButton.innerHTML = '<i class="bi bi-eye"></i>';
  viewButton.title = "VIEW";
  viewButton.className = "btn btn-warning btn-sm m-1 text-white";
  viewButton.dataset.bsToggle = "modal";
  viewButton.dataset.bsTarget = "#viewModal";
  viewButton.addEventListener("click", () => viewProduct(product));

  const editButton = document.createElement("button");
  editButton.dataset.id = product.id;
  editButton.innerHTML = '<i class="bi bi-pen"></i>';
  editButton.title = "UPDATE";
  editButton.className = "btn btn-primary btn-sm";
  editButton.addEventListener("click", () => editProduct(product));

  const deleteButton = document.createElement("button");
  deleteButton.dataset.id = product.id;
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  deleteButton.title = "DELETE";
  deleteButton.className = "btn btn-danger btn-sm m-1";
  deleteButton.dataset.bsToggle = "modal";
  deleteButton.dataset.bsTarget = "#deleteModal";
  deleteButton.addEventListener("click", () => (currentProductId = product.id));

  const actionCell = document.createElement("td");
  actionCell.appendChild(viewButton);
  actionCell.appendChild(editButton);
  actionCell.appendChild(deleteButton);
  return { nameCell, priceCell, countCell, createDateCell, actionCell };
}

function editProduct(product: Product) {
  const name = productForm.querySelector("#name") as HTMLInputElement;
  name.value = product.name;
  const price = productForm.querySelector("#price") as HTMLInputElement;
  price.value = product.price.toString();
  const countInStock = productForm.querySelector(
    "#countInStock"
  ) as HTMLInputElement;
  countInStock.value = product.countInStock.toString();

  productForm.querySelector("#btn-add-product")!.innerHTML = "Update Product";
  currentProductId = product.id;
}

async function viewProduct(product: Product) {
  if (product.id) {
    const productWithDetails = await readProduct(product.id);
    const viewModal = document.querySelector("#viewModal .modal-body")!;
    viewModal.innerHTML = `
    <div class="card p-3 m-3">
    <div class="row"><div class="col-4"><strong>Description</strong></div><div class="col-8">${productWithDetails.description}</div></div>
    </div>
    <div class="card p-3 m-3">
    <div class="row"><div class="col-4"><strong>Department</strong></div><div class="col-8">${productWithDetails.department}</div></div>
    </div>
    <div class="card p-3 m-3"><div class="row"><div class="col-4"><strong>Material</strong></div><div class="col-8">${productWithDetails.material}</div></div>
    </div>`;
  }
}
