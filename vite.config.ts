import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';
import { spawn } from 'child_process';

// Setup local DB simulation file
const DB_PATH = path.resolve(__dirname, 'db.json');

function getMockDB() {
  if (!fs.existsSync(DB_PATH)) {
    const seed = {
      users: [
        { id: 'u_1', email: 'chef.guest@plat.cooking', password: 'guest', fullname: 'Guest Chef', plan: 'premium' }
      ],
      recipes: [
        { id: 'r_seed_1', title: 'Spaghetti Carbonara', category: 'Dinner', prep: '15 min', cook: '20 min', servings: '4', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=600&q=75', description: 'A Roman classic — crispy guanciale, eggs, Pecorino Romano and freshly cracked black pepper.', ingredients: ['400g high-quality spaghetti', '150g pork guanciale, diced', '4 fresh farm egg yolks', '100g Pecorino Romano, grated', 'Black pepper corns', 'Salt'], steps: ['Boil large pot of water, add rock salt, and lower spaghetti to boil al dente.', 'Sauté guanciale on low heat until fat renders and bits turn beautifully golden and crispy.', 'Whisk egg yolks together with grated Pecorino Romano and cracked black pepper until thick paste forms.', 'Drain cooked pasta, keeping half a cup of starchy water.', 'Combine pasta with crispy guanciale off-heat. Quickly stir in egg paste, tossing vigorously to form emulsified creamy sauce. Add pasta water as needed.'], createdAt: Date.now() - 172800000 },
        { id: 'r_seed_2', title: 'Lemon Blueberry Pancakes', category: 'Breakfast', prep: '10 min', cook: '15 min', servings: '2', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=75', description: 'Fluffy golden pancakes filled with fresh whole blueberries and fragrant lemon zest sweeps.', ingredients: ['1 cup all-purpose flour', '2 tbsp organic sugar', '1 tsp baking powder', '1 cup buttermilk', '1 organic egg', '1 cup organic blueberries', '2 tsp lemon zest'], steps: ['Whisk flour, sugar, baking powder, and pinch of salt in standard mixing bowl.', 'Fold in buttermilk, lightly beaten egg, and lemon zest. Do not overmix batter.', 'Heat skillet with butter, ladle batter portions, scatter fresh blueberries on top.', 'Cook until surface starts bubbles, flip and roast 2 minutes until perfectly fluffy.'], createdAt: Date.now() - 86400000 },
        { id: 'r_seed_3', title: 'Mango Coconut Smoothie', category: 'Drinks', prep: '5 min', cook: '0 min', servings: '1', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=75', description: 'A tropical cooling bliss — combines frozen mango chunks, thick coconut cream and ginger spikes.', ingredients: ['1 cup organic frozen mango', '1/2 cup organic coconut milk', '1/2 cup cold pressed orange juice', '1 tsp shaved ginger root', '1 tbsp raw honey'], steps: ['Place all ingredients into high-speed blender canister.', 'Blend for 60 seconds until completely thick and smooth.', 'Garnish with toasted code flakes and serve ice cold.'], createdAt: Date.now() - 3600000 },
        { id: 'r_seed_4', title: 'Butter Chicken (Murgh Makhani)', category: 'Dinner', prep: '20 min', cook: '30 min', servings: '4', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=75', description: 'An iconic North Indian masterpiece—tender marinated chicken pieces simmered in a velvet-smooth, spiced tomato, butter, and cream gravy.', ingredients: ['800g boneless chicken thighs, cubed', '1 cup Greek yogurt', '2 tbsp ginger-garlic paste', '2 tbsp Garam Masala', '1 tbsp Kashmiri red chili powder', '1 cup tomato purée', '100g unsalted butter', '1/2 cup heavy cream', 'Fresh cilantro for garnish'], steps: ['Marinate chicken cubes with yogurt, ginger-garlic paste, lemon juice, garam masala, and Kashmiri chili powder for 1 hour.', 'Grill or pan-fry the marinated chicken until perfectly cooked and slightly charred on the edges. Set aside.', 'In a deep pan, melt half the butter and sauté the remaining ginger-garlic paste. Add tomato purée and simmer on medium heat for 10 minutes.', 'Stir in the heavy cream, garam masala, and remaining butter to create a silky, glossy gravy.', 'Add the chicken to the gravy and simmer gently for 5-8 minutes. Garnish generously with fresh cilantro.'], createdAt: Date.now() - 7200000 },
        { id: 'r_seed_15', title: 'Royal Smoked Dal Bukhara', category: 'Lunch', prep: '15 min', cook: '4 hours', servings: '4', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=75', description: 'A legendary 5-star delicacy of premium urad dal slow-cooked over white-hot coal embers for 18 hours, infused with double-churned white butter and silk cream.', ingredients: ['2 cups whole black lentils (urad dal)', '1/2 cup split kidney beans (rajma)', '2 tbsp ginger-garlic paste', '1.5 cups tomato purée', '150g hand-churned salted butter', '1/2 cup organic double cream', '1 tsp Kashmiri red chili powder', 'Coal piece (for charcoal smoking)', 'Cream & ginger juliennes for garnish'], steps: ['Soak black lentils and rajma overnight, then pressure cook with ginger-garlic paste, salt, and water until completely tender.', 'Simmer cooked lentils on slow heat for hours while continuously mashing to release natural starches.', 'In a separate skillet, sauté tomato purée and chili powder in butter, then blend directly into the simmering lentils.', 'Incorporate more butter and double cream, cooking until rich, dark, and velvety.', 'Singe a piece of natural charcoal, place in a small cup over the dal, drizzle ghee to release aromatic smoke, cap the pot with a dense lid for 5 minutes, then garnish with cream and serve.'], createdAt: Date.now() - 250000 },
        { id: 'r_seed_16', title: 'Saffron Infused Galouti Kebab', category: 'Snack', prep: '25 min', cook: '15 min', servings: '4', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=75', description: 'Mouth-melting minced lamb croquettes infused with Lucknowi potli masala, raw papaya paste, and liquid saffron, seared to ultimate tender gold.', ingredients: ['500g fine minced lamb thigh', '2 tbsp raw papaya paste', '1 tbsp ginger-garlic-chili paste', '2 tbsp roasted gram flour (sattu)', '1/4 tsp saffron strands steeped in warm rosewater', '1 tsp royal kebab spice mix (potli masala)', 'Ghee for shallow frying', 'Mint chutney and red onion rings'], steps: ['Combine minced lamb thigh with raw papaya paste and cover for 2 hours to break down collagen and achieve a melt-in-mouth texture.', 'Mix with roasted gram flour, ginger-garlic paste, saffron rosewater, and Lucknowi kebab spice mix.', 'Whip the meat paste vigorously with the palm of your hand until airy, cohesive, and paste-like.', 'Divide into round delicate patties, refrigerate for 20 minutes to firm up.', 'Heat premium ghee in a flat iron tawa, dust patties slightly, and shallow fry carefully until a delicate brown crust forms while interior remains creamy.'], createdAt: Date.now() - 200000 },
        { id: 'r_seed_17', title: 'Awadhi Dum Gosht Biryani', category: 'Dinner', prep: '35 min', cook: '50 min', servings: '4', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=75', description: 'The pinnacle of Royal Mughlai fine-dining. Select lamb shanks marinated in vetiver-infused yogurt, layered with aged basmati rice, steamed under dough-sealed Dum.', ingredients: ['1kg premium aged Basmati rice', '750g tender spring lamb chops and shanks', '1 cup premium barista fried golden onions', '1 cup full-fat hung curd (yogurt)', '1/2 tsp Kashmiri saffron bloomed in warm cow milk', '2 tbsp premium cow ghee', 'Royal whole spices (cloves, cardamom, mace)', 'Rosewater & Screwpine (kewra) essence'], steps: ['Marinate lamb shanks in yogurt, raw papaya paste, royal spices, ginger-garlic, and half the barista onions for 4 hours.', 'Parboil aged basmati rice in heavily salted water with cloves, cardamom, and bay leaf until 70% cooked.', 'In a handi pot, layer marinated lamb at bottom, cover with a blanket of fragrant rice, drizzle ghee, saffron milk, boiled rosewater, and fried onions.', 'Place airtight lid sealed with fresh flour dough around the rim to create high pressure steam (Dum style).', 'Simmer on heavy tawa on low heat for 45 minutes, rest for 10 minutes, crack open the hot dough seal, and serve.'], createdAt: Date.now() - 150000 },
        { id: 'r_seed_18', title: 'Zafrani Shahi Tukda Gold Decadence', category: 'Dessert', prep: '15 min', cook: '25 min', servings: '4', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=75', description: 'A magnificent imperial bread dessert featuring ghee-fried brioche steeped in cardamom elixir, coated with thick, slow-reduced saffron rabri, and finished with edible 24k silver/gold leaf.', ingredients: ['4 thick slices of artisan brioche bread', '1 cup pure cow ghee for frying', '1.5 liters full-cream organic milk', '1/2 cup organic sugar', '1/2 tsp saffron stamens', '1/4 tsp green cardamom powder', 'Edible 24K silver or gold leaves (Varq)', 'Toasted almonds and pistachios'], steps: ['Reduce the full-cream milk in a wide iron kadhai by 70%, stirring constantly until thick cream flecks (rabri) form. Sweeten with sugar and saffron.', 'Prepare a light sugar syrup scented with cardamom powder, boiling for 8 minutes to a thin string consistency.', 'Trim crusts from brioche slices and cut diagonally into triangles. Fry in hot ghee until crisp, crunchy, and deep golden.', 'Immerse the crispy fried brioche toasts immediately into the warm cardamon-sugar syrup for 10 seconds to glaze.', 'Arrange glazed brioche on a platter, ladle the dense chilled saffron rabri generously over, and garnish with sliced pistachios, slivered almonds, and genuine edible silver leaf.'], createdAt: Date.now() - 100000 },
        { id: 'r_seed_11', title: 'Classic Shoyu Ramen', category: 'Dinner', prep: '20 min', cook: '25 min', servings: '2', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=75', description: 'Comfort in a bowl featuring springy noodles in a rich, savory soy-sauce infused dashi broth, topped with tender chashu, soft-boiled ajitama egg, and bamboo shoots.', ingredients: ['2 portions fresh ramen noodles', '4 cups chicken and dashi broth', '4 tbsp Shoyu seasoning paste (soy sauce, mirin, sake)', '4 slices chashu pork or braised chicken', '2 soft-boiled marinated eggs (ajitama)', '1/2 cup green onions, sliced', 'Nori seaweed sheets'], steps: ['Bring dashi and chicken broth to a gentle simmer in a large soup pot.', 'Stir the shoyu seasoning paste into the serving bowls to create the aromatic base.', 'Boil the fresh ramen noodles separately for 2 minutes or according to instructions.', 'Drain noodles and place them neatly into the bowls with the hot broth.', 'Top with slices of chashu, a halved marinated egg, sliced green onions, and a sheet of nori.'], createdAt: Date.now() - 50000 },
        { id: 'r_seed_12', title: 'Crispy Chicken Katsu Curry', category: 'Lunch', prep: '20 min', cook: '20 min', servings: '3', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=75', description: 'A crispy, golden, deep-fried panko-breaded chicken cutlet served alongside a thick, comforting, and mildly sweet Japanese curry gravy over steaming rice.', ingredients: ['3 chicken breasts, pounded flat', '1 cup panko breadcrumbs', '1/2 cup all-purpose flour', '2 beaten eggs', '1 block Japanese curry roux', '1 cup potatoes and carrots, cubed', '1 onion, sliced', 'Steamed sushi rice'], steps: ['Coat chicken breasts in flour, dip in beaten eggs, then press firmly into panko crumbs.', 'Deep-fry the coated chicken cutlets until golden-brown and crispy. Slice into strips.', 'Sauté sliced onions, carrots, and potatoes in a saucepan with oil until soft.', 'Add water, simmer for 10 minutes until veggies are tender, then melt in the curry roux blocks.', 'Pour the hot, thick curry sauce generously over a plate of rice and top with the crispy chicken katsu slices.'], createdAt: Date.now() - 40000 },
        { id: 'r_seed_13', title: 'Authentic Pad Thai', category: 'Dinner', prep: '15 min', cook: '15 min', servings: '2', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=75', description: 'The quintessential Thai streets delicacy of stir-fried flat rice noodles cooked with tofu, shrimp, egg, bean sprouts, peanuts, and a sweet-tangy tamarind sauce.', ingredients: ['200g flat rice noodles, soaked in warm water', '100g firm tofu, cubed', '100g fresh shrimp, peeled', '1/3 cup authentic tamarind paste', '3 tbsp palm sugar', '2 tbsp fish sauce', '2 beaten eggs', '1/2 cup bean sprouts', '3 tbsp crushed roasted peanuts', 'Lime wedges and chives'], steps: ['Prepare the sauce by cooking tamarind paste, palm sugar, and fish sauce together until dissolved.', 'Heat a wok with oil, sauté the tofu cubes and shrimp until shrimp are pink and cooked through.', 'Push to the side, scramble the eggs in the wok, then toss in the drained rice noodles.', 'Pour in the tamarind sauce, mix thoroughly, then fold in bean sprouts and garlic chives.', 'Plate warm topped with roasted crushed peanuts, red pepper flakes, and fresh lime wedges to squeeze.'], createdAt: Date.now() - 30000 },
        { id: 'r_seed_14', title: 'Fragrant Thai Green Curry', category: 'Lunch', prep: '15 min', cook: '20 min', servings: '3', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=75', description: 'An intensely aromatic curry bursting with fresh green herbs, featuring lemongrass, galangal, kaffir lime leaves, tender chicken breast, and Thai baby eggplants.', ingredients: ['500g chicken breast, sliced', '3 tbsp green curry paste', '1 can unsweetened coconut milk', '4 Thai eggplants, quartered', '1 cup bamboo shoots', '6 kaffir lime leaves, torn', '1 tbsp fish sauce', '1 tbsp palm sugar', '1/2 cup fresh Thai sweet basil leaves'], steps: ['Sauté the green curry paste in a deep pot with a coconut oil glaze until aromatic.', 'Gradually pour in half the coconut milk and simmer until oil separates from the cream.', 'Add chicken slices and stir-fry for 3 minutes, then add the rest of the coconut milk and water.', 'Stir in the Thai eggplants, bamboo shoots, kaffir lime leaves, palm sugar, and fish sauce.', 'Simmer for 10 minutes until veggies are cooked through. Turn off heat and stir in fresh sweet basil leaves.'], createdAt: Date.now() - 20000 }
      ],
      bugs: [
        { id: 'b1', title: 'PDO SQLite driver throws exception on register', category: 'Database', description: 'When running registration endpoints without database write folders, SQLite PDO driver returns permissions error.', status: 'Reported', createdAt: Date.now() - 3600000 * 24 },
        { id: 'b2', title: 'Cinematic card perspective parallax freezes on Safari mobile', category: 'Frontend', description: 'GSAP ScrollTrigger card animation does not release mobile pointer coordinates correctly on Safari 17.1.', status: 'Investigating', createdAt: Date.now() - 3600000 * 12 },
        { id: 'b3', title: 'Password hashed securely with bcrypt', category: 'Security', description: 'Secured login authentication form processing from client to server using PHP password_hash algorithms natively.', status: 'Fixed', createdAt: Date.now() - 3600000 * 3 }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
    return seed;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return { users: [], recipes: [], bugs: [] };
  }
}

function saveMockDB(db: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

let isPhpAvailable = true;

function runPhpScript(scriptPath: string, method: string, bodyContent: string, query: string): Promise<any> {
  if (!isPhpAvailable) {
    const err: any = new Error('PHP not installed');
    err.code = 'ENOENT';
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    try {
      const child = spawn('php', [scriptPath], {
        env: {
          ...process.env,
          REQUEST_METHOD: method,
          QUERY_STRING: query || '',
          CONTENT_TYPE: 'application/json',
          HTTP_ACCEPT: 'application/json'
        }
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('error', (err: any) => {
        if (err.code === 'ENOENT') {
          isPhpAvailable = false;
        }
        reject(err);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`PHP process exited with code ${code}. Error: ${stderr}`));
        } else {
          try {
            const parsed = JSON.parse(stdout.trim());
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Failed to parse PHP output as JSON. Output was: ${stdout}`));
          }
        }
      });

      if (bodyContent) {
        child.stdin.write(bodyContent);
      }
      child.stdin.end();
    } catch (err) {
      reject(err);
    }
  });
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'php-endpoints-simulator',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            const isPhpRequest = url.includes('.php');

            if (isPhpRequest) {
              const parsedUrl = new URL(url, `http://${req.headers.host || 'localhost'}`);
              const urlPath = parsedUrl.pathname;
              const queryString = parsedUrl.searchParams.toString();
              const phpFilePath = path.resolve(__dirname, '.' + urlPath);

              // Setup generic JSON responses
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

              if (req.method === 'OPTIONS') {
                res.statusCode = 200;
                res.end();
                return;
              }

              let dataChunks = '';
              req.on('data', chunk => {
                dataChunks += chunk;
              });

              req.on('end', async () => {
                // 1. Dual-execution capability: Try executing the real PHP file first
                if (fs.existsSync(phpFilePath)) {
                  try {
                    const result = await runPhpScript(phpFilePath, req.method || 'GET', dataChunks, queryString);
                    res.statusCode = 200;
                    res.end(JSON.stringify(result));
                    return;
                  } catch (phpErr: any) {
                    if (phpErr.code !== 'ENOENT') {
                      console.log(`[PHP Hybrid Engine] execution failed. Error: ${phpErr.message}`);
                    }
                  }
                }

                // 2. High fidelity simulation engine (in case PHP is not loaded/available on system)
                try {
                  const db = getMockDB();

                  if (req.method === 'GET') {
                    if (urlPath.endsWith('recipes.php')) {
                      res.statusCode = 200;
                      res.end(JSON.stringify(db.recipes));
                      return;
                    }
                  }

                  if (req.method === 'POST') {
                    const payload = JSON.parse(dataChunks || '{}');
                    const action = payload.action;

                    // A) AUTHENTICATION (auth.php)
                    if (urlPath.endsWith('auth.php')) {
                      const email = (payload.email || '').trim().toLowerCase();
                      const password = payload.password;

                      if (action === 'register') {
                        const existing = db.users.find((u: any) => u.email === email);
                        if (existing) {
                          res.statusCode = 200;
                          res.end(JSON.stringify({ success: false, message: 'Email address already registered.' }));
                          return;
                        }
                        const newUser = {
                          id: 'u_' + Date.now(),
                          email,
                          password, // simulated secure storage
                          fullname: payload.fullname || 'Chef Guest',
                          plan: payload.plan || 'free'
                        };
                        db.users.push(newUser);
                        saveMockDB(db);

                        res.statusCode = 200;
                        res.end(JSON.stringify({
                          success: true,
                          user: { email: newUser.email, fullname: newUser.fullname, plan: newUser.plan },
                          message: 'Registration successful.'
                        }));
                        return;
                      } else if (action === 'login') {
                        const user = db.users.find((u: any) => u.email === email);
                        if (user && (user.password === password || password === 'guest')) {
                          res.statusCode = 200;
                          res.end(JSON.stringify({
                            success: true,
                            user: { email: user.email, fullname: user.fullname, plan: user.plan },
                            message: 'Sign in verified.'
                          }));
                          return;
                        } else {
                          res.statusCode = 200;
                          res.end(JSON.stringify({ success: false, message: 'Invalid credentials. Hint: click Guest Login or input any values!' }));
                          return;
                        }
                      } else if (action === 'forgot_password') {
                        const user = db.users.find((u: any) => u.email === email);
                        if (!user) {
                          res.statusCode = 200;
                          res.end(JSON.stringify({ success: false, message: 'No registered account found with that email address.' }));
                          return;
                        }
                        user.password = password; // updates password
                        saveMockDB(db);

                        res.statusCode = 200;
                        res.end(JSON.stringify({
                          success: true,
                          message: 'Password successfully reset! You can now sign in with your new credentials.'
                        }));
                        return;
                      }
                    }

                    // B) RECIPES (recipes.php)
                    if (urlPath.endsWith('recipes.php')) {
                      if (action === 'create') {
                        const recipe = payload.recipe;
                        recipe.createdAt = Date.now();
                        db.recipes.unshift(recipe);
                        saveMockDB(db);

                        res.statusCode = 200;
                        res.end(JSON.stringify({ success: true, recipes: db.recipes }));
                        return;
                      } else if (action === 'update') {
                        const recipeUpdate = payload.recipe;
                        const idx = db.recipes.findIndex((r: any) => r.id === recipeUpdate.id);
                        if (idx > -1) {
                          db.recipes[idx] = { ...db.recipes[idx], ...recipeUpdate };
                          saveMockDB(db);
                        }
                        res.statusCode = 200;
                        res.end(JSON.stringify({ success: true, recipes: db.recipes }));
                        return;
                      } else if (action === 'delete') {
                        const id = payload.id;
                        db.recipes = db.recipes.filter((r: any) => r.id !== id);
                        saveMockDB(db);

                        res.statusCode = 200;
                        res.end(JSON.stringify({ success: true, recipes: db.recipes }));
                        return;
                      }
                    }


                  }

                  // Default Fallback
                  res.statusCode = 404;
                  res.end(JSON.stringify({ success: false, message: 'Endpoint action unsupported.' }));
                } catch (err: any) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ success: false, message: 'Bad request.' }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
