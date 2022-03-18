
let textArea = document.querySelector('.text-area')
let cards;
let repList = document.querySelector('.rep-list')

async function getResponse(value) {
    let url = new URL('https://api.github.com/search/repositories');
    url.searchParams.set('q', encodeURIComponent(value));
    url.searchParams.set('sort', 'stars');
    url.searchParams.set('per_page', '5');
    const response = await fetch(url)

    return response.json()
}

function debounce(f, interval) {
    let timer = null;

    return (...args) => {
      clearTimeout(timer);
      return new Promise((resolve) => {
        timer = setTimeout(
          () => resolve(f(...args)),
          interval,
        );
      });
    };
  }

getResponse = debounce(getResponse, 600)
  
function removeCard (item) {
    item.remove()
}

function renderNameCard (item) {
    function renderRepCard () {
      if (this.textContent === item.name) {
         let repBlock = document.createElement('div');
         repBlock.classList.add('rep-card')
         repList.appendChild(repBlock)
          let repBlockName = document.createElement('div')
         let repBlockOwner = document.createElement('div')
         let repBlockStars = document.createElement('div')
         let closeButton = document.createElement('button')
         closeButton.classList.add('close-button')
         repBlockName.textContent = `Name: ${item.name}`
         repBlockOwner.textContent = `Owner: ${item.owner.login}`
         repBlockStars.textContent = `Stars: ${item.stargazers_count}`
         repBlock.appendChild(repBlockName)
         repBlock.appendChild(repBlockOwner)
         repBlock.appendChild(repBlockStars)
         repBlock.appendChild(closeButton)
         closeButton.addEventListener('click', ()=> {
           removeCard(repBlock)
         })
      }  
    }

    const cardsBlock = document.querySelector('.search-cards')
    const card = document.createElement('a');
  
    card.classList.add('card');
    card.textContent = item.name
    card.addEventListener('click', renderRepCard)
    card.addEventListener('click', () => {
      textArea.value = ''
      cards = document.querySelectorAll('.card')
      cards.forEach(item => {
        removeCard(item)
       })
    })
    cardsBlock.appendChild(card)
}

textArea.addEventListener('keyup', async () => {
    cards = document.querySelectorAll('.card')
    
    if (textArea.value !== '') {
        let obj = await getResponse(textArea.value)
       
        cards.forEach(item => {
            removeCard(item)
        })
        obj.items.forEach(item => {
            renderNameCard(item)
        })
      
    } else {
        cards.forEach(item => {
            removeCard(item)
        })
    }
})
