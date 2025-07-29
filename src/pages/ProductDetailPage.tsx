import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <>
      <Helmet>
        <title>Product Details - Web Shop</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Product: {slug}</h1>
        <p className="text-gray-600">Product detail page - Coming soon...</p>
      </div>
    </>
  );
};

export default ProductDetailPage; 