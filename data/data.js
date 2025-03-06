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
                link: match[4]
            })
        }  
    }); 
}

//htmlToJson();



const datosEventos = [
    
    {
        "img": "assets/img/practica-lademoswing.png",
        "titulo": "Práctica Swing en La Demo",
        "fecha": "Viernes 7 de Marzo de 21:00 a 22:30"
        
    },
    {
        "img": "assets/img/mañaneo-lademoswing.png",
        "titulo": "Mañaneo en La Demo",
        "fecha": "Sábado 22 de Marzo de 11:00 a 14:30",
        "link": "https://docs.google.com/forms/d/1LxY4rw-r-DDso24xbyDrnc6ODxbJFXyMt6Mg9hoopaA/viewform?edit_requested=true"
    },
    {
        "img": "assets/img/mañaneo-lademoswing.png",
        "titulo": "Mañaneo en La Demo",
        "fecha": "Sábado 5 de abril de 11:00 a 14:30"
    },
    {
        "img": "assets/img/practica-lademoswing.png",
        "titulo": "Práctica Swing en La Demo",
        "fecha": "Sábado 25 de Abril de 11:00 a 14:30"
    }
]


//generar HTML
const generarHtml =()=>{
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


