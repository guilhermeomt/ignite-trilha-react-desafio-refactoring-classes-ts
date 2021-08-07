import { useState, useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

import { Form } from './styles';
import { Modal } from '../Modal';
import { Input } from '../Input';

interface ModalAddFoodProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAddFood: (data: any) => void;
}

interface FoodFormData {
  name: string;
  price: string;
  image: string;
  description: string;
}

export function ModalAddFood({ isOpen, setIsOpen, handleAddFood }: ModalAddFoodProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const formRef = useRef(null);

  const handleSubmit = async (data: FoodFormData) => {

    const food = {
      name,
      price,
      description,
      image,
    };

    handleAddFood(food);

    setName('');
    setPrice('');
    setDescription('');
    setImage('');

    setIsOpen();
  };


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          name="image"
          placeholder="Cole o link aqui"
        />

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          placeholder="Ex: Moda Italiana"
        />
        <Input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          name="price"
          placeholder="Ex: 19.90"
        />

        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="description"
          placeholder="Descrição"
        />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}

