// checkout-loader.js

let cachedCheckout = null;

export function openCheckout() {
	const home = document.getElementById('home');
	const about = document.getElementById('about');
	const cartPanel = document.querySelector('.cart-panel');
	const cartOverlay = document.getElementById('cartOverlay');
	const checkout = document.getElementById('checkoutContainer');

	if (home) home.style.display = 'none';
	if (about) about.style.display = 'none';
	if (cartPanel) cartPanel.style.display = 'none';
	if (cartOverlay) cartOverlay.style.display = 'none';

	if (cachedCheckout) {
		checkout.innerHTML = cachedCheckout;
		checkout.classList.add('visible');
		runCheckoutScripts();
		return;
	}

	fetch('checkout.html')
		.then(response => response.text())
		.then(html => {
			cachedCheckout = html;
			checkout.innerHTML = html;
			checkout.classList.add('visible');
			runCheckoutScripts();
		})
		.catch(error => {
			console.error('Failed to load checkout:', error);
			checkout.innerHTML = "<p>Failed to load checkout page.</p>";
		});
}

function runCheckoutScripts() {
	const scripts = document.querySelectorAll('#checkoutContainer script');
	scripts.forEach(oldScript => {
		const newScript = document.createElement('script');
		newScript.text = oldScript.textContent;
		document.body.appendChild(newScript);
		oldScript.remove();
	});
}
