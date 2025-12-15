// Menjalankan semua script setelah DOM (HTML) selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LOGIKA NAVBAR (Berlaku di semua halaman) ---
    const header = document.getElementById("main-header");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");
    
    // Cek apakah elemen header ada
    if (header) {
        // Logika untuk mengubah background navbar saat di-scroll
        const handleScroll = () => {
            // Cek apakah halaman memiliki hero section (homepage) atau catalog hero (halaman lain)
            const heroSection = document.getElementById("hero") || document.getElementById("catalog-hero");
            
            // Jika tidak ada hero section (misal: halaman kontak), paksa navbar jadi putih
            if (!heroSection) {
                header.classList.add("scrolled");
                return;
            }

            // Jika ada hero, ubah berdasarkan posisi scroll
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                // Hanya hapus 'scrolled' jika kita berada di halaman dengan hero
                header.classList.remove("scrolled");
            }
        };

        // Panggil sekali saat load untuk cek posisi awal (terutama jika halaman di-refresh di tengah)
        handleScroll();
        // Panggil setiap kali user scroll
        window.addEventListener("scroll", handleScroll);
    }

    // Cek apakah tombol menu mobile ada
    if (mobileToggle && navMenu) {
        // Logika untuk toggle menu mobile
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            // Ubah ikon hamburger menjadi X dan sebaliknya
            const icon = mobileToggle.querySelector("i");
            if (icon.classList.contains("ph-list")) {
                icon.classList.remove("ph-list");
                icon.classList.add("ph-x");
            } else {
                icon.classList.remove("ph-x");
                icon.classList.add("ph-list");
            }
        });
    }

    // --- 2. LOGIKA FILTER HALAMAN KATALOG ---
    const searchInput = document.getElementById("search-input");
    
    // Cek apakah kita berada di halaman katalog (dengan mencari search-input)
    if (searchInput) {
        const categorySelect = document.getElementById("category-select");
        const locationSelect = document.getElementById("location-select");
        const resetButton = document.getElementById("reset-button");
        const packageGrid = document.getElementById("package-grid");
        const allPackages = packageGrid.querySelectorAll(".package-card");
        const noResultsMessage = document.getElementById("no-results-message");

        const filterPackages = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const categoryFilter = categorySelect.value.toLowerCase();
            const locationFilter = locationSelect.value.toLowerCase();
            
            let visibleCount = 0;

            allPackages.forEach(card => {
                const name = card.dataset.name.toLowerCase();
                const category = card.dataset.category.toLowerCase();
                const location = card.dataset.location.toLowerCase();

                // Logika pencocokan
                const matchSearch = name.includes(searchTerm) || category.includes(searchTerm) || location.includes(searchTerm);
                const matchCategory = categoryFilter === "" || category === categoryFilter;
                const matchLocation = locationFilter === "" || location.includes(locationFilter); // 'Jakarta' cocok 'Jakarta Selatan'

                // Tampilkan atau sembunyikan card
                if (matchSearch && matchCategory && matchLocation) {
                    card.classList.remove("hidden");
                    visibleCount++;
                } else {
                    card.classList.add("hidden");
                }
            });

            // Tampilkan atau sembunyikan pesan "Tidak Ada Hasil"
            if (visibleCount === 0) {
                noResultsMessage.classList.remove("hidden");
            } else {
                noResultsMessage.classList.add("hidden");
            }
        };

        // Tambahkan event listeners
        searchInput.addEventListener("input", filterPackages);
        categorySelect.addEventListener("change", filterPackages);
        locationSelect.addEventListener("change", filterPackages);

        // Logika Tombol Reset
        resetButton.addEventListener("click", () => {
            searchInput.value = "";
            categorySelect.value = ""; // Kembali ke "Semua Kategori"
            locationSelect.value = ""; // Kembali ke "Semua Lokasi"
            
            // Mengatur ulang placeholder dropdown (opsional, tapi bagus)
            categorySelect.querySelector('option[disabled]').selected = true;
            locationSelect.querySelector('option[disabled]').selected = true;

            filterPackages(); // Jalankan filter untuk menampilkan semua
        });
    }

    // --- (BARU) 3. LOGIKA HALAMAN BOOKING ---
    const bookingDetailsContainer = document.querySelector(".booking-package-details");

    // Cek apakah kita berada di halaman booking
    if (bookingDetailsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedPackageName = urlParams.get('paket'); // Mengambil nama paket dari URL
        
        const noPackageMessage = document.getElementById("no-package-selected");
        
        let packageFound = false;

        if (selectedPackageName) {
            const allPackageCards = bookingDetailsContainer.querySelectorAll(".package-card");
            
            allPackageCards.forEach(card => {
                if (card.dataset.name === selectedPackageName) {
                    card.classList.remove("hidden"); // Tampilkan card yang cocok
                    packageFound = true;
                } else {
                    card.classList.add("hidden"); // Sembunyikan yang lain
                }
            });
        }

        // Jika tidak ada parameter di URL, atau parameter tidak cocok dengan card manapun
        if (!packageFound) {
            noPackageMessage.classList.remove("hidden"); // Tampilkan pesan "Silakan pilih paket"
        }
    }
    
    // Trik untuk placeholder input tanggal
    const dateInput = document.getElementById('tanggal');
    if (dateInput) {
        dateInput.addEventListener('focus', (e) => e.target.type = 'date');
        dateInput.addEventListener('blur', (e) => {
            if (!e.target.value) {
                e.target.type = 'text';
            }
        });
    }

});

