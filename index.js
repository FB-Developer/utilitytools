var mongoxlsx = require('mongo-xlsx');
const _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
MongoClient.connect(url, function(err, client) {
  if(err)
    console.log("Error::"+err);
  else {
    console.log("Connected successfully to server");
    db=client.db('test1');
    insertDocument(db,()=>{
      client.close();
    })
  }
});

insertDocument=(db,cb)=>{
  var model = null;
  var xlsx  = './test.xlsx';
  mongoxlsx.xlsx2MongoData(xlsx, model, function(error, dt) {
    if(error)
      console.log('Error::'+error);
    else
    {
      console.log(dt);

      flist=[];
    for (var temp of dt) {
        var deptList=Object.keys(temp);
        for (dept of deptList) {
          flist.push({dept:dept,fname:temp[dept]});
        }
      }






      var collection=db.collection('facultydetails');
      collection.remove({},(error,result)=>{});
      const groupbyList=_.groupBy(flist,'dept');
      for (groupn of Object.keys(groupbyList)) {
        console.log(groupn);
        flist=[];
        for (gr of groupbyList[groupn]) {
          console.log(gr.fname);
          flist.push(gr.fname);
        }
        collection.insert({dept:groupn,facultylist:flist},(error,result)=>{
          cb(result);
      });
    }}
    cb();
  });
}
