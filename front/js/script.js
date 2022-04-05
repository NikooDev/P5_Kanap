import App from './manager/App.js'
import Product from './manager/Product.js'

/**
 * Récupère tous les produits et les intègre dans la vue renderProducts()
 */
(async () => {

	let listProducts = await App.fetchProducts(),
	listItem = document.getElementById('items')

	if(listProducts) {
		for(let product of listProducts) {
			product = new Product(product)
			listItem && listItem.insertAdjacentHTML('beforeend', product.renderProduct())
		}
	}

})()