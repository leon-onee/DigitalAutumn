class CustomSelect {
	constructor(selectElement) {
		this.selectElement = selectElement
		this.selectOptions = selectElement.children
		this.init()
	}

	init() {
		this.hideOriginalSelect()
		this.createSelectWrapper()
		this.createStyledSelect()
		this.populateOptions()
		this.setupListeners()
	}

	hideOriginalSelect() {
		this.selectElement.classList.add('select-hidden')
	}

	createSelectWrapper() {
		this.selectWrapper = document.createElement('div')
		this.selectWrapper.classList.add('select')
		this.selectElement.parentNode.insertBefore(
			this.selectWrapper,
			this.selectElement
		)
		this.selectWrapper.appendChild(this.selectElement)
	}

	createStyledSelect() {
		this.selectStyled = document.createElement('div')
		this.selectStyled.classList.add('select-styled')
		this.selectWrapper.appendChild(this.selectStyled)

		this.selectTitle = document.createElement('span')
		this.selectTitle.classList.add('select-styled__title')
		this.selectTitle.textContent =
			this.selectElement.getAttribute('data-title') ||
			this.selectOptions[0].textContent
		this.selectStyled.appendChild(this.selectTitle)
	}

	populateOptions() {
		this.optionsList = document.createElement('ul')
		this.optionsList.classList.add('select-options')
		this.selectStyled.parentNode.insertBefore(
			this.optionsList,
			this.selectStyled.nextSibling
		)

		const options = this.selectOptions
		for (let i = 0; i < options.length; i++) {
			const option = options[i]
			const listItem = document.createElement('li')
			listItem.textContent = option.textContent
			listItem.setAttribute('rel', option.value)
			this.optionsList.appendChild(listItem)
		}
		this.listItems = this.optionsList.children
	}

	setupListeners() {
		this.selectStyled.addEventListener('click', e => this.toggleOptions(e))
		Array.from(this.listItems).forEach(item =>
			item.addEventListener('click', e => this.selectOption(e))
		)
		document.addEventListener('click', () => this.closeOptions())
	}

	toggleOptions(event) {
		event.stopPropagation()
		document.querySelectorAll('.select-styled.active').forEach(item => {
			if (item !== this.selectStyled) {
				item.classList.remove('active')
				item.nextElementSibling.classList.remove('open')
			}
		})
		this.selectStyled.classList.toggle('active')
		this.optionsList.classList.toggle('open')
	}

	selectOption(event) {
		event.stopPropagation()
		const selectedItem = event.currentTarget
		this.selectTitle.textContent = selectedItem.textContent
		this.selectTitle.classList.remove('active')
		this.selectElement.value = selectedItem.getAttribute('rel')
		this.optionsList.classList.remove('open')
		this.selectStyled.classList.remove('active')
		Array.from(this.listItems).forEach(li => li.classList.remove('active'))
		selectedItem.classList.add('active')

		if (!this.selectWrapper.classList.contains('selected')) {
			this.selectWrapper.classList.add('selected')
		}
		const invalidParent = this.selectElement.closest('.invalid')
		if (invalidParent) {
			invalidParent.classList.remove('invalid')
		}

		const eventChange = new Event('change')
		this.selectElement.dispatchEvent(eventChange)
	}

	closeOptions() {
		this.selectStyled.classList.remove('active')
		this.optionsList.classList.remove('open')
	}
}

class Overlay {
	constructor() {
		this.body = document.body
		this.noScroll = document.querySelector('body')
		this.overlay = document.createElement('div')
	}

	add() {
		this.body.classList.add('no-scroll')
		this.body.append(this.overlay)
		this.overlay.classList.add('overlay')
	}
	remove() {
		this.body.classList.remove('no-scroll')
		this.overlay.classList.remove('overlay')
		this.overlay.remove()
	}
}

class HeaderMenu {
	constructor() {
		this.overlay = new Overlay()
		this.noScrollBody = document.body
		this.header = document.querySelector('.header')
		this.btn = document.querySelector('.header__burger')
		this.menu = document.querySelector('.header__menu')

		this.setupEventListeners()
	}

	setupEventListeners() {
		this.btn.addEventListener('click', this.toggle.bind(this))
	}

	toggle() {
		if (this.header.classList.contains('header__menu--open')) {
			this.close()
		} else {
			this.open()
		}
	}

	open() {
		this.header.classList.add('header__menu--open')
		this.btn.classList.add('active')
		this.noScrollBody.classList.add('no-scroll')
		this.overlay.add()
	}

	close() {
		this.header.classList.remove('header__menu--open')
		this.btn.classList.remove('active')
		this.noScrollBody.classList.remove('no-scroll')
		this.overlay.remove()
	}
}

