// Carrega data/zonas.json e popula as galerias e o carrossel
fetch('data/zonas.json')
	.then((res) => {
		if (!res.ok) throw new Error('Falha ao buscar zonas.json');
		return res.json();
	})
	.then((data) => {
		// Popular galerias por zona
		Object.entries(data).forEach(([zone, files]) => {
			const gallery = document.getElementById(zone);
			if (!gallery) return;
			files.forEach((fname) => {
				const wrapper = document.createElement('div');

				const img = document.createElement('img');
				img.src = `imagens/${zone}/${fname}`;
				img.alt = fname;
				img.loading = 'lazy';

				// store metadata for viewer
				img.dataset.zone = zone;
				img.dataset.fname = fname;

				// abrir viewer ao clicar na imagem
				img.addEventListener('click', () => openViewer(zone, fname));

				wrapper.appendChild(img);
				gallery.appendChild(wrapper);
			});
		});

		// Popular carrossel com a primeira imagem de cada zona (se existir)
		const slides = document.querySelector('.slides');
		if (slides) {
			Object.keys(data).forEach((zone) => {
				const first = data[zone] && data[zone][0];
				if (!first) return;
				const img = document.createElement('img');
				img.src = `imagens/${zone}/${first}`;
				img.alt = zone;
				slides.appendChild(img);
			});

			// Carrossel simples: desliza automaticamente
			const imgs = slides.querySelectorAll('img');
			if (imgs.length > 0) {
				let idx = 0;
				const show = (i) => (slides.style.transform = `translateX(-${i * 100}%)`);
				setInterval(() => {
					idx = (idx + 1) % imgs.length;
					show(idx);
				}, 4000);
			}
		}
	})
	.catch((err) => console.error('Erro ao carregar zonas.json:', err));

// Viewer (antes/depois)
const viewer = document.getElementById('viewer');
const viewerOverlay = document.getElementById('viewerOverlay');
const viewerAfter = document.getElementById('viewerAfter');
const viewerBefore = document.getElementById('viewerBefore');
const viewerClose = document.getElementById('viewerClose');
const viewerToggle = document.getElementById('viewerToggle');

let showingBefore = false;

function openViewer(zone, fname) {
	const afterSrc = `imagens/${zone}/${fname}`;
	const beforeSrc = `imagens-raw/${zone}/${fname}`;

	showingBefore = false;
	viewerAfter.src = afterSrc;
	viewerAfter.alt = `Depois — ${fname}`;

	// prepare before image, hide until toggle
	viewerBefore.classList.add('hidden');
	viewerBefore.alt = `Antes — ${fname}`;
	viewerBefore.src = beforeSrc;

	// enable toggle (it may be disabled later if before image 404s)
	viewerToggle.disabled = false;
	viewerToggle.setAttribute('aria-pressed', 'false');
	viewerToggle.textContent = 'Ver Antes';

	// if before image fails to load, hide toggle
	viewerBefore.onerror = () => {
		viewerToggle.disabled = true;
		viewerToggle.textContent = 'Antes indisponível';
	};

	// show viewer
	viewer.classList.remove('hidden');
	viewer.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';

	// focus for accessibility
	viewerClose.focus();
}

function closeViewer() {
	viewer.classList.add('hidden');
	viewer.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
	// clear sources to stop downloads when closed
	viewerAfter.src = '';
	viewerBefore.src = '';
}

function toggleBefore() {
	if (viewerToggle.disabled) return;
	showingBefore = !showingBefore;
	if (showingBefore) {
		viewerAfter.classList.add('hidden');
		viewerBefore.classList.remove('hidden');
		viewerToggle.setAttribute('aria-pressed', 'true');
		viewerToggle.textContent = 'Ver Depois';
	} else {
		viewerBefore.classList.add('hidden');
		viewerAfter.classList.remove('hidden');
		viewerToggle.setAttribute('aria-pressed', 'false');
		viewerToggle.textContent = 'Ver Antes';
	}
}

viewerClose.addEventListener('click', closeViewer);
viewerToggle.addEventListener('click', toggleBefore);

// clicar fora do conteúdo fecha
viewerOverlay.addEventListener('click', (e) => {
	if (e.target === viewerOverlay) closeViewer();
});

// Esc fecha
document.addEventListener('keyup', (e) => {
	if (e.key === 'Escape' && !viewer.classList.contains('hidden')) closeViewer();
});
