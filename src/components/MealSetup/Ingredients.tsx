import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import classes from "./Ingredients.module.css";
import { ingredients_select_style } from "./../../UI/selectStyles";
import { addIngredient, getIngredientsBySearch } from "src/auth/api/requests";
import { deleteIcon } from "src/icons/icons";
import Select from "react-select";
import SimpleSelect from "../../UI/SimpleSelect";
import { toast } from "react-toastify";
export interface Ingredient {
  id?: string;
  name: string;
  count?: number;
  unit?: string;
  ingredient?: {
    name: string;
    id: string;
  };
}

interface IngredientsProps {
  onIngredientsChange?: (ingredient: Ingredient[]) => void;
  onWeightChange: (weight: number) => void;
  onEdittedWeightChange: (weight: number) => void;
  ingredientsFromBack: Ingredient[];
  isExistingProduct: boolean;
}

const Ingredients: React.FC<IngredientsProps> = ({
  onIngredientsChange,
  onWeightChange,
  ingredientsFromBack,
  isExistingProduct,
  onEdittedWeightChange,
}) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setButtonClicked(!buttonClicked);
    handleClick();
  };

  const [ingredients, setIngredients] = useState<any[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>(
    ingredientsFromBack || []
  );
  const [searchValue, setSearchValue] = useState("");

  const handleIngredientChange = async (selectedOption: any, index: number) => {
    const isExistingOption = ingredients.length > 0;

    const updatedSelectedIngredients = [...selectedIngredients];
    const updatedNewOptions = [...newOptions];

    if (isExistingOption) {
      const initialQuantity =
        ingredientsFromBack[index] && ingredientsFromBack[index].count;

      updatedSelectedIngredients[index] = {
        ...selectedOption,
        quantity: initialQuantity !== undefined ? initialQuantity : 0,
      };
      updatedNewOptions[index] = selectedOption;
      updatedNewOptions[index].quantity =
        initialQuantity !== undefined ? initialQuantity : 0;
    } else {
      const newOption = {
        value: selectedOption.value,
        label: selectedOption.label.replace(/^Create /, ""),
      };
      updatedSelectedIngredients[index] = newOption;
      updatedNewOptions[index] = newOption;

      const newIngredient: Ingredient = {
        name: newOption.value,
      };

      await addIngredient(newIngredient.name);
      setSearchValue("");
      success();
    }

    setSelectedIngredients(updatedSelectedIngredients);
    if (onIngredientsChange) {
      onIngredientsChange(updatedSelectedIngredients);
    }
  };
  let options: { value: string; label: string }[] = [];

  if (ingredients.length > 0) {
    options = ingredients.map((ingredient) => ({
      value: ingredient.id,
      label: ingredient.name,
    }));
  } else if (searchValue.trim() !== "") {
    options = [
      {
        value: searchValue,
        label: `Create ${searchValue}`,
      },
    ];
  } else if (ingredientsFromBack.length > 0) {
    options = ingredientsFromBack.map((ingredient) => ({
      value: ingredient.ingredient?.id || "",
      label: ingredient.ingredient?.name || "",
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filter = {
          search: searchValue,
        };
        const ingredientsResponse = await getIngredientsBySearch(filter);

        if (ingredientsResponse && ingredientsResponse.data) {
          setIngredients(ingredientsResponse.data);
        } else {
          console.error("Invalid response structure:", ingredientsResponse);
        }
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchData();
  }, [searchValue]);

  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      name: "",
      count: 0,
      unit: "grams",
    };
    setSelectedIngredients((prevList) => [...prevList, newIngredient]);
    setSearchValue("");
  };

  const handleUnitChange = (
    index: number,
    selectedOption: { value: string; label: string }
  ) => {
    const updatedSelectedIngredients = [...selectedIngredients];
    updatedSelectedIngredients[index].unit = selectedOption.value;
    setSelectedIngredients(updatedSelectedIngredients);
    if (onIngredientsChange) {
      onIngredientsChange(updatedSelectedIngredients);
    }
  };

  const handleCountChange = (index, value) => {
    const updatedSelectedIngredients = [...selectedIngredients];
    updatedSelectedIngredients[index].count = parseInt(value, 10);
    setSelectedIngredients(updatedSelectedIngredients);
    if (onIngredientsChange) {
      onIngredientsChange(updatedSelectedIngredients);
    }
  };

  const unitOptions = [
    { value: "grams", label: "grams" },
    { value: "kg", label: "kg" },
    { value: "ounces", label: "ounces" },
    { value: "mililiters", label: "mililiters" },
    { value: "liters", label: "liters" },
  ];

  const handleClick = () => {
    handleAddIngredient();
  };
  const handleDeleteIngredient = (index: number) => {
    const updatedSelectedIngredients = [...selectedIngredients];
    updatedSelectedIngredients.splice(index, 1);
    setSelectedIngredients(updatedSelectedIngredients);
  };

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

  const [fullWeight, setFullWeight] = useState(0);
  const [sumOfQuantities, setSumOfQuantities] = useState(0);

  useEffect(() => {
    if (isExistingProduct) {
      const sumOfWieghts = isExistingProduct
        ? selectedIngredients.reduce((total, item) => {
            if (
              item &&
              typeof item.quantity === "number" &&
              item.quantity !== 0 &&
              item.count === undefined
            ) {
              const ingredientWeight =
                item.unit === "kg" || item.unit === "liters"
                  ? item.quantity * 1000
                  : item.unit === "ounces"
                  ? item.quantity * 28.3495
                  : item.unit === undefined ||
                    item.unit === "grams" ||
                    item.unit === "mililiters"
                  ? item.quantity
                  : 0;
              return total + ingredientWeight;
            } else if (
              item &&
              isNaN(item.count) === false &&
              typeof item.count === "number"
            ) {
              const ingredientWeight =
                item.unit === "kg" || item.unit === "liters"
                  ? item.count * 1000
                  : item.unit === "ounces"
                  ? item.count * 28.3495
                  : item.unit === undefined ||
                    item.unit === "grams" ||
                    item.unit === "mililiters"
                  ? item.count
                  : 0;

              return total + ingredientWeight;
            } else if (
              item &&
              item.quantity !== 0 &&
              isNaN(item.count) === false &&
              typeof item.count === "number"
            ) {
              const ingredientWeight =
                item.unit === "kg" || item.unit === "liters"
                  ? item.count * 1000
                  : item.unit === "ounces"
                  ? item.count * 28.3495
                  : item.unit === undefined ||
                    item.unit === "grams" ||
                    item.unit === "mililiters"
                  ? item.count
                  : 0;
              return total + ingredientWeight;
            }
            return total;
          }, 0)
        : null;

      setSumOfQuantities(sumOfWieghts);
      onEdittedWeightChange(sumOfWieghts);
    } else {
      const calculatedWeight = selectedIngredients.reduce(
        (total, ingredient) => {
          const ingredientWeight =
            ingredient.unit === "kg" || ingredient.unit === "liters"
              ? ingredient.count * 1000
              : ingredient.unit === "ounces"
              ? ingredient.count * 28.3495
              : ingredient.count || 0;

          return total + ingredientWeight;
        },
        0
      );

      setFullWeight(calculatedWeight);
      onWeightChange(calculatedWeight);
    }
  }, [
    selectedIngredients,
    onWeightChange,
    isExistingProduct,
    onEdittedWeightChange,
  ]);

  const transformToOptions = (data) => {
    return data.map((item) => ({
      value: item.ingredient?.id ? item.ingredient?.id : item.value,
      label: item.ingredient?.name ? item.ingredient?.name : item.label,
    }));
  };

  const newOptions = transformToOptions(selectedIngredients);

  if (onIngredientsChange) {
    onIngredientsChange(selectedIngredients);
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.types}>
          <p className={classes.label}>Ingredients</p>
        </div>
      </div>
      {selectedIngredients.map((ingredient, index) => (
        <Row
          key={index}
          className={`${classes.ingredients_row} ${
            index === 0 ? classes.first_row : ""
          }`}
        >
          <Col xs={12} sm={6} md={5} className={classes.ingredients_name}>
            <Select
              value={
                isExistingProduct
                  ? newOptions[index]
                  : selectedIngredients[index]
              }
              onChange={(selectedOption) =>
                handleIngredientChange(selectedOption, index)
              }
              options={options}
              isSearchable
              onInputChange={(value) => setSearchValue(value)}
              placeholder="Select an ingredient..."
              styles={ingredients_select_style}
            />
          </Col>
          <Col xs={6} sm={5} md={2} className={classes.ingredients_grams}>
            <input
              type="text"
              value={
                isExistingProduct &&
                ingredient.quantity !== 0 &&
                ingredient.count === undefined
                  ? ingredient.quantity
                  : isExistingProduct && ingredient.count > 0
                  ? ingredient.count
                  : isExistingProduct === false && ingredient.count > 0
                  ? ingredient.count
                  : 0
              }
              onChange={(e) => handleCountChange(index, e.target.value)}
              className={classes.grams_input}
            />
          </Col>
          <Col xs={6} sm={3} md={3} className={classes.ingredients_select}>
            <SimpleSelect
              value={
                isExistingProduct && ingredient.unit === undefined
                  ? unitOptions[0]
                  : { value: ingredient.unit, label: ingredient.unit }
              }
              options={unitOptions}
              onChange={(selectedOption: { value: string; label: string }) =>
                handleUnitChange(index, selectedOption)
              }
              styles={ingredients_select_style}
            />
          </Col>
          <Col xs={6} sm={5} md={2} className={classes.btn_delete}>
            <div
              className={classes.delete_icon_wrapper}
              onClick={() => handleDeleteIngredient(index)}
            >
              {deleteIcon}
            </div>
          </Col>
        </Row>
      ))}
      {/* {selectedIngredients.length > 0 && (
        <Row className={classes.total}>
          <Col xs={6} sm={6} md={7}>
            Total
          </Col>
          <Col xs={6} sm={3} md={3}>
            {isExistingProduct ? sumOfQuantities : fullWeight} g
          </Col>

          <Col></Col>
        </Row>
      )} */}
      {selectedIngredients.length > 0 && (
        <Row className={classes.total}>
          <Col xs={6} sm={6} md={7}>
            Total Brutto
          </Col>
          <Col xs={6} sm={3} md={3}>
            {isExistingProduct ? sumOfQuantities : fullWeight}{" "}
            {(() => {
              const unit =
                selectedIngredients.length > 0
                  ? selectedIngredients[0].unit
                  : "grams";
              if (unit === "grams" || unit === "kg" || unit === "ounces") {
                return "g";
              } else if (unit === "mililiters" || unit === "liters") {
                return "ml";
              }
              return "g";
            })()}
          </Col>
          <Col></Col>
        </Row>
      )}
      <div
        className={`${classes.button} ${buttonClicked ? classes.clicked : ""}`}
        onClick={handleButtonClick}
      >
        Add new ingredient
      </div>
    </div>
  );
};

export default Ingredients;
