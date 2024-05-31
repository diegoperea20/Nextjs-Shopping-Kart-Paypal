"use client";
import React, { useEffect, useState } from "react";
import "./kart.css";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Kart() {
  const { data: session } = useSession();
  const user = session.user.username;
  const id = session.user.user_id;
  const [token, setToken] = useState("");
  const router = useRouter();
  const [karts, setKarts] = useState([]);
  const [editing, setEditing] = useState(null); // Cambio aquí: null para indicar que no se está editando ningún carrito.
  const [amount, setAmount] = useState({}); // Estado para manejar los valores de amount.

  const home = () => {
    router.push("/home");
  };

  const getKarts = async (user) => {
    const response = await fetch(`/api/kart/${user}`);
    const data = await response.json();
    setKarts(data);
  };

  useEffect(() => {
    getKarts(user);
  }, [user]);

  const deleteKart = async (id_kart) => {
    const response = await fetch(`/api/karts/${id_kart}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    await getKarts(user);
  };

  const canceledit = () => {
    setEditing(null);
    setAmount({});
  };

  const editKart = (kart) => {
    setEditing(kart.id);
    setAmount(kart.amount);
  };

  const savechanges = async (kart_id) => {
    const response = await fetch(`/api/karts/${kart_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount[kart_id], // Enviar el nuevo valor de amount
      }),
    });
    const data = await response.json();
    console.log(data);
    setEditing(null);
    setAmount({});
    await getKarts(user);
  };

  const handleAmountChange = (kart_id, newAmount) => {
    setAmount((prevAmounts) => ({
      ...prevAmounts,
      [kart_id]: newAmount,
    }));
  };

  return (
    <div className="darkTheme">
      <h1>Kart</h1>
      <button onClick={home}>Home</button>
      <br />
      <br />
      <div></div>
      <br />
      <br />

      <div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID Product</th>
                <th>Title</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Image</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {karts.map((kart) => (
                <tr key={kart.id}>
                  <td>{kart.idproduct}</td>
                  <td className="justified">{kart.title}</td>
                  <td className="justified">{kart.description}</td>
                  <td>
                    {editing === kart.id ? (
                      <input
                        type="number"
                        value={amount[kart.id] || kart.amount}
                        onChange={(e) =>
                          handleAmountChange(kart.id, parseInt(e.target.value))
                        }
                      />
                    ) : (
                      kart.amount
                    )}
                  </td>
                  <td>{kart.price}</td>
                  <td>
                    <img src={kart.image} alt={kart.title} />
                  </td>
                  <td>
                    {editing === kart.id ? (
                      <>
                        <button className="canceledit" onClick={canceledit}>
                          Cancel Edit
                        </button>
                        <button
                          className="update"
                          onClick={() => savechanges(kart.id)}
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="update"
                          onClick={() => editKart(kart)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete"
                          onClick={() => deleteKart(kart.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h1>
          Total: $
          {karts.reduce(
            (total, kart) =>
              total + kart.price * (amount[kart.id] || kart.amount),
            0
          )}
        </h1>

        <div>
          <PayPalScriptProvider
            options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
          >
            <PayPalButtons
              style={{ layout: "horizontal" }}
              createOrder={(data, actions) => {
                return actions.order
                  .create({
                    purchase_units: [
                      {
                        amount: {
                          value: karts.reduce(
                            (total, kart) =>
                              total +
                              kart.price * (amount[kart.id] || kart.amount),
                            0
                          ),
                        },
                      },
                    ],
                  })
                  .then((orderId) => {
                    console.log(orderId);
                    return orderId;
                  });
              }}
              onApprove={(data, actions) => {
                console.log(data);
                actions.order.capture();
              }}
              onCancel={(data) => {
                console.log("orden cancelado", data);
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}

export default Kart;
