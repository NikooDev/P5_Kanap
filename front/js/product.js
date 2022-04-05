import App from './manager/App.js'
import Product from './manager/Product.js'
import Cart from './manager/Cart.js'

/**
 * Utilise insertAdjacentHTML pour insérer les éléments dans le DOM à la position spécifiée selon le sélecteur
 * @param target
 * @param selector
 * @param position
 * @param element
 */
const insertHTML = (target, selector, position, element) => {
	return target.querySelector(selector).insertAdjacentHTML(position, element)
}

/**
 * Récupère et ajoute les données dans le DOM. Au clic du bouton → Création du panier
 */
(async () => {

	let id = new URL(window.location.href).searchParams.get('id'),
		item = document.querySelector('.item'),
		article = document.querySelector('.item article'),
		addCart = document.getElementById('addToCart'),
		result = await App.fetchProducts(id),
		product = new Product(result)

	// Si l'url ne correspond à aucun produit' →
	if(product.getID === undefined) {
		document.title = 'Produit introuvable'
		article.style.display = 'none'
		item.innerHTML = '<p>CE PRODUIT N\'EXISTE PAS</p>'
	} else {
		document.title = product.name
		insertHTML(item, '.item__img', 'afterbegin', `<img src="${product.imageUrl}" alt="${product.altTxt}">`)
		insertHTML(item,'#title', 'afterbegin', product.name)
		insertHTML(item,'#price', 'afterbegin', product.price.toLocaleString())
		insertHTML(item,'#description', 'afterbegin', product.description)
		insertHTML(item,'#colors', 'beforeend', product.colors.map(color => `<option value="${color}">${color}</option>`).join())

		// Évènement clic du bouton "Ajouter au panier" →
		addCart && addCart.addEventListener('click', () => {
			let quantity = document.querySelector('#quantity'),
				color = document.querySelector('#colors')

			if(color.value.length > 0 && parseInt(quantity.value) > 0 && parseInt(quantity.value) < 101) {
				let newProduct = {
					id: product.getID,
					quantity: parseInt(quantity.value),
					color: color.value
				}
				product._id = product.getID
				product.color = newProduct.color
				product.quantity = newProduct.quantity
				Cart.create(newProduct).then(() => {
					quantity.value = 0
					alert('Vos articles ont bien été ajouté dans le panier !')
				})
			} else {
				alert('Veuillez choisir une couleur et une quantité pour ajouter vos articles dans le panier.')
			}
		})
	}

})()