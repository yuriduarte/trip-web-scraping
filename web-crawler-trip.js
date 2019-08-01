let axios = require("axios");
let cheerio = require("cheerio");
let fs = require("fs");

let urls = Array(520).fill().map((_, i) => {
  // Link de Teste
  // return 'https://www.tripadvisor.com.br/Attraction_Review-g303506-d11840851-Reviews-Centro_de_Visitantes_Paineiras-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html'

  // AquaRio 472 paginações
  // if (i === 0) {
  //   return 'https://www.tripadvisor.com.br/Attraction_Review-g303506-d11725544-Reviews-AquaRio-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html'
  // } else {
  //   return `https://www.tripadvisor.com.br/Attraction_Review-g303506-d11725544-Reviews-or${i}0-AquaRio-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html`
  // }

  // Paineiras 101 paginações
  // if (i === 0) {
  //   return 'https://www.tripadvisor.com.br/Attraction_Review-g303506-d11840851-Reviews-Centro_de_Visitantes_Paineiras-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html'
  // } else {
  //   return `https://www.tripadvisor.com.br/Attraction_Review-g303506-d11840851-Reviews-or${i}0-Centro_de_Visitantes_Paineiras-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html`
  // }

  // RioZoo 78 páginações
  // if (i === 0) {
  //   return 'https://www.tripadvisor.com.br/Attraction_Review-g303506-d2352236-Reviews-RioZoo_Rio_de_Janeiro_s_Zoo-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html'
  // } else {
  //   return `https://www.tripadvisor.com.br/Attraction_Review-g303506-d2352236-Reviews-or${i}0-RioZoo_Rio_de_Janeiro_s_Zoo-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html`
  // }

  // Cataratas - 4214 páginações
  // if (i === 0) {
  //   return 'https://www.tripadvisor.com.br/Attraction_Review-g303444-d312332-Reviews-Iguazu_Falls-Foz_do_Iguacu_State_of_Parana.html'
  // } else {
  //   return `https://www.tripadvisor.com.br/Attraction_Review-g303444-d312332-Reviews-or${i}0-Iguazu_Falls-Foz_do_Iguacu_State_of_Parana.html`
  // }
  
  // Marco - 520 páginações
  if (i === 0) {
    return 'https://www.tripadvisor.com.br/Attraction_Review-g303444-d318353-Reviews-Marco_Das_Tres_Fronteiras-Foz_do_Iguacu_State_of_Parana.html'
  } else {
    return `https://www.tripadvisor.com.br/Attraction_Review-g303444-d318353-Reviews-or${i}0-Marco_Das_Tres_Fronteiras-Foz_do_Iguacu_State_of_Parana.html`
  }

  // Noronha - 127 páginações
  // if (i === 0) {
  //   return 'https://www.tripadvisor.com.br/Attraction_Review-g616328-d2520869-Reviews-Fernado_de_Noronha_Island-Fernando_de_Noronha_State_of_Pernambuco.html#REVIEWS'
  // } else {
  //   return `https://www.tripadvisor.com.br/Attraction_Review-g616328-d2520869-Reviews-or$[i}0-Fernado_de_Noronha_Island-Fernando_de_Noronha_State_of_Pernambuco.html`
  // }
  
});

Promise.all(urls.map(extractData)).then(allResults => {
    let result = [].concat.apply([], allResults);
    let file = JSON.stringify(result, null, 4);
    // let file = result.join('\n')
    // console.log(result[0].rating);

    fs.writeFile("data2.json", file, err =>
      console.log("Arquivo salvo com sucesso!")
    );
})

function extractData(url) {
  return axios.get(url).then(response => {
    let data = [];
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      $(".review-container").each(function(i, elem) {
        let review = {
          title: $(this)
            .find("span.noQuotes")
            .text()
            .trim(),
          description: $(this)
            .find("p.partial_entry")
            .text()
            .trim(),
          location: $(this)
            .find("div.userLoc strong")
            .text()
            .trim(),
          publication: $(this)
            .find("span.ratingDate")
            .text()
            .trim(),
          date: $(this)
            .find(".prw_reviews_stay_date_hsx")
            .text()
            .replace('Data da experiência:', '')
            .trim(),
          rating: $(this)
            .find(".ui_bubble_rating")
            .attr('class')
            .trim(),
        };
        
        switch (review.rating) {
          case "ui_bubble_rating bubble_10":
            review.rating = 1
            break
          case "ui_bubble_rating bubble_20":
            review.rating = 2
            break
          case "ui_bubble_rating bubble_30":
            review.rating = 3
            break
          case "ui_bubble_rating bubble_40":
            review.rating = 4
            break
          case "ui_bubble_rating bubble_50":
            review.rating = 5
            break
          default:
            // console.log('Nota inválida')
        }

        data.push(review);       
      });
      console.log('[200]', url);
    } else {
        console.log('[ERR]', url);
    }
    return data;
  }).catch(() => {
    console.log('[ERR]', url);
  });
}
