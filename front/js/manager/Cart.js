/**
 * Classe de gestion des produits
 * Ajout, modification, suppression, prix
 */

class Cart {

	/**
	 * Tableau de référence de tous les articles du panier
	 * @type {[]}
	 */
	static products = []

	/**
	 * Créé un nouvel article dans le panier. Si l'article existe, la quantité est égale à l'article existant
	 * @param product
	 * @return {Promise<void>}
	 */
	static async create(product) {
		let cart = this.read(),
			productExist = cart.find(p => p.id === product.id && p.color === product.color)

		if(productExist != null) {
			productExist.quantity += product.quantity
		} else {
			cart.push(product)
		}

		this.save(cart)
	}

	/**
	 * Récupère le LocalStorage, par défault, si null = []
	 * @return {JSON|*[]}
	 */
	static read() {
		let cart = localStorage.getItem('cart')
		return (cart !== null) ? JSON.parse(cart) : []
	}

	/**
	 * Met à jour le nombre total d'articles et la quantité du tableau this.products comme référence pour calculer le prix total
	 * @param product
	 * @return {Promise<void>}
	 */
	static async update(product) {
		let cart = this.read(),
			productExist = cart.find(p => p.id === product.id && p.color === product.color),
			productRef = this.products.find(p => p.id === productExist.id && p.color === productExist.color)

		productExist.quantity = product.quantity
		productRef.quantity = product.quantity

		this.save(cart)
	}

	/**
	 * Supprime l'article du panier, du tableau de référence et du LocalStorage
	 * @param id
	 * @param color
	 * @return {Promise<number>}
	 */
	static async delete(id, color) {
		let cart = this.read(),
			newCart = cart.filter(p => p.id !== id || p.color !== color),
			indexProduct = this.products.findIndex(item => item.id === id && item.color === color)

		this.products.splice(indexProduct, 1)
		this.save(newCart)
		return this.read().length
	}

	/**
	 * Met à jour le LocalStorage
	 * @param cart
	 */
	static save(cart) {
		localStorage.setItem('cart', JSON.stringify(cart))
	}

	/**
	 * Additionne et réduit les valeurs pour en retourner qu'une
	 * @param values
	 * @return {number}
	 */
	static sum(...values) {
		return values.reduce((acc, n) => acc + n, 0)
	}

	/**
	 * Fusionne et retourne les articles correspondants à ceux du panier
	 * @param products
	 */
	static findProduct(products) {
		let cart = this.read(), p, o

		for(let c of cart) {
			p = products.find(item => item._id === c.id)
			o = Object.assign(c, p)

			// Tous les articles trouvés sont stockés dans le tableau de référence
			this.products.push(o)
		}

		return this.products
	}

	/**
	 * Calcul de la quantité totale des articles
	 * @return {number}
	 */
	static totalQuantity() {
		let cart = this.read()

		if(cart.length >= 1) {
			return this.sum(...this.read().map(product => product.quantity))
		} else {
			return 0
		}
	}

	/**
	 * Calcul le prix total
	 * @return {number}
	 */
	static totalPrice() {
		return this.sum(...this.products.map(item => item.price * item.quantity))
	}

	/**
	 * Formate les tarifs en utilisant le séparateur de millier
	 * @param int
	 * @param delimiter
	 * @return {string}
	 */
	static formatPrice(int, delimiter = '\u202f\u202f') {
		const reg = /(\d)(?=(\d\d\d)+(?!\d))/g
		return int.toString().replace(reg, `$1${delimiter}`)
	}

	static renderProductId() {
		let cart = this.read()

		if(cart.length >= 1) {
			return cart.map(product => product.id)
		} else {
			return null
		}
	}

	static clear() {
		return localStorage.removeItem('cart')
	}

}

export default Cart