class Modal {
	constructor(modal, openBtn = null) {
		this.overlay = new Overlay()
		this.modal = document.querySelector(modal)
		this.openBtn = openBtn
		this.closeBtn = '.modal__close'
		this.onOpen = null
		this.onClose = null
		this.onSubmit = null

		this.addCloseBtn()
		this.setupEventListeners()
	}

	setupEventListeners() {
		document.addEventListener('click', this.onClickOpen.bind(this))
		document.addEventListener('click', this.onClickClose.bind(this))
		document.addEventListener('keydown', this.handleKeyDown.bind(this))
		document.addEventListener('click', this.handleModalPopup.bind(this))
	}

	open(target) {
		console.log('target', target.dataset.type)
		this.modal.classList.add('active')
		this.overlay.add()
		if (typeof this.onOpen === 'function') {
			this.onOpen(target)
		}
		const hiddenType = this.modal.querySelector('[name="type_action"]')
		if (hiddenType) {
			// console.log(hiddenType)
			hiddenType.value = target.dataset.type
		}
	}

	close() {
		this.modal.classList.remove('active')
		this.overlay.remove()

		if (typeof this.onClose === 'function') {
			this.onClose()
		}
	}

	onClickOpen(event) {
		const target = event.target
		if (target.closest(this.openBtn)) {
			this.open(target)
		}
	}
	onClickClose(event) {
		const target = event.target
		if (target.closest(this.closeBtn)) {
			this.close()
		}
	}

	handleKeyDown(event) {
		if (event.key === 'Escape') {
			event.preventDefault()
			this.close()
		}
	}

	handleModalPopup(event) {
		const target = event.target
		if (target.closest('.overlay') || target.closest('.modal__close')) {
			this.close()
		}
	}

	addCloseBtn() {
		const button = document.createElement('button')
		button.classList.add('modal__close')
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttribute('width', '28')
		svg.setAttribute('height', '28')
		svg.setAttribute('viewBox', '0 0 28 28')
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		use.setAttribute(
			'href',
			'/local/templates/digital_2024_autumn/assets/svg/sprite.svg#icon-close'
		)
		svg.appendChild(use)
		button.appendChild(svg)
		if (this.modal) {
			this.modal.appendChild(button)
		}
	}

	showSuccessForm() {
		const form = this.modal.querySelector('form')
		const success = this.modal.querySelector('.modal__success')

		if (!form && !success) {
			return
		}
		success.classList.add('active')
		form.classList.add('hide')

		setTimeout(() => {
			this.close()
			success.classList.remove('active')
			form.classList.remove('hide')
		}, 3000)
	}
	showErrorForm() {
		const form = this.modal.querySelector('form')
		const error = this.modal.querySelector('.modal__error')

		if (!form && !error) {
			return
		}
		error.classList.add('active')
		form.classList.add('hide')

		setTimeout(() => {
			this.close()
			error.classList.remove('active')
			form.classList.remove('hide')
		}, 3000)
	}

	static closeAll() {
		document.querySelectorAll('.modal').forEach(modal => {
			modal.classList.remove('active')
		})
		document.querySelectorAll('.overlay').forEach(overlay => {
			overlay.remove()
		})
	}
}

function initCustomSelect() {
	document
		.querySelectorAll('select')
		.forEach(select => new CustomSelect(select))
}

function initTelMask() {
	const telMasks = document.querySelectorAll('[data-telinput], [type="tel"]')
	telMasks.forEach(telMask => {
		Inputmask('+7 (999) 999-99-99').mask(telMask)
	})
}

function isTouchDevice() {
	return (
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	)
}

function initScrollSmooth() {
	SmoothScroll({
		animationTime: 800,
		// Уменьшить время анимации
		stepSize: 80,
		// Немного увеличить размер шага

		// Дополнительные настройки:
		accelerationDelta: 40,
		// Уменьшить ускорение
		accelerationMax: 2,
		// Уменьшить максимальное ускорение
		keyboardSupport: true,
		// Поддержка клавиатуры
		arrowScroll: 50,
		// Шаг скролла стрелками на клавиатуре в пикселях

		// Pulse (less tweakable)
		// ratio of "tail" to "acceleration"
		pulseAlgorithm: true,
		pulseScale: 3,
		pulseNormalize: 1,
		touchpadSupport: true, // Поддержка тачпада
	})
}

