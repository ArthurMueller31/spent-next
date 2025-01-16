import AddProducts from "../_components/Add/AddProducts";
import AddPageSidebar from "../_components/Add/Sidebar";
import Navbar from "../_components/Home/Navbar";

export default function page() {
  return (
    <>
      <AddPageSidebar />
      <Navbar />
      <AddProducts />
    </>
  );
}
