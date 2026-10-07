let countdownTimer = null;

document.addEventListener('DOMContentLoaded', () => {
	initMenu();
	initMenuLinks();
	initAnchorScroll();
	initCountdown();
	initMap();
	initGallery();
	initAos();
	initGuestFormFields();
	initGuestSwiper();
	initTimingTabs();
	initMapTabsScroll();
});


// =====================================================
// МЕНЮ
// =====================================================

function initMenu() {
	const menu = document.querySelector('.menu');
	const menuBtn = document.querySelector('.menu__btn');
	const closeBtn = document.querySelector('.menu__close');

	if (!menu || !menuBtn) return;

	let isMenuOpen = false;
	let lockedScrollY = 0;
	let isRestoringScroll = false;

	function preventScroll(e) {
		if (!isMenuOpen) return;
		if (menu.contains(e.target)) return;

		e.preventDefault();
	}

	function preventKeyboardScroll(e) {
		if (!isMenuOpen) return;

		if (e.key === 'Escape') {
			closeMenu();
			return;
		}

		if (menu.contains(document.activeElement)) return;

		const scrollKeys = [
			'ArrowUp',
			'ArrowDown',
			'PageUp',
			'PageDown',
			'Home',
			'End',
			' '
		];

		if (scrollKeys.includes(e.key)) {
			e.preventDefault();
		}
	}

	function keepScrollPosition() {
		if (!isMenuOpen || isRestoringScroll) return;
		if (Math.abs(window.scrollY - lockedScrollY) < 1) return;

		isRestoringScroll = true;

		window.scrollTo({
			top: lockedScrollY,
			left: 0,
			behavior: 'auto'
		});

		requestAnimationFrame(() => {
			isRestoringScroll = false;
		});
	}

	function lockScroll() {
		lockedScrollY = window.scrollY;

		window.addEventListener('wheel', preventScroll, {
			passive: false
		});

		window.addEventListener('touchmove', preventScroll, {
			passive: false
		});

		window.addEventListener('scroll', keepScrollPosition, {
			passive: true
		});

		document.addEventListener(
			'keydown',
			preventKeyboardScroll
		);
	}

	function unlockScroll() {
		window.removeEventListener(
			'wheel',
			preventScroll
		);

		window.removeEventListener(
			'touchmove',
			preventScroll
		);

		window.removeEventListener(
			'scroll',
			keepScrollPosition
		);

		document.removeEventListener(
			'keydown',
			preventKeyboardScroll
		);
	}

	function openMenu() {
		if (isMenuOpen) return;

		isMenuOpen = true;

		menu.classList.add('active');
		menuBtn.classList.add('active');

		lockScroll();
	}

	function closeMenu() {
		if (!isMenuOpen) return;

		isMenuOpen = false;

		menu.classList.remove('active');
		menuBtn.classList.remove('active');

		unlockScroll();
	}

	menuBtn.addEventListener('click', e => {
		e.preventDefault();

		openMenu();
	});

	if (closeBtn) {
		closeBtn.addEventListener('click', e => {
			e.preventDefault();

			closeMenu();
		});
	}

	window.openMenu = openMenu;
	window.closeMenu = closeMenu;
}


// =====================================================
// ССЫЛКИ В МЕНЮ
// =====================================================

function initMenuLinks() {

	const links = document.querySelectorAll(
		'.menu a.go_to'
	);

	if (!links.length) return;

	links.forEach(link => {

		link.addEventListener('click', () => {

			if (window.closeMenu) {
				window.closeMenu();
			}

		});

	});

}


// =====================================================
// ПЛАВНЫЙ СКРОЛЛ
// =====================================================

function initAnchorScroll() {

	document.querySelectorAll('.go_to').forEach(link => {

		link.addEventListener('click', e => {

			if (
				link.classList.contains('timing__map-link')
			) {
				return;
			}

			const href = link.getAttribute('href');

			if (
				!href ||
				!href.startsWith('#') ||
				href === '#'
			) {
				return;
			}

			const target = document.querySelector(href);

			if (!target) return;

			e.preventDefault();

			if (window.closeMenu) {
				window.closeMenu();
			}

			requestAnimationFrame(() => {

				const targetPosition =
					target.getBoundingClientRect().top +
					window.pageYOffset -
					100;

				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});

			});

		});

	});

}


// =====================================================
// ТАЙМЕР
// =====================================================

