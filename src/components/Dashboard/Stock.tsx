import { plusIcon, productDot, stocksIcon } from "../../icons/icons";
import classes from "./Stock.module.css";

type Props = {};
const Stock = (props: Props) => {
  const stocks = [
    { name: "Basil", stock: 0 },
    { name: "Ruccola", stock: 2 },
    { name: "Chicken steak", stock: 3 },
    { name: "Chease", stock: 7 },
  ];
  return (
    <div className={classes.Stock}>
      <div className={classes.StockHead}>
        <label className={classes.StockHeadText}>Low stock</label>
      </div>
      {/* <div className={classes.StockContent}>
        <div className={classes.StockList}>
          {stocks.map((stock) => (
            <div className={classes.StockRow}>
              <div className={classes.ProductTitle}>
                <span
                  className={classes.ProductDot}
                  style={{
                    color: `${
                      stock.stock === 0
                        ? "#C2C2C2"
                        : stock.stock > 0 && stock.stock <= 6
                        ? "#F23636"
                        : "#FE9800"
                    }`,
                  }}
                >
                  {productDot}
                </span>
                <span className={classes.ProductName}>{stock.name}</span>
              </div>
              <div className={classes.ProductActions}>
                <button className={classes.ProductAction}>{plusIcon}</button>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <div className={classes.ComingSoon}>Coming soon</div>
      <button className={classes.ViewStocksButton}>
        <span className={classes.ButtonIcon}>{stocksIcon}</span>
        <span className={classes.ButtonText}>View stocks</span>
      </button>
    </div>
  );
};
export default Stock;
