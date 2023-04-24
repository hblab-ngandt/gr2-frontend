export default function Profile({user}) {

  let profile = user.profile;
  let name = user.name;
  let birthday = user.birthday;
  let address = user.address;

  return (
    <>
    <section>
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-4">
            <div class="card mb-4">
              <div class="card-body text-center">
                <img src={ profile } alt="avatar"
                  class="rounded-circle img-fluid"
                  style={{borderRadius: '50%',
                    width: 200,
                    height: 200,
                  }} />
                <h5 class="my-3">{ name }</h5>
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
                  <button type="button" class="btn btn-primary" style={{ float: 'right' }}>Update</button>
                  </div>
                </div>
                <div class="row py-2">
                  <div class="col-sm-3">
                    <p class="mb-0">Full Name</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{ name }</p>
                  </div>
                </div>
                <div class="row py-2">
                  <div class="col-sm-3">
                    <p class="mb-0">Birthday</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{ birthday }</p>
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