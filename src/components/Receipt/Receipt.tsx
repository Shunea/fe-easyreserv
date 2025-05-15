import React, { useEffect, useState } from "react";
import classes from "./Receipt.module.css";
import { NotificationButton } from "../Statistics/Header";
import { getAllPaymentAccounts } from "../../auth/api/requests";

type PaymentData = {
  receipt_number: string;
  order_id: string;
  created_at: string;
  payment_type: string;
  amount: number;
  payment_status: string;
  operator: {
    username: string;
    id: string;
    email: string;
  };
  restaurant: {
    name: string;
    id: string;
    address: string;
  };
};

const Receipt = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log('1. Starting API request...');
        const response = await getAllPaymentAccounts();
        console.log('2. Raw API Response:', response);
        
        let paymentArray;
        if (Array.isArray(response)) {
          console.log('3A. Response is Array:', response);
          paymentArray = response;
        } else if (response?.data?.data) {
          console.log('3B. Response has data.data:', response.data.data);
          paymentArray = response.data.data;
        } else if (response?.data) {
          console.log('3C. Response has data:', response.data);
          paymentArray = response.data;
        } else {
          console.log('3D. No valid data structure found:', response);
          paymentArray = [];
        }
        
        console.log('4. Final paymentArray:', paymentArray);
        setPayments(paymentArray);
        console.log('5. State updated with payments');
        
      } catch (error: any) {
        console.error('Error in fetchPayments:', {
          message: error?.message,
          error,
          stack: error?.stack
        });
      }
    };

    fetchPayments();
  }, []);

  const handleShowDetails = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className={classes.CommonReceiptContainer}>
      <div className={classes.ReceiptContainer}>
        <div className={classes.header}>
          <h1>Receipt</h1>
          <NotificationButton />
        </div>
        <div className={classes.tableHeader}>
          <div>№</div>
          <div>Check number</div>
          <div>Order ID</div>
          <div>Restaurant name</div>
          <div>Payment date</div>
          <div>Payment method</div>
          <div>Sum</div>
          <div>Status</div>
          <div>Operator name</div>
          <div>Details</div>
        </div>
        <div className={classes.tableContent}>
          {Array.isArray(payments) && payments.map((payment, index) => (
            <div key={payment.order_id} className={classes.tableRow}>
              <div>{index + 1}</div>
              <div>{payment.receipt_number}</div>
              <div>{payment.order_id}</div>
              <div>{payment.restaurant?.name}</div>
              <div>{new Date(payment.created_at).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}</div>
              <div>{payment.payment_type}</div>
              <div>{payment.amount}</div>
              <div>{payment.payment_status}</div>
              <div>{payment.operator?.username}</div>
              <div>
                <span 
                  className={classes.showDetails}
                  onClick={() => handleShowDetails(payment)}
                >
                  Show Details
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedPayment && (
        <div className={classes.modalOverlay} onClick={handleOverlayClick}>
          <div className={classes.modalContent}>
            <div className={classes.modalHeader}>
              <h2>Check Detail #{selectedPayment.receipt_number}</h2>
              <span 
                className={classes.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </span>
            </div>
            <div className={classes.modalBody}>
              <div className={classes.detailRow}>
                <span>Check number:</span>
                <span>{selectedPayment.receipt_number}</span>
              </div>
              <div className={classes.detailRow}>
                <span>Order ID:</span>
                <span>{selectedPayment.order_id}</span>
              </div>
              <div className={classes.detailRow}>
                <span>Restaurant name:</span>
                <span>{selectedPayment.restaurant?.name}</span>
              </div>
              <div className={classes.detailRow}>
                <span>Payment date:</span>
                <span>{new Date(selectedPayment.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className={classes.detailRow}>
                <span>Payment method:</span>
                <span>{selectedPayment.payment_type}</span>
              </div>
              <div className={classes.detailRow}>
                <span>Sum:</span>
                <span>{selectedPayment.amount}</span>
              </div>
              <div className={classes.detailRow}>
                <span>Status:</span>
                <span>{selectedPayment.payment_status}</span>
              </div>
              <div className={classes.detailRow}>
                <span>Operator name:</span>
                <span>{selectedPayment.operator?.username}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipt;