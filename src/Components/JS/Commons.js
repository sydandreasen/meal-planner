import axios from "axios";
import { store } from "react-notifications-component";

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

// run parser request to find foodId from a search string
// contains a few callback functions for presenting food information
export const parseRequest = async (
  search,
  setFoodId, // function
  setMeasureURI, // function
  setFoodWord, // function
  setFoodInfo // function
) => {
  // get the URL encoded for the parser request
  const foodStr = search.replace(" ", "%20");
  const parserReq = `https://api.edamam.com/api/food-database/v2/parser?ingr=${foodStr}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}`;

  // get info from parser request to give to nutrients request
  let measureURI = "";
  let foodId = "";
  let foodWord = ""; // word for food in English

  // make parser request
  await axios
    .get(parserReq)
    .then(async (response) => {
      // find which measure is for serving
      for (let hint of response.data.hints) {
        for (let measure of hint.measures) {
          if (measure.label === "Serving") {
            measureURI = measure.uri;
            foodId = hint.food.foodId;
            foodWord = hint.food.label;
            break;
          }
        }
        if (foodId.length > 0) {
          break;
        }
      }
      // alert if serving not available... could eventually be changed into defaulting to very first measurement available
      if (!foodId.length > 0) {
        store.addNotification({
          title: "Error!",
          message: `Unable to find serving information for ${search}.`,
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 10000,
            onScreen: true,
          },
        });
      }

      setFoodId(foodId);
      setMeasureURI(measureURI);
      setFoodWord(foodWord);

      // then find nutrients information
      await nutrientRequest([foodId], [measureURI], (foodInfo) =>
        setFoodInfo(foodInfo)
      );
    })
    .catch(() =>
      store.addNotification({
        title: "Error!",
        message:
          "We failed to fetch food information. You may be operating too fast for us! This application is limited by a developer subscription to the Edamam API. Specifically, only information for up to 6 foods can be requested at a time. You may need to wait a minute or reload the page. We apologize for any inconveniences.",
        type: "warning",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 10000,
          onScreen: true,
        },
      })
    );
};

// make nutrients request from foodId and measurement URI
// set list of returned food info
export const nutrientRequest = async (foodIds, measureURIs, setFoodInfo) => {
  const quantity = 1;
  let tempInfo = [];
  let ingredients = [];
  foodIds.forEach((id, index) => {
    ingredients.push({
      quantity: quantity,
      measureURI: measureURIs[index],
      foodId: id,
    });
  }); // at least with free version, actually only one food allowed to search at once

  // nutrients request
  await axios
    .post(
      `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}`,
      {
        ingredients: ingredients,
      }
    )
    .then((response) => {
      tempInfo[0] = {
        label: "Calories",
        quantity: response.data.calories,
        unit: "cals",
      };
      let nutrientNames = Object.getOwnPropertyNames(
        response.data.totalNutrients
      );
      nutrientNames.forEach((nutrient) => {
        tempInfo.push({
          label: response.data.totalNutrients[nutrient].label,
          quantity: response.data.totalNutrients[nutrient].quantity,
          unit: response.data.totalNutrients[nutrient].unit,
        });
      });
      setFoodInfo(tempInfo);
    })
    .catch(() =>
      store.addNotification({
        title: "Error!",
        message:
          "We failed to fetch nutrition information. You may be operating too fast for us! This application is limited by a developer subscription to the Edamam API. Specifically, only information for up to 6 foods can be requested at a time. You may need to wait a minute or reload the page. We apologize for any inconveniences.",
        type: "warning",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 10000,
          onScreen: true,
        },
      })
    );
};
