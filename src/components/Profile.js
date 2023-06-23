import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Profile({user}) {

  const [userdata, setUserData] = useState([]);
  let address = user.address;
  // let token = user.token;

  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      axios.post('http://localhost:8626/api/user/profile', {
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
        walletAddress: address,
      }).then(function(response) {
        setUserData(response.data.user);
      }).catch(function(error) {
        console.log(error);
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <section>
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-4">
            <div class="card mb-4">
              <div class="card-body text-center">
                <img src={ userdata.profile } alt="avatar"
                  class="rounded-circle img-fluid"
                  style={{borderRadius: '50%',
                    width: 200,
                    height: 200,
                  }} />
                <h5 class="my-3">{ userdata.username }</h5>
                <p class="text-muted mb-1">Full Stack Developer</p>
                <p class="text-muted mb-4">Bay Area, San Francisco, CA</p>
              </div>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-body">
                <div class="row py-2">
                  <div>
                  <button
                    class="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => navigate("/update")}
                    >Update</button>
                  </div>
                </div>
                <div class="row py-2">
                  <div class="col-sm-3">
                    <p class="mb-0">Full Name</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{ userdata.username }</p>
                  </div>
                </div>
                <div class="row py-2">
                  <div class="col-sm-3">
                    <p class="mb-0">Birthday</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{ userdata.birthday }</p>
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
                <div class="row py-2">
                  <div class="col-sm-3">
                    <p class="mb-0">Address</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">
                      <a href={`https://testnet.bscscan.com/address/${address}`}
                       style={{ textDecoration: 'none'}}
                       target="_blank"
                       rel="noreferrer"
                      >
                        { address }
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}