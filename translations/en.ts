export default {
  nav: {
    home: "Home",
    products: "Products",
    foods: "Foods",
    boutique: "Boutique",
    login: "Login",
    profile: {
      myProfile: "My Profile",
      myOrders: "My Orders",
      favorites: "Favorites",
      addresses: "Addresses",
      notifications: "Notifications",
      settings: "Settings",
      logout: "Logout"
    }
  },
  footer: {
    about: {
      title: "Tout à un Clic LA",
      description: "Connecting the Americas through authentic products and unique experiences. Delivery throughout Montreal, Quebec and Canada."
    },
    explore: {
      title: "Explore",
      home: "Home",
      products: "Products",
      foods: "Foods",
      boutique: "Boutique"
    },
    popularProducts: {
      title: "Popular Products",
      flourAndDough: "Flour and Dough",
      saucesAndDressings: "Sauces and Dressings",
      snacks: "Snacks"
    },
    gastronomy: {
      title: "Gastronomy",
      northAmerica: "North America",
      centralAmerica: "Central America",
      southAmerica: "South America",
      authenticRecipes: "Authentic Recipes",
      specialIngredients: "Special Ingredients"
    },    contact: {
      title: "Contact",
      address: "123 Latino Street, Montreal, QC H1H 1H1, Canada",
      phone: "+1 (514) 123-4567",
      email: "info@toutaunclicla.com",
      contactNow: "Contact Now"
    },
    boutique: {
      clothing: "Clothing",
      accessories: "Accessories", 
      souvenirs: "Souvenirs"
    },
    company: {
      aboutUs: "About Us",
      blog: "Latino Blog",
      terms: "Terms and Conditions",
      privacy: "Privacy Policy",
      shipping: "Shipping Policy",
      faq: "Frequently Asked Questions"
    },
    languages: {
      spanish: "Español",
      english: "English",
      french: "Français"
    },
    copyright: "© {year} Tout à un Clic LA. All rights reserved."
  },
  landing: {
    hero: {
      title: "Discover Latin America",
      subtitle: "Authentic products and unique experiences",
      description: "Our exclusive store will be available very soon, bringing the most authentic products from all the Americas.",
      cta: "Register for early access"
    },
    categories: {
      products: {
        title: "Products",
        description: "Unique products from Latin America, from crafts to modern innovations."
      },
      foods: {
        title: "Foods",
        description: "Latin American gastronomy with authentic recipes and traditional flavors."
      },
      boutique: {
        title: "Boutique",
        description: "Unique souvenirs and gifts that capture the essence of each country."
      }
    },
    sections: {
      products: {
        title: "Products",
        description: "Explore our carefully selected collection of authentic products from all across the Americas. Each item tells a story of tradition and craftsmanship.",
        viewAll: "View full catalog"
      },
      foods: {
        title: "Traditional Foods",
        description: "Explore our collection of authentic dishes and traditional flavors from the various regions of America.",
        viewAll: "View full catalog"
      },
      boutique: {
        title: "Boutique Collection",
        description: "Discover our exclusive collection of handcrafted items from the Americas",
        viewAll: "View full catalog"
      }
    },
    productCategories: [
      {
        id: 1,
        name: "Flour and Dough",
        description: "Discover our authentic flours and doughs for traditional preparations",
        image: "/harinasMasas.png",
        color: "from-indigo-600 to-blue-600",
        viewText: "Explore flour and dough",
        subcategoria_id: "harinas-masas"
      },
      {
        id: 2,
        name: "Sauces and Dressings",
        description: "Enhance your meals with our authentic sauces and dressings",
        image: "/salsasAderezos.png",
        color: "from-rose-600 to-red-600",
        viewText: "Discover sauces and dressings",
        subcategoria_id: "salsas-aderezos"
      },
      {
        id: 3,
        name: "Packages and Snacks",
        description: "Enjoy our traditional American packages and snacks",
        image: "/paquetesSnacks.png",
        color: "from-amber-600 to-yellow-600",
        viewText: "View packages and snacks",
        subcategoria_id: "paquetes-snacks"
      }
    ],
    foodRegions: [
      {
        id: 1,
        name: "North America",
        description: "Explore the flavors of the United States, Canada and Mexico",
        image: "/norteAmerica.png",
        color: "from-red-600 to-rose-600",
        viewText: "Explore northern flavors",
        subcategoria_id: "norte-america"
      },
      {
        id: 2,
        name: "Central America and Caribbean",
        description: "Discover the rich cuisine of the islands and the Central American isthmus",
        image: "/centroAmerica.png",
        color: "from-emerald-600 to-green-600",
        viewText: "Discover tropical flavors",
        subcategoria_id: "centro-america-caribe"
      },
      {
        id: 3,
        name: "South America",
        description: "Experience the authentic flavors of countries like Colombia, Peru, Argentina and more",
        image: "/surAmerica.png",
        color: "from-amber-600 to-yellow-600",
        viewText: "View South American flavors",
        subcategoria_id: "sur-america"
      }
    ],
    boutiqueCategories: [
      {
        id: 1,
        name: "Clothing and Accessories",
        description: "Dress with the best traditional American garments and accessories",
        image: "/ropaBoutique.png",
        color: "from-purple-600 to-indigo-600",
        viewText: "Explore collection",
        subcategoria_id: "ropa-accesorios"
      },
      {
        id: 2,
        name: "Decorative Accessories",
        description: "Decorate your home with authentic American craft pieces",
        image: "/accesoriosBoutique.png",
        color: "from-pink-600 to-rose-600",
        viewText: "Discover decoration",
        subcategoria_id: "accesorios-decorativos"
      },
      {
        id: 3,
        name: "Souvenirs",
        description: "Take a piece of America with you with our charming souvenirs",
        image: "/souvenirBoutique.png",
        color: "from-amber-600 to-orange-600",
        viewText: "View souvenirs",
        subcategoria_id: "souvenirs"
      }
    ]
  }
};