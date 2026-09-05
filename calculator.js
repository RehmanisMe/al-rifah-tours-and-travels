/* ========================================
   AL-RIFAH TOURS - Umrah Cost Calculator
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // ========================================
    // HEADER SCROLL
    // ========================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ========================================
    // QUANTITY CONTROLS (+/- buttons)
    // ========================================
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const min = parseInt(input.getAttribute('min')) || 0;
            const max = parseInt(input.getAttribute('max')) || 99;
            let value = parseInt(input.value) || 0;

            if (this.classList.contains('plus') && value < max) {
                value++;
            } else if (this.classList.contains('minus') && value > min) {
                value--;
            }

            input.value = value;
        });
    });

    // ========================================
    // RANGE SLIDER
    // ========================================
    const laundrySlider = document.getElementById('laundry');
    const laundryValue = document.getElementById('laundryValue');

    if (laundrySlider) {
        laundrySlider.addEventListener('input', function () {
            laundryValue.textContent = this.value;
        });
    }

    // ========================================
    // AIR TICKETS TOGGLE
    // ========================================
    const airTicketRadios = document.querySelectorAll('input[name="airTickets"]');
    const airTicketDetails = document.getElementById('airTicketDetails');

    airTicketRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'yes') {
                airTicketDetails.style.display = 'block';
            } else {
                airTicketDetails.style.display = 'none';
            }
        });
    });

    // ========================================
    // CALCULATION LOGIC
    // ========================================
    const calculateBtn = document.getElementById('calculateBtn');
    const calcResults = document.getElementById('calcResults');
    const recalculateBtn = document.getElementById('recalculateBtn');

    calculateBtn.addEventListener('click', function () {
        // Validate lead name
        const leadName = document.getElementById('leadPaxName').value.trim();
        if (!leadName) {
            alert('Please enter the Lead Pax Name.');
            document.getElementById('leadPaxName').focus();
            return;
        }

        // Get form values
        const adults = parseInt(document.getElementById('adults').value) || 1;
        const children = parseInt(document.getElementById('children').value) || 0;
        const infants = parseInt(document.getElementById('infants').value) || 0;
        const sharing = parseInt(document.querySelector('input[name="sharing"]:checked').value);
        const visa = parseInt(document.getElementById('visa').value);
        const transport = parseInt(document.getElementById('transport').value);
        const makkahHotel = parseInt(document.getElementById('makkahHotel').value);
        const makkahNights = parseInt(document.getElementById('makkahNights').value) || 1;
        const madinahHotel = parseInt(document.getElementById('madinahHotel').value);
        const madinahNights = parseInt(document.getElementById('madinahNights').value) || 1;
        const laundryCount = parseInt(document.getElementById('laundry').value) || 0;

        // Calculate checkbox totals
        const spiritualTotal = getCheckboxTotal('spiritual');
        const comfortTotal = getCheckboxTotal('comfort');
        const premiumTotal = getCheckboxTotal('premium');

        // Air fare
        let airfare = 0;
        const airTicketSelected = document.querySelector('input[name="airTickets"]:checked').value;
        if (airTicketSelected === 'yes') {
            const airline = parseInt(document.getElementById('airline').value) || 0;
            const airport = parseInt(document.getElementById('airport').value) || 0;
            airfare = airline + airport;
        }

        // ========================================
        // FORMULAS (matching original calculator)
        // ========================================

        // Transportation per person
        const transportPerPerson = transport / adults;

        // Makkah hotel per person: rate × nights ÷ sharing
        const makkahPerPerson = (makkahHotel * makkahNights) / sharing;

        // Madinah hotel per person: rate × nights ÷ sharing
        const madinahPerPerson = (madinahHotel * madinahNights) / sharing;

        // Full board meals: total nights × ₹2,000/night
        const totalNights = makkahNights + madinahNights;
        const mealsCost = totalNights * 2000;

        // Laundry: count × ₹1,000
        const laundryCost = laundryCount * 1000;

        // Per adult cost
        const perAdultCost = visa + transportPerPerson + makkahPerPerson + madinahPerPerson + mealsCost + laundryCost + spiritualTotal + comfortTotal + premiumTotal + airfare;

        // Total: (per adult × adults) + children + infants
        const childrenCost = children * 69999;
        const infantsCost = infants * 29999;
        const totalCost = (perAdultCost * adults) + childrenCost + infantsCost;

        // ========================================
        // DISPLAY RESULTS
        // ========================================
        document.getElementById('resultVisa').textContent = formatCurrency(visa);
        document.getElementById('resultTransport').textContent = formatCurrency(transportPerPerson);
        document.getElementById('resultMakkah').textContent = formatCurrency(makkahPerPerson);
        document.getElementById('resultMadinah').textContent = formatCurrency(madinahPerPerson);
        document.getElementById('resultMeals').textContent = formatCurrency(mealsCost);
        document.getElementById('resultLaundry').textContent = formatCurrency(laundryCost);
        document.getElementById('resultSpiritual').textContent = formatCurrency(spiritualTotal);
        document.getElementById('resultComfort').textContent = formatCurrency(comfortTotal);
        document.getElementById('resultPremium').textContent = formatCurrency(premiumTotal);
        document.getElementById('resultAirfare').textContent = formatCurrency(airfare);
        document.getElementById('resultPerAdult').textContent = formatCurrency(perAdultCost);

        // Show/hide children and infant rows
        const childRow = document.getElementById('childRow');
        const infantRow = document.getElementById('infantRow');

        if (children > 0) {
            childRow.style.display = 'flex';
            document.getElementById('resultChildren').textContent = formatCurrency(childrenCost) + ` (${children} × ₹69,999)`;
        } else {
            childRow.style.display = 'none';
        }

        if (infants > 0) {
            infantRow.style.display = 'flex';
            document.getElementById('resultInfants').textContent = formatCurrency(infantsCost) + ` (${infants} × ₹29,999)`;
        } else {
            infantRow.style.display = 'none';
        }

        document.getElementById('resultTotal').textContent = formatCurrency(totalCost);

        // Show results
        calcResults.style.display = 'block';

        // Scroll to results
        setTimeout(() => {
            calcResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });

    // Recalculate button
    if (recalculateBtn) {
        recalculateBtn.addEventListener('click', function () {
            calcResults.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    function getCheckboxTotal(name) {
        let total = 0;
        document.querySelectorAll(`input[name="${name}"]:checked`).forEach(cb => {
            total += parseInt(cb.value) || 0;
        });
        return total;
    }

    function formatCurrency(amount) {
        return '₹' + Math.round(amount).toLocaleString('en-IN');
    }

});
