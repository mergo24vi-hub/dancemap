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

function getUserPermissons(userid) {
    return fetch(`http://localhost:8888/.netlify/functions/getuserpremissions?userid=${userid}`)
        .then(response => response.json())
        .then(data => {
            const canUserVote = data?.canuservote;
            console.log(canUserVote);
            return canUserVote;
        })
        .catch(error => {
            console.error('Помилка:', error);
            return false;
        });
}

function getVoices() {
    return {
        "2025-10-05-kyiv-signal-event-hall-bachata-party":0,
        "2025-10-05-kyiv-campus-community-latin-party":0,
        "2025-10-05-kyiv-ravado-studio-kizomba-party":4
    }

    return fetch(`http://localhost:8888/.netlify/functions/getvoices}`)
        .then(response => response.json())
        .then(data => {
            const voices = data;
            console.log(voices);
            return voices;
        })
        .catch(error => {
            console.error('Помилка:', error);
            return false;
        });
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

    if (bounds.length) map.fitBounds(bounds, {padding: [30, 30]});
}

function renderPartiesOnMap(userid, points, map) {
    // Додавання маркерів + тултіпів + попапів + трекінг кліку
    const canUserVote = true // getUserPermissons(userid);
    const bounds = [];
    const voices = getVoices()
    for (const item of points) {
        if (typeof item.lat !== 'number' || typeof item.lng !== 'number') continue;

        const votes = 0+ voices[item.id]
        let html = `
          <div class="party-marker" data-partyid="${escapeHtml(item.id)}">
            <div class="pin" title="${escapeHtml(item['заголовок'] || '')}">•</div>
            <div class="votes-circle" aria-label="Голосів: ${votes}">${votes}</div>
            ${canUserVote ? `<button class="vote-btn" title="Проголосувати">👍</button>` : ''}
          </div>`;

        let marker = L.marker([item.lat, item.lng]).addTo(map);
        marker.bindTooltip(item["заголовок"], {
            permanent: true,
            direction: "top",
            offset: [0, -18],
            className: "my-tooltip"
        }).openTooltip();

        const icon = L.divIcon({
            className: '', // пусто, щоб уникнути стандартних стилів leaflet
            html,
            iconSize: null,
            iconAnchor: [14, 28] // можна підкоригувати під ваш маркер
        });

        marker = L.marker([item.lat, item.lng], { icon }).addTo(map);

        html = `
        <div class="popup">
          <div><strong>${item["заголовок"]}</strong></div>
          <div class="muted">${item["адреса"]}</div>
          <div>Контакт: ${item["опис"]}</div>
        </div>`;

        if (canUserVote) {
            html += `
      <button class="vote-btn" title="мені подобається ця вечірка">👍️</button>`;
        }

        marker.bindPopup(html);

        // 🔹 ТРЕКІНГ: фіксуємо клік по маркеру в Simple Analytics
        marker.on('click', () => {
            sa_event('marker_click', {
                id: item["id"],
                address: item["адреса"]
            });
        });

        bounds.push([item.lat, item.lng]);
    }

    if (bounds.length) map.fitBounds(bounds, {padding: [30, 30]});
}


// Допоміжна функція для безпечної вставки тексту в HTML
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
