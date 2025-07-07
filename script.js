	// GAUVEL JS - With Navbar Fix for Auth Flicker

	let cart = [];
	const selectedSizes = {};
	const selectedPrices = {};

	document.addEventListener('DOMContentLoaded', () => {
	  const productBlocks = document.querySelectorAll('.product__card');

	  productBlocks.forEach(block => {
		const album = block.querySelector('.product__album');
		const images = album ? album.querySelectorAll('.thumb') : [];
		const prevBtn = block.querySelector('.nav-arrow.prev');
		const nextBtn = block.querySelector('.nav-arrow.next');

		if (!album || images.length === 0) return;

		let currentIndex = 0;

		function showImage(index) {
		  images.forEach((img, i) => {
			img.style.display = (i === index) ? 'block' : 'none';
		  });
		}

		showImage(currentIndex);

		if (prevBtn) {
		  prevBtn.addEventListener('click', () => {
			currentIndex = (currentIndex - 1 + images.length) % images.length;
			showImage(currentIndex);
		  });
		}

		if (nextBtn) {
		  nextBtn.addEventListener('click', () => {
			currentIndex = (currentIndex + 1) % images.length;
			showImage(currentIndex);
		  });
		}
	  });
	});

	function formatCurrency(amount) {
	  return new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP'
	  }).format(amount);
	}

	function selectSize(productId, price, button) {
	  selectedSizes[productId] = button.textContent.split(' - ')[0];
	  selectedPrices[productId] = price;

	  const buttons = document.querySelectorAll(`#${productId}-buttons .size-button`);
	  buttons.forEach(btn => btn.classList.remove('active'));
	  button.classList.add('active');
	}

	function openCart() {
	  const overlay = document.getElementById('cartOverlay');
	  const panel = document.querySelector('.cart-panel');
	  if (overlay && panel) {
		overlay.style.display = 'block';
		panel.classList.add('open');
		updateCartDisplay();
	  }
	}

	function closeCart() {
	  const overlay = document.getElementById('cartOverlay');
	  const panel = document.querySelector('.cart-panel');
	  if (overlay && panel) {
		overlay.style.display = 'none';
		panel.classList.remove('open');
	  }
	}

	function updateCartDisplay() {
	  const cartContent = document.querySelector('.cart-content');
	  const checkoutBtn = document.querySelector('.checkout-btn-mini');

	  if (!cartContent) return;

	  cartContent.innerHTML = '';

	  if (cart.length === 0) {
		cartContent.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
		if (checkoutBtn) {
		  checkoutBtn.disabled = true;
		  checkoutBtn.style.opacity = "0.5";
		}
		return;
	  }

	  cart.forEach(item => {
		const itemEl = document.createElement('div');
		itemEl.classList.add('cart-item-mini');
		itemEl.innerHTML = `
		  <div class="item-info">
			<h4>${item.name} (${item.size})</h4>
			<p>${item.quantity} pcs</p>
		  </div>
		  <div class="item-price-qty">
			<div class="price">${formatCurrency(item.price * item.quantity)}</div>
			<div class="qty">${formatCurrency(item.price)} x ${item.quantity}</div>
			<button class="remove-btn" onclick="removeFromCart('${item.id}', '${item.size}')">Remove</button>
		  </div>
		`;
		cartContent.appendChild(itemEl);
	  });

	  if (checkoutBtn) {
		checkoutBtn.disabled = false;
		checkoutBtn.style.opacity = "1";
	  }
	}

	function removeFromCart(productId, size) {
	  const index = cart.findIndex(item => item.id === productId && item.size === size);
	  if (index !== -1) {
		cart.splice(index, 1);
		saveCart();
		updateCartDisplay();
		updateCartCount();
	  }
	}

	function saveCart() {
	  localStorage.setItem('cart', JSON.stringify(cart));
	}

	function loadCart() {
	  const savedCart = JSON.parse(localStorage.getItem('cart'));
	  if (Array.isArray(savedCart)) {
		cart = savedCart;
		updateCartCount();
		updateCartDisplay();
	  }
	}

	function updateCartCount() {
	  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
	  const countEl = document.getElementById('cartCount');
	  if (countEl) {
		countEl.textContent = totalCount;
	  }
	}

	document.addEventListener('DOMContentLoaded', () => {
	  document.querySelectorAll('.add-to-cart').forEach(button => {
		button.addEventListener('click', () => {
		  const productId = button.dataset.id;
		  const productName = button.dataset.name;
		  const price = selectedPrices[productId];
		  const size = selectedSizes[productId];

		  if (!price || !size) {
			alert("Please select a size before adding to cart.");
			return;
		  }

		  const existing = cart.find(item => item.id === productId && item.size === size);
		  if (existing) {
			existing.quantity += 1;
		  } else {
			cart.push({ id: productId, name: productName, price, size, quantity: 1 });
		  }

		  saveCart();
		  updateCartCount();
		  updateCartDisplay();
		  openCart();
		});
	  });

	  loadCart();
	});

	// Firebase config and init
	const firebaseConfig = {
	  apiKey: "AIzaSyD9aQYJduGX-IBnCGvxYBQHCrZH05GAhoY",
	  authDomain: "gauvelfragrance-80197.firebaseapp.com",
	  projectId: "gauvelfragrance-80197",
	  storageBucket: "gauvelfragrance-80197.appspot.com",
	  messagingSenderId: "116770427568",
	  appId: "1:116770427568:web:16373de8c306a1b771e175",
	  measurementId: "G-EG12NGJSYS"
	};

	firebase.initializeApp(firebaseConfig);
	const auth = firebase.auth();
	const db = firebase.firestore();

	async function updateNavbar(user) {
	  const authButton = document.getElementById('authButton');
	  if (!authButton) return;

	  console.log("Firebase auth state detected:", user);

	  if (user) {
		try {
		  const userDoc = await db.collection("users").doc(user.uid).get();
		  let displayName = user.email.split('@')[0];
		  if (userDoc.exists && userDoc.data().name) {
			displayName = userDoc.data().name.split(" ")[0];
		  }

		  authButton.innerHTML = `
			<span style="color: #333333; font-size: 20px;">👤</span>
			<span>${displayName}</span>
		  `;
		  authButton.href = 'profile.html';
		  authButton.classList.remove('auth-button');
		  authButton.classList.add('profile-button');
		} catch (err) {
		  console.error("Error getting user data:", err);
		}
	  } else {
		authButton.innerHTML = 'Sign In/Sign Up';
		authButton.href = 'signup.html';
		authButton.classList.remove('profile-button');
		authButton.classList.add('auth-button');
	  }

	  // Reveal the button once user state is handled
	  authButton.classList.add('loaded');
	}

	document.addEventListener('DOMContentLoaded', () => {
	  if (typeof firebase !== 'undefined' && firebase.auth) {
		firebase.auth().onAuthStateChanged(async (user) => {
		  await updateNavbar(user);
		});
	  }
	});
 // Mobile menu functionality
        document.addEventListener('DOMContentLoaded', () => {
            const toggle = document.querySelector('.navbar__toggle');
            const mobileMenu = document.querySelector('.navbar__mobile-menu');
            const overlay = document.querySelector('.navbar__overlay');
            const closeBtn = document.querySelector('.navbar__mobile-close');

            if (toggle && mobileMenu && overlay && closeBtn) {
                toggle.addEventListener('click', () => {
                    toggle.classList.toggle('active');
                    mobileMenu.classList.toggle('active');
                    overlay.classList.toggle('active');
                });

                overlay.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    overlay.classList.remove('active');
                });

                closeBtn.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
        });
