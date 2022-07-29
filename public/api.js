var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { productForm, queryString, currentSort, currentPage } from "./app.js";
import { clearInputs, createPagination, gatherFormData, generateQueryParams, showToast, } from "./utility.js";
const API_URL = "https://62a4d0d547e6e4006398b48b.mockapi.io/api";
export let currentProductId;
const productsTable = document.querySelector("#products tbody");
/////// CREATE ///////
export function createNewProduct(newProduct) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${API_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(newProduct),
            });
            const createdProduct = yield res.json();
            addToDOM(createdProduct);
            clearInputs();
        }
        catch (error) {
            showToast("Problem occured while creating new product");
            console.log(error);
        }
    });
}
// READ
export function readProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        productsTable.innerHTML = "";
        try {
            const res = yield fetch(`${API_URL}/products${generateQueryParams(currentPage, currentSort, queryString)}`);
            const data = yield res.json();
            const { products, count } = data;
            createPagination(count);
            products.forEach(addToDOM);
        }
        catch (error) {
            showToast("Problem occured while reading products!");
            console.log(error);
        }
    });
}
function readProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${API_URL}/products/${id}`);
            return res.json();
        }
        catch (error) {
            showToast("Problem occured while reading product details!");
            console.log(error);
        }
    });
}
/////// UPDATE ///////
export function updateProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedProduct = gatherFormData();
        try {
            if (updatedProduct && product.id) {
                const updatedItem = yield updateOnBackend(updatedProduct, product.id);
                updateOnFrontEnd(updatedItem);
            }
        }
        catch (error) {
            showToast("Problem occured while updating product!");
            console.log(error);
        }
    });
}
function updateOnBackend(updatedProduct, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${API_URL}/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedProduct),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return yield res.json();
    });
}
function updateOnFrontEnd(product) {
    const productRow = productsTable.querySelector(`tr[data-id="${product.id}"]`);
    productRow.innerHTML = "";
    const { nameCell, priceCell, countCell, createDateCell, actionCell } = generateTableCells(product);
    productRow.appendChild(nameCell);
    productRow.appendChild(priceCell);
    productRow.appendChild(countCell);
    productRow.appendChild(createDateCell);
    productRow.appendChild(actionCell);
    document.querySelector("#btn-add-product").innerHTML = "Add Product";
    clearInputs();
    currentProductId = undefined;
    showToast("Successfully Updated");
}
/////// DELETE ///////
export function deleteProduct(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${API_URL}/products/${productId}`, {
                method: "DELETE",
            });
            const data = yield res.json();
            showToast("Successfully Deleted");
            readProducts();
        }
        catch (error) {
            showToast("Problem occured deleting the product!");
            console.log(error);
        }
    });
}
// UPDATE DOM
function addToDOM(product) {
    const productRow = document.createElement("tr");
    productRow.dataset.id = product.id;
    productRow.style.lineHeight = "40px";
    const { nameCell, priceCell, countCell, createDateCell, actionCell } = generateTableCells(product);
    productRow.appendChild(nameCell);
    productRow.appendChild(priceCell);
    productRow.appendChild(countCell);
    productRow.appendChild(createDateCell);
    productRow.appendChild(actionCell);
    productsTable.appendChild(productRow);
}
function generateTableCells(product) {
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
function editProduct(product) {
    const name = productForm.querySelector("#name");
    name.value = product.name;
    const price = productForm.querySelector("#price");
    price.value = product.price.toString();
    const countInStock = productForm.querySelector("#countInStock");
    countInStock.value = product.countInStock.toString();
    productForm.querySelector("#btn-add-product").innerHTML = "Update Product";
    currentProductId = product.id;
}
function viewProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        if (product.id) {
            const productWithDetails = yield readProduct(product.id);
            const viewModal = document.querySelector("#viewModal .modal-body");
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
    });
}
