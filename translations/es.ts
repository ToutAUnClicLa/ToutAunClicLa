export default {
  nav: {
    home: "Inicio",
    products: "Productos",
    foods: "Comidas",
    boutique: "Boutique",
    login: "Iniciar Sesión",
    profile: {
      myProfile: "Mi Perfil",
      addresses: "Direcciones",
      favorites: "Favoritos", 
      myOrders: "Pedidos",
      notifications: "Notificaciones",
      settings: "Configuración",
      logout: "Cerrar sesión"
    }
  },
  footer: {
    about: {
      title: "Tout à un Clic LA",
      description: "Conectando las Américas a través de productos auténticos y experiencias únicas. Entrega en todo Montreal, Quebec y Canadá."
    },
    explore: {
      title: "Explorar",
      home: "Inicio",
      products: "Productos",
      foods: "Comidas",
      boutique: "Boutique"
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
      address: "123 Rue Latino, Montreal, QC H1H 1H1, Canadá",
      phone: "+1 (514) 123-4567",
      email: "info@toutaunclicla.com",
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
      description: "Nuestra tienda exclusiva estará disponible muy pronto, trayendo los productos más auténticos de todas las Américas.",
      cta: "Registrate para acceso anticipado"
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
        title: "Boutique",
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
        title: "Colección Boutique",
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
      }
    ],
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
        id: 1,
        name: "Ropa y Accesorios",
        description: "Viste con las mejores prendas y accesorios tradicionales americanos",
        image: "/ropaBoutique.png",
        color: "from-purple-600 to-indigo-600",
        viewText: "Explorar colección",
        subcategoria_id: "ropa-accesorios"
      },
      {
        id: 2,
        name: "Accesorios Decorativos",
        description: "Decora tu hogar con auténticas piezas artesanales americanas",
        image: "/accesoriosBoutique.png",
        color: "from-pink-600 to-rose-600",
        viewText: "Descubrir decoración",
        subcategoria_id: "accesorios-decorativos"
      },
      {
        id: 3,
        name: "Souvenirs",
        description: "Lleva contigo un pedazo de América con nuestros encantadores souvenirs",
        image: "/souvenirBoutique.png",
        color: "from-amber-600 to-orange-600",
        viewText: "Ver souvenirs",
        subcategoria_id: "souvenirs"
      }
    ]  },  auth: {
    // Títulos de modales
    loginTitle: "Iniciar Sesión",
    registerTitle: "Crear Cuenta",
    forgotPasswordTitle: "Recuperar Contraseña",
    
    // Descripciones
    loginDescription: "Bienvenido de vuelta a Tout À un clic là",
    registerDescription: "Únete a nuestra comunidad",
    forgotPasswordDescription: "Te enviaremos un enlace para restablecer tu contraseña",
    
    // Labels de campos
    fullName: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono (opcional)",
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
    welcomeBack: "¡Bienvenido de vuelta!",
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
    
    // Aria labels
    closeModal: "Cerrar",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña"
  },
    // Nuevas traducciones para el navbar móvil
  navbar: {
    welcome: "¡Bienvenido!",
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
      // Mensajes de sistema
    logoutSuccess: "Sesión cerrada correctamente",
    logoutError: "Error al cerrar sesión",
    languageChanged: "Idioma cambiado a"
  },
  
  // Traducciones para catálogo de productos
  catalog: {
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
      limitedStock: "Stock limitado",
      newProduct: "Nuevo",
      bestseller: "Más vendido",
      featured: "Destacado"
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
      noProducts: "No se encontraron productos",
      noProductsMessage: "No hay productos que coincidan con los filtros seleccionados.",
      tryDifferentFilters: "Intenta ajustar los filtros o buscar algo diferente.",
      loadMore: "Cargar más",
      showingResults: "Mostrando {count} de {total} productos",
      
      // Beneficios
      benefits: {
        fastDelivery: {
          title: "Entrega Rápida",
          description: "Recibe tu pedido en 24-48h"
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
        errorTogglingFavorite: "Error al actualizar favoritos",
        loginRequired: "Debes iniciar sesión para continuar"
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
      errorTogglingFavorite: "Error al actualizar favoritos",
      loginToAddToCart: "Inicia sesión para agregar productos al carrito",
      loginToAddToFavorites: "Inicia sesión para agregar productos a favoritos",
      errorLoadingProduct: "Error al cargar el producto",
      productNotFound: "Producto no encontrado"
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
  }
};