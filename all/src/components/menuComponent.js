// need to add snackbars..

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useState} from 'react';
import axios from 'axios';

import '../css_styles/menuComponent.css';

export default function FormDialog({sendDataToParent, dataFromParent}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  var image;
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTitle('')
        setPrice('')
        setDescription('')
        setInput('')
        setPreview('')
    };

    const titleChange = (e)=>{
      setTitle(e.target.value);
    }

    const descriptionChange = (e)=>{
        setDescription(e.target.value);
    }

    const priceChange = (e)=>{
        setPrice(e.target.value);
    }

    const inputChange = (e)=>{
        const file = e.target.files[0];
        previewImage(file);
        setInput(e.target.value)
    }

    function previewImage(file){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend =()=>{
            setPreview(reader.result)
        }
        reader.onerror = (err)=>{
            alert(err)
        }
    }

    async function uploadImage(base64EncodedImage){ //for uploading images to cloudinary
        try {
              await axios({
                method: 'post',
                url: 'http://localhost:5000/api/upload/',
                data: {
                  fileStr : base64EncodedImage,
                  id: `${dataFromParent}/menus`
                },
                headers : {'content-Type': 'application/json'},
            })
                .then(res =>{
                  console.log("From menu photo", res)
                  image = res.data.public_id + '';
                  console.log(image)
                })
            setInput('')
            setPreview('')
            console.log("Uploaded successfully")
        } catch (err) {
            alert(err)
        }
    }

    const onSubmit = async ()=>{
        await uploadImage(preview)
        const menu = {
            title: title,
            price: price,
            description: description,
            image: image
        }
        sendDataToParent(menu);
        handleClose();
    }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Menu
      </Button>
      <Dialog open={open} onClose={handleClose}  maxWidth="md" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Menu</DialogTitle>
        <DialogContent>
          <div className="dialog">
          <form >
              <div className="form-input">
                <div className="formControlMenu">
                  <label>Title</label>
                  <input
                    type="text"
                    value={title}
                    placeholder="Title of max-length 20"
                    maxLength="20"
                    onChange={titleChange}
                  />
                </div>
                <div className="formControlMenu">
                  <label>Price</label>
                  <input
                    type="number" 
                    value={price} 
                    
                    onChange={priceChange} 
                  />
                </div>
                <div className="formControlMenu">
                  <label>Description</label>
                  <textarea
                    type="text" 
                    placeholder="Describe the dish..."
                    value={description} 
                    onChange={descriptionChange} 
                  />
                </div>
              </div>
              
          </form>
          <div className="menuPhotoSection">
                <label>Image:</label>
                
              <div className="image">
                
                {preview && (
                    <img src={preview}
                        alt='chosen'
                        style ={{height:'200px'}}
                    />
                )}
              </div>
              <input type="file" value={input} onChange={inputChange} />
          </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

