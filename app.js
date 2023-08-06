let currProducts = []
let categories = {}


window.addEventListener('load', (event) =>{loadAllItems(event, 'Home&Personal')})

const selectors = {
    allItems: document.querySelector('.all-itams'),
    subCats: document.querySelector('.sub-categores'),
    filPrices: document.querySelector('.by-prices'),
    phonesBtn: document.querySelector('#smart-category'),
    homeBtn: document.querySelector('#home-category'),
    sort: document.querySelector('#sort'),
    pricesInputs: Array.from(document.querySelectorAll('.by-prices input')),
    moreBtn: document.querySelector('.load-more'),
    responseFilter: document.querySelector('.response-filter'),
    divFilter: document.querySelector('.filter'),
    divItems: document.querySelector(".items"),
    listedCategory: document.querySelector('.current-category'),
    logoIcon: document.querySelector('.home-page'),
}

selectors.logoIcon.addEventListener('click', (event) =>{loadAllItems(event, 'Home&Personal')})
selectors.phonesBtn.addEventListener('click', getPhones)
selectors.homeBtn.addEventListener('click', getHome)
selectors.sort.addEventListener('change', sortItems)
selectors.pricesInputs.forEach(i => {
    i.addEventListener('change', (event) => {filterItems(event, currProducts)});
})
selectors.moreBtn.addEventListener('click', moreLoad)
selectors.responseFilter.addEventListener('click', showFilter)






async function loadAllItems (event, toShow) {

    let itemToShow = []
    const loadedProducts = await (await fetch('https://dummyjson.com/products/')).json()
    if (toShow === 'Home&Personal') {
        itemToShow = loadedProducts.products.filter(p => p.category !== 'smartphones' && p.category !== 'laptops')
        selectors.listedCategory.textContent = `Home and Personal`
    }else if (toShow === 'Smart') {
        itemToShow = loadedProducts.products.filter(p => p.category === 'smartphones' || p.category === 'laptops')
        selectors.listedCategory.textContent = `Phones and Laptops`

    }else {
        itemToShow = toShow;
    }


    currProducts = Object.values(itemToShow)

    selectors.allItems.innerHTML = ''
    selectors.sort.value = ''

    elementsCreate(currProducts)

    selectors.subCats.innerHTML =`<p>Sub-categories:</p>`

    categories = {}

    currProducts.forEach(p => {
        if (Object.keys(categories).includes(p.category)){
                categories[p.category] += 1;
            }else {
                categories[p.category] = 1;
            }
    })

    Object.entries(categories).forEach(c => {
        const divBox = createElement('div', null, ["box-category"])
        const inputChkBox = createElement('input')
        inputChkBox.type = 'checkbox'
        inputChkBox.id = c[0]
        inputChkBox.name = c[0]
        inputChkBox.addEventListener('change', (event) => {filterItems(event, currProducts);})
        divBox.appendChild(inputChkBox)
        const label = createElement('label')
        label.for = c[0]
        label.textContent = `${c[0]} (${c[1]})`
        divBox.appendChild(label)
        selectors.subCats.appendChild(divBox)

    })

    console.log(document.querySelector('.filter'))
}

function filterItems (event, currItems) {
    const categoryInputs = Array.from(document.querySelectorAll('.box-category input'))
    let toFilter = []
    let filtByCategory = []
    let finalFilter = []
    if (categoryInputs.every(i => i.checked === false) && selectors.pricesInputs.every(p => p.checked === false)){
        loadAllItems(null, currItems);
        return;
    }else if(categoryInputs.some(i => i.checked === true) && selectors.pricesInputs.some(p => p.checked === true)){
        
        categoryInputs.forEach(i => {
            if (i.checked){
                toFilter.push(i.name);
            }
        })

        filtByCategory = currItems.filter( (p) => toFilter.includes(p.category))


        selectors.pricesInputs.forEach(i => {
            if (i.checked){
                toFilter.push(parseInt(i.name));
            }
        })

        if (toFilter.includes(100)){
            finalFilter = finalFilter.concat(filtByCategory.filter(i => i.price < 100));
        }

        if (toFilter.includes(1000)){
            finalFilter = finalFilter.concat(filtByCategory.filter(i => i.price < 1000 && i.price > 100));
        }
        if (toFilter.includes(1001)){
            finalFilter = finalFilter.concat(filtByCategory.filter(i => i.price >= 1001));

        }

    }else if (categoryInputs.every(i => i.checked === false) && selectors.pricesInputs.some(p => p.checked === true)){
        selectedInputs = selectors.pricesInputs.filter(p => p.checked === true)
        selectedInputs.forEach(i => { toFilter.push(parseInt(i.name))})

        if (toFilter.includes(100)){
            finalFilter = finalFilter.concat(currItems.filter(i => i.price < 100));
        }

        if (toFilter.includes(1000)){
            finalFilter = finalFilter.concat(currItems.filter(i => i.price < 1000 && i.price > 100));
        }
        if (toFilter.includes(1001)){
            finalFilter = finalFilter.concat(currItems.filter(i => i.price >= 1001));
        }
    }else {
        categoryInputs.forEach(i => {
            if (i.checked){
                toFilter.push(i.name);
            }
        })

        filtByCategory = currItems.filter( (p) => toFilter.includes(p.category))
        finalFilter = filtByCategory
    }

    selectors.allItems.innerHTML = ''
    
    elementsCreate(finalFilter)
}

