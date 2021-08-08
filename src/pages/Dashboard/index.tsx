import { useEffect, useState } from "react";

import { Header } from "../../components/Header";
import api from "../../services/api";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface FoodData {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  available: boolean;
}

export interface FoodEditData extends Omit<FoodData, 'price'> {
  price: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodData[]>([] as FoodData[]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodEditData>({} as FoodEditData);

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await api.get('/foods');
      setFoods([...response.data]);
    };

    fetchFoods();
  }, [])

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleAddFood = async (food: FoodData) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleEditFood = (food: FoodEditData) => {
    setEditModalOpen(true);

    const updatedFood = {
      ...food,
      price: String(food.price),
    }
    setEditingFood(updatedFood);
  };

  const handleUpdateFood = async (food: FoodEditData) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
