import React, {useState} from 'react';
import { createCard } from '../../api';
import './Admin.css';



const CreateCard = () => {
    const [card_title, setCardTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [card_img, setImg] = useState("")

  return (
    <>
      <form onSubmit={async (e) => {
          e.preventDefault()
          const token = localStorage.getItem("CardEXtoken")
          const data = await createCard(card_title, description, price, card_img, token)
          console.log(data)
          }}>
        {/**card_title,
            description,
            price,
            card_img,
            tag_content, */}
            <input type="text" placeholder="Card Title" value={card_title} onChange={(e) => {setCardTitle(e.target.value)}}/>
            <textarea placeholder="Description" value={description} onChange={(e) => {setDescription(e.target.value)}}/>
            <input type="number" placeholder="Price" value={price} onChange={(e) => {setPrice(e.target.value)}}/>
            <input type="url" placeholder="img url" value={card_img} onChange={(e) => {setImg(e.target.value)}}/>
            <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default CreateCard;