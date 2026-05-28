/**
 * Plat — Global Application Logic Controller
 * Handles CRUD operations, WebGL backgrounds, Authentication states, GSAP animations, 
 * and responsive interaction triggers.
 */

// Global registration of ScrollTrigger for GSAP animation pipelines
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// Global state variables
const STORAGE_RECIPES_KEY = 'plat_recipe_records_v3';
const STORAGE_USER_KEY = 'plat_current_user_v3';

const CATEGORY_IMAGES = {
  Breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=75',
  Lunch: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=75',
  Dinner: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=75',
  Dessert: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=75',
  Snack: 'https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=600&q=75',
  Drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=75'
};

const CATEGORY_EMOJIS = {
  Breakfast: '🍳',
  Lunch: '🥗',
  Dinner: '🍽️',
  Dessert: '🍰',
  Snack: '🥨',
  Drinks: '🥤'
};

// Seeding Default Recipes
const DEFAULT_RECIPES = [
  {
    id: 'r_seed_1',
    title: 'Spaghetti Carbonara',
    category: 'Dinner',
    prep: '15 min',
    cook: '20 min',
    servings: '4',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=600&q=75',
    description: 'A Roman classic — crispy guanciale, eggs, Pecorino Romano and freshly cracked black pepper.',
    ingredients: ['400g high-quality spaghetti', '150g pork guanciale, diced', '4 fresh farm egg yolks', '100g Pecorino Romano, grated', 'Black pepper corns', 'Salt'],
    steps: ['Boil large pot of water, add rock salt, and lower spaghetti to boil al dente.', 'Sauté guanciale on low heat until fat renders and bits turn beautifully golden and crispy.', 'Whisk egg yolks together with grated Pecorino Romano and cracked black pepper until thick paste forms.', 'Drain cooked pasta, keeping half a cup of starchy water.', 'Combine pasta with crispy guanciale off-heat. Quickly stir in egg paste, tossing vigorously to form emulsified creamy sauce. Add pasta water as needed.'],
    createdAt: Date.now() - 172800000
  },
  {
    id: 'r_seed_2',
    title: 'Lemon Blueberry Pancakes',
    category: 'Breakfast',
    prep: '10 min',
    cook: '15 min',
    servings: '2',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=75',
    description: 'Fluffy golden pancakes filled with fresh whole blueberries and fragrant lemon zest sweeps.',
    ingredients: ['1 cup all-purpose flour', '2 tbsp organic sugar', '1 tsp baking powder', '1 cup buttermilk', '1 organic egg', '1 cup organic blueberries', '2 tsp lemon zest'],
    steps: ['Whisk flour, sugar, baking powder, and pinch of salt in standard mixing bowl.', 'Fold in buttermilk, lightly beaten egg, and lemon zest. Do not overmix batter.', 'Heat skillet with butter, ladle batter portions, scatter fresh blueberries on top.', 'Cook until surface starts bubbles, flip and roast 2 minutes until perfectly fluffy.'],
    createdAt: Date.now() - 86400000
  },
  {
    id: 'r_seed_3',
    title: 'Mango Coconut Smoothie',
    category: 'Drinks',
    prep: '5 min',
    cook: '0 min',
    servings: '1',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=75',
    description: 'A tropical cooling bliss — combines frozen mango chunks, thick coconut cream and ginger spikes.',
    ingredients: ['1 cup organic frozen mango', '1/2 cup organic coconut milk', '1/2 cup cold pressed orange juice', '1 tsp shaved ginger root', '1 tbsp raw honey'],
    steps: ['Place all ingredients into high-speed blender canister.', 'Blend for 60 seconds until completely thick and smooth.', 'Garnish with toasted code flakes and serve ice cold.'],
    createdAt: Date.now() - 3600000
  },
  {
    id: 'r_seed_4',
    title: 'Butter Chicken (Murgh Makhani)',
    category: 'Dinner',
    prep: '20 min',
    cook: '30 min',
    servings: '4',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=75',
    description: 'An iconic North Indian masterpiece—tender marinated chicken pieces simmered in a velvet-smooth, spiced tomato, butter, and cream gravy.',
    ingredients: ['800g boneless chicken thighs, cubed', '1 cup Greek yogurt', '2 tbsp ginger-garlic paste', '2 tbsp Garam Masala', '1 tbsp Kashmiri red chili powder', '1 cup tomato purée', '100g unsalted butter', '1/2 cup heavy cream', 'Fresh cilantro for garnish'],
    steps: ['Marinate chicken cubes with yogurt, ginger-garlic paste, lemon juice, garam masala, and Kashmiri chili powder for 1 hour.', 'Grill or pan-fry the marinated chicken until perfectly cooked and slightly charred on the edges. Set aside.', 'In a deep pan, melt half the butter and sauté the remaining ginger-garlic paste. Add tomato purée and simmer on medium heat for 10 minutes.', 'Stir in the heavy cream, garam masala, and remaining butter to create a silky, glossy gravy.', 'Add the chicken to the gravy and simmer gently for 5-8 minutes. Garnish generously with fresh cilantro.'],
    createdAt: Date.now() - 1200000
  },
  {
    id: 'r_seed_5',
    title: 'Tandoori Paneer Tikka',
    category: 'Snack',
    prep: '15 min',
    cook: '15 min',
    servings: '3',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=75',
    description: 'Marinated cottage cheese skewers grilled with crisp bell peppers, onions, and traditional yogurt tandoori spices.',
    ingredients: ['400g Paneer (cottage cheese), cubed', '1 large yellow bell pepper, squared', '1 large red onion, squared', '1/2 cup thick hung curd', '1 tbsp lemon juice', '2 tsp tandoori masala', '1 tsp chaat masala', 'Skewers'],
    steps: ['Whisk hung curd, lemon juice, tandoori masala, a splash of mustard oil, and salt in a large bowl.', 'Gently fold in the paneer cubes, onion squares, and bell pepper squares. Let marinate for 30 minutes.', 'Thread the marinated paneer, onions, and peppers alternately onto wooden skewers.', 'Preheat a heavy skillet or oven to 200°C and grill for 12-15 minutes, turning occasionally, until golden-brown and smoky.', 'Sprinkle with chaat masala and fresh key-lime squeeze before serving hot.'],
    createdAt: Date.now() - 600000
  },
  {
    id: 'r_seed_6',
    title: 'Crispy Masala Dosa',
    category: 'Breakfast',
    prep: '20 min',
    cook: '15 min',
    servings: '4',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=75',
    description: 'A classic golden-and-crispy South Indian fermented rice-lentil crepe stuffed with savory bhaji (spiced mashed potato filling).',
    ingredients: ['3 cups parboiled rice', '1 cup split black gram (urad dal)', '4 large potatoes, boiled and mashed', '1 medium onion, sliced', '1 tsp mustard seeds', '1/2 tsp turmeric powder', '2 green chilies, chopped', 'Ghee or oil for roasting', 'Salt'],
    steps: ['Grind soaked rice and dal separately into a smooth batter, then ferment in a warm place overnight.', 'To make potato filling, heat oil, splutter mustard seeds, sauté onions, green chilies, and curry leaves.', 'Add turmeric, salt, and mashed potatoes. Stir well, splash of water, simmer for 5 minutes.', 'Heat a non-stick tawa griddle, pour a ladle of batter, and spiral swirl outward to form a thin circular crepe.', 'Drizzle ghee along the edges, roast until crispy golden-brown, scoop potatoes in center, fold and serve.'],
    createdAt: Date.now() - 300000
  },
  {
    id: 'r_seed_7',
    title: 'Greek Avocado Salad',
    category: 'Lunch',
    prep: '10 min',
    cook: '0 min',
    servings: '2',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=75',
    description: 'A crisp, refreshing Mediterranean salad packed with creamy avocado, vine-ripened tomatoes, cucumbers, Kalamata olives, and rich feta cheese drizzled with wild oregano-infused olive oil.',
    ingredients: ['2 ripe avocados, cubed', '200g cherry tomatoes, halved', '1 English cucumber, sliced', '100g Kalamata olives', '150g block Greek feta cheese, crumbled', '3 tbsp cold-pressed extra virgin olive oil', '1 tbsp lemon juice', '1 tsp dried wild oregano', 'Sea salt & cracked black pepper'],
    steps: ['Whisk extra virgin olive oil, fresh lemon juice, wild oregano, salt, and black pepper in a small bowl to emulsify.', 'Combine cubed avocados, halved cherry tomatoes, sliced cucumbers, and Kalamata olives in a large wooden salad bowl.', 'Drizzle the dressing over the ingredients and toss gently so the avocado stays intact.', 'Transfer to serving plates and crumble fresh Greek feta cheese generously over the top.', 'Finish with a final dust of black pepper and serve immediately with warm crusty pita bread.'],
    createdAt: Date.now() - 290000
  },
  {
    id: 'r_seed_9',
    title: 'Matcha Green Tea Mochi',
    category: 'Dessert',
    prep: '25 min',
    cook: '10 min',
    servings: '6',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=75',
    description: 'Delicate, sweet, and chewy Japanese mochi rice cakes infused with premium culinary matcha green tea powder and filled with sweet red bean paste.',
    ingredients: ['1 cup sweet glutinous rice flour (mochiko)', '1 tbsp premium culinary matcha powder', '1/4 cup sugar', '1 cup organic coconut water', '1/2 cup sweet red bean paste (anko)', 'Cornstarch for dusting'],
    steps: ['Divide the sweet red bean paste into 6 equal portions and roll them into small solid balls. Freeze for 10 minutes to firm up.', 'Whisk glutinous rice flour, matcha powder, and sugar in a microwave-safe glass bowl until combined.', 'Gradually pour in organic coconut water and whisk until a smooth, thin green batter forms.', 'Cover the bowl loosely with plastic wrap. Microwave on high for 2 minutes, stir vigorously with a wet spatula, then microwave for another 1 minute until translucent and sticky.', 'Dust a clean work surface generously with cornstarch. Roll the hot mochi dough out, divide into 6 flat circles, place a red bean portion in the center, pinch the edges to seal, and cool before serving.'],
    createdAt: Date.now() - 270000
  },
  {
    id: 'r_seed_10',
    title: 'Classic Eggs Benedict',
    category: 'Breakfast',
    prep: '10 min',
    cook: '15 min',
    servings: '2',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=75',
    description: 'Poached free-range eggs and crisp Canadian back bacon served over butter-toasted English muffins, topped with a velvety, rich lemon-chervil Hollandaise sauce.',
    ingredients: ['4 free-range eggs (for poaching)', '2 fresh egg yolks (for sauce)', '1 tbsp lemon juice', '100g unsalted butter, melted and hot', '2 English muffins, split', '4 slices Canadian bacon', '1 tbsp white vinegar', 'Chives for garnish'],
    steps: ['To make Hollandaise, blend 2 egg yolks and lemon juice until smooth. With blender running, drizzle in hot melted butter in a thin stream until thick and creamy.', 'Sear the Canadian bacon slices in a hot skillet for 2 minutes on each side until slightly crisp; set aside.', 'Bring a pan of water to a gentle simmer, add white vinegar, create a soft whirlpool, and crack eggs in to poach for exactly 3 minutes.', 'Split and toast the English muffins, then butter them generously.', 'Assemble by layering a muffin half, a bacon slice, a poached egg, and ladling the warm silky Hollandaise sauce over. Garnish with chopped fresh chives.'],
    createdAt: Date.now() - 260000
  },
  {
    id: 'r_seed_15',
    title: 'Royal Smoked Dal Bukhara',
    category: 'Lunch',
    prep: '15 min',
    cook: '4 hours',
    servings: '4',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=75',
    description: 'A legendary 5-star delicacy of premium urad dal slow-cooked over white-hot coal embers for 18 hours, infused with double-churned white butter and silk cream.',
    ingredients: ['2 cups whole black lentils (urad dal)', '1/2 cup split kidney beans (rajma)', '2 tbsp ginger-garlic paste', '1.5 cups tomato purée', '150g hand-churned salted butter', '1/2 cup organic double cream', '1 tsp Kashmiri red chili powder', 'Coal piece (for charcoal smoking)', 'Cream & ginger juliennes for garnish'],
    steps: ['Soak black lentils and rajma overnight, then pressure cook with ginger-garlic paste, salt, and water until completely tender.', 'Simmer cooked lentils on slow heat for hours while continuously mashing to release natural starches.', 'In a separate skillet, sauté tomato purée and chili powder in butter, then blend directly into the simmering lentils.', 'Incorporate more butter and double cream, cooking until rich, dark, and velvety.', 'Singe a piece of natural charcoal, place in a small cup over the dal, drizzle ghee to release aromatic smoke, cap the pot with a dense lid for 5 minutes, then garnish with cream and serve.'],
    createdAt: Date.now() - 250000
  },
  {
    id: 'r_seed_16',
    title: 'Saffron Infused Galouti Kebab',
    category: 'Snack',
    prep: '25 min',
    cook: '15 min',
    servings: '4',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=75',
    description: 'Mouth-melting minced lamb croquettes infused with Lucknowi potli masala, raw papaya paste, and liquid saffron, seared to ultimate tender gold.',
    ingredients: ['500g fine minced lamb thigh', '2 tbsp raw papaya paste', '1 tbsp ginger-garlic-chili paste', '2 tbsp roasted gram flour (sattu)', '1/4 tsp saffron strands steeped in warm rosewater', '1 tsp royal kebab spice mix (potli masala)', 'Ghee for shallow frying', 'Mint chutney and red onion rings'],
    steps: ['Combine minced lamb thigh with raw papaya paste and cover for 2 hours to break down collagen and achieve a melt-in-mouth texture.', 'Mix with roasted gram flour, ginger-garlic paste, saffron rosewater, and Lucknowi kebab spice mix.', 'Whip the meat paste vigorously with the palm of your hand until airy, cohesive, and paste-like.', 'Divide into round delicate patties, refrigerate for 20 minutes to firm up.', 'Heat premium ghee in a flat iron tawa, dust patties slightly, and shallow fry carefully until a delicate brown crust forms while interior remains creamy.'],
    createdAt: Date.now() - 200000
  },
  {
    id: 'r_seed_17',
    title: 'Awadhi Dum Gosht Biryani',
    category: 'Dinner',
    prep: '35 min',
    cook: '50 min',
    servings: '4',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=75',
    description: 'The pinnacle of Royal Mughlai fine-dining. Select lamb shanks marinated in vetiver-infused yogurt, layered with aged basmati rice, steamed under dough-sealed Dum.',
    ingredients: ['1kg premium aged Basmati rice', '750g tender spring lamb chops and shanks', '1 cup premium barista fried golden onions', '1 cup full-fat hung curd (yogurt)', '1/2 tsp Kashmiri saffron bloomed in warm cow milk', '2 tbsp premium cow ghee', 'Royal whole spices (cloves, cardamom, mace)', 'Rosewater & Screwpine (kewra) essence'],
    steps: ['Marinate lamb shanks in yogurt, raw papaya paste, royal spices, ginger-garlic, and half the barista onions for 4 hours.', 'Parboil aged basmati rice in heavily salted water with cloves, cardamom, and bay leaf until 70% cooked.', 'In a handi pot, layer marinated lamb at bottom, cover with a blanket of fragrant rice, drizzle ghee, saffron milk, boiled rosewater, and fried onions.', 'Place airtight lid sealed with fresh flour dough around the rim to create high pressure steam (Dum style).', 'Simmer on heavy tawa on low heat for 45 minutes, rest for 10 minutes, crack open the hot dough seal, and serve.'],
    createdAt: Date.now() - 150000
  },
  {
    id: 'r_seed_18',
    title: 'Zafrani Shahi Tukda Gold Decadence',
    category: 'Dessert',
    prep: '15 min',
    cook: '25 min',
    servings: '4',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=75',
    description: 'A magnificent imperial bread dessert featuring ghee-fried brioche steeped in cardamom elixir, coated with thick, slow-reduced saffron rabri, and finished with edible 24k silver/gold leaf.',
    ingredients: ['4 thick slices of artisan brioche bread', '1 cup pure cow ghee for frying', '1.5 liters full-cream organic milk', '1/2 cup organic sugar', '1/2 tsp saffron stamens', '1/4 tsp green cardamom powder', 'Edible 24K silver or gold leaves (Varq)', 'Toasted almonds and pistachios'],
    steps: ['Reduce the full-cream milk in a wide iron kadhai by 70%, stirring constantly until thick cream flecks (rabri) form. Sweeten with sugar and saffron.', 'Prepare a light sugar syrup scented with cardamom powder, boiling for 8 minutes to a thin string consistency.', 'Trim crusts from brioche slices and cut diagonally into triangles. Fry in hot ghee until crisp, crunchy, and deep golden.', 'Immerse the crispy fried brioche toasts immediately into the warm cardamon-sugar syrup for 10 seconds to glaze.', 'Arrange glazed brioche on a platter, ladle the dense chilled saffron rabri generously over, and garnish with sliced pistachios, slivered almonds, and genuine edible silver leaf.'],
    createdAt: Date.now() - 100000
  },
  {
    id: 'r_seed_11',
    title: 'Classic Shoyu Ramen',
    category: 'Dinner',
    prep: '20 min',
    cook: '25 min',
    servings: '2',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=75',
    description: 'Comfort in a bowl featuring springy noodles in a rich, savory soy-sauce infused dashi broth, topped with tender chashu, soft-boiled ajitama egg, and bamboo shoots.',
    ingredients: ['2 portions fresh ramen noodles', '4 cups chicken and dashi broth', '4 tbsp Shoyu seasoning paste (soy sauce, mirin, sake)', '4 slices chashu pork or braised chicken', '2 soft-boiled marinated eggs (ajitama)', '1/2 cup green onions, sliced', 'Nori seaweed sheets'],
    steps: ['Bring dashi and chicken broth to a gentle simmer in a large soup pot.', 'Stir the shoyu seasoning paste into the serving bowls to create the aromatic base.', 'Boil the fresh ramen noodles separately for 2 minutes or according to instructions.', 'Drain noodles and place them neatly into the bowls with the hot broth.', 'Top with slices of chashu, a halved marinated egg, sliced green onions, and a sheet of nori.'],
    createdAt: Date.now() - 50000
  },
  {
    id: 'r_seed_12',
    title: 'Crispy Chicken Katsu Curry',
    category: 'Lunch',
    prep: '20 min',
    cook: '20 min',
    servings: '3',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=75',
    description: 'A crispy, golden, deep-fried panko-breaded chicken cutlet served alongside a thick, comforting, and mildly sweet Japanese curry gravy over steaming rice.',
    ingredients: ['3 chicken breasts, pounded flat', '1 cup panko breadcrumbs', '1/2 cup all-purpose flour', '2 beaten eggs', '1 block Japanese curry roux', '1 cup potatoes and carrots, cubed', '1 onion, sliced', 'Steamed sushi rice'],
    steps: ['Coat chicken breasts in flour, dip in beaten eggs, then press firmly into panko crumbs.', 'Deep-fry the coated chicken cutlets until deep golden-brown and crispy. Slice into strips.', 'Sauté sliced onions, carrots, and potatoes in a saucepan with oil until soft.', 'Add water, simmer for 10 minutes until veggies are tender, then melt in the curry roux blocks.', 'Pour the hot, thick curry sauce generously over a plate of rice and top with the crispy chicken katsu slices.'],
    createdAt: Date.now() - 40000
  },
  {
    id: 'r_seed_13',
    title: 'Authentic Pad Thai',
    category: 'Dinner',
    prep: '15 min',
    cook: '15 min',
    servings: '2',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=75',
    description: 'The quintessential Thai streets delicacy of stir-fried flat rice noodles cooked with tofu, shrimp, egg, bean sprouts, peanuts, and a sweet-tangy tamarind sauce.',
    ingredients: ['200g flat rice noodles, soaked in warm water', '100g firm tofu, cubed', '100g fresh shrimp, peeled', '1/3 cup authentic tamarind paste', '3 tbsp palm sugar', '2 tbsp fish sauce', '2 beaten eggs', '1/2 cup bean sprouts', '3 tbsp crushed roasted peanuts', 'Lime wedges and chives'],
    steps: ['Prepare the sauce by cooking tamarind paste, palm sugar, and fish sauce together until dissolved.', 'Heat a wok with oil, sauté the tofu cubes and shrimp until shrimp are pink and cooked through.', 'Push to the side, scramble the eggs in the wok, then toss in the drained rice noodles.', 'Pour in the tamarind sauce, mix thoroughly, then fold in bean sprouts and garlic chives.', 'Plate warm topped with roasted crushed peanuts, red pepper flakes, and fresh lime wedges to squeeze.'],
    createdAt: Date.now() - 30000
  },
  {
    id: 'r_seed_14',
    title: 'Fragrant Thai Green Curry',
    category: 'Lunch',
    prep: '15 min',
    cook: '20 min',
    servings: '3',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=75',
    description: 'An intensely aromatic curry bursting with fresh green herbs, featuring lemongrass, galangal, kaffir lime leaves, tender chicken breast, and Thai baby eggplants.',
    ingredients: ['500g chicken breast, sliced', '3 tbsp green curry paste', '1 can unsweetened coconut milk', '4 Thai eggplants, quartered', '1 cup bamboo shoots', '6 kaffir lime leaves, torn', '1 tbsp fish sauce', '1 tbsp palm sugar', '1/2 cup fresh Thai sweet basil leaves'],
    steps: ['Sauté the green curry paste in a deep pot with a coconut oil glaze until aromatic.', 'Gradually pour in half the coconut milk and simmer until oil separates from the cream.', 'Add chicken slices and stir-fry for 3 minutes, then add the rest of the coconut milk and water.', 'Stir in the Thai eggplants, bamboo shoots, kaffir lime leaves, palm sugar, and fish sauce.', 'Simmer for 10 minutes until veggies are cooked through. Turn off heat and stir in fresh sweet basil leaves.'],
    createdAt: Date.now() - 20000
  }
];

