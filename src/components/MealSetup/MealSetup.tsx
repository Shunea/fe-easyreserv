import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./MealSetup.module.css";
import Title from "../Title";
import Input from "./../../UI/Input";
import useInput from "../../hooks/use-input";
import { useSelector } from "react-redux";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Type from "./Type";
import Ingredients from "./Ingredients";
import { createProduct, editProduct, uploadImage } from "src/auth/api/requests";
import DragAndDrop from "../CreatePlace/Form/DragAndDrop";
import { toast } from "react-toastify";
import { TextareaAutosize } from "@mui/material";
import FoodCategory from "./FoodCategory";

interface Ingredient {
  id?: string;
  label?: string;
  name?: string;
  count?: number;
  unit?: string;
  quantity?: number;
  ingredient?: {
    name: string;
    id: string;
  };
}

interface TVAOption {
  type: string;
  percentage: number;
}

interface Category {
  name: string;
}
interface FoodCategory {
  name: string;
}

type MealSetupProps = {};

const MealSetup: React.FC<MealSetupProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Component state
  const [isRequired, setIsRequired] = useState(false);
  const [productCreated, setProductCreated] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  console.log(location.state);
  // Initialize TVA and masa netto from existing product
  const initialTVAType = location.state?.tvaType || "A";
  const initialTVAPercentage = parseFloat(location.state?.tvaPercentage) || 20;
  const initialMasaNetto = location.state?.masaNetto ? String(location.state.masaNetto) : "";

  console.log('Initial TVA and masa netto values:', {
    tvaType: initialTVAType,
    tvaPercentage: initialTVAPercentage,
    masaNetto: initialMasaNetto,
    rawLocationState: location.state
  });

  // TVA and masa netto state
  const [selectedTVA, setSelectedTVA] = useState<TVAOption>({ 
    type: initialTVAType, 
    percentage: initialTVAPercentage 
  });
  const [masaNetto, setMasaNetto] = useState<string>(initialMasaNetto);

  const TVAOptions: TVAOption[] = [
    { type: 'A', percentage: 20 },
    { type: 'B', percentage: 8 },
    { type: 'C', percentage: 5 },
    { type: 'D', percentage: 6 },
    { type: 'E', percentage: 0 },
  ];

  // Add effect to update TVA percentage when type changes
  useEffect(() => {
    const option = TVAOptions.find(opt => opt.type === selectedTVA.type);
    if (option && option.percentage !== selectedTVA.percentage) {
      setSelectedTVA(prev => ({ ...prev, percentage: option.percentage }));
    }
  }, [selectedTVA.type]);

  const handleTVAChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = TVAOptions.find(opt => opt.type === event.target.value);
    if (selected) {
      setSelectedTVA(selected);
    }
  };

  const handleMasaNettoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMasaNetto(value);
  };

  // Other initial values
  const initialTitle = String(location.state?.title || "");
  const initialPrice = String(location.state?.price || "");
  const initialAlergens = String(location.state?.allergens || "");
  const initialPreparationTime = String(location.state?.preparationTime || "");
  const initialCategory = location.state?.category || { name: "" };
  const initialFoodCategory = location.state?.preparationZone || "";
  const initialIngredients = location.state?.ingredients || [];
  const isExistingProduct = location.state?.isExistingProduct;
  const initialImage = location.state?.image || null;
  const initialComments = String(location.state?.recipe || "");
  const existingImage = initialImage?.split("/").pop() || "";

  const isNotEmpty = (value: string) => value && value.trim() !== "";
  // const [price, setPrice] = useState<number>(0);
  const {
    value: enteredTitle,
    hasError: placeNameInputHasError,
    isValid: enteredPlaceNameIsValid,
    valueChangeHandler: placeNameChangedHandler,
    inputBlurHandler: placeNameBlurHandler,
    reset: resetPlaceNameInput,
  } = useInput(isNotEmpty, initialTitle);

  const {
    value: enteredPrice,
    hasError: priceInputHasError,
    isValid: enteredPriceIsValid,
    valueChangeHandler: priceChangedHandler,
    inputBlurHandler: priceBlurHandler,
    reset: resetPriceInput,
  } = useInput(isNotEmpty, initialPrice);
  const {
    value: enteredAlergens,
    hasError: alergensInputHasError,
    isValid: enteredAlergensIsValid,
    valueChangeHandler: alergensChangedHandler,
    inputBlurHandler: alergensBlurHandler,
    reset: resetAlergensInput,
  } = useInput(isNotEmpty, initialAlergens);
  const {
    value: enteredPreparationTime,
    hasError: preparationTimeInputHasError,
    isValid: enteredPreaparationTimeIsValid,
    valueChangeHandler: preparationTimeChangedHandler,
    inputBlurHandler: preparationTimeBlurHandler,
    reset: resetPreparationTimeInput,
  } = useInput(isNotEmpty, initialPreparationTime);
  const {
    value: enteredComments,
    hasError: commentsInputHasError,
    valueChangeHandler: commentsChangedHandler,
    inputBlurHandler: commentsBlurHandler,
    reset: resetCommentsInput,
  } = useInput(isNotEmpty, initialComments);

  const savedType = localStorage.getItem(`meal-type-${location.state?.id}`);
  const initialTypeCategory = savedType 
    ? JSON.parse(savedType)
    : location.state?.category || { name: "" };

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialTypeCategory);

  const [selectedFoodCategory, setSelectedFoodCategory] =
  useState<string>(initialFoodCategory);
  const [selectedIngredients, setSelectedIngredients] =
  useState<Ingredient[]>(initialIngredients);

  const [totalWeight, setTotalWeight] = useState<number>(0);
  const handleIngredientsChange = (ingredients: any[]) => {
    setSelectedIngredients(ingredients);
  };
  const [edittedTotalWeight, setEdittedTotalWeight] = useState<number>(0);
  const handleTotalWeightChange = (weight: number) => {
    setTotalWeight(weight);
  };
  const handleEdiitedTotalWeightChange = (weight: number) => {
    setEdittedTotalWeight(weight);
  };
  const handleTypeSelect = (item: Category | null) => {
    setSelectedCategory(item);
    if (item && location.state?.id) {
      localStorage.setItem(`meal-type-${location.state.id}`, JSON.stringify(item));
    }
  };
  const handleFoodCategorySelect = (item: string) => {
    setSelectedFoodCategory(item);
  };
  const enteredAvatar = useSelector((state: any) => state.formData.file);
  let formIsValid = false;
  if (
    enteredPlaceNameIsValid &&
    selectedCategory?.name.length !== 0 &&
    selectedCategory?.name !== undefined &&
    enteredPreaparationTimeIsValid  &&
    enteredAlergensIsValid &&
    enteredPriceIsValid
    //  &&    enteredAvatar.name !== undefined
  ) {
    formIsValid = true;
  }

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Selected ingredients before transform:", selectedIngredients);

    // Transform ingredients consistently for both create and update
    const ingredients = selectedIngredients.map((ingredient) => {
      console.log("Processing ingredient:", ingredient);
      
      // Get the name from the appropriate property based on ingredient format
      const name = ingredient.label || ingredient.ingredient?.name || ingredient.name;
      if (!name) {
        console.warn("Warning: Ingredient without name:", ingredient);
      }

      // Calculate quantity based on unit and source property
      let quantity = 0;
      if (ingredient.unit === "kg" && ingredient.count) {
        quantity = ingredient.count * 1000;
      } else if (ingredient.unit === "ounces" && ingredient.count) {
        quantity = ingredient.count * 28.3495;
      } else {
        quantity = ingredient.count || ingredient.quantity || 0;
      }

      return {
        name,
        quantity
      };
    }).filter(ingredient => ingredient.name);

    console.log("Transformed ingredients:", ingredients);

    const formData = new FormData();

    try {
      const storedRestaurant = JSON.parse(
        localStorage.getItem("selectedRestaurant") ?? "null"
      );

      let imageKey = null;
      if (uploadedFile) {
        formData.append("file", uploadedFile, uploadedFile?.name);
        imageKey = await uploadImage(formData);
      }

      const commonData = {
        title: enteredTitle,
        price: enteredPrice,
        allergens: enteredAlergens,
        recipe: enteredComments,
        preparationTime: enteredPreparationTime,
        image: imageKey ? imageKey : null,
        category: selectedCategory,
        preparationZone: selectedFoodCategory,
        ingredients: ingredients,
        // Add TVA and masa netto fields
        tvaType: selectedTVA.type,
        tvaPercentage: selectedTVA.percentage,
        masaNetto: masaNetto ? parseFloat(masaNetto) : null,
      };

      if (isExistingProduct) {
        const edittedProductData = {
          ...commonData,
          weight: edittedTotalWeight.toString(),
          image: imageKey !== null
            ? imageKey
            : existingImage.length > 0
            ? existingImage
            : null,
        };

        console.log("Updating product with data:", edittedProductData);
        await editProduct(
          edittedProductData,
          location.state?.id ? location.state?.id : "null"
        );
      } else {
        const productData = {
          ...commonData,
          weight: totalWeight.toString(),
        };

        console.log("Creating product with data:", productData);
        await createProduct(productData, storedRestaurant.id);
      }
      setProductCreated(true);
      success();
      resetPriceInput();
      if (selectedCategory && location.state?.id) {
        localStorage.setItem(`meal-type-${location.state.id}`, JSON.stringify(selectedCategory));
      }
    } catch (error) {
      console.error("Error creating/updating product:", error);
      toast.error("Error saving product.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const transformToNewFormat = (selectedIngredients) => {
    return selectedIngredients.map((ingredient) => {
      // For new ingredients added through the UI
      if (ingredient.count !== undefined) {
        return {
          name: ingredient.label,  // Using label as name
          quantity: ingredient.count,
        };
      } 
      // For existing ingredients from backend
      else if (ingredient.ingredient) {
        return {
          name: ingredient.ingredient.name,
          quantity: ingredient.quantity,
        };
      }
      // For direct ingredient objects (fallback)
      else if (ingredient.name) {
        return {
          name: ingredient.name,
          quantity: ingredient.quantity,
        };
      }
      // Skip invalid ingredients
      return null;
    }).filter(Boolean); // Remove any null values
  };

  const edittedIngredientsArray = transformToNewFormat(selectedIngredients);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const handleBackButtonClick = () => {
    navigate("/menu");
  };

  if (productCreated) {
    handleBackButtonClick();
  }

  return (
    <div>
      <Title
        title={isExistingProduct ? "EditMeal" : "Create new meal"}
        subtitle={""}
      />
      <form className={classes.MealForm} onSubmit={() => {}}>
        <Row className={classes.form_inputs}>
          <Col xs={12} lg={8}>
            <Input
              label="Title"
              placeholder="Enter meal title"
              value={enteredTitle}
              hasError={placeNameInputHasError}
              errorMessage="Value must not be empty"
              type="text"
              onChange={placeNameChangedHandler}
              onBlur={placeNameBlurHandler}
            />
          </Col>
          <Col xs={12} lg={4}>
            <Input
              label="Price"
              placeholder="Enter price"
              value={enteredPrice}
              hasError={priceInputHasError}
              errorMessage="Value must not be empty"
              type="number"
              onChange={priceChangedHandler}
              onBlur={priceBlurHandler}
            />
          </Col>
        </Row>
        <div className={classes.tvaRow}>
          <div className={classes.tvaGroup}>
            <label className={classes.tvaLabel}>TVA TIP</label>
            <select 
              className={classes.tvaSelect}
              value={selectedTVA.type}
              onChange={handleTVAChange}
            >
              {TVAOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  TVA {option.type}
                </option>
              ))}
            </select>
          </div>
          <div className={classes.tvaGroup}>
            <label className={classes.tvaLabel}>TVA %</label>
            <input
              type="text"
              className={classes.tvaInput}
              value={`${selectedTVA.percentage}%`}
              disabled
            />
          </div>
          <div className={classes.tvaGroup}>
            <label className={classes.tvaLabel}>Masa Netto</label>
            <input
              type="number"
              className={classes.tvaInput}
              value={masaNetto}
              onChange={handleMasaNettoChange}
              placeholder="Enter Masa Netto"
            />
          </div>
        </div>
        <Type
          onTypeSelect={handleTypeSelect}
          restaurantId={
            JSON.parse(localStorage.getItem("selectedRestaurant") ?? "null").id
          }
          category={selectedCategory}
        />
        <FoodCategory
          onFoodCategorySelect={handleFoodCategorySelect}
          restaurantId={
            JSON.parse(localStorage.getItem("selectedRestaurant") ?? "null").id
          }
          category={selectedFoodCategory}
        />
        <Ingredients
          onIngredientsChange={handleIngredientsChange}
          onWeightChange={handleTotalWeightChange}
          onEdittedWeightChange={handleEdiitedTotalWeightChange}
          ingredientsFromBack={initialIngredients}
          isExistingProduct={isExistingProduct || false}
        />
        {/* <Galery createMealBtnClickHandler={handleSubmit} /> */}
        <Col>
          <Input
            label="Alergens"
            placeholder="Enter alergens"
            value={enteredAlergens}
            hasError={alergensInputHasError}
            errorMessage="Value must not be empty"
            type="text"
            onChange={alergensChangedHandler}
            onBlur={alergensBlurHandler}
          />
        </Col>
        <Col>
          <Input
            label="Preparation Time (minutes)"
            placeholder="Enter preparation time"
            value={enteredPreparationTime}
            hasError={preparationTimeInputHasError}
            errorMessage="Value must not be empty"
            type="number"
            onChange={preparationTimeChangedHandler}
            onBlur={preparationTimeBlurHandler}
          />
        </Col>
        <Col>
          <label htmlFor="comments" style={{marginBottom:"5px"}}>Recipe</label>
          <TextareaAutosize
            id="comments"
            minRows={4}
            className={classes.CommentsInput}
            placeholder="Enter recipe"
            value={enteredComments}
            onChange={commentsChangedHandler}
            onBlur={commentsBlurHandler}
          />
          {/* {commentsInputHasError && (
            <p
              style={{
                color: "red",
                opacity: "0.4",
                fontSize: "12px",
              }}
            >
              Value must not be empty
            </p>
          )} */}
        </Col>
        {/* <div className={classes.AlergensContainer}>
          <span className={classes.AlergensTitle}>Alergens</span>
          <input
            className={classes.AlergensInput}
            placeholder="Enter alergens"
          ></input>
        </div> */}
        <div className={classes.Gallery}>
          <span className={classes.GalleryTitle}>Images gallery</span>
          <DragAndDrop
            onFileUpload={handleFileUpload}
            parentComponent="meal"
            background={initialImage}
            isRequired={isRequired}
          />
        </div>
      </form>
      <div className={classes.FormActions}>
        <button
          className={classes.CreateMealButton}
          onClick={(e) => handleSubmit(e)}
          disabled={!formIsValid}
        >
          <span className={classes.CreateMealText}>
            {isExistingProduct ? "Save changes" : "Create meal"}
          </span>
        </button>
        <button className={classes.BackButton} onClick={handleBackButtonClick}>
          <span className={classes.BackButtonText}>Back</span>
        </button>
      </div>
    </div>
  );
};
export default MealSetup;
