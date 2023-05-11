import { React, useState } from "react";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import { authorization, baseImage } from "../settings/Constant";
import axios from 'axios';

export default function UpdateProfile({user}) {

  let address = user.address;
  let profile = user.profile;
  let name = user.name;
  const [images, setImages] = useState([]);
  const [demo, setDemo] = useState({ preview: "", raw: "" });
  const navigate = useNavigate();

  const date = new Date();
  const currentDate = date.getDate();
  date.setDate(currentDate);
  const defaultValue = date.toLocaleDateString('en-CA');

  const token = localStorage.getItem('token');
  console.log(token);

  const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });

  const handleChange = (e) => {
    if (e.target.files.length) {
      setDemo({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const updateProfile = async (e) =>{
    try {
      e.preventDefault();
      const form = e.target;
      const files = form[0].files;
      let url = '';
      if (files) {
        const file = files[0];
        // upload files
        const result = await ipfs.add(file);
        setImages([
          ...images,
          {
            cid: result.cid,
            path: result.path
          }
        ]);
        url = baseImage + result.path;
      }
      // call update profile api
      axios.post('http://localhost:8626/api/user/update', {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        walletAddress: address,
        username: e.target.fullname.value !== null ? e.target.fullname.value : name,
        birthday: e.target.birthday.value !== null ? e.target.birthday.value : defaultValue,
        image: url !== undefined ? url : profile,
      }).then(function(response) {
        console.log(response.data);
      }).catch(function(error) {
        console.log(error);
      });
      form.reset();

      window.location.reload(true);
    } catch (err) {
      console.log(err);
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
                      <input type="date" class="form-control" id="profile-birthday" name="birthday" defaultValue={defaultValue}/>
                    </div>
                  </div>
                  <div class="row py-2">
                    <div class="col-sm-3">
                      <p class="mb-0">Mobile</p>
                    </div>
                    <div class="col-sm-9">
                      <p class="text-muted mb-0">(098) 765-4321</p>
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