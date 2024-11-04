function initSpeakersSlider() {
	new Swiper('.speakers__slider', {
		spaceBetween: 24,
		grabCursor: true,
		a11y: false,
		speed: 1000,
		slidesPerView: 1,
		navigation: {
			nextEl: '.speakers__nav-next',
			prevEl: '.speakers__nav-prev',
		},
		pagination: {
			el: '.speakers__nav-pagination',
		},
		breakpoints: {
			480: {
				slidesPerView: 1,
			},
			768: {
				slidesPerView: 1,
			},
			1024: {
				slidesPerView: 'auto',
				spaceBetween: 10,
			},
			1440: {
				spaceBetween: 170,
				slidesPerView: 'auto',
			},
		},
		on: {
			init: function () {
				const lastSlide = this.slides[this.slides.length - 1]
				const cloneLastSlide = lastSlide.cloneNode(true)
				cloneLastSlide.classList.add('speakers-hidden')
				this.wrapperEl.append(cloneLastSlide)
			},
			slideChange: function () {
				console.log(this.activeIndex, this.slides.length)
				console.log(this)
				if (this.activeIndex === this.slides.length - 2) {
					this.allowSlideNext = false
					return
				} else {
					this.allowSlideNext = true
				}
			},
		},
	})
}

function initConferenceTicker() {
	new Swiper('.conference__ticker', {
		spaceBetween: 12,
		centeredSlides: true,
		speed: 3000,
		autoplay: {
			delay: 1,
		},
		loop: true,
		slidesPerView: 'auto',
		allowTouchMove: false,
		disableOnInteraction: true,
		breakpoints: {
			480: {
				spaceBetween: 16,
			},
			768: {
				spaceBetween: 20,
			},
			1440: {
				spaceBetween: 40,
			},
		},
	})
}

function initOrganizersMobileSlider() {
	new Swiper('.organizers__wrapper', {
		spaceBetween: 24,
		grabCursor: true,
		a11y: false,
		speed: 1000,
		slidesPerView: 1,
		slideClass: 'organizers__item',
		navigation: {
			nextEl: '.organizers__nav-next',
			prevEl: '.organizers__nav-prev',
		},
		pagination: {
			el: '.organizers__nav-pagination',
		},
	})
}

function initSliders() {
	initSpeakersSlider()
	initConferenceTicker()
	if (window.matchMedia('(max-width: 767px)').matches) {
		initOrganizersMobileSlider()
	}
}

function initOrganizersHover() {
	const organizers = document.querySelectorAll('.organizers__item')
	if (!organizers.length) {
		return
	}
	const removeAllActiveClass = () => {
		organizers.forEach(item => {
			item.classList.remove('active')
		})
	}
	const setActiveClass = e => {
		const item = e.target.closest('.organizers__item')
		removeAllActiveClass()
		item.classList.add('active')
	}

	organizers.forEach(item => {
		item.addEventListener('mouseenter', setActiveClass)
		item.addEventListener('click', setActiveClass)
	})
}

function initOrganizersNav() {
	const prevBtn = document.querySelector('.organizers__nav-prev')
	const nextBtn = document.querySelector('.organizers__nav-next')
	if (!prevBtn || !nextBtn) {
		return
	}
	const firstItem = document.querySelector('.organizers__item:first-child')
	const lastItem = document.querySelector('.organizers__item:last-child')

	const setPrevOrganizer = e => {
		console.log(e.target)
		nextBtn.classList.remove('active')
		prevBtn.classList.add('active')

		lastItem.classList.remove('active')
		firstItem.classList.add('active')
	}
	const setNextOrganizer = e => {
		prevBtn.classList.remove('active')
		nextBtn.classList.add('active')

		firstItem.classList.remove('active')
		lastItem.classList.add('active')
	}

	prevBtn.addEventListener('click', setPrevOrganizer)
	nextBtn.addEventListener('click', setNextOrganizer)
}

function initOrganizersExpand() {
	if (window.matchMedia('(min-width: 768px)').matches) {
		console.log('(min-width: 768px)')
		initOrganizersNav()
		initOrganizersHover()
	}
}

function init() {
	initSliders()
	initOrganizersExpand()
}

document.addEventListener('DOMContentLoaded', init)
