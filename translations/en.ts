export default {
  // Common translations
  common: {
    loading: "Loading",
    error: "Error",
    success: "Success",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    close: "Close",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    update: "Update",
    create: "Create",
    dateNotAvailable: "Date not available"
  },
  nav: {
    home: "Home",
    products: "Grocery",
    foods: "Foods",
    boutique: "Boutique",
    login: "Login",
    profile: {
      myProfile: "My Profile",
      addresses: "Addresses",
      favorites: "Favorites",
      myOrders: "Orders",
      security: "Security", 
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
      address: "1614 Av Bourbonnière Montreal Quebec. H1W3N4",
      email: "serviceclient@toutaunclicla.com",
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
      },
      {
        id: 12,
        name: "Beverages",
        description: "Refresh yourself with our authentic beverages from the Americas",
        image: "/bebidas.png",
        color: "from-cyan-600 to-blue-600",
        viewText: "Explore beverages",
        subcategoria_id: "bebidas"
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
  },

  // Shopping cart
  cart: {
    title: "Shopping Cart",
    subtitle: "Selected products",
    product: "product",
    products: "products",
    estimatedTotal: "Estimated total",
    shipping: "shipping",
    freeShipping: "Free shipping",
    loading: "Loading cart...",
    noCategory: "No category",
    perUnit: "per unit",
    stock: "Stock",
    empty: {
      title: "Your cart is empty",
      description: "Add some products to start shopping!",
      exploreProducts: "Explore products"
    },
    categories: {
      productos: "Products",
      comidas: "Foods",
      boutique: "Boutique"
    },
    summary: {
      title: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      taxes: "Taxes (15%)",
      total: "Total",
      freeShipping: "Free",
      shippingThreshold: "Add {amount} more for free shipping",
      proceed: "Proceed to Checkout",
      continue: "Continue Shopping",
      authRequired: "Sign in to continue",
      addressRequired: "Select an address"
    },
    success: {
      quantityUpdated: "Quantity updated",
      productRemoved: "Product removed",
      cartCleared: "Cart cleared"
    },
    errors: {
      updateQuantity: "Error updating quantity",
      removeProduct: "Error removing product",
      clearCart: "Error clearing cart",
      selectAddress: "You must select an address",
      emptyCart: "Your cart is empty"
    },
    auth: {
      title: "Sign in to continue",
      description: "To proceed with your purchase, you need to sign in or create an account",
      login: "Sign in",
      register: "Create account"
    }
  },

  // Favorites
  favorites: {
    title: "My Favorites",
    subtitle: "Products you love",
    headerTitle: "Your favorites",
    headerSubtitle: "You don't have favorites yet",
    headerSubtitleWithCount: "Products you love",
    loading: {
      title: "Loading favorites...",
      description: "We're preparing your favorite products"
    },
    empty: {
      title: "No favorites yet",
      description: "Discover our amazing products and add some to your favorites",
      button: "Explore products"
    },
    items: {
      addToCart: "Add",
      remove: "Remove from favorites",
      view: "View",
      outOfStock: "Out of stock",
      price: "Price",
      stock: "Only",
      noCategory: "No category",
      addedDate: "Added on",
      categories: {
        productos: "Products",
        comidas: "Foods",
        boutique: "Boutique"
      }
    },
    stats: {
      favorites: "Favorites",
      categories: "Categories",
      available: "Available",
      product: "product",
      products: "products"
    },
    buttons: {
      back: "Back",
      explore: "Explore"
    },
    messages: {
      added: "Added to favorites",
      removed: "Product removed from favorites",
      addedToCart: "Product added to cart",
      errorAdd: "Error adding to cart",
      errorRemove: "Error removing from favorites",
      outOfStock: "Product out of stock",
      authRequired: "You must sign in to view favorites"
    },
    auth: {
      title: "Sign in!",
      description: "To view and manage your favorite products you need to sign in",
      login: "Sign in",
      register: "Create account"
    }
  },

  // Addresses
  addresses: {
    title: "My Addresses",
    subtitle: "Manage your delivery addresses",
    addNew: "New address",
    editAddress: "Edit address",
    deleteAddress: "Delete address",
    noAddresses: "You have no saved addresses",
    noAddressesDesc: "Add your first address to make future purchases easier",
    addFirstAddress: "Add first address",
    
    // Address selector
    selector: {
      title: "Shipping Address",
      add: "Add",
      deliveryInfo: "Montreal deliveries only",
      deliveryNote: "We validate that the address is within Montreal metropolitan area",
      montrealOnly: "Montreal addresses only",
      validationNote: "We validate that the city is Montreal and the postal code is valid (H1A-H5B)"
    },
    
    // Form
    form: {
      street: "Address *",
      streetPlaceholder: "e.g., 1234 Rue Sainte-Catherine",
      city: "City",
      cityPlaceholder: "Montreal",
      state: "Province",
      statePlaceholder: "Quebec",
      zipCode: "Postal code",
      zipCodePlaceholder: "H3X 3X3",
      country: "Country",
      countryPlaceholder: "Canada",
      save: "Save address",
      saving: "Saving...",
      cancel: "Cancel"
    },
    
    // Validation
    validation: {
      invalid: "Invalid address",
      required: "This field is required",
      montrealOnly: "Only Montreal addresses are allowed",
      validationInfo: "We validate that the city is Montreal and the postal code is valid"
    },
    
    // Success messages
    success: {
      created: "Address created",
      createdDesc: "The address has been created successfully",
      updated: "Address updated",
      updatedDesc: "The address has been updated successfully", 
      deleted: "Address deleted",
      deletedDesc: "The address has been deleted successfully"
    },
    
    // Error messages
    errors: {
      loadFailed: "Error loading addresses",
      loadFailedDesc: "We couldn't load your addresses",
      saveFailed: "Error saving",
      saveFailedDesc: "We couldn't save the address",
      deleteFailed: "Error deleting",
      deleteFailedDesc: "We couldn't delete the address"
    },
    
    // Statistics
    stats: {
      total: "Total addresses",
      main: "Main address",
      delivery: "Delivery addresses"
    },

    // Actions
    actions: {
      edit: "Edit",
      delete: "Delete",
      addressTitle: "Address"
    },

    // Cities
    cities: {
      montreal: "Montreal"
    }
  },

  // Email verification (modal)
  verification: {
    title: "Verify Email",
    subtitle: "Verify your account to continue",
    description: "Enter the 6-digit code sent to your email",
    form: {
      codeLabel: "Verification code",
      codePlaceholder: "123456",
      verifyButton: "Verify",
      verifying: "Verifying...",
      resendButton: "Didn't receive the code? Resend",
      resending: "Resending..."
    },
    messages: {
      success: "Email verified successfully!",
      error: "Invalid verification code",
      resent: "Code resent to your email",
      resendError: "Error resending code",
      expired: "Code has expired. Request a new one",
      required: "Enter the 6-digit code",
      invalidLength: "Code must be 6 digits"
    }
  },

  // User profile section
  profile: {
    general: {
      title: "My Profile",
      subtitle: "Manage your account and preferences",
      memberSince: "Member since",
      editProfile: "Edit profile",
      verified: "Verified",
      pendingVerification: "Pending verification",
      needsHelp: "Need help?",
      supportText: "If you have any questions or issues, our support team is here to help you.",
      contactSupport: "Contact support",
      manageAccount: "Manage account",
      welcome: "Hello,",
      faq: "Frequently asked questions"
    },
    navigation: {
      profile: "Profile",
      favorites: "Favorites",
      addresses: "Addresses", 
      orders: "Orders",
      security: "Security",
      settings: "Settings"
    },
    stats: {
      favorites: "Favorite products",
      addresses: "Saved addresses",
      orders: "Orders placed"
    },
    sections: {
      favorites: {
        title: "Favorites",
        description: "Products you love"
      },
      addresses: {
        title: "Addresses",
        description: "Delivery addresses"
      },
      orders: {
        title: "Orders",
        description: "Purchase history"
      },
      security: {
        title: "Security",
        description: "Password and privacy"
      },
      settings: {
        title: "Settings",
        description: "Preferences and notifications"
      }
    },
    security: {
      title: "Security",
      subtitle: "Manage your account security",
      account: {
        title: "Account information",
        email: "Email address",
        verification: "Verification status",
        verified: "Verified",
        notVerified: "Not verified"
      },
      password: {
        title: "Change password",
        current: "Current password",
        new: "New password",
        confirm: "Confirm new password",
        currentPlaceholder: "Enter your current password",
        newPlaceholder: "Enter a new password",
        confirmPlaceholder: "Confirm your new password",
        update: "Update password",
        success: "Password updated successfully",
        errors: {
          passwordsNotMatch: "New passwords don't match",
          minLength: "New password must be at least 6 characters",
          generic: "Error changing password"
        }
      },
      basicInfo: {
        title: "Basic information",
        subtitle: "Update your name and phone number",
        name: "Full name",
        namePlaceholder: "Enter your full name",
        phone: "Phone number",
        phonePlaceholder: "Enter your phone number",
        update: "Update information",
        success: "Information updated successfully",
        errors: {
          nameRequired: "Name is required",
          nameMinLength: "Name must be at least 2 characters",
          generic: "Error updating information"
        }
      },
      sessions: {
        title: "Active sessions",
        currentDevice: "Current device",
        lastActivity: "Last activity: Now",
        active: "Active",
        closeAll: "Close all sessions",
        logoutAllNotAvailable: "This feature will be available soon"
      },
      delete: {
        title: "Danger zone",
        warning: "This action will permanently delete your account and all associated data. This action cannot be undone.",
        showForm: "Delete my account",
        passwordConfirm: "Confirm your password",
        passwordPlaceholder: "Enter your password",
        confirmLabel: "Type 'DELETE' to confirm",
        confirmHelp: "You must type exactly 'DELETE' in uppercase",
        confirm: "Delete account",
        success: "Account deleted successfully",
        errors: {
          confirmText: "You must type 'DELETE' to continue",
          generic: "Error deleting account"
        }
      }
    },
    settings: {
      title: "Settings",
      subtitle: "Customize your experience",
      preferences: {
        title: "Preferences",
        description: "Configure your personalized experience"
      },
      appearance: {
        title: "Appearance",
        darkMode: "Dark mode",
        darkModeDesc: "Switch between light and dark themes",
        theme: "Theme",
        themeDesc: "Select your preferred theme"
      },
      language: {
        title: "Language",
        description: "Select your preferred language",
        options: {
          es: "Español",
          en: "English",
          fr: "Français"
        }
      },
      notifications: {
        title: "Notifications",
        description: "Manage your notification preferences",
        email: "Email notifications",
        emailDescription: "Receive important notifications by email",
        orders: "Order updates",
        ordersDescription: "Receive updates about your order status",
        promotions: "Offers and promotions", 
        promotionsDescription: "Receive special offers and promotions",
        newsletter: "Newsletter",
        manage: "Manage notifications"
      },
      security: {
        title: "Security",
        description: "Protect your account",
        changePassword: "Change password",
        securitySettings: "Security settings",
        twoFactor: "Two-factor authentication"
      },
      payment: {
        title: "Payments",
        description: "Manage your payment methods",
        methods: "Payment methods",
        addMethod: "Add payment method",
        defaultMethod: "Default method"
      },
      privacy: {
        title: "Privacy",
        description: "Control your personal information",
        security: "Security settings",
        downloadData: "Download my data",
        deleteData: "Delete my account",
        cookiePreferences: "Cookie preferences"
      },
      general: {
        title: "General preferences",
        language: "Language",
        darkMode: "Dark mode"
      },
      account: {
        title: "Account",
        deleteAccount: "Delete account",
        deleteAccountDesc: "Permanently delete your account",
        exportData: "Export data",
        exportDataDesc: "Download a copy of your data"
      }
    },
    errors: {
      loadingUserData: "Error loading user information"
    }
  },

  auth: {
    // Modal titles
    loginTitle: "Sign In",
    registerTitle: "Create Account",
    forgotPasswordTitle: "Reset Password",
    
    // Desktop form titles
    loginFormTitle: "Access your account",
    registerFormTitle: "Join us",
    forgotPasswordFormTitle: "Reset password",
    
    // Descriptions
    loginDescription: "Welcome back to Tout À un clic là",
    registerDescription: "Join our community",
    forgotPasswordDescription: "We'll send you a link to reset your password",
    
    // Desktop form descriptions
    loginFormDescription: "Enter your credentials to access",
    registerFormDescription: "Complete your details to get started",
    forgotPasswordFormDescription: "Enter your email to recover access",
    
    // Extended descriptions for left column on desktop
    loginDescriptionExtended: "Access your account and enjoy the best online shopping experience with Latino products in Montreal.",
    registerDescriptionExtended: "Join our community and discover the best selection of Latino products in Montreal with fast delivery.",
    forgotPasswordDescriptionExtended: "Don't worry, we'll help you recover access to your account securely.",
    
    // Titles for left column on desktop
    welcomeBack: "Welcome back!",
    joinOurCommunity: "Join our community",
    resetPasswordTitle: "Recover your account",
    
    // Featured characteristics
    feature1: "Authentic Latino products",
    feature2: "Fast delivery in Montreal",
    feature3: "Competitive prices",
    
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
    
    // New translations for mobile refactor
    mobile: {
      menu: "Menu",
      navigation: "Navigation",
      user: "User",
      welcome: "Welcome!",
      loginPrompt: "Sign in to access all your account features",
      login: "Sign In",
      verifyAccount: "Verify account",
      accountVerified: "Account verified",
      quickAccess: "Quick Access",
      myProfile: "My Profile",
      orders: "Orders",
      addresses: "Addresses",
      exploreStore: "Explore Store",
      myAccount: "My Account",
      logout: "Sign Out"
    },
    
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

    // Prices
    price: {
      notAvailable: "Price not available",
      basePrice: "Base price",
      finalPrice: "Final price",
      includesTaxes: "Includes taxes",
      plusTaxes: "Plus taxes"
    },

    // Taxes
    tax: {
      nonTaxable: "Tax-free",
      taxable: "Taxable",
      basePrice: "Base price",
      tps: "GST",
      tvq: "PST",
      total: "Total with taxes"
    },

    // AddToCartButton
    addToCartButton: {
      addToCart: "Add to cart",
      outOfStock: "Out of stock",
      productOutOfStock: "Product out of stock",
      onlyUnitsAvailable: "Only {stock} units available",
      onlyUnitsLeft: "Only {stock} units left!",
      unitsAvailable: "{stock} units available",
      quantity: "Quantity",
      total: "Total",
      addingToCart: "Adding...",
      errorAddingToCart: "Error adding to cart"
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
      searching: "Searching...",
      noProducts: "No products found",
      noProductsMessage: "No products match the selected filters.",
      tryDifferentFilters: "Try adjusting your filters or searching for something different.",
      loadMore: "Load more",
      showingResults: "Showing {count} of {total} products",
      error: "Error loading products",
      retry: "Try again",
      
      // Search
      searchMinLength: "Type at least 2 characters to search",
      searchResults: "{count} results found",
      searchClear: "Clear search",
      
      // Notifications
      notifications: {
        filtersApplied: "Filters applied successfully",
        filtersCleared: "Filters cleared",
        searchCompleted: "Search completed",
        noResultsFound: "No results found",
        errorOccurred: "An error occurred while loading products"
      },
      
      // Mobile filters
      mobileFilters: {
        title: "Filters",
        apply: "Apply filters",
        cancel: "Cancel",
        reset: "Reset"
      },
      
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
        loginRequired: "You must sign in to continue",
        outOfStock: "Product out of stock",
        productNotFound: "Product not found"
      },
      
      // Prices and taxes
      price: {
        notAvailable: "Not available",
        basePrice: "Base price",
        total: "Total",
        savings: "You save",
        originalPrice: "Original price"
      },
      
      tax: {
        nonTaxable: "Non-Taxable",
        taxable: "Taxable",
        taxIncluded: "Taxes included",
        tps: "GST",
        tvq: "QST"
      },
      
      product: {
        supplier: "Supplier",
        category: "Category",
        subcategory: "Subcategory",
        stock: "Available",
        lowStock: "Low stock",
        outOfStock: "Out of stock"
      }
    },

    // FoodCatalog
    foodCatalog: {
      title: "Traditional Foods",
      subtitle: "Authentic flavors from all Latin America - Traditional gastronomy in Montreal",
      whyChooseUs: "Why choose us?",
      whyChooseUsDesc: "The best culinary experience in Montreal",
      restaurantsAvailable: "restaurants available",
      selectRestaurant: "Select your favorite restaurant",
      availableRestaurants: "Available Restaurants",
      exploreAllFlavors: "Explore all flavors",
      noRestaurants: "No restaurants available",
      comingSoon: "Coming soon, we'll have more restaurants available in your area.",
      backToRestaurants: "Back to restaurants",
      restaurantMenu: "Menu of {name}",
      menuTitle: "Menu of",
      menuSubtitle: "Discover authentic and traditional dishes",
      authenticDishes: "Discover authentic and traditional dishes",
      openNow: "Open",
      closedNow: "Closed",
      popular: "Popular",
      viewMenu: "View menu",
      viewFullMenu: "View full menu",
      contactUs: "Can't find your favorite restaurant? Contact us to add more options.",
      deliveryTime: "min",
      reviews: "reviews",
      selectedRestaurant: "Selected restaurant",
      searchPlaceholder: "Search restaurants...",
      sortByRating: "By rating",
      sortByName: "By name",
      sortByTime: "By time",
      filterAll: "All",
      filterNew: "New",
      filterTopRated: "Top rated"
    },

    // RestaurantList
    restaurantList: {
      errorTitle: "Error loading restaurants",
      errorDesc: "An error occurred while loading the restaurant list. Please try again.",
      noRestaurants: "No restaurants available",
      noRestaurantsDesc: "We will soon have more traditional food options for you.",
      viewMenu: "View menu",
      available: "Available",
      rating: "rating",
      openNow: "Open now",
      popular: "Popular",
      verified: "Verified",
      cuisine: "Cuisine",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      viewMenuFor: "View menu for",
      noDescription: "Discover the unique flavors of this restaurant"
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
    },
    
    // RestaurantGrid
    restaurantGrid: {
      selectRestaurant: "Choose your restaurant",
      title: "Authentic Restaurants",
      subtitle: "Discover the best Latin American flavors in Montreal. Each restaurant offers traditional and authentic recipes.",
      errorTitle: "Error loading restaurants",
      noRestaurants: "No restaurants available",
      noRestaurantsDesc: "Currently there are no restaurants available in this category.",
      restaurantType: "Traditional Latin American food",
      viewMenu: "View menu",
      callToAction: "Can't find what you're looking for? Explore all our partner restaurants.",
      exploreAll: "Explore all restaurants"
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
  },

  // Terms of Service
  terms: {
    title: "Terms of Service",
    lastUpdated: "Last updated:",
    sections: {
      introduction: {
        title: "1. Introduction",
        paragraph1: "Welcome to Tout à un clic là. This document constitutes a legally binding agreement (\"Agreement\") between you and Tout à un clic là, governed by Canadian law. These Terms of Service regulate your access and use of our e-commerce platform (\"the Platform\"), including any associated mobile applications, content, functionalities, and services offered.",
        paragraph2: "By accessing or using our Platform, you confirm that you have read, understood, and agree to be bound by these terms. If you do not agree with any part of this Agreement, please refrain from using our services."
      },
      eligibility: {
        title: "2. Eligibility and User Accounts",
        paragraph1: "To use our services, you must be at least 18 years old or the age of legal majority in your jurisdiction, whichever is greater. By creating an account, you warrant that all information provided is true, accurate, complete, and up-to-date.",
        paragraph2: "It is your responsibility to maintain the confidentiality of your account and password, as well as restrict access to your device. You accept full responsibility for all activities that occur under your account. If you suspect unauthorized use of your account, you must notify us immediately.",
        paragraph3: "Tout à un clic là reserves the right to suspend or terminate your account, at our discretion and without prior notice, if we determine that you have violated any provision of these Terms of Service or if your conduct could cause harm to our Platform, other users, or third parties."
      },
      products: {
        title: "3. Products and Services",
        paragraph1: "The products and services offered on our Platform are subject to availability. We strive to provide accurate descriptions, including specifications, features, and visual representations of our products. However, we do not guarantee that such descriptions or representations are accurate, complete, reliable, current, or error-free.",
        paragraph2: "Colors shown on your device may vary from actual products due to different display technologies, settings, and technical limitations.",
        paragraph3: "Tout à un clic là reserves the right, at its absolute discretion, to limit quantities of any product or service, restrict sales to any person or geographic region, and suspend or discontinue any product or service without prior notice."
      },
      pricing: {
        title: "4. Pricing, Taxes, and Payments",
        paragraph1: "All prices are denominated in Canadian dollars (CAD) unless otherwise indicated, and do not include applicable taxes, shipping fees, or other charges, which will be disclosed during the purchase process before order confirmation.",
        paragraph2: "In accordance with Canadian tax legislation, we may be required to collect and remit provincial and federal taxes, including Goods and Services Tax (GST), Harmonized Sales Tax (HST), or Provincial Sales Tax (PST), as applicable to your location.",
        paragraph3: "We reserve the right to modify prices at any time without prior notice. Your order is subject to the price in effect at the time we complete your transaction.",
        paragraph4: "We accept various payment methods as specified on our Platform. By providing payment information, you warrant that you are authorized to use the selected payment method and that such information is accurate and complete."
      },
      shipping: {
        title: "5. Shipping and Delivery",
        paragraph1: "We ship to addresses within Canada and selected international destinations. Delivery times are estimates based on information provided by our logistics partners and may vary depending on your location, weather conditions, order volume, and other external factors.",
        paragraph2: "For international shipments, you are responsible for any import taxes, customs duties, and additional charges imposed by your country's authorities. These charges are not under our control and are not included in the purchase price.",
        paragraph3: "Risk of loss and title to products pass to you at the time of delivery. It is your responsibility to inspect products upon receipt and notify any damage or discrepancy within 48 hours of delivery."
      },
      returns: {
        title: "6. Returns and Refunds Policy",
        paragraph1: "In accordance with the Canadian Consumer Protection Act and applicable provincial laws, we offer a return policy that allows you to return most products within 30 days of receipt, provided the following conditions are met:",
        list1: [
          "The product must be in its original condition, unused, and with all original tags and packaging.",
          "Proof of purchase or order confirmation must be included.",
          "Customized, perishable, personal hygiene items, or items marked as final sale are not eligible for return, except in case of verifiable defects."
        ],
        paragraph2: "Refunds will be processed using the same payment method used for the original purchase within 14 business days of receiving and verifying returned items. Original shipping and return costs are generally non-refundable, except in cases of defective products or shipping errors attributable to our responsibility."
      },
      intellectualProperty: {
        title: "7. Intellectual Property",
        paragraph1: "The Platform and all its content, features, and functionalities, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Tout à un clic là, its licensors, or other content providers, and are protected by Canadian and international copyright, trademark, patent, trade secret, and other intellectual property laws.",
        paragraph2: "Unauthorized use of any content or material on our Platform is strictly prohibited. No implicit or express license is granted to use any intellectual property without our prior written consent."
      },
      liability: {
        title: "8. Limitation of Liability",
        paragraph1: "To the maximum extent permitted by applicable law, Tout à un clic là, its directors, employees, agents, and affiliates shall not be liable for:",
        list1: [
          "Indirect, incidental, special, punitive, or consequential damages, including loss of profits, data, use, or any other intangible loss, resulting from (i) your access to or use of or inability to access or use our Platform; (ii) any conduct or content of third parties on the Platform; or (iii) unauthorized access, use, or alteration of your transmissions or content.",
          "Interruptions, errors, omissions, or delays in Platform operation or delivery of products or services.",
          "Viruses, trojans, or other malicious software that may be transmitted to or through our Platform."
        ],
        paragraph2: "Our total liability for any claim under these Terms shall not exceed the amount paid by you to Tout à un clic là during the six (6) months preceding the action giving rise to such liability.",
        paragraph3: "The above limitations shall apply regardless of whether Tout à un clic là has been advised of the possibility of such damages and regardless of whether any remedy set forth herein fails of its essential purpose."
      },
      governing: {
        title: "9. Governing Law and Dispute Resolution",
        paragraph1: "These Terms of Service shall be governed and interpreted in accordance with the laws of the province of Quebec and the federal laws of Canada applicable therein, without regard to conflict of law principles.",
        paragraph2: "Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach, termination, or invalidity thereof, shall be resolved through good faith negotiation. If the dispute cannot be resolved through negotiation, both parties agree to submit the dispute to mediation in accordance with the mediation rules of the Canadian Institute for Mediation and Arbitration.",
        paragraph3: "If mediation does not resolve the dispute, it shall be submitted to binding arbitration before a single arbitrator in accordance with the Canadian Commercial Arbitration Act. The place of arbitration shall be Montreal, Quebec, Canada, and the language of arbitration shall be English or French, as agreed by the parties."
      },
      changes: {
        title: "10. Changes to Terms",
        paragraph1: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. The updated version will be effective as soon as it is published on our Platform. It is your responsibility to periodically review these Terms to stay informed of any changes.",
        paragraph2: "Continued use of our Platform after the publication of any modifications constitutes acceptance of such modifications. If you do not agree with the new terms, you must stop using our Platform.",
        paragraph3: "For substantial changes, we will make reasonable efforts to notify you, either through a prominent notice on our Platform, by email to the address associated with your account, or by other means."
      },
      contact: {
        title: "11. Contact",
        paragraph1: "If you have questions about these Terms of Service or need assistance with our products or services, you can contact us through:",
        email: "serviceclient@toutaunclicla.com",
        paragraph2: "Our customer service team is available to assist you Monday through Friday, 9:00 a.m. to 5:00 p.m. (Eastern Time)."
      }
    }
  },

  // Privacy Policy
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated:",
    sections: {
      introduction: {
        title: "1. Introduction",
        paragraph1: "At Tout à un clic là, we respect your privacy and are committed to protecting your personal data in accordance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA). This privacy policy details how we collect, use, protect, and disclose personal information you provide when using our e-commerce platform, as well as your privacy rights under Canadian legislation."
      },
      dataCollection: {
        title: "2. Data We Collect",
        paragraph1: "In accordance with privacy principles established by PIPEDA, we collect only personal information necessary for identified purposes and with your consent. This information may include:",
        list1: [
          "Identity data: full name, username, or similar identifiers.",
          "Contact data: postal address, billing address, delivery address, email, and phone numbers.",
          "Financial data: payment card information (processed securely through authorized payment providers and complying with PCI DSS standards).",
          "Transaction data: purchase records, products acquired, purchase frequency, and payment methods used.",
          "Technical data: IP address, login data, browser type and version, timezone settings, location, device types used to access the platform.",
          "Profile data: username and password (stored encrypted), purchase preferences, interests, and survey responses when you have chosen to participate.",
          "Usage data: information about how you browse and use our platform, including time spent on pages and browsing patterns."
        ]
      },
      dataUsage: {
        title: "3. How We Use Your Data",
        paragraph1: "We use your personal information only for specific purposes for which it was collected and in accordance with PIPEDA and other applicable Canadian laws. These purposes include:",
        list1: [
          "Managing your account and our contractual relationship, including verifying your identity when necessary.",
          "Processing and delivering your orders, including managing payments, billing, and shipping.",
          "Managing our digital platform (including data analysis, testing, system maintenance, technical support, and computer security).",
          "Improving our products and services through analysis of usage patterns and customer preferences.",
          "Communicating with you about product updates, special offers, or relevant information, always with the option to unsubscribe from these communications.",
          "Complying with legal and tax obligations as required by Canadian legislation."
        ]
      },
      cookies: {
        title: "4. Cookies and Tracking Technologies",
        paragraph1: "We use cookies and similar technologies in accordance with Canadian electronic privacy laws. These technologies allow us to:",
        list1: [
          "Remember your preferences and settings to improve your experience.",
          "Understand how you use our platform to optimize it.",
          "Facilitate essential functionalities like shopping cart and session authentication."
        ],
        paragraph2: "You can configure your browser to reject all or some cookies, or to alert you when they are used. However, this could affect the functioning of certain parts of our platform. By continuing to use our site without changing your settings, you consent to our use of cookies as described in this policy."
      },
      dataDisclosure: {
        title: "5. Disclosure of Your Personal Data",
        paragraph1: "In accordance with Canadian legislation, we may share your personal information only in specific circumstances:",
        list1: [
          "With service providers who assist us in our business operations (payment processors, delivery services, web hosting providers) under strict confidentiality agreements.",
          "With professionals such as legal advisors, accountants, and auditors when necessary for our business operations.",
          "With government authorities when required by law, regulation, or legal process.",
          "In the context of a business transaction such as merger, acquisition, or asset sale, with prior notification to affected users."
        ],
        paragraph2: "We require all third parties to respect the confidentiality and security of your personal data and to comply with all applicable privacy laws, including PIPEDA. We do not allow our service providers to use your data for unauthorized purposes of their own."
      },
      internationalTransfers: {
        title: "6. International Data Transfers",
        paragraph1: "If we transfer your personal data outside of Canada, we do so only when adequate safeguards exist to protect your privacy rights, in accordance with PIPEDA requirements. These safeguards may include:",
        list1: [
          "Transfers to countries that the Privacy Commissioner of Canada has determined offer an adequate level of protection.",
          "Implementation of approved contractual clauses.",
          "Obtaining your explicit consent when necessary."
        ]
      },
      dataSecurity: {
        title: "7. Data Security",
        paragraph1: "We have implemented appropriate technical and organizational security measures according to Canadian industry standards to protect your personal data against unauthorized access, alterations, disclosures, or destruction. These measures include:",
        list1: [
          "Encryption of sensitive data and financial transactions.",
          "Firewall systems and intrusion detection.",
          "Restricted access to personal information based on need-to-know.",
          "Regular security assessments and compliance audits."
        ]
      },
      dataRetention: {
        title: "8. Data Retention",
        paragraph1: "We retain your personal data only for as long as necessary for the purposes for which it was collected, in accordance with our legal and business obligations. Criteria used to determine our retention periods include:",
        list1: [
          "The period during which we maintain an active business relationship with you.",
          "Our legal obligations under applicable Canadian legislation, including tax and commercial regulations.",
          "Requirements for dispute resolution or claims."
        ]
      },
      yourRights: {
        title: "9. Your Legal Rights",
        paragraph1: "Under PIPEDA and other Canadian privacy laws, you have specific rights regarding your personal data, which include:",
        list1: [
          "Right of access: Request access to your personal data that we process.",
          "Right of rectification: Request correction of inaccurate or incomplete information.",
          "Right to withdraw consent: Withdraw your consent at any time when processing is based on your consent.",
          "Right to file a complaint: File a complaint with the Office of the Privacy Commissioner of Canada if you believe we have violated your privacy rights.",
          "Right to challenge compliance: Challenge our compliance with PIPEDA principles."
        ],
        paragraph2: "To exercise any of these rights, contact us using the information provided in the \"Contact\" section."
      },
      changes: {
        title: "10. Changes to this Privacy Policy",
        paragraph1: "We may update this privacy policy periodically to reflect changes in our practices or Canadian legislation. The most recent version will always be available on our platform, with the update date clearly indicated. For significant changes, we will provide visible notifications on our platform or send you direct communications."
      },
      contact: {
        title: "11. Contact",
        paragraph1: "For any inquiries related to this privacy policy or the processing of your personal data, you can contact us through:",
        email: "serviceclient@toutaunclicla.com",
        paragraph2: "If you believe we have not adequately addressed your concerns, you have the right to file a complaint with the Office of the Privacy Commissioner of Canada:",
        website: "www.priv.gc.ca"
      }
    }
  }
};