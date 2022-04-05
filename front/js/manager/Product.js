import Cart from './Cart.js'

/**
 * Classe représentant un produit et ses différentes vues
 */
class Product {
	constructor(product) {
		/**
		 * _id
		 * @type {string}
		 * @private
		 */
		this._id = product._id

		/**
		 * name
		 * @type {string}
		 * @public
		 */
		this.name = product.name

		/**
		 * description
		 * @type {string}
		 * @public
		 */
		this.description = product.description

		/**
		 * imageUrl
		 * @type {string}
		 * @public
		 */
		this.imageUrl = product.imageUrl

		/**
		 * colors
		 * @type {string[]}
		 * @public
		 */
		this.colors = product.colors

		/**
		 * altTxt
		 * @type {string}
		 * @public
		 */
		this.altTxt = product.altTxt

		/**
		 * price
		 * @type {number}
		 * @public
		 */
		this.price = product.price

		/**
		 * color
		 * @type {string}
		 * @public
		 */
		this.color = product.color

		/**
		 * quantity
		 * @type {number}
		 * @public
		 */
		this.quantity = product.quantity
	}

	/**
	 * Récupère l'id du produit instancié
	 * @return {string}
	 */
	get getID() {
		return this._id
	}

	/**
	 * Affiche le rendu d'un produit → Page d'accueil
	 * @return {string}
	 */
	renderProduct() {
		return `
			<a href="./product.html?id=${this._id}">
				<article>
					<img src="${this.imageUrl}" alt="${this.altTxt}">
					<h3 class="productName">${this.name}</h3>
					<p class="productDescription">${this.description}</p>
				</article>
			</a>
		`
	}

	/**
	 * Affiche le rendu d'un produit → Page panier
	 * @return {string}
	 */
	renderCart() {
		return `
			<article class="cart__item" data-id="${this._id}" data-color="${this.color}">
				<div class="cart__item__img">
					<img src="${this.imageUrl}" alt="${this.altTxt}">
				</div>
				<div class="cart__item__content">
					<div class="cart__item__content__description">
						<h2>${this.name}</h2>
						<p>${this.color}</p>
						<p>${Cart.formatPrice(this.price)} €</p>
					</div>
					<div class="cart__item__content__settings">
						<div class="cart__item__content__settings__quantity">
	            <p>Qté : </p>
	            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${this.quantity}">
	          </div>
	          <div class="cart__item__content__settings__delete">
	            <p class="deleteItem">Supprimer</p>
	          </div>
        	</div>
      	</div>
			</article>
		`
	}
}

export default Product