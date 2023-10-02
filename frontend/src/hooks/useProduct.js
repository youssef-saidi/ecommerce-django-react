import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import kernel from '@/services/kernel';

const useProduct = (id) => {
  // get and check if product exists in store
  const storeProduct = useSelector((state) =>{
    state.products.items.find((item) => item.id == id)
  } );

  const [product, setProduct] = useState(storeProduct);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);
  useEffect(() => {
    ( async() => {
      try {
        console.log(product)
        // if (!product || product.id !== id) {

          setLoading(true);
          const doc =   await kernel.getSingleProduct(id);

          if (doc.data.data.length<=0) {
            if (didMount) {
              setError('No  product found.');
              setLoading(false);
            }
          } else {
    
            if (didMount) {
              setProduct(doc.data.data[0]);
              setLoading(false);
            }
          }
        // }
      } catch (err) {
        if (didMount) {
          setLoading(false);
          setError(err?.message || 'Something went wrong.');
        }
      }
    })();
  }, [id]);

  return { product, isLoading, error };
};

export default useProduct;
