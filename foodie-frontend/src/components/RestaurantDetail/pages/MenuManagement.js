import "./MenuManagement.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MenuManagement() {
  const [menu, setMenu] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    categoryId: "",
    type: "VEG",
    description: "",
    image: null, // ✅ FILE
  });

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  /* ================= LOAD MENU ================= */
  const loadMenu = () => {
    if (!restaurantId || !token) return;

    axios
      .get(
        `http://localhost:9092/restaurants/${restaurantId}/menu`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setMenu(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("MENU LOAD ERROR:", err);
        setMenu([]);
      });
  };

  useEffect(() => {
    loadMenu();
  }, [restaurantId, token]);

  /* ================= ADD ITEM ================= */
  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.categoryId) {
      alert("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("itemName", newItem.name);
    formData.append("price", newItem.price);
    formData.append("veg", newItem.type === "VEG");
    formData.append("description", newItem.description);

    if (newItem.image) {
      formData.append("image", newItem.image); // 🔥 FILE
    }

    axios
      .post(
        `http://localhost:9092/restaurants/${restaurantId}/menu/categories/${newItem.categoryId}/items`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        setShowForm(false);
        setNewItem({
          name: "",
          price: "",
          categoryId: "",
          type: "VEG",
          description: "",
          image: null,
        });
        loadMenu();
      })
      .catch(err => {
        console.error("ADD ITEM ERROR:", err);
        alert("Failed to add item");
      });
  };

  /* ================= TOGGLE AVAILABILITY ================= */
  const toggleAvailability = (itemId, available) => {
    axios
      .put(
        `http://localhost:9092/restaurants/${restaurantId}/menu/items/${itemId}/availability`,
        { available: !available },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => loadMenu())
      .catch(err => {
        console.error("AVAILABILITY UPDATE ERROR:", err);
        alert("Failed to update availability");
      });
  };

  return (
    <div className="menu-page">
      {/* HEADER */}
      <div className="menu-header">
        <div>
          <h1>Menu Management</h1>
          <p>Manage menu items, categories and availability</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          Add New Item
        </button>
      </div>

      {/* ADD ITEM FORM */}
      {showForm && (
        <div className="panel add-form">
          <h2>Add New Menu Item</h2>

          <div className="form-grid">
            <input
              placeholder="Item name"
              value={newItem.name}
              onChange={e =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={e =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />

            <select
              value={newItem.categoryId}
              onChange={e =>
                setNewItem({
                  ...newItem,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">Select Category</option>
              {menu.map(cat => (
                <option
                  key={cat.categoryId}
                  value={cat.categoryId}
                >
                  {cat.categoryType}
                </option>
              ))}
            </select>

            <select
              value={newItem.type}
              onChange={e =>
                setNewItem({ ...newItem, type: e.target.value })
              }
            >
              <option value="VEG">Veg</option>
              <option value="NON_VEG">Non-Veg</option>
            </select>

            <textarea
              placeholder="Description"
              value={newItem.description}
              onChange={e =>
                setNewItem({
                  ...newItem,
                  description: e.target.value,
                })
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={e =>
                setNewItem({
                  ...newItem,
                  image: e.target.files[0],
                })
              }
            />
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleAddItem}>
              Save Item
            </button>
            <button
              className="secondary-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MENU LIST */}
      {menu.map(category => (
        <div
          key={category.categoryId}
          className="menu-category"
        >
          <h2>{category.categoryType}</h2>

          <table className="menu-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Veg</th>
                <th>Price</th>
                <th>Status</th>
                <th align="right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {(!category.items ||
                category.items.length === 0) && (
                <tr>
                  <td colSpan="5" className="empty">
                    No items in this category
                  </td>
                </tr>
              )}

              {category.items?.map(item => (
                <tr key={item.itemId}>
                  <td className="item-name">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="thumb"
                      />
                    )}
                    {item.itemName}
                  </td>
                  <td>{item.veg ? "Veg" : "Non-Veg"}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <span
                      className={`availability ${
                        item.available
                          ? "available"
                          : "unavailable"
                      }`}
                    >
                      {item.available
                        ? "Available"
                        : "Out of stock"}
                    </span>
                  </td>
                  <td align="right">
                    <button
                      className="text-btn"
                      onClick={() =>
                        toggleAvailability(
                          item.itemId,
                          item.available
                        )
                      }
                    >
                      {item.available
                        ? "Mark Out"
                        : "Mark Available"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}


// import "./MenuManagement.css";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function MenuManagement() {
//   const [menu, setMenu] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   const [newItem, setNewItem] = useState({
//     name: "",
//     price: "",
//     categoryId: "",
//     type: "VEG",
//     imageUrl: "",
//   });

//   const restaurantId = localStorage.getItem("restaurantId");
//   const token = localStorage.getItem("token");

//   /* ================= LOAD MENU ================= */
//   const loadMenu = () => {
//     if (!restaurantId || !token) return;

//     axios
//       .get(`http://localhost:9092/restaurants/${restaurantId}/menu`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         setMenu(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(err => {
//         console.error("MENU LOAD ERROR:", err);
//         setMenu([]);
//       });
//   };

//   useEffect(() => {
//     loadMenu();
//   }, [restaurantId, token]);

//   /* ================= ADD ITEM ================= */
//   const handleAddItem = () => {
//     if (!newItem.name || !newItem.price || !newItem.categoryId) return;

//     axios
//       .post(
//         `http://localhost:9092/restaurants/${restaurantId}/menu/categories/${newItem.categoryId}/items`,
//         {
//           itemName: newItem.name,
//           price: Number(newItem.price),
//           veg: newItem.type === "VEG",
//           itemType: newItem.type,
//           available: true,
//           imageUrl: newItem.imageUrl,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then(() => {
//         setShowForm(false);
//         setNewItem({
//           name: "",
//           price: "",
//           categoryId: "",
//           type: "VEG",
//           imageUrl: "",
//         });
//         loadMenu();
//       })
//       .catch(err => {
//         console.error("ADD ITEM ERROR:", err);
//         alert("Failed to add item");
//       });
//   };

//   /* ================= TOGGLE AVAILABILITY ================= */
//   const toggleAvailability = (categoryId, item) => {
//     axios
//       .put(
//         `http://localhost:9092/restaurants/${restaurantId}/menu/categories/${categoryId}/items`,
//         {
//           ...item,
//           available: !item.available,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then(() => loadMenu())
//       .catch(err => {
//         console.error("AVAILABILITY UPDATE ERROR:", err);
//         alert("Failed to update availability");
//       });
//   };

//   return (
//     <div className="menu-page">
//       {/* HEADER */}
//       <div className="menu-header">
//         <div>
//           <h1>Menu Management</h1>
//           <p>Manage menu items, categories and availability</p>
//         </div>

//         <button
//           className="primary-btn"
//           onClick={() => setShowForm(true)}
//         >
//           Add New Item
//         </button>
//       </div>

//       {/* ADD ITEM FORM */}
//       {showForm && (
//         <div className="panel add-form">
//           <h2>Add New Menu Item</h2>

//           <div className="form-grid">
//             <input
//               placeholder="Item name"
//               value={newItem.name}
//               onChange={e =>
//                 setNewItem({ ...newItem, name: e.target.value })
//               }
//             />

//             <input
//               type="number"
//               placeholder="Price"
//               value={newItem.price}
//               onChange={e =>
//                 setNewItem({ ...newItem, price: e.target.value })
//               }
//             />

//             <select
//               value={newItem.categoryId}
//               onChange={e =>
//                 setNewItem({
//                   ...newItem,
//                   categoryId: e.target.value,
//                 })
//               }
//             >
//               <option value="">Select Category</option>
//               {menu.map(cat => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.categoryName}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={newItem.type}
//               onChange={e =>
//                 setNewItem({ ...newItem, type: e.target.value })
//               }
//             >
//               <option value="VEG">Veg</option>
//               <option value="NON_VEG">Non-Veg</option>
//               <option value="DESSERT">Dessert</option>
//               <option value="BEVERAGE">Beverage</option>
//             </select>

//             <input
//               placeholder="Image URL (optional)"
//               value={newItem.imageUrl}
//               onChange={e =>
//                 setNewItem({
//                   ...newItem,
//                   imageUrl: e.target.value,
//                 })
//               }
//             />
//           </div>

//           <div className="form-actions">
//             <button className="primary-btn" onClick={handleAddItem}>
//               Save Item
//             </button>
//             <button
//               className="secondary-btn"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* MENU LIST */}
//       {menu.map(category => (
//         <div key={category.id} className="menu-category">
//           <h2>{category.categoryName}</h2>

//           <table className="menu-table">
//             <thead>
//               <tr>
//                 <th>Item</th>
//                 <th>Type</th>
//                 <th>Price</th>
//                 <th>Status</th>
//                 <th align="right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {(!category.items ||
//                 category.items.length === 0) && (
//                 <tr>
//                   <td colSpan="5" className="empty">
//                     No items in this category
//                   </td>
//                 </tr>
//               )}

//               {category.items?.map(item => (
//                 <tr key={item.id}>
//                   <td className="item-name">
//                     {item.imageUrl && (
//                       <img
//                         src={item.imageUrl}
//                         alt=""
//                         className="thumb"
//                       />
//                     )}
//                     {item.itemName}
//                   </td>
//                   <td>{item.itemType}</td>
//                   <td>₹{item.price}</td>
//                   <td>
//                     <span
//                       className={`availability ${
//                         item.available
//                           ? "available"
//                           : "unavailable"
//                       }`}
//                     >
//                       {item.available
//                         ? "Available"
//                         : "Out of stock"}
//                     </span>
//                   </td>
//                   <td align="right">
//                     <button
//                       className="text-btn"
//                       onClick={() =>
//                         toggleAvailability(category.id, item)
//                       }
//                     >
//                       {item.available
//                         ? "Mark Out"
//                         : "Mark Available"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }
