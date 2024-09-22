import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {  useState } from 'react';
import { CartItem } from '../types/cart';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../redux/features/cartSlice';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const [showConfirmRemove, setShowConfirmRemove] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleRemove = (productId: string) => {
    setItemToRemove(productId);
    setShowConfirmRemove(true);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromCart(itemToRemove));
      setShowConfirmRemove(false);
      setItemToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowConfirmRemove(false);
    setItemToRemove(null);
  };

  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-6 mt-20">
      <h2 className="text-2xl font-semibold mb-6">Cart</h2>

      {items.length === 0 && <p className="text-center">Your cart is empty.</p>}

      <div className="bg-white border border-gray-300 rounded-md shadow-md p-6">
        {items.map((item: CartItem) => (
          <div key={item.product._id} className="flex items-center border-b border-gray-200 py-4">
            <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-md mr-4" />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{item.product.name}</h3>
              <p className="text-gray-600">${item.product.price}</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => dispatch(decrementQuantity(item.product._id))}
                  className="px-2 py-1 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 transition duration-300"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="mx-4">{item.quantity}</span>
                <button
                  onClick={() => dispatch(incrementQuantity(item.product._id))}
                  className="px-2 py-1 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 transition duration-300"
                  disabled={item.quantity >= item.product.stockQuantity}
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 border-t border-gray-300 pt-4">
          <h3 className="text-xl font-semibold">Total Price: ${totalPrice.toFixed(2)}</h3>
          <Link
            to="/checkout"
            className={`mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition duration-300 ${totalPrice <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-disabled={totalPrice <= 0}
          >
            Place Order
          </Link>
        </div>
      </div>

      {showConfirmRemove && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <p className="text-lg mb-4">Are you sure you want to remove this item from your cart?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition duration-300"
              >
                Confirm
              </button>
              <button
                onClick={cancelRemove}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
