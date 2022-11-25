//PESQUISAR
//VOLTAR ATRÁS AO DAR ENTER DE INPUT VAZIO
//ORDENAR (POR DATA)
//FILTRAR POR CATEGORIA


let JSON_PATH ='https://api.artic.edu/api/v1/artworks/' ;
let artWorkConfig = "https://www.artic.edu/iiif/2";

let arrayCategories = [];
let searchBar = document.querySelector("#inputArea");
let arrayWorks = [];
let filteredArtWorks;
let titleSearched;
let categoriesButtons = [];
let filterByCategory;
let BooleanNotFilteringByCategory = true;
let getCat;
let projectContainer = document.querySelector('.Project_Container');
let categories_container = document.querySelector(".categories")

searchBar.addEventListener("input", function (e){
    projectContainer.innerHTML = '';
    let textInput = e.target.value.toUpperCase();
    filteredArtWorks = arrayWorks.filter(work => {
        return work.title.toUpperCase().includes(textInput)
    })
    titleSearched = filteredArtWorks
    projectContainer.innerHTML = ''; //CLEAN SCREEN
    for (const info of filteredArtWorks) {
        let album = new Album(projectContainer, artWorkConfig + '/' + info.image_id + '/full/843,/0/default.jpg', info.title, info.date_end, info.artist_title, info.artwork_type_title);
    }
})

// ORDER BY YEAR
const SORT_YEAR_ASC = function(a, b) {
    return a.date_end - b.date_end;
};
const SORT_YEAR_DESC = function(a, b) {
    return b.date_end - a.date_end;
};

class App {
    constructor() {
        this._onJsonReady = this._onJsonReady.bind(this);
        this._sortArtWorks = this._sortArtWorks.bind(this);

        const ascElement = document.querySelector('#asc');
        const ascButton = new SortButton(
            ascElement, this._sortArtWorks, SORT_YEAR_ASC);
        const descElement = document.querySelector('#desc');
        const descButton = new SortButton(
            descElement, this._sortArtWorks, SORT_YEAR_DESC);
        const alphaElement = document.querySelector('#alpha');
    }


    _sortArtWorks(sortFunction) {
        this.artWorkInfo.sort(sortFunction);
        this._renderArtWorks();
    }

    _renderArtWorks() {
        projectContainer.innerHTML = ''; //CLEAN SCREEN

        let allData = this.artWorkInfo;
        let finalData;
        if (BooleanNotFilteringByCategory ){
            finalData = allData;
        } else {
            finalData = allData.filter(data => data.artwork_type_title == getCat) //!== 'Drawing and Watercolor') //= filterByCategory) //
        }

        projectContainer.innerHTML = ''
        for (const info of finalData) {
            let album = new Album(projectContainer, artWorkConfig + '/' + info.image_id + '/full/843,/0/default.jpg', info.title, info.date_end, info.artist_title, info.artwork_type_title);
            arrayWorks.push(info)
        }

        if (!categories_container.hasChildNodes()){ //SO IT ONLY APPENDS THE CATEGORIES ONE TIME
            for (let category of arrayCategories) {
                categoriesButtons = document.createElement('a');
                categoriesButtons.innerText = category;
                categoriesButtons.classList.add('category')
                let replaceSpacesCategory = category.replaceAll(' ', '_')
                categoriesButtons.classList.add(replaceSpacesCategory)
                categories_container.append(categoriesButtons)
            }
        }

        categories_container.childNodes.forEach((e, i) => {
            if (e.innerText !== undefined) {
                e.addEventListener('click', () => {
                    filterByCategory = e.innerText
                    getCat = filterByCategory
                    this.loadWorks()
                    BooleanNotFilteringByCategory = !BooleanNotFilteringByCategory
                    document.querySelector('.filtraPor').innerHTML = e.innerText
                })
            }
        })
    }

    loadWorks() {
        fetch(JSON_PATH)
            .then(this._onResponse)
            .then(this._onJsonReady);
    }
    _onJsonReady(json) {
        this.artWorkInfo = json.data;
        this._renderArtWorks();
    }

    _onResponse(response) {
        return response.json();
    }
}

class SortButton {
    constructor(containerElement, onClickCallback, sortFunction) {
        this._onClick = this._onClick.bind(this);
        this.onClickCallback = onClickCallback;

        this.sortFunction = sortFunction;
        const categoriesContainer = document.querySelector('.categories')
        categoriesContainer.innerHTML = ''
        containerElement.addEventListener('click', this._onClick);
    }

    _onClick() {
        const categoriesContainer = document.querySelector('.categories')
        categoriesContainer.innerHTML = ''

        const buttonCategories = document.querySelectorAll('.category')
        buttonCategories.forEach(element => element.remove())
        this.onClickCallback(this.sortFunction);
    }
}

class Album {
    constructor(projectContainer, imageUrl, title, date, artist_title, artwork_type_title) {
        if (!arrayCategories.includes(artwork_type_title)){
            arrayCategories.push(artwork_type_title)
        }

        let sectionArt = document.createElement('section')
        sectionArt.classList.add("card")
        let Title = document.createElement('h1');
        Title.innerText = title + ' ' + date;
        let image = new Image();
        image.src = imageUrl;
        let artisticMovement = document.createElement('h3');
        artisticMovement.innerText =  'Artist: ' + artist_title;
        let typeOfArt = document.createElement('h4')
        typeOfArt.innerText = artwork_type_title;

        //APPEND ELEMENTS
        projectContainer.append(Title);
        sectionArt.append(Title)
        sectionArt.append(artisticMovement);
        sectionArt.append(typeOfArt);
        sectionArt.append(image)

        projectContainer.append(sectionArt)
        projectContainer.style.marginLeft = '50px';
    }
}

// script.js
const app = new App();
app.loadWorks();

