export default {
  // Traducciones comunes
  common: {
    loading: "Cargando",
    error: "Error",
    success: "Éxito",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    back: "Volver",
    close: "Cerrar",
    confirm: "Confirmar",
    yes: "Sí",
    no: "No",
    update: "Actualizar",
    create: "Crear",
    dateNotAvailable: "Fecha no disponible",
    deleting: "Eliminando...",
    saving: "Guardando...",
    editing: "Editando...",
    next: "Siguiente",
    previous: "Anterior",
    continue: "Continuar"
  },
  nav: {
    home: "Inicio",
    products: "Productos",
    foods: "Comidas",
    boutique: "Souvenirs",
    login: "Iniciar Sesión",
    aboutUs: "Sobre Nosotros",
    profile: {
      myProfile: "Mi Perfil",
      addresses: "Direcciones",
      favorites: "Favoritos", 
      myOrders: "Pedidos",
      security: "Seguridad",
      notifications: "Notificaciones",
      settings: "Configuración",
      logout: "Cerrar sesión"
    }
  },
  footer: {
    about: {
      title: "Tout à un Clic LA",
      description: "Conectando las Américas a través de productos auténticos y experiencias únicas. Entrega en la zona metropolitana de Montreal."
    },
    explore: {
      title: "Explorar",
      home: "Inicio",
      products: "Productos",
      foods: "Comidas",
      boutique: "Souvenirs"
    },
    popularProducts: {
      title: "Productos Populares",
      flourAndDough: "Harina y Masa",
      saucesAndDressings: "Salsas y Aderezos",
      snacks: "Paquetes y Snacks"
    },
    gastronomy: {
      title: "Gastronomía",
      northAmerica: "Norte América",
      centralAmerica: "Centro América",
      southAmerica: "Sur América",
      authenticRecipes: "Recetas Auténticas",
      specialIngredients: "Ingredientes Especiales"
    },
    contact: {
      title: "Contacto",
      address: "620 Rue Saint-Thomas, Longueuil, QC J4H 3A7",
      email: "serviceclient@toutaunclicla.com",
      contactNow: "Contactar Ahora"
    },
    boutique: {
      clothing: "Ropa",
      accessories: "Accesorios", 
      souvenirs: "Souvenirs"
    },
    company: {
      aboutUs: "Quiénes Somos",
      blog: "Blog Latino",
      terms: "Términos y Condiciones",
      privacy: "Política de Privacidad",
      shipping: "Política de Envíos",
      faq: "Preguntas Frecuentes"
    },
    languages: {
      spanish: "Español",
      english: "English",
      french: "Français"
    },
    copyright: "© {year} Tout à un Clic LA. Todos los derechos reservados."
  },
  landing: {
    hero: {
      title: "Descubre América Latina",
      subtitle: "Productos auténticos y experiencias únicas",
      description: "Conectando las Américas a través de productos auténticos y experiencias únicas. Entrega en la zona metropolitana de Montreal.",
      cta: "Registrate Para Distrutar de todas las americas!"
    },
    search: {
      title: "¿Qué estás buscando?",
      placeholder: "Buscar productos, marcas, categorías...",
      button: "Buscar",
      noResultsTitle: "Sin resultados",
      noResultsMessage: "No encontramos productos que coincidan con tu búsqueda",
      searchingMessage: "Buscando productos...",
      showingResults: "Mostrando {count} resultado{plural}",
      viewAllResults: "Ver todos los resultados",
      suggestions: "Sugerencias:",
      popularSearches: "Búsquedas populares:",
      recentSearches: "Búsquedas recientes:",
      clearSearch: "Limpiar búsqueda",
      searchInProducts: "Buscar en Productos",
      searchInBoutique: "Buscar en Boutique",
      // Nuevas traducciones para el buscador
      minCharactersTitle: "Escribe al menos 2 caracteres",
      minCharactersMessage: "para comenzar a buscar productos",
      keepTypingTitle: "Sigue escribiendo...",
      keepTypingMessage: "o prueba con otros términos de búsqueda",
      searchingFor: "Buscando: \"{query}\"",
      inStock: "En stock",
      outOfStock: "Agotado",
      products: "Productos",
      boutique: "Boutique",
      categories: {
        productos: "Productos",
        boutique: "Boutique"
      },
      quickActions: {
        seeAll: "Ver todo",
        filter: "Filtrar"
      }
    },
    categories: {
      products: {
        title: "Productos",
        description: "Productos únicos de América Latina, desde artesanías hasta innovaciones modernas."
      },
      foods: {
        title: "Comidas",
        description: "Gastronomía latinoamericana con recetas auténticas y sabores tradicionales."
      },
      boutique: {
        title: "Souvenirs",
        description: "Souvenirs y regalos únicos que capturan la esencia de cada país."
      }
    },
    sections: {
      products: {
        title: "Productos",
        description: "Explora nuestra selección cuidadosamente elegida de productos auténticos de todas las Américas. Cada artículo cuenta una historia de tradición y artesanía.",
        viewAll: "Ver catálogo completo"
      },
      foods: {
        title: "Comidas Tradicionales",
        description: "Explora nuestra colección de platos auténticos y sabores tradicionales de las diversas regiones de América.",
        viewAll: "Ver catálogo completo"
      },
      boutique: {
        title: "Colección de Souvenirs",
        description: "Descubre nuestra colección exclusiva de artículos artesanales de las Américas",
        viewAll: "Ver catálogo completo"
      }
    },
    productCategories: [
      {
        id: 1,
        name: "Harinas y Masas",
        description: "Descubre nuestras auténticas harinas y masas para preparaciones tradicionales",
        image: "/harinasMasas.png",
        color: "from-indigo-600 to-blue-600",
        viewText: "Explorar harinas y masas",
        subcategoria_id: "harinas-masas"
      },
      {
        id: 2,
        name: "Salsas y Aderezos",
        description: "Realza tus comidas con nuestras auténticas salsas y aderezos",
        image: "/salsasAderezos.png",
        color: "from-rose-600 to-red-600",
        viewText: "Descubrir salsas y aderezos",
        subcategoria_id: "salsas-aderezos"
      },
      {
        id: 3,
        name: "Paquetes y Snacks",
        description: "Disfruta de nuestros paquetes y snacks tradicionales de América",
        image: "/paquetesSnacks.png",
        color: "from-amber-600 to-yellow-600",
        viewText: "Ver paquetes y snacks",
        subcategoria_id: "paquetes-snacks"
      },
      {
        id: 12,
        name: "Bebidas",
        description: "Refréscate con nuestras bebidas auténticas de las Américas",
        image: "/bebidas.png",
        color: "from-cyan-600 to-blue-600",
        viewText: "Explorar bebidas",
        subcategoria_id: "bebidas"
      }
    ],
    panamericanFood: {
      id: 1,
      name: "Comidas Panamericanas",
      description: "Descubre nuestros restaurantes aliados que te traen la auténtica comida de todo el continente americano, preparada con recetas tradicionales y sabores únicos.",
      color: "from-amber-600 to-yellow-600",
      viewText: "Explorar restaurantes"
    },
    foodRegions: [
      {
        id: 1,
        name: "América del Norte",
        description: "Explora los sabores de Estados Unidos, Canadá y México",
        image: "/norteAmerica.png",
        color: "from-red-600 to-rose-600",
        viewText: "Explorar sabores del norte",
        subcategoria_id: "norte-america"
      },
      {
        id: 2,
        name: "Centroamérica y Caribe",
        description: "Descubre la rica gastronomía de las islas y el istmo centroamericano",
        image: "/centroAmerica.png",
        color: "from-emerald-600 to-green-600",
        viewText: "Descubrir sabores tropicales",
        subcategoria_id: "centro-america-caribe"
      },
      {
        id: 3,
        name: "América del Sur",
        description: "Conoce los sabores auténticos de países como Colombia, Perú, Argentina y más",
        image: "/surAmerica.png",
        color: "from-amber-600 to-yellow-600",
        viewText: "Ver sabores sudamericanos",
        subcategoria_id: "sur-america"
      }
    ],
    boutiqueCategories: [
      {
        id: 2,
        name: "Accesorios Decorativos",
        description: "Decora tu hogar con auténticas piezas artesanales americanas",
        image: "/accesoriosBoutique.png",
        color: "from-pink-600 to-rose-600",
        viewText: "Descubrir decoración",
        subcategoria_id: "accesorios"
      },
      {
        id: 3,
        name: "Souvenirs",
        description: "Lleva contigo un pedazo de América con nuestros encantadores souvenirs",
        image: "/souvenirBoutique.png",
        color: "from-amber-600 to-orange-600",
        viewText: "Ver souvenirs",
        subcategoria_id: "souvenirs"
      },
           {
        id: 1,
        name: "Ropa",
        description: "Viste con las mejores prendas tradicionales americanas",
        image: "/ropaBoutique.png",
        color: "from-purple-600 to-indigo-600",
        viewText: "Explorar colección",
        subcategoria_id: "ropa"
      },
    ]  },  auth: {
    // Títulos de modales
    loginTitle: "Iniciar Sesión",
    registerTitle: "Crear Cuenta",
    forgotPasswordTitle: "Recuperar Contraseña",
    
    // Títulos para formularios en desktop
    loginFormTitle: "Accede a tu cuenta",
    registerFormTitle: "Únete a nosotros",
    forgotPasswordFormTitle: "Restablecer contraseña",
    
    // Descripciones
    loginDescription: "Bienvenido de vuelta a Tout À un clic là",
    registerDescription: "Únete a nuestra comunidad",
    forgotPasswordDescription: "Te enviaremos un enlace para restablecer tu contraseña",
    
    // Descripciones para formularios en desktop
    loginFormDescription: "Ingresa tus credenciales para acceder",
    registerFormDescription: "Completa tus datos para comenzar",
    forgotPasswordFormDescription: "Ingresa tu email para recuperar el acceso",
    
    // Descripciones extendidas para columna izquierda en desktop
    loginDescriptionExtended: "Accede a tu cuenta y disfruta de la mejor experiencia de compra en línea con productos latinos en Montreal.",
    registerDescriptionExtended: "Únete a nuestra comunidad y descubre la mejor selección de productos latinos en Montreal con entrega rápida.",
    forgotPasswordDescriptionExtended: "No te preocupes, te ayudamos a recuperar el acceso a tu cuenta de forma segura.",
    
    // Títulos para columna izquierda en desktop
    welcomeBack: "¡Bienvenido de vuelta!",
    joinOurCommunity: "Únete a nuestra comunidad",
    resetPasswordTitle: "Recupera tu cuenta",
    
    // Características destacadas
    feature1: "Productos latinos auténticos",
    feature2: "Entrega rápida en Montreal",
    feature3: "Precios competitivos",
    
    // Labels de campos
    fullName: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    
    // Placeholders
    fullNamePlaceholder: "Tu nombre completo",
    emailPlaceholder: "tu@ejemplo.com",
    phonePlaceholder: "Tu número de teléfono",
    passwordPlaceholder: "Tu contraseña",
    passwordRegisterPlaceholder: "Mínimo 6 caracteres",
    confirmPasswordPlaceholder: "Repite tu contraseña",
    
    // Botones
    loginButton: "Iniciar sesión",
    registerButton: "Crear cuenta",
    forgotPasswordButton: "Enviar enlace",
    continueWithGoogle: "Continuar con Google",
    continueWithGoogleRegister: "Registrarse con Google",
    registerWithEmail: "Registrarse con correo electrónico",
    
    // Estados de carga
    loggingIn: "Iniciando sesión...",
    creatingAccount: "Creando cuenta...",
    sendingLink: "Enviando enlace...",
    
    // Separador
    orContinueWith: "O continúa con",
    
    // Checkbox y términos
    acceptTerms: "Acepto los",
    termsAndConditions: "Términos y Condiciones",
    and: "y la",
    privacyPolicy: "Política de Privacidad",
    acceptTermsRequired: "Debes aceptar los términos y condiciones para continuar",
    rememberMe: "Recuérdame",
    forgotPassword: "¿Olvidaste tu contraseña?",
    
    // Enlaces del footer
    noAccount: "¿No tienes una cuenta?",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    signUp: "Regístrate",
    signIn: "Inicia sesión",
    backToLogin: "Volver a inicio de sesión",
    
    // Mensajes de error comunes
    emailRequired: "El email es requerido",
    emailInvalid: "Email inválido",
    passwordRequired: "La contraseña es requerida",
    passwordInvalid: "La contraseña debe tener al menos 6 caracteres, una letra y un número",
    passwordsMismatch: "Las contraseñas no coinciden",
    nameRequired: "El nombre es requerido",
    emailAlreadyExists: "Este email ya está registrado. Intenta iniciar sesión.",
    emailNotRegistered: "Este email no está registrado. Intenta crear una cuenta.",
    errorCheckingEmail: "Error al verificar email",
    generalError: "Ha ocurrido un error",
    
    // Mensajes de éxito
    accountCreated: "Cuenta creada exitosamente. Por favor, verifica tu email.",
    passwordResetSent: "Se ha enviado un enlace a tu correo para restablecer tu contraseña",
    redirecting: "Redirigiendo...",
    googleAuthError: "Error al iniciar sesión con Google",
    
    // Verificación
    verificationRequired: "Tu cuenta requiere verificación. Por favor, revisa tu correo electrónico para completar el proceso o solicita un nuevo correo de verificación.",
    invalidCredentials: "Credenciales inválidas. Verifica tu email y contraseña.",
    resendVerification: "¿Deseas que enviemos un nuevo correo de verificación?",
    verificationSent: "Nuevo correo de verificación enviado. Por favor, revisa tu bandeja de entrada.",
    verificationError: "Error al enviar el correo de verificación",
    verificationTitle: "Verificar Email",
    verificationDescription: "Verifica tu email",
    verificationCodeLabel: "Código de verificación",
    verificationCodePlaceholder: "123456",
    verificationInstructions: "Ingresa el código de 6 dígitos enviado a tu email",
    verifyButton: "Verificar",
    verifying: "Verificando...",
    resendCode: "¿No recibiste el código? Reenviar",
    codeResent: "Código reenviado",
    checkEmailForNewCode: "Revisa tu email para el nuevo código",
    resendCodeError: "Error al reenviar código",
    emailNotFoundForVerification: "No se encontró el email para verificar",
    emailNotFoundForResend: "No se encontró el email para reenviar el código",
    enterSixDigitCode: "Ingresa el código de 6 dígitos",
    verificationSuccess: "¡Email verificado!",
    accountVerifiedCorrectly: "Tu cuenta ha sido verificada correctamente",
    invalidVerificationCode: "Código de verificación inválido",
    accountRequiresVerification: "Tu cuenta requiere verificación. Te enviamos un nuevo código a tu email.",
    checkYourEmail: "Revisa tu correo electrónico",
    
    // Modal headers
    createFreeAccount: "Crea tu cuenta gratis",
    verifyYourEmail: "Verifica tu email",
    
    // Estados del modal
    processing: "Procesando...",
    orText: "o",
    optionalText: "(opcional)",
    
    // Toast mensajes
    welcomeMessage: "¡Bienvenido!",
    loginSuccessDescription: "Has iniciado sesión correctamente",
    registrationSuccess: "¡Registro exitoso!",
    verificationCodeSent: "Te enviamos un código de verificación a tu email",
    comingSoon: "Próximamente",
    googleLoginComingSoon: "El login con Google estará disponible pronto",
    
    // Errores específicos del modal
    loginError: "Error al iniciar sesión",
    registrationError: "Error al registrar usuario",
    
    // Aria labels
    closeModal: "Cerrar",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    
    // Callback page
    callback: {
      processing: "Procesando...",
      success: "¡Éxito!",
      error: "Error",
      processingAuth: "Procesando autenticación...",
      verifyingGoogle: "Verificando tu autenticación con Google...",
      welcomeUser: "¡Bienvenido ",
      authSuccess: "Autenticación completada exitosamente",
      authError: "Error al procesar la autenticación",
      redirecting: "Redirigiendo automáticamente...",
      redirectingError: "Redirigiendo al inicio en unos segundos...",
      goToHome: "Ir al inicio ahora",
      takingSeconds: "Esto solo tomará unos segundos...",
      googleAuthProcessing: "Procesando inicio de sesión con Google...",
      creatingAccount: "Creando tu cuenta...",
      updatingProfile: "Actualizando tu perfil...",
      almostDone: "Ya casi terminamos...",
      authenticationComplete: "Autenticación completada",
      redirectingToDashboard: "Te estamos redirigiendo a tu cuenta"
    }
  },
    // Nuevas traducciones para el navbar móvil
  navbar: {
    welcome: "¡Bienvenid@!",
    accessYourAccount: "Accede a tu cuenta para comenzar",
    loginButton: "Iniciar Sesión",
    createAccountButton: "Crear Cuenta",
    logoutButton: "Cerrar sesión",
    
    // Estados de verificación
    pendingVerification: "Pendiente de verificación",
    unverifiedAccount: "Cuenta sin verificar",
    accountNeedsVerification: "Tu cuenta necesita verificación",
    
    // Secciones del menú
    mainMenu: "Menú Principal",
    myAccount: "Mi Cuenta",
    quickAccess: "Accesos Rápidos",
    
    // Enlaces rápidos
    favorites: "Favoritos",
    orders: "Pedidos",
    addresses: "Direcciones",
    
    // Nuevas traducciones para el refactor móvil
    mobile: {
      menu: "Menú",
      navigation: "Navegación",
      user: "Usuario",
      welcome: "¡Bienvenido!",
      loginPrompt: "Inicia sesión para acceder a todas las funciones de tu cuenta",
      login: "Iniciar Sesión",
      verifyAccount: "Verificar cuenta",
      accountVerified: "Cuenta verificada",
      quickAccess: "Acceso Rápido",
      myProfile: "Mi Perfil",
      orders: "Pedidos",
      addresses: "Direcciones",
      exploreStore: "Explorar Tienda",
      myAccount: "Mi Cuenta",
      logout: "Cerrar Sesión"
    },
    
      // Mensajes de sistema
    logoutSuccess: "Sesión cerrada correctamente",
    logoutError: "Error al cerrar sesión",
    languageChanged: "Idioma cambiado a"
  },
  
  // Traducciones para catálogo de productos
  catalog: {
    // Restaurant Banner
    restaurantBanner: {
      description: "Descubre los deliciosos sabores auténticos de {restaurantName}",
      deliveryAvailable: "Entrega disponible",
      businessHours: "11:00 AM - 9:00 PM",
      authenticCuisine: "Cocina auténtica"
    },
    // ProductCard
    productCard: {
      addToCart: "Agregar al carrito",
      addingToCart: "Agregando...",
      addToFavorites: "Agregar a favoritos",
      removeFromFavorites: "Eliminar de favoritos",
      outOfStock: "Agotado",
      rating: "Calificación",
      reviews: "reseñas",
      quickView: "Vista rápida",
      seeDetails: "Ver detalles",
      originalPrice: "Precio original",
      discountedPrice: "Precio con descuento",
      savings: "Ahorras",
      freeShipping: "Envío gratis",
      limitedStockUnits: "Queda 1 unidad!",
      newProduct: "Nuevo",
      bestseller: "Más vendido",
      featured: "Destacado"
    },

    // Precios
    price: {
      notAvailable: "Muy pronto",
      basePrice: "Precio base",
      finalPrice: "Precio final",
      includesTaxes: "Incluye impuestos",
      plusTaxes: "Más impuestos",
      from: "Desde",
      selectPrice: "Precio a seleccionar"
    },

    // Variaciones de producto
    variations: {
      optionsAvailable: "Opciones disponibles",
      viewOptions: "Ver opciones",
      customizationAvailable: "Personalización disponible",
      clickToCustomize: "Haz clic para personalizar este producto",
      selectAllRequired: "Selecciona todas las opciones requeridas",
      requiredGroup: "Requerido",
      selectOption: "Selecciona una opción",
      selectOptions: "Selecciona {min} a {max} opciones",
      optionsSelected: "opciones seleccionadas",
      priceBreakdown: "Desglose de precio",
      priceSummary: "Resumen de Precio",
      basePrice: "Precio base",
      additionalOptions: "Opciones adicionales",
      discounts: "Descuentos",
      totalPrice: "Precio total",
      validSelection: "Selección válida",
      invalidSelection: "Selección incompleta",
      stockInsufficient: "Stock insuficiente para {name}",
      defaultOption: "Por defecto",
      outOfStock: "Agotado",
      onlyXAvailable: "Solo {stock} disponibles",
      priceModifier: {
        add: "Agregar {price}",
        subtract: "Descuento {price}",
        free: "Gratis"
      },
      groupTypes: {
        single: "Selecciona una opción",
        multiple: "Selecciona múltiples opciones"
      },
      validation: {
        requiredGroupMissing: "Este grupo es requerido",
        tooFewSelections: "Selecciona al menos {min} opción(es)",
        tooManySelections: "Selecciona máximo {max} opción(es)",
        stockInsufficient: "Stock insuficiente para {name}"
      },
      cart: {
        variationsApplied: "Personalización aplicada",
        basePrice: "Precio base",
        variationCosts: "Opciones adicionales",
        totalWithVariations: "Total personalizado",
        variationDetails: "Detalles de personalización"
      },
      customizeProduct: "Personaliza tu producto",
      addCustomized: "Agregar personalizado"
    },

    // Impuestos
    tax: {
      nonTaxable: "Sin impuestos",
      taxable: "Con impuestos",
      basePrice: "Precio base",
      tps: "TPS",
      tvq: "TVQ",
      consigne: "Consigna",
      total: "Total con impuestos"
    },

    // AddToCartButton
    addToCartButton: {
      addToCart: "Agregar",
      outOfStock: "Sin stock",
      productOutOfStock: "Producto sin stock",
      onlyUnitsAvailable: "Solo hay {stock} unidades disponibles",
      onlyUnitsLeft: "¡Solo quedan {stock} unidades!",
      unitsAvailable: "{stock} unidades disponibles",
      quantity: "Cantidad",
      total: "Total",
      addingToCart: "Agregando...",
      errorAddingToCart: "Error al agregar al carrito",
      addedToCart: "Agregado al carrito"
    },
    
    // ProductList
    productList: {
      // Títulos de páginas
      productsTitle: "Nuestros Productos",
      productsSubtitle: "Descubre la mejor selección de productos latinoamericanos",
      comidasTitle: "Comidas Tradicionales",
      comidasSubtitle: "Sabores auténticos de toda América Latina - Gastronomía tradicional en Montreal",
      boutiqueTitle: "Boutique",
      boutiqueSubtitle: "Artesanías y souvenirs únicos - Productos artesanales latinoamericanos",
      
      // Filtros
      filters: "Filtros",
      search: "Buscar productos",
      searchPlaceholder: "Buscar por nombre...",
      category: "Categoría",
      allCategories: "Todas las categorías",
      subcategory: "Subcategoría",
      allSubcategories: "Todas las subcategorías",
      priceRange: "Rango de precio",
      minPrice: "Precio mínimo",
      maxPrice: "Precio máximo",
      sortBy: "Ordenar por",
      clearFilters: "Limpiar filtros",
      applyFilters: "Aplicar filtros",
      hideFilters: "Ocultar filtros",
      showFilters: "Mostrar filtros",
      
      // Opciones de ordenamiento
      sortOptions: {
        nameAsc: "Nombre (A-Z)",
        nameDesc: "Nombre (Z-A)",
        priceAsc: "Precio (menor a mayor)",
        priceDesc: "Precio (mayor a menor)",
        ratingDesc: "Mejor calificados",
        newest: "Más recientes",
        bestselling: "Más vendidos"
      },
      
      // Estados de carga y vacío
      loading: "Cargando productos...",
      searching: "Buscando...",
      noProducts: "No se encontraron productos",
      noProductsMessage: "No hay productos que coincidan con los filtros seleccionados.",
      tryDifferentFilters: "Intenta ajustar los filtros o buscar algo diferente.",
      loadMore: "Cargar más",
      error: "Error al cargar productos",
      retry: "Intentar de nuevo",
      
      // Búsqueda
      searchMinLength: "Escribe al menos 2 caracteres para buscar",
      searchResults: "{count} resultados encontrados",
      searchClear: "Limpiar búsqueda",
      
      // Notificaciones
      notifications: {
        filtersApplied: "Filtros aplicados correctamente",
        filtersCleared: "Filtros eliminados",
        searchCompleted: "Búsqueda completada",
        noResultsFound: "No se encontraron resultados",
        errorOccurred: "Ocurrió un error al cargar los productos"
      },
      
      // Filtros mobile
      mobileFilters: {
        title: "Filtros",
        apply: "Aplicar filtros",
        cancel: "Cancelar",
        reset: "Restablecer"
      },
      showingResults: "Mostrando {count} de {total} productos",
      
      // Beneficios
      benefits: {
        fastDelivery: {
          title: "Entrega Rápida",
          description: "Recibe tu pedido en 1h más o menos"
        },
        qualityGuarantee: {
          title: "Garantía de Calidad",
          description: "100% productos auténticos"
        },
        freeShipping: {
          title: "Envío Gratis",
          description: "En pedidos superiores a $200"
        },
        securePayment: {
          title: "Pago Seguro",
          description: "Transacciones protegidas"
        },
        customerSupport: {
          title: "Soporte 24/7",
          description: "Estamos aquí para ayudarte"
        }
      },
      
      // Mensajes de éxito y error
      messages: {
        addedToCart: "Producto agregado al carrito",
        addedToFavorites: "Agregado a favoritos",
        removedFromFavorites: "Eliminado de favoritos",
        errorAddingToCart: "Error al agregar al carrito",
        errorTogglingFavorite: "Error al gestionar favoritos",
        loginRequired: "Debes iniciar sesión para continuar"
      },
      
      // Subcategorías
      subcategories: {
        // Productos
        "1": "Harinas y Masas",
        "12": "Bebidas",
        "3": "Paquetes y Snacks", 
        "2": "Salsas y Aderezos",
        
        // Boutique
        "8": "Accesorios",
        "7": "Ropa",
        "9": "Souvenirs"
      }
    },

    // FoodCatalog
    foodCatalog: {
      title: "Comidas Tradicionales",
      subtitle: "Sabores auténticos de toda América Latina - Gastronomía tradicional en Montreal",
      whyChooseUs: "¿Por qué elegirnos?",
      whyChooseUsDesc: "La mejor experiencia culinaria de Montreal",
      restaurantsAvailable: "restaurantes disponibles",
      selectRestaurant: "Selecciona tu restaurante favorito",
      availableRestaurants: "Restaurantes Disponibles",
      exploreAllFlavors: "Explorar todos los sabores",
      noRestaurants: "No hay restaurantes disponibles",
      comingSoon: "Próximamente tendremos más restaurantes disponibles en tu área.",
      backToRestaurants: "Volver a restaurantes",
      restaurantMenu: "Menú de {name}",
      menuTitle: "Menú de",
      menuSubtitle: "Descubre los platos auténticos y tradicionales",
      authenticDishes: "Descubre los platos auténticos y tradicionales",
      openNow: "Abierto",
      closedNow: "Cerrado",
      popular: "Popular",
      viewMenu: "Ver menú",
      viewFullMenu: "Ver menú completo",
      contactUs: "¿No encuentras tu restaurante favorito? Contáctanos para agregar más opciones.",
      deliveryTime: "min",
      reviews: "reseñas",
      selectedRestaurant: "Restaurante seleccionado",
      searchPlaceholder: "Buscar restaurantes...",
      sortByRating: "Por rating",
      sortByName: "Por nombre", 
      sortByTime: "Por tiempo",
      filterAll: "Todos",
      filterNew: "Nuevos",
      filterTopRated: "Mejor valorados"
    },

    // RestaurantList
    restaurantList: {
      errorTitle: "Error al cargar restaurantes",
      errorDesc: "Ha ocurrido un error al cargar la lista de restaurantes. Por favor, inténtalo de nuevo.",
      noRestaurants: "No hay restaurantes disponibles",
      noRestaurantsDesc: "Próximamente tendremos más opciones de comida tradicional para ti.",
      viewMenu: "Ver menú",
      available: "Disponible",
      rating: "puntuación",
      openNow: "Abierto ahora",
      popular: "Popular",
      verified: "Verificado",
      cuisine: "Cocina",
      addToFavorites: "Agregar a favoritos",
      removeFromFavorites: "Quitar de favoritos",
      viewMenuFor: "Ver menú de",
      noDescription: "Descubre los sabores únicos de este restaurante"
    },

    restaurants: {
      status: {
        available: "Disponible",
        lastHour: "Última hora - hasta las {time}",
        closed: "Cerrado - abre a las {time}",
        openingHours: "Horario: {open} - {close}"
      }
    },
    
    // ProductDetail
    productDetail: {
      // Información del producto
      productInfo: "Información del producto",
      description: "Descripción",
      specifications: "Especificaciones",
      reviews: "Reseñas",
      shipping: "Envío",
      returns: "Devoluciones",
      
      // Acciones
      addToCart: "Agregar al carrito",
      buyNow: "Comprar ahora",
      addToFavorites: "Agregar a favoritos",
      removeFromFavorites: "Eliminar de favoritos",
      shareProduct: "Compartir producto",
      
      // Detalles
      price: "Precio",
      originalPrice: "Precio original",
      discount: "Descuento",
      stock: "Stock disponible",
      sku: "SKU",
      category: "Categoría",
      brand: "Marca",
      weight: "Peso",
      dimensions: "Dimensiones",
      
      // Estados
      inStock: "En stock",
      outOfStock: "Agotado",
      limitedStock: "Stock limitado",
      preOrder: "Pre-orden",
      
      // Cantidad
      quantity: "Cantidad",
      increase: "Aumentar cantidad",
      decrease: "Disminuir cantidad",
      maxQuantity: "Cantidad máxima disponible: {max}",
      unitsAvailable: "unidades disponibles",
      optionGroupsAvailable: "Este producto tiene {count} grupos de opciones disponibles",
      
      // Galería de imágenes
      mainImage: "Imagen principal",
      additionalImages: "Imágenes adicionales",
      zoomImage: "Ampliar imagen",
      previousImage: "Imagen anterior",
      nextImage: "Siguiente imagen",
      
      // Productos relacionados
      relatedProducts: "Productos relacionados",
      youMayAlsoLike: "También te puede gustar",
      similarProducts: "Productos similares",
      seeMore: "Ver más",
      loading: "Cargando...",
      
      // Beneficios específicos del producto
      authentic: "100% Auténtico",
      originalProduct: "Producto original",
      securePayment: "Pago seguro",
      fastShipping: "Envío rápido",
      qualityGuaranteed: "Calidad garantizada",
      
      // Reseñas
      customerReviews: "Reseñas de clientes",
      writeReview: "Escribir reseña",
      stars: "estrellas",
      helpful: "Útil",
      notHelpful: "No útil",
      verifiedPurchase: "Compra verificada",
      
      // Envío
      shippingInfo: "Información de envío",
      estimatedDelivery: "Entrega estimada",
      shippingCost: "Costo de envío",
      freeShippingOn: "Envío gratis en pedidos de",
      
      // Breadcrumbs
      home: "Inicio",
      backToCategory: "Volver a {category}",
      
      // Mensajes
      addedToCart: "Producto agregado al carrito exitosamente",
      errorAddingToCart: "Error al agregar el producto al carrito",
      addedToFavorites: "Producto agregado a favoritos",
      removedFromFavorites: "Producto eliminado de favoritos",
      errorTogglingFavorite: "Error al gestionar favoritos",
      loginToAddToCart: "Inicia sesión para agregar productos al carrito",
      loginToAddToFavorites: "Inicia sesión para agregar productos a favoritos",
      errorLoadingProduct: "Error al cargar el producto",
      productNotFound: "Producto no encontrado"
    },
    
    // RestaurantGrid
    restaurantGrid: {
      selectRestaurant: "Elige tu restaurante",
      title: "Restaurantes Auténticos",
      subtitle: "Descubre los mejores sabores de América Latina en Montreal. Cada restaurante ofrece recetas tradicionales y auténticas.",
      errorTitle: "Error al cargar restaurantes",
      noRestaurants: "No hay restaurantes disponibles",
      noRestaurantsDesc: "En este momento no hay restaurantes disponibles en esta categoría.",
      restaurantType: "Comida tradicional latinoamericana",
      viewMenu: "Ver menú",
      callToAction: "¿No encuentras lo que buscas? Explora todos nuestros restaurantes asociados.",
      exploreAll: "Explorar todos los restaurantes"
    }
  },

  // Sección de perfil de usuario
  profile: {
    general: {
      title: "Mi Perfil",
      subtitle: "Gestiona tu cuenta y preferencias",
      memberSince: "Miembro desde",
      editProfile: "Editar perfil",
      verified: "Verificado",
      pendingVerification: "Pendiente verificación",
      needsHelp: "¿Necesitas ayuda?",
      supportText: "Si tienes alguna pregunta o problema, nuestro equipo de soporte está aquí para ayudarte.",
      contactSupport: "Contactar soporte",
      manageAccount: "Gestionar cuenta",
      welcome: "¡Hola,",
      faq: "Preguntas frecuentes"
    },
    navigation: {
      profile: "Perfil",
      favorites: "Favoritos", 
      addresses: "Direcciones",
      orders: "Pedidos",
      security: "Seguridad",
      settings: "Ajustes"
    },
    stats: {
      favorites: "Productos favoritos",
      addresses: "Direcciones guardadas",
      orders: "Pedidos realizados"
    },
    sections: {
      favorites: {
        title: "Favoritos",
        description: "Productos que te gustan"
      },
      addresses: {
        title: "Direcciones",
        description: "Direcciones de entrega"
      },
      orders: {
        title: "Pedidos",
        description: "Historial de compras"
      },
      orderDetail: {
        title: "Detalle del Pedido",
        description: "Información completa del pedido"
      },
      security: {
        title: "Seguridad",
        description: "Contraseña y privacidad"
      },
      settings: {
        title: "Configuración",
        description: "Preferencias y notificaciones"
      }
    },
    security: {
      title: "Seguridad",
      subtitle: "Gestiona la seguridad de tu cuenta",
      account: {
        title: "Información de la cuenta",
        email: "Correo electrónico",
        verification: "Estado de verificación",
        verified: "Verificado",
        notVerified: "No verificado"
      },
      password: {
        title: "Cambiar contraseña",
        current: "Contraseña actual",
        new: "Nueva contraseña",
        confirm: "Confirmar nueva contraseña",
        currentPlaceholder: "Ingresa tu contraseña actual",
        newPlaceholder: "Ingresa una nueva contraseña",
        confirmPlaceholder: "Confirma tu nueva contraseña",
        update: "Actualizar contraseña",
        success: "Contraseña actualizada correctamente",
        errors: {
          passwordsNotMatch: "Las contraseñas nuevas no coinciden",
          minLength: "La nueva contraseña debe tener al menos 6 caracteres",
          generic: "Error al cambiar la contraseña"
        }
      },
      basicInfo: {
        title: "Información básica",
        subtitle: "Actualiza tu nombre y teléfono",
        name: "Nombre completo",
        namePlaceholder: "Ingresa tu nombre completo",
        phone: "Teléfono",
        phonePlaceholder: "Ingresa tu número de teléfono",
        update: "Actualizar información",
        success: "Información actualizada correctamente",
        errors: {
          nameRequired: "El nombre es requerido",
          nameMinLength: "El nombre debe tener al menos 2 caracteres",
          generic: "Error al actualizar la información"
        }
      },
      sessions: {
        title: "Sesiones activas",
        currentDevice: "Dispositivo actual",
        lastActivity: "Última actividad: Ahora",
        active: "Activa",
        closeAll: "Cerrar todas las sesiones",
        logoutAllNotAvailable: "Esta funcionalidad estará disponible próximamente"
      },
      delete: {
        title: "Zona peligrosa",
        warning: "Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.",
        showForm: "Eliminar mi cuenta",
        passwordConfirm: "Confirma tu contraseña",
        passwordPlaceholder: "Ingresa tu contraseña",
        confirmLabel: "Escribe 'ELIMINAR' para confirmar",
        confirmHelp: "Debes escribir exactamente 'ELIMINAR' en mayúsculas",
        confirm: "Eliminar cuenta",
        success: "Cuenta eliminada correctamente",
        errors: {
          confirmText: "Debes escribir 'ELIMINAR' para continuar",
          generic: "Error al eliminar la cuenta"
        }
      }
    },
    orderDetail: {
      title: "Detalle del Pedido",
      loading: "Cargando detalles del pedido...",
      notFound: "Pedido no encontrado",
      notFoundDesc: "El pedido solicitado no existe o no tienes acceso a él.",
      error: "Error al cargar el pedido",
      backToOrders: "Volver a Mis Pedidos",
      copyOrderNumber: "Copiar número de pedido",
      orderNumberCopied: "Número de pedido copiado al portapapeles",
      status: {
        title: "Estado del Envío",
        progress: "Progreso del envío"
      },
      tracking: {
        orderPlaced: "Pedido Realizado",
        paymentConfirmed: "Pago Confirmado", 
        processing: "Procesando",
        shipped: "Enviado",
        delivered: "Entregado"
      },
      actions: {
        downloadInvoice: "Descargar Factura",
        trackShipment: "Rastrear Envío",
        contactSupport: "Contactar Soporte",
        share: "Compartir",
        cancelOrder: "Cancelar Pedido",
        buyAgain: "Comprar de Nuevo",
        liveChat: "Chat en Vivo",
        sendEmail: "Enviar Email",
        rateOrder: "Calificar Pedido"
      },
      sections: {
        products: "Productos Pedidos",
        pricing: "Resumen de Precios",
        shipping: "Información de Envío",
        payment: "Información de Pago",
        notes: "Notas del Pedido",
        availableActions: "Acciones Disponibles"
      },
      pricing: {
        subtotal: "Subtotal",
        taxes: "Impuestos",
        tps: "TPS (5%)",
        tvq: "TVQ (9.975%)",
        totalTaxes: "Total Impuestos",
        shipping: "Envío",
        freeShipping: "Gratis",
        discount: "Descuento",
        finalTotal: "Total Final"
      },
      payment: {
        method: "Método",
        paymentDate: "Fecha de Pago",
        refundProcessed: "Reembolso Procesado",
        refundAmount: "Monto",
        refundDate: "Fecha"
      },
      help: {
        title: "¿Necesitas ayuda con tu pedido?",
        comingSoon: "Próximamente disponible",
        trackingComingSoon: "Sistema de rastreo próximamente disponible",
        invoiceComingSoon: "Descarga de factura próximamente disponible",
        cancelComingSoon: "Cancelación próximamente disponible",
        redirectingSupport: "Redirigiendo a soporte al cliente..."
      }
    },
    orders: {
      title: "Mis Pedidos",
      subtitle: "Historial completo de tus compras",
      loading: "Cargando pedidos...",
      stats: {
        totalOrders: "Total de Pedidos",
        totalSpent: "Total Gastado",
        averageOrderValue: "Promedio",
        recentOrdersCount: "Recientes"
      },
      filters: {
        search: "Buscar por número de pedido o producto...",
        filterByStatus: "Filtrar por estado",
        allStatuses: "Todos los estados",
        refresh: "Actualizar"
      },
      statuses: {
        pendiente: "Pendiente",
        pagado: "Pagado", 
        procesando: "Procesando",
        enviado: "Enviado",
        entregado: "Entregado",
        cancelado: "Cancelado"
      },
      empty: {
        title: "No hay pedidos aún",
        titleWithSearch: "No se encontraron pedidos",
        description: "Cuando realices tu primera compra, aparecerá aquí",
        descriptionWithSearch: "Intenta cambiar los términos de búsqueda",
        exploreProducts: "Explorar Productos"
      },
      orderCard: {
        products: "productos",
        shippingTo: "Envío a:",
        viewDetails: "Ver Detalles",
        trackShipment: "Rastrear Envío",
        download: "Descargar",
        moreProducts: "+{count} productos más"
      },
      pagination: {
        loadMore: "Cargar más pedidos",
        loading: "Cargando..."
      },
      quickLinks: {
        title: "Enlaces rápidos",
        keepShopping: "Seguir Comprando",
        myAddresses: "Mis Direcciones",
        support: "Soporte"
      },
      messages: {
        trackingNotAvailable: "Función de rastreo próximamente",
        downloadNotAvailable: "Descarga próximamente"
      }
    },
    checkoutSuccess: {
      title: "¡Pago Exitoso!",
      subtitle: "Tu pedido ha sido confirmado",
      orderNumber: "Pedido #{number}",
      confirmedOn: "Confirmado el",
      orderDetails: {
        totalPaid: "Total Pagado:",
        orderStatus: "Estado del Pedido:",
        confirmationEmail: "Email de Confirmación:",
        paymentStatus: "Estado del Pago:",
        currency: "Moneda:"
      },
      nextSteps: {
        title: "¿Qué sigue ahora?",
        emailConfirmation: {
          title: "Confirmación por Email",
          description: "Recibirás un email con los detalles de tu pedido"
        },
        orderPreparation: {
          title: "Preparación del Envío", 
          description: "Procesaremos tu pedido en aproximadamente 1 hora"
        },
        shippingDelivery: {
          title: "Envío y Entrega",
          description: "Te notificaremos cuando sea enviado"
        }
      },
      actions: {
        viewOrderDetails: "Ver Detalles del Pedido",
        viewAllOrders: "Ver Todos Mis Pedidos", 
        continueShopping: "Continuar Comprando"
      },
      support: {
        question: "¿Tienes preguntas sobre tu pedido?",
        contactInfo: "Contactar soporte:"
      }
    },
    settings: {
      title: "Configuración",
      subtitle: "Personaliza tu experiencia",
      preferences: {
        title: "Preferencias",
        description: "Configura tu experiencia personalizada"
      },
      appearance: {
        title: "Apariencia",
        darkMode: "Modo oscuro",
        darkModeDesc: "Cambiar entre tema claro y oscuro",
        theme: "Tema",
        themeDesc: "Selecciona tu tema preferido"
      },
      language: {
        title: "Idioma",
        description: "Selecciona tu idioma preferido",
        options: {
          es: "Español",
          en: "English",
          fr: "Français"
        }
      },
      notifications: {
        title: "Notificaciones",
        description: "Gestiona tus preferencias de notificación",
        email: "Notificaciones por email",
        emailDescription: "Recibir notificaciones importantes por correo",
        orders: "Actualizaciones de pedidos",
        ordersDescription: "Recibir actualizaciones sobre el estado de tus pedidos",
        promotions: "Ofertas y promociones",
        promotionsDescription: "Recibir ofertas especiales y promociones",
        newsletter: "Boletín informativo",
        manage: "Administrar notificaciones"
      },
      security: {
        title: "Seguridad",
        description: "Protege tu cuenta",
        changePassword: "Cambiar contraseña",
        securitySettings: "Configuración de seguridad",
        twoFactor: "Autenticación de dos factores"
      },
      payment: {
        title: "Pagos",
        description: "Gestiona tus métodos de pago",
        methods: "Métodos de pago",
        addMethod: "Agregar método de pago",
        defaultMethod: "Método predeterminado"
      },
      privacy: {
        title: "Privacidad",
        description: "Controla tu información personal",
        security: "Configuración de seguridad",
        downloadData: "Descargar mis datos",
        deleteData: "Eliminar mi cuenta",
        cookiePreferences: "Preferencias de cookies"
      },
      general: {
        title: "Preferencias generales",
        language: "Idioma",
        darkMode: "Modo oscuro"
      },
      account: {
        title: "Cuenta",
        deleteAccount: "Eliminar cuenta",
        deleteAccountDesc: "Eliminar permanentemente tu cuenta",
        exportData: "Exportar datos",
        exportDataDesc: "Descargar una copia de tus datos"
      }
    }
  },

  // Carrito de compras
  cart: {
    title: "Carrito de Compras",
    subtitle: "Productos seleccionados",
    product: "producto",
    products: "productos",
    estimatedTotal: "Total estimado",
    shipping: "envío",
    freeShipping: "Envío gratis",
    loading: "Cargando carrito...",
    noCategory: "Sin categoría",
    perUnit: "por unidad",
    stock: "Stock",
    empty: {
      title: "Tu carrito está vacío",
      description: "¡Agrega algunos productos para comenzar tu compra!",
      exploreProducts: "Explorar productos"
    },
    categories: {
      productos: "Productos",
      comidas: "Comidas", 
      boutique: "Boutique"
    },
    summary: {
      title: "Resumen del Pedido",
      subtotal: "Subtotal",
      shipping: "Envío",
      taxes: "TPS + TVQ (5% + 9.975%)",
      consigne: "Consigna",
      total: "Total",
      freeShipping: "Gratis",
      shippingThreshold: "Agrega {amount} más para envío gratis",
      proceed: "Proceder al Pago",
      continue: "Continuar Comprando",
      authRequired: "Inicia sesión para continuar",
      addressRequired: "Selecciona una dirección",
      addressRequiredForShipping: "Agrega una dirección para calcular el envío",
      coupon: {
        question: "¿Tienes un código de descuento?",
        placeholder: "Ingresa tu código aquí",
        apply: "Aplicar",
        applied: "Cupón aplicado",
        remove: "Remover",
        discount: "Descuento",
        error: "Código inválido",
        expired: "Código expirado",
        usageLimitReached: "Ya has usado este cupón el máximo número de veces permitido",
        success: "¡Cupón aplicado correctamente!",
        removedSuccess: "Cupón removido",
        removeError: "Error al remover cupón",
        rateLimitError: "Demasiados intentos. Espera 10 minutos e intenta nuevamente.",
        freeShippingDescription: "Envío gratis aplicado (¡Sin costo de domicilio!)",
        discountDescription: "{percent}% de descuento sobre el total",
        filteredContent: "⚠ Contenido filtrado"
      }
    },
    delivery: {
      title: "Opciones de Entrega",
      subtitle: "Configura los detalles de tu entrega",
      addressNote: "Puedes configurar tus opciones de entrega ahora. Se requerirá una dirección para proceder al checkout.",
      timeLabel: "Hora de entrega preferida",
      timePlaceholder: "Selecciona una hora",
      timeHelper: "Entregas disponibles de 11:00 AM a 9:00 PM",
      methodLabel: "Método de entrega",
      methodHelper: "¿Cómo prefieres recibir tu pedido?",
      notesLabel: "Notas para el repartidor",
      notesPlaceholder: "Ej: Tocar el timbre, apartamento 3B, llamar al llegar...",
      notesHelper: "Instrucciones especiales para la entrega (opcional)",
      typeLabel: "Tipo de Entrega",
      today: {
        title: "Entrega Hoy",
        description: "11:00 AM - 9:00 PM (mismo día con 1 hora mínima)"
      },
      tomorrow: {
        title: "Entrega Mañana", 
        description: "11:00 AM - 9:00 PM (día siguiente)"
      },
      todaySelected: "Entrega hoy seleccionada - Pedidos hasta 8:00 PM",
      tomorrowAutoSelected: "Después de las 9:00 PM - Entrega mañana seleccionada automáticamente",
      autoNextDay: "Entrega automática para mañana (después de las 8:00 PM)",
      noHoursToday: "No hay horarios disponibles hoy",
      suggestTomorrow: "¿Programar para mañana?",
      alternativeHoursLabel: "Horarios disponibles:",
      contentFiltered: "Contenido filtrado",
      methods: {
        puerta: {
          title: "Dejar en puerta",
          description: "El pedido se dejará en la puerta"
        },
        manos: {
          title: "Entregar en mano",
          description: "Entrega directa al cliente"
        },
        recepcion: {
          title: "Dejar en recepción",
          description: "El pedido se dejará en recepción/portería"
        }
      },
      validation: {
        timeRequired: "Debes seleccionar una hora de entrega",
        methodRequired: "Debes seleccionar un método de entrega",
        timeInvalid: "La hora debe estar entre 11:00 AM y 9:00 PM",
        timeTooEarly: "La hora de entrega debe ser al menos 1 hora después de ahora. Hora mínima disponible: {time}",
        notesTooLong: "Las notas no pueden exceder 500 caracteres",
        notesUnsafe: "Las notas contienen contenido no permitido por razones de seguridad",
        notesEmpty: "Las notas no pueden estar vacías o contener solo espacios"
      },
      success: "Opciones de entrega actualizadas",
      schedule: "Entregas disponibles de 11:00 AM a 9:00 PM todos los días",
      alternativeHours: {
        title: "Horarios disponibles:",
        suggestTomorrow: "No hay horarios disponibles hoy. ¿Programar para mañana?",
        acceptTomorrow: "Programar para mañana"
      },
      error: "Error al actualizar opciones de entrega"
    },
    success: {
      quantityUpdated: "Cantidad actualizada",
      productRemoved: "Producto eliminado",
      cartCleared: "Carrito vaciado"
    },
    errors: {
      updateQuantity: "Error al actualizar cantidad",
      removeProduct: "Error al eliminar producto",
      clearCart: "Error al vaciar carrito",
      selectAddress: "Debes seleccionar una dirección",
      addAddressRequired: "Agrega una dirección para calcular el envío",
      emptyCart: "Tu carrito está vacío",
      deliveryTimeRequired: "Debes seleccionar una hora de entrega",
      deliveryMethodRequired: "Debes seleccionar un método de entrega",
      sessionExpired: "Sesión expirada. Por favor inicia sesión nuevamente",
      couponError: "Error con el cupón aplicado. Por favor, aplica el cupón nuevamente."
    },
    nonTaxable: "Sin impuestos",
    variationDetails: {
      hideDetails: "Ocultar detalles",
      showDetails: "Ver detalles de precio",
      customized: "Personalizado",
      discounts: "Descuentos"
    },
    checkout: {
      redirectingToStripe: "Redirigiendo a Stripe...",
      emptyCart: "Carrito vacío",
      savingsShipping: "Ahorro en envío"
    },
    notifications: {
      networkError: "Sin conexión a internet. Verifica tu conexión.",
      loadError: "Error al cargar el carrito",
      authRequired: "Debes iniciar sesión para usar esta función",
      addToCartAuthRequired: "Debes iniciar sesión para agregar productos al carrito",
      clearCartAuthRequired: "Debes iniciar sesión para limpiar el carrito",
      applyCouponAuthRequired: "Debes iniciar sesión para aplicar cupones",
      removeCouponAuthRequired: "Debes iniciar sesión para remover cupones",
      updateDeliveryAuthRequired: "Debes iniciar sesión para configurar opciones de entrega",
      productNotFound: "Producto no encontrado",
      addToCartError: "Error al agregar producto al carrito",
      addToCartAuthError: "Debes iniciar sesión para agregar productos",
      clearCartError: "Error al limpiar carrito",
      couponUsageLimit: "Ya has usado este cupón el máximo número de veces permitido.",
      couponInvalid: "Código de cupón inválido",
      couponExpired: "El cupón ha expirado",
      couponRateLimit: "Demasiados intentos. Espera 10 minutos e intenta nuevamente.",
      couponApplyError: "Error al aplicar el cupón. Intenta nuevamente.",
      deliveryTimeError: "La hora de entrega debe estar entre 11:00 AM y 8:00 PM",
      deliveryMethodError: "Método de entrega inválido",
      deliveryUpdateError: "Error al actualizar opciones de entrega",
      deliveryUpdateSuccess: "Opciones de entrega actualizadas",
      couponRemovedSuccess: "Cupón removido exitosamente",
      noCouponApplied: "No hay cupón aplicado",
      couponRemoveError: "Error al remover el cupón. Intenta nuevamente."
    },
    auth: {
      title: "Inicia sesión para continuar",
      description: "Para proceder con tu compra, necesitas iniciar sesión o crear una cuenta",
      login: "Iniciar sesión",
      register: "Crear cuenta"
    }
  },

  // Pedidos
  orders: {
    title: "Mis Pedidos",
    description: "Historial de compras",
    loading: "Cargando pedidos...",
    totalOrders: "Total de Pedidos",
    searchPlaceholder: "Buscar por número de pedido o producto...",
    filterByStatus: "Filtrar por estado",
    allStatuses: "Todos los estados",
    statuses: {
      pendiente: "Pendiente",
      pagado: "Pagado",
      procesando: "Procesando",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado",
      reembolsado: "Reembolsado"
    },
    actions: {
      refresh: "Actualizar",
      retry: "Reintentar",
      viewDetails: "Ver Detalles",
      trackShipping: "Rastrear Envío",
      loadMore: "Cargar más pedidos",
      exploreProducts: "Explorar Productos",
      continueShopping: "Seguir Comprando"
    },
    empty: {
      noResults: "No se encontraron pedidos",
      noOrders: "No hay pedidos aún",
      noResultsDescription: "Intenta cambiar los términos de búsqueda",
      noOrdersDescription: "Cuando realices tu primera compra, aparecerá aquí"
    },
    productQuantity: "Cantidad",
    products: "productos",
    moreProducts: "productos más",
    loadingText: "Cargando...",
    quickLinks: {
      title: "Enlaces rápidos",
      myAddresses: "Mis Direcciones",
      support: "Soporte"
    },
    detail: {
      invalidId: "ID de pedido inválido",
      downloadInvoice: "Función de descarga próximamente",
      cancelOrder: "Función de cancelación próximamente",
      trackOrder: "Función de rastreo próximamente"
    }
  },

  // Envío
  shipping: {
    estimated: "Envío estimado"
  },

  // Notificaciones generales (para evitar duplicados)
  notifications: {
    // Errores comunes
    loadError: "Error al cargar",
    saveError: "Error al guardar", 
    deleteError: "Error al eliminar",
    updateError: "Error al actualizar",
    networkError: "Error de conexión",
    unexpectedError: "Error inesperado",
    
    // Éxitos comunes
    saveSuccess: "Guardado correctamente",
    deleteSuccess: "Eliminado correctamente", 
    updateSuccess: "Actualizado correctamente",
    
    // Autenticación
    authRequired: "Debes iniciar sesión para usar esta función",
    accountVerificationRequired: "Debes verificar tu cuenta para realizar esta acción",
    
    // Estados
    loading: "Cargando...",
    processing: "Procesando...",
    
    // Acciones comunes
    actionError: "Error al realizar la acción",
    actionSuccess: "Acción completada correctamente",
    
    // Validación
    selectAllOptions: "Por favor selecciona todas las opciones requeridas",
    selectRating: "Por favor selecciona una calificación",
    
    // Específicas del sistema
    commentDeletedSuccess: "Comentario eliminado exitosamente",
    reviewSubmitSuccess: "Reseña enviada exitosamente",
    reviewSubmitError: "Error al enviar la reseña",
    emailVerifiedSuccess: "Email verificado correctamente. ¡Bienvenido!",
    codeResentSuccess: "Código reenviado correctamente",
    codeResentError: "Error al reenviar código",
    passwordUpdatedSuccess: "Contraseña actualizada correctamente",
    passwordResetError: "Error al restablecer la contraseña",
    userDataLoadError: "Error al cargar los datos del usuario",
    paymentCanceled: "Pago cancelado - Tu carrito sigue guardado",
    perfectContinue: "¡Perfecto! Ahora puedes continuar",
    optionSelectionError: "Error con las opciones seleccionadas",
    addedToCartWith: "agregado al carrito con",
    
    // Mensajes de éxito y error específicos
    success: {
      reviewDeleted: "Comentario eliminado exitosamente"
    },
    error: {
      reviewDeleteError: "Error al eliminar el comentario"
    }
  },

  // Favoritos
  favorites: {
    title: "Mis Favoritos",
    subtitle: "Productos que te gustan",
    headerTitle: "Tus favoritos",
    headerSubtitle: "Aún no tienes favoritos",
    headerSubtitleWithCount: "Productos que te encantan",
    loading: {
      title: "Cargando favoritos...",
      description: "Estamos preparando tus productos favoritos"
    },
    empty: {
      title: "Sin favoritos aún",
      description: "Descubre nuestros increíbles productos y añade algunos a tus favoritos",
      button: "Explorar productos"
    },
    items: {
      addToCart: "Agregar",
      remove: "Quitar de favoritos",
      view: "Ver",
      outOfStock: "Agotado",
      price: "Precio",
      stock: "Solo",
      noCategory: "Sin categoría",
      addedDate: "Agregado el",
      categories: {
        productos: "Productos",
        comidas: "Comidas",
        boutique: "Boutique"
      }
    },
    stats: {
      favorites: "Favoritos",
      categories: "Categorías", 
      available: "Disponibles",
      product: "producto",
      products: "productos"
    },
    buttons: {
      back: "Volver",
      explore: "Explorar"
    },
    messages: {
      added: "Producto agregado a favoritos",
      removed: "Producto removido de favoritos",
      addedToCart: "Producto agregado al carrito",
      errorAdd: "Error al agregar a favoritos",
      errorRemove: "Error al remover de favoritos",
      errorManage: "Error al gestionar favoritos",
      loadError: "Error al cargar favoritos",
      outOfStock: "Producto agotado",
      authRequired: "Debes iniciar sesión para ver favoritos"
    },
    auth: {
      title: "¡Inicia sesión!",
      description: "Para ver y gestionar tus productos favoritos necesitas iniciar sesión",
      login: "Iniciar sesión",
      register: "Crear cuenta"
    }
  },

  // Direcciones
  addresses: {
    title: "Mis Direcciones",
    subtitle: "Gestiona tus direcciones de entrega",
    addNew: "Nueva dirección",
    editAddress: "Editar dirección",
    deleteAddress: "Eliminar dirección",
    confirmDelete: "¿Estás seguro de que quieres eliminar esta dirección?",
    noAddresses: "No tienes direcciones guardadas",
    noAddressesDesc: "Agrega tu primera dirección para facilitar tus compras futuras",
    addFirstAddress: "Agregar primera dirección",
    
    // Selector de direcciones
    selector: {
      title: "Dirección de Envío",
      add: "Agregar",
      deliveryInfo: "Solo entregas en el área metropolitana de Montreal",
      deliveryNote: "Validamos que la dirección esté dentro del área metropolitana de Montreal",
      montrealOnly: "Solo direcciones en el área metropolitana de Montreal",
      validationNote: "Validamos que la ciudad sea Montreal y que el código postal sea válido (H1A-H5B)"
    },
    
    // Formulario
    form: {
      street: "Dirección *",
      streetPlaceholder: "Ej: 1234 Rue Sainte-Catherine",
      city: "Ciudad",
      cityPlaceholder: "Montreal",
      state: "Provincia",
      statePlaceholder: "Quebec",
      zipCode: "Código postal",
      zipCodePlaceholder: "H3X 3X3",
      country: "País",
      countryPlaceholder: "Canadá",
      save: "Guardar dirección",
      saving: "Guardando...",
      cancel: "Cancelar"
    },
    
    // Validación
    validation: {
      invalid: "Dirección no válida",
      required: "Este campo es requerido",
      streetRequired: "La dirección es requerida",
      countryRequired: "El país es requerido",
      montrealOnly: "Solo se permiten direcciones en el área metropolitana de Montreal y Rivera Sur",
      validationInfo: "Validamos que la dirección esté dentro del área metropolitana de Montreal y Rivera Sur"
    },
    
    // Mensajes de éxito
    success: {
      created: "Dirección agregada correctamente",
      createdDesc: "La dirección se ha creado correctamente",
      firstAddressCreated: "✅ Primera dirección configurada - ¡Ya puedes proceder al pago!",
      updated: "Dirección actualizada correctamente", 
      updatedDesc: "La dirección se ha actualizada correctamente",
      deleted: "Dirección eliminada correctamente",
      deletedDesc: "La dirección se ha eliminado correctamente",
      primarySet: "Dirección principal actualizada correctamente",
      primarySetDesc: "La dirección se ha marcado como principal"
    },
    
    // Mensajes de error
    errors: {
      loadFailed: "Error al cargar direcciones",
      loadFailedDesc: "No pudimos cargar tus direcciones",
      saveFailed: "Error al guardar",
      saveFailedDesc: "No pudimos guardar la dirección",
      deleteFailed: "Error al eliminar",
      deleteFailedDesc: "No pudimos eliminar la dirección",
      primaryFailed: "Error al establecer dirección principal",
      primaryFailedDesc: "No pudimos establecer la dirección como principal",
      selectFailed: "Error al seleccionar dirección"
    },
    
    // Estadísticas
    stats: {
      total: "Total de direcciones",
      main: "Dirección principal",
      delivery: "Direcciones de entrega"
    },

    // Acciones
    actions: {
      edit: "Editar",
      delete: "Eliminar", 
      addressTitle: "Dirección",
      setPrimary: "Establecer como principal",
      primary: "Principal"
    },

    // Ciudades
    cities: {
      montreal: "Montreal"
    }
  },

  // Verificación de email (modal)
  verification: {
    title: "Verificar Email",
    subtitle: "Verifica tu cuenta para continuar",
    description: "Ingresa el código de 6 dígitos enviado a tu email",
    form: {
      codeLabel: "Código de verificación",
      codePlaceholder: "123456",
      verifyButton: "Verificar",
      verifying: "Verificando...",
      resendButton: "¿No recibiste el código? Reenviar",
      resending: "Reenviando...",
      cancel: "Cancelar"
    },
    messages: {
      success: "¡Email verificado correctamente!",
      successDescription: "Tu cuenta ha sido verificada correctamente",
      error: "Código de verificación inválido",
      resent: "Código enviado",
      resentDescription: "Revisa tu correo electrónico para el nuevo código de verificación",
      resendError: "Error al enviar código",
      resendErrorDescription: "No pudimos enviar el código de verificación",
      expired: "El código ha expirado. Solicita uno nuevo",
      required: "Ingresa el código de 6 dígitos",
      invalidLength: "El código debe tener 6 dígitos"
    },
    status: {
      verified: "Email verificado",
      verifiedDescription: "Tu cuenta está completamente verificada",
      pending: "Verificación pendiente",
      pendingDescription: "Para acceder a todas las funciones, verifica tu correo electrónico",
      alreadyHaveCode: "Ya tengo el código",
      resendCode: "Reenviar código",
      sending: "Enviando..."
    },
    modal: {
      title: "Verificar email",
      instruction: "Ingresa el código de 6 dígitos enviado a:"
    }
  },

  // SEO y metadatos
  seo: {
    products: {
      title: "Productos Latinoamericanos Auténticos | Tout à un Clic LA",
      description: "Descubre la mejor selección de productos latinoamericanos en Montreal. Harinas, masas, salsas, aderezos y más. Envío gratis en pedidos +$200. ¡Ordena ahora!",
      keywords: "productos latinoamericanos Montreal, harinas tradicionales, salsas auténticas, aderezos latinos, productos América Latina Canadá"
    },
    comidas: {
      title: "Comida Tradicional Latinoamericana | Delivery Montreal | Tout à un Clic LA",
      description: "Comida auténtica de América Latina en Montreal. Sabores de México, Colombia, Perú, Argentina y más. Delivery rápido. ¡Ordena tu comida latina favorita!",
      keywords: "comida latina Montreal, delivery comida latinoamericana, restaurante latino Montreal, comida mexicana, comida colombiana, comida peruana Quebec"
    },
    boutique: {
      title: "Boutique Artesanal Latinoamericana | Souvenirs y Regalos | Montreal",
      description: "Boutique exclusiva con artesanías, ropa tradicional y souvenirs de América Latina en Montreal. Productos únicos y auténticos. ¡Encuentra el regalo perfecto!",
      keywords: "boutique latina Montreal, artesanías latinoamericanas, souvenirs América Latina, ropa tradicional, regalos únicos, tienda latina Quebec"
    }
  },

  // Términos y Condiciones
  terms: {
    title: "Términos de Servicio",
    lastUpdated: "Última actualización:",
    sections: {
      introduction: {
        title: "1. Introducción",
        paragraph1: "Bienvenido a Tout à un clic là. El presente documento constituye un acuerdo legalmente vinculante (\"Acuerdo\") entre usted y Tout à un clic là, regido por las leyes de Canadá. Estos Términos de Servicio regulan su acceso y uso de nuestra plataforma de comercio electrónico (\"la Plataforma\"), incluyendo cualquier aplicación móvil asociada, contenido, funcionalidades y servicios ofrecidos.",
        paragraph2: "Al acceder o utilizar nuestra Plataforma, usted confirma que ha leído, entendido y acepta estar sujeto a estos términos. Si no está de acuerdo con alguna parte de este Acuerdo, le rogamos que se abstenga de utilizar nuestros servicios."
      },
      eligibility: {
        title: "2. Elegibilidad y Cuentas de Usuario",
        paragraph1: "Para utilizar nuestros servicios, usted debe tener al menos 18 años de edad o la mayoría de edad legal en su jurisdicción, lo que sea mayor. Al crear una cuenta, usted garantiza que toda la información proporcionada es veraz, precisa, completa y actualizada.",
        paragraph2: "Es su responsabilidad mantener la confidencialidad de su cuenta y contraseña, así como restringir el acceso a su dispositivo. Usted acepta la plena responsabilidad por todas las actividades que ocurran bajo su cuenta. Si sospecha de un uso no autorizado de su cuenta, debe notificárnoslo inmediatamente.",
        paragraph3: "Tout à un clic là se reserva el derecho de suspender o terminar su cuenta, a nuestra discreción y sin previo aviso, si determinamos que ha violado cualquier disposición de estos Términos de Servicio o si su conducta podría causar daño a nuestra Plataforma, otros usuarios o terceros."
      },
      products: {
        title: "3. Productos y Servicios",
        paragraph1: "Los productos y servicios ofrecidos en nuestra Plataforma están sujetos a disponibilidad. Nos esforzamos por proporcionar descripciones precisas, incluyendo especificaciones, características, y representaciones visuales de nuestros productos. Sin embargo, no garantizamos que dichas descripciones o representaciones sean exactas, completas, confiables, actualizadas o libres de errores.",
        paragraph2: "Los colores mostrados en su dispositivo pueden variar de los productos reales debido a diferentes tecnologías de visualización, configuraciones y limitaciones técnicas.",
        paragraph3: "Tout à un clic là se reserva el derecho, a su absoluta discreción, de limitar las cantidades de cualquier producto o servicio, restringir las ventas a cualquier persona o región geográfica, y suspender o discontinuar cualquier producto o servicio sin previo aviso."
      },
      pricing: {
        title: "4. Precios, Impuestos y Pagos",
        paragraph1: "Todos los precios están denominados en dólares canadienses (CAD) a menos que se indique lo contrario, y no incluyen impuestos aplicables, tarifas de envío u otros cargos, que serán informados durante el proceso de compra antes de la confirmación del pedido.",
        paragraph2: "De acuerdo con la legislación fiscal canadiense, podemos estar obligados a cobrar y remitir impuestos provinciales y federales, incluyendo el Impuesto sobre Bienes y Servicios (GST), el Impuesto de Venta Armonizado (HST) o el Impuesto de Venta Provincial (PST), según corresponda a su ubicación.",
        paragraph3: "Nos reservamos el derecho de modificar los precios en cualquier momento sin previo aviso. Su pedido está sujeto al precio vigente en el momento en que completamos su transacción.",
        paragraph4: "Aceptamos diversos métodos de pago según se especifica en nuestra Plataforma. Al proporcionar información de pago, usted garantiza que está autorizado a utilizar el método de pago seleccionado y que dicha información es precisa y completa."
      },
      shipping: {
        title: "5. Envíos y Entregas",
        paragraph1: "Realizamos envíos a direcciones dentro del área metropolitana de Montreal y algunas zonas seleccionadas de Quebec. Los tiempos de entrega son estimados basados en la información proporcionada por nuestros socios logísticos y pueden variar según su ubicación, condiciones climáticas, volumen de pedidos, y otros factores externos.",
        paragraph2: "Todos los precios mostrados incluyen los impuestos aplicables según la legislación fiscal de Quebec. Los costos de envío se calculan automáticamente durante el proceso de compra según la distancia y el peso del pedido.",
        paragraph3: "El riesgo de pérdida y título de propiedad de los productos pasa a usted en el momento de la entrega. Es su responsabilidad inspeccionar los productos a la recepción y notificar cualquier daño o discrepancia dentro de las 48 horas siguientes a la entrega."
      },
      delivery: {
        title: "5.1. Política de Entrega a Domicilio",
        paragraph1: "Para entregas a domicilio dentro del área metropolitana de Montreal, aplicamos el siguiente protocolo de entrega:",
        paragraph2: "Cuando el cliente selecciona la opción 'Entrega en mano' durante el proceso de compra, nuestro repartidor seguirá este procedimiento:",
        list1: [
          "El repartidor tocará el timbre o llamará a la puerta de la dirección indicada por el cliente.",
          "Si no hay respuesta inmediata, el repartidor llamará al número de teléfono proporcionado por el cliente durante el registro.",
          "Si después de 5 minutos no se obtiene respuesta por ninguno de los medios anteriores, el repartidor procederá automáticamente a:",
          "• Dejar el pedido de manera segura en la puerta, si se trata de una residencia privada unifamiliar, o",
          "• Entregar el pedido en la recepción, portería o servicio de conserjería, si se trata de un edificio con este servicio disponible."
        ],
        paragraph3: "Al seleccionar la opción de entrega a domicilio y confirmar su pedido, el cliente acepta expresamente esta política de entrega y exime a Tout à un clic là de cualquier responsabilidad por pérdida, robo o daño del producto una vez que se haya aplicado este protocolo de entrega.",
        paragraph4: "Para garantizar la recepción directa de su pedido, recomendamos encarecidamente: proporcionar un número de teléfono actualizado y funcional, estar disponible durante la ventana de entrega especificada, y considerar seleccionar una dirección donde haya alguien disponible para recibir el pedido."
      },
      returns: {
        title: "6. Política de Devoluciones y Reembolsos",
        paragraph1: "De conformidad con la Ley de Protección al Consumidor de Canadá y las leyes provinciales aplicables, ofrecemos una política de devolución que permite devolver la mayoría de los productos dentro de los 7 días siguientes a la recepción, siempre que se cumplan las siguientes condiciones:",
        list1: [
          "El producto debe estar en su estado original, sin usar y con todas las etiquetas y embalajes originales.",
          "Debe incluirse el comprobante de compra o confirmación de pedido.",
          "Los artículos personalizados, perecederos, de higiene personal o marcados como ventas finales no son elegibles para devolución, salvo en caso de defectos comprobables.",
          "Las devoluciones deben ser enviadas directamente a nuestras oficinas ubicadas en 620 Rue Saint-Thomas, Longueuil, QC J4H 3A7.",
          "Las entregas de devoluciones deben realizarse dentro del horario de oficina: lunes a viernes de 9:00 AM a 5:00 PM.",
          "Los costos de envío de la devolución corren por cuenta del consumidor, excepto en casos de productos defectuosos o errores de envío atribuibles a nuestra responsabilidad."
        ],
        paragraph2: "Los reembolsos se procesarán utilizando el mismo método de pago utilizado para la compra original dentro de los 14 días hábiles siguientes a la recepción y verificación de los artículos devueltos en nuestras oficinas. Los gastos de envío originales no son reembolsables, excepto en casos de productos defectuosos o errores de envío atribuibles a nuestra responsabilidad."
      },
      intellectualProperty: {
        title: "7. Propiedad Intelectual",
        paragraph1: "La Plataforma y todo su contenido, características y funcionalidades, incluyendo pero no limitado a texto, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales, compilaciones de datos y software, son propiedad exclusiva de Tout à un clic là, sus licenciantes u otros proveedores de contenido, y están protegidos por las leyes canadienses e internacionales de derechos de autor, marcas registradas, patentes, secretos comerciales y otros derechos de propiedad intelectual.",
        paragraph2: "Queda estrictamente prohibido el uso no autorizado de cualquier contenido o material en nuestra Plataforma. No se concede licencia implícita o expresa para utilizar cualquier propiedad intelectual sin nuestro consentimiento previo por escrito."
      },
      liability: {
        title: "8. Limitación de Responsabilidad",
        paragraph1: "En la máxima medida permitida por la ley aplicable, Tout à un clic là, sus directores, empleados, agentes y afiliados no serán responsables por:",
        list1: [
          "Daños indirectos, incidentales, especiales, punitivos o consecuentes, incluyendo pérdida de ganancias, datos, uso o cualquier otra pérdida intangible, resultantes de (i) su acceso o uso o incapacidad para acceder o usar nuestra Plataforma; (ii) cualquier conducta o contenido de terceros en la Plataforma; o (iii) acceso no autorizado, uso o alteración de sus transmisiones o contenido.",
          "Interrupciones, errores, omisiones, o retrasos en la operación de la Plataforma o la entrega de productos o servicios.",
          "Virus, troyanos u otro software malicioso que pueda transmitirse a o a través de nuestra Plataforma."
        ],
        paragraph2: "Nuestra responsabilidad total por cualquier reclamación bajo estos Términos no excederá el monto pagado por usted a Tout à un clic là durante los seis (6) meses anteriores a la acción que da lugar a dicha responsabilidad.",
        paragraph3: "Las limitaciones anteriores se aplicarán independientemente de si se ha advertido a Tout à un clic là sobre la posibilidad de tales daños e independientemente de si cualquier recurso establecido en este documento falla en su propósito esencial."
      },
      governing: {
        title: "9. Ley Aplicable y Resolución de Disputas",
        paragraph1: "Estos Términos de Servicio se regirán e interpretarán de acuerdo con las leyes de la provincia de Quebec y las leyes federales de Canadá aplicables en ella, sin tener en cuenta sus principios de conflicto de leyes.",
        paragraph2: "Cualquier disputa, controversia o reclamación que surja de o en relación con estos Términos, o su incumplimiento, terminación o invalidez, se resolverá mediante negociación de buena fe. Si la disputa no puede resolverse mediante negociación, ambas partes acuerdan someter la disputa a mediación de acuerdo con las reglas de mediación del Instituto de Mediación y Arbitraje de Canadá.",
        paragraph3: "Si la mediación no resuelve la disputa, esta será sometida a arbitraje vinculante ante un solo árbitro de conformidad con la Ley de Arbitraje Comercial de Canadá. El lugar del arbitraje será Montreal, Quebec, Canadá, y el idioma del arbitraje será el inglés o el francés, según lo acordado por las partes."
      },
      changes: {
        title: "10. Cambios a los Términos",
        paragraph1: "Nos reservamos el derecho, a nuestra exclusiva discreción, de modificar o reemplazar estos Términos en cualquier momento. La versión actualizada será efectiva tan pronto como se publique en nuestra Plataforma. Es su responsabilidad revisar periódicamente estos Términos para estar informado de cualquier cambio.",
        paragraph2: "El uso continuado de nuestra Plataforma después de la publicación de cualquier modificación constituye la aceptación de dichas modificaciones. Si no está de acuerdo con los nuevos términos, debe dejar de utilizar nuestra Plataforma.",
        paragraph3: "Para cambios sustanciales, haremos esfuerzos razonables para notificarle, ya sea a través de un aviso prominente en nuestra Plataforma, por correo electrónico a la dirección asociada con su cuenta, o por otros medios."
      },
      contact: {
        title: "11. Contacto",
        paragraph1: "Si tiene preguntas sobre estos Términos de Servicio o necesita asistencia con nuestros productos o servicios, puede contactarnos a través de:",
        email: "serviceclient@toutaunclicla.com",
        paragraph2: "Nuestro equipo de atención al cliente está disponible para asistirle de lunes a viernes, de 9:00 a.m. a 5:00 p.m. (hora del Este)."
      }
    }
  },

  // Política de Privacidad
  privacy: {
    title: "Política de Privacidad",
    lastUpdated: "Última actualización:",
    sections: {
      introduction: {
        title: "1. Introducción",
        paragraph1: "En Tout à un clic là, respetamos su privacidad y nos comprometemos a proteger sus datos personales de conformidad con la Ley de Protección de Información Personal y Documentos Electrónicos (PIPEDA) de Canadá. Esta política de privacidad detalla cómo recopilamos, utilizamos, protegemos y divulgamos la información personal que nos proporciona al utilizar nuestra plataforma de comercio electrónico, así como sus derechos de privacidad según la legislación canadiense."
      },
      dataCollection: {
        title: "2. Datos que Recopilamos",
        paragraph1: "De acuerdo con los principios de privacidad establecidos por la PIPEDA, recopilamos únicamente la información personal necesaria para los fines identificados y con su consentimiento. Esta información puede incluir:",
        list1: [
          "Datos de identidad: nombre completo, nombre de usuario o identificadores similares.",
          "Datos de contacto: dirección postal, dirección de facturación, dirección de entrega, correo electrónico y números de teléfono.",
          "Datos financieros: información de tarjetas de pago (procesada de forma segura a través de proveedores de pago autorizados y cumpliendo con los estándares PCI DSS).",
          "Datos de transacción: registros de compras, productos adquiridos, frecuencia de compras y métodos de pago utilizados.",
          "Datos técnicos: dirección IP, datos de inicio de sesión, tipo y versión del navegador, configuración de zona horaria, ubicación, tipos de dispositivos utilizados para acceder a la plataforma.",
          "Datos de perfil: nombre de usuario y contraseña (almacenada de forma encriptada), preferencias de compra, intereses, y respuestas a encuestas cuando haya decidido participar en ellas.",
          "Datos de uso: información sobre cómo navega y utiliza nuestra plataforma, incluyendo tiempo de permanencia en páginas y patrones de navegación."
        ]
      },
      dataUsage: {
        title: "3. Cómo Utilizamos sus Datos",
        paragraph1: "Utilizamos su información personal únicamente para los fines específicos para los que fue recopilada y de conformidad con la PIPEDA y otras leyes canadienses aplicables. Estos fines incluyen:",
        list1: [
          "Administrar su cuenta y nuestra relación contractual, incluyendo la verificación de su identidad cuando sea necesario.",
          "Procesar y entregar sus pedidos, incluyendo la gestión de pagos, facturación y envíos.",
          "Administrar nuestra plataforma digital (incluyendo análisis de datos, pruebas, mantenimiento de sistemas, soporte técnico, y seguridad informática).",
          "Mejorar nuestros productos y servicios mediante el análisis de patrones de uso y preferencias de los clientes.",
          "Comunicarnos con usted sobre actualizaciones de productos, ofertas especiales o información relevante, siempre con la opción de darse de baja de estas comunicaciones.",
          "Cumplir con obligaciones legales y fiscales según lo requiera la legislación canadiense."
        ]
      },
      cookies: {
        title: "4. Cookies y Tecnologías de Seguimiento",
        paragraph1: "Utilizamos cookies y tecnologías similares de conformidad con las leyes canadienses de privacidad electrónica. Estas tecnologías nos permiten:",
        list1: [
          "Recordar sus preferencias y ajustes para mejorar su experiencia.",
          "Entender cómo utiliza nuestra plataforma para optimizarla.",
          "Facilitar funcionalidades esenciales como el carrito de compra y la autenticación de sesiones."
        ],
        paragraph2: "Puede configurar su navegador para rechazar todas o algunas cookies, o para alertarle cuando se utilizan. Sin embargo, esto podría afectar el funcionamiento de ciertas partes de nuestra plataforma. Al continuar utilizando nuestro sitio sin cambiar su configuración, usted consiente nuestro uso de cookies según lo descrito en esta política."
      },
      dataDisclosure: {
        title: "5. Divulgación de sus Datos Personales",
        paragraph1: "De acuerdo con la legislación canadiense, podemos compartir su información personal solo en circunstancias específicas:",
        list1: [
          "Con proveedores de servicios que nos asisten en nuestras operaciones comerciales (procesadores de pago, servicios de entrega, proveedores de alojamiento web) bajo estrictos acuerdos de confidencialidad.",
          "Con profesionales como asesores legales, contadores y auditores cuando sea necesario para nuestras operaciones comerciales.",
          "Con autoridades gubernamentales cuando sea requerido por ley, regulación o proceso legal.",
          "En el contexto de una transacción comercial como fusión, adquisición o venta de activos, con notificación previa a los usuarios afectados."
        ],
        paragraph2: "Exigimos a todos los terceros que respeten la confidencialidad y seguridad de sus datos personales y que cumplan con todas las leyes de privacidad aplicables, incluyendo la PIPEDA. No permitimos que nuestros proveedores de servicios utilicen sus datos para fines propios no autorizados."
      },
      internationalTransfers: {
        title: "6. Transferencias Internacionales de Datos",
        paragraph1: "Si transferimos sus datos personales fuera de Canadá, lo hacemos únicamente cuando existen garantías adecuadas para proteger sus derechos de privacidad, de conformidad con los requisitos de la PIPEDA. Estas garantías pueden incluir:",
        list1: [
          "Transferencias a países que el Comisionado de Privacidad de Canadá ha determinado que ofrecen un nivel adecuado de protección.",
          "Implementación de cláusulas contractuales aprobadas.",
          "Obtención de su consentimiento explícito cuando sea necesario."
        ]
      },
      dataSecurity: {
        title: "7. Seguridad de Datos",
        paragraph1: "Hemos implementado medidas de seguridad técnicas y organizativas apropiadas según los estándares de la industria canadiense para proteger sus datos personales contra accesos no autorizados, alteraciones, divulgaciones o destrucciones. Estas medidas incluyen:",
        list1: [
          "Encriptación de datos sensibles y transacciones financieras.",
          "Sistemas de firewall y detección de intrusiones.",
          "Acceso restringido a la información personal basado en necesidad de conocimiento.",
          "Evaluaciones regulares de seguridad y auditorías de cumplimiento."
        ]
      },
      dataRetention: {
        title: "8. Retención de Datos",
        paragraph1: "Conservamos sus datos personales únicamente durante el tiempo necesario para los fines para los que fueron recopilados, de acuerdo con nuestras obligaciones legales y comerciales. Los criterios utilizados para determinar nuestros períodos de retención incluyen:",
        list1: [
          "El período durante el cual mantenemos una relación comercial activa con usted.",
          "Nuestras obligaciones legales según la legislación canadiense aplicable, incluyendo normativas fiscales y comerciales.",
          "Requisitos para la resolución de disputas o reclamaciones."
        ]
      },
      yourRights: {
        title: "9. Sus Derechos Legales",
        paragraph1: "Bajo la PIPEDA y otras leyes canadienses de privacidad, usted tiene derechos específicos con respecto a sus datos personales, que incluyen:",
        list1: [
          "Derecho de acceso: Solicitar acceso a sus datos personales que procesamos.",
          "Derecho de rectificación: Solicitar la corrección de información inexacta o incompleta.",
          "Derecho a retirar el consentimiento: Retirar su consentimiento en cualquier momento cuando el procesamiento se base en su consentimiento.",
          "Derecho a presentar una queja: Presentar una reclamación ante la Oficina del Comisionado de Privacidad de Canadá si considera que hemos infringido sus derechos de privacidad.",
          "Derecho a impugnar el cumplimiento: Cuestionar nuestro cumplimiento de los principios de la PIPEDA."
        ],
        paragraph2: "Para ejercer cualquiera de estos derechos, contáctenos utilizando la información proporcionada en la sección \"Contacto\"."
      },
      changes: {
        title: "10. Cambios a esta Política de Privacidad",
        paragraph1: "Podemos actualizar esta política de privacidad periódicamente para reflejar cambios en nuestras prácticas o en la legislación canadiense. La versión más reciente estará siempre disponible en nuestra plataforma, con la fecha de actualización claramente indicada. Para cambios significativos, proporcionaremos notificaciones visibles en nuestra plataforma o le enviaremos comunicaciones directas."
      },
      contact: {
        title: "11. Contacto",
        paragraph1: "Para cualquier consulta relacionada con esta política de privacidad o el tratamiento de sus datos personales, puede contactarnos a través de:",
        email: "serviceclient@toutaunclicla.com",
        paragraph2: "Si considera que no hemos abordado adecuadamente sus preocupaciones, tiene derecho a presentar una queja ante la Oficina del Comisionado de Privacidad de Canadá:",
        website: "www.priv.gc.ca"
      }
    }
  },

  // Paginación
  pagination: {
    previous: "Anterior",
    next: "Siguiente",
    page: "Página",
    showing: "Mostrando",
    of: "de",
    results: "resultados",
    showingResults: "📊 Mostrando {start} - {end} de {total} resultado{plural}",
    loadMore: "Cargar más",
    loading: "Cargando...",
    loadingResults: "Cargando resultados...",
    searchResultsFor: "para \"{search}\""
  },

  // Reseñas
  reviews: {
    noReviews: "No hay reseñas todavía",
    anonymousUser: "Usuario anónimo",
    deleteComment: "Eliminar comentario",
    reportComment: "Reportar comentario",
    helpful: "Útil",
    deleteConfirmTitle: "¿Eliminar comentario?",
    deleteConfirmDescription: "Esta acción no se puede deshacer. El comentario será eliminado permanentemente.",
    loginToReview: "Inicia sesión para dejar una reseña",
    yourRating: "Tu calificación",
    yourComment: "Tu comentario",
    commentPlaceholder: "Comparte tu experiencia con este producto...",
    submitReview: "Enviar reseña"
  },
  
  // Traducciones para páginas de checkout
  checkout: {
    cancel: {
      title: "Pago Cancelado",
      subtitle: "No te preocupes, no se ha realizado ningún cargo",
      toastMessage: "Pago cancelado - Tu carrito sigue guardado",
      
      whatHappened: {
        title: "¿Qué pasó?",
        reasons: [
          "Cancelaste el proceso de pago en Stripe Checkout",
          "Tu carrito sigue guardado con todos tus productos", 
          "Puedes intentar el pago nuevamente cuando gustes",
          "No se ha realizado ningún cargo a tu tarjeta"
        ]
      },
      
      whatCanYouDo: {
        title: "¿Qué puedes hacer ahora?",
        reviewCart: {
          title: "Revisar tu Carrito",
          description: "Verifica los productos antes de continuar"
        },
        tryAgain: {
          title: "Intentar de Nuevo", 
          description: "El proceso de pago es seguro y rápido"
        },
        keepShopping: {
          title: "Seguir Comprando",
          description: "Explora más productos"
        }
      },
      
      buttons: {
        backToCart: "Volver a Mi Carrito",
        tryPaymentAgain: "Intentar Pago Nuevamente",
        continueShopping: "Continuar Comprando"
      },
      
      support: {
        title: "¿Tuviste problemas con el pago?",
        description: "Si experimentaste algún problema técnico durante el proceso de pago, nuestro equipo de soporte está aquí para ayudarte.",
        contactButton: "Contactar Soporte Técnico"
      }
    }
  },

  // Página Coming Soon
  comingSoon: {
    title: "¡Próximamente disponible!",
    mainMessage: "Estamos trabajando lo más que podemos para llevarte esa sección a un solo clic de tu casa!",
    subtitle: "Nueva funcionalidad en desarrollo",
    description: "Nuestro equipo está trabajando duro para traerte una experiencia increíble. Mantente atento a las actualizaciones.",
    features: {
      title: "¿Qué viene próximamente?",
      items: [
        "Experiencia de usuario mejorada",
        "Nuevas funcionalidades emocionantes",
        "Mejor rendimiento y velocidad",
        "Diseño moderno y responsive"
      ]
    },
    timeline: {
      title: "Cronograma de desarrollo",
      current: "En desarrollo activo",
      estimated: "Estimado: Próximamente",
      status: "Estamos trabajando en ello"
    },
    actions: {
      backToHome: "Volver al inicio",
      backToPrevious: "Volver atrás",
      notifyMe: "Notificarme cuando esté listo",
      followUpdates: "Seguir actualizaciones",
      visitOtherSections: "Explorar otras secciones"
    },
    encouragement: {
      title: "¡Algo increíble viene en camino!",
      message: "Mientras tanto, puedes explorar nuestros productos y servicios disponibles.",
      thanksForPatience: "Gracias por tu paciencia"
    },
    progress: {
      title: "Progreso del desarrollo",
      design: "Diseño completado",
      development: "Desarrollo en progreso",
      testing: "Pruebas pendientes",
      launch: "Lanzamiento próximo"
    }
  },

  aboutUs: {
    title: "Sobre Nosotros",
    subtitle: "Conectando las Américas con productos auténticos y sabores tradicionales desde Montreal",
    metaTitle: "Sobre Nosotros - ToutAunClicLa",
    metaDescription: "Conoce la historia de ToutAunClicLa, empresa fundada por emprendedores colombianos y venezolanos que lleva productos auténticos de América Latina a Montreal.",
    pageTitle: "Sobre Nosotros",
    pageSubtitle: "Conectamos culturas, llevamos tradiciones latinoamericanas a tu hogar en Montreal",
    hero: {
      title: "Conectando las Américas",
      subtitle: "Una historia de pasión, tradición y sabores auténticos",
      description: "Somos ToutAunClicLa, una empresa fundada con el sueño de acercar los sabores y productos más auténticos de América Latina a las familias de Montreal."
    },
    ourStory: {
      title: "Nuestra Historia",
      description1: "Somos tres emprendedores apasionados unidos por el amor a nuestras tradiciones y el deseo de compartir la riqueza cultural de Latinoamérica con las familias de Montreal.",
      description2: "Nuestra misión es ser el puente que conecta a las familias latinoamericanas con sus raíces, ofreciendo productos auténticos que despiertan recuerdos y crean nuevas memorias alrededor de la mesa."
    },
    founders: {
      title: "Nuestros Fundadores",
      zenen1: {
        name: "Zenen Contreras Fernandez",
        role: "Presidente - Co-fundador",
        description: "Líder enfocado en conectar culturas a través de productos auténticos"
      },
      david: {
        name: "David Araujo Lopez",
        role: "VicePresidente - Co-fundador",
        description: "Especialista en operaciones y experiencia del cliente"
      },
      zenen2: {
        name: "Zenen Contreras Royero",
        role: "Tecnología - Co-fundador",
        description: "Experto en desarrollo tecnológico e innovación digital"
      }
    },
    mission: {
      title: "Nuestra Misión",
      description: "Facilitar el acceso a productos auténticos de América Latina en Montreal, manteniendo la calidad, tradición y sabores que nos conectan con nuestras raíces."
    },
    story: {
      title: "Nuestra Historia",
      description: "ToutAunClicLa nació del sueño compartido de tres emprendedores latinos: dos colombianos y un venezolano unidos por la pasión de llevar los sabores auténticos de América Latina a las familias de Montreal. Cada producto en nuestra tienda cuenta una historia de tradición, calidad y amor por nuestras raíces.",
      mission: "Nuestra misión es conectar a las familias latinas con los productos que aman, manteniendo viva la tradición culinaria y cultural que nos define como comunidad en Montreal.",
      introduction: "ToutAunClicLa nació del encuentro de tres emprendedores apasionados:",
      founders: {
        title: "Nuestros Fundadores",
        description: "Dos talentosos colombianos y un emprendedor venezolano que comparten una visión común: llevar lo mejor de América Latina a Montreal.",
        colombia: "Representando la diversidad y riqueza de Colombia",
        venezuela: "Aportando la calidez y sabor venezolano"
      },
      journey: {
        title: "Nuestro Camino",
        paragraph1: "Llegamos a Montreal con nuestras tradiciones, recetas familiares y el deseo de compartir los sabores auténticos que nos definen como latinos.",
        paragraph2: "Entendemos la nostalgia de estar lejos de casa y la importancia de encontrar esos productos que nos conectan con nuestras raíces.",
        paragraph3: "Cada producto en nuestro catálogo es cuidadosamente seleccionado, garantizando la autenticidad y calidad que nuestros clientes merecen."
      }
    },
    values: {
      title: "Nuestros Valores",
      subtitle: "Los principios que guían cada decisión y nos conectan con nuestra comunidad",
      passion: {
        title: "Pasión",
        description: "Amor por nuestra cultura y productos auténticos"
      },
      community: {
        title: "Comunidad",
        description: "Conectamos familias con sus tradiciones"
      },
      quality: {
        title: "Calidad",
        description: "Solo los mejores productos latinoamericanos"
      },
      diversity: {
        title: "Diversidad",
        description: "Celebramos la riqueza cultural de Latinoamérica"
      },
      authenticity: {
        title: "Autenticidad",
        description: "Cada producto refleja la verdadera esencia de América Latina"
      },
      service: {
        title: "Servicio",
        description: "Brindamos una experiencia excepcional a cada cliente"
      }
    },
    location: {
      title: "Nuestra Ubicación",
      subtitle: "Sirviendo a la Zona Metropolitana de Montreal",
      address: "620 Rue Saint-Thomas, Longueuil, QC J4H 3A7",
      serviceArea: "Entregamos en toda la zona metropolitana de Montreal",
      commitment: "Estamos comprometidos con brindar el mejor servicio a nuestra comunidad local."
    },
    team: {
      title: "Nuestro Equipo",
      description: "Un equipo multicultural unido por la pasión de compartir lo mejor de América Latina",
      colombianFounders: "Fundadores Colombianos",
      venezuelanFounder: "Fundador Venezolano",
      teamSpirit: "Juntos, trabajamos para crear una experiencia única que celebra nuestra diversidad cultural."
    },
    contact: {
      title: "Contáctanos",
      description: "Estamos aquí para ayudarte. Contáctanos para cualquier consulta o síguenos en redes sociales",
      subtitle: "¿Tienes preguntas o comentarios? ¡Nos encantaría escucharte!",
      email: "serviceclient@toutaunclicla.com",
      address: "620 Rue Saint-Thomas, Longueuil, QC J4H 3A7",
      addressLine1: "620 Rue Saint-Thomas",
      addressLine2: "Longueuil, QC J4H 3A7",
      addressLine3: "Montreal, Canadá",
      getInTouch: "Ponte en contacto",
      followJourney: "Sigue nuestro viaje y descubre nuevos productos cada semana.",
      contactInfo: "Información de Contacto",
      followUs: "Síguenos",
      followDescription: "Mantente conectado con nuestras últimas novedades y productos",
      addressLabel: "Dirección",
      emailLabel: "Email"
    },
    cta: {
      title: "¿Listo para descubrir nuestros productos?",
      subtitle: "Explora nuestra selección de productos auténticos latinoamericanos y conecta con tus tradiciones",
      description: "Desde harinas tradicionales hasta salsas caseras, encuentra todo lo que necesitas para recrear los sabores de casa.",
      browseProducts: "Ver productos",
      viewFoods: "Ver Comida",
      visitBoutique: "Ver Boutique",
      orderOnline: "Ordena en línea y recibe en casa"
    },
    stats: {
      experience: "Años de experiencia",
      products: "Productos auténticos",
      customers: "Clientes satisfechos",
      deliveries: "Entregas realizadas"
    }
  }
};