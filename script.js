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

				wrapper.appendChild(img);
				gallery.appendChild(wrapper);
			});
		});

		// Popular carrossel com a primeira imagem de cada zona (se existir)
		const slides = document.querySelector('.slides');
		if (slides) {
			Object.keys(data).forEach((zone) => {
				const first = data[zone] && data[zone][3];
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
