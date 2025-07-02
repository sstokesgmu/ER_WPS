import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const port = 3404;

app.use(cors());
app.use("/assets",express.static("assets"));
app.get("/landingPage_images", (req, res) => {
    try{
      const imageFiles=fs.readdirSync("assets/LandingImages").filter(file=>{
        const extname=path.extname(file).toLowerCase(); // Get extname in universal format
        return ['.png','.jpg','.webp'].includes(extname);
      });

      const fileUrls = imageFiles.map(file=>{
        return `http://localhost:${port}/assets/LandingImages/${file}`;
      });
      res.json(fileUrls);
    } catch(error) {
      console.log(error);
      res.json({error: error});
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
