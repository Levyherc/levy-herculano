// Dados dos produtos
const products = {
    1: {
        id: 1,
        name: "Caderno Personalizado",
        price: 45.90,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
        description: "Caderno personalizado com capa dura, 200 páginas pautadas. Ideal para anotações, estudos ou presente especial. Personalize com seu nome ou frase favorita."
    },
    2: {
        id: 2,
        name: "Quadro Decorativo",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
        description: "Quadro decorativo moderno para sala ou quarto. Impressão em alta qualidade com moldura inclusa. Tamanho 30x40cm, pronto para pendurar."
    },
    3: {
        id: 3,
        name: "Caneca Personalizada",
        price: 29.90,
        image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
        description: "Caneca de porcelana branca 325ml com impressão personalizada. Resistente à lava-louças e microondas. Ideal para presente ou uso pessoal."
    },
    4: {
        id: 4,
        name: "Agenda Criativa",
        price: 52.90,
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
        description: "Agenda 2024 com design criativo e exclusivo. 12 meses de planejamento com seções especiais para metas, anotações e inspirações diárias."
    },
    5: {
        id: 5,
        name: "Kit Presente Especial",
        price: 125.90,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
        description: "Kit presente completo com caderno, caneca, marcador de páginas e embalagem especial. Perfeito para datas comemorativas e ocasiões especiais."
    },
    6: {
        id: 6,
        name: "Marcador de Páginas",
        price: 15.90,
        image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop",
        description: "Marcador de páginas em material resistente com design exclusivo. Conjunto com 3 unidades de diferentes cores e estampas."
    }
};

// Funções do carrinho
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const saved = localStorage.getItem('loja-criativa-cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('loja-criativa-cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(productId, quantity = 1) {
        const product = products[productId];
        if (!product) return false;

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        this.showAddedToCartMessage(product.name);
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item && quantity > 0) {
            item.quantity = quantity;
            this.saveCart();
            this.renderCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartCount() {
        const countElements = document.querySelectorAll('#cart-count');
        const count = this.getItemCount();
        countElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline' : 'none';
        });
    }

    showAddedToCartMessage(productName) {
        // Create toast message
        const toast = document.createElement('div');
        toast.className = 'success-message show';
        toast.textContent = `${productName} adicionado ao carrinho!`;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '9999';
        toast.style.maxWidth = '300px';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartSummary = document.getElementById('cart-summary');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartEmpty.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        cartItemsContainer.style.display = 'block';
        cartEmpty.style.display = 'none';
        cartSummary.style.display = 'block';

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Preço unitário: R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="cart.updateQuantity(${item.id}, parseInt(this.value))">
                    <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-price">
                    R$ ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" onclick="cart.removeItem(${item.id})">
                    Remover
                </button>
            </div>
        `).join('');

        this.updateCartSummary();
    }

    updateCartSummary() {
        const subtotal = this.getTotal();
        const shipping = subtotal >= 150 ? 0 : 15;
        const total = subtotal + shipping;

        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');
        const freeShippingNotice = document.getElementById('free-shipping-notice');

        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
        
        if (freeShippingNotice) {
            freeShippingNotice.style.display = shipping === 0 && subtotal > 0 ? 'block' : 'none';
        }
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        const total = this.getTotal() + (this.getTotal() >= 150 ? 0 : 15);
        alert(`Obrigado pela sua compra!\n\nTotal: R$ ${total.toFixed(2)}\n\nEm breve você receberá um e-mail com os detalhes do pedido.`);
        
        // Limpar carrinho após "compra"
        this.items = [];
        this.saveCart();
        this.renderCart();
    }
}

// Inicializar carrinho
const cart = new ShoppingCart();

// Navegação mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Página do produto individual
    if (window.location.pathname.includes('produto.html')) {
        loadProductDetail();
    }

    // Página do carrinho
    if (window.location.pathname.includes('carrinho.html')) {
        cart.renderCart();
        
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => cart.checkout());
        }
    }

    // Formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Carregar detalhes do produto
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products[productId];

    if (!product) {
        document.querySelector('.container').innerHTML = '<h1>Produto não encontrado</h1>';
        return;
    }

    // Atualizar elementos da página
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-price').textContent = `R$ ${product.price.toFixed(2)}`;
    document.getElementById('product-desc').textContent = product.description;
    document.title = `${product.name} - Loja Criativa`;

    // Controles de quantidade
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });

    // Botão adicionar ao carrinho
    document.getElementById('add-to-cart').addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        cart.addItem(parseInt(productId), quantity);
    });
}

// Formulário de contato
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simular envio do formulário
    console.log('Dados do formulário:', data);
    
    // Mostrar mensagem de sucesso
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message show';
    successMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
    
    e.target.parentNode.insertBefore(successMessage, e.target);
    
    // Limpar formulário
    e.target.reset();
    
    // Remover mensagem após 5 segundos
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animações ao fazer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
});