async function loadDanceData(url = 'studios.json') {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.warn('Очікувався масив студій, але отримано інший формат');
            return [];
        }

        // фільтрація лише з валідними координатами
        return data.filter(item =>
            typeof item.lat === 'number' &&
            typeof item.lng === 'number'
        );

    } catch (error) {
        console.error('Не вдалося завантажити дані студій:', error);
        return [];
    }
}

function renderPointsOnMap(points, map) {
    // Додавання маркерів + тултіпів + попапів + трекінг кліку
    const bounds = [];
    for (const item of points) {
        if (typeof item.lat !== 'number' || typeof item.lng !== 'number') continue;

        const marker = L.marker([item.lat, item.lng]).addTo(map);

        marker.bindTooltip(item["заголовок"], {
            permanent: true,
            direction: "top",
            offset: [0, -18],
            className: "my-tooltip"
        }).openTooltip();

        const html = `
        <div class="popup">
          <h3>${item["студія"]}</h3>
          <div><strong>${item["заголовок"]}</strong></div>
          <div class="muted">${item["адреса"]}</div>
          <div>Контакт: ${item["контакт"]}</div>
        </div>`;
        marker.bindPopup(html);

        // 🔹 ТРЕКІНГ: фіксуємо клік по маркеру в Simple Analytics
        marker.on('click', () => {
            sa_event('marker_click', {
                studio: item["студія"],
                title: item["заголовок"],
                address: item["адреса"]
            });
        });

        bounds.push([item.lat, item.lng]);
    }

    if (bounds.length) map.fitBounds(bounds, { padding: [30, 30] });
}

function renderPartiesOnMap(points, map) {
    // Додавання маркерів + тултіпів + попапів + трекінг кліку
    const bounds = [];
    for (const item of points) {
        if (typeof item.lat !== 'number' || typeof item.lng !== 'number') continue;

        const marker = L.marker([item.lat, item.lng]).addTo(map);

        marker.bindTooltip(item["заголовок"], {
            permanent: true,
            direction: "top",
            offset: [0, -18],
            className: "my-tooltip"
        }).openTooltip();

        const html = `
        <div class="popup">
          <div><strong>${item["заголовок"]}</strong></div>
          <div class="muted">${item["адреса"]}</div>
          <div>Контакт: ${item["опис"]}</div>
        </div>`;
        marker.bindPopup(html);

        // 🔹 ТРЕКІНГ: фіксуємо клік по маркеру в Simple Analytics
        marker.on('click', () => {
            sa_event('marker_click', {
                studio: item["id"],
                address: item["адреса"]
            });
        });

        bounds.push([item.lat, item.lng]);
    }

    if (bounds.length) map.fitBounds(bounds, { padding: [30, 30] });
}