import { currentPage } from "./app.js";
const DEFAULT_PAGE_COUNT = 10;
const SORT_BY_NAME = "name";
const SORT_BY_CREATE_DATE = "createdAt";
const name = document.querySelector("#name");
const price = document.querySelector("#price");
const countInStock = document.querySelector("#countInStock");
export function clearInputs() {
    name.value = "";
    price.value = "";
    countInStock.value = "";
}
export function generateQueryParams(page = 1, sort = SORT_BY_NAME, queryString = "") {
    let queryParams = `?page=${page}&limit=${DEFAULT_PAGE_COUNT}&sortBy=${sort}`;
    if (queryString !== "") {
        queryParams += `&name=${queryString}`;
    }
    return queryParams;
}
export function createPagination(productCount) {
    const pageCount = Math.floor(productCount / DEFAULT_PAGE_COUNT);
    let lis = "";
    for (let i = 1; i <= pageCount; i++) {
        lis += `<li class="page-item ${i === currentPage ? "active" : ""}"><a href="#" class="page-link">${i}</a></li>`;
    }
    document.querySelector("ul.pagination").innerHTML = lis;
}
export function showToast(color = "red") {
    let gradiantColor = "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))";
    if (color === "green") {
        gradiantColor = "linear-gradient(to right, #00b09b, #96c93d)";
    }
}
export function gatherFormData() {
    if (name.value !== "" && price.value !== "" && countInStock.value !== "") {
        return {
            name: name.value,
            price: Number(price.value),
            countInStock: Number(countInStock.value),
        };
    }
    return undefined;
}
