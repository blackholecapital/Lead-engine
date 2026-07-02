const {execSync}=require("child_process");
exports.sh=c=>execSync(c,{encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim();
