import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import kernel from '@/services/kernel';

const useRecommendedProducts = (itemsCount) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const docs = await kernel.getRecommendedProducts(itemsCount);
      if (docs.data.data.length<=0 ) {
        if (didMount) {
          setError('No recommended products found.');
          setLoading(false);
        }
      } else {

        if (didMount) {
          setRecommendedProducts(docs.data.data);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError('Failed to fetch recommended products');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (recommendedProducts.length === 0 && didMount) {
      fetchRecommendedProducts();
    }
  }, []);


  return {
    recommendedProducts, fetchRecommendedProducts, isLoading, error
  };
};

export default useRecommendedProducts;
