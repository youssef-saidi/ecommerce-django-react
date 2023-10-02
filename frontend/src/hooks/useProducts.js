import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import kernel from '@/services/kernel';
import { useDispatch } from 'react-redux';
import { getProductsSuccess } from '@/redux/actions/productActions';

const useProducts = ( prod) => {
  const [Products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);
  const dispatch = useDispatch();


  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      if (prod!=undefined || prod.length > 0) {
        const docs = await kernel.getProducts(0);
        console.log(docs.products)

        if (docs.products.length <= 0) {
          if (didMount) {
            setError('No  products found.');
            setLoading(false);
          }
        } else {

          if (didMount) {
            setProducts(docs.products);
            dispatch(getProductsSuccess({products:docs.products}))
            setLoading(false);
          }
        }
      }

    } catch (e) {
      console.log(e)
      if (didMount) {
        setError('Failed to fetch  products');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (Products.length === 0 && didMount) {
      fetchProducts();
    }
  }, []);

  return {
    Products, fetchProducts, isLoading, error
  };
};

export default useProducts;
