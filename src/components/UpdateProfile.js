import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { imageListClasses } from "@mui/material";

export default function UpdateProfile({user}) {

  let address = user.address;
  let profile = user.profile;
  let birthday = user.birthday;
  let name = user.name;
  let phone = user.phone;
  let about = user.about;
  let addressUser = user.addressUser;
  const [demo, setDemo] = useState({ preview: "", raw: "" });
  const navigate = useNavigate();

  const date = new Date();
  const currentDate = date.getDate();
  date.setDate(currentDate);
  const defaultValue = date.toLocaleDateString('en-CA');
  const defaultAbout = 'Tell somthing about you';

  const token = localStorage.getItem('token');
  console.log(token);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setDemo({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const updateProfile = async (e) =>{
    e.preventDefault();
    const dataForm = new FormData();
    dataForm.append('walletAddress', address);
    dataForm.append('username', e.target.fullname.value);
    dataForm.append('birthday', e.target.birthday.value);
    dataForm.append('about', e.target.about.value);
    dataForm.append('phone', e.target.phone.value);
    dataForm.append('address', e.target.address.value);
    dataForm.append('images', demo.raw ? demo.raw : null);

    console.log(demo.raw);
    try {
      const response = await axios.post(
        "http://localhost:8626/api/user/update",
        dataForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Update profile successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000 // 5 seconds
      });

      setTimeout(() => {
        navigate("/profile");
      }, 5000);

      console.log(response.data);

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Please try again later', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000 // 5 seconds
      });
    }
  }

  return (
    <>
    <section>
      <form onSubmit={updateProfile}>
        <div class="container py-5">
          <div class="row">
            <div class="col-lg-4">
              <div class="card mb-4">
                <div class="card-body text-center">
                  <label htmlFor="upload-button">
                    {demo.preview ? (
                      <img src={demo.preview} alt="img-upload" className="card-img-top" />
                    ) : (
                      <img src={profile} alt="img-not-availabel" className="card-img-top" />
                    )}
                  </label>
                  <div className="form-group">
                    <input
                      className="rounded-circle img-fluid"
                      type="file"
                      multiple
                      hidden
                      accept="image/*"
                      id="upload-button"
                      onChange={handleChange}
                    />
                  </div>
                  <div class="my-3 form-group"></div>
                  <textarea class="form-control" id="about" rows="4" name="about" defaultValue={about ? about : defaultAbout}></textarea>
                </div>
              </div>
            </div>

            <div class="col-lg-8">
              <div class="card mb-4">
                <div class="card-body">
                  <div class="row py-2">
                    <div>
                      <button onClick={() => navigate("/profile")} class="btn btn-danger" style={{ float: 'right' }}>Cancel</button>
                    </div>
                  </div>
                  <div class="row py-2">
                    <div class="col-sm-3 text-right">
                      <p class="mb-0">Full Name</p>
                    </div>
                    <div class="col-sm-6 update-profile-parent">
                      <input type="text" class="form-control" id="profile-fullname" name="fullname" placeholder={name}/>
                    </div>
                  </div>
                  <div class="row py-2">
                    <div class="col-sm-3">
                      <p class="mb-0">Birthday</p>
                    </div>
                    <div class="col-sm-6 update-profile-parent">
                      <input type="date" class="form-control" id="profile-birthday" name="birthday" defaultValue={birthday ? birthday : defaultValue}/>
                    </div>
                  </div>
                  <div class="row py-2">
                    <div class="col-sm-3">
                      <p class="mb-0">Mobile</p>
                    </div>
                    <div class="col-sm-9">
                    <input type="text" class="form-control" id="profile-phone" name="phone" placeholder={phone}/>
                    </div>
                  </div>
                  <div class="row py-2">
                    <div class="col-sm-3">
                      <p class="mb-0">Address</p>
                    </div>
                    <div class="col-sm-9">
                    <input type="text" class="form-control" id="profile-address" name="address" placeholder={addressUser}/>
                    </div>
                  </div>
                  
                  <div class="row py-4">
                    <div className="col-sm"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <button className="btn btn-primary" type="submit">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
    </>
  );
} 