function initCountdown() {

	const days = document.getElementById('days');
	const hours = document.getElementById('hours');
	const minutes = document.getElementById('minutes');
	const seconds = document.getElementById('seconds');

	if (!days || !hours || !minutes || !seconds) return;

	const targetDate =
		new Date('2026-10-19T00:00:00').getTime();

	function updateTimer() {

		const distance =
			targetDate - Date.now();

		if (distance <= 0) {

			days.textContent = '00';
			hours.textContent = '00';
			minutes.textContent = '00';
			seconds.textContent = '00';

			destroyCountdown();

			return;

		}

		const d = Math.floor(
			distance /
			(1000 * 60 * 60 * 24)
		);

		const h = Math.floor(
			(
				distance %
				(1000 * 60 * 60 * 24)
			) /
			(1000 * 60 * 60)
		);

		const m = Math.floor(
			(
				distance %
				(1000 * 60 * 60)
			) /
			(1000 * 60)
		);

		const s = Math.floor(
			(
				distance %
				(1000 * 60)
			) /
			1000
		);

		days.textContent =
			String(d).padStart(2, '0');

		hours.textContent =
			String(h).padStart(2, '0');

		minutes.textContent =
			String(m).padStart(2, '0');

		seconds.textContent =
			String(s).padStart(2, '0');

	}

	updateTimer();

	destroyCountdown();

	countdownTimer = setInterval(
		updateTimer,
		1000
	);

}


function destroyCountdown() {

	if (countdownTimer !== null) {

		clearInterval(countdownTimer);

		countdownTimer = null;

	}

}


// =====================================================
// GUEST SWIPER
// =====================================================

// =====================================================
// GUEST SWIPER
// =====================================================

function initGuestSwiper() {
	const swiperElement = document.querySelector('.guest-select-swiper');

	if (!swiperElement) {
		return () => {};
	}

	if (typeof Swiper === 'undefined') {
		console.warn('Swiper не подключен');
		return () => {};
	}

	// Если компонент инициализируется повторно в SPA —
	// сначала уничтожаем предыдущий экземпляр
	if (typeof window.destroyGuestSwiper === 'function') {
		window.destroyGuestSwiper();
	}

	const forms = document.querySelectorAll('.guest__content');
	const slides = swiperElement.querySelectorAll('.guest-select-swiper__slide');

	const nextButton = document.querySelector('.guest-select-swiper__next');
	const prevButton = document.querySelector('.guest-select-swiper__prev');

	if (!forms.length || !slides.length) {
		return () => {};
	}

	let guestSwiper = null;
	let updateTimer = null;
	let initFrame = null;
	let destroyed = false;

	function setActiveGuest(index) {
		forms.forEach((form, formIndex) => {
			form.classList.toggle(
				'active',
				formIndex === index
			);
		});

		slides.forEach((slide, slideIndex) => {
			slide.classList.toggle(
				'active',
				slideIndex === index
			);
		});
	}

	function getScrollStep() {
		return Math.max(
			swiperElement.clientWidth * 0.8,
			120
		);
	}

	function updateArrows() {
		if (
			destroyed ||
			!guestSwiper ||
			guestSwiper.destroyed
		) {
			return;
		}

		const current = guestSwiper.getTranslate();
		const min = guestSwiper.minTranslate();
		const max = guestSwiper.maxTranslate();

		const tolerance = 1;

		const isBeginning =
			current >= min - tolerance;

		const isEnd =
			current <= max + tolerance;

		const noOverflow =
			Math.abs(min - max) <= tolerance;

		if (prevButton) {
			const disabled =
				isBeginning || noOverflow;

			prevButton.classList.toggle(
				'disabled',
				disabled
			);

			prevButton.disabled = disabled;
		}

		if (nextButton) {
			const disabled =
				isEnd || noOverflow;

			nextButton.classList.toggle(
				'disabled',
				disabled
			);

			nextButton.disabled = disabled;
		}
	}

	function moveSlider(direction) {
		if (
			destroyed ||
			!guestSwiper ||
			guestSwiper.destroyed
		) {
			return;
		}

		const current = guestSwiper.getTranslate();
		const min = guestSwiper.minTranslate();
		const max = guestSwiper.maxTranslate();
		const step = getScrollStep();

		let target =
			current + direction * step;

		if (target > min) {
			target = min;
		}

		if (target < max) {
			target = max;
		}

		guestSwiper.translateTo(
			target,
			500,
			true,
			true
		);

		if (updateTimer !== null) {
			clearTimeout(updateTimer);
		}

		updateTimer = setTimeout(() => {
			updateTimer = null;
			updateArrows();
		}, 520);
	}

	function handleNextClick(e) {
		e.preventDefault();
		moveSlider(-1);
	}

	function handlePrevClick(e) {
		e.preventDefault();
		moveSlider(1);
	}

	function handleResize() {
		if (
			destroyed ||
			!guestSwiper ||
			guestSwiper.destroyed
		) {
			return;
		}

		guestSwiper.update();
		updateArrows();
	}

	const slideHandlers = [];

	slides.forEach((slide, index) => {
		const handler = () => {
			setActiveGuest(index);
		};

		slide.addEventListener('click', handler);

		slideHandlers.push({
			slide,
			handler
		});
	});

	if (nextButton) {
		nextButton.addEventListener(
			'click',
			handleNextClick
		);
	}

	if (prevButton) {
		prevButton.addEventListener(
			'click',
			handlePrevClick
		);
	}

	window.addEventListener(
		'resize',
		handleResize
	);

	guestSwiper = new Swiper(swiperElement, {
		slidesPerView: 'auto',
		spaceBetween: 4,
		speed: 500,
		allowTouchMove: true,
		watchOverflow: true,
		freeMode: true,

		on: {
			init() {
				setActiveGuest(0);

				initFrame = requestAnimationFrame(() => {
					initFrame = null;
					updateArrows();
				});
			},

			setTranslate() {
				updateArrows();
			},

			resize() {
				updateArrows();
			},

			update() {
				updateArrows();
			}
		}
	});

	function destroyGuestSwiper() {
		if (destroyed) {
			return;
		}

		destroyed = true;

		window.removeEventListener(
			'resize',
			handleResize
		);

		if (nextButton) {
			nextButton.removeEventListener(
				'click',
				handleNextClick
			);
		}

		if (prevButton) {
			prevButton.removeEventListener(
				'click',
				handlePrevClick
			);
		}

		slideHandlers.forEach(({ slide, handler }) => {
			slide.removeEventListener(
				'click',
				handler
			);
		});

		if (updateTimer !== null) {
			clearTimeout(updateTimer);
			updateTimer = null;
		}

		if (initFrame !== null) {
			cancelAnimationFrame(initFrame);
			initFrame = null;
		}

		if (
			guestSwiper &&
			!guestSwiper.destroyed
		) {
			guestSwiper.destroy(true, true);
		}

		guestSwiper = null;

		if (
			window.destroyGuestSwiper ===
			destroyGuestSwiper
		) {
			delete window.destroyGuestSwiper;
		}
	}

	window.destroyGuestSwiper = destroyGuestSwiper;

	return destroyGuestSwiper;
}


