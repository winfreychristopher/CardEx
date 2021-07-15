import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../api";
import OrderCard from "./orderCard";
import './Admin.scss';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await getAllOrders();
      console.log(data);
      setOrders(data);
    })();
  }, []);

  return (
    <>
      <h1 className="orderTitle">All Orders</h1>
      <div className="order-container">
        {orders.map((order) => {
          return <OrderCard key={order.id} order={order} />;
        })}
      </div>
    </>
  );
};

export default AllOrders;
