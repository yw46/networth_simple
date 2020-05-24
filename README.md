# networth_simple

## Getting Started

### Installing

Under networth_simple folder, navigate to /server, then install packages by using npm install:

```
cd server
npm install
```

## Running the Program

Under the server folder /server, start the server:

```
node server.js
```

Open index.html located in the /client folder. 

### Notes

You will need to press save for each of the new items created or edited. A status of "Current" means such item is 
active, whereas changing the status to "Voided" will simply void the item, meaning that such item will NOT be calculated
towards the total number. To check the items saved, go to

```
localhost:3000/items
```

The data is saved on the server side. No database was used (for now).
