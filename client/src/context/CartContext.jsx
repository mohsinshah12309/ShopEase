import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const CartContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// A cart line is uniquely identified by product + selling unit
// (e.g. the same medicine added as "Strip" and as "Box" are separate lines).
const makeKey = (productId, unit) => `${productId}::${unit || ""}`;

// Older saved carts (before units existed) have no key/unit — normalize them.
function normalizeItem(item) {
  if (item.key) return item;
  return {
    ...item,
    key: makeKey(item.productId, item.unit),
    unit: item.unit || null,
  };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeItem) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1, unit = null) => {
    setCartItems((prev) => {
      const key = makeKey(product._id, unit);

      // Resolve price/stock for the requested selling unit
      let price;
      let stock;
      if (unit && Array.isArray(product.units)) {
        const selectedUnit = product.units.find((u) => u.label === unit);
        if (!selectedUnit) return prev; // unknown unit — ignore
        price = selectedUnit.price;
        stock = selectedUnit.stock;
      } else {
        price =
          product.discountPrice != null && product.discountPrice < product.price
            ? product.discountPrice
            : product.price;
        stock = product.stock;
      }

      const existing = prev.find((item) => item.key === key);

      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + quantity, stock) }
            : item,
        );
      }

      return [
        ...prev,
        {
          key,
          productId: product._id,
          unit: unit || null,
          name: product.name,
          image: product.images?.[0] || "",
          price,
          quantity: Math.min(quantity, stock),
          stock,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.key !== key) return item;

        const clamped = Math.max(1, Math.min(quantity, item.stock));
        return { ...item, quantity: clamped };
      }),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Badge pulse trigger (design.md §7): increments each time cartCount
  // changes so the navbar badge can replay its scale pulse. Deliberately
  // does not fire on initial load.
  const [cartPulse, setCartPulse] = useState(0);
  const prevCartCountRef = useRef(cartCount);

  useEffect(() => {
    if (cartCount !== prevCartCountRef.current) {
      prevCartCountRef.current = cartCount;
      setCartPulse((tick) => tick + 1);
    }
  }, [cartCount]);

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    cartPulse,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
