export default {
  nav: {
    home: "Inicio",
    products: "Productos",
    foods: "Comidas",
    boutique: "Boutique",
    login: "Iniciar Sesión",
    profile: {
      myProfile: "Mi Perfil",
      myOrders: "Mis Pedidos",
      favorites: "Favoritos",
      addresses: "Direcciones",
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
    },    contact: {
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
  }
};