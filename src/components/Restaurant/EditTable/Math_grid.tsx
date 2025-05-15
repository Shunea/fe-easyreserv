

import React from "react";
import classes from './Grid.module.css'
import DraggableTable from './DraggableTable';
import DraggableItem from './DraggableItem';
interface GridProps {
  restaurantItems: any,
  tables: any
  rotationAngle :any;
  gridHeight: number,
  gridWidth: number,
  updateTablesPositionState?: any,
  updateItemsPositionState?: any,
  onReservations: boolean,
  selectedRotationTableId:any;
  placeType:any;
  handleRemoveRestaurantItemFromGrid: any
}

const Grid: React.FC<GridProps> = ({ placeType, updateItemsPositionState, updateTablesPositionState, restaurantItems, tables,rotationAngle ,selectedRotationTableId, gridHeight, gridWidth, onReservations, handleRemoveRestaurantItemFromGrid }) => {
  const TableElementWidth = 50;
  const TableElementHeight = 50;

  const draggableTables = tables.map((table) => {
    return <DraggableTable key={`${table.id + table.tableName}`} placeType={placeType} gridWidth={gridWidth} gridHeight={gridHeight} table={table} rotationAngle ={rotationAngle} selectedRotationTableId={selectedRotationTableId} updateTablesPositionState={updateTablesPositionState} onReservations={onReservations} />
  })
  const draggableItems = restaurantItems.map((item) => {
    return <DraggableItem key={`${item.id + item.tableName}`} gridWidth={gridWidth} gridHeight={gridHeight} item={item} updateItemsPositionState={updateItemsPositionState} onReservations={onReservations} handleRemoveRestaurantItemFromGrid={handleRemoveRestaurantItemFromGrid} />
  })

  return (
    <div className={classes.grid}>
      {draggableTables}
      {draggableItems}
    </div>
  );
};

export default Grid;