// =====================================================
// GUEST FORM FIELDS
// =====================================================

function initGuestFormFields() {

	const forms =
		document.querySelectorAll(
			'.guest__content'
		);

	if (!forms.length) return;

	forms.forEach(
		(form, guestIndex) => {

			const guestNumber =
				guestIndex + 1;

			form
				.querySelectorAll(
					'input[type="text"]'
				)
				.forEach(
					(input, index) => {

						const field =
							input.dataset.field ||
							'name';

						input.name =
							`guest-${guestNumber}-${field}`;

						if (!input.id) {

							input.id =
								`guest-${guestNumber}-${field}-${index + 1}`;

						}

					}
				);

			form
				.querySelectorAll(
					'textarea'
				)
				.forEach(
					(textarea, index) => {

						const field =
							textarea.dataset.field;

						if (!field) return;

						textarea.name =
							`guest-${guestNumber}-${field}`;

						if (!textarea.id) {

							textarea.id =
								`guest-${guestNumber}-${field}-${index + 1}`;

						}

					}
				);

			form
				.querySelectorAll(
					'input[type="radio"]'
				)
				.forEach(
					(input, index) => {

						const field =
							input.dataset.field;

						if (!field) return;

						input.name =
							`guest-${guestNumber}-${field}`;

						if (
							!input.value ||
							input.value === 'on'
						) {

							input.value =
								input.dataset.value ||
								`option-${index + 1}`;

						}

						if (!input.id) {

							const safeValue =
								input.value
									.toString()
									.toLowerCase()
									.replace(
										/\s+/g,
										'-'
									)
									.replace(
										/[^a-z0-9а-яё_-]/gi,
										''
									);

							input.id =
								`guest-${guestNumber}-${field}-${safeValue}`;

						}

						const label =
							input.closest('label');

						if (label) {

							label.setAttribute(
								'for',
								input.id
							);

						}

					}
				);

			form
				.querySelectorAll(
					'input[type="checkbox"]'
				)
				.forEach(
					(input, index) => {

						const field =
							input.dataset.field;

						if (!field) return;

						if (
							input.dataset.multiple ===
							'true'
						) {

							input.name =
								`guest-${guestNumber}-${field}[]`;

						} else {

							input.name =
								`guest-${guestNumber}-${field}`;

						}

						if (
							!input.value ||
							input.value === 'on'
						) {

							input.value =
								input.dataset.value ||
								`option-${index + 1}`;

						}

						if (!input.id) {

							const safeValue =
								input.value
									.toString()
									.toLowerCase()
									.replace(
										/\s+/g,
										'-'
									)
									.replace(
										/[^a-z0-9а-яё_-]/gi,
										''
									);

							input.id =
								`guest-${guestNumber}-${field}-${safeValue}`;

						}

						const label =
							input.closest('label');

						if (label) {

							label.setAttribute(
								'for',
								input.id
							);

						}

					}
				);

		}
	);

}

