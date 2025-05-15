import React, { useCallback, useEffect, useState } from "react";
import classes from "./Communication.module.css";
import {
  calendarIcon,
  deleteIcon,
  dotIcon,
  dublicateIcon,
  editIcon,
  notificationIcon,
  plusIcon,
  seatsIcon,
} from "src/icons/icons";
import DiscountImage from "../../assets/Discount.png";
import HappyHourImage from "../../assets/HappyHour.png";
import SpecialMenuImage from "../../assets/SpecialMenu.png";
import LoyaltyImage from "../../assets/Loyalty.png";
import EventsImage from "../../assets/Events.png";
import HolidayImage from "../../assets/Holliday.png";
import HalfPageForm from "src/UI/HalfPageForm";
import NewMessage from "./AddMessage/AddMessage";
import classesCategoryButton from "./AddCategory/AddCategoryButton.module.css";
import AddCategoryButton from "./AddCategory/AddCategoryButton";
import {
  createCommunicationMessage,
  deleteCommunicationMessage,
  getCommunicationMessage,
  getCommunicationMessageById,
  getCommunicationMessageFilter,
  getCommunicationMessageType,
  messageInfo,
} from "src/auth/api/requests";
import { Restaurant } from "src/Types";
import { toast } from "react-toastify";
import EditMessage from "./EditMessage/EditMessage";
import { NotificationButton } from "../Statistics/Header";
import { Typography } from "@mui/material";
import NewCategory from "./AddCategory/NewCategory";
import ReactPaginate from "react-paginate";

