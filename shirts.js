const { useReducer } = React;

const initialState = tshirts.map(t => ({ ...t, quantity: 1 }));

function reducer(state, action) {
  switch (action.type) {
    case "BUY":
      return state.map((item, index) => {
        if (index === action.index) {
          const buyQty = item.quantity;
          if (buyQty > item.stock) {
            alert(`Cannot buy more than stock (${item.stock})`);
            return item;
          }
          const newStock = item.stock - buyQty;
          return { ...item, stock: newStock, quantity: 1 };
        }
        return item;
      });
    case "CHANGE_QUANTITY":
      return state.map((item, index) => {
        if (index === action.index) {
          const qty = parseInt(action.quantity, 10);
          // Ensure quantity is at least 1 and at most stock
          const safeQty = Math.min(Math.max(qty, 1), item.stock);
          return { ...item, quantity: safeQty };
        }
        return item;
      });
    default:
      return state;
  }
}

function TShirtCard({ shirt, index, dispatch }) {
  const handleBuy = () => {
    dispatch({ type: "BUY", index });
  };

  const handleQuantityChange = (e) => {
    dispatch({ type: "CHANGE_QUANTITY", index, quantity: e.target.value });
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: 10,
        padding: 10,
        width: 220,
        borderRadius: 6,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3>{shirt.title}</h3>
      <img
        src={`images/${shirt.image}`}
        alt={shirt.title || "T-shirt"}
        style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 4 }}
      />
      <p style={{ fontWeight: "bold", margin: "8px 0" }}>
        Price: ${shirt.price.toFixed(2)}
      </p>

      {shirt.stock > 0 ? (
        <>
          <p style={{ margin: "5px 0" }}>Stock: {shirt.stock}</p>
          <label htmlFor={`qty-select-${index}`} style={{ marginRight: 8 }}>
            Qty:
          </label>
          <select
            id={`qty-select-${index}`}
            value={shirt.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={shirt.stock}
            style={{ marginRight: 10 }}
          >
            {Array.from({ length: shirt.stock }, (_, i) => i + 1).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
          <button onClick={handleBuy} style={{ cursor: "pointer" }}>
            Buy
          </button>
        </>
      ) : (
        <p style={{ color: "red", fontWeight: "bold" }}>Out of Stock</p>
      )}
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontFamily: "Arial, sans-serif" }}>T-Shirts Store</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {state.map((shirt, index) => (
          <TShirtCard key={index} shirt={shirt} index={index} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);