function initMapTabsScroll() {

	const tabs = document.querySelector('.map__tabs');

	if (!tabs) return;

	let isDown = false;
	let startX = 0;
	let scrollLeft = 0;
	let moved = false;

	tabs.addEventListener('mousedown', e => {

		isDown = true;
		moved = false;

		startX = e.pageX - tabs.offsetLeft;
		scrollLeft = tabs.scrollLeft;

		tabs.classList.add('dragging');

	});

	tabs.addEventListener('mouseleave', () => {

		isDown = false;
		tabs.classList.remove('dragging');

	});

	tabs.addEventListener('mouseup', () => {

		isDown = false;
		tabs.classList.remove('dragging');

	});

	tabs.addEventListener('mousemove', e => {

		if (!isDown) return;

		e.preventDefault();

		const x = e.pageX - tabs.offsetLeft;
		const walk = x - startX;

		if (Math.abs(walk) > 5) {
			moved = true;
		}

		tabs.scrollLeft = scrollLeft - walk;

	});

	tabs.addEventListener(
		'click',
		e => {

			if (!moved) return;

			e.preventDefault();
			e.stopPropagation();

			moved = false;

		},
		true
	);

}

// =====================================================
// MAP
// =====================================================

async function initMap() {

	const section =
		document.querySelector('.map');

	if (!section) return;

	const mapElement =
		section.querySelector('#map-canvas');

	const buttons = [
		...section.querySelectorAll('.map__tab')
	];

	const infos = [
		...section.querySelectorAll('.map__info')
	];

	const templateContent =
		document.querySelector('.template-content');

	if (
		!mapElement ||
		!buttons.length ||
		!infos.length
	) {
		return;
	}

	if (typeof ymaps3 === 'undefined') {

		console.warn(
			'Yandex Maps JS API v3 не подключён'
		);

		return;
	}

	await ymaps3.ready;

	const {
		YMap,
		YMapDefaultSchemeLayer,
		YMapDefaultFeaturesLayer,
		YMapMarker
	} = ymaps3;

	const locations =
		infos.map(
			(info, index) => ({
				index,
				coordinates: [
					Number(info.dataset.lng),
					Number(info.dataset.lat)
				],
				content: info.innerHTML
			})
		);

	function getTheme() {

		if (!templateContent) {
			return 'green';
		}

		return (
			templateContent.dataset.theme ||
			'green'
		);

	}

	function getMarkerIcon() {

		const theme = getTheme();

		const icons = {
			blue: 'img/heart-blue.svg',
			red: 'img/heart-red.svg',
			green: 'img/heart-green.svg'
		};

		return (
			icons[theme] ||
			icons.green
		);

	}

	const map = new YMap(
		mapElement,
		{
			location: {
				center:
					locations[0]
						.coordinates,
				zoom: 15
			},
			behaviors: [
				'drag',
				'pinchZoom'
			]
		}
	);

	map.addChild(
		new YMapDefaultSchemeLayer({})
	);

	map.addChild(
		new YMapDefaultFeaturesLayer({})
	);

	const markers = [];

	locations.forEach(
		(location, index) => {

			const markerElement =
				document.createElement(
					'div'
				);

			markerElement.className =
				'map-marker';

			if (index === 0) {

				markerElement.classList.add(
					'active'
				);

			}

			markerElement.innerHTML = `
				<button class="map-marker__icon" type="button">
					<img src="${getMarkerIcon()}" alt="">
				</button>

				<div class="map-marker__info">
					${location.content}
				</div>
			`;

			const marker =
				new YMapMarker(
					{
						coordinates:
							location.coordinates
					},
					markerElement
				);

			const markerButton =
				markerElement.querySelector(
					'.map-marker__icon'
				);

			markerButton.addEventListener(
				'click',
				() => {

					setActiveLocation(
						index
					);

				}
			);

			map.addChild(marker);

			markers.push({
				marker,
				element:
					markerElement
			});

		}
	);

	function updateMarkerIcons() {

		markers.forEach(
			markerData => {

				const image =
					markerData.element
						.querySelector('img');

				if (!image) return;

				image.src =
					getMarkerIcon();

			}
		);

	}

	function setActiveLocation(index) {

		const location =
			locations[index];

		if (!location) return;

		buttons.forEach(
			(button, buttonIndex) => {

				button.classList.toggle(
					'active',
					buttonIndex === index
				);

			}
		);

		markers.forEach(
			(
				markerData,
				markerIndex
			) => {

				const active =
					markerIndex === index;

				markerData.element
					.classList.toggle(
						'active',
						active
					);

			}
		);

		map.setLocation({
			center:
				location.coordinates,
			zoom: 15,
			duration: 500
		});

	}

	buttons.forEach(
		(button, index) => {

			button.addEventListener(
				'click',
				() => {

					setActiveLocation(
						index
					);

				}
			);

		}
	);

	const timingLinks =
		document.querySelectorAll(
			'.timing__map-link[data-location]'
		);

	timingLinks.forEach(link => {

		link.addEventListener(
			'click',
			e => {

				e.preventDefault();

				const index =
					Number(
						link.dataset.location
					);

				if (!locations[index]) {
					return;
				}

				setActiveLocation(index);

				const scrollTop =
					section
						.getBoundingClientRect()
						.top +
					window.pageYOffset -
					100;

				window.scrollTo({
					top: scrollTop,
					behavior: 'smooth'
				});

			}
		);

	});

	if (templateContent) {

		const themeObserver =
			new MutationObserver(
				mutations => {

					mutations.forEach(
						mutation => {

							if (
								mutation.type ===
									'attributes' &&
								mutation.attributeName ===
									'data-theme'
							) {

								updateMarkerIcons();

							}

						}
					);

				}
			);

		themeObserver.observe(
			templateContent,
			{
				attributes: true,
				attributeFilter: [
					'data-theme'
				]
			}
		);

	}

	setActiveLocation(0);

}


