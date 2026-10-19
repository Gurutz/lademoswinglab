//funcion auxiliar para parsear de html a JSON, ahora mismo no esta activa, esto genera el dato eventos en JSON
const htmlToJsonEventos = () =>{
    const events = document.getElementById("events");
    const articles = events.children;

    const arrayCollection = Array.from(articles);
    const eventos = [];
    const regex = /<img src="(.*)"\s[\s\S]*<h2>(.*)<\/h2>[\s\S]*<p>(.*)<\/p>[\s\S]*href="(.*)"/g;
    arrayCollection.forEach(element => {

        const htmlString = element.innerHTML;

        console.log(htmlString);

        while((match = regex.exec(htmlString) ) !== null){
            eventos.push({
                img: match[1],
                titulo: match[2],
                fecha: match[3],
                link: match[4],
                linkExtra: match[5]
            })
        }  
    }); 
}

//htmlToJson();



const datosEventos = [
    {
        "img": "assets/img/mañaneo-web.png",
        "titulo": "Mañaneo en La Demo",
        "fecha": "Sábado 31 de Octubre de 11:00 a 14:30 ",
        "link": "https://tally.so/r/QKgaNp?utm_source=web&utm_medium=organic&utm_campaign=curso_26_27"
    },
    {
        "img": "assets/img/practica-web.png",
        "titulo": "Práctica en la Demo",
        "fecha": "Viernes 6 de Noviembre de 21:00 a 22:30 ",
    },
    {
        "img": "assets/img/web-bianca-nils.png",
        "titulo": "Workshop con Bianca y Nils en Madrid",
        "fecha": "Sábado 27-29 de Noviembre 2026",
        "link": "https://tally.so/r/xXK2vG?utm_source=web&utm_medium=organic&utm_campaign=curso_26_27",
        "linkExtra": "assets/img/bianca-nils-web (1).pdf"
    }
]


//generar HTML
const generarHtml =()=>{
    const containerEventos = document.getElementById("events");
    /* const datosEventos = require("./eventos.json");*/
    datosEventos.forEach((evento)=>{
        const article = document.createElement("article")
        article.classList.add("evento-card");
        const link = evento.link ? `
            <a target="_blank" class="evento-btn evento-btn-primary" href="${evento.link}">Apúntate</a>
            ` : "";

        const linkExtra = evento.linkExtra ? `
            <a target="_blank" class="evento-btn" href="${evento.linkExtra}">Horario</a>
            ` : "";

        const botones = link || linkExtra ? `<div class="evento-actions">${link}${linkExtra}</div>` : "";

        const eventoHtml = `
            <div class="evento-img">
                <img src="${evento.img}" alt="${evento.titulo}" loading="lazy">
            </div>
            <div class="evento-body">
                <p class="evento-fecha"><i class="bi bi-calendar-event" aria-hidden="true"></i> ${evento.fecha}</p>
                <h2>${evento.titulo}</h2>
                ${botones}
            </div>
        `;
        article.innerHTML=eventoHtml;
        containerEventos.appendChild(article);

    });

}

    /* fetch('./eventos.json') // Cargar el archivo JSON
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP! Estado: ${response.status}`);
                }
                return response.json(); // Convertir respuesta a objeto JS
            })
            .then(data => {
                console.log("JSON cargado:", data);

                datosEventos.forEach((evento)=>{
                    const article = document.createElement("article")
                   // article.classList.add("events-row");
                    const eventoHtml = `
                        <div class="image">
                            <img src="${evento.img}" alt="">
                        </div>
                        <div class="text">
                            <h2>${evento.titulo}</h2>
                            <div class="divider"></div>
                            <p>${evento.fecha}</p>
                        </div>
                    `;
                    article.innerHTML=eventoHtml;
                    containerEventos.appendChild(article);
                })
            }) */  
    
generarHtml();


