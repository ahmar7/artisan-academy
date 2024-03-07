import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  
  boxShadow: 24,
  p: 4,
};

export default function QuizModal({showData}) {
  const [open, setOpen] = React.useState(false);
  const [currentOptions, setCurrentOptions] =  React.useState(0)
  const [selectedOptions, setSelectedOptions] = React.useState([])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleNext = () => {
    if (currentOptions + 2 <= showData?.length) {
      setCurrentOptions(currentOptions + 2)
    }else{
        setCurrentOptions(showData?.length)
        
    }

  }

  const handlePrev = () => {
    if (currentOptions > 0) {
      setCurrentOptions(currentOptions - 2)
    }
  }  
  console.log(currentOptions,"selectedOptions",selectedOptions)
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <>
        <p style={{display:"flex",justifyContent:"center",fontWeight:"bolder"}}>🚀 Course Quiz</p>
        {currentOptions >= showData?.length && (
            <div className="flex flex-col justify-center mt-5  items-center">
              <p className="text-[#555555] mb-2 mt-5 font-sofiaBold text-lg">
                Thank you !
              </p>
              <p className="text-[#555555] font-regular text-sm">
                We will personalize your tapday experience accordingly.
              </p>
              <p className="text-[#555555] font-regular text-sm">
                Now, you will see how you can publish your mobile app in few
                steps
              </p>
              <button
                // onClick={handleFinish}
                className="w-[120px] h-[42px] text-base font-regular rounded-md text-white !bg-primary mt-16"
              >
                { 'Finish'}
              </button>
            </div>
          )}
  {showData
    ?.slice(currentOptions, currentOptions + 2)
    .map((items, i) => {
      return (
        <div key={i} className="">
          <p
            style={{
              color: "#555555",
              fontFamily: "font-sofiaBold",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Q-{i} {items.question}
          </p>

          <div >
            {items?.options?.map((option) => (
              <div key={option.value}>
               <label>
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <input
      type="radio"
      value={option}
      style={{
        marginRight: "12px",
        cursor: "pointer",
      }}
      onChange={() => {
        const newOptions = [...selectedOptions];
        newOptions[showData.indexOf(items)] = option.toString();
        setSelectedOptions(newOptions);
      }}
    />
   <p
  style={{
    cursor: "pointer",
  
    textAlign: "center",
    margin: "0 auto",  // Add margin for spacing between input and text
  }}
>
  {option}
</p>
  </div>
</label>

              </div>
            ))}
          </div>
        </div>
      );
    })}
</>
{currentOptions < showData?.length && (
            <div className="flex space-x-2 justify-end pt-4">
              <button
                onClick={handlePrev}
                className="text-[#AEAEB2] border border-[#AEAEB2]  rounded h-8 w-[80px]"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="text-white bg-primary rounded h-8 w-[80px]"
              >
                Next
              </button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}