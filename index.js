// 1. User initiates logon providing a username.
// 2. RP creates a unique challenge along with credential id that is sent back to application.
// 3. JS client calls navigator.credentials.get() with browser validating the RP against origin and calls authenticator to validate user.
// 4. User selected authenticator (example: fingerprint, any FIDO2 enabled device like phone or laptop) receives challenge with the domain name and requests consent from user.
// 5. Once consent is provided, authenticator creates signed assertion back to the browser containing a signature =clientDataHash (made of RP ID + challenge) + authenticator data using private key generated during registration.
// Note: authenticator generates public/private key pair.
// 6. navigator.credentials.get() promise resolves to PublicKeyCredential containing signed authenticator assertion.
// 7. PublicKeyCredential forwarded to RP server.
// 8. RP server verifies signature using public key stored during registration and verifies signed challenge to check for replay attacks before it logs in user.
// 9. Server stores public key and credential id on server side.
// No sensitve info passed as everything stored on authenticator.
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const session=require("express-session");
const uuidv1=require("uuid/v1");
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  genid:(req)=>{
    return uuidv1();
  }
}));

const nunjucks=require("nunjucks");
const path=require("path");
const WebAuthN=require("webauthn");
const webauthn= new WebAuthN({
  origin:"http://localhost:3000",
  usernameField: "username",
  userFields:{
    username: "username",
    name: "displayName"
  },
  rpName:"Rita's WebAuthN"
});

const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
  extended:true
}
));
app.use(bodyParser.json());
app.use("/webauthn", webauthn.initialize());

app.use(express.static(path.join(__dirname, "/public")));

app.listen(port, ()=>{
  console.log("Now starting the WebAuthN app on port " + port + ".")
});

nunjucks.configure("views/", {
  autoescape:true,
  express: app
});

app.get("/secret",webauthn.authenticate(), (req, res)=>{
  res.status(200).json({"status":"ok", "message":"super secret"});
});


app.get("/", (req, res)=>{
  res.render("index.html", {"title":"WebAuthN Application"});
});