// ── DATA UTILITY MANAGERS ──
let cachedRecipes = [];

// Initialize local cache synchronously from localStorage to ensure instant rendering
try {
  const localRec = localStorage.getItem(STORAGE_RECIPES_KEY);
  if (localRec) {
    let parsed = JSON.parse(localRec);
    const oldIds = [];
    const originLength = parsed.length;
    parsed = parsed.filter(r => !oldIds.includes(r.id));
    let updated = parsed.length !== originLength;

    const parsedIds = new Set(parsed.map(r => r.id));
    DEFAULT_RECIPES.forEach(seed => {
      if (!parsedIds.has(seed.id)) {
        parsed.push(seed);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(STORAGE_RECIPES_KEY, JSON.stringify(parsed));
    }
    cachedRecipes = parsed;
  } else {
    cachedRecipes = [...DEFAULT_RECIPES];
    localStorage.setItem(STORAGE_RECIPES_KEY, JSON.stringify(DEFAULT_RECIPES));
  }
} catch {
  cachedRecipes = [...DEFAULT_RECIPES];
}



const loadRecipes = () => cachedRecipes;
const saveRecipes = (data) => {
  if (Array.isArray(data)) {
    data = data.map(r => ({
      ...r,
      createdAt: Number(r.createdAt || r.created_at || Date.now()),
      updatedAt: Number(r.updatedAt || r.updated_at || Date.now())
    }));
  }
  cachedRecipes = data;
  try {
    localStorage.setItem(STORAGE_RECIPES_KEY, JSON.stringify(data));
  } catch {}
};

const STORAGE_FAVORITES_KEY = 'plat_recipe_favorites_v3';

window.loadFavorites = function() {
  try {
    const favs = localStorage.getItem(STORAGE_FAVORITES_KEY);
    return favs ? JSON.parse(favs) : [];
  } catch (e) {
    return [];
  }
};

window.saveFavorites = function(favs) {
  try {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favs));
  } catch (e) {}
};

