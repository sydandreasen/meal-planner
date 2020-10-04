export const loadingMessage = () => {
  const options = [
    // "Good habits take time, and so does loading this page.",
    // "Don't rush life; live in the present. Always, but especially now because we aren't ready for you yet.",
    // `"Patience is a bitter plant that produces sweet fruit." - Charles R. Swindoll`,
    // "Preparing to support your meal planning dreams...",
    // "You're too fast for us! Give us a moment to catch up.",
    "Loading your Dashboard...",
  ];
  const random = Math.floor(Math.random() * options.length);
  return options[random];
};

export const foodNutrients = (props) => {
  let foodCals = props.food.cals; // by serving
  let foodQuantity = props.food.quantity;
  foodCals *= foodQuantity;
  return { cals: foodCals, quantity: foodQuantity };
};

export const mealNutrients = (props) => {
  let mealCals = 0;
  props.foods.forEach((food) => (mealCals += food.cals)); // cals planned, not by serving
  return { cals: mealCals };
};

export const dayNutrients = (props) => {
  let dayCals = 0;
  props.meals.forEach((meal) =>
    meal.foods.forEach((food) => (dayCals += food.cals))
  );
  return { cals: dayCals };
};
