import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateOrder from "./pages/CreateOrder";
import MyOrders from "./pages/MyOrders";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div>
      <Register />
      <Login />
      <CreateOrder />
      <MyOrders />

      <hr />

      <AdminLogin />
      <AdminDashboard />
    </div>
  );
}

export default App;