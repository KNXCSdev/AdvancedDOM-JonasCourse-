"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector(".nav");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((element) => {
  element.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//SECTION SMOOTH SCROLL

btnScrollTo.addEventListener("click", (e) => {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log("Cueent scroll (X/Y)", window.scrollX, window.scrollY);
  // console.log(
  //   "height withh (X/Y)",
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: "smooth",
  // });

  //MODERN WAY (BEST WAY!!!)
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////////
//SECTION PAGE PAVIGATION

// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

//1. Add event listener to common paretn element
//2. Determine what element originated the event
//NOTE TARGET IS SHOWING THE ELEMENT YOU CLICKED VERY USEFUL!
document.querySelector(".nav__links").addEventListener("click", function (e) {
  //Matching strategy
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//SECTIONS TABBED COMPONENT

tabsContainer.addEventListener("click", (e) => {
  e.preventDefault();
  const clicked = e.target.closest(".operations__tab");

  //Guard close
  if (!clicked) return;

  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((t) => t.classList.remove("operations__content--active"));

  clicked.classList.add("operations__tab--active");
  //Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//SECTION MENU FADE ANIMATION

function handleHover(e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

//INTERSECTION OBSERVER API TO NAVIGATION
function stickyNav(entires) {
  const [entry] = entires;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//SECTION INTERSECTION OBSERVER API TO SREVEAL SECTIONS

//REVEAL SECTIO
const allSections = document.querySelectorAll(".section");

function revealSection(entires, observer) {
  const [entry] = entires;
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
}

const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.15 });

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//SECTION LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entires, observer) {
  const [entry] = entires;
  console.log(entry);
  if (!entry.isIntersecting) return;

  //REPLACE SRC WITH DATA-SRC
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

//SECTION SLIDER
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

const dotContainer = document.querySelector(".dots");

//SLIDER

let curSlide = 0;
const maxSlide = slides.length;

slider.style.overflow = "visible";
slides.forEach((s, i) => {
  s.style.transform = `translateX(${100 * i}%)`;
});

function createDots() {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
}

const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
};

function goToSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
}

function nextSlide() {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
}

function prevSlide() {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
}

const init = function () {
  createDots();
  activateDot(0);
  goToSlide(0);
};
init();
//EVENT HANDLERS
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

//SECTION STICKY NAVIGATION NOT USEFULL CUZ OF PERFORMENCE ISSUES
// const initialCords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//   if (this.scrollY > initialCords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.3],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

///////////////////////////
////////////////////////////
///////////////////////////
/////////////////////////////

// console.log(document.documentElement);

// const header = document.querySelector(".header");
// const allSection = document.querySelectorAll(".section");
// console.log(allSection);

// document.getElementById("section-1");
// const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);

// const message = document.createElement("div");
// message.classList.add("cookie-message");
// message.innerHTML =
//   "We use cookies for improved functionality and analitics. <button class='btn btn--close-cookie'>Got it!</button>";

// header.prepend(message);
// header.append(message);

// // header.before(message);
// // header.after(message);

// //DELETE ELEMENTS
// document.querySelector(".btn--close-cookie").addEventListener("click", () => {
//   message.remove();
// });

// //STYLES

// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";

// const link = document.querySelector(".nav__link--btn");

// console.log(link.href);

// //Data attributes
// console.log(logo.dataset.versionNumber);

// //CLasses
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();

// const h1 = document.querySelector("h1");

// function alertH1(e) {
//   alert("eee");
// }

// h1.addEventListener("mouseenter", alertH1);

// setTimeout(() => {
//   h1.removeEventListener("mouseenter", alertH1);
// }, 3000);
// h1.onmouseenter = () => {
//   alert("UWAA");
// };

//rgb(255,255,255)
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector(".nav__link").addEventListener("click", (e) => {
//   this.style.backgroundColor = randomColor;

//   // e.stopPropagation();
// });

// document.querySelector(".nav__links").addEventListener("click", (e) => {
//   this.style.backgroundColor = randomColor;

//   // e.stopPropagation();
// });

// document.querySelector(".nav").addEventListener("click", (e) => {
//   this.style.backgroundColor = randomColor;

//   // e.stopPropagation();
// });

// const h1 = document.querySelector("h1");

// //Going downwards: child
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = "red";

// //Going upwars:parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest(".header").style.backgroundColor = "var(--color-primary)";

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) {
//     el.style.transform = "scale(0.5)";
//   }
// });
