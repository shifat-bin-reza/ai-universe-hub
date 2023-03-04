let globalData;

// Load Data
const loadData = async (dataLimit) => {
    toggleSpinner(true);
    const url = `https://openapi.programming-hero.com/api/ai/tools`;
    const res = await fetch(url);
    const data = await res.json();
    displayData(data.data.tools, dataLimit);
}

// Load Data By ID
const loadDataByID = async (id) => {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    showModal(data.data, id);
}

// Set Datas
const setData = datas => {
    const cardGroup = document.getElementById('card-group');
    cardGroup.innerHTML = "";

    datas.forEach(data => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('rounded');
        card.innerHTML = `
        <div class="card-image">
            <img src="${data.image}" class="card-img-top rounded">
        </div>
        
        <div id="card-body" class="card-body">
            <h5 class="card-title">Features</h5>
            ${generateFeatures(data.features)}
        </div>

        <div class="card-footer">
            <div>
                <h5 class="card-title">${data.name}</h5>
                <div>
                    <i class="fa-solid fa-calendar-days"></i>
                    <small class="text-muted">${data.published_in}</small>
                </div>
            </div>
            <button onclick="loadDataByID('${data.id}')" type="button" class="btn btn-primary more-details rounded-circle" data-bs-toggle="modal"
                data-bs-target="#exampleModal"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
        `
        cardGroup.appendChild(card);
    })
    toggleSpinner(false);
}

// Display Data
const displayData = (datas, dataLimit) => {
    if (dataLimit && datas.length > 6) {
        datas = datas.slice(0, 6);
    }
    globalData = datas;
    setData(datas);
}

// Sort By Date
const sortByDate = datas => {
    for (let date of datas) {
        let dateArr = date.published_in.split('/');

        let year = parseFloat(dateArr[2]);
        let month = parseFloat(dateArr[1]);
        let day = parseFloat(dateArr[0]);

        let newDate = new Date(year, month, day);

        date.published_in = newDate;
    }

    datas.sort((a, b) => a.published_in - b.published_in);

    for (let currentDate of datas) {
        const date = new Date(currentDate.published_in);

        let month = date.getMonth();
        if (month < 10) month = "0" + month;

        let dateOfMonth = date.getDate();
        if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;

        let year = date.getFullYear();
        let formattedDate = dateOfMonth + "/" + month + "/" + year;

        currentDate.published_in = formattedDate;
    }
    setData(datas);
}

// Show Modal
const showModal = (data, id) => {
    if (data.id === id) {
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = "";
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalBody.innerHTML = `
        <button class="modal-cross rounded-circle" type="button" data-bs-dismiss="modal"
            aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-left-container">
            <div class="card border-danger mb-3 modal-left">
                <div class="card-body">
                    <h6 class="card-title fw-bold">${data.description}</h6>
                    <div id="modal-button-container" class="modal-button-container w-100 my-4">
                        <button class="rounded modal-btn-1"><span>${checkPriceBasic(data)}</span></button>
                        <button class="rounded modal-btn-2"><span>${checkPricePro(data)}</span></button>
                        <button class="rounded modal-btn-3"><span>${checkPriceEnterprise(data)}</span></button>
                    </div>
                    <div class="modal-details">
                        <div>
                            <h5>Features</h5>
                            ${generateModalFeatures(data.features)}
                        </div>
                        <div>
                            <h5>Integrations</h5>
                            ${generateIntegration(data.integrations)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-right-container">
            <div class="card border-light mb-3 modal-right" style="position: relative;">
                <img src="${data.image_link[0]}" class="card-img-top rounded" alt="...">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${data.input_output_examples ? data.input_output_examples[0].input : "No Data Found"}</h5>
                    <p class="card-text">${data.input_output_examples ? data.input_output_examples[0].output : "No Data Found"}</p>
                </div>
                <div class="btn-accuracy-container">
                    <button class="${data.accuracy.score ? 'd-block' : 'd-none'} btn-accuracy">
                        ${data.accuracy.score * 100 + '% Accuracy'}
                    </button>
                </div>
            </div>
        </div>
        `
        modalContent.appendChild(modalBody);
    }
}

// Generate Features
const generateFeatures = features => {
    let feature = '';
    for (let i = 0; i < features.length; i++) {
        feature = feature + `<li>${i + 1}. ${features[i]}</li>`
    }
    return feature;
}

// Generate Integration
const generateIntegration = integrations => {
    let integration = '';
    if (integrations === null) {
        integration = integration + `<li>${'No Data Found'}</li>`
        return integration;
    }
    else {
        for (let i = 0; i < integrations.length; i++) {
            integration = integration + `<li>${'-'} ${integrations[i]}</li>`
        }
        return integration;
    }
}

// Generate Modal Features
const generateModalFeatures = modalFeatures => {
    let modalFeature = '';
    for (const item in modalFeatures) {
        modalFeature = modalFeature + `<li>${'-'} ${modalFeatures[item].feature_name}</li>`;
    }
    return modalFeature;
}

// Check Price
function checkPrice(data, index) {
    let setPrice = '';
    if (data.pricing == null) {
        return setPrice + `<span>Free of Cost</span>`;
    } else {
        if (data.pricing[index].price === "0" || data.pricing[index].price === "No cost") {
            return setPrice + `<span>Free of Cost/${data.pricing[index].plan}</span>`;
        } else {
            return setPrice + `<span>${data.pricing[index].price} ${data.pricing[index].plan}</span>`;
        }
    }
}

const checkPriceBasic = data => {
    let getPrice = checkPrice(data, 0);
    return getPrice;
}

const checkPricePro = data => {
    let getPrice = checkPrice(data, 1);
    return getPrice;
}

const checkPriceEnterprise = data => {
    let getPrice = checkPrice(data, 2);
    return getPrice;
}

// Spinner Display
const toggleSpinner = isLoading => {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (isLoading) {
        loadingSpinner.classList.remove('d-none');
    } else {
        loadingSpinner.classList.add('d-none');
    }
}

// Sort By Date
document.getElementById('sort-card').addEventListener('click', function () {
    sortByDate(globalData);
})

// Load More Data
document.getElementById('btn-see-more').addEventListener('click', function () {
    loadData();
    const buttonSeeMore = document.getElementById('btn-see-more');
    buttonSeeMore.classList.add('d-none');
})

loadData(10);