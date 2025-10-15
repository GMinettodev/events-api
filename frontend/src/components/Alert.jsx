// import React, { useEffect } from 'react';

// export default function Alert({ message, onClose }) {
//   // Automatically close the alert after 4 seconds
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         onClose(); // Close alert after 4 seconds
//       }, 4000);
//       return () => clearTimeout(timer); // Clean up the timer
//     }
//   }, [message, onClose]);

//   if (!message) return null; // Don't render the alert if there's no message

//   return (
//     <div
//       className={`popup-alert ${message.type ? `popup-${message.type}` : 'popup-success'}`}
//       role="alert"
//     >
//       {message.text}
//       <button onClick={onClose} className="alert-close-btn">
//         ×
//       </button>
//     </div>
//   );
// }
