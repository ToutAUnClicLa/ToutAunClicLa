export default {
  // Traductions communes
  common: {
    loading: "Chargement",
    error: "Erreur",
    success: "Succès",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    back: "Retour",
    close: "Fermer",
    confirm: "Confirmer",
    yes: "Oui",
    no: "Non",
    update: "Mettre à jour",
    create: "Créer",
    dateNotAvailable: "Date non disponible"
  },
  nav: {
    home: "Accueil",
    products: "Épicerie",
    foods: "Cuisine",
    boutique: "Boutique",
    login: "Se connecter",
    profile: {
      myProfile: "Mon Profil",
      addresses: "Adresses",
      favorites: "Favoris",
      myOrders: "Commandes",
      security: "Sécurité",
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
      address: "1614 Av Bourbonnière Montreal Quebec. H1W3N4",
      email: "serviceclient@toutaunclicla.com",
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
      description: "Notre boutique en ligne exclusive sera disponible le 28 août, apportant les produits les plus authentiques de toutes les Amériques.",
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
      },
      {
        id: 12,
        name: "Boissons",
        description: "Rafraîchissez-vous avec nos boissons authentiques des Amériques",
        image: "/bebidas.png",
        color: "from-cyan-600 to-blue-600",
        viewText: "Explorer boissons",
        subcategoria_id: "bebidas"
      }
    ],
    panamericanFood: {
      id: 1,
      name: "Cuisine Panaméricaine",
      description: "Découvrez nos restaurants partenaires qui vous apportent la cuisine authentique de tout le continent américain, préparée avec des recettes traditionnelles et des saveurs uniques.",
      color: "from-amber-600 to-yellow-600",
      viewText: "Explorer restaurants"
    },
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
        id: 2,
        name: "Accessoires Décoratifs",
        description: "Décorez votre maison avec des pièces artisanales américaines authentiques",
        image: "/accesoriosBoutique.png",
        color: "from-pink-600 to-rose-600",
        viewText: "Découvrir la décoration",
        subcategoria_id: "accesorios"
      },
      {
        id: 3,
        name: "Souvenirs",
        description: "Emportez un morceau d'Amérique avec vous grâce à nos charmants souvenirs",
        image: "/souvenirBoutique.png",
        color: "from-amber-600 to-orange-600",
        viewText: "Voir souvenirs",
        subcategoria_id: "souvenirs"
      },
            {
        id: 1,
        name: "Vêtements",
        description: "Habillez-vous avec les meilleurs vêtements traditionnels américains",
        image: "/ropaBoutique.png",
        color: "from-purple-600 to-indigo-600",
        viewText: "Explorer la collection",
        subcategoria_id: "ropa"
      }
    ]
  },

  // Panier d'achat
  cart: {
    title: "Panier d'Achat",
    subtitle: "Produits sélectionnés",
    product: "produit",
    products: "produits",
    estimatedTotal: "Total estimé",
    shipping: "expédition",
    freeShipping: "Livraison gratuite",
    loading: "Chargement du panier...",
    noCategory: "Sans catégorie",
    perUnit: "par unité",
    stock: "Stock",
    empty: {
      title: "Votre panier est vide",
      description: "Ajoutez des produits pour commencer vos achats !",
      exploreProducts: "Explorer les produits"
    },
    categories: {
      productos: "Produits",
      comidas: "Cuisine",
      boutique: "Boutique"
    },
    summary: {
      title: "Résumé de la Commande",
      subtotal: "Sous-total",
      shipping: "Expédition",
      taxes: "TVQ + TPS (5% + 9.975%)",
      consigne: "Consigne",
      total: "Total",
      freeShipping: "Gratuit",
      nonTaxable: "Non Taxable",
      shippingThreshold: "Ajoutez {amount} de plus pour la livraison gratuite",
      proceed: "Procéder au Paiement",
      continue: "Continuer les Achats",
      authRequired: "Connectez-vous pour continuer",
      addressRequired: "Sélectionner une adresse"
    },
    success: {
      quantityUpdated: "Quantité mise à jour",
      productRemoved: "Produit supprimé",
      cartCleared: "Panier vidé"
    },
    errors: {
      updateQuantity: "Erreur lors de la mise à jour de la quantité",
      removeProduct: "Erreur lors de la suppression du produit",
      clearCart: "Erreur lors du vidage du panier",
      selectAddress: "Vous devez sélectionner une adresse",
      emptyCart: "Votre panier est vide"
    },
    auth: {
      title: "Connectez-vous pour continuer",
      description: "Pour procéder à votre achat, vous devez vous connecter ou créer un compte",
      login: "Se connecter",
      register: "Créer un compte"
    }
  },

  // Favoris
  favorites: {
    title: "Mes Favoris",
    subtitle: "Produits que vous aimez",
    headerTitle: "Vos favoris",
    headerSubtitle: "Vous n'avez pas encore de favoris",
    headerSubtitleWithCount: "Produits que vous aimez",
    loading: {
      title: "Chargement des favoris...",
      description: "Nous préparons vos produits favoris"
    },
    empty: {
      title: "Aucun favori pour le moment",
      description: "Découvrez nos produits incroyables et ajoutez-en à vos favoris",
      button: "Explorer les produits"
    },
    items: {
      addToCart: "Ajouter",
      remove: "Retirer des favoris",
      view: "Voir",
      outOfStock: "Épuisé",
      price: "Prix",
      stock: "Seulement",
      noCategory: "Sans catégorie",
      addedDate: "Ajouté le",
      categories: {
        productos: "Produits",
        comidas: "Cuisine",
        boutique: "Boutique"
      }
    },
    stats: {
      favorites: "Favoris",
      categories: "Catégories",
      available: "Disponibles",
      product: "produit",
      products: "produits"
    },
    buttons: {
      back: "Retour",
      explore: "Explorer"
    },
    messages: {
      added: "Ajouté aux favoris",
      removed: "Produit retiré des favoris",
      addedToCart: "Produit ajouté au panier",
      errorAdd: "Erreur lors de l'ajout au panier",
      errorRemove: "Erreur lors de la suppression des favoris",
      outOfStock: "Produit épuisé",
      authRequired: "Vous devez vous connecter pour voir les favoris"
    },
    auth: {
      title: "Connectez-vous !",
      description: "Pour voir et gérer vos produits favoris, vous devez vous connecter",
      login: "Se connecter",
      register: "Créer un compte"
    }
  },

  // Adresses
  addresses: {
    title: "Mes Adresses",
    subtitle: "Gérez vos adresses de livraison",
    addNew: "Nouvelle adresse",
    addAddress: "Ajouter une adresse",
    editAddress: "Modifier l'adresse",
    deleteAddress: "Supprimer l'adresse",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cette adresse?",
    noAddresses: "Vous n'avez aucune adresse enregistrée",
    noAddressesDesc: "Ajoutez votre première adresse pour faciliter vos achats futurs",
    addFirstAddress: "Ajouter première adresse",
    
    // Sélecteur d'adresses
    selector: {
      title: "Adresse de Livraison",
      add: "Ajouter",
      deliveryInfo: "Livraisons dans la région métropolitaine de Montréal",
      deliveryNote: "Nous validons que l'adresse se trouve dans la région métropolitaine de Montréal",
      montrealOnly: "Adresses de Montréal seulement",
      validationNote: "Nous validons que la ville est Montréal et que le code postal est valide (H1A-H5B)"
    },
    
    // Formulaire
    form: {
      street: "Adresse *",
      streetPlaceholder: "Ex: 1234 Rue Sainte-Catherine",
      city: "Ville",
      cityPlaceholder: "Montréal",
      state: "Province",
      statePlaceholder: "Québec",
      zipCode: "Code postal",
      zipCodePlaceholder: "H3X 3X3",
      country: "Pays",
      countryPlaceholder: "Canada",
      deliveryArea: "Zone de livraison",
      deliveryAreaNote: "Livraisons seulement dans la région métropolitaine de Montréal",
      save: "Enregistrer l'adresse",
      saving: "Enregistrement...",
      cancel: "Annuler"
    },
    
    // Validation
    validation: {
      invalid: "Adresse non valide",
      required: "Ce champ est requis",
      streetRequired: "L'adresse est requise",
      countryRequired: "Le pays est requis",
      montrealOnly: "Seules les adresses de Montréal sont autorisées",
      validationInfo: "Nous validons que la ville est Montréal et que le code postal est valide"
    },
    
    // Messages de succès
    success: {
      created: "Adresse créée",
      createdDesc: "L'adresse a été créée avec succès",
      updated: "Adresse mise à jour",
      updatedDesc: "L'adresse a été mise à jour avec succès",
      deleted: "Adresse supprimée",
      deletedDesc: "L'adresse a été supprimée avec succès",
      primarySet: "Adresse principale définie",
      primarySetDesc: "L'adresse a été marquée comme principale"
    },
    
    // Messages d'erreur
    errors: {
      loadFailed: "Erreur lors du chargement des adresses",
      loadFailedDesc: "Nous n'avons pas pu charger vos adresses",
      saveFailed: "Erreur lors de l'enregistrement",
      saveFailedDesc: "Nous n'avons pas pu enregistrer l'adresse",
      deleteFailed: "Erreur lors de la suppression",
      deleteFailedDesc: "Nous n'avons pas pu supprimer l'adresse",
      primaryFailed: "Erreur lors de la définition de l'adresse principale",
      primaryFailedDesc: "Nous n'avons pas pu définir l'adresse comme principale",
      selectFailed: "Erreur lors de la sélection de l'adresse"
    },
    
    // Statistiques
    stats: {
      total: "Total des adresses",
      main: "Adresse principale",
      delivery: "Adresses de livraison"
    },

    // Actions
    actions: {
      edit: "Modifier",
      delete: "Supprimer",
      addressTitle: "Adresse",
      setPrimary: "Définir comme principal",
      primary: "Principal"
    },

    // Villes
    cities: {
      montreal: "Montréal"
    }
  },

  // Vérification d'email (modal)
  verification: {
    title: "Vérifier l'Email",
    subtitle: "Vérifiez votre compte pour continuer",
    description: "Entrez le code à 6 chiffres envoyé à votre email",
    form: {
      codeLabel: "Code de vérification",
      codePlaceholder: "123456",
      verifyButton: "Vérifier",
      verifying: "Vérification...",
      resendButton: "Vous n'avez pas reçu le code ? Renvoyer",
      resending: "Renvoi..."
    },
    messages: {
      success: "Email vérifié avec succès !",
      error: "Code de vérification invalide",
      resent: "Code renvoyé à votre email",
      resendError: "Erreur lors du renvoi du code",
      expired: "Le code a expiré. Demandez-en un nouveau",
      required: "Entrez le code à 6 chiffres",
      invalidLength: "Le code doit contenir 6 chiffres"
    }
  },

  // Section profil utilisateur
  profile: {
    general: {
      title: "Mon Profil",
      subtitle: "Gérez votre compte et vos préférences",
      memberSince: "Membre depuis",
      editProfile: "Modifier le profil",
      verified: "Vérifié",
      pendingVerification: "Vérification en attente",
      needsHelp: "Besoin d'aide ?",
      supportText: "Si vous avez des questions ou des problèmes, notre équipe de support est là pour vous aider.",
      contactSupport: "Contacter le support",
      manageAccount: "Gérer le compte",
      welcome: "Bonjour,",
      faq: "Questions fréquemment posées"
    },
    navigation: {
      profile: "Profil",
      favorites: "Favoris",
      addresses: "Adresses",
      orders: "Commandes",
      security: "Sécurité", 
      settings: "Paramètres"
    },
    stats: {
      favorites: "Produits favoris",
      addresses: "Adresses sauvegardées",
      orders: "Commandes passées"
    },
    sections: {
      favorites: {
        title: "Favoris",
        description: "Produits que vous aimez"
      },
      addresses: {
        title: "Adresses",
        description: "Adresses de livraison"
      },
      orders: {
        title: "Commandes",
        description: "Historique des achats"
      },
      security: {
        title: "Sécurité",
        description: "Mot de passe et confidentialité"
      },
      settings: {
        title: "Paramètres",
        description: "Préférences et notifications"
      }
    },
    security: {
      title: "Sécurité",
      subtitle: "Gérez la sécurité de votre compte",
      account: {
        title: "Informations du compte",
        email: "Adresse e-mail",
        verification: "Statut de vérification",
        verified: "Vérifié",
        notVerified: "Non vérifié"
      },
      password: {
        title: "Changer le mot de passe",
        current: "Mot de passe actuel",
        new: "Nouveau mot de passe",
        confirm: "Confirmer le nouveau mot de passe",
        currentPlaceholder: "Entrez votre mot de passe actuel",
        newPlaceholder: "Entrez un nouveau mot de passe",
        confirmPlaceholder: "Confirmez votre nouveau mot de passe",
        update: "Mettre à jour le mot de passe",
        success: "Mot de passe mis à jour avec succès",
        errors: {
          passwordsNotMatch: "Les nouveaux mots de passe ne correspondent pas",
          minLength: "Le nouveau mot de passe doit contenir au moins 6 caractères",
          generic: "Erreur lors du changement de mot de passe"
        }
      },
      basicInfo: {
        title: "Informations de base",
        subtitle: "Mettez à jour votre nom et votre téléphone",
        name: "Nom complet",
        namePlaceholder: "Entrez votre nom complet",
        phone: "Numéro de téléphone",
        phonePlaceholder: "Entrez votre numéro de téléphone",
        update: "Mettre à jour les informations",
        success: "Informations mises à jour avec succès",
        errors: {
          nameRequired: "Le nom est requis",
          nameMinLength: "Le nom doit contenir au moins 2 caractères",
          generic: "Erreur lors de la mise à jour des informations"
        }
      },
      sessions: {
        title: "Sessions actives",
        currentDevice: "Appareil actuel",
        lastActivity: "Dernière activité : Maintenant",
        active: "Active",
        closeAll: "Fermer toutes les sessions",
        logoutAllNotAvailable: "Cette fonctionnalité sera bientôt disponible"
      },
      delete: {
        title: "Zone dangereuse",
        warning: "Cette action supprimera définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.",
        showForm: "Supprimer mon compte",
        passwordConfirm: "Confirmez votre mot de passe",
        passwordPlaceholder: "Entrez votre mot de passe",
        confirmLabel: "Tapez 'SUPPRIMER' pour confirmer",
        confirmHelp: "Vous devez taper exactement 'SUPPRIMER' en majuscules",
        confirm: "Supprimer le compte",
        success: "Compte supprimé avec succès",
        errors: {
          confirmText: "Vous devez taper 'SUPPRIMER' pour continuer",
          generic: "Erreur lors de la suppression du compte"
        }
      }
    },
    settings: {
      title: "Paramètres",
      subtitle: "Personnalisez votre expérience",
      preferences: {
        title: "Préférences",
        description: "Configurez votre expérience personnalisée"
      },
      appearance: {
        title: "Apparence",
        darkMode: "Mode sombre",
        darkModeDesc: "Basculer entre les thèmes clair et sombre",
        theme: "Thème",
        themeDesc: "Sélectionnez votre thème préféré"
      },
      language: {
        title: "Langue",
        description: "Sélectionnez votre langue préférée",
        options: {
          es: "Español",
          en: "English",
          fr: "Français"
        }
      },
      notifications: {
        title: "Notifications",
        description: "Gérez vos préférences de notification",
        email: "Notifications par email",
        emailDescription: "Recevoir des notifications importantes par email",
        orders: "Mises à jour des commandes",
        ordersDescription: "Recevoir des mises à jour sur l'état de vos commandes",
        promotions: "Offres et promotions",
        promotionsDescription: "Recevoir des offres spéciales et promotions",
        newsletter: "Bulletin d'information",
        manage: "Gérer les notifications"
      },
      security: {
        title: "Sécurité",
        description: "Protégez votre compte",
        changePassword: "Changer le mot de passe",
        securitySettings: "Paramètres de sécurité",
        twoFactor: "Authentification à deux facteurs"
      },
      payment: {
        title: "Paiements",
        description: "Gérez vos méthodes de paiement",
        methods: "Méthodes de paiement",
        addMethod: "Ajouter méthode de paiement",
        defaultMethod: "Méthode par défaut"
      },
      privacy: {
        title: "Confidentialité",
        description: "Contrôlez vos informations personnelles",
        security: "Paramètres de sécurité",
        downloadData: "Télécharger mes données",
        deleteData: "Supprimer mon compte",
        cookiePreferences: "Préférences de cookies"
      },
      general: {
        title: "Préférences générales",
        language: "Langue",
        darkMode: "Mode sombre"
      },
      account: {
        title: "Compte",
        deleteAccount: "Supprimer le compte",
        deleteAccountDesc: "Supprimer définitivement votre compte",
        exportData: "Exporter les données",
        exportDataDesc: "Télécharger une copie de vos données"
      }
    },
    errors: {
      loadingUserData: "Erreur lors du chargement des informations utilisateur"
    }
  },

  auth: {
    // Titres des modales
    loginTitle: "Se Connecter",
    registerTitle: "Créer un Compte",
    forgotPasswordTitle: "Réinitialiser le Mot de Passe",
    
    // Titres des formulaires pour desktop
    loginFormTitle: "Accédez à votre compte",
    registerFormTitle: "Rejoignez-nous",
    forgotPasswordFormTitle: "Réinitialiser le mot de passe",
    
    // Descriptions
    loginDescription: "Bon retour sur Tout À un clic là",
    registerDescription: "Rejoignez notre communauté",
    forgotPasswordDescription: "Nous vous enverrons un lien pour réinitialiser votre mot de passe",
    
    // Descriptions des formulaires pour desktop
    loginFormDescription: "Entrez vos identifiants pour accéder",
    registerFormDescription: "Complétez vos informations pour commencer",
    forgotPasswordFormDescription: "Entrez votre email pour récupérer l'accès",
    
    // Descriptions étendues pour la colonne de gauche sur desktop
    loginDescriptionExtended: "Accédez à votre compte et profitez de la meilleure expérience d'achat en ligne avec des produits latinos à Montréal.",
    registerDescriptionExtended: "Rejoignez notre communauté et découvrez la meilleure sélection de produits latinos à Montréal avec livraison rapide.",
    forgotPasswordDescriptionExtended: "Ne vous inquiétez pas, nous vous aidons à récupérer l'accès à votre compte en toute sécurité.",
    
    // Titres pour la colonne de gauche sur desktop
    welcomeBack: "Bon retour !",
    joinOurCommunity: "Rejoignez notre communauté",
    resetPasswordTitle: "Récupérez votre compte",
    
    // Caractéristiques mises en avant
    feature1: "Produits latinos authentiques",
    feature2: "Livraison rapide à Montréal",
    feature3: "Prix compétitifs",
    
    // Labels des champs
    fullName: "Nom complet",
    email: "Adresse e-mail",
    phone: "Téléphone",
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
    continueWithGoogleRegister: "S'inscrire avec Google",
    registerWithEmail: "S'inscrire avec email",
    
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
    verificationTitle: "Vérifier l'E-mail",
    verificationDescription: "Vérifiez votre e-mail",
    verificationCodeLabel: "Code de vérification",
    verificationCodePlaceholder: "123456",
    verificationInstructions: "Entrez le code à 6 chiffres envoyé à votre e-mail",
    verifyButton: "Vérifier",
    verifying: "Vérification en cours...",
    resendCode: "Vous n'avez pas reçu le code ? Renvoyer",
    codeResent: "Code renvoyé",
    checkEmailForNewCode: "Vérifiez votre e-mail pour le nouveau code",
    resendCodeError: "Erreur lors du renvoi du code",
    emailNotFoundForVerification: "E-mail introuvable pour la vérification",
    emailNotFoundForResend: "E-mail introuvable pour renvoyer le code",
    enterSixDigitCode: "Entrez le code à 6 chiffres",
    verificationSuccess: "E-mail vérifié !",
    accountVerifiedCorrectly: "Votre compte a été vérifié avec succès",
    invalidVerificationCode: "Code de vérification invalide",
    accountRequiresVerification: "Votre compte nécessite une vérification. Nous vous avons envoyé un nouveau code à votre e-mail.",
    
    // En-têtes de modal
    createFreeAccount: "Créez votre compte gratuit",
    verifyYourEmail: "Vérifiez votre e-mail",
    
    // États du modal
    processing: "Traitement en cours...",
    orText: "ou",
    optionalText: "(optionnel)",
    
    // Messages toast
    welcomeMessage: "Bienvenue !",
    loginSuccessDescription: "Vous vous êtes connecté avec succès",
    registrationSuccess: "Inscription réussie !",
    verificationCodeSent: "Nous vous avons envoyé un code de vérification à votre e-mail",
    comingSoon: "Bientôt disponible",
    googleLoginComingSoon: "La connexion Google sera bientôt disponible",
    
    // Erreurs spécifiques au modal
    loginError: "Erreur lors de la connexion",
    registrationError: "Erreur lors de l'inscription de l'utilisateur",
    
    // Labels Aria
    closeModal: "Fermer",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    
    // Page de callback
    callback: {
      processing: "Traitement...",
      success: "Succès !",
      error: "Erreur",
      processingAuth: "Traitement de l'authentification...",
      verifyingGoogle: "Vérification de votre authentification Google...",
      welcomeUser: "Bienvenue ",
      authSuccess: "Authentification réussie",
      authError: "Erreur lors du traitement de l'authentification",
      redirecting: "Redirection automatique...",
      redirectingError: "Redirection vers l'accueil dans quelques secondes...",
      goToHome: "Aller à l'accueil maintenant",
      takingSeconds: "Cela ne prendra que quelques secondes...",
      googleAuthProcessing: "Traitement de la connexion Google...",
      creatingAccount: "Création de votre compte...",
      updatingProfile: "Mise à jour de votre profil...",
      almostDone: "Presque terminé...",
      authenticationComplete: "Authentification terminée",
      redirectingToDashboard: "Nous vous redirigeons vers votre compte"
    }
  },
  navbar: {
    logoutButton: "Se Déconnecter",
    languageChanged: "Langue changée en ",
    logoutSuccess: "Déconnexion réussie !",
    mobile: {
      // Header
      menu: "Menu",
      navigation: "Navigation",
      
      // User states
      user: "Utilisateur",
      welcome: "Bienvenue !",
      loginPrompt: "Connectez-vous pour accéder à toutes les fonctionnalités",
      login: "Se Connecter",
      verifyAccount: "Vérifier le compte",
      accountVerified: "Compte vérifié",
      
      // Quick access
      quickAccess: "Accès Rapide",
      myProfile: "Mon Profil",
      orders: "Commandes", 
      addresses: "Adresses",
      exploreStore: "Explorer Boutique",
      myAccount: "Mon Compte",
      logout: "Se Déconnecter",
      
      // System messages
      logoutSuccess: "Déconnexion réussie",
      logoutError: "Erreur lors de la déconnexion",
      languageChanged: "Langue changée en"
    }
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
      limitedStockUnits: "Seulement {stock} restant!",
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

    // Prix
    price: {
      notAvailable: "Bientôt",
      basePrice: "Prix de base",
      finalPrice: "Prix final",
      includesTaxes: "Taxes incluses",
      plusTaxes: "Plus taxes"
    },

    // Taxes
    tax: {
      nonTaxable: "Non taxable",
      taxable: "Taxable",
      basePrice: "Prix de base",
      tps: "TPS",
      tvq: "TVQ",
      consigne: "Consigne",
      total: "Total avec taxes"
    },

    // AddToCartButton
    addToCartButton: {
      addToCart: "Ajouter",
      outOfStock: "Rupture de stock",
      productOutOfStock: "Produit en rupture de stock",
      onlyUnitsAvailable: "Seulement {stock} unités disponibles",
      onlyUnitsLeft: "Il ne reste que {stock} unités!",
      unitsAvailable: "{stock} unités disponibles",
      quantity: "Quantité",
      total: "Total",
      addingToCart: "Ajout...",
      errorAddingToCart: "Erreur lors de l'ajout au panier",
      addedToCart: "Ajouté au panier",
      alreadyInCart: "Déjà dans le panier",
      inCart: "Dans le panier"
    },

    // Messages
    messages: {
      addedToFavorites: "Ajouté aux favoris",
      removedFromFavorites: "Retiré des favoris",
      errorTogglingFavorite: "Erreur lors de la gestion des favoris",
      addedToCart: "Produit ajouté au panier",
      errorAddingToCart: "Erreur lors de l'ajout au panier"
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
      searching: "Recherche...",
      noProducts: "Aucun produit trouvé",
      noProductsMessage: "Aucun produit ne correspond aux filtres sélectionnés.",
      tryDifferentFilters: "Essayez d'ajuster vos filtres ou de rechercher autre chose.",
      loadMore: "Charger plus",
      showingResults: "Affichage de {count} sur {total} produits",
      error: "Erreur lors du chargement des produits",
      retry: "Réessayer",
      
      // Recherche
      searchMinLength: "Tapez au moins 2 caractères pour rechercher",
      searchResults: "{count} résultats trouvés",
      searchClear: "Effacer la recherche",
      
      // Notifications
      notifications: {
        filtersApplied: "Filtres appliqués avec succès",
        filtersCleared: "Filtres effacés",
        searchCompleted: "Recherche terminée",
        noResultsFound: "Aucun résultat trouvé",
        errorOccurred: "Une erreur est survenue lors du chargement des produits"
      },
      
      // Filtres mobiles
      mobileFilters: {
        title: "Filtres",
        apply: "Appliquer les filtres",
        cancel: "Annuler",
        reset: "Réinitialiser"
      },
      
      // Pagination
      pagination: {
        loadingResults: "Chargement des résultats...",
        showingResults: "📊 Affichage de {start} - {end} sur {total} résultat{plural}",
        searchResultsFor: "pour \"{search}\"",
        clearAll: "🗑️ Tout effacer"
      },
      
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
        loginRequired: "Vous devez vous connecter pour continuer",
        outOfStock: "Produit en rupture de stock",
        productNotFound: "Produit non trouvé"
      },
      
      // Prix et taxes
      price: {
        notAvailable: "Non disponible",
        basePrice: "Prix de base",
        total: "Total",
        savings: "Vous économisez",
        originalPrice: "Prix original"
      },
      
      tax: {
        nonTaxable: "Non taxable",
        taxable: "Taxable",
        taxIncluded: "Taxes incluses",
        tps: "TPS",
        tvq: "TVQ"
      },
      
      product: {
        supplier: "Fournisseur",
        category: "Catégorie",
        subcategory: "Sous-catégorie",
        stock: "Disponible",
        lowStock: "Stock faible",
        outOfStock: "En rupture"
      }
    },

    // FoodCatalog
    foodCatalog: {
      title: "Cuisines Traditionnelles",
      subtitle: "Saveurs authentiques de toute l'Amérique latine - Gastronomie traditionnelle à Montréal",
      whyChooseUs: "Pourquoi nous choisir?",
      whyChooseUsDesc: "La meilleure expérience culinaire de Montréal",
      restaurantsAvailable: "restaurants disponibles",
      selectRestaurant: "Sélectionnez votre restaurant favori",
      availableRestaurants: "Restaurants Disponibles",
      exploreAllFlavors: "Explorer toutes les saveurs",
      noRestaurants: "Aucun restaurant disponible",
      comingSoon: "Bientôt, nous aurons plus de restaurants disponibles dans votre région.",
      backToRestaurants: "Retour aux restaurants",
      restaurantMenu: "Menu de {name}",
      menuTitle: "Menu de",
      menuSubtitle: "Découvrez les plats authentiques et traditionnels",
      authenticDishes: "Découvrez les plats authentiques et traditionnels",
      openNow: "Ouvert",
      closedNow: "Fermé",
      popular: "Populaire",
      viewMenu: "Voir le menu",
      viewFullMenu: "Voir le menu complet",
      contactUs: "Vous ne trouvez pas votre restaurant favori? Contactez-nous pour ajouter plus d'options.",
      deliveryTime: "min",
      reviews: "avis",
      selectedRestaurant: "Restaurant sélectionné",
      searchPlaceholder: "Rechercher des restaurants...",
      sortByRating: "Par note",
      sortByName: "Par nom",
      sortByTime: "Par temps",
      filterAll: "Tous",
      filterNew: "Nouveaux",
      filterTopRated: "Mieux notés"
    },

    // RestaurantList
    restaurantList: {
      errorTitle: "Erreur lors du chargement des restaurants",
      errorDesc: "Une erreur s'est produite lors du chargement de la liste des restaurants. Veuillez réessayer.",
      noRestaurants: "Aucun restaurant disponible",
      noRestaurantsDesc: "Nous aurons bientôt plus d'options de cuisine traditionnelle pour vous.",
      viewMenu: "Voir le menu",
      available: "Disponible",
      rating: "note",
      openNow: "Ouvert maintenant",
      popular: "Populaire",
      verified: "Vérifié",
      cuisine: "Cuisine",
      addToFavorites: "Ajouter aux favoris",
      removeFromFavorites: "Retirer des favoris",
      viewMenuFor: "Voir le menu de",
      noDescription: "Découvrez les saveurs uniques de ce restaurant"
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
    },
    
    // RestaurantGrid
    restaurantGrid: {
      selectRestaurant: "Choisissez votre restaurant",
      title: "Restaurants Authentiques",
      subtitle: "Découvrez les meilleures saveurs d'Amérique Latine à Montréal. Chaque restaurant propose des recettes traditionnelles et authentiques.",
      errorTitle: "Erreur lors du chargement des restaurants",
      noRestaurants: "Aucun restaurant disponible",
      noRestaurantsDesc: "Actuellement, il n'y a pas de restaurants disponibles dans cette catégorie.",
      restaurantType: "Cuisine traditionnelle latino-américaine",
      viewMenu: "Voir le menu",
      callToAction: "Vous ne trouvez pas ce que vous cherchez? Explorez tous nos restaurants partenaires.",
      exploreAll: "Explorer tous les restaurants"
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
  },

  // Conditions d'utilisation
  terms: {
    title: "Conditions d'utilisation",
    lastUpdated: "Dernière mise à jour :",
    sections: {
      introduction: {
        title: "1. Introduction",
        paragraph1: "Bienvenue chez Tout à un clic là. Ce document constitue un accord juridiquement contraignant (« Accord ») entre vous et Tout à un clic là, régi par la loi canadienne. Ces Conditions d'utilisation régissent votre accès et votre utilisation de notre plateforme de commerce électronique (« la Plateforme »), y compris toute application mobile associée, contenu, fonctionnalités et services offerts.",
        paragraph2: "En accédant ou en utilisant notre Plateforme, vous confirmez que vous avez lu, compris et acceptez d'être lié par ces conditions. Si vous n'êtes pas d'accord avec une partie de cet Accord, veuillez vous abstenir d'utiliser nos services."
      },
      eligibility: {
        title: "2. Éligibilité et comptes d'utilisateur",
        paragraph1: "Pour utiliser nos services, vous devez avoir au moins 18 ans ou l'âge de la majorité légale dans votre juridiction, selon le plus élevé. En créant un compte, vous garantissez que toutes les informations fournies sont vraies, exactes, complètes et à jour.",
        paragraph2: "Il est de votre responsabilité de maintenir la confidentialité de votre compte et de votre mot de passe, ainsi que de restreindre l'accès à votre appareil. Vous acceptez la pleine responsabilité de toutes les activités qui se produisent sous votre compte. Si vous soupçonnez une utilisation non autorisée de votre compte, vous devez nous en informer immédiatement.",
        paragraph3: "Tout à un clic là se réserve le droit de suspendre ou de terminer votre compte, à notre discrétion et sans préavis, si nous déterminons que vous avez violé toute disposition de ces Conditions d'utilisation ou si votre conduite pourrait causer du tort à notre Plateforme, à d'autres utilisateurs ou à des tiers."
      },
      products: {
        title: "3. Produits et services",
        paragraph1: "Les produits et services offerts sur notre Plateforme sont sujets à disponibilité. Nous nous efforçons de fournir des descriptions précises, y compris les spécifications, caractéristiques et représentations visuelles de nos produits. Cependant, nous ne garantissons pas que ces descriptions ou représentations soient exactes, complètes, fiables, actuelles ou sans erreur.",
        paragraph2: "Les couleurs affichées sur votre appareil peuvent varier des produits réels en raison de différentes technologies d'affichage, paramètres et limitations techniques.",
        paragraph3: "Tout à un clic là se réserve le droit, à sa discrétion absolue, de limiter les quantités de tout produit ou service, de restreindre les ventes à toute personne ou région géographique, et de suspendre ou discontinuer tout produit ou service sans préavis."
      },
      pricing: {
        title: "4. Prix, taxes et paiements",
        paragraph1: "Tous les prix sont affichés en dollars canadiens (CAD) et incluent les taxes applicables sauf indication contraire. Nous nous réservons le droit de modifier les prix à tout moment sans préavis préalable. Cependant, les commandes confirmées et payées ne seront pas affectées par les changements de prix.",
        conditions: [
          "Le produit doit être dans son état original, inutilisé et avec toutes les étiquettes et emballages originaux.",
          "Une preuve d'achat ou confirmation de commande doit être incluse.",
          "Les articles personnalisés, périssables, d'hygiène personnelle ou marqués comme vente finale ne sont pas éligibles au retour, sauf en cas de défauts vérifiables."
        ],
        paragraph2: "Les remboursements seront traités en utilisant la même méthode de paiement utilisée pour l'achat original dans les 14 jours ouvrables suivant la réception et vérification des articles retournés. Les frais d'expédition originaux et de retour ne sont généralement pas remboursables, sauf en cas de produits défectueux ou d'erreurs d'expédition attribuables à notre responsabilité."
      },
      intellectualProperty: {
        title: "7. Propriété intellectuelle",
        paragraph1: "La Plateforme et tout son contenu, caractéristiques et fonctionnalités, y compris mais sans s'y limiter le texte, graphiques, logos, icônes, images, clips audio, téléchargements numériques, compilations de données et logiciels, sont la propriété exclusive de Tout à un clic là, ses concédants de licence ou autres fournisseurs de contenu, et sont protégés par les lois canadiennes et internationales sur le droit d'auteur, marques de commerce, brevets, secrets commerciaux et autres droits de propriété intellectuelle.",
        paragraph2: "L'utilisation non autorisée de tout contenu ou matériel sur notre Plateforme est strictement interdite. Aucune licence implicite ou expresse n'est accordée pour utiliser toute propriété intellectuelle sans notre consentement écrit préalable."
      },
      liability: {
        title: "8. Limitation de responsabilité",
        paragraph1: "Dans la mesure maximale permise par la loi applicable, Tout à un clic là, ses administrateurs, employés, agents et affiliés ne seront pas responsables de :",
        list1: [
          "Dommages indirects, accessoires, spéciaux, punitifs ou consécutifs, y compris la perte de profits, données, utilisation ou toute autre perte intangible, résultant de (i) votre accès ou utilisation ou incapacité d'accéder ou d'utiliser notre Plateforme ; (ii) toute conduite ou contenu de tiers sur la Plateforme ; ou (iii) accès non autorisé, utilisation ou altération de vos transmissions ou contenu.",
          "Interruptions, erreurs, omissions ou retards dans l'opération de la Plateforme ou la livraison de produits ou services.",
          "Virus, chevaux de Troie ou autres logiciels malveillants qui peuvent être transmis vers ou à travers notre Plateforme."
        ],
        paragraph2: "Notre responsabilité totale pour toute réclamation sous ces Conditions ne dépassera pas le montant payé par vous à Tout à un clic là pendant les six (6) mois précédant l'action donnant lieu à cette responsabilité.",
        paragraph3: "Les limitations ci-dessus s'appliqueront indépendamment du fait que Tout à un clic là ait été averti de la possibilité de tels dommages et indépendamment du fait qu'un recours énoncé dans les présentes échoue dans son objectif essentiel."
      },
      governing: {
        title: "9. Loi applicable et résolution des litiges",
        paragraph1: "Ces Conditions d'utilisation seront régies et interprétées conformément aux lois de la province de Québec et aux lois fédérales du Canada qui s'y appliquent, sans égard aux principes de conflit de lois.",
        paragraph2: "Tout litige, controverse ou réclamation découlant de ou liée à ces Conditions, ou leur violation, résiliation ou invalidité, sera résolu par négociation de bonne foi. Si le litige ne peut être résolu par négociation, les deux parties acceptent de soumettre le litige à la médiation conformément aux règles de médiation de l'Institut canadien de médiation et d'arbitrage.",
        paragraph3: "Si la médiation ne résout pas le litige, il sera soumis à un arbitrage exécutoire devant un seul arbitre conformément à la Loi canadienne sur l'arbitrage commercial. Le lieu d'arbitrage sera Montréal, Québec, Canada, et la langue d'arbitrage sera l'anglais ou le français, selon ce qui est convenu par les parties."
      },
      changes: {
        title: "10. Modifications des conditions",
        paragraph1: "Nous nous réservons le droit, à notre seule discrétion, de modifier ou remplacer ces Conditions à tout moment. La version mise à jour sera effective dès qu'elle sera publiée sur notre Plateforme.",
        paragraph2: "Il est de votre responsabilité de vérifier périodiquement ces Conditions pour les changements.",
        paragraph3: "Pour des changements substantielles, nous ferons des efforts raisonnables pour vous notifier, soit par un avis proéminent sur notre Plateforme, par courriel à l'adresse associée à votre compte, ou par d'autres moyens."
      },
      contact: {
        title: "11. Contact",
        paragraph1: "Si vous avez des questions sur ces Conditions d'utilisation ou avez besoin d'assistance avec nos produits ou services, vous pouvez nous contacter via :",
        email: "serviceclient@toutaunclicla.com",
        paragraph2: "Notre équipe de service client est disponible pour vous aider du lundi au vendredi, de 9h00 à 17h00 (heure de l'Est)."
      }
    }
  },

  // Politique de confidentialité
  privacy: {
    title: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour :",
    sections: {
      introduction: {
        title: "1. Introduction",
        paragraph1: "Chez Tout à un clic là, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles conformément à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) du Canada. Cette politique de confidentialité détaille comment nous collectons, utilisons, protégeons et divulguons les informations personnelles que vous fournissez lors de l'utilisation de notre plateforme de commerce électronique, ainsi que vos droits de confidentialité selon la législation canadienne."
      },
      dataCollection: {
        title: "2. Données que nous collectons",
        paragraph1: "Conformément aux principes de confidentialité établis par la LPRPDE, nous collectons uniquement les informations personnelles nécessaires aux fins identifiées et avec votre consentement. Ces informations peuvent inclure :",
        list1: [
          "Données d'identité : nom complet, nom d'utilisateur ou identifiants similaires.",
          "Données de contact : adresse postale, adresse de facturation, adresse de livraison, courriel et numéros de téléphone.",
          "Données financières : informations de cartes de paiement (traitées de manière sécurisée par des fournisseurs de paiement autorisés et conformes aux normes PCI DSS).",
          "Données de transaction : registres d'achats, produits acquis, fréquence d'achats et méthodes de paiement utilisées.",
          "Données techniques : adresse IP, données de connexion, type et version du navigateur, paramètres de fuseau horaire, localisation, types d'appareils utilisés pour accéder à la plateforme.",
          "Données de profil : nom d'utilisateur et mot de passe (stockés de manière cryptée), préférences d'achat, intérêts et réponses aux sondages lorsque vous avez choisi d'y participer.",
          "Données d'utilisation : informations sur la façon dont vous naviguez et utilisez notre plateforme, y compris le temps passé sur les pages et les modèles de navigation."
        ]
      },
      dataUsage: {
        title: "3. Comment nous utilisons vos données",
        paragraph1: "Nous utilisons vos informations personnelles uniquement aux fins spécifiques pour lesquelles elles ont été collectées et conformément à la LPRPDE et autres lois canadiennes applicables. Ces fins incluent :",
        list1: [
          "Gérer votre compte et notre relation contractuelle, y compris vérifier votre identité lorsque nécessaire.",
          "Traiter et livrer vos commandes, y compris gérer les paiements, facturation et expédition.",
          "Gérer notre plateforme numérique (y compris l'analyse de données, tests, maintenance des systèmes, support technique et sécurité informatique).",
          "Améliorer nos produits et services grâce à l'analyse des modèles d'utilisation et préférences des clients.",
          "Communiquer avec vous concernant les mises à jour de produits, offres spéciales ou informations pertinentes, toujours avec l'option de vous désabonner de ces communications.",
          "Se conformer aux obligations légales et fiscales selon les exigences de la législation canadienne."
        ]
      },
      cookies: {
        title: "4. Cookies et technologies de suivi",
        paragraph1: "Nous utilisons des cookies et technologies similaires conformément aux lois canadiennes sur la confidentialité électronique. Ces technologies nous permettent de :",
        list1: [
          "Mémoriser vos préférences et paramètres pour améliorer votre expérience.",
          "Comprendre comment vous utilisez notre plateforme pour l'optimiser.",
          "Faciliter les fonctionnalités essentielles comme le panier d'achat et l'authentification de session."
        ],
        paragraph2: "Vous pouvez configurer votre navigateur pour rejeter tous ou certains cookies, ou pour vous alerter lorsqu'ils sont utilisés. Cependant, cela pourrait affecter le fonctionnement de certaines parties de notre plateforme. En continuant à utiliser notre site sans changer vos paramètres, vous consentez à notre utilisation des cookies telle que décrite dans cette politique."
      },
      dataDisclosure: {
        title: "5. Divulgation de vos données personnelles",
        paragraph1: "Conformément à la législation canadienne, nous pouvons partager vos informations personnelles seulement dans des circonstances spécifiques :",
        list1: [
          "Avec des fournisseurs de services qui nous assistent dans nos opérations commerciales (processeurs de paiement, services de livraison, fournisseurs d'hébergement web) sous des accords de confidentialité stricts.",
          "Avec des professionnels tels que conseillers juridiques, comptables et auditeurs lorsque nécessaire pour nos opérations commerciales.",
          "Avec les autorités gouvernementales lorsque requis par la loi, réglementation ou processus juridique.",
          "Dans le contexte d'une transaction commerciale telle que fusion, acquisition ou vente d'actifs, avec notification préalable aux utilisateurs affectés."
        ],
        paragraph2: "Nous exigeons de tous les tiers qu'ils respectent la confidentialité et sécurité de vos données personnelles et qu'ils se conforment à toutes les lois de confidentialité applicables, y compris la LPRPDE. Nous ne permettons pas à nos fournisseurs de services d'utiliser vos données à des fins non autorisées qui leur sont propres."
      },
      internationalTransfers: {
        title: "6. Transferts internationaux de données",
        paragraph1: "Si nous transférons vos données personnelles hors du Canada, nous le faisons seulement lorsque des garanties adéquates existent pour protéger vos droits de confidentialité, conformément aux exigences de la LPRPDE. Ces garanties peuvent inclure :",
        list1: [
          "Transferts vers des pays que le Commissaire à la protection de la vie privée du Canada a déterminés comme offrant un niveau adéquat de protection.",
          "Mise en œuvre de clauses contractuelles approuvées.",
          "Obtention de votre consentement explicite lorsque nécessaire."
        ]
      },
      dataSecurity: {
        title: "7. Sécurité des données",
        paragraph1: "Nous avons mis en place des mesures de sécurité techniques et organisationnelles appropriées selon les normes de l'industrie canadienne pour protéger vos données personnelles contre l'accès non autorisé, altérations, divulgations ou destructions. Ces mesures incluent :",
        list1: [
          "Chiffrement des données sensibles et transactions financières.",
          "Systèmes de pare-feu et détection d'intrusion.",
          "Accès restreint aux informations personnelles basé sur le besoin de savoir.",
          "Évaluations régulières de sécurité et audits de conformité."
        ]
      },
      dataRetention: {
        title: "8. Conservation des données",
        paragraph1: "Nous conservons vos données personnelles seulement aussi longtemps que nécessaire pour les fins pour lesquelles elles ont été collectées, conformément à nos obligations légales et commerciales. Les critères utilisés pour déterminer nos périodes de conservation incluent :",
        list1: [
          "La période pendant laquelle nous maintenons une relation commerciale active avec vous.",
          "Nos obligations légales selon la législation canadienne applicable, y compris les réglementations fiscales et commerciales.",
          "Exigences pour la résolution de litiges ou réclamations."
        ]
      },
      yourRights: {
        title: "9. Vos droits légaux",
        paragraph1: "Sous la LPRPDE et autres lois canadiennes sur la confidentialité, vous avez des droits spécifiques concernant vos données personnelles, qui incluent :",
        list1: [
          "Droit d'accès : Demander l'accès à vos données personnelles que nous traitons.",
          "Droit de rectification : Demander la correction d'informations inexactes ou incomplètes.",
          "Droit de retirer le consentement : Retirer votre consentement à tout moment lorsque le traitement est basé sur votre consentement.",
          "Droit de déposer une plainte : Déposer une plainte auprès du Bureau du Commissaire à la protection de la vie privée du Canada si vous croyez que nous avons violé vos droits de confidentialité.",
          "Droit de contester la conformité : Contester notre conformité avec les principes de la LPRPDE."
        ],
        paragraph2: "Pour exercer l'un de ces droits, contactez-nous en utilisant les informations fournies dans la section « Contact »."
      },
      changes: {
        title: "10. Modifications à cette politique de confidentialité",
        paragraph1: "Nous pouvons mettre à jour cette politique de confidentialité périodiquement pour refléter des changements dans nos pratiques ou la législation canadienne. La version la plus récente sera toujours disponible sur notre plateforme, avec la date de mise à jour clairement indiquée. Pour des changements significatifs, nous fournirons des notifications visibles sur notre plateforme ou vous enverrons des communications directes."
      },
      contact: {
        title: "11. Contact",
        paragraph1: "Pour toute question liée à cette politique de confidentialité ou au traitement de vos données personnelles, vous pouvez nous contacter via :",
        email: "serviceclient@toutaunclicla.com",
        paragraph2: "Si vous croyez que nous n'avons pas adéquatement adressé vos préoccupations, vous avez le droit de déposer une plainte auprès du Bureau du Commissaire à la protection de la vie privée du Canada :",
        website: "www.priv.gc.ca"
      }
    }
  }
};