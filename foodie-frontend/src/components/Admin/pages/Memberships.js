import Header from "../layout/Header";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import "../admin.css";
// ✅ CORRECT IMPORT
import * as AdminService from "../services/AdminService";

export default function Memberships() {
  return (
    <>
      <Header title="Membership Plans" />

      <Table columns={["Plan", "Status", "Action"]}>
        <tr>
          <td colSpan="3">
            <EmptyState message="No memberships found." />
          </td>
        </tr>
      </Table>
    </>
  );
}
