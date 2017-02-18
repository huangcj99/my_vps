/**
 * Created by gunjoe on 2017/2/6.
 */
const mongoose = require('mongoose');

let homepage_img_schema = new mongoose.Schema({
    url:{type:String,unique:true,require:true}
});
let homepage_imgs = mongoose.model("homepage_imgs",homepage_img_schema);

//返回主页的图片路径
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

let list_img_schema = new mongoose.Schema({
    url:{type:String,require:true,unique:true},
    size:{type:String,require:true}
});
let vps_lists = mongoose.model("vps_lists",list_img_schema);

//返回列表页的图片路径
exports.get_list_img = (req,res) => {
    let size = req.query.size;
    
    console.log(size);
    if (size === "big") {
        vps_lists.find({size:"big"},(err,big_doc) => {
            if (err) {
                throw err;
            }

            if (!big_doc) {
                throw new Error("不存在该数据");
            }
            else {
                res.writeHead(200);
                res.end(JSON.stringify(big_doc));
            }
        });
    }

    if (size === "small") {
        vps_lists.find({size:"small"},(err,small_doc) => {
            if (err) {
                throw err;
            }

            if (!small_doc) {
                throw new Error("不存在该数据");
            }
            else {
                res.writeHead(200);
                res.end(JSON.stringify(small_doc));
            }
        });
    }

};