// =====================================================
// GALLERY
// =====================================================

function initGallery() {

	const slider =
		document.querySelector(
			'.swiper-gallery'
		);

	if (!slider) return;

	if (typeof Swiper === 'undefined') {

		console.warn(
			'Swiper не подключен'
		);

		return;

	}

	new Swiper(slider, {

		slidesPerView: 1,
		spaceBetween: 0,
		speed: 700,

		navigation: {

			nextEl:
				'.swiper-button-next',

			prevEl:
				'.swiper-button-prev'

		},

		breakpoints: {

			320: {

				spaceBetween: 0,
				slidesPerView: 1

			},

			568: {

				slidesPerView: 1,
				spaceBetween: 0

			},

			768: {

				slidesPerView: 1

			},

			1200: {

				slidesPerView: 1

			}

		}

	});

	if (
		typeof GLightbox !==
		'undefined'
	) {

		GLightbox({

			selector: '.glightbox',
			touchNavigation: true,
			loop: true,
			openEffect: 'zoom',
			closeEffect: 'fade'

		});

	}

}


// =====================================================
// AOS
// =====================================================

function initAos() {

	if (
		typeof AOS ===
		'undefined'
	) {
		return;
	}

	AOS.init({

		duration: 900,
		once: true,
		offset: 80

	});

}


// =====================================================
// TIMING TABS
// =====================================================

function initTimingTabs() {

	const tabs =
		document.querySelectorAll(
			'.timing__tabs button'
		);

	const areas =
		document.querySelectorAll(
			'.timing__area'
		);

	if (
		!tabs.length ||
		!areas.length
	) {
		return;
	}

	tabs.forEach(
		(tab, index) => {

			tab.addEventListener(
				'click',
				() => {

					tabs.forEach(
						item => {

							item.classList.remove(
								'active'
							);

						}
					);

					areas.forEach(
						area => {

							area.classList.remove(
								'active'
							);

						}
					);

					tab.classList.add(
						'active'
					);

					if (areas[index]) {

						areas[index]
							.classList.add(
								'active'
							);

					}

				}
			);

		}
	);

}