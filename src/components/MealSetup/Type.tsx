import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import classes from "./Type.module.css";
import { getCategories } from "src/auth/api/requests";

export interface Category {
  id?: string;
  name: string;
}
interface TypeProps {
  onTypeSelect: (item) => void;
  restaurantId: string;
  category: Category | null;
}

const Type: React.FC<TypeProps> = ({
  onTypeSelect,
  restaurantId,
  category,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedItem, setSelectedItem] = useState<Category>(
    category || {
      id: "",
      name: "",
    }
  );
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>({
    id: "",
    name: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getCategories(restaurantId);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, [restaurantId]);

  const handleCreateCategory = () => {
    setShowModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (categories.some((category) => category.name === newCategory.name)) {
        return;
      }
      setCategories((prevState) => [
        ...prevState,
        {
          id: newCategory.name,
          name:
            newCategory.name.charAt(0).toUpperCase() +
            newCategory.name.slice(1),
        },
      ]);
      setShowModal(false);
      setNewCategory({ id: "", name: "" });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewCategory({ id: "", name: "" });
  };

  const handleSelectCategory = (el) => {
    if (selectedItem.name === el.name) {
      setSelectedItem({
        name: "",
      });
      onTypeSelect(null);
    } else {
      setSelectedItem({
        name: el.name,
      });
      onTypeSelect(el);
    }
  };

  const mealsList = categories.map((el) => (
    <li
      key={el.name}
      className={selectedItem.name === el.name ? classes.selected : ""}
      onClick={() => handleSelectCategory(el)}
    >
      {el.name}
    </li>
  ));

  return (
    <div>
      <div className={classes.header}>
        <div className={classes.types}>
          <p className={classes.label}>Type</p>
        </div>
        <div className={classes.meals}>
          <ul className={classes.menuList}>
            {mealsList}
            {!showModal && (
              <li className={classes.createItem} onClick={handleCreateCategory}>
                + Create
              </li>
            )}
          </ul>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newCategory">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ id: e.target.value, name: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className={classes.BackButton} onClick={handleCloseModal}>
            <span className={classes.BackButtonText}>Close</span>
          </Button>
          <Button
            className={classes.CreateMealButton}
            onClick={handleSaveCategory}
          >
            <span className={classes.CreateMealText}>Save Category</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Type;
