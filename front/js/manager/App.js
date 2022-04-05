import Cart from './Cart.js'

/**
 * Configuration / Requêtes
 * @returns {JSON}
 */

export default class App {

	/**
	 * host
	 * @type {string}
	 */
	static host = 'http://localhost:3000'

	/**
	 * Prefix
	 * @type {string}
	 */
	static prefix = '/api/Products'

	/**
	 * Appel API
	 * @param id
	 * @return {Promise<JSON>}
	 */
	static async fetchProducts(id = null) {
		let url = this.host+this.prefix
		try {
			let products = await fetch(!id ? url : url+'/'+id)
			return products.json()
		} catch (e) {
			throw new Error('Vérifier si la propriété "host" dans config/App.js correspond bien à l\'url de l\'API et si le serveur est bien lancé. '+e.message)
		}
	}

	/**
	 *
	 * @return {Promise<void>}
	 */
	static async fetchPost(datas) {
		let url = this.host+this.prefix
		try {
			let result = await fetch(url+'/order', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(datas)
			})
			let { orderId } = await result.json(),
				redirection = new URL(window.location.href)

			redirection.pathname = redirection.pathname.replace(/cart.html$/, 'confirmation.html')
			redirection.searchParams.set('orderId', orderId)

			window.location.href = redirection.toString()
			Cart.clear()
		} catch (e) {
			throw new Error('Vérifier si la propriété "host" dans config/App.js correspond bien à l\'url de l\'API et si le serveur est bien lancé. '+e.message)
		}
	}
}