function modalFormValide(modal, callback) {
	const config = {
		validateBeforeSubmitting: true,
		errorFieldCssClass: 'invalid',
		errorLabelStyle: {
			color: '#EC5F6C',
		},
		successFieldStyle: {
			borderColor: '#011222',
		},
	}

	const form = modal.modal.querySelector('form')
	console.log(form)
	const validate = new window.JustValidate(form, config)
	// name
	form.querySelectorAll('[required]').forEach(input => {
		validate.addField(input, [
			{
				rule: 'required',
				errorMessage: 'необходимо заполнить поле',
			},
		])
	})

	form.querySelectorAll('[type="email"]').forEach(email => {
		validate.addField(email, [
			{
				rule: 'email',
				errorMessage: 'Поле заполнено некорректно',
			},
			{
				rule: 'required',
				errorMessage: 'необходимо заполнить поле',
			},
		])
	})
	let validationState = false
	form.addEventListener('submit', e => {
		e.preventDefault()
		if (!validationState) {
			return
		}
		if (callback && typeof callback === 'function') {
			callback(e)
		}
		validationState = false
	})
	validate.onSuccess(e => {
		validationState = true
		console.log('validation')
	})
}

function setupModalForm(modal) {
	modalFormValide(modal, async e => {
		e.preventDefault()
		const form = e.currentTarget
		const formData = new FormData(form)
		const actionUrl = form.action
		formData.forEach((value, key) => {
			console.log(key + ': ' + value)
		})

		try {
			let response = await fetch(actionUrl, {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error(`Ошибка HTTP: ${response.status}`)
			}

			let data = await response.json()
			console.log('result', data)
			modal.showSuccessForm()
			form.reset()
			if (data.FORM_TYPE === 'ticket') {
				if (!data.RK_LINK) {
					return
				}
				setTimeout(() => {
					location.href = data.RK_LINK
				}, 3000)
			}
		} catch (error) {
			modal.showErrorForm()
			alert('Ошибка при отправке формы')
			console.error('Ошибка при отправке формы', error)
		}
	})
}

function initModals() {
	const becomePartnerModal = new Modal(
		'.become-partner',
		'.become-partner__open'
	)
	const registerModal = new Modal('.register', '.register__open')
	const paymentModal = new Modal('.payment', '.payment__open')
	const getVideosModal = new Modal('.get-videos')

	setupModalForm(becomePartnerModal)
	setupModalForm(registerModal)
	setupModalForm(paymentModal)
}

// Яндекс карта
function initYMap() {
	var map = new ymaps.Map('map', {
		center: [56.330342, 43.992488],
		zoom: 17,
	})
	map.controls.add('zoomControl')
	// Добавление геометки
	var placemark = new ymaps.Placemark([56.330342, 43.992488], {
		hintContent: 'Нижний Новгород, ул. Нижне-Волжская набережная дом 11',
		balloonContent: 'КПЦ Академия Маяк им. А.Д. Сахарова ',
	})
	map.geoObjects.add(placemark)
}

function initTabs() {
	const showTab = elTabBtn => {
		const elTab = elTabBtn.closest('.tab')
		if (elTabBtn.classList.contains('tab-btn-active')) {
			return
		}
		const targetId = elTabBtn.dataset.targetId
		const elTabPane = elTab.querySelector(`.tab-pane[data-id="${targetId}"]`)
		if (elTabPane) {
			const elTabBtnActive = elTab.querySelector('.tab-btn-active')
			elTabBtnActive.classList.remove('tab-btn-active')
			const elTabPaneShow = elTab.querySelector('.tab-pane-show')
			elTabPaneShow.classList.remove('tab-pane-show')
			elTabBtn.classList.add('tab-btn-active')
			elTabPane.classList.add('tab-pane-show')
		}
	}
	document.addEventListener('click', e => {
		if (e.target && !e.target.closest('.tab-btn')) {
			return
		}
		const elTabBtn = e.target.closest('.tab-btn')
		showTab(elTabBtn)
	})
}

function initAnimations() {
	// Функция для добавления класса анимации
	function addAnimationClass(entries, observer) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const animationClass = entry.target.dataset.animation
				if (animationClass) {
					entry.target.classList.add(animationClass)
				}
				observer.unobserve(entry.target) // Прекращаем наблюдение после добавления анимации
			}
		})
	}

	// Функция инициализации наблюдателя
	function observeElements() {
		const observer = new IntersectionObserver(addAnimationClass, {
			threshold: 0.5, // Процент видимости элемента для срабатывания
		})

		const animatableItems = document.querySelectorAll('.animation')
		animatableItems.forEach(item => {
			observer.observe(item)
		})
	}

	// Запуск функции наблюдения
	observeElements()
}

function removeOverlay(headerMenu) {
	const headerItems = document.querySelectorAll('.header__menu li')
	headerItems.forEach(item => {
		item.addEventListener('click', () => {
			headerMenu.overlay.remove()
			headerMenu.close()
		})
	})
}

function init() {
	const headerMenu = new HeaderMenu()

	initModals()

	initCustomSelect()
	initTelMask()
	if (!isTouchDevice()) {
		initScrollSmooth()
	}
	ymaps.ready(initYMap)
	initTabs()
	initAnimations()
	removeOverlay(headerMenu)
}

document.addEventListener('DOMContentLoaded', init)
