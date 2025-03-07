//funcion auxiliar para parsear de html a JSON, ahora mismo no esta activa, esto genera el dato eventos en JSON
// const htmlToJsonEventos = () =>{
//     const events = document.getElementById("events");
//     const articles = events.children;

//     const arrayCollection = Array.from(articles);
//     const eventos = [];
//     const regex = /<img src="(.*)"\s[\s\S]*<h2>(.*)<\/h2>[\s\S]*<p>(.*)<\/p>[\s\S]*href="(.*)"/g;
//     arrayCollection.forEach(element => {

//         const htmlString = element.innerHTML;

//         console.log(htmlString);

//         while((match = regex.exec(htmlString) ) !== null){
//             eventos.push({
//                 img: match[1],
//                 titulo: match[2],
//                 fecha: match[3],
//                 link: match[4]
//             })
//         }  
//     }); 
// }

//htmlToJson();


//generar HTML
fetch('./data/eventos.json') // Cargar el archivo JSON
.then(response => {
    if (!response.ok) {
        throw new Error(`Error HTTP! Estado: ${response.status}`);
    }
    return response.json(); // Convertir respuesta a objeto JS
})
.then(datosEventos => {
    console.log("JSON cargado:", datosEventos);
    generarHtml(datosEventos);   
})  


const generarHtml =(datosEventos)=>{
    const containerEventos = document.getElementById("events");
    /* const datosEventos = require("./eventos.json");*/
    datosEventos.forEach((evento)=>{
        const article = document.createElement("article")
        article.classList.add("events-row");
        const link = evento.link ? `
            <div>
                <a target="_blank" class="sign-button" href="${evento.link}">Apúntate aquí</a>
            </div>
            ` : "";

        const eventoHtml = `
            <div class="image">
                <img src="${evento.img}" alt="">
            </div>
            <div class="text">
                <h2>${evento.titulo}</h2>
                <div class="divider"></div>
                <p>${evento.fecha}</p>
                ${link}
            </div>
            
        `;
        article.innerHTML=eventoHtml;
        containerEventos.appendChild(article);

    });
    
}


    