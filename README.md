# nettbureau case 2022

## Testing
for å teste programmet, npm i backenden.

\
## Frontend
front enden er skrevet med React og lingner ganske mye på eksempel koden. For å ha to forskjellige sider bruker jeg [react-router-dom](https://www.npmjs.com/package/react-router-dom) til å ha to routes `/` og `/back`.

### input side
![inputs](/img/inputs.png)  
interaksjoner:
* navn feltet kapitaliserer ordene du skriver inn og du kan bare skrive bokstaver
* e-post blir validert av server
* post nummer blir validert av server og viser poststed
* telefon feltet kan du bare skrive tall og tar mobil telefon nummer
* kommentar feltet har ingen regeler
* send inn knappen sender datane inn til server hvis alle datane er valide, hvis ikke så vises det rød text under de feltene som er feil.
### bekreftelse side
![back](/img/back.png)  
her sender knappen deg bare tilbake til input siden.  
  
  
## Backend
backenden er bygget opp av nodejs express skrevet i typescript.
Jeg bruker [ts-node](https://www.npmjs.com/package/ts-node) for å kjøre den.
Serveren server input feltet på `/` og tar post request på `/back`. 
Den har også 2 api-er; `/api/areacode/:code` og `/api/email/:email`. Disse retunerer om post nummeret og emailen er gyldige.  
  
Jeg brukte [bring.no sin database](https://www.bring.no/tjenester/adressetjenester/postnummer) for å validere postnummer. Siden den hadde `ISO-8859-10` encoding lastet jeg ned dokumentet og endret det til `utf-8`.
For å validere email bruker jeg [email-deep-validator](https://www.npmjs.com/package/email-deep-validator).  
  
  
For å sende emails lagde jeg en ny google konto beep.boop.mailbot@gmail.com til å sende mails fra. serveren bruker [nodemailer](https://www.npmjs.com/package/nodemailer) for å kommunisere sende med gmail.
  
  
  

## Videre utvikling
Noen thing som kan gjøres i videre utvikling:
* Istede for å sende emails fra gmail med en google konto burde serveren bruke en dedikert SMTP server.
* Backenden kan bruke [email-templates](https://www.npmjs.com/package/email-templates) til å lage html-en i emailene vi sender fra serveren.
* Kansje sanitere bruker inputet fra areatext feltet siden brukere kan skrive html der som blir lagt til i mailen.
* Bruke en database for å lagre bruker inputet
* Kansje la brukeren se hvilken grunn [email validatoren](https://www.npmjs.com/package/email-deep-validator) gir for ugyldig resultat