import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPendingKyc,
  getKycDetails,
  approveKyc,
  rejectKyc,
  getAudit,
  getDeliveryAgents,
  approveDeliveryAgent,
  blockDeliveryAgent
} from "../services/AdminService";

export default function KycReview() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getKycDetails(id).then(res => setData(res.data));
  }, []);

  if (!data) return "Loading...";

  const { restaurant, bankDetails } = data;

  return (
    <div>
      <h2>{restaurant.restaurantName}</h2>

      <h3>Restaurant</h3>
      <p>{restaurant.address}</p>
      <p>PAN: {restaurant.panCard}</p>
      <p>FSSAI: {restaurant.fssaiLicence}</p>
      <img src={restaurant.restaurantImageUrl} width="200"/>

      <h3>Bank</h3>
      <p>Account: {bankDetails.accountNumber}</p>
      <p>IFSC: {bankDetails.ifsc}</p>

      <button onClick={() => approveKyc(id)}>Approve</button>
      <button onClick={() => rejectKyc(id, "Invalid documents")}>Reject</button>
    </div>
  );
}
