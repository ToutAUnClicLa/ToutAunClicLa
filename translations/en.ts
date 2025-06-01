export default {
  nav: {
    home: "Home",
    products: "Products",
    foods: "Foods",
    boutique: "Boutique",
    login: "Login",
    profile: {
      myProfile: "My Profile",
      addresses: "Addresses",
      favorites: "Favorites",
      myOrders: "Orders", 
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
  },  auth: {
    // Modal titles
    loginTitle: "Sign In",
    registerTitle: "Create Account",
    forgotPasswordTitle: "Reset Password",
    
    // Descriptions
    loginDescription: "Welcome back to Tout À un clic là",
    registerDescription: "Join our community",
    forgotPasswordDescription: "We'll send you a link to reset your password",
    
    // Field labels
    fullName: "Full name",
    email: "Email address",
    phone: "Phone (optional)",
    password: "Password",
    confirmPassword: "Confirm password",
    
    // Placeholders
    fullNamePlaceholder: "Your full name",
    emailPlaceholder: "you@example.com",
    phonePlaceholder: "Your phone number",
    passwordPlaceholder: "Your password",
    passwordRegisterPlaceholder: "Minimum 6 characters",
    confirmPasswordPlaceholder: "Repeat your password",
    
    // Buttons
    loginButton: "Sign in",
    registerButton: "Create account",
    forgotPasswordButton: "Send link",
    continueWithGoogle: "Continue with Google",
    
    // Loading states
    loggingIn: "Signing in...",
    creatingAccount: "Creating account...",
    sendingLink: "Sending link...",
    
    // Separator
    orContinueWith: "Or continue with",
    
    // Checkbox and terms
    acceptTerms: "I accept the",
    termsAndConditions: "Terms and Conditions",
    and: "and the",
    privacyPolicy: "Privacy Policy",
    acceptTermsRequired: "You must accept the terms and conditions to continue",
    rememberMe: "Remember me",
    forgotPassword: "Forgot your password?",
    
    // Footer links
    noAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    signUp: "Sign up",
    signIn: "Sign in",
    backToLogin: "Back to sign in",
    
    // Common error messages
    emailRequired: "Email is required",
    emailInvalid: "Invalid email",
    passwordRequired: "Password is required",
    passwordInvalid: "Password must have at least 6 characters, one letter and one number",
    passwordsMismatch: "Passwords don't match",
    nameRequired: "Name is required",
    emailAlreadyExists: "This email is already registered. Try signing in.",
    emailNotRegistered: "This email is not registered. Try creating an account.",
    errorCheckingEmail: "Error verifying email",
    generalError: "An error occurred",
    
    // Success messages
    welcomeBack: "Welcome back!",
    accountCreated: "Account created successfully. Please verify your email.",
    passwordResetSent: "A link has been sent to your email to reset your password",
    redirecting: "Redirecting...",
    googleAuthError: "Error signing in with Google",
    
    // Verification
    verificationRequired: "Your account requires verification. Please check your email to complete the process or request a new verification email.",
    invalidCredentials: "Invalid credentials. Check your email and password.",
    resendVerification: "Would you like us to send a new verification email?",
    verificationSent: "New verification email sent. Please check your inbox.",
    verificationError: "Error sending verification email",
    
    // Aria labels
    closeModal: "Close",
    showPassword: "Show password",
    hidePassword: "Hide password"
  },
    // New translations for mobile navbar
  navbar: {
    welcome: "Welcome!",
    accessYourAccount: "Access your account to get started",
    loginButton: "Sign In",
    createAccountButton: "Create Account",
    logoutButton: "Sign out",
    
    // Verification states
    pendingVerification: "Pending verification",
    unverifiedAccount: "Unverified account",
    accountNeedsVerification: "Your account needs verification",
    
    // Menu sections
    mainMenu: "Main Menu",
    myAccount: "My Account",
    quickAccess: "Quick Access",
    
    // Quick links
    favorites: "Favorites",
    orders: "Orders",
    addresses: "Addresses",
      // System messages
    logoutSuccess: "Successfully signed out",
    logoutError: "Error signing out",
    languageChanged: "Language changed to"
  },
  
  // Product catalog translations
  catalog: {
    // ProductCard
    productCard: {
      addToCart: "Add to cart",
      addingToCart: "Adding...",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      outOfStock: "Out of stock",
      rating: "Rating",
      reviews: "reviews",
      quickView: "Quick view",
      seeDetails: "See details",
      originalPrice: "Original price",
      discountedPrice: "Discounted price",
      savings: "You save",
      freeShipping: "Free shipping",
      limitedStock: "Limited stock",
      newProduct: "New",
      bestseller: "Bestseller",
      featured: "Featured"
    },
    
    // ProductList
    productList: {
      // Page titles
      productsTitle: "Our Products",
      productsSubtitle: "Discover the best selection of Latin American products",
      comidasTitle: "Traditional Foods",
      comidasSubtitle: "Authentic flavors from all across Latin America - Traditional gastronomy in Montreal",
      boutiqueTitle: "Boutique",
      boutiqueSubtitle: "Unique crafts and souvenirs - Latin American handmade products",
      
      // Filters
      filters: "Filters",
      search: "Search products",
      searchPlaceholder: "Search by name...",
      category: "Category",
      allCategories: "All categories",
      subcategory: "Subcategory",
      allSubcategories: "All subcategories",
      priceRange: "Price range",
      minPrice: "Minimum price",
      maxPrice: "Maximum price",
      sortBy: "Sort by",
      clearFilters: "Clear filters",
      applyFilters: "Apply filters",
      hideFilters: "Hide filters",
      showFilters: "Show filters",
      
      // Sort options
      sortOptions: {
        nameAsc: "Name (A-Z)",
        nameDesc: "Name (Z-A)",
        priceAsc: "Price (low to high)",
        priceDesc: "Price (high to low)",
        ratingDesc: "Highest rated",
        newest: "Newest",
        bestselling: "Best selling"
      },
      
      // Loading and empty states
      loading: "Loading products...",
      noProducts: "No products found",
      noProductsMessage: "No products match the selected filters.",
      tryDifferentFilters: "Try adjusting your filters or searching for something different.",
      loadMore: "Load more",
      showingResults: "Showing {count} of {total} products",
      
      // Benefits
      benefits: {
        fastDelivery: {
          title: "Fast Delivery",
          description: "Receive your order in 24-48h"
        },
        qualityGuarantee: {
          title: "Quality Guarantee",
          description: "100% authentic products"
        },
        freeShipping: {
          title: "Free Shipping",
          description: "On orders over $200"
        },
        securePayment: {
          title: "Secure Payment",
          description: "Protected transactions"
        },
        customerSupport: {
          title: "24/7 Support",
          description: "We're here to help"
        }
      },
      
      // Success and error messages
      messages: {
        addedToCart: "Product added to cart",
        addedToFavorites: "Added to favorites",
        removedFromFavorites: "Removed from favorites",
        errorAddingToCart: "Error adding to cart",
        errorTogglingFavorite: "Error updating favorites",
        loginRequired: "You must sign in to continue"
      }
    },
    
    // ProductDetail
    productDetail: {
      // Product information
      productInfo: "Product information",
      description: "Description",
      specifications: "Specifications",
      reviews: "Reviews",
      shipping: "Shipping",
      returns: "Returns",
      
      // Actions
      addToCart: "Add to cart",
      buyNow: "Buy now",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      shareProduct: "Share product",
      
      // Details
      price: "Price",
      originalPrice: "Original price",
      discount: "Discount",
      stock: "Available stock",
      sku: "SKU",
      category: "Category",
      brand: "Brand",
      weight: "Weight",
      dimensions: "Dimensions",
      
      // States
      inStock: "In stock",
      outOfStock: "Out of stock",
      limitedStock: "Limited stock",
      preOrder: "Pre-order",
      
      // Quantity
      quantity: "Quantity",
      increase: "Increase quantity",
      decrease: "Decrease quantity",
      maxQuantity: "Maximum available quantity: {max}",
      unitsAvailable: "units available",
      
      // Image gallery
      mainImage: "Main image",
      additionalImages: "Additional images",
      zoomImage: "Zoom image",
      previousImage: "Previous image",
      nextImage: "Next image",
      
      // Related products
      relatedProducts: "Related products",
      youMayAlsoLike: "You may also like",
      similarProducts: "Similar products",
      seeMore: "See more",
      loading: "Loading...",
      
      // Product-specific benefits
      authentic: "100% Authentic",
      originalProduct: "Original product",
      securePayment: "Secure payment",
      fastShipping: "Fast shipping",
      qualityGuaranteed: "Quality guaranteed",
      
      // Reviews
      customerReviews: "Customer reviews",
      writeReview: "Write review",
      stars: "stars",
      helpful: "Helpful",
      notHelpful: "Not helpful",
      verifiedPurchase: "Verified purchase",
      
      // Shipping
      shippingInfo: "Shipping information",
      estimatedDelivery: "Estimated delivery",
      shippingCost: "Shipping cost",
      freeShippingOn: "Free shipping on orders of",
      
      // Breadcrumbs
      home: "Home",
      backToCategory: "Back to {category}",
      
      // Messages
      addedToCart: "Product successfully added to cart",
      errorAddingToCart: "Error adding product to cart",
      addedToFavorites: "Product added to favorites",
      removedFromFavorites: "Product removed from favorites",
      errorTogglingFavorite: "Error updating favorites",
      loginToAddToCart: "Sign in to add products to cart",
      loginToAddToFavorites: "Sign in to add products to favorites",
      errorLoadingProduct: "Error loading product",
      productNotFound: "Product not found"
    }
  },
  
  // SEO and metadata
  seo: {
    products: {
      title: "Authentic Latin American Products | Tout à un Clic LA",
      description: "Discover the best selection of Latin American products in Montreal. Flours, doughs, sauces, dressings and more. Free shipping on orders +$200. Order now!",
      keywords: "Latin American products Montreal, traditional flours, authentic sauces, Latino dressings, Latin America products Canada"
    },
    comidas: {
      title: "Traditional Latin American Food | Montreal Delivery | Tout à un Clic LA",
      description: "Authentic Latin American food in Montreal. Flavors from Mexico, Colombia, Peru, Argentina and more. Fast delivery. Order your favorite Latino food!",
      keywords: "Latino food Montreal, Latin American food delivery, Latino restaurant Montreal, Mexican food, Colombian food, Peruvian food Quebec"
    },
    boutique: {
      title: "Latin American Artisan Boutique | Souvenirs & Gifts | Montreal",
      description: "Exclusive boutique with crafts, traditional clothing and souvenirs from Latin America in Montreal. Unique and authentic products. Find the perfect gift!",
      keywords: "Latino boutique Montreal, Latin American crafts, Latin America souvenirs, traditional clothing, unique gifts, Latino store Quebec"
    }
  }
};