function sortItems (e) {
    let itemsSorted = [...currProducts]
    if (e.target.value === 'AZ'){
        itemsSorted = itemsSorted.sort((a, b) => a.title.localeCompare(b.title));
    }else if (e.target.value === 'ZA'){
        itemsSorted = itemsSorted.sort((a, b) => b.title.localeCompare(a.title));
    }else if (e.target.value === 'PA'){
        itemsSorted = itemsSorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }else if (e.target.value === 'PD'){
        itemsSorted = itemsSorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }else {
        loadAllItems(null, currProducts);
        return;
    }

    selectors.allItems.innerHTML = ''

    elementsCreate(itemsSorted)
}

function getPhones () {
    loadAllItems(null, 'Smart');
}

function getHome () {
    loadAllItems(null, 'Home&Personal')
}

function moreLoad (e){
    const hiddenAll = Array.from(document.querySelectorAll('.hidden'))
    let nextItems = hiddenAll.splice(0, 9)
    if (hiddenAll.length === 0){
        selectors.moreBtn.disabled = true
        selectors.moreBtn.classList.add('noMore')

        nextItems.forEach(h => {
            h.classList.remove('hidden');
        })
    }else {
        nextItems.forEach(h => {
            h.classList.remove('hidden');
        })
    }

}

function elementsCreate (itemsToCreate) {
    let giveItems = [...itemsToCreate]
    let itemToShow = giveItems.splice(0, 9)

    if (giveItems.length > 0) {
        selectors.moreBtn.disabled = false
        selectors.moreBtn.className = 'load-more'

        itemToShow.forEach(p =>{
    
            const card = createElement('div', null, ['card'])
            const image = createElement('img')
            image.src = p.thumbnail
            card.appendChild(image)
            const infoDiv = createElement('div', null, ['info'])
            createElement('h4', p.title, [], infoDiv, 'title')
            createElement('p', p.description, [], infoDiv, 'desc')
            const rating = createElement('p', null, [], null, 'rating')
            let innerTxt = ''
            let fullStars = `<span class="fa fa-star checked"></span>`.repeat(Math.round(p.rating))
            let emptyStars = `<span class="fa fa-star"></span>`.repeat(5 - Math.round(p.rating))
            rating.innerHTML = fullStars + emptyStars + `<span class="float-rating">${p.rating}</span>`
            infoDiv.appendChild(rating)
            const buttonPrice = createElement('div', null, [], null, "button-price")
            const cartAdd = createElement('button', `Add to Cart`, null, null, 'add-cart' )
            cartAdd.addEventListener('click', () => {alert( `Product added to cart`)})
            buttonPrice.appendChild(cartAdd)


            if (parseFloat(p.discountPercentage) > 10){
                createElement('p', `Price: ${p.price}$`, ['no-discount'], buttonPrice, 'price-no-dicount')

            }else{
                const textPrice = createElement('p', null, [], null, 'price-dicount')
                const priceNew = parseFloat(p.price) - parseFloat(p.price * p.discountPercentage / 100)
                textPrice.innerHTML = `Price: <span class="old-price">${p.price}$</span><br><span class="new-price">${priceNew.toFixed(2)}$</span>`
                buttonPrice.appendChild(textPrice)
            }
            
            infoDiv.appendChild(buttonPrice)
            card.appendChild(infoDiv)
    
            selectors.allItems.appendChild(card)
    
        })


        giveItems.forEach(p =>{
    
            const card = createElement('div', null, ['card'])
            const image = createElement('img')
            image.src = p.thumbnail
            card.appendChild(image)
            const infoDiv = createElement('div', null, ['info'])
            createElement('h4', p.title, [], infoDiv, 'title')
            createElement('p', p.description, [], infoDiv, 'desc')
            const rating = createElement('p', null, [], null, 'rating')
            let innerTxt = ''
            let fullStars = `<span class="fa fa-star checked"></span>`.repeat(Math.round(p.rating))
            let emptyStars = `<span class="fa fa-star"></span>`.repeat(5 - Math.round(p.rating))
            rating.innerHTML = fullStars + emptyStars + `<span class="float-rating">${p.rating}</span>`
            infoDiv.appendChild(rating)
            const buttonPrice = createElement('div', null, [], null, "button-price")

            const cartAdd = createElement('button', `Add to Cart`, null, null, 'add-cart' )
            cartAdd.addEventListener('click', () => {alert( `Product added to cart`)})
            buttonPrice.appendChild(cartAdd)

            if (parseFloat(p.discountPercentage) > 10){
                createElement('p', `Price: ${p.price}$`, ['no-discount'], buttonPrice, 'price-no-dicount')

            }else{
                const textPrice = createElement('p', null, [], null, 'price-dicount')
                const priceNew = parseFloat(p.price) - parseFloat(p.price * p.discountPercentage / 100)
                textPrice.innerHTML = `Price: <span class="old-price">${p.price}$</span><br><span class="new-price">${priceNew.toFixed(2)}$</span>`
                buttonPrice.appendChild(textPrice)
            }

            infoDiv.appendChild(buttonPrice)
            card.appendChild(infoDiv)
            card.classList.add('hidden')
    
            selectors.allItems.appendChild(card)
    
        })
        

    }else {
        itemToShow.forEach(p =>{

            const card = createElement('div', null, ['card'])
            const image = createElement('img')
            image.src = p.thumbnail
            card.appendChild(image)
            const infoDiv = createElement('div', null, ['info'])
            createElement('h4', p.title, [], infoDiv, 'title')
            createElement('p', p.description, [], infoDiv, 'desc')
            const rating = createElement('p', null, [], null, 'rating')
            let innerTxt = ''
            let fullStars = `<span class="fa fa-star checked"></span>`.repeat(Math.round(p.rating))
            let emptyStars = `<span class="fa fa-star"></span>`.repeat(5 - Math.round(p.rating))
            rating.innerHTML = fullStars + emptyStars + `<span class="float-rating">${p.rating}</span>`
            infoDiv.appendChild(rating)
            const buttonPrice = createElement('div', null, [], null, "button-price")
            createElement('button', `Add to Cart`, null, buttonPrice, 'add-cart' )

            if (parseFloat(p.discountPercentage) > 10){
                createElement('p', `Price: ${p.price}$`, ['no-discount'], buttonPrice, 'price-no-dicount')

            }else{
                const textPrice = createElement('p', null, [], null, 'price-dicount')
                const priceNew = parseFloat(p.price) - parseFloat(p.price * p.discountPercentage / 100)
                textPrice.innerHTML = `Price: <span class="old-price">${p.price}$</span><br><span class="new-price">${priceNew.toFixed(2)}$</span>`
                buttonPrice.appendChild(textPrice)
            }

            infoDiv.appendChild(buttonPrice)
            card.appendChild(infoDiv)
    
            selectors.allItems.appendChild(card)
    
        })

    }

}

function showFilter (e) {
    if (selectors.divFilter.children.length < 4){
        const applyBtn = createElement('button', "Apply", ['apply-btn'], selectors.divFilter)
        applyBtn.addEventListener('click', applyFilters)

    }
    selectors.divFilter.style.width = '100%'
    selectors.divFilter.style.zIndex = "2"
    selectors.divFilter.style.display = 'flex'
    selectors.divItems.style.display = 'none'
}

function applyFilters (e) {
    filterItems(null, currProducts)
    selectors.divFilter.style.display = 'none';
    selectors.divItems.style.display = 'flex'
}

function createElement (type, content, classes, parent, id) {
    const element = document.createElement(type)

    if (content){
        element.textContent = content;
    }

    if (classes) {
        element.classList.add(...classes);
    }

    if (id) {
        element.setAttribute('id', id)
    }

    if (parent) {
        parent.appendChild(element)
    }

    return element;
}
