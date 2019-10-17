const express=require("express");
const app=express();
const nunjucks=require("nunjucks");



app.listen(3000, ()=>{
  console.log("Now starting the simple app.")
})

nunjucks.configure("views", {
  autoescape:true,
  express: app
});

app.get("/", (req, res)=>{
  res.render("index.html", {"title":"WebAuthN Application"});
});
