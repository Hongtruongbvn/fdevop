import { Helmet } from 'react-helmet-async';

const OrdersPage = () => {
  return (
    <>
      <Helmet>
        <title>My Orders - Web Shop</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <p className="text-gray-600">Orders page - Coming soon...</p>
      </div>
    </>
  );
};

export default OrdersPage; 