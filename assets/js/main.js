/* =========================================================
   MAIN UI — products, projects, modal, reveal, contact form
   ========================================================= */

(() => {

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =========================================================
     PRODUCTS
     ========================================================= */

  const productGrid = $('#productGrid');

  const renderProducts = (filter = 'all') => {

    if (!productGrid) return;

    const list = products.filter(
      p => filter === 'all' || p.cat === filter
    );

    productGrid.innerHTML = list.map(p => `
      <article class="product reveal visible">

        <div class="product-img">

          <img
            src="${p.img}"
            alt="${p.name}"
            loading="lazy">

        </div>

        <div class="product-body">

          <span class="tag">
            ${p.tag}
          </span>

          <h3>
            ${p.name}
          </h3>

          <p>
            ${p.desc}
          </p>

          <button
            class="product-detail-btn"
            data-index="${products.indexOf(p)}">

            View full details →

          </button>

        </div>

      </article>
    `).join('');


    $$('.product-detail-btn', productGrid)
      .forEach(button => {

        button.addEventListener('click', () => {

          openProductModal(
            products[
              Number(button.dataset.index)
            ]
          );

        });

      });

  };


  renderProducts();


  $$('.filter').forEach(button => {

    button.addEventListener('click', () => {

      $$('.filter').forEach(x =>
        x.classList.remove('active')
      );

      button.classList.add('active');

      renderProducts(
        button.dataset.filter
      );

    });

  });



  /* =========================================================
     PRODUCT MODAL
     ========================================================= */

  const modal = $('#modal');


  const openProductModal = product => {

    if (!modal || !product) return;


    const modalImg = $('#modalImg');
    const modalTag = $('#modalTag');
    const modalTitle = $('#modalTitle');
    const modalDesc = $('#modalDesc');
    const modalSpecs = $('#modalSpecs');


    if (modalImg) {

      modalImg.src = product.img;
      modalImg.alt = product.name;

    }


    if (modalTag) {

      modalTag.textContent =
        product.tag || '';

    }


    if (modalTitle) {

      modalTitle.textContent =
        product.name || '';

    }


    if (modalDesc) {

      modalDesc.textContent =
        product.desc || '';

    }


    if (modalSpecs) {

      modalSpecs.innerHTML =
        (product.specs || [])
          .map(spec => `
            <div class="spec">
              <b>${spec[0]}</b>
              ${spec[1]}
            </div>
          `)
          .join('');

    }


    modal.classList.add('show');

    document.body.style.overflow =
      'hidden';

  };


  const closeModal = () => {

    if (!modal) return;

    modal.classList.remove('show');

    document.body.style.overflow =
      '';

  };


  $('#modalClose')?.addEventListener(
    'click',
    closeModal
  );


  modal?.addEventListener(
    'click',
    event => {

      if (event.target === modal) {

        closeModal();

      }

    }
  );


  document.addEventListener(
    'keydown',
    event => {

      if (event.key === 'Escape') {

        closeModal();

      }

    }
  );



  /* =========================================================
     PROJECT REFERENCES
     ========================================================= */

  const projectGrid =
    $('#projectGrid');

  const projectSearch =
    $('#projectSearch');

  const projectFilters =
    $$('.project-filter');

  const projectCount =
    $('#projectCount');

  let activeProjectFilter =
    'all';


  const renderProjects = () => {

    if (!projectGrid) return;


    const keyword =
      (projectSearch?.value || '')
        .trim()
        .toLowerCase();


    const list =
      projects.filter(project => {

        const matchesFilter =
          activeProjectFilter === 'all' ||
          project.category === activeProjectFilter;


        const haystack =
          `${project.name} ${project.sector}`
            .toLowerCase();


        return (
          matchesFilter &&
          haystack.includes(keyword)
        );

      });


    projectGrid.innerHTML =
      list.map(project => `

        <article
          class="project-card reveal visible">

          <div class="project-thumb">

            <img
              src="${project.image}"
              alt="${project.name}"
              loading="lazy">

            <span>
              ${
                project.category === 'hospital'
                  ? 'Hospital'
                  : project.category === 'industrial'
                    ? 'Industrial Estate'
                    : 'Retail • Commercial • Hotel'
              }
            </span>

          </div>


          <div class="project-card-body">

            <small>
              ${project.sector}
            </small>

            <h3>
              ${project.name}
            </h3>

            <div class="project-line"></div>

          </div>

        </article>

      `).join('');


    if (projectCount) {

      projectCount.textContent =
        `${list.length} project${list.length !== 1 ? 's' : ''} displayed`;

    }


    if (!list.length) {

      projectGrid.innerHTML = `
        <div class="project-empty">
          No projects found.
          Try another keyword or category.
        </div>
      `;

    }

  };


  projectFilters.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        projectFilters.forEach(x =>
          x.classList.remove('active')
        );

        button.classList.add('active');

        activeProjectFilter =
          button.dataset.projectFilter;

        renderProjects();

      }
    );

  });


  projectSearch?.addEventListener(
    'input',
    renderProjects
  );


  renderProjects();



  /* =========================================================
     REVEAL ANIMATION
     ========================================================= */

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'visible'
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  $$('.reveal').forEach(el =>
    observer.observe(el)
  );



  /* =========================================================
     BACK TO TOP
     ========================================================= */

  const backtop =
    $('#backtop');


  window.addEventListener(
    'scroll',
    () => {

      backtop?.classList.toggle(
        'show',
        window.scrollY > 500
      );

    },
    {
      passive: true
    }
  );


  backtop?.addEventListener(
    'click',
    () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }
  );



  /* =========================================================
     YEAR
     ========================================================= */

  const year =
    $('#year');


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }



  /* =========================================================
     CONTACT FORM — WEB3FORMS
     ========================================================= */

  const contactForm =
    $('#contactForm');


  if (contactForm) {

    contactForm.addEventListener(
      'submit',
      async event => {

        /*
         * Mencegah browser membuka mail client
         * atau reload halaman.
         */
        event.preventDefault();


        const submitButton =
          contactForm.querySelector(
            'button[type="submit"]'
          );


        const toast =
          $('#toast');


        const originalButtonText =
          submitButton
            ? submitButton.innerHTML
            : 'Send Inquiry →';



        /* ==========================================
           TOMBOL LOADING
           ========================================== */

        if (submitButton) {

          submitButton.disabled =
            true;

          submitButton.innerHTML =
            'Sending...';

        }



        try {

          /*
           * Ambil seluruh data form
           */
          const formData =
            new FormData(contactForm);


          /*
           * Ubah FormData menjadi object
           */
          const data =
            Object.fromEntries(
              formData.entries()
            );


          /*
           * Kirim ke Web3Forms
           */
          const response =
            await fetch(
              'https://api.web3forms.com/submit',
              {

                method: 'POST',

                headers: {

                  'Content-Type':
                    'application/json',

                  'Accept':
                    'application/json'

                },

                body:
                  JSON.stringify(data)

              }
            );


          /*
           * Ambil response dari Web3Forms
           */
          const result =
            await response.json();


          /*
           * Tampilkan response di
           * browser console untuk debugging.
           */
          console.log(
            'Web3Forms response:',
            result
          );



          /* ==========================================
             BERHASIL
             ========================================== */

          if (
            response.ok &&
            result.success
          ) {


            /*
             * Kosongkan semua input form
             */
            contactForm.reset();


            /*
             * Ubah tombol
             */
            if (submitButton) {

              submitButton.innerHTML =
                'Message Sent ✓';

            }


            /*
             * Tampilkan notifikasi
             */
            if (toast) {

              toast.textContent =
                'Your inquiry has been sent successfully.';

              toast.style.display =
                'block';


              setTimeout(() => {

                toast.style.display =
                  'none';

              }, 5000);

            }


            /*
             * Kembalikan tombol
             * setelah beberapa detik.
             */
            setTimeout(() => {

              if (submitButton) {

                submitButton.disabled =
                  false;

                submitButton.innerHTML =
                  originalButtonText;

              }

            }, 3000);

          }



          /* ==========================================
             GAGAL
             ========================================== */

          else {

            throw new Error(
              result.message ||
              'Failed to send message.'
            );

          }


        }



        /* ==========================================
           ERROR / INTERNET / API
           ========================================== */

        catch (error) {

          console.error(
            'Contact form error:',
            error
          );


          /*
           * Kembalikan tombol
           */
          if (submitButton) {

            submitButton.disabled =
              false;

            submitButton.innerHTML =
              originalButtonText;

          }


          /*
           * Tampilkan pesan error
           */
          if (toast) {

            toast.textContent =
              'Failed to send message. Please try again.';

            toast.style.display =
              'block';


            setTimeout(() => {

              toast.style.display =
                'none';

            }, 5000);

          }

        }

      }
    );

  }

})();