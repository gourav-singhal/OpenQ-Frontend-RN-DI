// Third party
import React from 'react';
import ErrorModal from './ErrorModal';
import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal';

const ConfirmErrorSuccessModalsTrio = ({
  showSuccessModal,
  setShowSuccessModal,
  successMessage,
  transactionHash,

  showErrorModal,
  setShowErrorModal,
  error,

  showConfirmationModal,
  confirmMethod,
  confirmationMessage,
  confirmationTitle,
  setShowConfirmationModal,
  positiveOption,
}) => {
  // Render
  return (
    <>
      {showErrorModal && <ErrorModal setShowErrorModal={setShowErrorModal} error={error} />}
      {showConfirmationModal && (
        <ConfirmationModal
          setShowConfirmationModal={setShowConfirmationModal}
          confirmationMessage={confirmationMessage}
          confirmationTitle={confirmationTitle}
          positiveOption={positiveOption}
          confirmMethod={confirmMethod}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          setShowSuccessModal={setShowSuccessModal}
          successMessage={successMessage}
          transactionHash={transactionHash}
        />
      )}
    </>
  );
};

export default ConfirmErrorSuccessModalsTrio;