interface MessageInfo {
  id: string;
  title?: string;
  type: string;
  message: string;
  startDate: string | null;
  endDate: string | null;
  discount: string;
  restaurantId: string;
  communicationTypeId?: string | null;
}
interface CommunicationProps {
  clientStatus: string;
  lastVisit: Date | null;
  // orderPriceFrom: string;
  // orderPriceTo: string;
  // orderCategory: string;
  // timeOfTheDay: string;
}
type Filter = {
  sortBy?: {
    column: string;
    order: string;
  };
  search?: string;
  pagination?: number;
};
const Communication: React.FC<CommunicationProps> = ({
  clientStatus,
  lastVisit,
  // orderPriceFrom,
  // orderPriceTo,
  // orderCategory,
  // timeOfTheDay,
}) => {
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Messages");
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [filteredMessages, setFilteredMessages] = useState<MessageInfo[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (showCreateMessage) {
      document.body.style.position = "sticky";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "static";
      document.body.style.overflowY = "scroll";
    }
  }, [showCreateMessage]);

  const handleOpenCreateMessage = () => {
    setShowCreateMessage(true);
  };

  const fetchDataMessages = async () => {
    try {
      const fetchedMessages = await getCommunicationMessage();
      const formattedMessages = fetchedMessages.data.map((message) => ({
        ...message,
        startDate: message.startDate
          ? new Date(message.startDate).toLocaleDateString()
          : null,
        endDate: message.endDate
          ? new Date(message.endDate).toLocaleDateString()
          : null,
      }));
      setMessages(formattedMessages);
      setFilteredMessages(formattedMessages);
    } catch (error) {
      console.error("Can't get messages:", error);
    }
  };
  const fetchDataMessagesType = async () => {
    try {
      const response = await getCommunicationMessageType();
      const typesFromBackend = response.data.map((type) => type.type);
      setCategories(["All Messages", ...typesFromBackend]);
    } catch (error) {
      console.error("Can't get categories:", error);
    }
  };

  const handleCloseCreateMessage = () => {
    fetchDataMessages();
    setShowCreateMessage(false);
  };
  const handleOpenUpdateMessage = (id: string) => {
    setSelectedMessageId(id);
    setShowUpdateMessage(true);
  };

  const handleCloseUpdateMessage = () => {
    fetchDataMessages();
    setShowUpdateMessage(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    fetchDataMessagesType();
    setIsModalOpen(false);
  };
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const filter: Filter = {};

        if (currentPage >= 0) {
          filter.pagination = currentPage * 10;
        }
        const fetchedMessages = await getCommunicationMessageFilter(filter);
        const formattedMessages = fetchedMessages.data.map((message) => ({
          ...message,
          startDate: message.startDate
            ? new Date(message.startDate).toLocaleDateString()
            : null,
          endDate: message.endDate
            ? new Date(message.endDate).toLocaleDateString()
            : null,
        }));
        setMessages(formattedMessages);
        setTotalPages(fetchedMessages.pagination.totalPages);
        setFilteredMessages(formattedMessages);
      } catch (error) {
        console.error("Can't get messages:", error);
      }
    };
    fetchData();
  }, [currentPage]);
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const handleCategorySelect = (type: string) => {
    setActiveCategory(type);
    if (type === "All Messages") {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter((message) => message.type === type);
      setFilteredMessages(filtered);
    }
  };
  const handleDuplicateMessage = async (id: string) => {
    try {
      const messageDetails = await getCommunicationMessageById(id);

      const newMessageData: messageInfo = {
        title: "Copy of " + messageDetails.title,
        communicationTypeId: messageDetails.communicationTypeId,
        message: messageDetails.message,
        startDate: messageDetails.startDate,
        endDate: messageDetails.endDate,
        discount: messageDetails.discount,
        sendMessageDate: messageDetails.sendMessageDate,
      };

      await createCommunicationMessage(newMessageData);

      const updatedMessages = await getCommunicationMessage();
      setMessages(updatedMessages.data);

      toast.success("Message duplicated");
      fetchDataMessages();
    } catch (error) {
      console.error("Error duplicating message:", error);
      toast.error("Error duplicating message");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteCommunicationMessage(id);

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id)
      );
      toast.success("Message deleted");
      fetchDataMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  };
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    if (storedRestaurant) {
      const selectedRestaurantFromCookie = storedRestaurant;
      setSelectedRestaurant(selectedRestaurantFromCookie);
    }
  }, []);
  useEffect(() => {
    fetchDataMessagesType();
  }, []);

  return (
    <>
      <div className={classes.Container}>
        <header className={classes.Header}>
          <p>Communication</p>
          <div className={classes.Head}>
            <button
              className={classes.AddMessageButton}
              onClick={handleOpenCreateMessage}
            >
              <span className={classes.AddMessageIcon}>{plusIcon}</span>
              <span className={classes.AddMessageText}>Add new message</span>
            </button>
            <NotificationButton />
          </div>
        </header>
        <div className={classes.Body}>
          <div className={classes.FilterNav}>
            <div className={classes.Filter}>
              {categories.map((category) => (
                <p
                  key={category}
                  className={
                    activeCategory === category ? classes.ActiveCategory : ""
                  }
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </p>
              ))}
            </div>
            {/* <AddCategoryButton text="Create category" /> */}
            <button
              className={classesCategoryButton.AddEmployeeButton}
              onClick={handleOpenModal}
            >
              <span className={classesCategoryButton.AddCategoryIcon}>
                {plusIcon}
              </span>
              <Typography
                className={classesCategoryButton.AddEmployeeButtonText}
              >
                Create category
              </Typography>
            </button>
          </div>
          {filteredMessages
            ?.filter(
              (message) =>
                !message.restaurantId ||
                message.restaurantId === selectedRestaurant?.id
            )
            .map((message) => (
              <div key={message.id} className={classes.MessageList}>
                <div className={classes.MessageInfo}>
                  <img
                    src={selectedRestaurant?.image}
                    width={72}
                    height={72}
                    alt="Discount"
                  />
                  <div className={classes.MessageInfoText}>
                    <div>
                      <p>{message.title}</p>
                      <p>{message.message}</p>
                    </div>
                    <div>
                      <button>{message.type}</button>
                      <span>
                        · {calendarIcon} {message.startDate}
                      </span>
                      {/* <span>{seatsIcon} 1024</span> */}
                    </div>
                  </div>
                </div>
                <div className={classes.MessageActions}>
                  <button
                    className={classes.AddCategoryButton}
                    onClick={() => handleOpenUpdateMessage(message.id)}
                  >
                    <span className={classes.AddCategoryIcon}>{editIcon}</span>
                    <span className={classes.AddCategoryText}>Edit</span>
                  </button>
                  <button
                    className={classes.AddCategoryButton}
                    onClick={() => handleDuplicateMessage(message.id)}
                  >
                    <span className={classes.AddCategoryIcon}>
                      {dublicateIcon}
                    </span>
                  </button>
                  <button
                    className={classes.AddCategoryButton}
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    <span className={classes.AddCategoryIcon}>
                      {deleteIcon}
                    </span>
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className={classes.Pagination}>
        <div className={classes.Pages}>
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={classes.PageList}
            activeClassName={classes.ActivePage}
            activeLinkClassName={classes.ActivePageText}
            pageClassName={classes.NotActivePage}
            pageLinkClassName={classes.NotActivePageText}
            breakLabel="..."
            renderOnZeroPageCount={null}
            previousClassName={classes.disabled}
            nextClassName={classes.disabled}
          />
        </div>
      </div>
        {showUpdateMessage && (
          <HalfPageForm
            title="Edit new message"
            onClose={handleCloseUpdateMessage}
          >
            <EditMessage
              onClose={handleCloseUpdateMessage}
              clientStatus={clientStatus}
              lastVisit={lastVisit}
              // orderPriceFrom={orderPriceFrom}
              // orderPriceTo={orderPriceTo}
              // orderCategory={orderCategory}
              // timeOfTheDay={timeOfTheDay}
              messageId={selectedMessageId}
            />
          </HalfPageForm>
        )}
        {showCreateMessage && (
          <HalfPageForm
            title="Create new message"
            onClose={handleCloseCreateMessage}
          >
            <NewMessage
              onClose={handleCloseCreateMessage}
              clientStatus={clientStatus}
              lastVisit={lastVisit}
              // orderPriceFrom={orderPriceFrom}
              // orderPriceTo={orderPriceTo}
              // orderCategory={orderCategory}
              // timeOfTheDay={timeOfTheDay}
            />
          </HalfPageForm>
        )}
      </div>
      
      {isModalOpen && <NewCategory onClose={handleCloseModal} />}
    </>
  );
};
export default Communication;
