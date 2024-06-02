class Customer {
    info;
    constructor(id,nombre,email){
        this.id=id ?? null;
        this.nombre=nombre ;
        this.email=email;
        this.info=`${this.nombre}, Correo Electronico: ${this.email}`
    }
    get info(){  
        return this.info
    }
}

class Reservation {
    info="";
    constructor(id, customer, date, guests){
        this.id=id;
        this.customer=customer;
        this.date=new Date(date);
        this.guests=guests;
        this.info+=`Fecha: ${this.date.getFullYear()}/${this.date.getMonth()}/${this.date.getDay()}, hrs: ${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}, Cliente: ${this.customer.info}, Cantidad de comensales: ${this.guests}`
    }
    get info(){
        return this.info;
    }
    static validateReservation(reservaDate, reservaGuests){
        reservaDate=new Date(reservaDate)
        const fechaActual= new Date();
        // console.log(typeof reservaDate ===  "object")
        if(reservaDate.getFullYear()<fechaActual.getFullYear() && reservaDate.getMonth() < fechaActual.getMonth() && reservaDate.getDay() < fechaActual.getDay()){
            if(reservaGuests<=0){
                return false;
            }
        }
        return true;
        
    }
}

class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document
    .getElementById("reservation-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );
            // console.log(reservation+" A--A" + customer)
            restaurant.addReservation(reservation);
            restaurant.render();
        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}