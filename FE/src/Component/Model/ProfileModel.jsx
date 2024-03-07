import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useQuery } from 'react-query'
import {useAxios} from '../../Api/http.service'
import { useEffect } from 'react';
import { putApi } from '../../Api/axiosService';
import { useSelector,useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { useQueryClient } from 'react-query';
import { setProfile } from '../../store/reducers/auth';
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

export default function ProfileModel({allprofile}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fileName, setFileName] = React.useState('')
  const [file, setFile] = React.useState()
  const [profileLink,setProfileLink]=React.useState("")
  const {  put} = useAxios()
  const queryClient = useQueryClient()
  const {userData,token}=useSelector(state=>state.authReducer)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch=useDispatch()
  const updateProfile = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      if (file) {
        formData.append('profile', '');
      } else {
        formData.append('profile', profileLink);
      }
  
      const result = await putApi(`/profile/${userData?._id}`, formData);
  
     
    if(result)
    {
        setIsLoading(false)
        dispatch(setProfile({profile:result.updatedDocument.profile}))
        queryClient.invalidateQueries('single')
        
        handleClose()
    }
      // Close the modal only if the API call is successful
    //   handleClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle errors if necessary
    }
  };
  

  return (
    <div>
      <Button  style={{width:"100%" ,backgroundColor:"#5838fc",color:"white",border:"none",marginBottom:"20px",paddingBlock:"5px",cursor:"pointer" ,}} onClick={handleOpen}>Edit Profile</Button>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <>
        <h4 style={{display:"flex",justifyContent:"center",fontWeight:"bolder"}}>Change Profile</h4>
        <label htmlFor="image" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
  <input
    type="file"
    id="image"
    name="image"
    // accept="video/*"
    onChange={(e) => {
      setFile(e.target.files[0]);
      setFileName(e.target?.files[0]?.name);
    }}
    style={{ display: "none" }}
  />
  <img
    src="assets/images/plus.png"
    alt=""
    width={40}
    height={40}
  />
  <p style={{ marginLeft: "2px", fontSize: "0.875rem", fontWeight: "bold",paddingTop:"10px" }}>
    {fileName ? fileName : 'Add File'}
  </p>
</label>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px" }}>
        {allprofile?.map((data, index) => {
  return (
    <div onClick={()=>setProfileLink(data.profile)} key={index} style={{ display: "flex", flexDirection: "row" }}>
      <img
  src={data.profile}
  alt={`Profile ${index}`}
  style={{ width: "80px", border: profileLink === data.profile ? "2px solid #5838fc" : "none" }}
/>
    </div>
    
  );
})}
</div>
        <div  onClick={() => {
    updateProfile();
    
  }}  style={{backgroundColor:"#5838fc",color:"white",border:"none",marginTop:"20px",paddingBlock:"5px",cursor:"pointer" ,display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}} >  {isLoading ? <CircularProgress  size={18} color="inherit" /> : "Update Profile"} </div>
   </>
        </Box>
      </Modal>
    </div>
  );
}