window.isFavorite = function(id) {
  const favs = window.loadFavorites();
  return favs.includes(id);
};

window.toggleFavorite = function(id, event) {
  if (event) {
    event.stopPropagation();
  }
  let favs = window.loadFavorites();
  let added = false;
  if (favs.includes(id)) {
    favs = favs.filter(fId => fId !== id);
    toast('Removed from favorites', 'ok');
  } else {
    favs.push(id);
    added = true;
    toast('Added to favorites', 'ok');
  }
  window.saveFavorites(favs);

  // Update favorite button in the detail modal if present
  const modalFavBtn = document.querySelector('.det-hero .fav-btn');
  if (modalFavBtn) {
    if (added) {
      modalFavBtn.classList.add('is-fav');
    } else {
      modalFavBtn.classList.remove('is-fav');
    }
  }

  window.renderAll();
};




// Async Database Syncer to sync with PHPDB scripts!
async function syncDatabaseWithBackend() {
  // Sync Recipes
  try {
    const res = await fetch('recipes.php');
    if (res.ok) {
      const dbRecipes = await res.json();
      if (Array.isArray(dbRecipes)) {
        saveRecipes(dbRecipes);
        renderAll();
        updatePlatformStatistics();
      }
    }
  } catch (err) {
    console.warn("Recipes DB sync deferred (using client cache):", err);
  }
}

// Trigger initial sync in background immediately
setTimeout(syncDatabaseWithBackend, 150);

const getCurrentUser = () => {
  try {
    const val = localStorage.getItem('plat_session') || localStorage.getItem(STORAGE_USER_KEY);
    if (val) {
      const u = JSON.parse(val);
      if (u) {
        if (!u.name && u.fullname) u.name = u.fullname;
        if (!u.fullname && u.name) u.fullname = u.name;
        if (!u.subscription && u.plan) u.subscription = u.plan === 'premium' ? 'Enterprise' : (u.plan === 'pro' ? 'Pro' : 'Free');
        if (!u.plan && u.subscription) u.plan = u.subscription === 'Enterprise' ? 'premium' : (u.subscription === 'Pro' ? 'pro' : 'free');
        if (!u.email && u.username) u.email = u.username;
        return u;
      }
    }
  } catch {}
  return null;
};

const saveCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    localStorage.setItem('plat_session', JSON.stringify({
      email: user.email,
      fullname: user.name || user.fullname || 'Chef Guest',
      plan: user.plan || (user.subscription === 'Enterprise' ? 'premium' : (user.subscription === 'Pro' ? 'pro' : 'free'))
    }));
  } else {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem('plat_session');
  }
};

// ── INITIALIZING EVENT TRIGGERS ──
let recipeIngredients = [];
let recipeSteps = [];
let recipeFormValidationTriggered = false;
let activeEditRecipeId = null;
let activeDeleteTargetId = null; // Holds recipe ID

let currentAuthMode = 'signin'; // 'signin' or 'signup'
let glProgramInstance = null;
let glAnimationId = null;

