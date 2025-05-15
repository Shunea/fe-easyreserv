import React, { useEffect, useRef, useState } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import {
  rectangle4Table,
  rectangle6Table,
  rectangle8Table,
  round2Table,
  round3Table,
  round4Table,
  round6Table,
  round8Table,
  small4RoundTable,
  small4SquareTable,
  square2Table,
  square3Table,
  square4Table,
  square6Table,
  square5Table,
  rectangle7Table,
  square8Table,
  rectangle10Table,
  rectangle12Table,
  oneSingle,
  oneBunkBed,
  oneDouble,
} from "src/icons/icons";
import classes from "./DraggableTable.module.css";
interface GridProps {
  rows: number;
  cols: number;
  tables: any;
  updateTablesPositionState: any;
  onReservations?: boolean;
  placeType:string;
}

const DraggableTable = (props: {
  gridWidth: number;
  gridHeight: number;
  table: any;
  rotationAngle: any;
  selectedRotationTableId: any;
  updateTablesPositionState: any;
  onReservations: boolean;
  placeType:string;
}) => {
  // const gridWidth = 924;
  // const gridHeight = 550;
  const TableElementWidth = 50;
  const TableElementHeight = 50;
  const [x, setX] = useState(props.table.xCoordinates || 11);
  const [y, setY] = useState(props.table.yCoordinates || 11);
  // useEffect(() => {
  //   if (props.table.xCoordinates !== 0 && props.table.yCoordinates !== 0) {
  //     setX(props.table.xCoordinates)
  //     setY(props.table.yCoordinates)
  //   }
  // }, []);
  const nodeRef = useRef(null);
  const isRotated = props.selectedRotationTableId === props.table.id;

  const handleStop = (event, dragElement) => {
    setX(dragElement.x);
    setY(dragElement.y);
    if (!props.onReservations) {
      overlaps();
      props.updateTablesPositionState(props.table.id, x, y);
    }
  };

  function getTableDetails(
    shape:
      | "RECTANGLE"
      | "SQUARE"
      | "ROUND"
      | "SMALL_SQUARE"
      | "SMALL_ROUND"
      | "BIG_SQUARE"
      | "BIG_ROUND",
    seats: number
  ): {
    svg: any;
    width: number;
    height: number;
  } {
    if (seats == 2) {
      if (shape === "ROUND") {
        return {
          svg: round2Table,
          width: 57,
          height: 40,
        };
      }
      if (shape === "SQUARE") {
        return {
          svg: square2Table,
          width: 60,
          height: 44,
        };
      }
    }
    if (seats == 3) {
      if (shape === "ROUND") {
        return {
          svg: round3Table,
          width: 56,
          height: 50,
        };
      }
      if (shape === "SQUARE") {
        return {
          svg: square3Table,
          width: 60,
          height: 44,
        };
      }
    }
    if (seats == 4) {
      if (shape === "BIG_ROUND") {
        return {
          svg: round4Table,
          width: 74,
          height: 74,
        };
      }
      if (shape === "BIG_SQUARE") {
        return {
          svg: square4Table,
          width: 74,
          height: 74,
        };
      }
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle4Table,
          width: 72,
          height: 58,
        };
      }
      if (shape === "SMALL_SQUARE") {
        return {
          svg: small4SquareTable,
          width: 59,
          height: 57,
        };
      }
      if (shape === "SMALL_ROUND") {
        return {
          svg: small4RoundTable,
          width: 59,
          height: 57,
        };
      }
    }
    if (seats == 5) {
      if (shape === "SQUARE") {
        return {
          svg: square5Table,
          width: 60,
          height: 44,
        };
      }
    }
    if (seats == 6) {
      if (shape === "BIG_ROUND") {
        return {
          svg: round6Table,
          width: 74,
          height: 70,
        };
      }
      if (shape === "BIG_SQUARE") {
        return {
          svg: square6Table,
          width: 73,
          height: 74,
        };
      }
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle6Table,
          width: 72,
          height: 58,
        };
      }
    }
    if (seats == 7) {
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle7Table,
          width: 73,
          height: 74,
        };
      }
    }
    if (seats == 8) {
      if (shape === "BIG_ROUND") {
        return {
          svg: round8Table,
          width: 74,
          height: 74,
        };
      }
      if (shape === "BIG_SQUARE") {
        return {
          svg: square8Table,
          width: 74,
          height: 74,
        };
      }
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle8Table,
          width: 89,
          height: 58,
        };
      }
    }
    if (seats == 10) {
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle10Table,
          width: 89,
          height: 58,
        };
      }
    }
    if (seats == 12) {
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle12Table,
          width: 89,
          height: 58,
        };
      }
    }
    return {
      svg: "",
      width: 0,
      height: 0,
    };
  }
  function getRoomDetails(
    shape:
      | "RECTANGLE"
      | "ROUND"
      | "SQUARE"
      | "SMALL_SQUARE"
      | "SMALL_ROUND"
      | "BIG_ROUND"
      | "BIG_SQUARE"
      | "SMALL"
      | "",
    seats: number
  ): { svg: any; width: number; height: number } {
    if (seats == 2) {
      if (shape === "SMALL_SQUARE") {
        return {
          svg: oneBunkBed,
          width: 59,
          height: 57,
        };
      }
      if (shape === "SQUARE") {
        return {
          svg: oneDouble,
          width: 70,
          height: 54,
        };
      }
    }
   
    if (seats == 1) {
      if (shape === "SMALL_SQUARE") {
        return {
          svg: oneSingle,
          width: 59,
          height: 57,
        };
      }
    }
    return {
      svg: "",
      width: 0,
      height: 0,
    };
  }
  useEffect(() => {
    if (!props.onReservations) {
      overlapsOnInitialPlacing();
      props.updateTablesPositionState(
        props.table.id,
        x,
        y,
        props.table.rotationAngle
      );
    }
  }, [x, y]);

  function overlapsOnInitialPlacing() {
    var draggables = document.getElementsByClassName("react-draggable");

    Array.from(draggables).map((item, e) => {
      Array.from(draggables).map((oItem, e) => {
        if (item !== oItem) {
          const rect1 = item.getBoundingClientRect();
          const rect2 = oItem.getBoundingClientRect();

          const isInHoriztonalBounds =
            rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
          const isInVerticalBounds =
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;

          var isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
          let initialX = x;
          let initialY = y;
          let currentY = initialY + rect2.height + 11;
          let currentX = initialX + rect2.width + 11;
          if (isOverlapping) {
            if (currentY > props.gridHeight - rect1.height - 11) {
              setY(11);
              setX(Math.round(currentX));
            } else {
              setY(Math.round(currentY));
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

          const isInHoriztonalBounds =
            rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
          const isInVerticalBounds =
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;

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
  let tableDetails =
        props.placeType === "HOTEL"
          ? getRoomDetails(props.table.shape, props.table.seats)
          : getTableDetails(props.table.shape, props.table.seats);
  // let tableDetails = getTableDetails(props.table.shape, props.table.seats);
  // let tableDetails = getRoomDetails(props.table.shape, props.table.seats);
  return (
    <Draggable
      grid={[2, 2]}
      bounds={{
        top: 0 + 11,
        left: 0 + 11,
        right: props.gridWidth - tableDetails.width - 11,
        bottom: props.gridHeight - tableDetails.height - 11,
      }}
      onStop={handleStop}
      nodeRef={nodeRef}
      position={{ x: x, y: y }}
      key={props.table.id}
    >
      <div ref={nodeRef} className={classes.draggable_table_container}>
        <div
          style={{
            width: `${tableDetails.width}px`,
            height: `${tableDetails.height}px`,
            transform:
              isRotated === true
                ? `rotate(${props.rotationAngle}deg)`
                : `rotate(${props.table.rotationAngle}deg)`,
          }}
        >
          <p
            className={classes.table_name}
            style={{ lineHeight: `${tableDetails.height}px` }}
          >
            {props.table.tableName}
          </p>
          {tableDetails.svg}
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableTable;
