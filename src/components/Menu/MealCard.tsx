import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMealIcon, editIcon } from "../../icons/icons";
import { Category } from "../MealSetup/Type";
import classes from "./MealCard.module.css";

type Props = {
  id: string;
  key: string;
  image: any;
  title: string;
  ingredients: any[];
  price: number;
  weight: number;
  handleDelete: () => Promise<void>;
  category: Category | null;
  allergens: string;
  recipe: string;
  preparationTime: number;
  preparationZone: string | null | undefined;
  tvaType: string;
  tvaPercentage: number;
  masaNetto: number;
};
const MealCard = ({
  key,
  image,
  title,
  ingredients,
  price,
  weight,
  handleDelete,
  category,
  id,
  allergens,
  recipe,
  preparationTime,
  preparationZone,
  tvaType,
  tvaPercentage,
  masaNetto,
}: Props) => {
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";

  const [editButtonIsClicked, setEditButtonIsClicked] = useState(false);
  const handleClickEditButton = () => {
    setEditButtonIsClicked(true);
  };

  const isExistingProduct = true;

  const navigate = useNavigate();

  if (editButtonIsClicked)
    navigate("/menu/mealSetup", {
      state: {
        isExistingProduct: isExistingProduct,
        key: key,
        image: image,
        title: title,
        ingredients: ingredients,
        price: price,
        weight: weight,
        category: category,
        id: id,
        allergens: allergens,
        recipe: recipe,
        preparationTime: preparationTime,
        preparationZone: preparationZone,
        tvaType: tvaType,
        tvaPercentage: tvaPercentage,
        masaNetto: masaNetto,
      },
    });

  return (
    <div className={classes.MealCard}>
      <div className={classes.CardImageContainer}>
        <button className={classes.DeleteButton} onClick={() => handleDelete()}>
          {deleteMealIcon}
        </button>
        <img
          className={classes.CardImage}
          src={image === null ? DEFAULT_IMAGE : image}
          alt={title}
        />
      </div>
      <div className={classes.CardContent}>
        <div className={classes.ContentTitle}>
          <span className={classes.ContentTitleText}>{title}</span>
          <div className={classes.ContentTitleIngridients}>
            {ingredients.map((ingredient, index) => (
              <span key={ingredient.id}>
                {ingredient.ingredient?.name}
                {index !== ingredients.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "auto", width: "100%" }}>
          <div className={classes.ContentFooter}>
            <span className={classes.ContentFooterPrice}>{price} MDL</span>
            <span className={classes.ContentFooterWeight}>{weight} g</span>
          </div>
          <div className={classes.ContentActions}>
            <button
              className={classes.ContentAction}
              onClick={handleClickEditButton}
            >
              <span className={classes.ContentActionIcon}>{editIcon}</span>
              <span className={classes.ContentActionText}>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MealCard;
