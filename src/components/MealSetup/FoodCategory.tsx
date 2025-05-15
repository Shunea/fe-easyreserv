import React, { useState, useEffect } from "react";
import classes from "./FoodCategory.module.css";
import { getCategories } from "src/auth/api/requests";

interface FoodCategoryProps {
  onFoodCategorySelect: (item) => void;
  restaurantId: string;
  category: string;
}

const FoodCategory: React.FC<FoodCategoryProps> = ({
  onFoodCategorySelect,
  restaurantId,
  category,
}) => {
  const staticCategories: string[] = [
    "Hot",
    "Cold",
    "Fish",
    "Grill",
    "Desert",
    "Bar",
    "Hookah",
    // Add more static categories here if needed
  ];
  // const [categories, setCategories] = useState<string>(staticCategories);
  const [selectedItem, setSelectedItem] = useState<string>(category || "");

  const handleSelectCategory = (el: string) => {
    if (selectedItem === el) {
      setSelectedItem("");
      onFoodCategorySelect(null);
    } else {
      setSelectedItem(el);
      onFoodCategorySelect(el);
    }
  };

  useEffect(() => {
    setSelectedItem(category);
  }, [category]);

  const mealsList = staticCategories.map((el) => (
    <li
      key={el}
      className={selectedItem === el ? classes.selected : ""}
      onClick={() => handleSelectCategory(el)}
    >
      {el}
    </li>
  ));

  return (
    <div>
      <div className={classes.header}>
        <div className={classes.types}>
          <p className={classes.label}>Food Category</p>
        </div>
        <div className={classes.meals}>
          <ul className={classes.menuList}>{mealsList}</ul>
        </div>
      </div>
    </div>
  );
};

export default FoodCategory;