// Initialize on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  // Setup Hero Timelines & ScrollAnimations if libraries are active
  initHeroGSAPTimeline();
  
  // Activate Card hover 3D tilt
  initGlowCursorTracking();
  
  // Inject Social Icons as requested
  injectSocialIcons();
  
  // Update state displays and load datasets
  syncUserAuthUI();
  renderAll();
  updatePlatformStatistics();

  // Initialize interactive input form validation engine
  initRecipeFormValidation();

  // Attach navbar smooth scrolling
  document.getElementById('btn-browse-hero')?.addEventListener('click', () => {
    document.getElementById('app-shell')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('btn-enter-shell')?.addEventListener('click', () => {
    document.getElementById('app-shell')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── HERO GSAP TIMELINE ──
function initHeroGSAPTimeline() {
  if (!window.gsap || !document.getElementById('hero')) return;

  const intro = gsap.timeline({ delay: 0.15 });
  intro
    .to('#hero-tag', { duration: 1.0, opacity: 1, y: 0, ease: 'expo.out' })
    .to('#hero-line1', { duration: 1.5, opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', ease: 'expo.out' }, '-=0.7')
    .to('#hero-line2', { duration: 1.2, clipPath: 'inset(0 0% 0 0)', ease: 'power4.inOut' }, '-=0.9')
    .to('#hero-sub', { duration: 0.8, opacity: 1, y: 0, ease: 'expo.out' }, '-=0.5')
    .to('#hero-cta', { duration: 0.6, opacity: 1, y: 0, ease: 'expo.out' }, '-=0.4');

  // Interactive Scroll animation sequence pin
  const scrollPin = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=4500',
      pin: true,
      scrub: 1.1,
      anticipatePin: 1
    }
  });

  scrollPin
    .to(['#hero-text', '.bg-grid'], { scale: 1.08, filter: 'blur(16px)', opacity: 0.1, duration: 2 }, 0)
    .to('#cin-card', { y: 0, ease: 'power3.inOut', duration: 2.2 }, 0)
    .to('#cin-card', { width: '100%', height: '100%', borderRadius: '0px', ease: 'power3.inOut', duration: 1.5 })
    .fromTo('#cl-center', 
      { y: 180, z: -300, rotationX: 40, rotationY: -20, opacity: 0, scale: 0.7 }, 
      { y: 0, z: 0, rotationX: 0, rotationY: 0, opacity: 1, scale: 1, ease: 'expo.out', duration: 2.5 }, 
      '-=0.8'
    )
    .to('#ph-hdr', { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.2)' }, '-=1.4')
    .to('#ph-ft', { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.2)' }, '-=1.1')
    .to('#ph-lst', { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.1)' }, '-=0.9')
    .to(['#fb1', '#fb2'], { opacity: 1, scale: 1, stagger: 0.15, ease: 'back.out(1.5)', duration: 1.2 }, '-=1.5')
    .to('#cl-left', { opacity: 1, x: 0, ease: 'power4.out', duration: 1.3 }, '-=1.3')
    .to('#cl-right', { opacity: 1, x: 0, ease: 'expo.out', duration: 1.3 }, '<')
    .to({}, { duration: 2.0 }) // Buffer pause
    .set('#hero-text', { opacity: 0 })
    .set('#cta-overlay', { opacity: 1, pointerEvents: 'auto' })
    .to({}, { duration: 1.2 })
    .to(['#cl-center', '#cl-left', '#cl-right', '#fb1', '#fb2'], { scale: 0.85, y: -40, opacity: 0, ease: 'power3.in', duration: 1.1, stagger: 0.05 })
    .to('#cin-card', { width: '86vw', height: '84vh', borderRadius: '32px', ease: 'expo.inOut', duration: 1.6 }, 'ex')
    .to('#cin-card', { y: -(window.innerHeight + 400), ease: 'power3.in', duration: 1.2 });
}

// ── PERSISTENT GLOW & MOTION TRIGGERS ──
function initGlowCursorTracking() {
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('[data-glow]').forEach((elem) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      elem.style.setProperty('--mx', `${x}px`);
      elem.style.setProperty('--my', `${y}px`);
    });
  });
}

// Tilt effect for card mockup inside hero viewport
window.cardMouse = function(e) {
  const card = document.getElementById('cin-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const xUniform = e.clientX - rect.left;
  const yUniform = e.clientY - rect.top;
  card.style.setProperty('--mx', `${xUniform}px`);
  card.style.setProperty('--my', `${yUniform}px`);

  const bezel = document.getElementById('phone-bezel');
  if (bezel) {
    const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
    window.gsap && gsap.to(bezel, { rotationY: normalizedX * 14, rotationX: -normalizedY * 14, ease: 'power2.out', duration: 0.8 });
  }
};

window.scrollToTop = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── SOCIALS ICON COMPONENT INJECTION ──
function injectSocialIcons() {
  const target = document.getElementById('socials-placement');
  if (!target) return;

  const socials = [
    {
      name: "GitHub Developer profile",
      href: "https://github.com/Xdzy-TD",
      colorClass: "#E8632A",
      iconSvg: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`
    },
    {
      name: "X Designer handle",
      href: "https://x.com/XdzynN777",
      colorClass: "#E8632A",
      iconSvg: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    {
      name: "LinkedIn connect",
      href: "https://linkedin.com/tushar-das-xdzynn",
      colorClass: "#E8632A",
      iconSvg: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75  1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
    }
  ];

  target.innerHTML = `
    <div class="socials-list-grid">
      ${socials.map(soc => `
        <a href="${soc.href}" target="_blank" rel="noopener noreferrer" class="social-button-card" aria-label="${soc.name}">
          ${soc.iconSvg}
          <div class="socials-card-tooltip">${soc.name}</div>
        </a>
      `).join('')}
    </div>
  `;
}

// ── SYSTEM STATE & USER AUTHENTICATION CONTROLLER ──
function syncUserAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('btn-nav-login');
  const logoutBtn = document.getElementById('btn-nav-logout');
  const profileBadge = document.getElementById('user-profile-badge');

  if (user) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (profileBadge) {
      profileBadge.classList.remove('hidden');
      
      // Sync names and features
      const nameElem = document.getElementById('shell-user-name');
      if (nameElem) {
        nameElem.textContent = user.name || user.email.split('@')[0];
      }
      const roleText = 'Culinary Creator';
      const roleElem = document.getElementById('shell-user-role');
      if (roleElem) {
        roleElem.textContent = roleText;
        roleElem.className = 'user-role-badge';
      }

      // Initials representation
      const initials = (user.name || 'GC').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const initialsElem = document.getElementById('shell-user-initials');
      if (initialsElem) {
        initialsElem.textContent = initials;
      }
      const avatarElem = document.getElementById('ph-user-avatar');
      if (avatarElem) {
        avatarElem.textContent = initials;
      }
    }
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (profileBadge) profileBadge.classList.add('hidden');
    const avatarElem = document.getElementById('ph-user-avatar');
    if (avatarElem) {
      avatarElem.textContent = 'GC';
    }
  }
  
  updatePlatformStatistics();
}

window.openAboutModal = function() {
  om('ov-about');
};

// ── NAVIGATION CONTROLLER (TABS VIEWPORT SELECTION) ──
let currentActiveTab = 'recipes';
window.switchToTab = function(tabName) {
  currentActiveTab = 'recipes';
  const tabs = ['recipes'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`tab-btn-${tab}`) || document.getElementById(`tab-${tab}-btn`);
    const panel = document.getElementById(`panel-${tab}`) || document.getElementById(`tab-${tab}-content`);
    btn?.classList.add('active');
    panel?.classList.add('active');
  });

  // Dynamic primary action button adaptation
  const actionBtnText = document.getElementById('action-btn-text');
  const actionBtn = document.getElementById('nav-action-btn');
  if (actionBtn && actionBtnText) {
    actionBtn.innerHTML = `
      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round;">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span id="action-btn-text">New Recipe</span>
    `;
    actionBtn.style.background = 'var(--accent)';
    actionBtn.style.boxShadow = '0 8px 20px rgba(232, 99, 42, 0.28)';
  }

  renderAll();
  
  // Smoothly scroll workspace to view
  document.getElementById('app-shell')?.scrollIntoView({ behavior: 'smooth' });
};
window.switchThemeTab = window.switchToTab;

window.handleNavAction = function() {
  if (currentActiveTab === 'recipes') {
    openAddModal();
  }
};

// ── WEBGL INTERACTIVE SMOKEY SHADER CODE INITIALIZATION ──
function initWebGLSmokeyShader() {
  const canvas = document.getElementById('smokey-gl-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.warn('WebGL Context not supported in this runtime browser.');
    return;
  }

  // VS source
  const vsSource = `
    attribute vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `;

  // FS source featuring warm smoky effect matching colors (#E8632A)
  const fsSource = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec2 iMouse;
    uniform vec3 u_color;

    void mainImage(out vec4 fragColor, in vec2 fragCoord){
      vec2 uv = fragCoord / iResolution;
      vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

      float time = iTime * 0.45;

      // Mouse interactive ripple center
      vec2 mouse = iMouse / iResolution;
      vec2 rippleCenter = 2.0 * mouse - 1.0;

      vec2 distortion = centeredUV;
      // Wavy distortion loop
      for (float i = 1.0; i < 6.0; i++) {
        distortion.x += 0.45 / i * cos(i * 1.8 * distortion.y + time + rippleCenter.x * 3.14);
        distortion.y += 0.45 / i * cos(i * 1.8 * distortion.x + time + rippleCenter.y * 3.14);
      }

      // Smooth glowing lines
      float wave = abs(sin(distortion.x + distortion.y + time));
      float glow = smoothstep(0.85, 0.15, wave);

      // Interpolate backgrounds
      fragColor = vec4(u_color * glow * 1.2, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Shader issue compiling: ', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('WebGL compiler linking failed.', gl.getProgramInfoLog(program));
    return;
  }

  glProgramInstance = program;
  gl.useProgram(program);

  // Set coordinate buffers covering full render square
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Setup uniform hooks
  const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
  const iTimeLocation = gl.getUniformLocation(program, 'iTime');
  const iMouseLocation = gl.getUniformLocation(program, 'iMouse');
  const uColorLocation = gl.getUniformLocation(program, 'u_color');

  const startTime = Date.now();
  let mouseState = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
  let isHovering = false;

  // Mouse move listen
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseState.x = e.clientX - rect.left;
    mouseState.y = e.clientY - rect.top;
    isHovering = true;
  });

  canvas.addEventListener('mouseenter', () => { isHovering = true; });
  canvas.addEventListener('mouseleave', () => { isHovering = false; });

  const renderFrameLoop = () => {
    if (!glProgramInstance) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    const currentSecs = (Date.now() - startTime) / 1000;

    // Direct uniform float assigns [R, G, B] matching var(--accent) #E8632A -> 0.91, 0.38, 0.16
    gl.uniform3f(uColorLocation, 0.91, 0.38, 0.16);
    gl.uniform2f(iResolutionLocation, width, height);
    gl.uniform1f(iTimeLocation, currentSecs);
    gl.uniform2f(iMouseLocation, isHovering ? mouseState.x : width / 2, isHovering ? height - mouseState.y : height / 2);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    glAnimationId = requestAnimationFrame(renderFrameLoop);
  };

  renderFrameLoop();
}

function cancelWebGLSmokeyShader() {
  if (glAnimationId) {
    cancelAnimationFrame(glAnimationId);
    glAnimationId = null;
  }
  glProgramInstance = null;
}

// ── AUTHENTICATION INTERACTION LOGICS ──
window.openAuthModal = function(signupMode = false) {
  currentAuthMode = signupMode ? 'signup' : 'signin';
  
  // Toggle layout selectors
  const nameGroup = document.getElementById('auth-name-group');
  const packageGroup = document.getElementById('auth-sub-select-group');
  const headerText = document.getElementById('auth-modal-header-title');
  const btnText = document.getElementById('auth-btn-label');
  const errorPanel = document.getElementById('auth-error-box');
  const toggleTip = document.getElementById('auth-toggle-tip');
  const toggleLabel = document.getElementById('auth-toggle-label');

  errorPanel?.classList.add('hidden');
  
  if (currentAuthMode === 'signup') {
    nameGroup?.classList.remove('hidden');
    packageGroup?.classList.remove('hidden');
    if (headerText) headerText.textContent = 'Join Plat Community';
    if (btnText) btnText.textContent = 'Create Pro Account';
    if (toggleTip) toggleTip.textContent = 'Already registered with us?';
    if (toggleLabel) toggleLabel.textContent = 'Sign In';
  } else {
    nameGroup?.classList.add('hidden');
    packageGroup?.classList.add('hidden');
    if (headerText) headerText.textContent = 'Welcome Back Chef';
    if (btnText) btnText.textContent = 'Sign In';
    if (toggleTip) toggleTip.textContent = "Don't have an account?";
    if (toggleLabel) toggleLabel.textContent = 'Create Account';
  }

  // Reset values
  document.getElementById('auth-email').value = '';
  document.getElementById('auth-pwd').value = '';
  if (document.getElementById('auth-name')) document.getElementById('auth-name').value = '';

  // Class toggle
  document.getElementById('ov-auth')?.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Spawn visual elements WebGL
  setTimeout(() => {
    initWebGLSmokeyShader();
  }, 100);
};

window.closeAuthModal = function() {
  document.getElementById('ov-auth')?.classList.remove('open');
  document.body.style.overflow = '';
  cancelWebGLSmokeyShader();
};

window.toggleAuthMode = function() {
  openAuthModal(currentAuthMode === 'signin');
};

window.handleAuthSubmit = function(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-pwd').value.trim();
  const errorPanel = document.getElementById('auth-error-box');

  if (!email || !password) {
    if (errorPanel) {
      errorPanel.classList.remove('hidden');
      errorPanel.textContent = 'All highlighted input lines are required.';
    }
    return;
  }

  // Simple simulated validation
  let user = null;
  if (currentAuthMode === 'signup') {
    const name = document.getElementById('auth-name').value.trim() || 'Culinary Artist';
    const sub = document.getElementById('auth-sub-package').value || 'Free';
    user = { email, name, subscription: sub, authorized: true };
    toast(`Registration processed! Role: ${sub} active.`, 'ok');
  } else {
    // Treat any sign-in as a valid session in high-fidelity mock, defaulted to basic chef
    user = { email, name: email.split('@')[0], subscription: 'Free', authorized: true };
    toast('Access granted. Welcome chef!', 'ok');
  }

  saveCurrentUser(user);
  closeAuthModal();
  syncUserAuthUI();
};

window.triggerGoogleSignIn = function() {
  const user = { email: 'chef.guest@plat.cooking', name: 'Guest Chef', subscription: 'Pro', authorized: true };
  saveCurrentUser(user);
  closeAuthModal();
  syncUserAuthUI();
  toast('Signed in as Guest Chef (Sous Chef Pro active).', 'ok');
};

window.performLogOut = function() {
  saveCurrentUser(null);
  syncUserAuthUI();
  toast('Session terminated securely.', 'ok');
};

// ── RECIPE PRESENTATION & DATABASE RENDERING (CRUD) ──
window.favFilterActive = false;

window.toggleFavFilterOnly = function() {
  window.favFilterActive = !window.favFilterActive;
  const btn = document.getElementById('s-fav-btn');
  if (btn) {
    if (window.favFilterActive) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }

  const recipesSec = document.querySelector('.recipes-section');
  if (recipesSec) {
    if (window.favFilterActive) {
      recipesSec.classList.add('favorites-active');
    } else {
      recipesSec.classList.remove('favorites-active');
    }
  }

  // Reset category dropdown for clean UX
  const catSelect = document.getElementById('s-cat');
  if (catSelect && window.favFilterActive) {
    catSelect.value = '';
  }
  window.renderAll();
};

window.resetFavFilter = function() {
  window.favFilterActive = false;
  const btn = document.getElementById('s-fav-btn');
  if (btn) {
    btn.classList.remove('active');
  }
  const recipesSec = document.querySelector('.recipes-section');
  if (recipesSec) {
    recipesSec.classList.remove('favorites-active');
  }
  window.renderAll();
};

window.renderAll = function() {
  renderMarquee();
  renderGrid();
};

function renderMarquee() {
  const all = loadRecipes();
  const track = document.getElementById('mq-track');
  if (!all.length || !track) return;

  // Let's ensure we have enough items for a continuous, wrapping loop marquee.
  let items = [...all];
  // If we have very few elements, duplicate them so they stretch beyond screen widths.
  while (items.length < 10) {
    items = [...items, ...all];
  }

  // Double the list to support seamless wrapping with CSS translateX(-50%)
  const doubleItems = [...items, ...items];

  track.innerHTML = doubleItems.map(recipe => {
    const displayImg = recipe.image || CATEGORY_IMAGES[recipe.category] || '';
    const displayEmoji = CATEGORY_EMOJIS[recipe.category] || '🍽️';

    return `
      <div class="mq-card" onclick="openDetail('${recipe.id}')">
        <div class="mq-img">
          ${displayImg ? `<img src="${displayImg}" alt="${esc(recipe.title)}" loading="lazy" decoding="async" onerror="this.style.display='none'">` : ''}
          <span style="position:absolute; z-index:1">${displayImg ? '' : displayEmoji}</span>
          <div class="mq-badge">${recipe.category}</div>
        </div>
        <div class="mq-body">
          <div class="mq-title">${esc(recipe.title)}</div>
          <div class="mq-meta">
            ${recipe.prep ? `<span>⏱ ${esc(recipe.prep)}</span>` : ''}
            ${recipe.difficulty ? `<span>📊 ${esc(recipe.difficulty)}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderGrid() {
  const query = document.getElementById('s-inp')?.value.toLowerCase().trim() || '';
  const selectedCat = document.getElementById('s-cat')?.value || '';
  const selectedSort = document.getElementById('s-sort')?.value || 'newest';
  
  let dataset = loadRecipes();

  // Search filter
  if (query) {
    dataset = dataset.filter(r => 
      r.title.toLowerCase().includes(query) || 
      (r.description || '').toLowerCase().includes(query) || 
      (r.ingredients || []).some(ing => ing.toLowerCase().includes(query))
    );
  }

  // Category filter OR global Favorites button check
  if (selectedCat) {
    if (selectedCat === 'favorites') {
      dataset = dataset.filter(r => isFavorite(r.id));
    } else {
      dataset = dataset.filter(r => r.category === selectedCat);
    }
  } else if (window.favFilterActive) {
    dataset = dataset.filter(r => isFavorite(r.id));
  }

  // Sort mechanism
  dataset.sort((a, b) => {
    if (selectedSort === 'newest') return b.createdAt - a.createdAt;
    if (selectedSort === 'oldest') return a.createdAt - b.createdAt;
    if (selectedSort === 'az') return a.title.localeCompare(b.title);
    return b.title.localeCompare(a.title);
  });

  const displayCount = dataset.length;
  const totalCount = loadRecipes().length;

  const countLabel = document.getElementById('res-count');
  if (countLabel) {
    countLabel.innerText = query || selectedCat || window.favFilterActive ? `${displayCount} filtered / ${totalCount} total` : `${totalCount} recipe records`;
  }

  const secTitle = document.querySelector('.sec-title');
  if (secTitle) {
    if (window.favFilterActive) {
      secTitle.innerHTML = 'Favorite Collection';
    } else {
      secTitle.innerHTML = 'Global Collection';
    }
  }

  const collectionCountLabel = document.getElementById('coll-count');
  if (collectionCountLabel) {
    collectionCountLabel.innerText = `${totalCount} dish${totalCount !== 1 ? 'es' : ''} stored`;
  }

  const grid = document.getElementById('glow-grid');
  if (!grid) return;

  if (!dataset.length) {
    if (window.favFilterActive || selectedCat === 'favorites') {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji" style="color:#ff6060;">❤️</div>
          <h3 class="empty-title">Favorites List Empty</h3>
          <p class="empty-sub">To add recipes to your favorites, open any recipe card, and click the Heart icon inside its details view!</p>
          <button class="btn-accent" style="margin:0 auto" onclick="resetFavFilter()">Browse All Recipes</button>
        </div>
      `;
    } else {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">🍲</div>
          <h3 class="empty-title">Cabinet Void</h3>
          <p class="empty-sub">No culinary records found matching those query targets.</p>
          <button class="btn-accent" style="margin: 0 auto" onclick="openAddModal()">+ Add New Recipe Record</button>
        </div>
      `;
    }
    return;
  }

  grid.innerHTML = dataset.map(recipe => {
    const displayImg = recipe.image || CATEGORY_IMAGES[recipe.category] || '';
    const displayEmoji = CATEGORY_EMOJIS[recipe.category] || '🍽️';
    const ingText = (recipe.ingredients || []).length;

    return `
      <div data-glow onclick="openDetail('${recipe.id}')">
        <div class="gc-img">
          ${displayImg ? `<img src="${displayImg}" alt="${esc(recipe.title)}" loading="lazy" decoding="async" onerror="this.style.display='none'">` : ''}
          <span style="position:absolute; z-index:1">${displayImg ? '' : displayEmoji}</span>
          <div class="gc-cat">${recipe.category}</div>
        </div>
        <div class="gc-body">
          <h3 class="gc-title">${esc(recipe.title)}</h3>
          <div class="gc-meta">
            ${recipe.prep ? `<span>⏱ ${esc(recipe.prep)}</span>` : ''}
            ${recipe.cook ? `<span>🔥 ${esc(recipe.cook)}</span>` : ''}
            ${recipe.servings ? `<span>👥 ${esc(recipe.servings)}</span>` : ''}
            ${recipe.difficulty ? `<span>📊 ${esc(recipe.difficulty)}</span>` : ''}
          </div>
          <p class="gc-desc">${esc(recipe.description || 'No descriptive sensory tags logged.')}</p>
        </div>
        <div class="gc-foot" onclick="event.stopPropagation()">
          <span class="gc-ic">${ingText} ingredient${ingText !== 1 ? 's' : ''} listed</span>
          <div class="gc-actions">
            <!-- Edit Trigger -->
            <button class="icon-btn edt" title="Mod Record" onclick="openEdit('${recipe.id}')">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <!-- Delete Trigger -->
            <button class="icon-btn del" title="Purge Record" onclick="openDel('${recipe.id}', 'recipe')">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6v-2h6v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updatePlatformStatistics() {
  const recipes = loadRecipes().length;

  const statRecipesElem = document.getElementById('stat-n');
  if (statRecipesElem) {
    window.gsap ? gsap.to(statRecipesElem, { innerHTML: recipes, snap: { innerHTML: 1 }, duration: 1.2 }) : statRecipesElem.innerText = recipes;
  }
}

// ── CUSTOM RECIPE DIALOG ACTIONS (CRUD OPERATORS) ──
window.openAddModal = function() {
  activeEditRecipeId = null;
  recipeIngredients = [];
  recipeSteps = [];
  recipeFormValidationTriggered = false;
  
  document.getElementById('fm-title').textContent = 'Add Fresh Recipe Record';
  
  // Clear forms
  ['f-title', 'f-prep', 'f-cook', 'f-srv', 'f-img', 'f-desc'].forEach(id => {
    document.getElementById(id).value = '';
  });
  
  document.getElementById('f-cat').value = 'Dinner';
  document.getElementById('f-diff').value = 'Easy';
  
  renderIngList();
  renderStepsList();
  
  if (typeof window.clearFormValidationDecorations === 'function') {
    window.clearFormValidationDecorations();
  }

  // Reset preset panel and image preview
  const pPanel = document.getElementById('presets-panel');
  if (pPanel) pPanel.style.display = 'none';
  if (typeof window.updateImagePreview === 'function') {
    window.updateImagePreview();
  }
  
  om('ov-form');
};

window.openEdit = function(recipeId) {
  const target = loadRecipes().find(x => x.id === recipeId);
  if (!target) return;

  activeEditRecipeId = recipeId;
  recipeIngredients = [...(target.ingredients || [])];
  recipeSteps = [...(target.steps || [])];
  recipeFormValidationTriggered = false;

  document.getElementById('fm-title').textContent = 'Modify Recipe Registry';
  document.getElementById('f-title').value = target.title;
  document.getElementById('f-cat').value = target.category || 'Dinner';
  document.getElementById('f-prep').value = target.prep || '';
  document.getElementById('f-cook').value = target.cook || '';
  document.getElementById('f-srv').value = target.servings || '';
  document.getElementById('f-diff').value = target.difficulty || 'Easy';
  document.getElementById('f-img').value = target.image || '';
  document.getElementById('f-desc').value = target.description || '';

  renderIngList();
  renderStepsList();

  if (typeof window.clearFormValidationDecorations === 'function') {
    window.clearFormValidationDecorations();
  }

  // Reset preset panel and update live image preview
  const pPanel = document.getElementById('presets-panel');
  if (pPanel) pPanel.style.display = 'none';
  if (typeof window.updateImagePreview === 'function') {
    window.updateImagePreview();
  }

  om('ov-form');
};

window.saveRecipe = function() {
  const allRecipes = loadRecipes();

  // Auto-harvest typed but uncommitted ingredient and step values if user directly clicks Save
  const newIngInp = document.getElementById('new-ing');
  if (newIngInp && newIngInp.value.trim()) {
    recipeIngredients.push(newIngInp.value.trim());
    newIngInp.value = '';
    renderIngList();
  }
  const newStepInp = document.getElementById('new-step');
  if (newStepInp && newStepInp.value.trim()) {
    recipeSteps.push(newStepInp.value.trim());
    newStepInp.value = '';
    renderStepsList();
  }

  const title = document.getElementById('f-title').value.trim();
  const category = document.getElementById('f-cat').value;
  let prep = document.getElementById('f-prep').value.trim();
  let cook = document.getElementById('f-cook').value.trim();
  const servings = document.getElementById('f-srv').value.trim();
  const difficulty = document.getElementById('f-diff').value;
  const image = document.getElementById('f-img').value.trim();
  const description = document.getElementById('f-desc').value.trim();

  // Enforce validation engine checks
  const isTitleOk = typeof window.validateTitle === 'function' ? window.validateTitle() : !!title;
  const isPrepOk = typeof window.validatePrep === 'function' ? window.validatePrep() : true;
  const isCookOk = typeof window.validateCook === 'function' ? window.validateCook() : true;
  const isServingsOk = typeof window.validateServings === 'function' ? window.validateServings() : true;
  const isImageOk = typeof window.validateImage === 'function' ? window.validateImage() : true;

  if (!isTitleOk || !isPrepOk || !isCookOk || !isServingsOk || !isImageOk) {
    toast('Some input fields have active validation errors. Please inspect findings.', 'err');
    return;
  }

  // Enforce non-empty structured parts
  if (recipeIngredients.length === 0 || recipeSteps.length === 0) {
    recipeFormValidationTriggered = true;
    renderIngList();
    renderStepsList();

    if (recipeIngredients.length === 0) {
      toast('Ingredients collection cannot be empty. Specify at least one.', 'err');
      return;
    }
    if (recipeSteps.length === 0) {
      toast('Preparation steps list cannot be empty. Specify at least one.', 'err');
      return;
    }
  }

  // Auto suffix raw digits
  if (prep && !isNaN(prep)) {
    prep = prep + ' min';
  }
  if (cook && !isNaN(cook)) {
    cook = cook + ' min';
  }



  const recipeObj = {
    id: activeEditRecipeId || 'recipe_' + Date.now(),
    title,
    category,
    prep,
    cook,
    servings,
    difficulty,
    image,
    description,
    ingredients: [...recipeIngredients],
    steps: [...recipeSteps],
    createdAt: activeEditRecipeId ? (allRecipes.find(r => r.id === activeEditRecipeId)?.createdAt || Date.now()) : Date.now(),
    updatedAt: Date.now()
  };

  if (activeEditRecipeId) {
    const idx = allRecipes.findIndex(r => r.id === activeEditRecipeId);
    if (idx > -1) allRecipes[idx] = recipeObj;
    toast('Recipe record successfully modified.', 'ok');
  } else {
    allRecipes.push(recipeObj);
    toast('Gourmet recipe added to collection.', 'ok');
  }

  saveRecipes(allRecipes);
  cm('ov-form');
  renderAll();
  updatePlatformStatistics();

  // Async server-side synchronization
  const fetchAction = activeEditRecipeId ? 'update' : 'create';
  fetch('recipes.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: fetchAction,
      recipe: recipeObj
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.recipes) {
      saveRecipes(data.recipes);
      renderAll();
      updatePlatformStatistics();
    }
  })
  .catch(err => {
    console.error("Recipe write deferred locally:", err);
  });
};

// Add / Splicing dynamic arrays for lists inside creation forms
window.addIng = function() {
  const inp = document.getElementById('new-ing');
  const val = inp?.value.trim();
  if (!val) return;
  recipeIngredients.push(val);
  inp.value = '';
  renderIngList();
};

window.removeIng = function(index) {
  recipeIngredients.splice(index, 1);
  renderIngList();
};

function renderIngList() {
  const list = document.getElementById('ing-list');
  if (!list) return;
  if (recipeIngredients.length === 0) {
    if (recipeFormValidationTriggered) {
      list.innerHTML = `
        <div class="empty-warning-banner">
          ⚠️ Add at least one raw ingredient/quantity to validate and complete this dish structure.
        </div>
      `;
    } else {
      list.innerHTML = ``;
    }
    return;
  }
  list.innerHTML = recipeIngredients.map((ing, i) => `
    <div class="ing-item">
      <span>${esc(ing)}</span>
      <button class="rm-btn" onclick="removeIng(${i})">✕</button>
    </div>
  `).join('');
}

window.addStep = function() {
  const inp = document.getElementById('new-step');
  const val = inp?.value.trim();
  if (!val) return;
  recipeSteps.push(val);
  inp.value = '';
  renderStepsList();
};

window.removeStep = function(index) {
  recipeSteps.splice(index, 1);
  renderStepsList();
};

function renderStepsList() {
  const list = document.getElementById('steps-list');
  if (!list) return;
  if (recipeSteps.length === 0) {
    if (recipeFormValidationTriggered) {
      list.innerHTML = `
        <div class="empty-warning-banner">
          ⚠️ Outline at least one manual instruction step to calibrate this cooking blueprint.
        </div>
      `;
    } else {
      list.innerHTML = ``;
    }
    return;
  }
  list.innerHTML = recipeSteps.map((step, i) => `
    <div class="step-item">
      <div class="step-num">${i + 1}</div>
      <span>${esc(step)}</span>
      <button class="rm-btn" onclick="removeStep(${i})">✕</button>
    </div>
  `).join('');
}

// Detailed specimen display
window.openDetail = function(recipeId) {
  const target = loadRecipes().find(x => x.id === recipeId);
  if (!target) return;

  const coverImg = target.image || CATEGORY_IMAGES[target.category] || '';
  const fallbackEmoji = CATEGORY_EMOJIS[target.category] || '🍽️';

  const container = document.getElementById('det-content');
  if (!container) return;

  container.innerHTML = `
    <div class="det-hero">
      ${coverImg ? `<img src="${esc(coverImg)}" alt="${esc(target.title)}" decoding="async" onerror="this.style.display='none'">` : fallbackEmoji}
      <div class="det-overlay"></div>
      <div class="det-cat-badge">${target.category}</div>
      <button class="fav-btn ${isFavorite(target.id) ? 'is-fav' : ''}" onclick="toggleFavorite('${target.id}', event)" title="Toggle Favorite">
        <svg viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
      <div class="det-title">${esc(target.title)}</div>
    </div>
    <div class="det-body">
      <div class="det-meta">
        ${target.prep ? `<div class="dmi"><span class="dmi-lbl">Prep Duration</span><span class="dmi-val">⏱ ${esc(target.prep)}</span></div>` : ''}
        ${target.cook ? `<div class="dmi"><span class="dmi-lbl">Cooking Heat</span><span class="dmi-val">🔥 ${esc(target.cook)}</span></div>` : ''}
        ${target.servings ? `<div class="dmi"><span class="dmi-lbl">Serves Portions</span><span class="dmi-val">👥 ${esc(target.servings)}</span></div>` : ''}
        ${target.difficulty ? `<div class="dmi"><span class="dmi-lbl">Level Complexity</span><span class="dmi-val">📊 ${esc(target.difficulty)}</span></div>` : ''}
      </div>

      ${target.description ? `<div class="det-desc">${esc(target.description)}</div>` : ''}

      ${(target.ingredients && target.ingredients.length) ? `
        <h4 class="det-sec">🧂 Required Spices &amp; Ingredients</h4>
        <div class="ing-chips">
          ${target.ingredients.map(ing => `<div class="ing-chip">${esc(ing)}</div>`).join('')}
        </div>
      ` : ''}

      ${(target.steps && target.steps.length) ? `
        <h4 class="det-sec">👨‍🍳 Culinary Execution Protocol</h4>
        <div class="steps-det">
          ${target.steps.map((st, i) => `
            <div class="step-d">
              <div class="step-d-num">${i + 1}</div>
              <div class="step-d-txt">${esc(st)}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
    <div class="modal-foot">
      <button class="btn-cancel" onclick="cm('ov-det'); openDel('${target.id}', 'recipe')">Erase Record</button>
      <button class="btn-accent" onclick="cm('ov-det'); openEdit('${target.id}')">Edit Dossier</button>
    </div>
  `;

  om('ov-det');
};



// ── DELETE GENERIC VALIDATION CONFIRMER ──
window.openDel = function(targetId) {
  activeDeleteTargetId = targetId;
  
  const icon = document.querySelector('.conf-icon');
  const title = document.querySelector('.conf-title');
  const msg = document.querySelector('.conf-msg');

  if (icon && title && msg) {
    icon.textContent = '🍲';
    title.textContent = 'Erase Recipe Registry?';
    msg.textContent = 'This action will purge this sensory list permanently.';
  }

  om('ov-del');
};

window.confirmDel = function() {
  if (!activeDeleteTargetId) return;

  const targetId = activeDeleteTargetId;
  const list = loadRecipes().filter(r => r.id !== targetId);
  saveRecipes(list);
  toast('Recipe record purged.', 'ok');
  renderAll();
  cm('ov-del');

  // Async server deletion
  fetch('recipes.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'delete',
      id: targetId
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.recipes) {
      saveRecipes(data.recipes);
      renderAll();
      updatePlatformStatistics();
    }
  })
  .catch(err => {
    console.error("Recipe delete deferred locally:", err);
  });

  activeDeleteTargetId = null;
  updatePlatformStatistics();
};

// ── MODAL UTILITIES ──
function om(id) {
  document.getElementById(id)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.cm = function(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
};

window.ovc = function(event, elementId) {
  if (event.target === document.getElementById(elementId)) {
    cm(elementId);
  }
};

// Escape closes general dialogs
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ['ov-form', 'ov-det', 'ov-del', 'ov-auth'].forEach(id => {
      cm(id);
    });
    cancelWebGLSmokeyShader();
  }
});

// ── TOAST MESSAGES ──
window.toast = function(message, severity = '') {
  const collection = document.getElementById('toasts');
  if (!collection) return;

  const node = document.createElement('div');
  node.className = `toast ${severity}`;
  node.textContent = message;
  collection.appendChild(node);

  setTimeout(() => {
    node.style.opacity = '0';
    node.style.transition = 'opacity .32s ease';
    setTimeout(() => node.remove(), 320);
  }, 3200);
};

// HTML escape helper
function esc(str) {
  const container = document.createElement('div');
  container.textContent = str;
  return container.innerHTML;
}

// ── RECIPE FORM VALIDATION ENGINE ──
function initRecipeFormValidation() {
  const titleInput = document.getElementById('f-title');
  const prepInput = document.getElementById('f-prep');
  const cookInput = document.getElementById('f-cook');
  const srvInput = document.getElementById('f-srv');
  const imgInput = document.getElementById('f-img');

  if (!titleInput) return;

  window.validateTitle = function() {
    const title = titleInput.value.trim();
    const errDiv = document.getElementById('re-title-err');
    if (!title) {
      titleInput.classList.remove('is-valid');
      titleInput.classList.add('is-invalid');
      if (errDiv) {
        errDiv.textContent = "Recipe title cannot be left blank.";
        errDiv.style.display = 'block';
      }
      return false;
    } else {
      titleInput.classList.remove('is-invalid');
      titleInput.classList.add('is-valid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
  };

  window.validatePrep = function() {
    const val = prepInput.value.trim();
    const errDiv = document.getElementById('re-prep-err');
    if (!val) {
      prepInput.classList.remove('is-valid', 'is-invalid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
    const parsesToNumber = !isNaN(val) && val !== '';
    if (parsesToNumber) {
      const num = parseFloat(val);
      if (num < 0) {
        prepInput.classList.remove('is-valid');
        prepInput.classList.add('is-invalid');
        if (errDiv) {
          errDiv.className = 'validation-error-msg';
          errDiv.textContent = "Preparation time cannot be negative.";
          errDiv.style.display = 'block';
        }
        return false;
      } else {
        prepInput.classList.remove('is-invalid');
        prepInput.classList.add('is-valid');
        if (errDiv) {
          errDiv.className = 'validation-warning-msg';
          errDiv.textContent = `💡 Will auto-format to "${num} min" on save.`;
          errDiv.style.display = 'block';
        }
        return true;
      }
    } else {
      if (val.startsWith('-')) {
        prepInput.classList.remove('is-valid');
        prepInput.classList.add('is-invalid');
        if (errDiv) {
          errDiv.className = 'validation-error-msg';
          errDiv.textContent = "Duration cannot be negative.";
          errDiv.style.display = 'block';
        }
        return false;
      }
      prepInput.classList.remove('is-invalid');
      prepInput.classList.add('is-valid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
  };

  window.validateCook = function() {
    const val = cookInput.value.trim();
    const errDiv = document.getElementById('re-cook-err');
    if (!val) {
      cookInput.classList.remove('is-valid', 'is-invalid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
    const parsesToNumber = !isNaN(val) && val !== '';
    if (parsesToNumber) {
      const num = parseFloat(val);
      if (num < 0) {
        cookInput.classList.remove('is-valid');
        cookInput.classList.add('is-invalid');
        if (errDiv) {
          errDiv.className = 'validation-error-msg';
          errDiv.textContent = "Cooking time cannot be negative.";
          errDiv.style.display = 'block';
        }
        return false;
      } else {
        cookInput.classList.remove('is-invalid');
        cookInput.classList.add('is-valid');
        if (errDiv) {
          errDiv.className = 'validation-warning-msg';
          errDiv.textContent = `💡 Will auto-format to "${num} min" on save.`;
          errDiv.style.display = 'block';
        }
        return true;
      }
    } else {
      if (val.startsWith('-')) {
        cookInput.classList.remove('is-valid');
        cookInput.classList.add('is-invalid');
        if (errDiv) {
          errDiv.className = 'validation-error-msg';
          errDiv.textContent = "Duration cannot be negative.";
          errDiv.style.display = 'block';
        }
        return false;
      }
      cookInput.classList.remove('is-invalid');
      cookInput.classList.add('is-valid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
  };

  window.validateServings = function() {
    const val = srvInput.value.trim();
    const errDiv = document.getElementById('re-srv-err');
    if (!val) {
      srvInput.classList.remove('is-valid', 'is-invalid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
    const num = Number(val);
    if (!Number.isInteger(num) || num <= 0) {
      srvInput.classList.remove('is-valid');
      srvInput.classList.add('is-invalid');
      if (errDiv) {
        errDiv.textContent = "Servings must be a positive integer (e.g. 1, 2, 4).";
        errDiv.style.display = 'block';
      }
      return false;
    } else if (num > 150) {
      srvInput.classList.remove('is-valid');
      srvInput.classList.add('is-invalid');
      if (errDiv) {
        errDiv.textContent = "Maximum servings value exceeded (limit 150 servings).";
        errDiv.style.display = 'block';
      }
      return false;
    } else {
      srvInput.classList.remove('is-invalid');
      srvInput.classList.add('is-valid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
  };

  window.validateImage = function() {
    const val = imgInput.value.trim();
    const errDiv = document.getElementById('re-img-warn');
    if (!val) {
      imgInput.classList.remove('is-valid', 'is-invalid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
    const isUrl = /^https?:\/\/.+/i.test(val) || /^data:image\//i.test(val);
    if (!isUrl) {
      imgInput.classList.remove('is-valid');
      imgInput.classList.add('is-invalid');
      if (errDiv) {
        errDiv.textContent = "⚠️ Warning: Image path should starting with http://, https://, or are base64-encoded to render correctly.";
        errDiv.style.display = 'block';
      }
      return true;
    } else {
      imgInput.classList.remove('is-invalid');
      imgInput.classList.add('is-valid');
      if (errDiv) errDiv.style.display = 'none';
      return true;
    }
  };

  titleInput.addEventListener('input', window.validateTitle);
  titleInput.addEventListener('blur', window.validateTitle);
  prepInput.addEventListener('input', window.validatePrep);
  prepInput.addEventListener('blur', window.validatePrep);
  cookInput.addEventListener('input', window.validateCook);
  cookInput.addEventListener('blur', window.validateCook);
  srvInput.addEventListener('input', window.validateServings);
  srvInput.addEventListener('blur', window.validateServings);
  
  imgInput.addEventListener('input', () => {
    window.validateImage();
    if (typeof window.updateImagePreview === 'function') window.updateImagePreview();
  });
  imgInput.addEventListener('blur', () => {
    window.validateImage();
    if (typeof window.updateImagePreview === 'function') window.updateImagePreview();
  });
}

window.clearFormValidationDecorations = function() {
  const fields = ['f-title', 'f-prep', 'f-cook', 'f-srv', 'f-img'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('is-valid', 'is-invalid');
    }
  });

  const errs = ['re-title-err', 're-prep-err', 're-cook-err', 're-srv-err', 're-img-warn'];
  errs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Also hide image preview container
  const previewContainer = document.getElementById('form-img-preview-container');
  if (previewContainer) previewContainer.style.display = 'none';
};

// ── INTERACTIVE IMAGE TOOL SUITE (LOCAL FILE UPLOAD & PHOTO PRESETS) ──

window.updateImagePreview = function() {
  const imgInput = document.getElementById('f-img');
  if (!imgInput) return;
  const val = imgInput.value.trim();
  const previewContainer = document.getElementById('form-img-preview-container');
  const previewImg = document.getElementById('form-img-preview');
  
  if (val && previewContainer && previewImg) {
    previewImg.src = val;
    previewContainer.style.display = 'block';
  } else if (previewContainer) {
    previewContainer.style.display = 'none';
    if (previewImg) previewImg.src = '';
  }
};

window.togglePresetPicker = function() {
  const panel = document.getElementById('presets-panel');
  if (!panel) return;
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    window.renderPresetsGrid();
  } else {
    panel.style.display = 'none';
  }
};

window.triggerLocalUpload = function() {
  const fileInput = document.getElementById('local-img-file');
  if (fileInput) fileInput.click();
};

window.handleLocalImageUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    toast('File is not a valid image format.', 'err');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Str = e.target.result;
    const imgInput = document.getElementById('f-img');
    if (imgInput) {
      imgInput.value = base64Str;
      if (typeof window.validateImage === 'function') window.validateImage();
      if (typeof window.updateImagePreview === 'function') window.updateImagePreview();
      toast('Local culinary image loaded successfully!', 'ok');
    }
  };
  reader.onerror = function() {
    toast('Failed to load local picture.', 'err');
  };
  reader.readAsDataURL(file);
};

const PRESET_FOODS = [
  { name: 'Spaghetti Carbonara', url: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=600&q=75' },
  { name: 'Blueberry Pancakes', url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=75' },
  { name: 'Mango Smoothie', url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=75' },
  { name: 'Butter Chicken', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=75' },
  { name: 'Paneer Tikka skewers', url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=75' },
  { name: 'Crispy South Masala Dosa', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=75' },
  { name: 'Fresh Avocado Salad', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=75' },
  { name: 'Gourmet French Onion Soup', url: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=600&q=75' },
  { name: 'Traditional Matcha Mochi', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=75' },
  { name: 'Eggs Benedict', url: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=75' },
  { name: 'Ramen bowl', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=75' },
  { name: 'Golden Crispy Chicken Katsu', url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=75' },
  { name: 'Spiced Pad Thai Noodles', url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=75' },
  { name: 'Fragrant Spicy Green Curry', url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=75' },
  { name: 'Smoked Dal Bukhara', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=75' },
  { name: 'Lucknowi Galouti Kebab', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=75' },
  { name: 'Royal Dum Gosht Biryani', url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=75' },
  { name: 'Zafrani Shahi Tukda Toast', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=75' }
];

window.renderPresetsGrid = function() {
  const grid = document.getElementById('presets-grid');
  if (!grid) return;
  grid.innerHTML = PRESET_FOODS.map(p => `
    <div onclick="selectPresetImage('${p.url}')" title="${p.name}" style="aspect-ratio: 16/10; border-radius: 4px; border: 1px solid var(--border); overflow: hidden; cursor: pointer; position: relative;" class="preset-choice-item">
      <img src="${p.url}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); font-size: 0.6rem; text-align: center; padding: 2px; color: #fff; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" class="preset-choice">
        ${p.name}
      </div>
    </div>
  `).join('');
};

window.selectPresetImage = function(url) {
  const imgInput = document.getElementById('f-img');
  if (imgInput) {
    imgInput.value = url;
    if (typeof window.validateImage === 'function') window.validateImage();
    if (typeof window.updateImagePreview === 'function') window.updateImagePreview();
    const panel = document.getElementById('presets-panel');
    if (panel) panel.style.display = 'none';
    toast('Gourmet photo preset chosen successfully.', 'ok');
  }
};
