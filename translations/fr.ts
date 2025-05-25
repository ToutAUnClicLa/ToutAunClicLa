export default {
  nav: {
    home: "Accueil",
    products: "Produits",
    foods: "Cuisine",
    boutique: "Boutique",
    login: "Se connecter",
    profile: {
      myProfile: "Mon Profil",
      myOrders: "Mes Commandes",
      favorites: "Favoris",
      addresses: "Adresses",
      notifications: "Notifications",
      settings: "Paramètres",
      logout: "Déconnexion"
    }
  },
  footer: {
    about: {
      title: "Tout à un Clic LA",
      description: "Connecter les Amériques à travers des produits authentiques et des expériences uniques. Livraison dans tout Montréal, Québec et Canada."
    },
    explore: {
      title: "Explorer",
      home: "Accueil",
      products: "Produits",
      foods: "Cuisine",
      boutique: "Boutique"
    },
    popularProducts: {
      title: "Produits Populaires",
      flourAndDough: "Farine et Pâte",
      saucesAndDressings: "Sauces et Vinaigrettes",
      snacks: "Collations"
    },
    gastronomy: {
      title: "Gastronomie",
      northAmerica: "Amérique du Nord",
      centralAmerica: "Amérique Centrale",
      southAmerica: "Amérique du Sud",
      authenticRecipes: "Recettes Authentiques",
      specialIngredients: "Ingrédients Spéciaux"
    },    contact: {
      title: "Contact",
      address: "123 Rue Latino, Montréal, QC H1H 1H1, Canada",
      phone: "+1 (514) 123-4567",
      email: "info@toutaunclicla.com",
      contactNow: "Contactez-nous"
    },
    boutique: {
      clothing: "Vêtements",
      accessories: "Accessoires", 
      souvenirs: "Souvenirs"
    },
    company: {
      aboutUs: "Qui Sommes-nous",
      blog: "Blog Latino",
      terms: "Termes et Conditions",
      privacy: "Politique de Confidentialité",
      shipping: "Politique d'Expédition",
      faq: "Questions Fréquentes"
    },
    languages: {
      spanish: "Español",
      english: "English",
      french: "Français"
    },
    copyright: "© {year} Tout à un Clic LA. Tous droits réservés."
  },
  landing: {
    hero: {
      title: "Découvrez l'Amérique Latine",
      subtitle: "Produits authentiques et expériences uniques",
      description: "Notre boutique exclusive sera bientôt disponible, apportant les produits les plus authentiques de toutes les Amériques.",
      cta: "S'inscrire pour l'accès anticipé"
    },
    categories: {
      products: {
        title: "Produits",
        description: "Produits uniques d'Amérique Latine, de l'artisanat aux innovations modernes."
      },
      foods: {
        title: "Cuisine",
        description: "Gastronomie latino-américaine avec des recettes authentiques et des saveurs traditionnelles."
      },
      boutique: {
        title: "Boutique",
        description: "Souvenirs et cadeaux uniques qui capturent l'essence de chaque pays."
      }
    },
    sections: {
      products: {
        title: "Produits",
        description: "Explorez notre sélection soigneusement choisie de produits authentiques de toutes les Amériques. Chaque article raconte une histoire de tradition et d'artisanat.",
        viewAll: "Voir catalogue complet"
      },
      foods: {
        title: "Cuisine Traditionnelle",
        description: "Explorez notre collection de plats authentiques et de saveurs traditionnelles des différentes régions d'Amérique.",
        viewAll: "Voir catalogue complet"
      },
      boutique: {
        title: "Collection Boutique",
        description: "Découvrez notre collection exclusive d'articles artisanaux des Amériques",
        viewAll: "Voir catalogue complet"
      }
    },
    productCategories: [
      {
        id: 1,
        name: "Farines et Pâtes",
        description: "Découvrez nos farines et pâtes authentiques pour des préparations traditionnelles",
        image: "/harinasMasas.png",
        color: "from-indigo-600 to-blue-600",
        viewText: "Explorer farines et pâtes",
        subcategoria_id: "harinas-masas"
      },
      {
        id: 2,
        name: "Sauces et Vinaigrettes",
        description: "Rehaussez vos repas avec nos sauces et vinaigrettes authentiques",
        image: "/salsasAderezos.png",
        color: "from-rose-600 to-red-600",
        viewText: "Découvrir sauces et vinaigrettes",
        subcategoria_id: "salsas-aderezos"
      },
      {
        id: 3,
        name: "Produits et Collations",
        description: "Profitez de nos emballages et collations traditionnels d'Amérique",
        image: "/paquetesSnacks.png",
        color: "from-amber-600 to-yellow-600",
        viewText: "Voir produits et collations",
        subcategoria_id: "paquetes-snacks"
      }
    ],
    foodRegions: [
      {
        id: 1,
        name: "Amérique du Nord",
        description: "Explorez les saveurs des États-Unis, du Canada et du Mexique",
        image: "/norteAmerica.png",
        color: "from-red-600 to-rose-600",
        viewText: "Explorer saveurs du nord",
        subcategoria_id: "norte-america"
      },
      {
        id: 2,
        name: "Amérique Centrale et Caraïbes",
        description: "Découvrez la riche gastronomie des îles et de l'isthme centraméricain",
        image: "/centroAmerica.png",
        color: "from-emerald-600 to-green-600",
        viewText: "Découvrir saveurs tropicales",
        subcategoria_id: "centro-america-caribe"
      },
      {
        id: 3,
        name: "Amérique du Sud",
        description: "Découvrez les saveurs authentiques des pays comme la Colombie, le Pérou, l'Argentine et plus",
        image: "/surAmerica.png",
        color: "from-amber-600 to-yellow-600",
        viewText: "Voir saveurs sud-américaines",
        subcategoria_id: "sur-america"
      }
    ],
    boutiqueCategories: [
      {
        id: 1,
        name: "Vêtements et Accessoires",
        description: "Habillez-vous avec les meilleurs vêtements et accessoires traditionnels américains",
        image: "/ropaBoutique.png",
        color: "from-purple-600 to-indigo-600",
        viewText: "Explorer la collection",
        subcategoria_id: "ropa-accesorios"
      },
      {
        id: 2,
        name: "Accessoires Décoratifs",
        description: "Décorez votre maison avec des pièces artisanales américaines authentiques",
        image: "/accesoriosBoutique.png",
        color: "from-pink-600 to-rose-600",
        viewText: "Découvrir la décoration",
        subcategoria_id: "accesorios-decorativos"
      },
      {
        id: 3,
        name: "Souvenirs",
        description: "Emportez un morceau d'Amérique avec vous grâce à nos charmants souvenirs",
        image: "/souvenirBoutique.png",
        color: "from-amber-600 to-orange-600",
        viewText: "Voir souvenirs",
        subcategoria_id: "souvenirs"
      }
    ]
  },  auth: {
    acceptTerms: "J'accepte les",
    termsAndConditions: "Conditions d'Utilisation",
    and: "et la",
    privacyPolicy: "Politique de Confidentialité",
    acceptTermsRequired: "Vous devez accepter les conditions d'utilisation pour continuer",
    rememberMe: "Se souvenir de moi"
  }
};