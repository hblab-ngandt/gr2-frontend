export default function Footer() {
  return (
    <footer
      class="text-center text-lg-start text-white"
    >
      <section
        class="d-flex justify-content-between p-4"
      >
        <div class="me-5">
        </div>

        <div>
          <a href="/#" class="text-white me-4">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href=".#" class="text-white me-4">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="/#" class="text-white me-4">
            <i class="fab fa-google"></i>
          </a>
          <a href="/#" class="text-white me-4">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="/#" class="text-white me-4">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="/#" class="text-white me-4">
            <i class="fab fa-github"></i>
          </a>
        </div>
      </section>

      <section class="">
      <div class="container text-center text-md-start mt-5">
        <div class="row mt-3">
          <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold">Description</h6>
            <hr
                class="mb-4 mt-0 d-inline-block mx-auto"
                />
            <p>
              Here you can use rows and columns to organize your footer
              content. Lorem ipsum dolor sit amet, consectetur adipisicing
              elit.
            </p>
          </div>

          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold">Navigation</h6>
            <hr
                class="mb-4 mt-0 d-inline-block mx-auto"
                />
            <p>
              <a href="#!" class="text-white" style={{textDecoration: 'none'}} >Home</a>
            </p>
            <p>
              <a href="#!" class="text-white" style={{textDecoration: 'none'}} >Marketplace</a>
            </p>
            <p>
              <a href="#!" class="text-white"style={{textDecoration: 'none'}} >My NFT</a>
            </p>
            <p>
              <a href="#!" class="text-white" style={{textDecoration: 'none'}} >Bootstrap Angular</a>
            </p>
          </div>

          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold">Contact</h6>
            <hr
                class="mb-4 mt-0 d-inline-block mx-auto"
                />
            <p>
              <i class="fa-brands fa-facebook"></i>
              <a href="https://www.facebook.com/nganadudu" 
                class="text-white"
                style={{textDecoration: 'none'}}
                target="_blank"
                rel="noreferrer"
              >Đinh Ngân</a>
            </p>
            <p>
              
              <a href="#!" class="text-white">Instagram</a>
            </p>
            <p>
              <a href="#!" class="text-white">Shipping Rates</a>
            </p>
            <p>
              <a href="#!" class="text-white">Help</a>
            </p>
          </div>

          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 class="text-uppercase fw-bold">.</h6>
            <hr
                class="mb-4 mt-0 d-inline-block mx-auto"
                />
            <p><i class="fas fa-home mr-3"></i> Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
            <p><i class="fas fa-envelope mr-3"></i> info@example.com</p>
            <p><i class="fas fa-phone mr-3"></i> (084)-924-8868</p>
          </div>
        </div>
      </div>
      </section>

      <div
        class="text-center p-3"
        style={{backgroundColor : 'rgba(0, 0, 0, 0.2)'}}
      >
        © 2023 Copyright 
      </div>
    </footer>
  );
}
