import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../Utils/FireBase';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
 

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (password === 'admin321') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  useEffect(() => {
    if (authenticated) {
      const fetchData = async () => {
        try {
          const orderSnapshot = await getDocs(collection(db, 'orders'));
          const orderData = orderSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(orderData);
          setFilteredOrders(orderData);

          const statusCounts = orderData.reduce((acc, order) => {
            const status = getOrderStatus(order.orderDate);
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          setOrderStatusCounts(statusCounts);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

      fetchData();
    }
  }, [authenticated]);

  const getOrderStatus = (orderDate) => {
    if (!orderDate) return 'Unknown';
    const orderTime = new Date(orderDate);
    const currentTime = new Date();
    const hoursElapsed = Math.floor((currentTime - orderTime) / (1000 * 60 * 60));

    if (hoursElapsed <= 24) return 'Processing';
    if (hoursElapsed <= 48) return 'Shipped';
    return 'Delivered';
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });

    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    setSelectedOrder({ ...selectedOrder, status: newStatus });

    const updatedStatusCounts = { ...orderStatusCounts };
    updatedStatusCounts[newStatus] = (updatedStatusCounts[newStatus] || 0) + 1;

    const previousStatus = getOrderStatus(new Date(selectedOrder.orderDate));
    if (previousStatus) {
      updatedStatusCounts[previousStatus] = Math.max(
        0,
        (updatedStatusCounts[previousStatus] || 0) - 1
      );
    }

    setOrderStatusCounts(updatedStatusCounts);
  };


  const handleOrderStatusDropdownChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const renderOrderList = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-3xl font-semibold mb-6">All Orders</h2>
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left font-semibold">Order ID</th>
            <th className="p-3 text-left font-semibold">User Email</th>
            <th className="p-3 text-left font-semibold">Order Date</th>
            <th className="p-3 text-left font-semibold">Total Price</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={`${order.id}-${index}`} className="border-t">
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.user?.email || 'Unknown'}</td>
              <td className="p-3">
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className="p-3">{order.totalAmount || 'N/A'}</td>
              <td className="p-3">{order.status || getOrderStatus(order.orderDate)}</td>
              <td className="p-3">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-blue-600 text-white font-semibold rounded px-4 py-2 hover:bg-blue-700"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrderDetails = () => {
    if (!selectedOrder) {
      return (
        <div className="text-center text-gray-500 mt-4">No order selected.</div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-2xl font-semibold mb-4">Order Details</h3>
        <table className="w-full mb-6">
          <tbody>
            <tr>
              <td className="font-semibold">Order ID:</td>
              <td>{selectedOrder.id}</td>
            </tr>
            <tr>
              <td className="font-semibold">User Email:</td>
              <td>{selectedOrder.user?.email || 'Unknown'}</td>
            </tr>
            <tr>
              <td className="font-semibold">Order Date:</td>
              <td>
                {selectedOrder.orderDate
                  ? new Date(selectedOrder.orderDate).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Total Price:</td>
              <td>${selectedOrder.totalAmount || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-semibold">Delivery Charges:</td>
              <td>${selectedOrder.deliveryCharge || 'N/A'}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex items-center mb-4">
          <label className="font-semibold mr-3">Update Status:</label>
          <select
            value={selectedOrder.status || getOrderStatus(selectedOrder.orderDate)}
            onChange={(e) =>
              handleOrderStatusDropdownChange(selectedOrder.id, e.target.value)
            }
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {selectedOrder.items && selectedOrder.items.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Items Details</h4>
            <table className="min-w-full border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="border-t">
                    <td className="p-3">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="h-16 w-16 object-cover"
                      />
                    </td>
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.category || 'N/A'}</td>
                    <td className="p-3">${item.price || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-semibold mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-600"
          >
            Login
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        <p>password is : admin321</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>
      <div className="container mx-auto">
        {renderOrderList()}
        {renderOrderDetails()}
      </div>
    </div>
  );
};

export default AdminPanel;
