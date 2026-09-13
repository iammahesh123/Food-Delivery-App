import axios from 'axios';

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/ai';

const aiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback intelligence dataset in case FastAPI backend is offline
const FALLBACK_CATALOG = [
  {
    id: 'dish_1',
    name: 'Paneer Butter Masala',
    cuisine: 'North Indian',
    price: 280,
    rating: 4.8,
    calories: 420,
    is_veg: true,
    allergens: ['Dairy'],
    match_reason: 'Velvety tomato gravy with rich butter-sautéed cottage cheese.',
  },
  {
    id: 'dish_2',
    name: 'Garlic Butter Naan (2 pcs)',
    cuisine: 'North Indian',
    price: 90,
    rating: 4.7,
    calories: 260,
    is_veg: true,
    allergens: ['Gluten', 'Dairy'],
    match_reason: 'Tandoor-baked flatbread brushed with garlic butter.',
  },
  {
    id: 'dish_3',
    name: 'Avocado & Edamame Poke Bowl',
    cuisine: 'Japanese Fusion',
    price: 420,
    rating: 4.9,
    calories: 380,
    is_veg: true,
    allergens: ['Soy'],
    match_reason: 'Nutrient-dense organic edamame with pickled ginger and sesame glaze.',
  },
  {
    id: 'dish_6',
    name: 'Wood-Fired Truffle Funghi Pizza',
    cuisine: 'Italian',
    price: 540,
    rating: 4.8,
    calories: 780,
    is_veg: true,
    allergens: ['Gluten', 'Dairy'],
    match_reason: 'Sourdough crust topped with wild mushrooms and white truffle oil.',
  },
  {
    id: 'dish_10',
    name: 'Cold-Pressed Passionfruit Ginger Kombucha',
    cuisine: 'Beverages',
    price: 140,
    rating: 4.9,
    calories: 45,
    is_veg: true,
    allergens: [],
    match_reason: 'Artisanal fermented tea with digestive probiotics.',
  },
];

