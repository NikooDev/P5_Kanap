import App from './manager/App.js'
import Cart from './manager/Cart.js'
import Product from './manager/Product.js'

/**
 * Gestion du panier
 */
(async () => {

	/**
	 * Affiche la quantité et le prix total du panier
	 */
	const displayTotal = () => {
		let totalQuantity = document.querySelector('#totalQuantity'),
			totalPrice = document.querySelector('#totalPrice')

		totalQuantity.innerText = Cart.totalQuantity()
		totalPrice.innerText = Cart.formatPrice(Cart.totalPrice())
	}

	/**
	 * Ensemble des actions clients (Ajouter, Supprimer, Envoyer)
	 */
	const handleActions = () => {
		let itemQuantity = document.querySelectorAll('.itemQuantity'),
			itemDelete = document.querySelectorAll('.deleteItem'),
			inputSubmit = document.querySelector('#order')

		// Modification de la quantité
		itemQuantity.forEach((btn) => btn.addEventListener('change', (event) => {
			let newCart = {
				id: event.target.closest('.cart__item').dataset.id,
				quantity: parseInt(event.currentTarget.value),
				color: event.target.closest('.cart__item').dataset.color
			}
			Cart.update(newCart).then(() => displayTotal())
		}))

		// Suppression d'un article
		itemDelete.forEach((btn) => btn.addEventListener('click', (event) => {
			let id = event.currentTarget.closest('.cart__item').dataset.id,
				color = event.currentTarget.closest('.cart__item').dataset.color
			Cart.delete(id, color).then((length) => {
				displayTotal()
				cartEmpty(length)
				event.target.closest('.cart__item').remove()
			})
		}))

		// Affichage des messages d'erreurs
		const handleError = (name, error) => {
			let el = document.querySelector('#'+name+'ErrorMsg')
			el.innerText = error
		}

		// Reset des erreurs
		const resetError = (name) => {
			let el = document.querySelector('#'+name+'ErrorMsg')
			el.innerText = ''
		}

		// Validation et envoie du formulaire →
		inputSubmit && inputSubmit.addEventListener('click', async (event) => {
			event.preventDefault()

			let firstname = document.querySelector('#firstName').value,
				lastname = document.querySelector('#lastName').value,
				address = document.querySelector('#address').value,
				city = document.querySelector('#city').value,
				email = document.querySelector('#email').value,
				regName = new RegExp('^\\s*[a-zA-Zéèàêïâ]+\\s*$','i'),
				regEmail = new RegExp('^[a-z0-9]+([_|.-][a-z0-9]+)*@[a-z0-9]+([_|\.-][a-z0-9]+)*[\.][a-z]{2,6}$', 'i')

			if(firstname.length === 0 || !regName.test(firstname)){
				handleError('firstName', 'Votre prénom ne doit pas être vide. Seul les lettres et leurs accents sont autorisées.')
				return false
			} else {
				resetError('firstName')
			}
			if(lastname.length === 0 || !regName.test(lastname)) {
				handleError('lastName', 'Votre nom ne doit pas être vide. Seul les lettres et leurs accents sont autorisées.')
				return false
			} else {
				resetError('lastName')
			}
			if(address.length === 0) {
				handleError('address', 'Votre adresse n\'est pas renseignée.')
				return false
			} else {
				resetError('address')
			}
			if(city.length === 0) {
				handleError('city', 'Votre ville n\'est pas renseignée.')
				return false
			} else {
				resetError('city')
			}
			if(email.length === 0 || !regEmail.test(email)) {
				handleError('email', 'Votre adresse e-mail est vide ou mal renseignée.')
				return false
			} else {
				resetError('email')
			}

			let datas = {
				contact: {
					firstName: firstname,
					lastName: lastname,
					address: address,
					city: city,
					email: email
				},
				products: Cart.renderProductId()
			}

			await App.fetchPost(datas)
		})
	}

	// Si le panier est vide
	const cartEmpty = (length) => {
		let listItem = document.querySelector('#cart__items'),
			formCart = document.querySelector('.cart__order__form')

		if(length === 0 || Cart.read().length === 0) {
			listItem.innerHTML = '<p class="cart__item">VOTRE PANIER EST VIDE</p>'
			formCart.style.display = 'none'
			displayTotal()
		}
	}

	// DOM construit → Récupèration de tous les produits → Initialisation des actions
	document.addEventListener('DOMContentLoaded', async () => {
		let listItem = document.querySelector('#cart__items'),
			result = await App.fetchProducts(),
			product = Cart.findProduct(result)

		cartEmpty()

		// Affichage des produits dans la vue renderCart
		product.map((p) => {
			let productList = new Product(p)
			listItem.insertAdjacentHTML('beforeend', productList.renderCart())
		})

		handleActions()
		displayTotal()
	})

})()