document.addEventListener("DOMContentLoaded", async () => {
  const burger = document.querySelector(".burger-icon");
  const navBurger = document.querySelector(".header__nav-burger");
  const links = document.querySelectorAll(".header__link-burger");
  const body = document.body;

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navBurger.classList.toggle("active");
    body.classList.toggle("locked");
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      navBurger.classList.remove("active");
      body.classList.remove("locked");
    });
  });
  const scrollToTopButton = document.getElementById("scrollToTop");
  const toggleScrollButton = () => {
    const scrollPosition = window.scrollY;
    const isSmallScreen = window.innerWidth <= 768;

    if (isSmallScreen && scrollPosition > 300) {
      scrollToTopButton.classList.add("show");
    } else {
      scrollToTopButton.classList.remove("show");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", toggleScrollButton);
  scrollToTopButton.addEventListener("click", scrollToTop);
  toggleScrollButton();

  const giftsList = document.querySelector(".gifts__list");
  const navLinks = document.querySelectorAll(".nav__link");
  const jsonUrl = "gifts.json";
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const modalImage = document.getElementById("modalImage");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");

  let gifts = [];
  let displayedGifts = [];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function displayGifts(giftsToDisplay) {
    giftsList.innerHTML = "";
    displayedGifts = giftsToDisplay;

    giftsToDisplay.forEach((gift, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("gifts__item");
      listItem.setAttribute("data-index", index);

      listItem.innerHTML = `
        <a class="gifts__link" href="#">
          <div class="gifts__img">
            <img src="img/gift-${gift.category
              .toLowerCase()
              .replace(" ", "-")}.png" alt="${gift.name}">
          </div>
          <div class="gifts__card"> 
            <h4 class="gifts__card-subtitle ${gift.category
              .toLowerCase()
              .replace(" ", "-")}">${gift.category}</h4>
            <h3 class="gifts__card-title">${gift.name}</h3>
          </div>
        </a>
      `;
      giftsList.appendChild(listItem);
    });
  }

  try {
    const response = await fetch(jsonUrl);
    gifts = await response.json();

    displayGifts(shuffleArray([...gifts]));

    navLinks.forEach((navLink) => {
      navLink.addEventListener("click", (event) => {
        event.preventDefault();

        navLinks.forEach((link) =>
          link.parentElement.classList.remove("nav__item--active")
        );
        navLink.parentElement.classList.add("nav__item--active");

        const category = navLink.textContent.trim().toLowerCase();

        if (category === "all") {
          displayGifts(shuffleArray([...gifts]));
        } else {
          const filteredGifts = gifts.filter(
            (gift) => gift.category.toLowerCase() === category
          );
          displayGifts(filteredGifts);
        }
      });
    });

    giftsList.addEventListener("click", (event) => {
      event.preventDefault();
      const card = event.target.closest(".gifts__item");
      if (card) {
        const giftIndex = parseInt(card.getAttribute("data-index"), 10);
        const selectedGift = displayedGifts[giftIndex];
        if (selectedGift) {
          openModal(selectedGift);
        }
      }
    });

    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) closeModal();
    });

    function setSuperpower(type, value) {
      const powerElement = document.getElementById(`superpower${type}`);
      const snowflakesContainer = document.getElementById(`snowflakes${type}`);
      powerElement.textContent = value;
      snowflakesContainer.innerHTML = "";
      const activeCount = Math.min(Math.floor(value / 100), 5);

      for (let i = 0; i < 5; i++) {
        const snowflake = document.createElement("span");
        snowflake.innerHTML = `
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.1959 9.88162L10.6482 9.56542L12.1158 9.17219L11.8732 8.26704L9.50055 8.90278L8.38146 8.25667C8.39689 8.17336 8.40538 8.08765 8.40538 7.99997C8.40538 7.91229 8.39692 7.82655 8.38146 7.74327L9.50055 7.09716L11.8732 7.7329L12.1158 6.82775L10.6482 6.43452L11.1959 6.11831L13.546 5.97725L13.8921 4.02063L12.0246 3.34203L10.7274 5.30677L10.1797 5.62297L10.5729 4.15545L9.66778 3.91293L9.03204 6.28561L7.91226 6.93211C7.78247 6.82103 7.63242 6.73313 7.4683 6.67494V5.3828L9.20521 3.64586L8.5426 2.98325L7.46827 4.05755V3.42515L8.51792 1.32584L6.99976 0L5.48157 1.3259L6.53122 3.42521V4.05761L5.45689 2.98332L4.79429 3.64592L6.53119 5.38286V6.675C6.36708 6.73319 6.21702 6.82109 6.08724 6.93217L4.96746 6.28568L4.33171 3.91299L3.42656 4.15551L3.81979 5.62304L3.27213 5.30684L1.9749 3.34209L0.107422 4.02069L0.453485 5.97731L2.80362 6.11838L3.35128 6.43458L1.88375 6.82781L2.1263 7.73296L4.49898 7.09722L5.61807 7.74333C5.60264 7.82664 5.59414 7.91235 5.59414 8.00003C5.59414 8.08771 5.60261 8.17345 5.61807 8.25673L4.49898 8.90285L2.1263 8.2671L1.88375 9.17226L3.35128 9.56548L2.80362 9.88169L0.453485 10.0227L0.107422 11.9793L1.97493 12.6579L3.27216 10.6932L3.81985 10.377L3.42662 11.8445L4.33177 12.087L4.96752 9.71435L6.0873 9.06786C6.21708 9.17894 6.36714 9.26684 6.53125 9.32503V10.6172L4.79435 12.3541L5.45696 13.0167L6.53129 11.9424V12.5748L5.48163 14.6741L6.99983 16L8.51802 14.6741L7.46837 12.5748V11.9424L8.5427 13.0167L9.2053 12.3541L7.4684 10.6172V9.32503C7.63251 9.26684 7.78257 9.17894 7.91235 9.06786L9.03213 9.71435L9.66788 12.087L10.573 11.8445L10.1798 10.377L10.7275 10.6932L12.0247 12.6579L13.8922 11.9793L13.5462 10.0227L11.1959 9.88162Z" fill="#FF4646"/>
          </svg>
        `;
        snowflake.style.opacity = i < activeCount ? "1" : "0.3";
        snowflakesContainer.appendChild(snowflake);
      }
    }

    function openModal(gift) {
      modalImage.src = `img/gift-${gift.category
        .toLowerCase()
        .replace(" ", "-")}.png`;
      modalCategory.textContent = gift.category;
      modalCategory.className = "modal__category";
      const categoryClass = `${gift.category.toLowerCase().replace(" ", "-")}`;
      modalCategory.classList.add(categoryClass);
      modalTitle.textContent = gift.name;
      modalDescription.textContent = gift.description;

      setSuperpower("Live", gift.superpowers.live);
      setSuperpower("Create", gift.superpowers.create);
      setSuperpower("Love", gift.superpowers.love);
      setSuperpower("Dream", gift.superpowers.dream);

      modalOverlay.classList.add("show");
      document.body.classList.add("no-scroll");
    }

    function closeModal() {
      modalOverlay.classList.remove("show");
      document.body.classList.remove("no-scroll");
    }
  } catch (error) {
    console.error("Ошибка загрузки JSON:", error);
    giftsList.innerHTML = "<p>Не удалось загрузить подарки.</p>";
  }
});
