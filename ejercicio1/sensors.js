class Sensor {

    /*"id": "sensor-1",
  "name": "Sensor 1",
  "type": "temperature",
  "value": 24.5,
  "unit": "°C",
  "updated_at": "2023-06-01T12:00:00"
   */
    constructor(id,name,type,value,unit,updated_at){
        this.id=id ?? null;
        this.name=name ?? "";
        this.type= this.controlType(type) ;
        this.value=value ?? 0.0;
        this.unit=unit ?? "";
        this.updated_at=updated_at;
    }
    controlType(type){
        if(type != "temperature" || type != "humidity"|| type != "pressure"){
            return "temperature" ;
        }
    }
    // Implementar la propiedad computada `updateValue` mediante un *setter* que permita actualizar el valor del sensor y la fecha de actualización.
    updateValue(valueSensor, fechaUpdate){
        this.value=valueSensor;
        this.fechaUpdate=fechaUpdate;
    }
}

class SensorManager {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }
    
    async loadSensors(url) {
        try {
            const response= await fetch(`${url}`);
            const sensores= await response.json();
            this.sensors=sensores;
            // console.log("?? ",this.sensors)
            this.render();
        }catch {
            console.error("Error de ruta");
        } finally {
            console.log("Petición completada");
        }
        
    }

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }
}

const monitor = new SensorManager();

monitor.loadSensors("sensors.json");
