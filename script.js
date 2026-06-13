let goldPricePerOzUSD = 4705; 
const gramPerOz = 31.1035;

const currencies = {
    'USD': { code: 'USD', flag: 'US', name: 'US Dollar', rate: 1, locale: 'en-US' },
    'IDR': { code: 'IDR', flag: 'ID', name: 'Indonesian Rupiah', rate: 16250, locale: 'id-ID' },
    'EUR': { code: 'EUR', flag: 'EU', name: 'Euro', rate: 0.92, locale: 'de-DE' },
    'GBP': { code: 'GBP', flag: 'UK', name: 'British Pound', rate: 0.79, locale: 'en-GB' },
    'JPY': { code: 'JPY', flag: 'JPN', name: 'Yen Jepang', rate: 108.04, locale: 'ja-JP' },
    'CHF': { code: 'CHF', flag: 'CHE', name: 'Franc Swiss', rate: 17850.50, locale: 'de-CH' },
    'AUD': { code: 'AUD', flag: 'AUS', name: 'Australia Dollar', rate: 11050.25, locale: 'en-AU' },
    'SGD': { code: 'SGD', flag: 'SG', name: 'Singapore Dollar', rate: 1.36, locale: 'en-SG' },
    'MYR': { code: 'MYR', flag: 'MY', name: 'Malaysian Ringgit', rate: 4.78, locale: 'ms-MY' }
};

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const lsStatus = document.getElementById('lsStatus');
    const mainContent = document.getElementById('main-content');

    const messages = [
        'Menginisialisasi aplikasi...',
        'Memuat data mata uang...',
        'Menyiapkan konverter emas...',
        'Menghitung harga real-time...',
        'Hampir selesai...'
    ];
    let msgIdx = 0;
    
    if (loadingScreen) {
        const msgInterval = setInterval(() => {
            msgIdx = (msgIdx + 1) % messages.length;
            if (lsStatus) {
                lsStatus.style.opacity = '0';
                lsStatus.style.transform = 'translateY(6px)';
                lsStatus.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                setTimeout(() => {
                    lsStatus.textContent = messages[msgIdx];
                    lsStatus.style.opacity = '1';
                    lsStatus.style.transform = 'translateY(0)';
                }, 220);
            }
        }, 380);

        setTimeout(() => {
            clearInterval(msgInterval);
            loadingScreen.classList.add('loading-hide');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                if (mainContent) {
                    mainContent.style.display = 'block';
                    setTimeout(() => {
                        mainContent.style.transition = 'opacity 0.5s ease-out';
                        mainContent.style.opacity = '1';
                    }, 50);
                }
            }, 700);
        }, 2000);
    }

    const landscapeBtn = document.getElementById('landscapeBtn');
    if (landscapeBtn) {
        landscapeBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen();
            }
        });
    }

    const infoBtn = document.getElementById('infoBtn');
    const infoModal = document.getElementById('infoModal');
    const infoModalClose = document.getElementById('infoModalClose');
    const infoModalBackdrop = document.getElementById('infoModalBackdrop');

    const openInfoModal = () => {
        if(infoModal) {
            infoModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeInfoModal = () => {
        if(infoModal) {
            infoModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    if(infoBtn) infoBtn.addEventListener('click', openInfoModal);
    if(infoModalClose) infoModalClose.addEventListener('click', closeInfoModal);
    if(infoModalBackdrop) infoModalBackdrop.addEventListener('click', closeInfoModal);

    const tabButtons = document.querySelectorAll('.tab-button');
    const converterSection1 = document.querySelector('.converter-box');
    const converterSection2 = document.querySelector('.results-section');
    const perbandinganSection = document.querySelector('.perbandingan-section');
    const trenSection = document.querySelector('.tren-section');

    function hideAllSections() {
        if(converterSection1) converterSection1.style.display = 'none';
        if(converterSection2) converterSection2.style.display = 'none';
        if(perbandinganSection) perbandinganSection.style.display = 'none';
        if(trenSection) trenSection.style.display = 'none';
    }

    hideAllSections();
    if(converterSection1) converterSection1.style.display = 'block';
    if(converterSection2) converterSection2.style.display = 'block';
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    if(tabButtons[0]) tabButtons[0].classList.add('active');

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            hideAllSections();
            if (index === 0) {
                if(converterSection1) converterSection1.style.display = 'block';
                if(converterSection2) converterSection2.style.display = 'block';
            } else if (index === 1) {
                if(perbandinganSection) perbandinganSection.style.display = 'flex';
            } else if (index === 2) {
                if(trenSection) trenSection.style.display = 'flex';
            }
        });
    });

    const selectTrigger = document.querySelector('.select-trigger');
    const selectOptions = document.querySelector('.select-options');
    const selectedCurrencyDisplay = document.getElementById('selectedCurrencyDisplay');
    const inputAmount = document.getElementById('inputAmount');
    let currentCurrency = 'USD';

    if (selectOptions) {
        let menuHTML = '';
        for (const key in currencies) {
            const curr = currencies[key];
            menuHTML += `
                <div class="option ${key === 'USD' ? 'selected' : ''}" data-currency="${key}">
                    <div class="currency-display">
                        <span class="flag-text">${curr.flag}</span>
                        <span class="currency-code">${curr.code}</span>
                        <span class="currency-name">- ${curr.name}</span>
                    </div>
                    ${key === 'USD' ? '<span class="check-icon">✓</span>' : ''}
                </div>
            `;
        }
        selectOptions.innerHTML = menuHTML;
    }

    const options = document.querySelectorAll('.option');

    if (selectTrigger && selectOptions) {
        selectTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = selectOptions.style.display === 'block';
            selectOptions.style.display = isOpen ? 'none' : 'block';
            if (!isOpen) {
                selectTrigger.classList.add('active-border');
            } else {
                selectTrigger.classList.remove('active-border');
            }
        });

        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                currentCurrency = this.dataset.currency;
                const selectedCurrencyHtml = this.querySelector('.currency-display').innerHTML;
                selectTrigger.querySelector('.currency-display').innerHTML = selectedCurrencyHtml;
                options.forEach(opt => {
                    opt.classList.remove('selected');
                    const checkIcon = opt.querySelector('.check-icon');
                    if (checkIcon) checkIcon.remove();
                });
                this.classList.add('selected');
                const checkSpan = document.createElement('span');
                checkSpan.className = 'check-icon';
                checkSpan.textContent = '✓';
                this.appendChild(checkSpan);
                selectOptions.style.display = 'none';
                selectTrigger.classList.remove('active-border');
                updateCalculations();
            });
        });

        document.addEventListener('click', function() {
            selectOptions.style.display = 'none';
            selectTrigger.classList.remove('active-border');
        });
    }

    const tooltip = document.getElementById('chart-tooltip');
    const points = document.querySelectorAll('.chart-point');
    points.forEach(point => {
        point.addEventListener('mouseenter', (e) => {
            const month = e.target.getAttribute('data-month');
            const price = e.target.getAttribute('data-price');
            tooltip.innerHTML = `<div class="tooltip-title">${month}</div><div class="tooltip-value">price : ${price}</div>`;
            tooltip.style.opacity = '1';
        });
        point.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY - 15) + 'px';
        });
        point.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', (e) => {
            const month = e.target.getAttribute('data-month');
            const volume = e.target.getAttribute('data-volume');
            tooltip.innerHTML = `<div class="tooltip-title">${month}</div><div class="tooltip-value">volume : ${volume}</div>`;
            tooltip.style.opacity = '1';
            e.target.style.opacity = '0.7'; 
        });
        bar.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY - 15) + 'px';
        });
        bar.addEventListener('mouseleave', (e) => {
            tooltip.style.opacity = '0';
            e.target.style.opacity = '1';
        });
    });

    const pieSlices = document.querySelectorAll('.pie-slice');
    pieSlices.forEach(slice => {
        slice.addEventListener('mouseenter', (e) => {
            const label = e.target.getAttribute('data-label');
            const value = e.target.getAttribute('data-value');
            tooltip.innerHTML = `<div style="font-weight:600; padding: 2px 4px;">${label} : ${value}</div>`;
            tooltip.style.opacity = '1';
            e.target.style.opacity = '0.85'; 
        });
        slice.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY - 15) + 'px';
        });
        slice.addEventListener('mouseleave', (e) => {
            tooltip.style.opacity = '0';
            e.target.style.opacity = '1';
        });
    });

    const themeCheckbox = document.getElementById('themeCheckbox');
    const sunIcon = document.querySelector('.mode img[alt="Ikon Matahari"]');
    const moonIcon = document.querySelector('.mode img[alt="Ikon Bulan"]');
    
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                if (sunIcon) sunIcon.src = 'matahari-nm.png';
                if (moonIcon) moonIcon.src = 'bulan-nm.png';
            } else {
                document.body.classList.remove('dark-mode');
                if (sunIcon) sunIcon.src = 'Matahari.png';
                if (moonIcon) moonIcon.src = 'Bulan.png';
            }
        });
    }

    function updateCalculations() {
        if (!inputAmount) return;
        let rawValue = inputAmount.value.replace(/[^0-9.-]+/g,"");
        let amount = parseFloat(rawValue) || 0;
        const curr = currencies[currentCurrency] || currencies['USD'];
        
        let amountInUSD = amount / curr.rate; 
        let totalOz = amountInUSD / goldPricePerOzUSD;
        let totalGram = totalOz * gramPerOz;
        let pricePerGramUSD = goldPricePerOzUSD / gramPerOz;
        let pricePerGramCurr = pricePerGramUSD * curr.rate;
        
        const formatDynamicCurrency = (val, currCode) => {
            const tempCurr = currencies[currCode] || curr;
            const hasDecimal = val % 1 !== 0;
            return new Intl.NumberFormat(tempCurr.locale, { 
                style: 'currency', 
                currency: tempCurr.code,
                minimumFractionDigits: currCode === 'IDR' ? 0 : (hasDecimal ? 2 : 0),
                maximumFractionDigits: currCode === 'IDR' ? 0 : 2
            }).format(val);
        };
        const formatNum = (val, decimals=4) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(val);
        const formatUSD = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

        const topHargaEmas = document.getElementById('topHargaEmas');
        if (topHargaEmas) topHargaEmas.textContent = formatDynamicCurrency(goldPricePerOzUSD * curr.rate, currentCurrency);
        
        const realtimeInfoText = document.getElementById('realtimeInfoText');
        if(realtimeInfoText) realtimeInfoText.innerText = `1 Troy Oz = ${formatDynamicCurrency(goldPricePerOzUSD * curr.rate, currentCurrency)} | 1 Troy Oz = 31,1035 gram`;

        const trenHighest = document.getElementById('trenHighest');
        const trenLowest = document.getElementById('trenLowest');
        const trenAverage = document.getElementById('trenAverage');
        const trenHighestLabel = document.getElementById('trenHighestLabel');
        const trenLowestLabel = document.getElementById('trenLowestLabel');
        const trenAverageLabel = document.getElementById('trenAverageLabel');
        
        if (trenHighest) trenHighest.textContent = formatDynamicCurrency(5634 * curr.rate, currentCurrency);
        if (trenLowest) trenLowest.textContent = formatDynamicCurrency(3122 * curr.rate, currentCurrency);
        if (trenAverage) trenAverage.textContent = formatDynamicCurrency(4497.17 * curr.rate, currentCurrency);

        if (trenHighestLabel) trenHighestLabel.textContent = `dalam ${currentCurrency}`;
        if (trenLowestLabel) trenLowestLabel.textContent = `dalam ${currentCurrency}`;
        if (trenAverageLabel) trenAverageLabel.textContent = `dalam ${currentCurrency}`;

        const percentages = [100, 75, 50, 25, 10];
        let cardsHTML = '';
        let tableHTML = '';
        let barsHTML = '';

        percentages.forEach((pct, index) => {
            let cardAmount = amount * (pct / 100);
            let cardUSD = amountInUSD * (pct / 100);
            let cardOz = totalOz * (pct / 100);
            let cardGram = totalGram * (pct / 100);
            let isExpanded = index === 0;

            cardsHTML += `
            <div class="result-card ${isExpanded ? 'expanded' : ''}">
                <div class="card-top-bar"><div class="card-top-fill" style="width: ${pct}%;"></div></div>
                <div class="card-badge">${pct}% dari Total</div>
                <div class="card-content">
                    <div class="col-input">
                        <span class="col-label">Jumlah Input</span>
                        <span class="col-value-main">${formatDynamicCurrency(cardAmount, currentCurrency)}</span>
                        <span class="col-sub">≈ ${formatDynamicCurrency(cardAmount, currentCurrency)}</span>
                    </div>
                    <div class="col-icon"><img src="Panah.png" alt="Tukar" class="exchange-icon text-image"></div>
                    <div class="col-oz">
                        <span class="col-label">Troy Ounce</span>
                        <span class="col-value-orange">${formatNum(cardOz, 4)} oz</span>
                        <div class="progress-container"><div class="progress-fill" style="width: ${pct}%;"></div></div>
                    </div>
                    <div class="col-gram">
                        <span class="col-label">Gram Emas</span>
                        <span class="col-value-orange">${formatNum(cardGram, 2)} g</span>
                        <span class="col-sub">Setara berat</span>
                    </div>
                </div>
                <div class="card-extra-details" id="extra-info-${index}">
                    <div class="detail-col">
                        <span class="col-label">Harga per Gram</span>
                        <span class="detail-value-text">${formatDynamicCurrency(pricePerGramCurr, currentCurrency)}</span>
                    </div>
                    <div class="detail-col">
                        <span class="col-label">Kurs Saat Ini</span>
                        <span class="detail-value-text">1 USD = ${formatNum(curr.rate, 4)} ${curr.code}</span>
                    </div>
                </div>
                <div class="card-footer" id="toggle-btn-${index}" style="padding: 12px; margin-top: 10px; cursor: pointer; display: flex; justify-content: center; align-items: center;">
                    <img src="down.png" class="arrow-down-light text-image" style="width: 20px; height: 20px; transition: transform 0.3s ease;">
                </div>
            </div>`;

            tableHTML += `
            <tr>
                <td><span class="badge-tabel">${pct}%</span></td>
                <td>${formatDynamicCurrency(cardAmount, currentCurrency)}</td>
                <td class="tb-usd">${formatUSD(cardUSD)}</td>
                <td class="tb-oz">${formatNum(cardOz, 4)}</td>
                <td class="tb-gram">${formatNum(cardGram, 2)}</td>
            </tr>`;

            if (pct >= 25) {
                const barColor = pct === 100 ? '#f59e0b' : pct === 75 ? '#fbbf24' : pct === 50 ? '#fcd34d' : '#fde047';
                barsHTML += `
                <div class="dist-bar-item">
                    <div class="dist-bar-header">
                        <div class="dist-label-wrap"><div class="color-box" style="background-color: ${barColor};"></div><span>${pct}%</span></div>
                        <div class="dist-value-wrap">${formatNum(cardGram, 2)} g</div>
                    </div>
                    <div class="dist-track"><div class="dist-fill" style="width: ${pct}%; background-color: ${barColor};"></div></div>
                </div>`;
            }
        });

        const resultsListElement = document.getElementById('resultsList');
        if (resultsListElement) resultsListElement.innerHTML = cardsHTML;
        
        percentages.forEach((pct, index) => {
            const toggleBtn = document.getElementById(`toggle-btn-${index}`);
            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    const card = e.target.closest('.result-card');
                    if(card) card.classList.toggle('expanded');
                });
            }
        });

        const comparisonTableBody = document.getElementById('comparisonTableBody');
        if(comparisonTableBody) comparisonTableBody.innerHTML = tableHTML;
        
        const distributionBars = document.getElementById('distributionBars');
        if(distributionBars) distributionBars.innerHTML = barsHTML;
        
        const tableCurrencyHeader = document.getElementById('tableCurrencyHeader');
        if(tableCurrencyHeader) tableCurrencyHeader.textContent = 'USD';
    }

    if (inputAmount) {
        inputAmount.addEventListener('input', updateCalculations);
    }
    
    updateCalculations();

    setInterval(() => {
        const pergerakan = (Math.random() * 10) - 5;
        goldPricePerOzUSD = goldPricePerOzUSD + pergerakan;
        if (inputAmount) {
            updateCalculations();
        }
    }, 4000);
});