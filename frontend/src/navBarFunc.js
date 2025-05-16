import { useNavigate } from "react-router-dom";

const useNavBarHandlers = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/search");
  };
  const handleOrders = () => {
    navigate("/orders");
  };
  const handleCart = () => {
    navigate("/mycart");
  };
  const handleDelivery = () => {
    navigate("/deliver");
  };
  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    navigate("/");
  };
  const handleProfile = () =>{
    navigate("/profile");
  };

  return {
    handleSearch,
    handleOrders,
    handleCart,
    handleDelivery,
    handleLogout,
    handleProfile,
  };
};
export default useNavBarHandlers;
