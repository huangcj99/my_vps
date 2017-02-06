/**
 * Created by gunjoe on 2017/2/6.
 */
const mongoose = require('mongoose');

let homepage_img_schema = new mongoose.Schema({
    url:{type:String,unique:true,require:true}
});
let homepage_imgs = mongoose.model("homepage_imgs",homepage_img_schema);

exports.get_homepage = (req,res) => {
    homepage_imgs.find((err,doc) => {
        if (err) {
            throw err;
        }
        if (!doc) {
            throw new Error("无文档");
        }
        else {
            res.writeHead(200);
            res.end(JSON.stringify(doc));
        }
    })
};