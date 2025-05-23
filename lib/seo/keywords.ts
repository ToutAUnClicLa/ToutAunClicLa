/**
 * Palabras clave SEO organizadas por categorías e idiomas para Tout à un Clic LA
 * 
 * Este archivo contiene más de 300 palabras clave en español, francés e inglés,
 * organizadas por categorías temáticas para facilitar su integración estratégica
 * en el contenido del sitio web.
 */

export interface KeywordGroup {
  es: string[];
  fr: string[];
  en: string[];
}

export interface KeywordCategory {
  general: KeywordGroup;
  location: KeywordGroup;
  products: KeywordGroup;
  food: KeywordGroup;
  boutique: KeywordGroup;
  services: KeywordGroup;
  blog: KeywordGroup;
}

export const keywords: KeywordCategory = {
  // Palabras clave generales sobre la tienda
  general: {
    es: [
      "tienda latina montreal", "productos latinoamericanos montreal", "tienda latina quebec", 
      "mercado latino montreal", "productos latinos canadá", "a un clic la", 
      "comercio en línea latino", "tienda online latina montreal", "tienda hispana montreal",
      "tout à un clic la", "importados latinos montreal", "tienda latina cerca de mí",
      "productos latinos a domicilio", "tienda online latina", "e-commerce latino canadá",
      "mercado latino en línea", "productos sudamericanos montreal"
    ],
    fr: [
      "boutique latino montréal", "produits latino montréal", "magasin latino québec",
      "produits d'amérique latine montréal", "boutique latino en ligne", "tout à un clic la",
      "commerce en ligne latino", "épicerie latine montréal", "produits latinos canada",
      "magasin latino montréal", "boutique latine près de moi", "importations latines montréal",
      "produits d'amérique du sud montréal", "acheter produits latinos montréal",
      "e-commerce latino canada", "boutique latino québec", "magasin latino en ligne"
    ],
    en: [
      "latin store montreal", "latin american products montreal", "latin shop quebec",
      "latino market montreal", "latin american goods canada", "tout à un clic la",
      "latin online store", "latino grocery montreal", "latin products canada",
      "latin american shop montreal", "latino store near me", "latin imports montreal",
      "south american products montreal", "buy latino products online",
      "latin e-commerce canada", "latin american market montreal", "montreal latino shop"
    ]
  },
  
  // Palabras clave relacionadas con ubicación
  location: {
    es: [
      "montreal latino", "quebec productos latinos", "tienda latina zona metropolitana montreal",
      "productos latinos entrega domicilio montreal", "tienda latina barrio latino montreal",
      "productos latinos plaza st-hubert", "tienda hispana downtown montreal",
      "productos latinoamericanos laval", "tienda latina longueuil", "mercado latino brossard",
      "productos sudamericanos west island", "tienda latina rosemont", "mercado latino ville saint-laurent",
      "tienda hispana outremont", "productos latinos côte-des-neiges", "tienda latina plateau mont-royal"
    ],
    fr: [
      "montréal latino", "québec produits latinos", "boutique latine région métropolitaine montréal",
      "produits latinos livraison à domicile montréal", "magasin latin quartier latin montréal",
      "produits latinos plaza st-hubert", "boutique hispanique centre-ville montréal",
      "produits latino-américains laval", "magasin latino longueuil", "marché latino brossard",
      "produits sud-américains west island", "boutique latine rosemont", "marché latino ville saint-laurent",
      "boutique hispanique outremont", "produits latinos côte-des-neiges", "magasin latin plateau mont-royal"
    ],
    en: [
      "montreal latino", "quebec latin products", "latin store montreal metropolitan area",
      "latin products home delivery montreal", "latino store latin quarter montreal",
      "latin products plaza st-hubert", "hispanic shop downtown montreal",
      "latin american products laval", "latino store longueuil", "latin market brossard",
      "south american products west island", "latin store rosemont", "latino market ville saint-laurent",
      "hispanic shop outremont", "latin products côte-des-neiges", "latino store plateau mont-royal"
    ]
  },
  
  // Palabras clave sobre productos
  products: {
    es: [
      "harina de maíz precocida", "harina pan", "arepa", "masa para tortillas", "maseca",
      "salsas picantes latinoamericanas", "ají", "chimichurri argentino", "guacamole mexicano",
      "dulce de leche", "alfajores", "yerba mate", "panela", "piloncillo", "queso latino",
      "productos tropicales", "café colombiano", "chocolate ecuatoriano", "frijoles negros",
      "garbanzos", "aceite de aguacate", "manteca", "productos peruanos", "productos mexicanos",
      "productos colombianos", "productos argentinos", "productos brasileños", "productos chilenos",
      "productos ecuatorianos", "productos venezolanos", "productos guatemaltecos"
    ],
    fr: [
      "farine de maïs précuite", "farine pan", "arepa", "pâte à tortillas", "maseca",
      "sauces piquantes latino-américaines", "ají", "chimichurri argentin", "guacamole mexicain",
      "dulce de leche", "alfajores", "yerba mate", "panela", "piloncillo", "fromage latino",
      "produits tropicaux", "café colombien", "chocolat équatorien", "haricots noirs",
      "pois chiches", "huile d'avocat", "saindoux", "produits péruviens", "produits mexicains",
      "produits colombiens", "produits argentins", "produits brésiliens", "produits chiliens",
      "produits équatoriens", "produits vénézuéliens", "produits guatémaltèques"
    ],
    en: [
      "precooked corn flour", "pan flour", "arepa", "tortilla dough", "maseca",
      "latin american hot sauces", "ají", "argentine chimichurri", "mexican guacamole",
      "dulce de leche", "alfajores", "yerba mate", "panela", "piloncillo", "latin cheese",
      "tropical products", "colombian coffee", "ecuadorian chocolate", "black beans",
      "chickpeas", "avocado oil", "lard", "peruvian products", "mexican products",
      "colombian products", "argentine products", "brazilian products", "chilean products",
      "ecuadorian products", "venezuelan products", "guatemalan products"
    ]
  },
  
  // Palabras clave sobre gastronomía
  food: {
    es: [
      "gastronomía latinoamericana", "comida mexicana montreal", "comida peruana montreal",
      "comida colombiana montreal", "comida argentina montreal", "comida venezolana montreal",
      "comida brasileña montreal", "comida chilena montreal", "empanadas", "tacos", "arepas",
      "tamales", "enchiladas", "ceviche", "pupusas", "churrasco", "mole", "ingredientes latinos",
      "cocina latina tradicional", "recetas latinas", "comida latina", "platos típicos latinos",
      "gastronomía sudamericana", "gastronomía centroamericana", "ingredientes auténticos latinos"
    ],
    fr: [
      "gastronomie latino-américaine", "cuisine mexicaine montréal", "cuisine péruvienne montréal",
      "cuisine colombienne montréal", "cuisine argentine montréal", "cuisine vénézuélienne montréal",
      "cuisine brésilienne montréal", "cuisine chilienne montréal", "empanadas", "tacos", "arepas",
      "tamales", "enchiladas", "ceviche", "pupusas", "churrasco", "mole", "ingrédients latinos",
      "cuisine latine traditionnelle", "recettes latines", "nourriture latine", "plats typiques latinos",
      "gastronomie sud-américaine", "gastronomie centre-américaine", "ingrédients authentiques latinos"
    ],
    en: [
      "latin american gastronomy", "mexican food montreal", "peruvian food montreal",
      "colombian food montreal", "argentine food montreal", "venezuelan food montreal",
      "brazilian food montreal", "chilean food montreal", "empanadas", "tacos", "arepas",
      "tamales", "enchiladas", "ceviche", "pupusas", "churrasco", "mole", "latin ingredients",
      "traditional latin cuisine", "latin recipes", "latin food", "typical latin dishes",
      "south american gastronomy", "central american gastronomy", "authentic latin ingredients"
    ]
  },
  
  // Palabras clave sobre boutique
  boutique: {
    es: [
      "artesanías latinoamericanas", "ropa latina montreal", "textiles latinos", "artesanía mexicana",
      "artesanía peruana", "ponchos andinos", "joyería latina", "accesorios latinos", "souvenirs latinos",
      "decoración latina", "arte latino", "objetos hechos a mano", "ropa típica latina", "hamacas",
      "bolsas tejidas a mano", "sombreros latinos", "tejidos tradicionales", "cerámica latina",
      "bordados latinos", "regalos latinos", "moda latina montreal", "artesanía colombiana"
    ],
    fr: [
      "artisanat latino-américain", "vêtements latinos montréal", "textiles latinos", "artisanat mexicain",
      "artisanat péruvien", "ponchos andins", "bijoux latinos", "accessoires latinos", "souvenirs latinos",
      "décoration latine", "art latino", "objets faits main", "vêtements typiques latinos", "hamacs",
      "sacs tissés à la main", "chapeaux latinos", "tissus traditionnels", "céramique latine",
      "broderies latines", "cadeaux latinos", "mode latine montréal", "artisanat colombien"
    ],
    en: [
      "latin american crafts", "latino clothing montreal", "latin textiles", "mexican crafts",
      "peruvian crafts", "andean ponchos", "latin jewelry", "latin accessories", "latin souvenirs",
      "latin decor", "latin art", "handmade objects", "typical latin clothing", "hammocks",
      "hand-woven bags", "latin hats", "traditional textiles", "latin ceramics",
      "latin embroidery", "latin gifts", "latin fashion montreal", "colombian crafts"
    ]
  },
  
  // Palabras clave sobre servicios
  services: {
    es: [
      "envío a domicilio productos latinos", "entrega montreal productos latinos",
      "compra online productos latinos", "envío a todo canadá", "envío express productos latinos",
      "tienda online latinos montreal", "pedidos en línea comida latina", "envío gratuito productos latinos",
      "pago seguro tienda latina", "click and collect productos latinos", "envío nacional productos latinos",
      "compra por mayor productos latinos", "importación productos latinos", "distribución productos latinos"
    ],
    fr: [
      "livraison à domicile produits latinos", "livraison montréal produits latinos",
      "achat en ligne produits latinos", "expédition partout au canada", "livraison express produits latinos",
      "boutique en ligne latinos montréal", "commandes en ligne nourriture latine", "livraison gratuite produits latinos",
      "paiement sécurisé boutique latine", "click and collect produits latinos", "expédition nationale produits latinos",
      "achat en gros produits latinos", "importation produits latinos", "distribution produits latinos"
    ],
    en: [
      "home delivery latin products", "montreal delivery latin products",
      "online purchase latin products", "shipping across canada", "express delivery latin products",
      "online store latinos montreal", "online orders latin food", "free shipping latin products",
      "secure payment latin store", "click and collect latin products", "nationwide shipping latin products",
      "wholesale latin products", "import latin products", "distribution latin products"
    ]
  },
  
  // Palabras clave para el blog
  blog: {
    es: [
      "blog cultura latinoamericana", "recetas latinoamericanas", "tradiciones latinas",
      "gastronomía latina blog", "cultura latina montreal", "ingredientes latinos blog",
      "blog artesanía latina", "costumbres latinoamericanas", "festividades latinas",
      "blog cocina latina", "historia gastronomía latina", "blog latino montreal",
      "blog comida latina", "blog productos latinos", "blog recetas latinas"
    ],
    fr: [
      "blog culture latino-américaine", "recettes latino-américaines", "traditions latines",
      "gastronomie latine blog", "culture latine montréal", "ingrédients latinos blog",
      "blog artisanat latin", "coutumes latino-américaines", "festivités latines",
      "blog cuisine latine", "histoire gastronomie latine", "blog latino montréal",
      "blog nourriture latine", "blog produits latinos", "blog recettes latines"
    ],
    en: [
      "latin american culture blog", "latin american recipes", "latin traditions",
      "latin gastronomy blog", "latin culture montreal", "latin ingredients blog",
      "latin crafts blog", "latin american customs", "latin festivities",
      "latin cuisine blog", "latin gastronomy history", "latin blog montreal",
      "latin food blog", "latin products blog", "latin recipes blog"
    ]
  }
};

