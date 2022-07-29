import { createNewProduct, deleteProduct, readProducts, updateProduct, currentProductId, } from "./api.js";
import { gatherFormData, clearInputs } from "./utility.js";
export let queryString;
export let currentSort;
export let currentPage = 1;
export const productForm = document.querySelector("#create-product");
// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    readProducts();
});
document.querySelector("#btn-reset").addEventListener("click", () => {
    clearInputs();
    productForm.querySelector("#btn-add-product").innerHTML = "Add Product";
});
document.querySelector("#searchBox").addEventListener("input", (event) => {
    const searchBox = event.target;
    queryString = searchBox.value.toLowerCase();
    readProducts();
    resetPagination();
});
document.querySelector("#sortType").addEventListener("change", (event) => {
    const sortType = event.target;
    currentSort = sortType.value;
    readProducts();
    resetPagination();
});
document.querySelector("ul.pagination").addEventListener("click", (event) => {
    const lis = document.querySelectorAll(".page-item");
    lis.forEach((li) => li.classList.remove("active"));
    const list = event.target;
    if (list.parentElement) {
        list.parentElement.classList.add("active");
    }
    currentPage = Number(list.innerText);
    readProducts();
});
document
    .querySelector("#confirm-delete-btn")
    .addEventListener("click", (event) => {
    if (currentProductId) {
        deleteProduct(currentProductId);
    }
});
productForm.addEventListener("submit", determineCrudMode);
// END OF EVENT LISTENERS
// EVENT LISTENER CALLBACKS
function determineCrudMode(event) {
    event.preventDefault();
    let newProduct = gatherFormData();
    if (newProduct) {
        if (currentProductId) {
            updateProduct(Object.assign({ id: currentProductId }, newProduct));
        }
        else {
            createNewProduct(newProduct);
        }
    }
}
// END OF EVENT LISTENER CALLBACKS
export function resetPagination() {
    currentPage = 1;
    const lis = document.querySelectorAll(".page-item");
    lis.forEach((li) => li.classList.remove("active"));
    lis[0].classList.add("active");
}
