import React, { useEffect, useState, useRef } from "react";
import classes from "./DeliveryMenu.module.css";
import Spinner from "../Spinner";
import { getAllProduts } from "../../auth/api/requests";
import { closeIcon } from '../../icons/icons';

interface DeliveryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

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

interface Product {
  id: string;
  title: string;
  image: string;
  price: number | string;
  productIngredients: Ingredient[];
  weight: number;
}

const DeliveryMenu: React.FC<DeliveryMenuProps> = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState<{ [key: string]: number }>({});

  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleIncrement = (productId: string) => {
    setCounters(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleDecrement = (productId: string) => {
    setCounters(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0) // Prevent negative numbers
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRestaurant = JSON.parse(
          localStorage.getItem("selectedRestaurant") ?? "null"
        );
        const productData = await getAllProduts(storedRestaurant.id);
        const formattedData = productData.map((product: Product) => ({
          ...product,
          price: parseFloat(product.price as string), // Преобразуем price в число
        }));
        setProducts(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  const calculateTotalSum = () => {
    return products.reduce((sum, product) => {
      const count = counters[product.id] || 0;
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price) 
        : product.price;
      return sum + (price * count);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className={classes.overlay} onClick={handleOverlayClick}>
      <div className={classes.modal} ref={modalRef}>
        <button className={classes.headingCloseBtn} onClick={onClose}>
          {closeIcon}
        </button>
        <div className={classes.menuHeader}>
          <h2 className={classes.menu_title}>Delivery Menu</h2>
          <div className={classes.totalSum}>
            <span>Total sum: {calculateTotalSum()} MDL</span>
            <button className={classes.AddItemButton}>
              <span className={classes.AddItemText}>Confirm Order</span>
            </button>
          </div>
        </div>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className={classes.products}>
            {products.map((product) => (
              <div key={product.id} className={classes.mealCard}>
                <div className={classes.imageContainer}>
                  <img
                    src={product.image}
                    alt={product.title}
                  />
                </div>
                <div className={classes.cardContent}>
                  <h3>{product.title}</h3>
                  <p>
                    {product.productIngredients ? 
                      product.productIngredients.map(ing => 
                        ing.ingredient?.name || ing.name
                      ).join(', ') 
                      : 'No ingredients available'
                    }
                  </p>
                  <p>
                    <span className={classes.price}>{product.price} MDL</span>
                    <span className={classes.weight}>{product.weight} g</span>
                  </p>
                  <div className={classes.counter}>
                    <button 
                      className={classes.counterButton} 
                      onClick={() => handleDecrement(product.id)}
                    >
                      -
                    </button>
                    <span className={classes.counterValue}>
                      {counters[product.id] || 0}
                    </span>
                    <button 
                      className={classes.counterButton} 
                      onClick={() => handleIncrement(product.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryMenu;
