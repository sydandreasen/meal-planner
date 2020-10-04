import * as firebase from "firebase/app";
// Required for side-effects
require("firebase/database");
const db = firebase.database();

function DbHandler(user) {
  // if here, successfully logged in, create a collection for them
  const userPath = db.ref("users/" + user.uid);

  // write specified data to specified path
  const writeData = (path, ...info) => {
    path.set(
      // note this will overwrite all information at the designated path, even at child paths
      // to update without overwriting, use .update
      ...info,
      (error) =>
        error
          ? console.error("Write failed : ", error)
          : console.log("Write Successful")
    );
  };

  const updateData = (path, ...info) => {
    path.update(...info, (error) =>
      error
        ? console.error("Update failed : ", error)
        : console.log("Update Successful")
    );
  };

  updateData(userPath, { updated: new Date().toString() });

  // listen to events at path
  // ( or the .once method will trigger once and then stop listening )
  //   userPath.on("value", (snapshot) => console.log(snapshot.val()));

  // build up dummy data
  // first, easy account settings
  //   const settingsPathStr = "users/" + user.uid + "/settings";
  //   let viewSettings = { defaultPage: "planning", defaultView: "weekly" };
  //   updateData(db.ref(settingsPathStr + "/view"), viewSettings);
  //   let mealSettings = [
  //     { name: "Breakfast", key: 1 },
  //     { name: "Lunch", key: 2 },
  //     { name: "Dinner", key: 3 },
  //   ];
  //   writeData(db.ref(settingsPathStr + "/meals"), mealSettings);
  //   let goalSettings = {
  //     calories: {
  //       amount: 1330,
  //       unit: "calories",
  //     },
  //     carbohydrates: {
  //       amount: 117,
  //       unit: "g",
  //     },
  //     fat: {
  //       amount: 53,
  //       unit: "g",
  //     },
  //     sugar: {
  //       amount: 50,
  //       unit: "g",
  //     },
  //     protein: {
  //       amount: 101,
  //       unit: "g",
  //     },
  //   };
  //   updateData(db.ref(settingsPathStr + "/goals"), goalSettings);

  // all meal planning information
  const plansPathStr = "users/" + user.uid + "/plans";
  let dates = [];
  dates[0] = new Date().toDateString();
  for (let i = 1; i < 7; i++) {
    let date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toDateString());
  }
  let meals = [
    // also need to use queried meal keys and names here too
    {
      name: "Breakfast",
      key: 1,
      foods: [
        {
          foodId: "asdf", // use to query category and nutrients
          quantity: {
            amount: 1,
            unit: "g",
          },
        },
      ],
    },
    {
      name: "Lunch",
      key: 2,
      foods: [
        {
          foodId: "asdf", // use to query category and nutrients
          quantity: {
            amount: 1,
            unit: "g",
          },
        },
      ],
    },
    {
      name: "Dinner",
      key: 3,
      foods: [
        {
          foodId: "asdf", // use to query category and nutrients
          quantity: {
            amount: 1,
            unit: "g",
          },
        },
      ],
    },
  ];
  dates.forEach((date) => {
    writeData(db.ref(plansPathStr + "/" + date), meals);
  });

  // all recipe information
  const recipePathStr = "users/" + user.uid + "/recipes";
  let recipes = [
    {
      recipeId: "abcdef123456", // use this to query other information
    },
  ];
  writeData(db.ref(recipePathStr), recipes); // careful of overwriting! will need to have entire existing array of recipes too if going to add a new

  // all grocery information
  const groceryPathStr = "users/" + user.uid + "/groceries";
  let groceries = [
    {
      foodId: "food_a1gb9ubb72c7snbuxr3weagwv0dd", // apple
      quantity: 1,
      units: "whole",
      category: "asdf", // query foodCategory
    },
    {
      foodId: "food_ahebfs0a985an4aubqaebbipra58", // flour
      quantity: 1,
      units: "cup",
      category: "asdf", // query foodCategory
    },
    {
      foodId: "food_btxz81db72hwbra2pncvebzzzum9", // salt
      quantity: 1,
      units: "tsp",
      category: "asdf", // query foodCategory
    },
  ];
  // nutrients and category information for each grocery should be
  // queried on login and stored in state
  writeData(db.ref(groceryPathStr), groceries); // beware using set() instead of update(), will overwrite

  // to delete data, use .remove() on the ref location or specify null for the data
  // data reading is done with .on() or .once()
}

export default DbHandler;
