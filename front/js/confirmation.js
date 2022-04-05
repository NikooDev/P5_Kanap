/**
 * Récupération de l'id de la commande
 */
(async () => {
	const element = document.querySelector('#orderId'),
		url = new URL(window.location.href)

	element.innerText = url.searchParams.get('orderId')
})()