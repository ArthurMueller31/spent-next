import CustomDateBarChart from "../_components/CustomPurchaseDates/CustomDateBarChart";
import Navbar from "../_components/Navigation/Navbar/Navbar";
import Sidebar from "../_components/Navigation/Sidebar/Sidebar";

export default function page() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <CustomDateBarChart />
    </>
  );
}
