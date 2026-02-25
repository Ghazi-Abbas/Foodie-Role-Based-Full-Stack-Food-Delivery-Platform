import { useState } from "react";
import EditModal from "./EditModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/RestaurantView.css";

export default function RestaurantView() {
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  const [restaurant, setRestaurant] = useState({
    restaurantId: 1,
    restaurantName: "Foodie Hub",
    city: "Mumbai",
    address: "Mumbai, Pattharvali",
    openingTime: "09:00",
    closingTime: "22:00",
    phone: "9876543210",
    panCard: "ABCDE1234F",
    fssaiLicence: "12345678901234",
    image: "/assets/res-image-1.jpg"
  });

  const [bank, setBank] = useState({
    bankId: 1,
    accName: "Foodie Hub Pvt Ltd",
    ifsc: "IOBA0002851",
    accNo: "123456789012",
    branch: "Mumbai Main Branch"
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="dashboard-card">
        <div className="image-section">
          <img src={restaurant.image} alt="restaurant" />
        </div>

        <div className="content-section">
          {/* Restaurant Details */}
          <div className="info-card">
            <h2>Restaurant Details</h2>
            <Info label="Restaurant Name" value={restaurant.restaurantName} />
            <Info label="City" value={restaurant.city} />
            <Info label="Address" value={restaurant.address} />
            <Info label="Opening Time" value={restaurant.openingTime} />
            <Info label="Closing Time" value={restaurant.closingTime} />
            <Info label="Phone" value={restaurant.phone} />
            <Info label="PAN" value={restaurant.panCard} />
            <Info label="FSSAI" value={restaurant.fssaiLicence} />

            <button
              className="edit-btn"
              onClick={() => setShowRestaurantModal(true)}
            >
              Edit
            </button>
          </div>

          {/* Bank Details */}
          <div className="info-card">
            <h2>Bank Details</h2>
            <Info label="Account Holder" value={bank.accName} />
            <Info label="IFSC Code" value={bank.ifsc} />
            <Info label="Account Number" value={bank.accNo} />
            <Info label="Branch" value={bank.branch} />

            <button className="edit-btn" onClick={() => setShowBankModal(true)}>
              Edit
            </button>
          </div>
        </div>
      </div>

      {showRestaurantModal && (
        <EditModal
          title="Edit Restaurant Details"
          data={restaurant}
          setData={setRestaurant}
          apiUrl="http://localhost:9092/restaurant-api/update"
          onClose={() => setShowRestaurantModal(false)}
        />
      )}

      {showBankModal && (
        <EditModal
          title="Edit Bank Details"
          data={bank}
          setData={setBank}
          apiUrl="http://localhost:9092/restaurant-api/bank/update"
          onClose={() => setShowBankModal(false)}
        />
      )}
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
