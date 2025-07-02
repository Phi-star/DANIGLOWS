document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Admin check
    const isAdmin = currentUser.email === 'admin@gmail.com';
    if (isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    }

    // Display user info
    document.getElementById('username-display').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('balance-amount').textContent = `$${currentUser.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('portfolio-value').textContent = `$${currentUser.portfolioValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('total-profit').textContent = `$${(currentUser.portfolioValue - currentUser.balance).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('active-investments').textContent = currentUser.investments.length;
    document.getElementById('total-deposits').textContent = `$${currentUser.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Set current date
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Profile dropdown toggle
    const profileToggle = document.querySelector('.profile-toggle');
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    profileToggle.addEventListener('click', function() {
        profileDropdown.classList.toggle('show');
        this.querySelector('i').classList.toggle('fa-chevron-down');
        this.querySelector('i').classList.toggle('fa-chevron-up');
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Initialize charts
    const btcCtx = document.getElementById('btcChart').getContext('2d');
    const ethCtx = document.getElementById('ethChart').getContext('2d');

    // Generate random chart data
    function generateChartData(basePrice, volatility, points) {
        const data = [];
        let currentPrice = basePrice;
        
        for (let i = 0; i < points; i++) {
            const changePercent = (Math.random() * 2 * volatility) - volatility;
            currentPrice = currentPrice * (1 + changePercent / 100);
            data.push(currentPrice);
        }
        
        return data;
    }

    const btcData = generateChartData(63427, 3, 30);
    const ethData = generateChartData(3412, 4, 30);

    const btcChart = new Chart(btcCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => i + 1),
            datasets: [{
                label: 'BTC/USD',
                data: btcData,
                borderColor: '#64ffda',
                backgroundColor: 'rgba(100, 255, 218, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.y.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });

    const ethChart = new Chart(ethCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => i + 1),
            datasets: [{
                label: 'ETH/USD',
                data: ethData,
                borderColor: '#1e90ff',
                backgroundColor: 'rgba(30, 144, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.y.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });

    // Time filter buttons
    document.querySelectorAll('.time-filter').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelector('.time-filter.active').classList.remove('active');
            this.classList.add('active');
            
            // In a real app, we would fetch new data based on the time filter
            // For this demo, we'll just regenerate random data
            const newBtcData = generateChartData(63427, 3, 30);
            const newEthData = generateChartData(3412, 4, 30);
            
            btcChart.data.datasets[0].data = newBtcData;
            ethChart.data.datasets[0].data = newEthData;
            
            btcChart.update();
            ethChart.update();
        });
    });

    // Investment buttons
    const investmentModal = document.getElementById('investment-modal');
    const investButtons = document.querySelectorAll('.invest-btn');
    const cancelInvestBtn = document.getElementById('cancel-invest');
    const confirmInvestBtn = document.getElementById('confirm-invest');

    investButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseFloat(this.getAttribute('data-amount'));
            const plan = this.getAttribute('data-plan');
            
            // Check if user has enough balance
            if (amount > currentUser.balance) {
                alert('Insufficient balance. Please deposit more funds.');
                return;
            }
            
            // Set modal content based on plan
            let planName, dailyReturn, duration;
            
            switch(plan) {
                case 'starter':
                    planName = 'Starter Plan';
                    dailyReturn = '5%';
                    duration = '30 Days';
                    break;
                case 'premium':
                    planName = 'Premium Plan';
                    dailyReturn = '7%';
                    duration = '45 Days';
                    break;
                case 'advanced':
                    planName = 'Advanced Plan';
                    dailyReturn = '9%';
                    duration = '60 Days';
                    break;
                case 'professional':
                    planName = 'Professional Plan';
                    dailyReturn = '11%';
                    duration = '90 Days';
                    break;
                case 'executive':
                    planName = 'Executive Plan';
                    dailyReturn = '13%';
                    duration = '120 Days';
                    break;
                case 'vip':
                    planName = 'VIP Plan';
                    dailyReturn = '15%';
                    duration = '180 Days';
                    break;
            }
            
            const dailyReturnAmount = amount * parseFloat(dailyReturn) / 100;
            const totalReturn = dailyReturnAmount * parseInt(duration);
            
            document.getElementById('modal-plan-name').textContent = planName;
            document.getElementById('modal-invest-amount').textContent = `$${amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            document.getElementById('modal-daily-return').textContent = `${dailyReturn} ($${dailyReturnAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/day)`;
            document.getElementById('modal-duration').textContent = duration;
            document.getElementById('modal-total-return').textContent = `$${totalReturn.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            
            // Store plan data in confirm button
            confirmInvestBtn.setAttribute('data-amount', amount);
            confirmInvestBtn.setAttribute('data-plan', plan);
            
            // Show modal
            investmentModal.classList.add('active');
        });
    });

    // Close modal
    document.querySelector('.modal-close').addEventListener('click', function() {
        investmentModal.classList.remove('active');
    });

    cancelInvestBtn.addEventListener('click', function() {
        investmentModal.classList.remove('active');
    });

    // Confirm investment
    confirmInvestBtn.addEventListener('click', function() {
        const amount = parseFloat(this.getAttribute('data-amount'));
        const plan = this.getAttribute('data-plan');
        
        // In a real app, this would redirect to payment processing
        // For this demo, we'll simulate the investment
        
        // Update user data
        currentUser.balance -= amount;
        currentUser.investments.push({
            id: Date.now().toString(),
            plan: plan,
            amount: amount,
            date: new Date().toISOString(),
            status: 'active'
        });
        
        // Update session storage
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update all users in localStorage
        const users = JSON.parse(localStorage.getItem('garleyIncomeRevenueUsers'));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('garleyIncomeRevenueUsers', JSON.stringify(users));
        }
        
        // Close modal
        investmentModal.classList.remove('active');
        
        // Show success message
        alert(`Successfully invested $${amount.toLocaleString()} in ${plan} plan!`);
        
        // Refresh page to update values
        window.location.reload();
    });

    // Admin panel functionality
    if (isAdmin) {
        const adminModal = document.getElementById('admin-modal');
        const adminTabs = document.querySelectorAll('.admin-tab');
        const adminTabContents = document.querySelectorAll('.admin-tab-content');
        
        // Show admin panel
        document.querySelector('.admin-only a').addEventListener('click', function(e) {
            e.preventDefault();
            adminModal.classList.add('active');
            loadAdminData();
        });
        
        // Close admin modal
        adminModal.querySelector('.modal-close').addEventListener('click', function() {
            adminModal.classList.remove('active');
        });
        
        // Admin tab switching
        adminTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                adminTabs.forEach(t => t.classList.remove('active'));
                adminTabContents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
        
        // Load admin data
        function loadAdminData() {
            const users = JSON.parse(localStorage.getItem('garleyIncomeRevenueUsers')) || [];
            const usersTable = document.getElementById('users-table-body');
            const investmentsTable = document.getElementById('investments-table-body');
            const transactionsTable = document.getElementById('transactions-table-body');
            
            // Clear tables
            usersTable.innerHTML = '';
            investmentsTable.innerHTML = '';
            transactionsTable.innerHTML = '';
            
            // Populate users table
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id.slice(-6)}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>$${user.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td><span class="status active">Active</span></td>
                    <td>
                        <button class="admin-action view"><i class="fas fa-eye"></i></button>
                        <button class="admin-action edit"><i class="fas fa-edit"></i></button>
                    </td>
                `;
                usersTable.appendChild(row);
            });
            
            // Populate investments table
            users.forEach(user => {
                user.investments.forEach(investment => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${investment.id.slice(-6)}</td>
                        <td>${user.name}</td>
                        <td>${investment.plan}</td>
                        <td>$${investment.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${new Date(investment.date).toLocaleDateString()}</td>
                        <td>${new Date(new Date(investment.date).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                        <td><span class="status ${investment.status}">${investment.status}</span></td>
                    `;
                    investmentsTable.appendChild(row);
                });
            });
            
            // Populate transactions table (simulated data)
            users.forEach(user => {
                for (let i = 0; i < 3; i++) {
                    const types = ['deposit', 'withdrawal', 'investment', 'profit'];
                    const statuses = ['completed', 'pending', 'failed'];
                    const amount = Math.random() * 10000 + 1000;
                    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${Math.floor(Math.random() * 1000000)}</td>
                        <td>${user.name}</td>
                        <td>${types[Math.floor(Math.random() * types.length)]}</td>
                        <td>$${amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${date.toLocaleDateString()}</td>
                        <td><span class="status ${statuses[Math.floor(Math.random() * statuses.length)]}">${statuses[Math.floor(Math.random() * statuses.length)]}</span></td>
                    `;
                    transactionsTable.appendChild(row);
                }
            });
        }
    }

    // Close modals when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle (would need a button in header)
    // This is just a placeholder for mobile responsiveness
});
