# projekt-r

### Opis aplikacije
Web aplikacija za planiranje učenja

Zadatak je razvoj web aplikacije koja će pomoći učenicima i studentima u planiranju učenja. Aplikacija treba omogućiti unos dnevnog plana učenja po pojedinim predmetima kao i praćenje evidencije o stvarnom vremenu utrošenom za učenje u tom danu kroz unos vremenskog trajanja i opisa svake aktivnosti vezane uz učenje. Aplikacija će generirati različite grafove kroz koje će korisnici lakše pratiti svoje aktivnosti vezane uz učenje.


### O aplikaciji
- Sastoji se od 2 dijela: servera i baze odvojenim u različite direktorije
- Server - `express`
- Baza - `Docker` +  `postgress`

### Pristup deployanoj aplikaciji
Verziji aplikacije koja je dostupna na javnom http://13.61.26.65:4173/


### Pokretanje servera

- requirements :
    - Node
- aplikacija se pokreće lokalno na [port:3000](http://localhost:3000/)


```bash
$ npm install
$ npm run dev
```


### Pokretanje baze

- requirements :
    - slobodan `port:5432`
    - Docker, Docker-compose, postgres
- postgress baza je realizirana pomoću Dockera na kojem se "vrti postgres"


Start(prvo pokretanje)
```bash
# cd into db dir
$ docker-compose up -d

```

Restart

```bash
# cd into db dir
$ docker-compose down -v
$ docker-compose up -d

```
