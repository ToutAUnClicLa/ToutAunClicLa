export default {
  nav: {
    home: "Accueil",
    products: "Produits",
    foods: "Cuisine",
    boutique: "Boutique",
    login: "Se connecter",
    profile: {
      myProfile: "Mon Profil",
      addresses: "Adresses",
      favorites: "Favoris",
      myOrders: "Commandes",
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
    // Titres des modales
    loginTitle: "Se Connecter",
    registerTitle: "Créer un Compte",
    forgotPasswordTitle: "Réinitialiser le Mot de Passe",
    
    // Descriptions
    loginDescription: "Bon retour sur Tout À un clic là",
    registerDescription: "Rejoignez notre communauté",
    forgotPasswordDescription: "Nous vous enverrons un lien pour réinitialiser votre mot de passe",
    
    // Labels des champs
    fullName: "Nom complet",
    email: "Adresse e-mail",
    phone: "Téléphone (optionnel)",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    
    // Placeholders
    fullNamePlaceholder: "Votre nom complet",
    emailPlaceholder: "vous@exemple.com",
    phonePlaceholder: "Votre numéro de téléphone",
    passwordPlaceholder: "Votre mot de passe",
    passwordRegisterPlaceholder: "Minimum 6 caractères",
    confirmPasswordPlaceholder: "Répétez votre mot de passe",
    
    // Boutons
    loginButton: "Se connecter",
    registerButton: "Créer un compte",
    forgotPasswordButton: "Envoyer le lien",
    continueWithGoogle: "Continuer avec Google",
    
    // États de chargement
    loggingIn: "Connexion en cours...",
    creatingAccount: "Création du compte...",
    sendingLink: "Envoi du lien...",
    
    // Séparateur
    orContinueWith: "Ou continuer avec",
    
    // Checkbox et conditions
    acceptTerms: "J'accepte les",
    termsAndConditions: "Conditions d'Utilisation",
    and: "et la",
    privacyPolicy: "Politique de Confidentialité",
    acceptTermsRequired: "Vous devez accepter les conditions d'utilisation pour continuer",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié ?",
    
    // Liens du footer
    noAccount: "Vous n'avez pas de compte ?",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    signUp: "S'inscrire",
    signIn: "Se connecter",
    backToLogin: "Retour à la connexion",
    
    // Messages d'erreur communs
    emailRequired: "L'e-mail est requis",
    emailInvalid: "E-mail invalide",
    passwordRequired: "Le mot de passe est requis",
    passwordInvalid: "Le mot de passe doit contenir au moins 6 caractères, une lettre et un chiffre",
    passwordsMismatch: "Les mots de passe ne correspondent pas",
    nameRequired: "Le nom est requis",
    emailAlreadyExists: "Cet e-mail est déjà enregistré. Essayez de vous connecter.",
    emailNotRegistered: "Cet e-mail n'est pas enregistré. Essayez de créer un compte.",
    errorCheckingEmail: "Erreur lors de la vérification de l'e-mail",
    generalError: "Une erreur s'est produite",
    
    // Messages de succès
    welcomeBack: "Bon retour !",
    accountCreated: "Compte créé avec succès. Veuillez vérifier votre e-mail.",
    passwordResetSent: "Un lien a été envoyé à votre e-mail pour réinitialiser votre mot de passe",
    redirecting: "Redirection...",
    googleAuthError: "Erreur lors de la connexion avec Google",
    
    // Vérification
    verificationRequired: "Votre compte nécessite une vérification. Veuillez vérifier votre e-mail pour terminer le processus ou demander un nouvel e-mail de vérification.",
    invalidCredentials: "Identifiants invalides. Vérifiez votre e-mail et mot de passe.",
    resendVerification: "Souhaitez-vous que nous envoyions un nouvel e-mail de vérification ?",
    verificationSent: "Nouvel e-mail de vérification envoyé. Veuillez vérifier votre boîte de réception.",
    verificationError: "Erreur lors de l'envoi de l'e-mail de vérification",
    
    // Labels Aria
    closeModal: "Fermer",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe"
  },
    // Nouvelles traductions pour la navbar mobile
  navbar: {
    welcome: "Bienvenue !",
    accessYourAccount: "Accédez à votre compte pour commencer",
    loginButton: "Se Connecter",
    createAccountButton: "Créer un Compte",
    logoutButton: "Se déconnecter",
    
    // États de vérification
    pendingVerification: "Vérification en attente",
    unverifiedAccount: "Compte non vérifié",
    accountNeedsVerification: "Votre compte nécessite une vérification",
    
    // Sections du menu
    mainMenu: "Menu Principal",
    myAccount: "Mon Compte",
    quickAccess: "Accès Rapide",
    
    // Liens rapides
    favorites: "Favoris",
    orders: "Commandes",
    addresses: "Adresses",
      // Messages système
    logoutSuccess: "Déconnexion réussie",
    logoutError: "Erreur lors de la déconnexion",
    languageChanged: "Langue changée en"
  },
  
  // Traductions pour le catalogue de produits
  catalog: {
    // ProductCard
    productCard: {
      addToCart: "Ajouter au panier",
      addingToCart: "Ajout en cours...",
      addToFavorites: "Ajouter aux favoris",
      removeFromFavorites: "Retirer des favoris",
      outOfStock: "En rupture de stock",
      rating: "Note",
      reviews: "avis",
      quickView: "Aperçu rapide",
      seeDetails: "Voir les détails",
      originalPrice: "Prix original",
      discountedPrice: "Prix réduit",
      savings: "Vous économisez",
      freeShipping: "Livraison gratuite",
      limitedStock: "Stock limité",
      newProduct: "Nouveau",
      bestseller: "Bestseller",
      featured: "En vedette"
    },
    
    // ProductList
    productList: {
      // Titres des pages
      productsTitle: "Nos Produits",
      productsSubtitle: "Découvrez la meilleure sélection de produits latino-américains",
      comidasTitle: "Cuisine Traditionnelle",
      comidasSubtitle: "Saveurs authentiques de toute l'Amérique Latine - Gastronomie traditionnelle à Montréal",
      boutiqueTitle: "Boutique",
      boutiqueSubtitle: "Artisanat et souvenirs uniques - Produits artisanaux latino-américains",
      
      // Filtres
      filters: "Filtres",
      search: "Rechercher des produits",
      searchPlaceholder: "Rechercher par nom...",
      category: "Catégorie",
      allCategories: "Toutes les catégories",
      subcategory: "Sous-catégorie",
      allSubcategories: "Toutes les sous-catégories",
      priceRange: "Gamme de prix",
      minPrice: "Prix minimum",
      maxPrice: "Prix maximum",
      sortBy: "Trier par",
      clearFilters: "Effacer les filtres",
      applyFilters: "Appliquer les filtres",
      hideFilters: "Masquer les filtres",
      showFilters: "Afficher les filtres",
      
      // Options de tri
      sortOptions: {
        nameAsc: "Nom (A-Z)",
        nameDesc: "Nom (Z-A)",
        priceAsc: "Prix (croissant)",
        priceDesc: "Prix (décroissant)",
        ratingDesc: "Mieux notés",
        newest: "Plus récents",
        bestselling: "Meilleures ventes"
      },
      
      // États de chargement et vides
      loading: "Chargement des produits...",
      noProducts: "Aucun produit trouvé",
      noProductsMessage: "Aucun produit ne correspond aux filtres sélectionnés.",
      tryDifferentFilters: "Essayez d'ajuster vos filtres ou de rechercher autre chose.",
      loadMore: "Charger plus",
      showingResults: "Affichage de {count} sur {total} produits",
      
      // Avantages
      benefits: {
        fastDelivery: {
          title: "Livraison Rapide",
          description: "Recevez votre commande en 24-48h"
        },
        qualityGuarantee: {
          title: "Garantie Qualité",
          description: "100% produits authentiques"
        },
        freeShipping: {
          title: "Livraison Gratuite",
          description: "Sur les commandes de plus de 200$"
        },
        securePayment: {
          title: "Paiement Sécurisé",
          description: "Transactions protégées"
        },
        customerSupport: {
          title: "Support 24/7",
          description: "Nous sommes là pour vous aider"
        }
      },
      
      // Messages de succès et d'erreur
      messages: {
        addedToCart: "Produit ajouté au panier",
        addedToFavorites: "Ajouté aux favoris",
        removedFromFavorites: "Retiré des favoris",
        errorAddingToCart: "Erreur lors de l'ajout au panier",
        errorTogglingFavorite: "Erreur lors de la mise à jour des favoris",
        loginRequired: "Vous devez vous connecter pour continuer"
      }
    },
    
    // ProductDetail
    productDetail: {
      // Informations produit
      productInfo: "Informations produit",
      description: "Description",
      specifications: "Spécifications",
      reviews: "Avis",
      shipping: "Livraison",
      returns: "Retours",
      
      // Actions
      addToCart: "Ajouter au panier",
      buyNow: "Acheter maintenant",
      addToFavorites: "Ajouter aux favoris",
      removeFromFavorites: "Retirer des favoris",
      shareProduct: "Partager le produit",
      
      // Détails
      price: "Prix",
      originalPrice: "Prix original",
      discount: "Remise",
      stock: "Stock disponible",
      sku: "SKU",
      category: "Catégorie",
      brand: "Marque",
      weight: "Poids",
      dimensions: "Dimensions",
      
      // États
      inStock: "En stock",
      outOfStock: "En rupture de stock",
      limitedStock: "Stock limité",
      preOrder: "Pré-commande",
      
      // Quantité
      quantity: "Quantité",
      increase: "Augmenter la quantité",
      decrease: "Diminuer la quantité",
      maxQuantity: "Quantité maximale disponible: {max}",
      unitsAvailable: "unités disponibles",
      
      // Galerie d'images
      mainImage: "Image principale",
      additionalImages: "Images supplémentaires",
      zoomImage: "Agrandir l'image",
      previousImage: "Image précédente",
      nextImage: "Image suivante",
      
      // Produits connexes
      relatedProducts: "Produits connexes",
      youMayAlsoLike: "Vous pourriez aussi aimer",
      similarProducts: "Produits similaires",
      seeMore: "Voir plus",
      loading: "Chargement...",
      
      // Avantages spécifiques du produit
      authentic: "100% Authentique",
      originalProduct: "Produit original",
      securePayment: "Paiement sécurisé",
      fastShipping: "Livraison rapide",
      qualityGuaranteed: "Qualité garantie",
      
      // Avis
      customerReviews: "Avis clients",
      writeReview: "Rédiger un avis",
      stars: "étoiles",
      helpful: "Utile",
      notHelpful: "Pas utile",
      verifiedPurchase: "Achat vérifié",
      
      // Livraison
      shippingInfo: "Informations de livraison",
      estimatedDelivery: "Livraison estimée",
      shippingCost: "Coût de livraison",
      freeShippingOn: "Livraison gratuite sur les commandes de",
      
      // Fil d'Ariane
      home: "Accueil",
      backToCategory: "Retour à {category}",
      
      // Messages
      addedToCart: "Produit ajouté au panier avec succès",
      errorAddingToCart: "Erreur lors de l'ajout du produit au panier",
      addedToFavorites: "Produit ajouté aux favoris",
      removedFromFavorites: "Produit retiré des favoris",
      errorTogglingFavorite: "Erreur lors de la mise à jour des favoris",
      loginToAddToCart: "Connectez-vous pour ajouter des produits au panier",
      loginToAddToFavorites: "Connectez-vous pour ajouter des produits aux favoris",
      errorLoadingProduct: "Erreur lors du chargement du produit",
      productNotFound: "Produit non trouvé"
    }
  },
  
  // SEO et métadonnées
  seo: {
    products: {
      title: "Produits Latino-Américains Authentiques | Tout à un Clic LA",
      description: "Découvrez la meilleure sélection de produits latino-américains à Montréal. Farines, pâtes, sauces, vinaigrettes et plus. Livraison gratuite +200$. Commandez maintenant!",
      keywords: "produits latino-américains Montréal, farines traditionnelles, sauces authentiques, vinaigrettes latinos, produits Amérique Latine Canada"
    },
    comidas: {
      title: "Cuisine Traditionnelle Latino-Américaine | Livraison Montréal | Tout à un Clic LA",
      description: "Cuisine authentique d'Amérique Latine à Montréal. Saveurs du Mexique, Colombie, Pérou, Argentine et plus. Livraison rapide. Commandez votre cuisine latino préférée!",
      keywords: "cuisine latino Montréal, livraison cuisine latino-américaine, restaurant latino Montréal, cuisine mexicaine, cuisine colombienne, cuisine péruvienne Québec"
    },
    boutique: {
      title: "Boutique Artisanale Latino-Américaine | Souvenirs & Cadeaux | Montréal",
      description: "Boutique exclusive avec artisanat, vêtements traditionnels et souvenirs d'Amérique Latine à Montréal. Produits uniques et authentiques. Trouvez le cadeau parfait!",
      keywords: "boutique latino Montréal, artisanat latino-américain, souvenirs Amérique Latine, vêtements traditionnels, cadeaux uniques, magasin latino Québec"
    }
  }
};