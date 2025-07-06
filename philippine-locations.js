const BASE_URL = "https://psgc.gitlab.io/api";

// Populate regions
async function populateRegions() {
    const res = await fetch(`${BASE_URL}/regions/`);
    const regions = await res.json();
    const select = document.getElementById('region');
    select.innerHTML = '<option value="">Select Region</option>';
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region.code;
        option.textContent = region.name;
        select.appendChild(option);
    });
}

// Populate provinces
async function populateProvinces(regionCode) {
    const res = await fetch(`${BASE_URL}/regions/${regionCode}/provinces/`);
    const provinces = await res.json();
    const select = document.getElementById('province');
    select.innerHTML = '<option value="">Select Province</option>';
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.code;
        option.textContent = province.name;
        select.appendChild(option);
    });
}

// Populate cities/municipalities
async function populateMunicipalities(provinceCode) {
    const res = await fetch(`${BASE_URL}/provinces/${provinceCode}/cities-municipalities/`);
    const cities = await res.json();
    const select = document.getElementById('district');
    select.innerHTML = '<option value="">Select Municipality</option>';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.code;
        option.textContent = city.name;
        select.appendChild(option);
    });
}

// Populate barangays
async function populateBarangays(municipalityCode) {
    const res = await fetch(`${BASE_URL}/cities-municipalities/${municipalityCode}/barangays/`);
    const barangays = await res.json();
    const select = document.getElementById('barangay');
    select.innerHTML = '<option value="">Select Barangay</option>';
    barangays.forEach(barangay => {
        const option = document.createElement('option');
        option.value = barangay.code;
        option.textContent = barangay.name;
        select.appendChild(option);
    });
}

// Event listeners
document.getElementById('region').addEventListener('change', function() {
    populateProvinces(this.value);
    document.getElementById('province').innerHTML = '<option value="">Select Province</option>';
    document.getElementById('district').innerHTML = '<option value="">Select Municipality</option>';
    document.getElementById('barangay').innerHTML = '<option value="">Select Barangay</option>';
});

document.getElementById('province').addEventListener('change', function() {
    populateMunicipalities(this.value);
    document.getElementById('district').innerHTML = '<option value="">Select Municipality</option>';
    document.getElementById('barangay').innerHTML = '<option value="">Select Barangay</option>';
});

document.getElementById('district').addEventListener('change', function() {
    populateBarangays(this.value);
    document.getElementById('barangay').innerHTML = '<option value="">Select Barangay</option>';
});

// On load
document.addEventListener('DOMContentLoaded', populateRegions);