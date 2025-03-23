# API som är länkad till databas där användarkonton samt reviews på böcker från Google book api är lagrade
API:et är byggt med Fastify och MongoDB genom pluginet @fastify/mongodb. CRUD funktion (Create, Read, Update, Delete) är implementerat, ett JWT-token krävs för att komma åt alla routes förutom den som använd för att logga in.

## Installation, databas
Klona ner repot, se till att Fastify samt pluginen fastify-plugin, @fastify/mongodb, @fastify/jwt och bcryptjs är installerade. 
Skapa en databas i mongoDB(compass) och två collection, filerna är gjorda med en databas som heter "dt210gprojekt" och de olika collections som finns är: "users" och "reviews". 

Två scheman skapas i servern för att validera datan som skickas till databasen och de ser ut så här:
```

const userBodyJsonSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  }

const reviewBodyJsonSchema = {
    type: 'object',
    required: ['username', 'bookid', 'rating'],
    properties: {
      username: { type: 'string' },
      title: { type: 'string' },
      bookid: { type: 'string' },
      rating: { type: 'number' },
      date: { type: 'date-time' },
      content: { type: 'string' }
    }
  }

```
## Användning
Nedan finns de olika sätt API:et kan anropas:

|Metod  |Ändpunkt     |Beskrivning                                                                           |
|-------|-------------|--------------------------------------------------------------------------------------|
|GET    |/reviews/:id      | Hämtar alla dokument från collection "reviews" där parametern "id" matchar med fältet "bookid" och skickar de som en array.                                        |
|GET    |/review/:id/:user     |Hämtar alla dokument från collection "reviews" där parametern "id" matchar med fältet "bookid" och parametern "user" matchar med fältet "username" och skickar de som en array.                                          |
|POST    |/login | Tar 2 parametrar från body: "username" och "passsword", kollar sedan om det matchar ett dokument i collection "users" och om de gör det skapas en JWT som skickas med i svaret.                                     |
|POST   |/account | Tar 2 parametrar från body: "username" och "passsword", och om dessa inte är tomma samt att värdet på username inte redan finns i collection users så skapas en nytt dokument i collectionen.                                                       |
|POST    |/verify | Kollar om den JWT som skickats med är giltig.                          |
|POST    |/add/review | Tar 5 parametrar från body: "username", "title", "bookid", "rating", "content" sedan skapas även ett date object och om alla dessa inte är tomma skapas en nytt dokument i collection "reviews".                                               |
|DELETE |/delete/:id | Tar 1 parameter från body: "kategori" sedan kollas den collection vars namn är samma som "kategori" om det "id" som skickats med i url matchar med ett _id på ett dokument i den collection och om det matchar tas det dokumentet bort.                                               |
|PUT |/updateamount/:id | Tar 2 parametrar från body: "kategori" och "antal", sedan kollas den collection vars namn är samma som "kategori" om det "id" som skickats med i url matchar med ett _id på ett dokument i den collection och om det matchar ändras det "antal" som ligger i dokument till det "antal" som skickades med i body.                                               |

Datan på databasen lagras i BSON format och kan se ut så här i collection "users":
```
{
  "_id": {
    "$oid": "676f3bda93cba784f44d4970"
  },
  "username": "Calle",
  "password": "$2a$12$4m8k0ow/ZyX48wswm1R.nuNr5Qy3KgVIxH7pzE9fHOMIHm9McUoTa"
}
```
och så här i collection "review":
```
{
  "_id": {
    "$oid": "6779b3327fed85efb2d23518"
  },
  "username": "Linus",
  "title": "Hello",
  "bookid": "FAetCwAAQBAJ",
  "rating": 2,
  "date": 2025-03-18T22:51:57.734+00:00,
  "content": "hytjyuikyu"
}
```
