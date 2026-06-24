/**
 * Premium Stock Market Education Website JavaScript
 * Educator: Piyush Garg
 */

// UPI & WhatsApp configuration constants for dynamic checkout integration
const UPI_ID = 'piyushaggarwal868-1@okaxis';
const MERCHANT_NAME = 'Piyush Garg';
const WHATSAPP_NUM = '918968043746';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header & Active Navigation Links
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active navigation link highlighting on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 2. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Simulated Live Stock Ticker
    const tickerItems = document.querySelectorAll('.ticker-item');
    
    function simulateTickerUpdates() {
        tickerItems.forEach(item => {
            const priceEl = item.querySelector('.price');
            const changeEl = item.querySelector('.change');
            if (!priceEl || !changeEl) return;

            let currentPrice = parseFloat(priceEl.textContent.replace(/,/g, ''));
            let currentChange = parseFloat(changeEl.textContent.replace(/[%+]/g, ''));

            // Determine randomized price change (-0.1% to +0.15%)
            const percentMove = (Math.random() * 0.25 - 0.1) / 100;
            const move = currentPrice * percentMove;
            currentPrice += move;

            const changeDirection = move >= 0 ? 1 : -1;
            currentChange += percentMove * 100 * changeDirection;

            // Apply formatting
            priceEl.textContent = currentPrice.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const sign = move >= 0 ? '+' : '';
            changeEl.textContent = `${sign}${currentChange.toFixed(2)}%`;

            // Adjust up/down class indicators
            if (move >= 0) {
                item.classList.remove('down');
                item.classList.add('up');
            } else {
                item.classList.remove('up');
                item.classList.add('down');
            }

            // Visual flash indicator
            item.style.transition = 'color 0.1s ease';
            const flashColor = move >= 0 ? 'rgba(0, 200, 83, 0.4)' : 'rgba(255, 61, 87, 0.4)';
            item.style.textShadow = `0 0 8px ${flashColor}`;
            setTimeout(() => {
                item.style.textShadow = 'none';
            }, 300);
        });
    }
    // Update every 2.5 seconds
    setInterval(simulateTickerUpdates, 2500);

    // 4. Chart.js Dashboard Configuration
    const ctx = document.getElementById('insightsChart');
    let currentChart = null;

    const chartDatasets = {
        nifty: {
            label: 'Nifty 50 Index (Past 30 Days)',
            data: [22800, 22910, 22850, 23010, 23150, 23090, 23200, 23410, 23350, 23500, 23550, 23480, 23620, 23700, 23650, 23800, 23880, 23750, 23900, 24020, 23950, 24100, 24200, 24150, 24300, 24350, 24280, 24450, 24530, 24610],
            borderColor: '#00C853',
            gradientColor: 'rgba(0, 200, 83, 0.15)'
        },
        banknifty: {
            label: 'Bank Nifty Index (Past 30 Days)',
            data: [49800, 50120, 49950, 50300, 50700, 50550, 50900, 51340, 51100, 51600, 51800, 51500, 52100, 52400, 52200, 52650, 52800, 52450, 52900, 53250, 53050, 53500, 53900, 53600, 54100, 54300, 54050, 54500, 54800, 55120],
            borderColor: '#00C853',
            gradientColor: 'rgba(0, 200, 83, 0.15)'
        },
        reliance: {
            label: 'RELIANCE (Price Action Study)',
            data: [2850, 2870, 2860, 2890, 2920, 2910, 2940, 2975, 2960, 2990, 3010, 2995, 3030, 3050, 3040, 3070, 3090, 3075, 3110, 3140, 3125, 3160, 3185, 3170, 3210, 3230, 3215, 3250, 3275, 3290],
            borderColor: '#FF3D57',
            gradientColor: 'rgba(255, 61, 87, 0.15)'
        }
    };

    function initChart(key = 'nifty') {
        if (!ctx) return;
        
        if (currentChart) {
            currentChart.destroy();
        }

        const dataInfo = chartDatasets[key];
        const canvasCtx = ctx.getContext('2d');
        
        // Create dynamic gradient for chart area background fill
        const gradient = canvasCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, dataInfo.gradientColor);
        gradient.addColorStop(1, 'rgba(13, 17, 23, 0)');

        const labels = Array.from({length: dataInfo.data.length}, (_, i) => `Day ${i + 1}`);

        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: dataInfo.label,
                    data: dataInfo.data,
                    borderColor: dataInfo.borderColor,
                    borderWidth: 3,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: dataInfo.borderColor,
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#8B949E',
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#161B22',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Value: ₹${context.raw.toLocaleString('en-IN')}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.03)',
                        },
                        ticks: {
                            color: '#8B949E',
                            font: { family: 'Inter', size: 10 }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.03)',
                        },
                        ticks: {
                            color: '#8B949E',
                            font: { family: 'Inter', size: 10 }
                        }
                    }
                }
            }
        });
    }

    // Initialize Chart on Load
    initChart('nifty');

    // Chart Tab Toggles
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            chartTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const dataKey = tab.getAttribute('data-chart');
            initChart(dataKey);
        });
    });

    // 5. Position Sizing Calculator
    const inputBalance = document.getElementById('accountBalance');
    const inputRisk = document.getElementById('riskPercent');
    const riskValText = document.getElementById('riskValText');
    const inputEntry = document.getElementById('entryPrice');
    const inputStopLoss = document.getElementById('stopLoss');
    
    // Outputs
    const outTotalRisk = document.getElementById('totalRiskINR');
    const outPositionSize = document.getElementById('positionSize');
    const outTotalCapital = document.getElementById('requiredCapital');
    const outTarget = document.getElementById('targetINR');

    function calculatePositionSizing() {
        if (!inputBalance || !inputRisk || !inputEntry || !inputStopLoss) return;

        const balance = parseFloat(inputBalance.value) || 0;
        const riskPercent = parseFloat(inputRisk.value) || 1;
        const entry = parseFloat(inputEntry.value) || 0;
        const stopLoss = parseFloat(inputStopLoss.value) || 0;

        // Update range display percentage text
        if (riskValText) {
            riskValText.textContent = `${riskPercent}%`;
        }

        if (balance <= 0 || entry <= 0 || stopLoss <= 0 || stopLoss >= entry) {
            outTotalRisk.textContent = '₹0.00';
            outPositionSize.textContent = '0 Shares';
            outTotalCapital.textContent = '₹0.00';
            outTarget.textContent = '₹0.00';
            return;
        }

        // Position sizing calculations
        const totalRisk = balance * (riskPercent / 100);
        const stopLossDistance = entry - stopLoss;
        const sharesToBuy = Math.floor(totalRisk / stopLossDistance);
        const capitalRequired = sharesToBuy * entry;
        
        // Target calculation based on a 1:2 Risk to Reward setup
        const targetValue = entry + (stopLossDistance * 2);

        // Display results
        outTotalRisk.textContent = `₹${totalRisk.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
        outPositionSize.textContent = `${sharesToBuy.toLocaleString('en-IN')} Shares`;
        outTotalCapital.textContent = `₹${capitalRequired.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
        outTarget.textContent = `₹${targetValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    }

    // Add listeners for dynamic changes
    if (inputBalance) {
        [inputBalance, inputRisk, inputEntry, inputStopLoss].forEach(input => {
            input.addEventListener('input', calculatePositionSizing);
        });
        calculatePositionSizing(); // Initial calculation
    }

    // 6. Testimonials Carousel
    const testimonials = document.querySelectorAll('.testimonial-card');
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    let currentIndex = 0;
    const totalTestimonials = testimonials.length;

    function updateCarouselPosition() {
        if (!track) return;
        const translateVal = -currentIndex * 100;
        track.style.transform = `translateX(${translateVal}%)`;
    }

    if (nextBtn && prevBtn && track) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            updateCarouselPosition();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
            updateCarouselPosition();
        });

        // Optional autoplay
        let autoPlayTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            updateCarouselPosition();
        }, 6000);

        // Pause autoplay on mouse hover
        const carouselArea = document.querySelector('.testimonials-wrapper');
        if (carouselArea) {
            carouselArea.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
            carouselArea.addEventListener('mouseleave', () => {
                autoPlayTimer = setInterval(() => {
                    currentIndex = (currentIndex + 1) % totalTestimonials;
                    updateCarouselPosition();
                }, 6000);
            });
        }
    }

    // 7. Modals: Course Details & Google Meet/Calendly Simulation
    const syllabusModal = document.getElementById('syllabusModal');
    const bookingModal = document.getElementById('bookingModal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    
    // Modal Syllabus Contents Definition
    const courseSyllabi = {
        ta: {
            title: 'Technical Analysis Masterclass',
            duration: '6 Weeks Program',
            items: [
                { module: 'Module 1: Market Basics & Charts', desc: 'Understanding candlestick construction, basic line charts, bar charts, and logging platforms.' },
                { module: 'Module 2: Market Structures', desc: 'Trend Identification (Higher Highs, Lower Lows), Support and Resistance mapping, Trendlines, and Channels.' },
                { module: 'Module 3: Technical Indicators', desc: 'Smarter application of Moving Averages, RSI, MACD, and Bollinger Bands to verify momentum.' },
                { module: 'Module 4: Advanced Chart Patterns', desc: 'Trading Double Tops/Bottoms, Head & Shoulders, Flags, Pennants, and Wedges.' },
                { module: 'Module 5: Volume Profile analysis', desc: 'Volume price relationship, breakout volume confirmation, and institutional volume patterns.' }
            ]
        },
        pa: {
            title: 'Price Action Trading Program',
            duration: '8 Weeks Program',
            items: [
                { module: 'Module 1: Price Action Psychology', desc: 'The psychology behind price charts. Market cycles (Accumulation, Markup, Distribution, Markdown).' },
                { module: 'Module 2: Candlestick Patterns in Depth', desc: 'Trading Pin Bars, Engulfing bars, Inside bars, and Morning/Evening Stars at key zones.' },
                { module: 'Module 3: Supply & Demand Zones', desc: 'Mapping institutional buying/selling zones. Distinguishing supply/demand from simple support/resistance.' },
                { module: 'Module 4: Breakout & Reversal Strategies', desc: 'Spotting high-probability breakouts, avoiding bull/bear traps, and executing pullback entries.' },
                { module: 'Module 5: Advanced Fibonacci & Harmonic Trading', desc: 'Utilizing Fibonacci retracements and projections to identify targets and reversal areas.' }
            ]
        },
        si: {
            title: 'Smart Investor Program',
            duration: '4 Weeks Program',
            items: [
                { module: 'Module 1: Introduction to Wealth Creation', desc: 'Understanding inflation, compounding, asset classes, and establishing long-term financial goals.' },
                { module: 'Module 2: Fundamental Analysis Basics', desc: 'Reading Balance Sheets, Profit & Loss Statements, key ratios (P/E, ROCE, Debt to Equity).' },
                { module: 'Module 3: Portfolio Management Frameworks', desc: 'Diversification strategies, asset allocation, and rebalancing concepts based on age and goals.' },
                { module: 'Module 4: Mutual Funds Mastery', desc: 'Direct vs Regular funds, Active vs Passive (Index) investing, Debt funds, and SIP scheduling.' },
                { module: 'Module 5: Tax Planning & Estate planning', desc: 'Optimizing taxes on investments, ELSS funds, capital gains tax rules, and long-term tax structures.' }
            ]
        }
    };

    // Open Course Syllabus Modal
    const btnViewDetails = document.querySelectorAll('.btn-view-details');
    btnViewDetails.forEach(btn => {
        btn.addEventListener('click', () => {
            const courseKey = btn.getAttribute('data-course');
            const data = courseSyllabi[courseKey];
            if (!data || !syllabusModal) return;

            // Fill Modal
            syllabusModal.querySelector('.modal-title').textContent = data.title;
            syllabusModal.querySelector('.modal-subtitle').textContent = data.duration;
            
            const listContainer = syllabusModal.querySelector('.syllabus-list');
            listContainer.innerHTML = ''; // clear old list
            
            data.items.forEach(item => {
                const li = document.createElement('div');
                li.className = 'syllabus-item';
                li.innerHTML = `
                    <div class="syllabus-item-header">${item.module}</div>
                    <div class="syllabus-item-desc">${item.desc}</div>
                `;
                listContainer.appendChild(li);
            });

            syllabusModal.classList.add('active');
        });
    });

    const checkoutModal = document.getElementById('checkoutModal');

    // Close Modals
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (syllabusModal) syllabusModal.classList.remove('active');
            if (bookingModal) bookingModal.classList.remove('active');
            if (checkoutModal) checkoutModal.classList.remove('active');
        });
    });

    // Close on overlay click
    [syllabusModal, bookingModal, checkoutModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // 8. Booking Form Submission Handling (Calendly Live Embed)
    const bookingForm = document.getElementById('consultationForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values
            const name = document.getElementById('fullName').value || 'Trader';
            const email = document.getElementById('email').value || 'your email';
            
            if (bookingModal) {
                // Configure booking confirmation details
                const nameEl = bookingModal.querySelector('.student-scheduled-name');
                if (nameEl) nameEl.textContent = name;
                
                // Show booking scheduler popup modal
                bookingModal.classList.add('active');
                
                // Load Calendly Widget dynamically
                const calendarContainer = document.getElementById('calendlyEmbedContainer');
                if (calendarContainer) {
                    // Show a quick loading state first
                    calendarContainer.innerHTML = `
                        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; width:100%; gap:0.8rem;">
                            <i class="fa-solid fa-spinner fa-spin" style="color: var(--color-primary); font-size:1.8rem;"></i>
                            <span style="font-size:0.9rem; color: var(--color-text-secondary);">Loading Calendly...</span>
                        </div>
                    `;
                    
                    setTimeout(() => {
                        if (window.Calendly) {
                            calendarContainer.innerHTML = ''; // clear loading state
                            window.Calendly.initInlineWidget({
                                url: 'https://calendly.com/tradewithpiyushgarg/30min',
                                parentElement: calendarContainer,
                                prefill: {
                                    name: name,
                                    email: email
                                },
                                pageSettings: {
                                    backgroundColor: '0d1117',
                                    textColor: 'ffffff',
                                    primaryColor: '00c853'
                                }
                            });
                        } else {
                            // Fallback embed iframe if Calendly script hasn't finished loading
                            calendarContainer.innerHTML = `<iframe src="https://calendly.com/tradewithpiyushgarg/30min?embed_domain=${window.location.hostname}&embed_type=Inline&background_color=0d1117&text_color=ffffff&primary_color=00c853&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}" width="100%" height="100%" frameborder="0"></iframe>`;
                        }
                    }, 100);
                }
                
                bookingForm.reset();
            }
        });
    }

    // 9. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // Card Hover Spotlight Visual Effect
    const cards = document.querySelectorAll('.feature-card, .course-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 10. Course Enrollment Checkout logic
    const btnEnrollNow = document.querySelectorAll('.btn-enroll-now');
    const checkoutCourseTitle = document.getElementById('checkoutCourseTitle');
    const summaryCourseName = document.getElementById('summaryCourseName');
    const checkoutQRCode = document.getElementById('checkoutQRCode');
    const mobileUPILink = document.getElementById('mobileUPILink');
    const btnConfirmPayment = document.getElementById('btnConfirmPayment');
    const checkoutUTR = document.getElementById('checkoutUTR');

    if (checkoutUTR) {
        checkoutUTR.addEventListener('input', (e) => {
            // Restrict input field to digits only
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    if (btnEnrollNow.length > 0 && checkoutModal) {
        btnEnrollNow.forEach(btn => {
            btn.addEventListener('click', () => {
                const courseTitle = btn.getAttribute('data-course-title') || 'Premium Course';
                
                // Update text content in modal
                if (checkoutCourseTitle) checkoutCourseTitle.textContent = courseTitle;
                if (summaryCourseName) summaryCourseName.textContent = courseTitle;
                
                // Clear UTR field and reset border color
                if (checkoutUTR) {
                    checkoutUTR.value = '';
                    checkoutUTR.style.borderColor = '#FF3D57';
                }
                
                // Generate UPI payment URL
                const cleanCourseTitle = courseTitle.replace(/[^a-zA-Z0-9\s]/g, '');
                const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=2499&cu=INR&tn=${encodeURIComponent('Payment for ' + cleanCourseTitle)}`;
                
                // Generate QR Code dynamically via QR Server API
                if (checkoutQRCode) {
                    checkoutQRCode.innerHTML = `
                        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; width:100%;">
                            <i class="fa-solid fa-spinner fa-spin" style="color:var(--color-primary); font-size:1.5rem;"></i>
                        </div>
                    `;
                    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=5&data=${encodeURIComponent(upiUrl)}`;
                    
                    // Preload QR image
                    const img = new Image();
                    img.src = qrApiUrl;
                    img.onload = () => {
                        checkoutQRCode.innerHTML = `<img src="${qrApiUrl}" alt="Scan to Pay ₹2499" />`;
                    };
                    img.onerror = () => {
                        checkoutQRCode.innerHTML = `<div style="text-align:center; font-size:0.8rem; color:var(--color-secondary);">Failed to load QR. Please use mobile pay.</div>`;
                    };
                }
                
                // Configure mobile UPI pay link
                if (mobileUPILink) {
                    mobileUPILink.href = upiUrl;
                    
                    // Device detection to show mobile pay button
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    if (isMobile) {
                        mobileUPILink.style.display = 'inline-flex';
                    } else {
                        mobileUPILink.style.display = 'none';
                    }
                }
                
                // Configure WhatsApp confirmation button
                if (btnConfirmPayment) {
                    btnConfirmPayment.onclick = () => {
                        const utrVal = checkoutUTR ? checkoutUTR.value.trim() : '';
                        
                        // Smart validation for UTR structure
                        const isValidUTR = (utr) => {
                            // 1. Must be exactly 12 digits
                            if (!/^\d{12}$/.test(utr)) return false;
                            
                            // 2. Recent Indian UPI UTRs must start with 4 (2024), 5 (2025), or 6 (2026)
                            const firstDigit = utr.charAt(0);
                            if (!['4', '5', '6'].includes(firstDigit)) return false;
                            
                            // 3. Block all identical repeating digits (e.g. 555555555555)
                            if (/^(\d)\1{11}$/.test(utr)) return false;
                            
                            // 4. Block common sequential ranges (e.g. 123456789012, 987654321098)
                            const sequentialAsc = "0123456789012345";
                            const sequentialDesc = "9876543210987654";
                            if (sequentialAsc.includes(utr) || sequentialDesc.includes(utr)) return false;
                            
                            return true;
                        };
                        
                        if (!isValidUTR(utrVal)) {
                            alert("Verification Failed: The entered Transaction Ref ID / UTR number appears to be invalid or fake. Please check your UPI app receipt and enter the correct 12-digit UTR.");
                            if (checkoutUTR) {
                                checkoutUTR.style.borderColor = "#FF3D57";
                                checkoutUTR.focus();
                            }
                            return;
                        }
                        
                        // Restore red/border state if valid
                        if (checkoutUTR) {
                            checkoutUTR.style.borderColor = "var(--color-border)";
                        }

                        const msg = `Hey Bhaiya I have Done the payment for ${courseTitle}, Transaction ID/UTR: ${utrVal} and i will send you the screenshot as well for the payment proof`;
                        const whatsAppUrl = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;
                        
                        window.open(whatsAppUrl, '_blank');
                        checkoutModal.classList.remove('active');
                    };
                }
                
                // Show modal
                checkoutModal.classList.add('active');
            });
        });
    }
});
