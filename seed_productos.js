// ============================================================
// SEED SCRIPT - Productos estilo Tienda Olímpica
// Colecciones: Categorias, Productos, Inventario
// Base de datos: seged
// ============================================================

// Autenticarse y seleccionar la base de datos
db = db.getSiblingDB('seged');

// ============================================================
// LIMPIAR COLECCIONES EXISTENTES (opcional - comentar si no quieres borrar)
// ============================================================
print("🧹 Limpiando colecciones previas...");
db.Categorias.deleteMany({});
db.Productos.deleteMany({});
db.Inventario.deleteMany({});

// ============================================================
// 1. INSERTAR CATEGORÍAS
// ============================================================
print("📂 Insertando categorías...");

const categorias = [
  { nombre: "Alimentos y Despensa",       descripcion: "Productos de consumo básico: aceites, harinas, arroces, pastas, enlatados y más.",   fechaCreacion: "2024-01-01" },
  { nombre: "Lácteos y Huevos",           descripcion: "Leches, yogures, quesos, mantequillas y huevos frescos.",                             fechaCreacion: "2024-01-01" },
  { nombre: "Carnes y Embutidos",         descripcion: "Carnes frías, embutidos, salchichas, jamones y chorizos.",                            fechaCreacion: "2024-01-01" },
  { nombre: "Frutas y Verduras",          descripcion: "Frutas frescas, verduras y hortalizas de temporada.",                                 fechaCreacion: "2024-01-01" },
  { nombre: "Panadería y Repostería",     descripcion: "Panes, galletas, tortas, ponqués y productos de panadería.",                          fechaCreacion: "2024-01-01" },
  { nombre: "Bebidas",                    descripcion: "Jugos, gaseosas, aguas, bebidas energéticas y licores.",                              fechaCreacion: "2024-01-01" },
  { nombre: "Limpieza y Hogar",           descripcion: "Detergentes, limpiadores, desinfectantes y productos para el hogar.",                 fechaCreacion: "2024-01-01" },
  { nombre: "Cuidado Personal",           descripcion: "Shampoos, jabones, cremas, desodorantes y artículos de higiene personal.",            fechaCreacion: "2024-01-01" },
  { nombre: "Snacks y Confitería",        descripcion: "Papas fritas, chocolates, dulces, gomitas y snacks variados.",                        fechaCreacion: "2024-01-01" },
  { nombre: "Congelados",                 descripcion: "Alimentos congelados: pizzas, papas precocidas, mariscos y comidas listas.",           fechaCreacion: "2024-01-01" }
];

db.Categorias.insertMany(categorias);

const catDocs = db.Categorias.find().toArray();
const getCatId = (nombre) => catDocs.find(c => c.nombre === nombre)._id;

// ============================================================
// 2. INSERTAR PRODUCTOS (75 productos)
// ============================================================
print("🛒 Insertando 75 productos...");

