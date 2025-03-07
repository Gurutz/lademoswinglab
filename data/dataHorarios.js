/* fetch('./data/horario.json') // Cargar el archivo JSON
.then(response => {
    if (!response.ok) {
        throw new Error(`Error HTTP! Estado: ${response.status}`);
    }
    return response.json(); // Convertir respuesta a objeto JS
})
.then(datosHorarios => {
    console.log("JSON cargado:", datosHorarios);
    generarHtmlHorarios(datosHorarios);   
})  

//generar HTMl de horarios
generarHtmlHorarios = (datosHorarios) =>{

    

    const horasArray = new Set();
    for(const dia in datosHorarios){
        //console.log(datosHorarios[dia]);
        datosHorarios[dia].clases.forEach((clase)=>{
            horasArray.add(clase.time);
        })
    }
    //console.log(horasArray);


    const containerHorarios = document.getElementById("tablaHorarios");
    horasArray.forEach((hora)=>{
        const row = document.createElement("tr");
        const celdaHora = document.createElement("th");
        celdaHora.textContent = hora;
        row.appendChild(celdaHora);
        for(const dia in datosHorarios){
            const celda = document.createElement("td");
            const claseName = datosHorarios[dia].clases.find((clase)=> clase.time === hora)  
            celda.textContent = claseName;            
            row.appendChild(celda);
        }
        containerHorarios.appendChild(row);
    });


}
 */