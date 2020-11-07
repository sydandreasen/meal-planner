# Meal Planner

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Authentication](#authentication)
3. [Dashboard](#dashboard)
4. [Meal Planning](#meal-planning)
5. [Settings](#settings)
6. [Groceries](#groceries) (a wishlist page with paid API subscription)
7. [Recipes](#recipes) (a wishlist page with paid API subscription)

---

## Tech Stack{#tech-stack}

**Framework :** React.js

- **Top Library Used :** Ant Design

**API :** Edamam (free subscription)
**Hosting :** Google Firebase
**Authentication :** Google Firebase
**Database :** Google Firebase's NoSQL Real-Time Database

## Authentication{#authentication}

- SignUp with email and password
- Login with email and password to reach [Dashboard](#dashboard)
- Reset Password

## Dashboard{#dashboard}

- Navigate between pages or logout with the nav menu
- **Current Pages :**
  - 1. [Meal Planning](#meal-planning)
  - 2. [Settings](#settings)
- **Pages Opened Up With Paid API Subscription :**
  - 1. [Groceries](#groceries)
  - 2. [Recipes](#recipes)

## Meal Planning{#meal-planning}

**All Views :**

- Call to API to Add Foods by Serving Count
- Navigate to dates sequentially or 'jump to today'
- Change view (monthly/weekly/daily)
- Wishlist item with more API freedom : export and/or generate grocery list from user-specified planned days

**Monthly View :**

- Display names of foods planned for each meal in the month
- Select different dates
  - Selecting a date and then switching to Daily View is a quick way to navigate without using left or right arrows on daily page
- **Wishlist Items with More API Freedom :**
  - Display calorie totals on each individual day
  - Display calories next to each food name
  - Graph daily planned nutrients across the month to see change over time in a visual way

**Weekly View :**

- Display names of foods planned for each meal in the week
- Select different dates, like in Monthly View
- **Wishlist Items with More API Freedom :**
  - Display calorie totals on each individual day, meal, and food
  - Graph planned nutrients as line graph over time for the week

**Daily View :**

- Display names of foods planned for each meal in the day
- Display calories for each food, as well as meal and day totals
- Display planned qantity of each food (in servings)
- Expand individual foods to see nutritional information for planned number of servings
- Edit quantities of food, or remove them
- Display bar graphs that compares planned calories, carbs, fat, protein, and sugar compared to goal amounts (specified in the [Settings](#settings) page)

## Settings{#settings}

- View Settings
  - Which monthly/daily/weekly view is default on the Meal Planning page
  - With paid subscription to API and addition of more pages, set which page (Meal Planning, Groceries, or Recipes) is the default page to display
- Daily Nutritional Goals
  - For Calories, carbohydrates, protein, fat, and sugar
- Meal Settings
  - Edit number, order, color, and names of daily meals

## Groceries (a wishlist page with paid API subscription){#groceries}

- Categorize foods based on area of grocery store to commonly find the item
- Combine same foods across days into total quantity
- Allow to check off/delete items

## Recipes (a wishlist page with paid API subscription){#recipes}

- Add favorite recipes with API search or manually input recipes to save to account
- Recipes can be added to meal plans instead of searching API for foods
- Show overview recipe card and then click into it for more details, ingredients, and instructions
- Allow to edit or delete recipes from account
