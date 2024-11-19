import http from "http"
import app from "./app/app.js"
import  ngrok from "@ngrok/ngrok"

const server = http.createServer(app);
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`App listening on port ${PORT}`))


if(process.env.NODE_ENV == "development"){
     ngrok
       .connect({
         addr: PORT,
         authtoken_from_env: true,
         domain: "hardy-perch-precisely.ngrok-free.app",
       })
       .then((listener) =>
         console.log(`Ingress established at: ${listener.url()}`)
       );
}