const productos = [
  // ---- ALIMENTOS Y DESPENSA (15 productos) ----
  { nombre: "Arroz Diana x 1kg",           descripcion: "Arroz blanco de grano largo, seleccionado y limpio. Rendidor y de excelente calidad.",        preciounitario: 4500,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Aceite Girasol Gourmet x 1L", descripcion: "Aceite de girasol refinado, libre de colesterol. Ideal para freír y cocinar.",                preciounitario: 12900, categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Harina de Trigo Selecta x 1kg",descripcion: "Harina de trigo 100% pura, ideal para panadería, tortas y frituras.",                        preciounitario: 3800,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Azúcar Manuelita x 2kg",      descripcion: "Azúcar blanca refinada, ideal para endulzar bebidas y preparar postres.",                    preciounitario: 7200,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Pasta Doria Espagueti x 500g",descripcion: "Espagueti de sémola de trigo duro, cocción perfecta en 10 minutos.",                          preciounitario: 3200,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Atún Van Camps x 170g",       descripcion: "Atún en agua, rico en proteínas y omega 3. Listo para consumir.",                             preciounitario: 5800,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Sal Refisal x 500g",          descripcion: "Sal refinada yodada y fluorizada, para sazonar y cocinar con salud.",                         preciounitario: 1500,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Frijoles Carvajal x 500g",    descripcion: "Frijoles rojos seleccionados, de gran sabor y alto contenido proteico.",                      preciounitario: 4900,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Lentejas La Cosecha x 500g",  descripcion: "Lentejas verdes de primera calidad, fuente de hierro y proteínas vegetales.",                 preciounitario: 4200,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Maicena Maizena x 400g",      descripcion: "Fécula de maíz para espesar salsas, sopas y preparar postres cremosos.",                      preciounitario: 5100,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Caldo Maggi de Res x 90g",    descripcion: "Caldo en polvo de res con sabor casero, para sopas, arroces y guisos.",                       preciounitario: 3600,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Vinagre Bálsamo x 500ml",     descripcion: "Vinagre balsámico de uva, ideal para aderezar ensaladas y marinadas.",                        preciounitario: 8900,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Salsa de Tomate Fruco x 400g",descripcion: "Salsa de tomate natural con especias, perfecta para pastas, hamburguesas y pizzas.",           preciounitario: 5400,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Sopa Maggi Gallina x 85g",    descripcion: "Sopa instantánea de gallina criolla, lista en minutos y con sabor casero.",                   preciounitario: 2800,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },
  { nombre: "Panela Redonda x 500g",       descripcion: "Panela 100% natural de caña de azúcar. Sin aditivos, endulzante tradicional colombiano.",     preciounitario: 3100,  categoria: { $ref: "Categorias", $id: getCatId("Alimentos y Despensa") }, fechadecreacion: new Date() },

  // ---- LÁCTEOS Y HUEVOS (8 productos) ----
  { nombre: "Leche Entera Alquería x 1L",  descripcion: "Leche entera UHT, fuente de calcio y vitaminas. Ideal para toda la familia.",                 preciounitario: 4200,  categoria: { $ref: "Categorias", $id: getCatId("Lácteos y Huevos") }, fechadecreacion: new Date() },
  { nombre: "Yogur Alpina Fresa x 200g",   descripcion: "Yogur cremoso de fresa con cultivos activos, fuente de proteínas y calcio.",                  preciounitario: 2900,  categoria: { $ref: "Categorias", $id: getCatId("Lácteos y Huevos") }, fechadecreacion: new Date() },
  { nombre: "Queso Campesino x 500g",      descripcion: "Queso blanco fresco, suave y cremoso. Perfecto para acompañar comidas típicas.",               preciounitario: 14500, categoria: { $ref: "Categorias", $id: getCatId("Lácteos y Huevos") }, fechadecreacion: new Date() },
  { nombre: "Mantequilla Colanta x 250g",  descripcion: "Mantequilla sin sal elaborada con leche fresca de alta calidad.",                             preciounitario: 8900,  categoria: { $ref: "Categorias", $id: getCatId("Lácteos y Huevos") }, fechadecreacion: new Date() },
  { nombre: "Huevos AA x 30 unidades",     descripcion: "Huevos de gallina frescos calibre AA, ricos en proteínas y vitaminas esenciales.",            preciounitario: 18500, categoria: { $ref: "Categorias", $id: getCatId("Lácteos y Huevos") }, fechadecreacion: new Date() },
  { nombre: "Crema de Leche Nestlé x 250g",descripcion: "Crema de leche espesa ideal para salsas, postres y preparaciones gourmet.",                   preciounitario: 6800,  categoria: { $ref: "Categorias", $id: getCatId("Lácteos y Huevos") }, fechadecreacion: new Date() },
  { nombre: "Kumis Alquería x 200ml",      descripcion: "Bebida láctea fermentada, suave y refrescante. Fuente de probióticos naturales.",              preciounitario: 2500,  categoria: { $ref: "Categorias", $id: getCatId("Lácteos y Huevos") }, fechadecreacion: new Date() },
  { nombre: "Queso Doble Crema Colanta x 250g", descripcion: "Queso doble crema fundente, ideal para pizzas, lasañas y gratinados.",                   preciounitario: 9800,  categoria: { $ref: "Categorias", $id: getCatId("Lácteos y Huevos") }, fechadecreacion: new Date() },

  // ---- CARNES Y EMBUTIDOS (8 productos) ----
  { nombre: "Salchichas Ranchera x 500g",  descripcion: "Salchichas de cerdo y res, sabor ahumado, perfectas para parrilla y sandwiches.",             preciounitario: 11200, categoria: { $ref: "Categorias", $id: getCatId("Carnes y Embutidos") }, fechadecreacion: new Date() },
  { nombre: "Jamón Cerdo Zenu x 250g",     descripcion: "Jamón de cerdo cocido, bajo en grasa y de sabor suave. Ideal para sándwiches.",               preciounitario: 8500,  categoria: { $ref: "Categorias", $id: getCatId("Carnes y Embutidos") }, fechadecreacion: new Date() },
  { nombre: "Chorizo Antioqueño x 500g",   descripcion: "Chorizo típico antioqueño, elaborado con carne de cerdo y especias naturales.",               preciounitario: 13900, categoria: { $ref: "Categorias", $id: getCatId("Carnes y Embutidos") }, fechadecreacion: new Date() },
  { nombre: "Mortadela Zenu x 500g",       descripcion: "Mortadela de res y cerdo con pimienta, fácil de cortar y lista para consumir.",               preciounitario: 9200,  categoria: { $ref: "Categorias", $id: getCatId("Carnes y Embutidos") }, fechadecreacion: new Date() },
  { nombre: "Tocineta Ahumada x 200g",     descripcion: "Tocineta de cerdo ahumada en tiras, crujiente y de excelente sabor para desayunos.",          preciounitario: 10500, categoria: { $ref: "Categorias", $id: getCatId("Carnes y Embutidos") }, fechadecreacion: new Date() },
  { nombre: "Salami Milano x 150g",        descripcion: "Salami italiano curado con hierbas y especias, ideal para tablas de charcutería.",            preciounitario: 12800, categoria: { $ref: "Categorias", $id: getCatId("Carnes y Embutidos") }, fechadecreacion: new Date() },
  { nombre: "Pernil de Cerdo x 1kg",       descripcion: "Pernil de cerdo fresco, jugoso y tierno. Ideal para hornear con especias.",                   preciounitario: 22900, categoria: { $ref: "Categorias", $id: getCatId("Carnes y Embutidos") }, fechadecreacion: new Date() },
  { nombre: "Pechuga de Pollo x 1kg",      descripcion: "Pechuga de pollo fresca, magra y sin hueso. Fuente de proteínas de alta calidad.",           preciounitario: 16800, categoria: { $ref: "Categorias", $id: getCatId("Carnes y Embutidos") }, fechadecreacion: new Date() },

  // ---- FRUTAS Y VERDURAS (7 productos) ----
  { nombre: "Banano x kg",                 descripcion: "Bananos maduros frescos, fuente de potasio y energía. Cultivados en Colombia.",               preciounitario: 2800,  categoria: { $ref: "Categorias", $id: getCatId("Frutas y Verduras") }, fechadecreacion: new Date() },
  { nombre: "Tomate Chonto x kg",          descripcion: "Tomate chonto fresco y maduro, ideal para ensaladas, salsas y guisos.",                      preciounitario: 3500,  categoria: { $ref: "Categorias", $id: getCatId("Frutas y Verduras") }, fechadecreacion: new Date() },
  { nombre: "Cebolla Cabezona Blanca x kg",descripcion: "Cebolla cabezona fresca, sabor suave. Esencial para sopas, guisos y ensaladas.",             preciounitario: 2900,  categoria: { $ref: "Categorias", $id: getCatId("Frutas y Verduras") }, fechadecreacion: new Date() },
  { nombre: "Papa Criolla x kg",           descripcion: "Papa criolla fresca colombiana, de pulpa amarilla y sabor suave. Ideal para sopas.",          preciounitario: 3200,  categoria: { $ref: "Categorias", $id: getCatId("Frutas y Verduras") }, fechadecreacion: new Date() },
  { nombre: "Mango Tommy x kg",            descripcion: "Mango Tommy jugoso y dulce, cosecha directa de los Llanos Orientales.",                       preciounitario: 4100,  categoria: { $ref: "Categorias", $id: getCatId("Frutas y Verduras") }, fechadecreacion: new Date() },
  { nombre: "Lechuga Batavia x unidad",    descripcion: "Lechuga fresca de hoja verde crespa, ideal para ensaladas y wraps.",                         preciounitario: 2500,  categoria: { $ref: "Categorias", $id: getCatId("Frutas y Verduras") }, fechadecreacion: new Date() },
  { nombre: "Aguacate Hass x unidad",      descripcion: "Aguacate Hass cremoso y maduro, rico en grasas saludables y vitamina E.",                    preciounitario: 4800,  categoria: { $ref: "Categorias", $id: getCatId("Frutas y Verduras") }, fechadecreacion: new Date() },

  // ---- PANADERÍA Y REPOSTERÍA (7 productos) ----
  { nombre: "Pan Tajado Bimbo x 600g",     descripcion: "Pan blanco tajado suave, ideal para desayunos y meriendas con cualquier relleno.",            preciounitario: 7500,  categoria: { $ref: "Categorias", $id: getCatId("Panadería y Repostería") }, fechadecreacion: new Date() },
  { nombre: "Galletas Oreo x 432g",        descripcion: "Galletas de chocolate rellenas de crema de vainilla. El clásico favorito de todos.",          preciounitario: 14900, categoria: { $ref: "Categorias", $id: getCatId("Panadería y Repostería") }, fechadecreacion: new Date() },
  { nombre: "Ponqué Gala x 450g",          descripcion: "Ponqué suave y esponjoso de vainilla con cobertura de azúcar, sabor casero.",                 preciounitario: 9800,  categoria: { $ref: "Categorias", $id: getCatId("Panadería y Repostería") }, fechadecreacion: new Date() },
  { nombre: "Tostadas Integrales x 200g",  descripcion: "Tostadas de trigo integral, crujientes y bajas en grasa. Perfectas con mermelada.",           preciounitario: 5900,  categoria: { $ref: "Categorias", $id: getCatId("Panadería y Repostería") }, fechadecreacion: new Date() },
  { nombre: "Galletas Festival x 300g",    descripcion: "Galletas rellenas de crema en diferentes sabores: limón, fresa y vainilla.",                  preciounitario: 6200,  categoria: { $ref: "Categorias", $id: getCatId("Panadería y Repostería") }, fechadecreacion: new Date() },
  { nombre: "Croissant de Mantequilla x 6", descripcion: "Croissants hojaldrados de mantequilla, listos para consumir o calentar al horno.",           preciounitario: 8400,  categoria: { $ref: "Categorias", $id: getCatId("Panadería y Repostería") }, fechadecreacion: new Date() },
  { nombre: "Waffer Nucita x 200g",        descripcion: "Waffer de chocolate y avellana multicapas, crujiente y delicioso.",                           preciounitario: 5500,  categoria: { $ref: "Categorias", $id: getCatId("Panadería y Repostería") }, fechadecreacion: new Date() },

  // ---- BEBIDAS (10 productos) ----
  { nombre: "Gaseosa Coca-Cola x 2L",      descripcion: "Gaseosa cola clásica en botella familiar de 2 litros, bien fría para toda la familia.",       preciounitario: 7900,  categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Agua Cristal x 600ml",        descripcion: "Agua purificada sin gas, fresca y limpia. Ideal para hidratarse en cualquier momento.",       preciounitario: 2200,  categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Jugo Hit Mango x 1L",         descripcion: "Bebida de fruta de mango Hit, sin conservantes artificiales. Refrescante y natural.",         preciounitario: 5500,  categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Cerveza Club Colombia x 330ml",descripcion: "Cerveza premium colombiana de cebada seleccionada, sabor suave y equilibrado.",              preciounitario: 4800,  categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Té Hatsu Verde x 500ml",      descripcion: "Bebida de té verde natural con jengibre, refrescante y baja en calorías.",                    preciounitario: 5200,  categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Gatorade Naranja x 600ml",    descripcion: "Bebida isotónica con electrolitos para rehidratación deportiva y recuperación rápida.",       preciounitario: 5900,  categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Café Juan Valdez Molido x 250g",descripcion: "Café 100% colombiano molido de grano arábigo suave, aroma intenso y sabor equilibrado.",    preciounitario: 24900, categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Jugo Postobón Pony Malta x 330ml",descripcion: "Malta sin alcohol, bebida energética y nutritiva. Rica fuente de vitaminas del complejo B.", preciounitario: 3200, categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Monster Energy x 473ml",      descripcion: "Bebida energizante con cafeína, taurina y vitaminas del complejo B para más energía.",        preciounitario: 8900,  categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },
  { nombre: "Vino Tinto Carta Vieja x 750ml",descripcion: "Vino tinto chileno de uva Cabernet Sauvignon, suave con notas de frutas rojas.",            preciounitario: 32900, categoria: { $ref: "Categorias", $id: getCatId("Bebidas") }, fechadecreacion: new Date() },

  // ---- LIMPIEZA Y HOGAR (8 productos) ----
  { nombre: "Detergente Ariel x 1kg",      descripcion: "Detergente en polvo con tecnología Active Foam, elimina manchas difíciles en lavado a mano.", preciounitario: 15900, categoria: { $ref: "Categorias", $id: getCatId("Limpieza y Hogar") }, fechadecreacion: new Date() },
  { nombre: "Jabón de Lavar Barra Fab x 400g",descripcion: "Jabón de lavar en barra con suavizante floral, eficaz y económico para ropa delicada.",   preciounitario: 5200,  categoria: { $ref: "Categorias", $id: getCatId("Limpieza y Hogar") }, fechadecreacion: new Date() },
  { nombre: "Limpiador Ajax x 1L",         descripcion: "Limpiador multiusos desengrasante con poder antibacterial para pisos y superficies.",         preciounitario: 7800,  categoria: { $ref: "Categorias", $id: getCatId("Limpieza y Hogar") }, fechadecreacion: new Date() },
  { nombre: "Blanqueador Clorox x 1.5L",   descripcion: "Blanqueador con cloro activo, desinfecta y elimina el 99.9% de gérmenes y bacterias.",       preciounitario: 9500,  categoria: { $ref: "Categorias", $id: getCatId("Limpieza y Hogar") }, fechadecreacion: new Date() },
  { nombre: "Suavizante Downy x 800ml",    descripcion: "Suavizante de ropa concentrado con fragancia floral duradera hasta 12 semanas.",              preciounitario: 12800, categoria: { $ref: "Categorias", $id: getCatId("Limpieza y Hogar") }, fechadecreacion: new Date() },
  { nombre: "Limpiavidrios Windex x 500ml",descripcion: "Limpiavidrios en spray de secado rápido sin rayas, para ventanas, espejos y superficies.",   preciounitario: 8200,  categoria: { $ref: "Categorias", $id: getCatId("Limpieza y Hogar") }, fechadecreacion: new Date() },
  { nombre: "Esponja Scotch-Brite x 2 und",descripcion: "Esponja doble cara para lavar platos, con fibra abrasiva y espuma antibacterial.",            preciounitario: 4500,  categoria: { $ref: "Categorias", $id: getCatId("Limpieza y Hogar") }, fechadecreacion: new Date() },
  { nombre: "Bolsas de Basura x 10 und 70L",descripcion: "Bolsas de basura negras resistentes y extra gruesas para canecas domésticas.",              preciounitario: 5900,  categoria: { $ref: "Categorias", $id: getCatId("Limpieza y Hogar") }, fechadecreacion: new Date() },

  // ---- CUIDADO PERSONAL (7 productos) ----
  { nombre: "Shampoo Head & Shoulders x 375ml",descripcion: "Shampoo anticaspa con zinc pyrithione, controla la caspa desde la primera lavada.",      preciounitario: 18900, categoria: { $ref: "Categorias", $id: getCatId("Cuidado Personal") }, fechadecreacion: new Date() },
  { nombre: "Jabón Dove Original x 135g",  descripcion: "Jabón de tocador con 1/4 de crema hidratante, deja la piel suave y nutrida.",                preciounitario: 4800,  categoria: { $ref: "Categorias", $id: getCatId("Cuidado Personal") }, fechadecreacion: new Date() },
  { nombre: "Desodorante Rexona Men x 150ml",descripcion: "Desodorante aerosol con tecnología MotionSense, protección activa por 48 horas.",           preciounitario: 15900, categoria: { $ref: "Categorias", $id: getCatId("Cuidado Personal") }, fechadecreacion: new Date() },
  { nombre: "Crema Dental Colgate x 75ml", descripcion: "Crema dental con flúor, blanqueadora y protectora contra caries y sarro.",                   preciounitario: 6500,  categoria: { $ref: "Categorias", $id: getCatId("Cuidado Personal") }, fechadecreacion: new Date() },
  { nombre: "Papel Higiénico Scott x 12 rollos",descripcion: "Papel higiénico doble hoja, suave y resistente. 200 hojas por rollo.",                  preciounitario: 22900, categoria: { $ref: "Categorias", $id: getCatId("Cuidado Personal") }, fechadecreacion: new Date() },
  { nombre: "Crema Nivea Original x 250ml",descripcion: "Crema hidratante corporal clásica con extracto de almendra, para piel seca y sensible.",     preciounitario: 12500, categoria: { $ref: "Categorias", $id: getCatId("Cuidado Personal") }, fechadecreacion: new Date() },
  { nombre: "Cepillo Dental Oral-B Medio", descripcion: "Cepillo dental de cerdas medianas con mango antideslizante para limpieza profunda.",          preciounitario: 9900,  categoria: { $ref: "Categorias", $id: getCatId("Cuidado Personal") }, fechadecreacion: new Date() },

  // ---- SNACKS Y CONFITERÍA (8 productos) ----
  { nombre: "Papas Margarita x 105g",      descripcion: "Papas fritas clásicas con sal, la marca snack más popular de Colombia.",                     preciounitario: 4900,  categoria: { $ref: "Categorias", $id: getCatId("Snacks y Confitería") }, fechadecreacion: new Date() },
  { nombre: "Chocolate Jet x 150g",        descripcion: "Chocolate de leche colombiano con almendras, suave y cremoso.",                               preciounitario: 7800,  categoria: { $ref: "Categorias", $id: getCatId("Snacks y Confitería") }, fechadecreacion: new Date() },
  { nombre: "Gomitas Trolli x 100g",       descripcion: "Gomitas de frutas surtidas, masticables y con sabores tropicales intensos.",                  preciounitario: 3500,  categoria: { $ref: "Categorias", $id: getCatId("Snacks y Confitería") }, fechadecreacion: new Date() },
  { nombre: "Maní Natuchips x 200g",       descripcion: "Maní tostado con sal, fuente de proteínas vegetales y grasas saludables.",                   preciounitario: 5800,  categoria: { $ref: "Categorias", $id: getCatId("Snacks y Confitería") }, fechadecreacion: new Date() },
  { nombre: "Chitos x 80g",               descripcion: "Palitos de maíz inflados sabor queso, crujientes y deliciosos. El snack favorito.",            preciounitario: 3200,  categoria: { $ref: "Categorias", $id: getCatId("Snacks y Confitería") }, fechadecreacion: new Date() },
  { nombre: "Chocolatina Snickers x 51g",  descripcion: "Barra de caramelo, maní y nougat bañada en chocolate con leche.",                            preciounitario: 4500,  categoria: { $ref: "Categorias", $id: getCatId("Snacks y Confitería") }, fechadecreacion: new Date() },
  { nombre: "Palomitas Pop Secrets x 273g",descripcion: "Palomitas de maíz sabor mantequilla para microondas, listas en 3 minutos.",                   preciounitario: 9200,  categoria: { $ref: "Categorias", $id: getCatId("Snacks y Confitería") }, fechadecreacion: new Date() },
  { nombre: "Caramelos Halls Mentol x 9und",descripcion: "Caramelos mentolados refrescantes que alivian la irritación de garganta.",                  preciounitario: 1800,  categoria: { $ref: "Categorias", $id: getCatId("Snacks y Confitería") }, fechadecreacion: new Date() },

  // ---- CONGELADOS (7 productos) ----
  { nombre: "Pizza Personal McCain x 180g",descripcion: "Pizza congelada personal de pepperoni y queso, lista en 15 minutos al horno.",                preciounitario: 8900,  categoria: { $ref: "Categorias", $id: getCatId("Congelados") }, fechadecreacion: new Date() },
  { nombre: "Papas Congeladas McCain x 1kg",descripcion: "Papas a la francesa congeladas precocidas, crujientes y doradas en freidora u horno.",      preciounitario: 14500, categoria: { $ref: "Categorias", $id: getCatId("Congelados") }, fechadecreacion: new Date() },
  { nombre: "Camarones Grandes x 500g",    descripcion: "Camarones pelados congelados IQF, listos para cocinar en diversas preparaciones.",            preciounitario: 28900, categoria: { $ref: "Categorias", $id: getCatId("Congelados") }, fechadecreacion: new Date() },
  { nombre: "Nuggets de Pollo x 400g",     descripcion: "Nuggets de pechuga de pollo empanizados, crujientes por fuera y jugosos por dentro.",        preciounitario: 15900, categoria: { $ref: "Categorias", $id: getCatId("Congelados") }, fechadecreacion: new Date() },
  { nombre: "Helado Crem Helado Vainilla x 1L",descripcion: "Helado de vainilla cremoso con sabor natural, ideal para postres y meriendas.",           preciounitario: 18500, categoria: { $ref: "Categorias", $id: getCatId("Congelados") }, fechadecreacion: new Date() },
  { nombre: "Empanadas de Pipian x 6 und", descripcion: "Empanadas colombianas de pipián congeladas, listas para freír o al horno.",                  preciounitario: 9800,  categoria: { $ref: "Categorias", $id: getCatId("Congelados") }, fechadecreacion: new Date() },
  { nombre: "Lasaña de Carne Findus x 400g",descripcion: "Lasaña congelada con carne molida, salsa boloñesa y bechamel. Microondas en 8 minutos.",    preciounitario: 19900, categoria: { $ref: "Categorias", $id: getCatId("Congelados") }, fechadecreacion: new Date() }
];

db.Productos.insertMany(productos);
print("✅ " + db.Productos.countDocuments() + " productos insertados.");

// ============================================================
// 3. INSERTAR INVENTARIO para cada producto
// ============================================================
print("📦 Generando inventario para cada producto...");

const productosInsertados = db.Productos.find().toArray();
const almacenes = ["A", "B", "C"];
const pasillos  = ["P1", "P2", "P3", "P4", "P5"];

const inventarios = productosInsertados.map((prod, i) => {
  const stockActual  = Math.floor(Math.random() * 180) + 20;   // 20-200
  const stockMinimo  = Math.floor(Math.random() * 10)  + 5;    // 5-15

  return {
    producto:  { $ref: "Productos",   $id: prod._id },
    categoria: { $ref: "Categorias",  $id: prod.categoria.$id },
    stockActual:  stockActual,
    stockMinimo:  stockMinimo,
    almacen: almacenes[i % almacenes.length],
    pasillo:  pasillos[i  % pasillos.length],
    movimientos: [
      {
        fechaMovimiento:  new Date(),
        tipoMovimiento:   "ENTRADA",
        cantidad:         stockActual,
        motivo:           "Carga inicial de inventario",
        usuarioId:        "SEED_ADMIN",
        ventaId:          null,
        compraId:         null,
        stockAnterior:    0,
        stockNuevo:       stockActual
      }
    ],
    fechaUltimaActualizacion: new Date(),
    activo: true
  };
});

db.Inventario.insertMany(inventarios);
print("✅ " + db.Inventario.countDocuments() + " registros de inventario insertados.");

// ============================================================
// RESUMEN FINAL
// ============================================================
print("\n========================================");
print("🎉 SEED COMPLETADO EXITOSAMENTE");
print("========================================");
print("📂 Categorías: " + db.Categorias.countDocuments());
print("🛒 Productos:  " + db.Productos.countDocuments());
print("📦 Inventario: " + db.Inventario.countDocuments());
print("========================================\n");