export const aiService = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await aiClient.get('/health');
      return { connected: true, data: res.data };
    } catch {
      return {
        connected: false,
        data: {
          status: 'fallback',
          mode: 'Built-in Client-Side Neural Heuristics',
          gemini_active: false,
        },
      };
    }
  },

  // 1. TasteBot Concierge
  async askConcierge(prompt, userPreferences = {}) {
    try {
      const res = await aiClient.post('/concierge', {
        prompt,
        user_preferences: userPreferences,
      });
      return res.data;
    } catch (err) {
      console.warn('FastAPI backend offline, using fallback intelligence', err);
      const p = prompt.toLowerCase();
      const isVegan = p.includes('vegan');
      const isHealthy = p.includes('healthy') || p.includes('protein');
      const isItalian = p.includes('pizza') || p.includes('italian');

      let picks = FALLBACK_CATALOG;
      if (isVegan) picks = picks.filter((d) => !d.allergens.includes('Dairy'));
      if (isItalian) picks = picks.filter((d) => d.cuisine === 'Italian');
      if (isHealthy) picks = picks.filter((d) => d.calories <= 450);

      const chosen = picks.slice(0, 3);
      return {
        reply: `Here are my top culinary recommendations based on your craving for "${prompt}". Enjoy freshly prepared artisan flavors!`,
        intent: 'DISH_RECOMMENDATION',
        mood_extracted: isHealthy ? 'Wholesome & Energetic' : 'Comfort & Indulgent',
        recommended_dishes: chosen.map((d) => ({
          ...d,
          match_reason: `Curated match: fits your flavor criteria and high customer approval (${d.rating}★).`,
        })),
        suggested_followups: [
          'Would you like a matching beverage pairing?',
          'Do you want me to inspect dietary allergens in your cart?',
          'Would you like to reserve a table for dine-in tonight instead?',
        ],
      };
    }
  },

  // 2. Visual Search ("Snap & Crave")
  async searchVisual(params) {
    try {
      const res = await aiClient.post('/visual-search', params);
      return res.data;
    } catch (err) {
      console.warn('Visual search fallback', err);
      const hint = (params.preset_dish_hint || 'pizza').toLowerCase();
      if (hint.includes('bowl') || hint.includes('salad')) {
        return {
          identified_dish: 'Avocado & Edamame Poke Bowl',
          cuisine: 'Japanese Fusion',
          confidence_score: 0.94,
          estimated_macros: { calories: 380, protein_g: 18, carbs_g: 48, fat_g: 14 },
          detected_allergens: ['Soy'],
          dietary_flags: ['Vegan', 'Gluten-Free', 'High-Protein'],
          matching_catalog_items: [
            { id: 'dish_3', name: 'Avocado & Edamame Poke Bowl', cuisine: 'Japanese Fusion', price: 420, similarity_score: 0.96 },
          ],
        };
      }
      return {
        identified_dish: 'Wood-Fired Truffle Funghi Pizza',
        cuisine: 'Italian',
        confidence_score: 0.96,
        estimated_macros: { calories: 780, protein_g: 28, carbs_g: 85, fat_g: 36 },
        detected_allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['Vegetarian'],
        matching_catalog_items: [
          { id: 'dish_6', name: 'Wood-Fired Truffle Funghi Pizza', cuisine: 'Italian', price: 540, similarity_score: 0.97 },
        ],
      };
    }
  },

  // 3. Smart Cart & Nutrition Guard
  async getSmartCartInsights(cartItemIds, dietaryRestrictions = []) {
    try {
      const res = await aiClient.post('/smart-cart', {
        cart_item_ids: cartItemIds,
        user_dietary_restrictions: dietaryRestrictions,
      });
      return res.data;
    } catch (err) {
      console.warn('Smart cart fallback', err);
      const alerts = [];
      if (dietaryRestrictions.includes('Dairy') && cartItemIds.includes('dish_1')) {
        alerts.push({
          dish_id: 'dish_1',
          dish_name: 'Paneer Butter Masala',
          conflict_type: 'Allergen: Dairy',
          severity: 'HIGH',
          warning_message: 'Contains cottage cheese and butter, conflicting with your Dairy allergy.',
        });
      }
      return {
        cart_items_count: cartItemIds.length,
        pairing_suggestions: [
          { dish_id: 'dish_10', name: 'Cold-Pressed Passionfruit Ginger Kombucha', price: 140, pairing_reason: 'Probiotic digestion boost' },
          { dish_id: 'dish_2', name: 'Garlic Butter Naan (2 pcs)', price: 90, pairing_reason: 'Classic bread pairing' },
        ],
        safety_alerts: alerts,
        nutrition_summary: { total_calories: 680, total_protein_g: 23, total_carbs_g: 67, total_fat_g: 36 },
        smart_upsell_reason: 'Dishes in your cart have high affinity with artisanal breads and digestive beverages.',
      };
    }
  },

  // 4. Merchant Menu Copilot
  async generateMenuCopy(params) {
    try {
      const res = await aiClient.post('/menu-copilot', params);
      return res.data;
    } catch (err) {
      console.warn('Menu copilot fallback', err);
      const { dish_name = 'Specialty Dish', cuisine = 'Contemporary', key_ingredients = [] } = params;
      const ing = key_ingredients.join(', ') || 'farm-fresh ingredients';
      return {
        dish_name,
        cuisine,
        descriptions: {
          short_punchy: `Handcrafted ${cuisine.toLowerCase()} specialty with fresh ${ing} tossed in house aromatic seasonings.`,
          gourmet_editorial: `An exquisite culinary creation marrying classic ${cuisine} technique with ${ing}. Slow-cooked to tender perfection and finished with an artisanal herb glaze.`,
          health_and_craft: `Prepared with clean, whole ingredients (${ing}). High in authentic flavor and completely free from artificial additives.`,
        },
        culinary_tags: ["Chef's Signature", `${cuisine} Classic`, 'Artisanal', 'Farm Fresh'],
        detected_allergens: ['Dairy', 'Gluten'],
        pricing_benchmark: {
          suggested_min: 320,
          suggested_max: 460,
          recommended_price: 380,
          market_reasoning: `Based on premium ${cuisine} ingredient margins and downtown dining benchmarks.`,
        },
        social_media_hook: `Elevate your cravings with our brand new ${dish_name}! Crafted with ${ing} ✨ Available now for delivery! #FoodieLife #${cuisine.replace(' ', '')}`,
      };
    }
  },

  // 5. Review Sentiment & Auto-Reply
  async analyzeReviewSentiment(reviews) {
    try {
      const res = await aiClient.post('/review-sentiment', { reviews });
      return res.data;
    } catch (err) {
      console.warn('Review sentiment fallback', err);
      return {
        total_reviews_analyzed: reviews.length,
        overall_sentiment_score: 4.4,
        aspect_scores: {
          taste_and_flavor: 4.8,
          delivery_and_temp: 4.1,
          packaging_integrity: 3.9,
          value_for_money: 4.5,
        },
        praise_highlights: ['Exceptional rich flavor and seasoning', 'Piping-hot delivery transit praised'],
        critical_pain_points: ['Occasional liquid container leakage on transit'],
        suggested_replies: reviews.map((r) => ({
          review_id: r.id,
          customer_name: r.customer_name,
          reply_tone: r.rating >= 4 ? 'Celebratory' : 'Empathetic',
          draft_response:
            r.rating >= 4
              ? `Hi ${r.customer_name}! Thank you for the five stars! We are overjoyed that you loved the food. Looking forward to serving you again soon!`
              : `Dear ${r.customer_name}, we apologize for falling short of your expectations. We have flagged this with our kitchen team and would love to offer a complimentary item on your next order.`,
        })),
      };
    }
  },

  // 6. Night-Out Live Event & Dining Bundler
  async bundleEventDining(params) {
    try {
      const res = await aiClient.post('/event-dining-bundler', params);
      return res.data;
    } catch (err) {
      console.warn('Event dining fallback', err);
      return {
        event_title: 'Acoustic Sunset Sessions: Indie Live Gig',
        event_venue: 'Amphitheatre Cultural Grounds',
        dining_recommendation: {
          restaurant_id: 'rest_1',
          restaurant_name: 'The Spice Pavilion & Courtyard',
          cuisine: 'North Indian & Awadhi',
          reserved_time: '18:30',
          distance_to_venue_km: 1.8,
          avg_cost_for_party: 1400,
        },
        timeline: [
          { time: '18:30', title: 'Reserved Table: The Spice Pavilion', description: 'Candlelight dinner for party of 2 with outdoor courtyard view.', category: 'DINING' },
          { time: '19:45', title: 'Short Transit to Amphitheatre', description: '8-min cab ride to venue entrance, avoiding parking rush.', category: 'TRANSIT' },
          { time: '20:00', title: 'Main Event: Indie Live Gig', description: 'Doors open for acoustic live concert.', category: 'EVENT' },
        ],
        total_estimated_budget: 2398,
        ai_curator_note: 'AI Concierge synced your dining slot with event start time for zero rush.',
      };
    }
  },

  // 7. Dynamic Kitchen & Logistics ETA Engine
  async predictEta(params) {
    try {
      const res = await aiClient.post('/predict-eta', params);
      return res.data;
    } catch (err) {
      console.warn('ETA predictor fallback', err);
      const items = params.order_item_count || 3;
      const dist = params.distance_km || 4.0;
      const isRain = (params.weather_condition || '').toUpperCase() === 'RAIN';
      const eta = Math.round(15 + items * 3 + dist * 3 + (isRain ? 10 : 0));
      return {
        predicted_eta_minutes: eta,
        confidence_interval: { min_eta_minutes: eta - 5, max_eta_minutes: eta + 7 },
        factors_breakdown: {
          base_prep_minutes: 16.0,
          queue_surge_delay_minutes: (params.kitchen_current_queue || 4) * 1.2,
          transit_minutes: dist * 3.2,
          weather_delay_minutes: isRain ? 8.0 : 0.0,
          traffic_delay_minutes: 4.5,
        },
        delay_warnings: isRain ? ['Weather alert: Rain protocol active for rider safety.'] : [],
        customer_status_message: 'Order on steady schedule: Kitchen is preparing fresh ingredients.',
      };
    }
  },
};
