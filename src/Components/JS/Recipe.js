import React, { useState } from "react";
import { Card, Descriptions, Table, Modal } from "antd";
import { EllipsisOutlined, CloseCircleOutlined } from "@ant-design/icons";
const { Meta } = Card;

// the details about a recipe, not including ingredients and instructions
export const RecipeDetail = () => {
  return (
    <div className="details">
      <Descriptions>
        <Descriptions.Item label="Category">Breads</Descriptions.Item>
        <Descriptions.Item label="Yields">1 loaf</Descriptions.Item>
        <Descriptions.Item label="Prep Time">15 min</Descriptions.Item>
        <Descriptions.Item label="Cook Time">65 min</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

// displays recipe ingredients
export const RecipeIngredients = () => {
  return (
    <div className="ingredients">
      <Table
        pagination={false}
        size={"small"}
        bordered={false}
        columns={[
          { dataIndex: "quantity", title: "Quantity" },
          { dataIndex: "ingredient", title: "Ingredient" },
        ]}
        dataSource={[
          { quantity: "2 cups", ingredient: "all-purpose flour", key: 1 },
          { quantity: "1 tsp", ingredient: "baking soda", key: 2 },
          { quantity: "1/4 tsp", ingredient: "salt", key: 3 },
          { quantity: "1/2 cup", ingredient: "butter", key: 4 },
          { quantity: "3/4 cup", ingredient: "brown sugar", key: 5 },
          { quantity: "2", ingredient: "large eggs, beaten", key: 6 },
          {
            quantity: "2 1/3 cups",
            ingredient: "mashed overripe bananas",
            key: 7,
          },
        ]}
      ></Table>
    </div>
  );
};

// displays recipe instructions
export const RecipeInstructions = () => {
  return (
    <div className="instructions">
      <h4>Instructions</h4>
      <ol>
        <li>Preheat oven to 350˚. Lightly grease a 9x5 inch load pan.</li>
        <li>
          In a large bowl, combine flour, baking soda and salt. In a separate
          bowl, cream together butter and brown sugar. Stir in eggs and mashed
          bananas until well blended. Stir banana mixture into flour micture;
          stir just to moisten. Pour batter into prepared loaf pan.
        </li>
        <li>
          Bake in preheated oven for 60-65 minutes, until a toothpick inserted
          into center of the loaf comes out clean. Let bread cool in pan for 10
          minutes, then turn out onto a wire rack.
        </li>
      </ol>
    </div>
  );
};

// contains all expanded recipe information in a modal
export const Recipe = (props) => {
  return (
    <Modal
      footer={<div></div>}
      className="whole-recipe"
      visible={props.visible}
      onCancel={() => props.cancel(false)}
      centered={true}
      closeIcon={<CloseCircleOutlined />}
      title={"Example Banana Bread"}
    >
      <img alt="recipe cover" src={props.img} />
      <RecipeDetail />
      <RecipeIngredients />
      <RecipeInstructions />
    </Modal>
  );
};

// contains basic overview of recipe listed in recipe page
export const RecipeCard = (props) => {
  // example title
  const recipeTitle = "Example Banana Bread";
  // example img
  const cardImgSrc =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTGJfbKn9js3qu2rm0m7UUw5EEKcEVXluVk4A&usqp=CAU";

  const [showRecipe, setShowRecipe] = useState(false);
  return (
    <div className="recipe-card">
      <Card
        onClick={() => {
          setShowRecipe(true);
        }}
        cover={<img alt="recipe cover" src={cardImgSrc} />}
        actions={[
          //   <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta title={recipeTitle} description={<RecipeDetail />} />
      </Card>
      <Recipe
        visible={showRecipe}
        cancel={(bool) => setShowRecipe(bool)}
        img={cardImgSrc}
      />
    </div>
  );
};
