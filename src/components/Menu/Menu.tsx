import React, { useEffect, useMemo, useState } from "react";
import classes from "./Menu.module.css";
import Title from "../Title";
import { Col } from "react-bootstrap";
import {
  dotIcon,
  mealsIcon,
  notificationIcon,
  uploadIcon,
} from "../../icons/icons";
import Button from "../../UI/Button";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { downIcon } from "../../icons/icons";
import { Category } from "../MealSetup/Type";
import {
  deleteProduct,
  getAllProduts,
  getCategories,
  getProductByCategory,
} from "../../auth/api/requests";
import MealCard from "./MealCard";
import { toast } from "react-toastify";
import { NotificationButton } from "../Statistics/Header";

interface MenuProps {}

interface Ingredient {
  id: string;
  name: string;
  grams: number;
  unit?: { value: string; label: string };
  ingredient?: {
    id: string;
    name: string;
  };
}

interface Meal {
  id: string;
  type: string;
  title: string;
  image: string;
  productIngredients: Ingredient[];
  price: number;
  weight: number;
  category: any;
  allergens: string;
  recipe: string;
  preparationTime: number;
  preparationZone: any;
  tvaType: string;
  tvaPercentage: number;
  masaNetto: number;
}

const Menu: React.FC<MenuProps> = () => {
  const [loading, setLoading] = useState(true);

  const subtitle =
    "Let's start by adding your first meal \n or instantly import the whole menu";
  const customDownIcon = <div className={classes.iconPadding}>{downIcon}</div>;

  const AllProducts: Category = useMemo(
    () => ({
      id: "1",
      name: "All",
    }),
    []
  );

  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedItem, setSelectedItem] = useState<Category | null>(
    AllProducts
  );
  const [selectedFoodCategory, setSelectedFoodCategory] =
    useState<string | null>();
  const handleClick = (item: Category) => {
    setSelectedItem((prevSelectedItem) =>
      prevSelectedItem?.id === item.id ? AllProducts : item
    );
  };
  const [products, setProducts] = useState<Meal[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRestaurant = JSON.parse(
          localStorage.getItem("selectedRestaurant") ?? "null"
        );
        if (selectedItem?.id !== "1") {
          const productData = await getProductByCategory(
            selectedItem?.id,
            storedRestaurant.id
          );
          setProducts(productData);
        } else {
          const productData = await getAllProduts(storedRestaurant.id);
          setProducts(productData);
        }
        const categoriesData = await getCategories(storedRestaurant.id);
        setCategories([AllProducts, ...categoriesData]);
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, [selectedItem, AllProducts]);

  const success = () =>
    toast.success("Succes!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleDeleteProduct = async (productId) => {
    try {
      const storedRestaurant = JSON.parse(
        localStorage.getItem("selectedRestaurant") ?? "null"
      );
      await deleteProduct(productId);
      success();
      const updatedProductData = await getProductByCategory(
        selectedItem?.id,
        storedRestaurant.id
      );
      setProducts(updatedProductData);
    } catch (error) {
      console.error("Can't delete product:", error);
    }
  };

  const mealsList = categories.map((el) => (
    <li
      key={el.id}
      className={`${selectedItem?.id === el.id ? classes.selected : ""} ${
        classes.MealCategory
      }`}
      onClick={() => handleClick(el)}
    >
      <span
        className={`${
          selectedItem?.id === el.id
            ? classes.selectedText
            : classes.MealCategoryText
        }`}
      >
        {el.name}
      </span>
    </li>
  ));

  const mealCards = products.map((product) => (
    <div>
      <MealCard
        key={product.id}
        id={product.id}
        image={product.image}
        title={product.title}
        ingredients={product.productIngredients}
        price={product.price}
        weight={product.weight}
        handleDelete={() => handleDeleteProduct(product.id)}
        category={product.category}
        allergens={product.allergens}
        recipe={product.recipe}
        preparationTime={product.preparationTime}
        preparationZone={product.preparationZone}
        tvaType={product.tvaType}
        tvaPercentage={product.tvaPercentage}
        masaNetto={product.masaNetto}
      />
    </div>
  ));

  const MenuTitle = "Restaurant menu";
  const MenuSubtitle = `${products.length} item${
    products.length > 1 ? "s" : ""
  }`;

  return (
    <>
      {!loading ? (
        categories.length > 0 ? (
          <div>
            <div className={classes.header}>
              <div className={classes.Heading}>
                <Title title={MenuTitle} subtitle={MenuSubtitle} />
              </div>
              <div className={classes.HeaderActions}>
                <button
                  className={classes.ImportButton}
                  style={{ cursor: "default", opacity: "0.5" }}
                >
                  <span className={classes.ImportButtonIcon}>{uploadIcon}</span>
                  <span className={classes.ImportButtonText}>Import CSV</span>
                </button>
                <Link to={{ pathname: "/menu/mealSetup" }}>
                  <Button
                    text="+ Add new meal"
                    className={`${classes.createMealButton} pointer`}
                  />
                </Link>
                <NotificationButton />
              </div>
            </div>
            <div className={classes.meals}>
              <ul className={classes.mealsList}>{mealsList}</ul>
              <div className={classes.mealCards}>{mealCards}</div>
            </div>{" "}
          </div>
        ) : (
          <Col className={`${classes.menu} my-auto`}>
            {mealsIcon}
            <div className={classes.menu_title}>
              <Title title="You have no meals" subtitle={subtitle} />
            </div>
            <div className={classes.form_buttons}>
              <Button
                icon={customDownIcon}
                text="Import CSV"
                type={"button"}
                secondary={true}
                style={{ cursor: "default", opacity: "0.5" }}
              />

              <Link
                to={{
                  pathname: "/menu/mealSetup",
                }}
              >
                <Button text={`+ Create meal`} />
              </Link>
            </div>
          </Col>
        )
      ) : null}
      <Spinner loading={loading} />
    </>
  );
};

export default Menu;
