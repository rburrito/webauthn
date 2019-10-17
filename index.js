const express=require("express");
const app=express();
const nunjucks=require("nunjucks");
const WebAuthN=require("webauthn");
const webauthn= new WebAuthN({
  origin:"http://localhost:3000",
  usernameFields: "username",
  userFields:{
    username: "username",
    name: "displayName"
  },
  rpName:"Rita's WebAuthN"
});

const port = process.env.PORT || 3000

app.use("/webauthn", webauthn.initialize());

app.listen(port, ()=>{
  console.log("Now starting the WebAuthN app on port " + port + ".")
});

nunjucks.configure("views/", {
  autoescape:true,
  express: app
});

app.get("/", (req, res)=>{
  res.render("index.html", {"title":"WebAuthN Application"});
});
