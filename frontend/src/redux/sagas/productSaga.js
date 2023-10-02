/* eslint-disable indent */
import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  GET_PRODUCTS,
  REMOVE_PRODUCT,
  SEARCH_PRODUCT
} from '@/constants/constants';
import { ADMIN_PRODUCTS } from '@/constants/routes';
import { displayActionMessage } from '@/helpers/utils';
import {
  all, call, put, select
} from 'redux-saga/effects';
import { setLoading, setRequestStatus } from '@/redux/actions/miscActions';
import { history } from '@/routers/AppRouter';
import kernel from '@/services/kernel';
import {
  addProductSuccess,
  clearSearchState, editProductSuccess, getProductsSuccess,
  removeProductSuccess,
  searchProductSuccess
} from '../actions/productActions';

function* initRequest() {
  yield put(setLoading(true));
  yield put(setRequestStatus(null));
}

function* handleError(e) {
  yield put(setLoading(false));
  yield put(setRequestStatus(e?.message || 'Failed to fetch products'));
  console.log('ERROR: ', e);
}

function* handleAction(location, message, status) {
  if (location) yield call(history.push, location);
  yield call(displayActionMessage, message, status);
}

function* productSaga({ type, payload }) {
  console.log(type)
  switch (type) {
    case GET_PRODUCTS:
      try {
        console.log("-------------------grt-----------------")
        const result = yield call(kernel.getProducts, payload);
        if (result.products.length === 0) {
          handleError('No items found.');
        } else {
          yield put(getProductsSuccess({
            products: result.products,
          }));
          yield put(setRequestStatus(''));
        }
        // yield put({ type: SET_LAST_REF_KEY, payload: result.lastKey });
        yield put(setLoading(false));
        // window.location.reload()

      } catch (e) {
        console.log(e);
        yield handleError(e);
      }
      break;

    case ADD_PRODUCT: {
      try {

        const product = {
          ...payload,
          // image: downloadURL,
          // imageCollection: [image, ...images]
        };

        yield call(kernel.addProduct, 7, product);
        yield put(addProductSuccess({
          id: 7,
          ...product
        }));
        yield handleAction(ADMIN_PRODUCTS, 'Item succesfully added', 'success');
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add: ${e?.message}`, 'error');
      }
      break;
    }
    case EDIT_PRODUCT: {
      try {
      
        let newUpdates = { ...payload.updates };

      
        yield call(kernel.editProduct, payload.id, newUpdates);
        yield put(editProductSuccess({
          id: payload.id,
          updates: newUpdates
        }));
        yield handleAction(ADMIN_PRODUCTS, 'Item succesfully edited', 'success');
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to edit: ${e.message}`, 'error');
      }
      break;
    }
    case REMOVE_PRODUCT: {
      try {
        // yield initRequest();
        yield call(kernel.removeProduct, payload);
        yield put(removeProductSuccess(payload));
        yield put(setLoading(false));
        yield handleAction(ADMIN_PRODUCTS, 'Item succesfully removed', 'success');
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to remove: ${e.message}`, 'error');
      }
      break;
    }
    case SEARCH_PRODUCT: {
      try {
        yield initRequest();
        // clear search data
        yield put(clearSearchState());

        const state = yield select();
        const result = yield call(kernel.searchProducts, payload.searchKey);

        if (result.products.length === 0) {
          yield handleError({ message: 'No product found.' });
          yield put(clearSearchState());
        } else {
          yield put(searchProductSuccess({
            products: result.products,
            lastKey: result.lastKey ? result.lastKey : state.products.searchedProducts.lastRefKey,
            total: result.total ? result.total : state.products.searchedProducts.total
          }));
          yield put(setRequestStatus(''));
        }
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
      }
      break;
    }
    default: {
      throw new Error(`Unexpected action type ${type}`);
    }
  }
}

export default productSaga;
