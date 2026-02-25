import { useEffect, useState } from "react";

import Header from "../layout/Header";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import "../admin.css";
import {
  getDeliveryAgents,
  approveDeliveryAgent,
  blockDeliveryAgent,
} from "../services/AdminService";

export default function DeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await getDeliveryAgents();
      setAgents(res.data || []);
    } catch (error) {
      console.error("Failed to load delivery agents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await approveDeliveryAgent(id);
    fetchAgents();
  };

  const handleBlock = async (id) => {
    await blockDeliveryAgent(id);
    fetchAgents();
  };

  return (
    <>
      <Header title="Delivery Agents" />

      <Table
        columns={[
          "Name",
          "Contact",
          "Vehicle",
          "License",
          "Status",
          "Availability",
          "Actions",
        ]}
      >
        {loading ? (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              Loading...
            </td>
          </tr>
        ) : agents.length === 0 ? (
          <tr>
            <td colSpan="7">
              <EmptyState message="No delivery agents found." />
            </td>
          </tr>
        ) : (
          agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.name}</td>
              <td>{agent.phone}</td>
              <td>{agent.vehicleType}</td>
              <td>{agent.licenseNumber}</td>
              <td>{agent.status}</td>
              <td>{agent.available ? "Online" : "Offline"}</td>
              <td>
                {agent.status !== "APPROVED" ? (
                  <button
                    className="btn primary"
                    onClick={() => handleApprove(agent.id)}
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    className="btn danger"
                    onClick={() => handleBlock(agent.id)}
                  >
                    Block
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </Table>
    </>
  );
}