/**
 * Función para obtener palabras clave aleatorias para una categoría y idioma específicos
 * 
 * @param category - La categoría de palabras clave
 * @param language - El idioma de las palabras clave ('es', 'fr', 'en')
 * @param count - Número de palabras clave a devolver
 * @returns Array de palabras clave aleatorias
 */
export function getRandomKeywords(
  category: keyof KeywordCategory,
  language: 'es' | 'fr' | 'en' = 'es',
  count: number = 5
): string[] {
  const keywordList = keywords[category][language];
  const shuffled = [...keywordList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Función para obtener palabras clave relacionadas con una ubicación específica
 * 
 * @param location - Nombre de la ubicación
 * @param language - Idioma de las palabras clave
 * @param count - Número de palabras clave a devolver
 * @returns Array de palabras clave relacionadas con la ubicación
 */
export function getLocationKeywords(
  location: string = 'montreal',
  language: 'es' | 'fr' | 'en' = 'es',
  count: number = 5
): string[] {
  const locationKeywords = keywords.location[language].filter(
    keyword => keyword.toLowerCase().includes(location.toLowerCase())
  );
  
  // Si no hay suficientes palabras clave específicas para la ubicación,
  // combinar con palabras clave generales
  if (locationKeywords.length < count) {
    const generalKeywords = keywords.general[language].filter(
      keyword => keyword.toLowerCase().includes(location.toLowerCase())
    );
    const combined = [...locationKeywords, ...generalKeywords];
    const shuffled = [...combined].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  const shuffled = [...locationKeywords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default keywords; 