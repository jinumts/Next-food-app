const sql = require('better-sqlite3');
const bcrypt = require('bcrypt');
const slugify = require('slugify');

const db = sql('meals.db');

// Create users table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`).run();

// Dummy users data
const dummyUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
  // Add more users as needed
];

// Insert dummy users data
const stmtInsertUser = db.prepare(`
  INSERT INTO users VALUES (
    null,
    @username,
    @email,
    @password
  )
`);

const stmtSelectUser = db.prepare(`
  SELECT COUNT(*) as count FROM users WHERE username = @username OR email = @email
`);

for (const user of dummyUsers) {
  // Check if the username or email already exists in the table
  const result = stmtSelectUser.get({ username: user.username, email: user.email });

  if (result.count === 0) {
    // If the username and email are unique, insert the user record
    stmtInsertUser.run(user);
  } else {
    console.warn(`Duplicate username or email found: ${user.username} / ${user.email}. Skipping insertion.`);
  }
}

// Create meals table if not exists
db.prepare(`
   CREATE TABLE IF NOT EXISTS meals (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug TEXT NOT NULL UNIQUE,
       title TEXT NOT NULL,
       image TEXT NOT NULL,
       summary TEXT NOT NULL,
       instructions TEXT NOT NULL,
       creator TEXT NOT NULL,
       creator_email TEXT NOT NULL
    )
`).run();

const dummyMeals = [
   {
     title: 'Juicy Cheese Burger',
     slug: 'juicy-cheese-burger',
     image: '/images/burger.jpg',
     summary:
       'A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft bun.',
     instructions: `
       1. Prepare the patty:
          Mix 200g of ground beef with salt and pepper. Form into a patty.
 
       2. Cook the patty:
          Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.
 
       3. Assemble the burger:
          Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.
 
       4. Serve:
          Complete the assembly with the top bun and serve hot.
     `,
     creator: 'John Doe',
     creator_email: 'johndoe@example.com',
   },
   {
     title: 'Spicy Curry',
     slug: 'spicy-curry-chicken',
     image: '/images/curry.jpg',
     summary:
       'A rich and spicy curry, infused with exotic spices and creamy coconut milk.',
     instructions: `
       1. Chop vegetables:
          Cut your choice of vegetables into bite-sized pieces.
 
       2. Sauté vegetables:
          In a pan with oil, sauté the vegetables until they start to soften.
 
       3. Add curry paste:
          Stir in 2 tablespoons of curry paste and cook for another minute.
 
       4. Simmer with coconut milk:
          Pour in 500ml of coconut milk and bring to a simmer. Let it cook for about 15 minutes.
 
       5. Serve:
          Enjoy this creamy curry with rice or bread.
     `,
     creator: 'Max Schwarz',
     creator_email: 'max@example.com',
   },
   {
     title: 'Homemade Dumplings',
     slug: 'homemade-dumplings',
     image: '/images/dumplings.jpg',
     summary:
       'Tender dumplings filled with savory meat and vegetables, steamed to perfection.',
     instructions: `
       1. Prepare the filling:
          Mix minced meat, shredded vegetables, and spices.
 
       2. Fill the dumplings:
          Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.
 
       3. Steam the dumplings:
          Arrange dumplings in a steamer. Steam for about 10 minutes.
 
       4. Serve:
          Enjoy these dumplings hot, with a dipping sauce of your choice.
     `,
     creator: 'Emily Chen',
     creator_email: 'emilychen@example.com',
   },
   {
     title: 'Classic Mac n Cheese',
     slug: 'classic-mac-n-cheese',
     image: '/images/macncheese.jpg',
     summary:
       "Creamy and cheesy macaroni, a comforting classic that's always a crowd-pleaser.",
     instructions: `
       1. Cook the macaroni:
          Boil macaroni according to package instructions until al dente.
 
       2. Prepare cheese sauce:
          In a saucepan, melt butter, add flour, and gradually whisk in milk until thickened. Stir in grated cheese until melted.
 
       3. Combine:
          Mix the cheese sauce with the drained macaroni.
 
       4. Bake:
          Transfer to a baking dish, top with breadcrumbs, and bake until golden.
 
       5. Serve:
          Serve hot, garnished with parsley if desired.
     `,
     creator: 'Laura Smith',
     creator_email: 'laurasmith@example.com',
   },
   {
     title: 'Authentic Pizza',
     slug: 'authentic-pizza',
     image: '/images/pizza.jpg',
     summary:
       'Hand-tossed pizza with a tangy tomato sauce, fresh toppings, and melted cheese.',
     instructions: `
       1. Prepare the dough:
          Knead pizza dough and let it rise until doubled in size.
 
       2. Shape and add toppings:
          Roll out the dough, spread tomato sauce, and add your favorite toppings and cheese.
 
       3. Bake the pizza:
          Bake in a preheated oven at 220°C for about 15-20 minutes.
 
       4. Serve:
          Slice hot and enjoy with a sprinkle of basil leaves.
     `,
     creator: 'Mario Rossi',
     creator_email: 'mariorossi@example.com',
   },
   {
     title: 'Wiener Schnitzel',
     slug: 'wiener-schnitzel',
     image: '/images/schnitzel.jpg',
     summary:
       'Crispy, golden-brown breaded veal cutlet, a classic Austrian dish.',
     instructions: `
       1. Prepare the veal:
          Pound veal cutlets to an even thickness.
 
       2. Bread the veal:
          Coat each cutlet in flour, dip in beaten eggs, and then in breadcrumbs.
 
       3. Fry the schnitzel:
       Heat oil in a pan and fry each schnitzel until golden brown on both sides.
 
       4. Serve:
       Serve hot with a slice of lemon and a side of potato salad or greens.
  `,
     creator: 'Franz Huber',
     creator_email: 'franzhuber@example.com',
   },
   {
     title: 'Fresh Tomato Salad',
     slug: 'fresh-tomato-salad',
     image: '/images/tomato-salad.jpg',
     summary:
       'A light and refreshing salad with ripe tomatoes, fresh basil, and a tangy vinaigrette.',
     instructions: `
       1. Prepare the tomatoes:
         Slice fresh tomatoes and arrange them on a plate.
     
       2. Add herbs and seasoning:
          Sprinkle chopped basil, salt, and pepper over the tomatoes.
     
       3. Dress the salad:
          Drizzle with olive oil and balsamic vinegar.
     
       4. Serve:
          Enjoy this simple, flavorful salad as a side dish or light meal.
     `,
     creator: 'Sophia Green',
     creator_email: 'sophiagreen@example.com',
   },
 ];

async function initData() {
  const stmtInsert = db.prepare(`
      INSERT INTO meals VALUES (
         null,
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
      )
   `);

  const stmtSelect = db.prepare(`
    SELECT COUNT(*) as count FROM meals WHERE slug = @slug
  `);

  for (const meal of dummyMeals) {
    // Check if the slug already exists in the table
    const result = stmtSelect.get({ slug: meal.slug });

    if (result.count === 0) {
      // If the slug is unique, insert the record
      stmtInsert.run(meal);
    } else {
      console.warn(`Duplicate slug found: ${meal.slug}. Skipping insertion.`);
    }
  }
}

initData();


























