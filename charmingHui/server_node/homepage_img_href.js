/**
 * Created by gunjoe on 2017/2/6.
 */
const fs = require('fs'),
      path = require('path');

const mongoose = require('mongoose');

//数据库连接并创建首页图片模型
mongoose.connect("mongodb://104.194.93.138:27017/charmingHui");
let homepage_img_schema = new mongoose.Schema({
    url:{type:String,require:true,unique:true}
});
let homepage_img = mongoose.model("Homepage_img",homepage_img_schema);

//主页图片url数据
let homepage = {
    dir_path:"D:nodeProject/myVps/charmingHui/src/img/list/homepage/",
    name:0,
    ext:".jpg",
    name_rule:function () {
        this.name++;
    }
};

function Interrogator(opt) {
    this.dir_path = opt.dir_path;
    this.name = opt.name;
    this.ext = opt.ext;
    this.file_url = null;
    this.name_rule = opt.name_rule;

    this.get_file_path = function (){
        let find_img_promise = new Promise((resolve,reject) => {
            console.log(this.dir_path);
            fs.exists(this.dir_path,(exists) => {
                if (!exists) {
                    // throw new Error(`不存在${this.dir_path}`);
                    reject();
                }
                else {
                    resolve();
                }
            })
        });

        find_img_promise

            //文件夹存在则进行文件查询
            .then(() => {
                //合并文件路径和文件名
                let file_name = this.name + this.ext;
                this.file_url = this.dir_path + file_name;

                let exists_promise = new Promise((resolve,reject) => {
                    fs.exists(this.file_url,(exists) => {
                        if (!exists) {
                            // throw new Error(`不存在${file_name}`);
                            reject(file_name);
                        }
                        else {
                            resolve();

                        }
                    });
                });

                //文件存在则进行前缀替换和存入数据库homepage_img
                exists_promise
                    .then(() => {
                        // 声明的reg用于将文件路径的前缀替换成服务器地址
                        let reg = /(.+)\/myVps/,
                            httpProxy = "http://localhost:8080",
                            file_url;

                        file_url = this.file_url.replace(reg,httpProxy);
                        console.log(file_url);

                        //插入homepage_img数据库
                        insert(file_url);

                    },(file_name) => {
                        throw new Error(`不存在${file_name}`);
                    });

            },() => {
                throw new Error(`不存在${this.dir_path}`);
            });

    }
}

let insert = (file_url) => {
    let save_url_promise = new Promise((resolve,reject) => {
        let img_url = new homepage_img({
            url:file_url
        });

        img_url.save((err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log(`已保存:${file_url}`);
                resolve();
            }
        });

    });

    save_url_promise
        .then(() => {
            interrogator.name_rule();
            interrogator.get_file_path();
        },(err) => {
            throw err;
        })

};

//new一个img文件路径查询器
let interrogator = new Interrogator(homepage);

interrogator.get_file_path();

