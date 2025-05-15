
import React, { useEffect, useRef, useState } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import classes from './DraggableItem.module.css';

import { RestaurantItem } from 'src/Types';
import { bathroomSpace, bigPlayground, crossIcon, exitElement, exitHorizontalElement, mediumPlayground, receptionBar, stairsDown, stairsUp, windowCell, windowCellHorizontal } from 'src/icons/icons';



const DraggableItem = (props: { gridWidth: number, gridHeight: number, item: RestaurantItem, updateItemsPositionState: any, onReservations: boolean, handleRemoveRestaurantItemFromGrid: any }) => {
  // const gridWidth = 924;
  // const gridHeight = 550;
  const [x, setX] = useState(props.item.xCoordinates || 11);
  const [y, setY] = useState(props.item.yCoordinates || 11)



  const handleStop = (event, dragElement) => {
    setX(dragElement.x)
    setY(dragElement.y)
    if (!props.onReservations) {
      overlaps();
      props.updateItemsPositionState(props.item.id, x, y);
    }
  };


  useEffect(() => {
    if (!props.onReservations) {
      // overlapsOnInitialPlacing();
      props.updateItemsPositionState(props.item.id, x, y);
    }

  }, [x, y]);

  const handleExitDrag = (event, dragElement) => {
    // setX(dragElement.x)
    // setY(dragElement.y)
    // if (x === 0 && y === 0) {
    //   setGridForExit([10, gridHeight])
    //   // setBoundsForExit({ top: 0, left: 0, right: gridWidth, bottom: gridHeight - TableElementWidth })
    //   console.log('ssssssssss')
    // }

    // if (x === gridWidth && y === 0) {
    //   let copy = gridForExit.slice();
    //   setGridForExit([gridWidth, 10])
    //   console.log("TO HORIZONTAL")
    // }
    // if (x === gridWidth && y === 0) {
    //   let copy = gridForExit.slice();
    //   setGridForExit([gridWidth, 10])
    //   console.log("TO HORIZONTAL")
    // }
  };

  const deleteItem = () => {
    props.handleRemoveRestaurantItemFromGrid(props.item);
  }
  function overlapsOnInitialPlacing() {
    var draggables = document.getElementsByClassName("react-draggable");

    Array.from(draggables).map((item, e) => {
      Array.from(draggables).map((oItem, e) => {

        if (item !== oItem) {
          const rect1 = item.getBoundingClientRect();
          const rect2 = oItem.getBoundingClientRect();

          const isInHoriztonalBounds = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
          const isInVerticalBounds = rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;


          var isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
          let initialX = x;
          let initialY = y;
          let currentY = initialY + rect2.height + 1;
          let currentX = initialX + rect2.width + 1;
          if (isOverlapping) {
            if (props.item.itemType === "EXIT_HORIZONTAL" || props.item.itemType === "WINDOW_HORIZONTAL") {
              setX(currentX);
              setY(initialY)
            } else {
              if (currentY > props.gridHeight - rect1.height - 1) {
                setY(11);
                setX(Math.round(currentX));
              }
              else {
                setY(Math.round(currentY));
              }
            }
          }

        }
      });
    });
  }
  function overlaps() {
    var draggables = document.getElementsByClassName("react-draggable");

    Array.from(draggables).map((item, e) => {
      Array.from(draggables).map((oItem, e) => {

        if (item !== oItem) {
          const rect1 = item.getBoundingClientRect();
          const rect2 = oItem.getBoundingClientRect();

          const isInHoriztonalBounds = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
          const isInVerticalBounds = rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;


          var isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
          let initialX = x;
          let initialY = y;

          if (isOverlapping) {
            setX(Math.round(initialX));
            setY(Math.round(initialY));
          }
        }
      });
    });
  }
  useEffect(() => {
    if (props.item.itemType === "EXIT_VERTICAL" || props.item.itemType === "WINDOW_VERTICAL") {
      setX(props.item.xCoordinates || 0)
      setY(props.item.yCoordinates || 10)
    }
    if (props.item.itemType === "EXIT_HORIZONTAL" || props.item.itemType === "WINDOW_HORIZONTAL") {
      setX(props.item.xCoordinates || 10)
      setY(props.item.yCoordinates || 0)
    }
  }, []);

  const nodeRef = useRef(null);
  if (props.item.itemType === "STAIRS_DOWN") {
    return (
      <Draggable nodeRef={nodeRef} grid={[5, 5]} bounds={{ top: 0 + 11, left: 0 + 11, right: props.gridWidth - 50 - 11, bottom: props.gridHeight - 50 - 11 }}
        onStop={handleStop}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "50px", height: "50px", }} title='Stairs down'>
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {stairsDown}
          {/* {`x:${x} y:${y}`} */}
        </div>
      </Draggable>
    );
  }
  else if (props.item.itemType === "STAIRS_UP") {
    return (
      <Draggable nodeRef={nodeRef} grid={[5, 5]} bounds={{ top: 0 + 11, left: 0 + 11, right: props.gridWidth - 50 - 11, bottom: props.gridHeight - 50 - 11 }}
        onStop={handleStop}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "50px", height: "50px", }} title='Stairs up'>
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {stairsUp}
          {/* {`x:${x} y:${y}`} */}

        </div>
      </Draggable>
    );
  }
  else if (props.item.itemType === "PLAYGROUND") {
    return (
      <Draggable nodeRef={nodeRef} grid={[5, 5]} bounds={{ top: 0 + 11, left: 0 + 11, right: props.gridWidth - 98 - 11, bottom: props.gridHeight - 98 - 11 }}
        onStop={handleStop}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "98px", height: "98px", }}>
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {mediumPlayground}
          {/* {`x:${x} y:${y}`} */}
        </div>
      </Draggable>
    );
  }
  else if (props.item.itemType === "RECEPTION_BAR") {
    return (
      <Draggable nodeRef={nodeRef} grid={[5, 5]} bounds={{ top: 0 + 11, left: 0 + 11, right: props.gridWidth - 98 - 11, bottom: props.gridHeight - 98 - 11 }}
        onStop={handleStop}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "98px", height: "98px", }}>
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {receptionBar}
          {/* {`x:${x} y:${y}`} */}

        </div>
      </Draggable>
    );
  }
  else if (props.item.itemType === "BATHROOM") {
    return (
      <Draggable nodeRef={nodeRef} grid={[5, 5]} bounds={{ top: 0 + 11, left: 0 + 11, right: props.gridWidth - 98 - 11, bottom: props.gridHeight - 66 - 11 }}
        onStop={handleStop}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "98px", height: "66px", }} >
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {bathroomSpace}
          {/* {`x:${x} y:${y}`} */}

        </div>
      </Draggable>
    );
  }
  else if (props.item.itemType === "EXIT_VERTICAL") {
    return (
      <Draggable nodeRef={nodeRef} grid={[props.gridWidth, 10]} bounds={{ top: 0, left: 0, right: props.gridWidth, bottom: props.gridHeight - 50 }}
        onStop={handleStop}
        onDrag={handleExitDrag}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "8px", height: "50px", marginLeft: `-6px` }} title='Exit'>
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {exitElement}
          {/* {`x:${x} y:${y}`} */}

        </div>
      </Draggable>
    );
  }
  else if (props.item.itemType === "EXIT_HORIZONTAL") {
    return (
      <Draggable nodeRef={nodeRef} grid={[10, props.gridHeight]} bounds={{ top: 0, left: 0, right: props.gridWidth - 50, bottom: props.gridHeight }}
        onStop={handleStop}
        onDrag={handleExitDrag}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "50px", height: "8px", marginTop: `-6px` }} title='Exit'>
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {exitHorizontalElement}
          {/* {`x:${x} y:${y}`} */}

        </div>
      </Draggable>
    );
  }
  else if (props.item.itemType === "WINDOW_VERTICAL") {
    return (
      <Draggable nodeRef={nodeRef} grid={[props.gridWidth + 6, 10]} bounds={{ top: 6, left: 0, right: props.gridWidth + 6, bottom: props.gridHeight - 97 - 6 }}
        onStop={handleStop}
        onDrag={handleExitDrag}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "8px", height: "97px", marginLeft: `-6px` }} title='Window'>
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {windowCell}
          {/* {`x:${x} y:${y}`} */}

        </div>
      </Draggable>
    );
  }
  else if (props.item.itemType === "WINDOW_HORIZONTAL") {
    return (
      <Draggable nodeRef={nodeRef} grid={[10, props.gridHeight + 6]} bounds={{ top: 0, left: 6, right: props.gridWidth - 97 - 6, bottom: props.gridHeight + 6 }}
        onStop={handleStop}
        onDrag={handleExitDrag}
        position={{ x: x, y: y }}
        key={props.item.id}
      >
        <div ref={nodeRef} className={classes.draggable_item_container} style={{ width: "97px", height: "8px", marginTop: `-6px` }} title='Window'>
          <div className={classes.cross_delete} onClick={deleteItem}>{crossIcon}</div>
          {windowCellHorizontal}
          {/* {`x:${x} y:${y}`} */}

        </div>
      </Draggable>
    );
  }
};

export default DraggableItem;
