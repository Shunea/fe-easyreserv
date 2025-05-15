import React, { useEffect, useState } from "react";
import classes from "./HalfPageForm.module.css";
import { crossIcon } from 'src/icons/icons';
import Title from 'src/components/Title';
// const a = [
//   {
//     name: 'Details',
//     component: <Details />
//   },
//   {
//     name: 'Waiter',
//     info: '2',
//     component: <Waiter />
//   },
// ]//example for items prop

// to prevent scrolling when the form is opened add this to 
// parent element where halfPageForm is the form's state
//
// useEffect(() => {
//   if (halfPageForm) {
//     document.body.style.position = 'sticky';
//     document.body.style.overflow = 'hidden';
//   }
//   if (!halfPageForm) {
//     document.body.style.position = 'static';
//     document.body.style.overflowY = 'scroll';
//   }
// }, [halfPageForm]);
type ItemType = {
  name: string,
  info?: any,
  component: any
}

const HalfPageForm = (props: { title: string, items?: ItemType[], children?: any, onClose: any }) => {
  const firstItem = props.items ? props.items[0] : { component: '' };
  const [selectedItem, setSelectedItem] = useState(firstItem);

  useEffect(() => {
    if (props.items) {

      const cards = document.querySelectorAll(`.${classes.multiple_choice_item}`);
      cards.forEach((element) => {
        element.classList.remove(classes.selectedItem);
      });
      cards[0].classList.add(classes.selectedItem);
    }
  }, []);

  const handleSelect = (event: any, key: any): any => {
    if (props.items) {
      const cards = document.querySelectorAll(`.${classes.multiple_choice_item}`);
      cards.forEach((element) => {
        element.classList.remove(classes.selectedItem);
      });
      props.items.forEach((item) => {
        if (item.name === key) {
          setSelectedItem(item);
        }
      })
      event.currentTarget.classList.toggle(classes.selectedItem);
    }
  };
  return (
    <div className={classes.blurred_background}>
      <div className={classes.half_form_container}>
        <div className={classes.header}>
          <p>{props.title}</p>
          <div className={classes.cross_icon} onClick={props.onClose}>{crossIcon}</div>
        </div>
        {props.items && <div className={classes.multiple_choice}>
          <div className={classes.multiple_choice_items}>
            {props.items?.map((item) => {
              return (<div onClick={(event) => handleSelect(event, item.name)} className={classes.multiple_choice_item}>{item.name}{item.info && <div className={classes.item_info}><div className={classes.dot}> · </div><div className={classes.info_number}>{item.info}</div></div>}</div>)
            })}
          </div>
        </div>
        }
        <div className={classes.contents}>
          {props.items &&
            <div className={classes.selected_container}>
              {props.items && selectedItem.component}
            </div>
          }

          {props.children}
        </div>
      </div>
    </div>
  );
};

export default HalfPageForm;
